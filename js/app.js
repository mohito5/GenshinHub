// app.js - оптимизированная версия
import { pageLayouts } from './page-layouts.js';
import { translations } from './translations.js';
import { ServerTimer } from './serverTimer.js';
import { charsData } from './characterData.js';
import { renderMiniCalendar } from './calendar.js';
import { renderCharacterCards, openCharacterModal, createFilterButton } from './list-char.js';
import { materialCategories, materialsInfo } from './materialsData.js';

let currentLang = 'ru';
let currentPageId = 'home';
let serverTimer = null;
let resizeTimer;
let originalSaveData = null;
let isSaveButtonDisabled = true;

// Применяет переводы к HTML
function applyTranslations(html, lang) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  tempDiv.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translatedText = translations[lang][key] || key;
    
    if (element.tagName === 'IMG') {
      element.alt = translatedText;
    } else {
      element.textContent = translatedText;
    }
  });

  return tempDiv.innerHTML;
}

// Локализация навигации
function localizeNavigation(lang) {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translatedText = translations[lang][key] || key;
    
    if (element.tagName === 'IMG') {
      element.alt = translatedText;
    } else {
      element.textContent = translatedText;
    }
  });
  
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const langCode = btn.getAttribute('data-lang');
    const langText = translations[lang][`nav.lang.${langCode}`] || langCode.toUpperCase();
    btn.textContent = langText;
    
    if (langCode === lang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function retranslateDynamicContent(lang) {
  // Переводим все элементы с data-i18n
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translatedText = translations[lang][key] || key;

    if (element.tagName === 'IMG') {
      element.alt = translatedText;
    } else {
      element.textContent = translatedText;
    }
  });

  // Если есть модальное окно — переводим его содержимое
  const modal = document.querySelector('.character-modal');
  if (modal) {
    modal.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translatedText = translations[lang][key] || key;
      el.textContent = translatedText;
    });
  }

  // Переводим элементы календаря, если есть
  const calendar = document.getElementById('mini-calendar');
  if (calendar) {
    renderMiniCalendar(calendar, new Date(), lang);
  }
  
  // Обновляем карточки персонажей без пересоздания
  if (currentPageId === 'characters') {
    updateCharacterCards(lang);
  }
  
  // Обновляем контент подстраниц персонажей
  if (currentPageId.startsWith('characters/')) {
    updateCharacterDetailPage(lang);
  }
}

// Обновляет карточки персонажей без пересоздания
function updateCharacterCards(lang) {
  const nameElements = document.querySelectorAll('.card-avatar .name p');
  nameElements.forEach(element => {
    const charKey = element.closest('.card-avatar').getAttribute('data-name');
    const charData = charsData[charKey];
    if (charData) {
      element.textContent = charData[`${lang}_name`] || charData.en_name;
    }
  });
}

// Обновляет детальную страницу персонажа
function updateCharacterDetailPage(lang) {
  const savedChar = localStorage.getItem('selectedCharacter');
  if (!savedChar) return;
  
  const { data } = JSON.parse(savedChar);
  
  // Обновляем имя персонажа на всех подстраницах
  const charNameElements = document.querySelectorAll('#mat-name, #info-name, #guide-name');
  charNameElements.forEach(el => {
    if (el.textContent) {
      el.textContent = data[`${lang}_name`] || data.en_name;
    }
  });
  
  // Обновляем аватарки
  const avatars = document.querySelectorAll('#mat-avatar, #info-avatar, #guide-avatar');
  avatars.forEach(avatar => {
    if (data.avatar && !avatar.src.includes(data.avatar)) {
      avatar.src = data.avatar;
      avatar.alt = data[`${lang}_name`] || data.en_name;
    }
  });
  
  // Обновляем описание на странице информации
  const bioElement = document.getElementById('info-bio');
  if (bioElement) {
    bioElement.textContent = data[`${lang}_bio`] || 'Описание отсутствует';
  }
}

function convertImgToSVG() {
  document.querySelectorAll('img.nav-icon').forEach(img => {
    const imgURL = img.src;
    fetch(imgURL)
      .then(response => response.text())
      .then(svgText => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgElement = svgDoc.querySelector('svg');

        if (svgElement) {
          svgElement.removeAttribute('fill');
          svgElement.classList.add('nav-icon');
          svgElement.style.fill = getComputedStyle(img).getPropertyValue('--electro');
          img.parentNode.replaceChild(svgElement, img);
        }
      })
      .catch(error => console.error('Error loading SVG:', error));
  });
}

function destroyServerTimer() {
  if (serverTimer) {
    serverTimer.destroy();
    serverTimer = null;
  }
}

function initServerTimer() {
  destroyServerTimer();
  serverTimer = new ServerTimer({
    containerId: 'server-timer-container',
    switchId: 'show-server-time',
    translations: translations,
    currentLang: currentLang
  });
  serverTimer.init();
}

function showPage(pageId) {
  console.log('showPage вызван:', pageId);
  const content = document.getElementById('content');

  // Очищаем флаги загрузки при переходе на новую страницу (кроме characters/mat)
  if (!pageId.startsWith('characters/mat')) {
    localStorage.removeItem('isLoadingFromProfile');
    localStorage.removeItem('isLoadingFromSave');
  }
  
  if (!content) return;
  
  currentPageId = pageId;

  if (pageLayouts[pageId]) {
    const layout = pageLayouts[pageId];
    const localizedHtml = applyTranslations(layout, currentLang);
    content.innerHTML = localizedHtml;
    
    // Инициализируем динамический контент после загрузки
    setTimeout(() => {
      initDynamicContent(pageId);
    }, 50);
  } else {
    content.innerHTML = `<h1>Страница не найдена</h1>`;
  }
  
  addBackButtonForSubpages(pageId);
  updateActiveNav();
  updateAfterImagesLoad();
}

// Инициализация динамического контента
function initDynamicContent(pageId) {
  // Календарь
  const calendar = document.getElementById('mini-calendar');
  if (calendar) {
    renderMiniCalendar(calendar, new Date(), currentLang);
  }
  
  checkBirthday();
  
  // Таймер сервера
  if (pageId === 'home' || pageId.startsWith('home/')) {
    if (serverTimer) destroyServerTimer();
    setTimeout(() => initServerTimer(), 100);
  } else {
    destroyServerTimer();
  }
  
  // Карточки персонажей
  if (pageId === 'characters') {
    setTimeout(() => {
      renderCharacterCards(currentLang);
      createFilterButton(currentLang);
    }, 100);
  } else {
    // Удаляем кнопку фильтра с других страниц
    const filterBtn = document.querySelector('.filter-button');
    if (filterBtn) {
      filterBtn.remove();
    }
  }
  
  // Подстраницы персонажей
  if (pageId.startsWith('characters/')) {
    // Обычные подстраницы (info, guide)
    if (pageId === 'characters/info' || pageId === 'characters/guide') {
      loadCharacterDetailPage(pageId);
    }
    // Страница материалов - особый случай
    else if (pageId === 'characters/mat') {
      // Сначала загружаем базовую разметку
      loadCharacterDetailPage(pageId);
      
      // Потом инициализируем скрипт материалов
      setTimeout(async () => {
        const savedChar = localStorage.getItem('selectedCharacter');
        if (savedChar) {
          const { data, lang } = JSON.parse(savedChar);
          try {
            await initMaterialsScript(data, lang);
            // Сохраняем исходные данные для сравнения
            setTimeout(() => {
              storeOriginalSaveData();
              // Устанавливаем обработчики для отслеживания изменений
              setupChangeTracking();
              // Проверяем и устанавливаем правильную кнопку
              checkAndSetupSaveButton(data, lang);
            }, 500);
          } catch (error) {
            console.error('Ошибка инициализации материалов:', error);
          }
        }
        // Удаляем флаги загрузки после инициализации
        const levelData = JSON.parse(localStorage.getItem('characterLevelData') || '{}');
        if (levelData.isFromLoad) {
          delete levelData.isFromLoad;
          localStorage.setItem('characterLevelData', JSON.stringify(levelData));
        }
    
        const charData = JSON.parse(localStorage.getItem('characterData') || '{}');
        if (charData.isFromLoad) {
          delete charData.isFromLoad;
          localStorage.setItem('characterData', JSON.stringify(charData));
        }
      }, 100);
      
    }
  }
  
  // Рендерим сохраненные материалы на странице профиля
  if (pageId === 'profile') {
    setTimeout(() => {
      renderSavedMaterials();
      // Добавляем кнопку обновления
    const container = document.getElementById('saved-materials-container');
    if (container) {
      const refreshBtn = document.createElement('button');
      refreshBtn.textContent = '🔄 Обновить список';
      refreshBtn.style.cssText = `
        background: #2196F3;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin: 20px auto;
        display: block;
      `;
      refreshBtn.onclick = () => {
        console.log('Ручное обновление списка сохранений');
        renderSavedMaterials();
      };
      
      container.parentNode.insertBefore(refreshBtn, container.nextSibling);
    }
    }, 100);
  }
}

// Функция для рендеринга сохраненных материалов - ИСПРАВЛЕННАЯ ВЕРСИЯ
function renderSavedMaterials() {
  console.log('=== RENDER SAVED MATERIALS START ===');
  const container = document.getElementById('saved-materials-container');
  console.log('Контейнер найден:', container ? 'Да' : 'Нет');
  if (!container) {
    console.error('❌ Контейнер saved-materials-container не найден!');
    console.log('Проверьте HTML структуру страницы profile');
    return;}
  
  const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  console.log('Сохранений в localStorage:', savedMaterials.length);
  
  console.log('Рендерим сохраненные материалы (исправленная версия):', savedMaterials);
  
  if (savedMaterials.length === 0) {
    container.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">Нет сохраненных материалов</p>';
    return;
  }
  
  // Правильные имена полей из saveMaterialsToProfile()
  container.innerHTML = savedMaterials.map((save, index) => `
    <div class="saved-material-card" data-save-id="${save.id || save.charKey + '_' + index}">
      <div class="saved-header">
        <img src="${save.characterAvatar || save.avatar || 'assets/default-avatar.png'}" 
             alt="${save.characterName || 'Персонаж'}" 
             style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;">
        <div class="saved-info">
          <h3>${save.characterName || 'Неизвестный персонаж'}</h3>
          <p style="color: #666; font-size: 14px;">${save.date || 'Дата не указана'}</p>
          <p style="color: #888; font-size: 12px;">
            Уровень: ${save.level || 1} | 
            Атака: ${save.attackLevel || 1} | 
            Навык: ${save.skillLevel || 1}
          </p>
        </div>
      </div>
      
      <div class="saved-actions">
        <button class="load-save-btn" data-index="${index}" 
                style="background: #4CAF50; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">
          Открыть
        </button>
        <button class="delete-save-btn" data-index="${index}" 
                style="background: #f44336; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">
          Удалить
        </button>
      </div>
    </div>
  `).join('');
  
  // Добавляем обработчики для кнопок
  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('load-save-btn')) {
      const index = parseInt(e.target.dataset.index);
      console.log('Загрузка сохранения с индексом:', index);
      loadSavedMaterials(index);
    }
    
    if (e.target.classList.contains('delete-save-btn')) {
      const index = parseInt(e.target.dataset.index);
      deleteSavedMaterials(index);
    }
  });
}

// Загрузка сохраненных материалов
function loadSavedMaterials(index) {
  const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  if (index >= 0 && index < savedMaterials.length) {
    const save = savedMaterials[index];
    
    console.log('Загрузка сохранения:', save);
    
    // Устанавливаем флаг, что это загрузка из профиля
    save.isFromProfile = true;
    
    // Сохраняем этот флаг для дальнейшего использования
    localStorage.setItem('isLoadingFromProfile', 'true');
    
    // Загружаем данные персонажа из сохранения
    const characterData = save.characterData?.fullCharacterData || save.characterData;
    
    if (characterData) {
      // Сохраняем персонажа в localStorage
      localStorage.setItem('selectedCharacter', JSON.stringify({
        key: save.charKey || characterData.key || 'Flins',
        data: characterData,
        lang: currentLang
      }));
      
      // Восстанавливаем настройки С userInputs И ФЛАГАМИ
      const savedLevelData = {
        charName: save.characterName,
        rangeVal: save.characterData?.rangeVal || 0,
        level: save.level,
        attackLevel: save.attackLevel,
        skillLevel: save.skillLevel,
        explosionLevel: save.explosionLevel,
        timestamp: Date.now(),
        characterData: characterData,
        isFromProfile: true,
        userInputs: save.userInputs || {}, // Важно: сохраняем userInputs
        loadedFromSave: true, // Добавляем флаг загрузки из сохранения
        isFromLoad: true // Добавляем флаг что это загрузка
      };
      
      localStorage.setItem('characterLevelData', JSON.stringify(savedLevelData));
      
      // Сохраняем отдельно для рендеринга
      localStorage.setItem('characterData', JSON.stringify({
        charName: save.characterName,
        charKey: save.charKey || characterData.key || 'Flins',
        rangeVal: save.characterData?.rangeVal || 0,
        level: save.level,
        attackLevel: save.attackLevel,
        skillLevel: save.skillLevel,
        explosionLevel: save.explosionLevel,
        lang: currentLang,
        fullCharacterData: characterData,
        isFromProfile: true,
        userInputs: save.userInputs || {}, // Сохраняем userInputs здесь тоже
        isFromLoad: true // Флаг загрузки
      }));
      
      console.log('Данные загружены из сохранения профиля:', savedLevelData);
      
      // Переходим на страницу материалов
      history.pushState({}, '', '#/characters/mat');
      showPage('characters/mat');
    } else {
      console.error('Нет данных персонажа в сохранении');
      alert('Ошибка: нет данных персонажа в сохранении');
    }
  }
}

// Восстановление введенных пользователем значений
function restoreUserInputs(userInputs) {
  console.log('Восстанавливаем userInputs:', userInputs);
  
  // Небольшая задержка чтобы DOM успел загрузиться
  setTimeout(() => {
    Object.entries(userInputs).forEach(([materialId, amount]) => {
      const inputId = `all_${materialId.replace(/\./g, '_')}`;
      const input = document.getElementById(inputId);
      if (input) {
        console.log(`Устанавливаем значение ${amount} для ${inputId}`);
        input.value = amount;
        // Триггерим событие input для обновления "Осталось"
        input.dispatchEvent(new Event('input'));
      } else {
        console.log(`Инпут не найден: ${inputId}`);
      }
    });
    
    // После восстановления проверяем изменения
    setTimeout(() => checkForChanges(), 100);
  }, 800); // Увеличена задержка для гарантии загрузки DOM
}

// Функция для принудительного обновления профиля
function forceRefreshProfile() {
  if (currentPageId === 'profile') {
    console.log('Принудительное обновление профиля...');
    setTimeout(() => {
      renderSavedMaterials();
    }, 100);
  }
}

// Удаление сохранения
function deleteSavedMaterials(index) {
  const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  if (index >= 0 && index < savedMaterials.length) {
    savedMaterials.splice(index, 1);
    localStorage.setItem('savedMaterials', JSON.stringify(savedMaterials));
    renderSavedMaterials();
  }
}

function addBackButtonForSubpages(pageId) {
  const navTopBar = document.querySelector('.nav-top-bar');
  if (!navTopBar) return;
  
  // Удаляем существующую кнопку "Назад"
  const existingBackBtn = document.querySelector('.back-button');
  if (existingBackBtn) {
    existingBackBtn.remove();
  }
  
  // Проверяем, находимся ли мы на подстранице персонажа
  if (pageId.startsWith('characters/') && pageId !== 'characters') {
    const backBtn = document.createElement('button');
    backBtn.className = 'back-button';
    backBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      <span>Назад к персонажам</span>
    `;
    
    backBtn.style.cssText = `
      background: linear-gradient(135deg, var(--light) 0%, #6c757d 100%);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      transition: all 0.3s ease;
      z-index: 100;
    `;
    
    backBtn.addEventListener('mouseenter', () => {
      backBtn.style.background = 'linear-gradient(135deg, #495057, #343a40)';
      backBtn.style.transform = 'scale(1.05)';
    });
    
    backBtn.addEventListener('mouseleave', () => {
      backBtn.style.background = 'linear-gradient(135deg, var(--light), #6c757d)';
      backBtn.style.transform = 'scale(1)';
    });
    
    backBtn.addEventListener('click', () => {
      history.pushState({}, '', '#/characters');
      showPage('characters');
    });
    
    // Добавляем кнопку в левую часть nav-top-bar
    const navLeftArea = navTopBar.querySelector('.nav-left-area');
    if (navLeftArea) {
      // Добавляем "Назад" перед "Фильтром"
      const filterBtn = navLeftArea.querySelector('.filter-button');
      if (filterBtn) {
        navLeftArea.insertBefore(backBtn, filterBtn);
      } else {
        navLeftArea.appendChild(backBtn);
      }
    } else {
      // Создаем nav-left-area, если его нет
      const leftArea = document.createElement('div');
      leftArea.className = 'nav-left-area';
      leftArea.style.cssText = 'display: flex; align-items: center; gap: 10px;';
      leftArea.appendChild(backBtn);
      
      // Вставляем перед language-switcher
      const langSwitcher = navTopBar.querySelector('.language-switcher');
      if (langSwitcher) {
        navTopBar.insertBefore(leftArea, langSwitcher);
      } else {
        navTopBar.appendChild(leftArea);
      }
    }
  } else {
    // На странице персонажей удаляем кнопку "Назад", если она есть
    const backBtn = document.querySelector('.back-button');
    if (backBtn) {
      backBtn.remove();
    }
  }
}

// Функция для загрузки детальной страницы персонажа
async function loadCharacterDetailPage(pageId) {
  const savedChar = localStorage.getItem('selectedCharacter');
  if (!savedChar) return;
  
  const { data, lang } = JSON.parse(savedChar);
  
  // Заполняем данные в существующую разметку
  fillCharacterDetailData(pageId, data, lang);
}

// Функция для инициализации скрипта материалов
function initMaterialsScript(character, lang) {
  console.log('=== ИНИЦИАЛИЗАЦИЯ СКРИПТА МАТЕРИАЛОВ ===');
  
  // Проверяем, загружаем ли мы из профиля
  const isLoadingFromProfile = localStorage.getItem('isLoadingFromProfile') === 'true';
  
  // Загружаем данные
  const levelData = JSON.parse(localStorage.getItem('characterLevelData') || '{}');
  
  // Если есть флаг loadedFromSave, значит нужно загрузить данные из сохранения
  if (levelData.loadedFromSave) {
    console.log('Загружаем данные из сохранения с флагом loadedFromSave');
    
    // Убираем флаг, чтобы не загружать повторно
    delete levelData.loadedFromSave;
    localStorage.setItem('characterLevelData', JSON.stringify(levelData));
    
    // Продолжаем с этими данными
    continueInit(character, lang, levelData);
  } else {
    // Обычная загрузка данных
    continueInit(character, lang, levelData);
  }
  
  function continueInit(character, lang, levelData) {
    // Функция для получения реального уровня из диапазона
    const getRealLevel = (rangeVal) => {
      const val = parseInt(rangeVal) || 0;
      if (val >= 70) return 90;
      else if (val >= 60) return 80;
      else if (val >= 50) return 70;
      else if (val >= 40) return 60;
      else if (val >= 30) return 50;
      else if (val >= 20) return 40;
      else if (val >= 10) return 20;
      else return 1;
    };
    
    const realLevel = getRealLevel(levelData.rangeVal || 0);
    
    // Сохраняем данные для скрипта в localStorage
    localStorage.setItem('characterData', JSON.stringify({
      charName: character.en_name,
      charKey: character.key,
      rangeVal: levelData.rangeVal || 0,
      realLevel: realLevel,
      level: realLevel,
      attackLevel: levelData.attackLevel || 1,
      skillLevel: levelData.skillLevel || 1,
      explosionLevel: levelData.explosionLevel || 1,
      lang: lang,
      fullCharacterData: character,
      // Сохраняем userInputs если есть
      userInputs: levelData.userInputs || {}
    }));
    
    // Запускаем скрипт
    setTimeout(() => {
      renderMaterialsPage();
    }, 100);
  }
}

// Функция для рендеринга страницы материалов
function renderMaterialsPage() {
  console.log('=== RENDER MATERIALS PAGE - НАЧАЛО ===');
  
  // Сначала скрываем контент, пока идет инициализация
  const contentSections = document.querySelectorAll('section.level, section.mat-attack, section.mat-skill, section.mat-explosion, section.all');
  contentSections.forEach(section => {
    section.style.display = 'none';
  });
  
  // Показываем индикатор загрузки
  const loadingIndicator = document.createElement('div');
  loadingIndicator.id = 'materials-loading';
  loadingIndicator.innerHTML = '<p>Загрузка материалов...</p>';
  loadingIndicator.style.cssText = 'text-align: center; padding: 50px; font-size: 18px;';
  
  const mainContent = document.querySelector('.characters.sec');
  if (mainContent) {
    mainContent.appendChild(loadingIndicator);
  }
  
  // Задержка для демонстрации (можно убрать)
  setTimeout(() => {
    // Убираем индикатор загрузки
    if (loadingIndicator) loadingIndicator.remove();
    
    // Показываем контент
    contentSections.forEach(section => {
      section.style.display = 'block';
    });
    
    // Далее обычная логика рендеринга...
    // Если нет selectedCharacter, пытаемся восстановить из characterData
    if (!localStorage.getItem('selectedCharacter') && localStorage.getItem('characterData')) {
      try {
        const charData = JSON.parse(localStorage.getItem('characterData'));
        if (charData.fullCharacterData) {
          console.log('Восстанавливаем персонажа из characterData');
          localStorage.setItem('selectedCharacter', JSON.stringify({
            key: charData.charKey || 'Flins',
            data: charData.fullCharacterData,
            lang: charData.lang || currentLang
          }));
        }
      } catch (error) {
        console.error('Ошибка восстановления персонажа:', error);
      }
    }
    
    // Проверяем и загружаем данные
    const levelData = checkAndLoadCharacterData();
    console.log('Загруженные данные уровня:', levelData);
    
    // Получаем данные персонажа
    const savedChar = localStorage.getItem('selectedCharacter');
    let charData = null;
    
    if (savedChar) {
      try {
        const parsedChar = JSON.parse(savedChar);
        charData = parsedChar.data;
        console.log('Данные персонажа:', charData);
      } catch (error) {
        console.error('Ошибка парсинга данных персонажа:', error);
      }
    }
    
    if (!charData) {
      console.error("Нет данных персонажа");
      showErrorMessage("Нет данных персонажа. Пожалуйста, вернитесь и выберите персонажа снова.");
      return;
    }
    
    // Обновляем основную информацию
    const charIconDiv = document.getElementById('char-icon');
    const charNameH1 = document.getElementById('char-name');
    
    if (charIconDiv && charData.avatar) {
      charIconDiv.innerHTML = `<img src="${charData.avatar}" alt="${charData.ru_name || charData.en_name}">`;
    }
    
    if (charNameH1) {
      charNameH1.textContent = charData.ru_name || charData.en_name;
    }
    
    // Получаем реальный уровень из диапазона
    const getRealLevel = (rangeVal) => {
      const val = parseInt(rangeVal) || 0;
      if (val >= 70) return 90;
      else if (val >= 60) return 80;
      else if (val >= 50) return 70;
      else if (val >= 40) return 60;
      else if (val >= 30) return 50;
      else if (val >= 20) return 40;
      else if (val >= 10) return 20;
      else return 1;
    };
    
    const realLevel = getRealLevel(levelData.rangeVal || 0);
    
    // Обновляем уровни
    const levelElements = [
      { id: 'lvl', value: realLevel },
      { id: 'lvl-attack', value: levelData.attackLevel || 1 },
      { id: 'lvl-skill', value: levelData.skillLevel || 1 },
      { id: 'lvl-explosion', value: levelData.explosionLevel || 1 }
    ];
    
    levelElements.forEach(({ id, value }) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
        console.log(`Установлен уровень ${id}: ${value}`);
      }
    });
    
    // Рендерим материалы
    console.log('Рендерим материалы для уровня:', realLevel);
    renderRealMaterials({
      rangeVal: levelData.rangeVal || 0,
      level: realLevel,
      attackLevel: levelData.attackLevel || 1,
      skillLevel: levelData.skillLevel || 1,
      explosionLevel: levelData.explosionLevel || 1
    }, charData);
    
    // В конце рендеринга добавляем контейнер для кнопки сохранения
    setTimeout(() => {
      // Получаем данные персонажа
      const savedChar = localStorage.getItem('selectedCharacter');
      if (savedChar) {
        try {
          const { data } = JSON.parse(savedChar);
          checkAndSetupSaveButton(data, currentLang);
          forceUpdateSaveButton();
        } catch (error) {
          console.error('Ошибка при получении данных персонажа:', error);
        }
      }
      
      // Восстанавливаем введенные пользователем значения, если они есть
      setTimeout(() => {
        const charData = JSON.parse(localStorage.getItem('characterData') || '{}');
        if (charData.userInputs && Object.keys(charData.userInputs).length > 0) {
          console.log('Восстанавливаем сохраненные вводы:', charData.userInputs);
          restoreUserInputs(charData.userInputs);
        }
      
    }, 100);
    // После восстановления значений проверяем изменения
      setTimeout(() => {
        checkForChanges();
      }, 800);
    }, 500);
  }, 100);
    console.log('=== RENDER MATERIALS PAGE - КОНЕЦ ===');
  
}

// Функция для сохранения исходных данных при загрузке страницы
function storeOriginalSaveData() {
  console.log('storeOriginalSaveData вызвана');
  
  const savedChar = localStorage.getItem('selectedCharacter');
  if (!savedChar) return;
  
  const { data } = JSON.parse(savedChar);
  const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  
  // Проверяем, загружены ли данные из профиля или из сохранения
  const levelData = JSON.parse(localStorage.getItem('characterLevelData') || '{}');
  const charData = JSON.parse(localStorage.getItem('characterData') || '{}');
  
  const isFromLoad = levelData.isFromLoad === true || charData.isFromLoad === true;
  const isFromProfile = levelData.isFromProfile === true || charData.isFromProfile === true;
  
  // Ищем сохранение для текущего персонажа
  const existingSave = savedMaterials.find(save => save.charKey === data.key);
  
  // Ждем немного чтобы DOM успел загрузиться
  setTimeout(() => {
    // Собираем текущие данные из DOM
    const currentInputs = {};
    const inputElements = document.querySelectorAll('.all .materials-container input[type="number"]');
    
    inputElements.forEach(input => {
      const value = parseInt(input.value) || 0;
      const materialId = input.id.replace('all_', '').replace(/_/g, '.');
      currentInputs[materialId] = value;
    });
    
    // Собираем текущие уровни из DOM
    const currentLevels = {};
    
    // Уровень персонажа
    const charLevelElement = document.getElementById('lvl');
    if (charLevelElement) {
      currentLevels.level = parseInt(charLevelElement.textContent) || 1;
    }
    
    // Уровни талантов
    const levelSpans = document.querySelectorAll('.section .level-value');
    if (levelSpans.length >= 3) {
      currentLevels.attackLevel = parseInt(levelSpans[0].textContent) || 1;
      currentLevels.skillLevel = parseInt(levelSpans[1].textContent) || 1;
      currentLevels.explosionLevel = parseInt(levelSpans[2].textContent) || 1;
    }
    
    // Слайдер
    const rangeSlider = document.getElementById('range');
    if (rangeSlider) {
      currentLevels.rangeVal = parseInt(rangeSlider.value) || 0;
    }
    
    if (existingSave && (isFromLoad || isFromProfile)) {
      // Если данные загружены из сохранения или профиля
      const storedData = localStorage.getItem('characterData');
      const levelData = localStorage.getItem('characterLevelData');
      
      let parsedData, parsedLevelData;
      
      if (storedData) {
        try {
          parsedData = JSON.parse(storedData);
        } catch (error) {
          console.error('Ошибка парсинга characterData:', error);
        }
      }
      
      if (levelData) {
        try {
          parsedLevelData = JSON.parse(levelData);
        } catch (error) {
          console.error('Ошибка парсинга characterLevelData:', error);
        }
      }
      
      // Используем загруженные данные как исходные
      originalSaveData = {
        levels: {
          rangeVal: parsedData?.rangeVal || parsedLevelData?.rangeVal || currentLevels.rangeVal || 0,
          level: parsedData?.level || parsedLevelData?.level || currentLevels.level || 1,
          attackLevel: parsedData?.attackLevel || parsedLevelData?.attackLevel || currentLevels.attackLevel || 1,
          skillLevel: parsedData?.skillLevel || parsedLevelData?.skillLevel || currentLevels.skillLevel || 1,
          explosionLevel: parsedData?.explosionLevel || parsedLevelData?.explosionLevel || currentLevels.explosionLevel || 1
        },
        inputs: parsedData?.userInputs || parsedLevelData?.userInputs || currentInputs
      };
      
      console.log('Исходные данные загружены из сохранения:', originalSaveData);
    } else {
      // Новое сохранение или новая страница - сохраняем текущие данные как исходные
      originalSaveData = {
        levels: {
          rangeVal: currentLevels.rangeVal || 0,
          level: currentLevels.level || 1,
          attackLevel: currentLevels.attackLevel || 1,
          skillLevel: currentLevels.skillLevel || 1,
          explosionLevel: currentLevels.explosionLevel || 1
        },
        inputs: currentInputs
      };
      
      console.log('Исходные данные для новой страницы:', originalSaveData);
    }
  }, 300); // Небольшая задержка чтобы DOM успел загрузиться
}


// Функция для настройки отслеживания изменений
// Обновляем setupChangeTracking чтобы отслеживать ВСЕ изменения
function setupChangeTracking() {
  console.log('setupChangeTracking вызвана');
  
  // Отслеживаем изменения в полях ввода материалов
  const inputElements = document.querySelectorAll('.all .materials-container input[type="number"]');
  console.log('Найдено полей ввода материалов:', inputElements.length);
  
  inputElements.forEach(input => {
    input.addEventListener('input', () => {
      console.log('Изменение в поле ввода материала:', input.id, input.value);
      checkForChanges();
    });
  });
  
  // Отслеживаем изменения уровней через кнопки
  const levelButtons = document.querySelectorAll('.level-group button, .arrow');
  console.log('Найдено кнопок изменения уровня:', levelButtons.length);
  
  levelButtons.forEach(button => {
    button.addEventListener('click', () => {
      console.log('Изменение уровня через кнопку');
      setTimeout(() => checkForChanges(), 50);
    });
  });
  
  // Отслеживаем изменения слайдера
  const rangeSlider = document.getElementById('range');
  if (rangeSlider) {
    rangeSlider.addEventListener('input', () => {
      console.log('Изменение слайдера:', rangeSlider.value);
      setTimeout(() => checkForChanges(), 50);
    });
  }
  
  // Отслеживаем изменения через кнопки слайдера
  const minusRangeBtn = document.getElementById('minus-range');
  const plusRangeBtn = document.getElementById('plus-range');
  
  if (minusRangeBtn) {
    minusRangeBtn.addEventListener('click', () => {
      console.log('Кнопка минус слайдера');
      setTimeout(() => checkForChanges(), 50);
    });
  }
  
  if (plusRangeBtn) {
    plusRangeBtn.addEventListener('click', () => {
      console.log('Кнопка плюс слайдера');
      setTimeout(() => checkForChanges(), 50);
    });
  }
  
  // Первоначальная проверка через секунду (после полной загрузки DOM)
  setTimeout(() => {
    console.log('Первоначальная проверка изменений');
    checkForChanges();
  }, 1000);
}

// Функция для проверки, были ли изменения
function checkForChanges() {
  console.log('=== checkForChanges вызвана ===');
  
  const saveBtn = document.getElementById('save-materials-btn');
  const updateBtn = document.getElementById('update-materials-btn');
  const overwriteBtn = document.getElementById('overwrite-materials-btn');
  
  const button = saveBtn || updateBtn || overwriteBtn;
  
  if (!button) {
    console.log('Кнопки не найдены, выходим');
    return;
  }
  
  // Если есть кнопка "Сохранить" - она всегда активна, не проверяем
  if (saveBtn) {
    console.log('Есть кнопка "Сохранить" - она всегда активна');
    return;
  }
  
  // 1. Проверяем изменения в полях ввода материалов
  const currentInputs = {};
  const inputElements = document.querySelectorAll('.all .materials-container input[type="number"]');
  
  inputElements.forEach(input => {
    const value = parseInt(input.value) || 0;
    const materialId = input.id.replace('all_', '').replace(/_/g, '.');
    currentInputs[materialId] = value;
  });
  
  // 2. Проверяем изменения уровней (если есть элементы для отображения уровней)
  const currentLevels = {};
  
  // Уровень персонажа
  const charLevelElement = document.getElementById('lvl');
  if (charLevelElement) {
    currentLevels.charLevel = parseInt(charLevelElement.textContent) || 1;
  }
  
  // Уровни талантов
  const levelSpans = document.querySelectorAll('.section .level-value');
  if (levelSpans.length >= 3) {
    currentLevels.attackLevel = parseInt(levelSpans[0].textContent) || 1;
    currentLevels.skillLevel = parseInt(levelSpans[1].textContent) || 1;
    currentLevels.explosionLevel = parseInt(levelSpans[2].textContent) || 1;
  }
  
  // 3. Проверяем слайдер (range value)
  const rangeSlider = document.getElementById('range');
  if (rangeSlider) {
    currentLevels.rangeVal = parseInt(rangeSlider.value) || 0;
  }
  
  console.log('Текущие данные:', {
    inputs: currentInputs,
    levels: currentLevels
  });
  
  console.log('Исходные данные:', originalSaveData);
  
  // Проверяем изменения во введенных данных
  const hasInputChanges = !originalSaveData || 
    JSON.stringify(currentInputs) !== JSON.stringify(originalSaveData.inputs);
  
  // Проверяем изменения в уровнях
  const hasLevelChanges = !originalSaveData?.levels ||
    currentLevels.charLevel !== originalSaveData.levels.level ||
    currentLevels.attackLevel !== originalSaveData.levels.attackLevel ||
    currentLevels.skillLevel !== originalSaveData.levels.skillLevel ||
    currentLevels.explosionLevel !== originalSaveData.levels.explosionLevel ||
    currentLevels.rangeVal !== originalSaveData.levels.rangeVal;
  
  const hasChanges = hasInputChanges || hasLevelChanges;
  
  console.log('Есть изменения:', {
    hasInputChanges,
    hasLevelChanges,
    total: hasChanges
  });
  
  // Обновляем состояние кнопки
  button.disabled = !hasChanges;
  button.style.opacity = hasChanges ? '1' : '0.5';
  button.style.cursor = hasChanges ? 'pointer' : 'not-allowed';
  
  console.log('Состояние кнопки обновлено:', {
    id: button.id,
    disabled: button.disabled,
    opacity: button.style.opacity
  });
}

// Функция для проверки и настройки кнопки сохранения/обновления
// Обновляем функцию checkAndSetupSaveButton
function checkAndSetupSaveButton(character, lang) {
  console.log('checkAndSetupSaveButton вызвана');
  
  // Сначала удаляем все существующие контейнеры с кнопками
  document.querySelectorAll('.save-button-container').forEach(container => {
    container.remove();
  });
  
  // Находим или создаем контейнер для кнопки
  let buttonContainer = document.querySelector('.save-button-container');
  if (!buttonContainer) {
    buttonContainer = document.createElement('div');
    buttonContainer.className = 'save-button-container';
    buttonContainer.style.cssText = `
      display: flex;
      justify-content: center;
      margin: 30px 0;
      padding: 20px;
    `;
    
    // Ищем место для вставки - обычно после контейнера с материалами
    const allSection = document.querySelector('section.all');
    if (allSection) {
      allSection.appendChild(buttonContainer);
    } else {
      const content = document.querySelector('.characters.sec');
      if (content) {
        content.appendChild(buttonContainer);
      }
    }
  }
  
  // Очищаем контейнер
  buttonContainer.innerHTML = '';
  
  // Проверяем, есть ли уже сохранение для этого персонажа
  const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  const existingSave = savedMaterials.find(save => save.charKey === character.key);
  
  // Проверяем, загружены ли данные из профиля
  const levelData = JSON.parse(localStorage.getItem('characterLevelData') || '{}');
  const charData = JSON.parse(localStorage.getItem('characterData') || '{}');
  
  const isFromLoad = levelData.isFromLoad === true || charData.isFromLoad === true;
  const isFromProfile = levelData.isFromProfile === true || charData.isFromProfile === true;
  
  console.log('Состояние сохранения:', {
    existingSave: !!existingSave,
    isFromLoad,
    isFromProfile,
    levelData: levelData,
    charData: charData
  });
  
  // Создаем кнопку в зависимости от ситуации
  if (!existingSave) {
    // НЕТ СОХРАНЕНИЯ: создаем кнопку "Сохранить" (активную)
    createSaveButton(buttonContainer, character, lang);
  } else if (isFromLoad || isFromProfile) {
    // СУЩЕСТВУЕТ СОХРАНЕНИЕ И ЗАГРУЖЕНО ИЗ ПРОФИЛЯ/ИЗ СОХРАНЕНИЯ: кнопка "Обновить"
    createUpdateButton(buttonContainer, character, lang, true);
  } else {
    // СУЩЕСТВУЕТ СОХРАНЕНИЕ И СОЗДАНА НОВАЯ СТРАНИЦА: кнопка "Перезаписать"
    createUpdateButton(buttonContainer, character, lang, false);
  }
  
  // Сохраняем исходные данные
  storeOriginalSaveData();
  
  // Настраиваем отслеживание изменений
  setupChangeTracking();
}

// Функция создания кнопки "Сохранить" (для новых сохранений)
function createSaveButton(container, character, lang, isDisabled = false) {
  console.log('Создаем кнопку "Сохранить"');
  
  const saveButton = document.createElement('button');
  saveButton.id = 'save-materials-btn';
  saveButton.className = 'save-btn primary';
  saveButton.disabled = false;
  
  saveButton.style.cssText = `
    background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: ${isDisabled ? 'not-allowed' : 'pointer'};
    display: flex;
    align-items: center;
    gap: 10px;
    opacity: ${isDisabled ? '0.5' : '1'};
    transition: all 0.3s ease;
  `;
  
  saveButton.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
      <polyline points="17 21 17 13 7 13 7 21"/>
      <polyline points="7 3 7 8 15 8"/>
    </svg>
    <span>Сохранить</span>
  `;
  
  saveButton.addEventListener('click', () => {
    console.log('Кнопка "Сохранить" нажата');
    saveMaterialsToProfile(character, lang);
  });
  
  // Добавляем hover эффекты
  saveButton.addEventListener('mouseenter', () => {
    if (!saveButton.disabled) {
      saveButton.style.transform = 'scale(1.05)';
      saveButton.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    }
  });
  
  saveButton.addEventListener('mouseleave', () => {
    if (!saveButton.disabled) {
      saveButton.style.transform = 'scale(1)';
      saveButton.style.boxShadow = 'none';
    }
  });
  
  container.appendChild(saveButton);
}
// Функция создания кнопки "Обновить"/"Перезаписать"
function createUpdateButton(container, character, lang, isUpdate = false) {
  const buttonType = isUpdate ? 'Обновить' : 'Перезаписать';
  console.log(`Создаем кнопку "${buttonType}", isUpdate: ${isUpdate}`);
  
  const updateButton = document.createElement('button');
  updateButton.id = isUpdate ? 'update-materials-btn' : 'overwrite-materials-btn';
  updateButton.className = isUpdate ? 'save-btn update' : 'save-btn overwrite';
  updateButton.disabled = true; // Изначально отключена
  
  const gradient = isUpdate 
    ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' 
    : 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)';
  
  updateButton.style.cssText = `
    background: ${gradient};
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: not-allowed;
    display: flex;
    align-items: center;
    gap: 10px;
    opacity: 0.5;
    transition: all 0.3s ease;
  `;
  
  const iconSvg = isUpdate ? `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
      <path d="M12 7v6l3 3"/>
    </svg>
  ` : `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
      <path d="M12 7v6l3 3"/>
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  `;
  
  updateButton.innerHTML = `${iconSvg}<span>${buttonType}</span>`;
  
  updateButton.addEventListener('click', () => {
    console.log(`Кнопка "${buttonType}" нажата, isUpdate: ${isUpdate}`);
    if (!updateButton.disabled) {
      if (isUpdate) {
        // Для кнопки "Обновить" - просто обновляем сохранение
        updateExistingSave(character, lang);
      } else {
        // Для кнопки "Перезаписать" - показываем окно подтверждения
        const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
        const existingSave = savedMaterials.find(save => save.charKey === character.key);
        
        if (existingSave) {
          showOverwriteConfirm(character, lang, existingSave);
        }
      }
    }
  });
  
  // ... hover эффекты ...
  
  container.appendChild(updateButton);
}

// Добавляем функцию для принудительного обновления кнопки при загрузке страницы
function forceUpdateSaveButton() {
  console.log('Принудительное обновление кнопки сохранения');
  setTimeout(() => {
    // Находим текущего персонажа
    const savedChar = localStorage.getItem('selectedCharacter');
    if (savedChar) {
      try {
        const { data } = JSON.parse(savedChar);
        // Сохраняем исходные данные
        storeOriginalSaveData();
        // Проверяем изменения
        setTimeout(() => {
          checkForChanges();
        }, 500);
      } catch (error) {
        console.error('Ошибка при получении данных персонажа:', error);
      }
    }
  }, 1500);
}
// Функция показа окна подтверждения перезаписи
function showOverwriteConfirm(character, lang, existingSave) {
  const modal = document.createElement('div');
  modal.className = 'overwrite-confirm-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;
  
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: white;
    padding: 30px;
    border-radius: 15px;
    max-width: 500px;
    width: 90%;
    text-align: center;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  `;
  
  const saveDate = new Date(existingSave.lastModified || existingSave.date).toLocaleString();
  const hasUserInputs = Object.keys(existingSave.userInputs || {}).length > 0;
  
  modalContent.innerHTML = `
    <div style="margin-bottom: 20px;">
      <div style="font-size: 48px; color: #FF9800; margin-bottom: 10px;">⚠️</div>
      <h3 style="color: #333; margin-bottom: 10px; font-size: 20px;">Перезаписать сохранение?</h3>
    </div>
    
    <div style="text-align: left; margin-bottom: 25px;">
      <p style="color: #666; margin-bottom: 8px;">
        Для <strong style="color: #333;">${existingSave.characterName}</strong> уже есть сохранение:
      </p>
      
      <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin: 10px 0; border-left: 4px solid #FF9800;">
        <p style="margin: 5px 0; color: #555;">
          <span style="display: inline-block; width: 100px; color: #777;">Дата:</span>
          <strong>${saveDate}</strong>
        </p>
        <p style="margin: 5px 0; color: #555;">
          <span style="display: inline-block; width: 100px; color: #777;">Уровень:</span>
          ${existingSave.level}
        </p>
        <p style="margin: 5px 0; color: #555;">
          <span style="display: inline-block; width: 100px; color: #777;">Таланты:</span>
          ${existingSave.attackLevel}/${existingSave.skillLevel}/${existingSave.explosionLevel}
        </p>
        ${hasUserInputs ? 
          `<p style="margin: 5px 0; color: #555;">
            <span style="display: inline-block; width: 100px; color: #777;">Материалы:</span>
            ${Object.keys(existingSave.userInputs).length} шт.
          </p>` : ''}
      </div>
      
      <p style="color: #666; font-size: 14px; margin-top: 15px; padding: 10px; background: #fff8e1; border-radius: 5px;">
        Старое сохранение будет <strong>безвозвратно удалено</strong> и заменено новым.
      </p>
    </div>
    
    <div style="display: flex; gap: 15px; justify-content: center; margin-top: 25px;">
      <button id="option-cancel" style="
        padding: 12px 30px;
        background: #6c757d;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        flex: 1;
        transition: all 0.3s ease;
      ">Отмена</button>
      <button id="option-overwrite" style="
        padding: 12px 30px;
        background: #FF9800;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        flex: 1;
        transition: all 0.3s ease;
      ">Перезаписать</button>
    </div>
  `;
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  // Добавляем hover эффекты для кнопок
  const cancelBtn = modalContent.querySelector('#option-cancel');
  const overwriteBtn = modalContent.querySelector('#option-overwrite');
  
  cancelBtn.addEventListener('mouseenter', () => {
    cancelBtn.style.background = '#5a6268';
    cancelBtn.style.transform = 'scale(1.02)';
  });
  
  cancelBtn.addEventListener('mouseleave', () => {
    cancelBtn.style.background = '#6c757d';
    cancelBtn.style.transform = 'scale(1)';
  });
  
  overwriteBtn.addEventListener('mouseenter', () => {
    overwriteBtn.style.background = '#F57C00';
    overwriteBtn.style.transform = 'scale(1.02)';
  });
  
  overwriteBtn.addEventListener('mouseleave', () => {
    overwriteBtn.style.background = '#FF9800';
    overwriteBtn.style.transform = 'scale(1)';
  });
  
  // Обработчики кнопок
  cancelBtn.addEventListener('click', () => {
    modal.remove();
  });
  
  overwriteBtn.addEventListener('click', () => {
    modal.remove();
    // Перезаписываем сохранение - после этого должно быть "Обновить"
    updateExistingSave(character, lang);
  });
  
  // Закрытие при клике вне окна
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
  
  // Закрытие по клавише Esc
  document.addEventListener('keydown', function closeOnEsc(e) {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', closeOnEsc);
    }
  });
}
// Обновляем функцию обновления существующего сохранения
function updateExistingSave(character, lang) {
  console.log('updateExistingSave вызвана');
  
  // Получаем текущие данные
  const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  const existingSaveIndex = savedMaterials.findIndex(save => save.charKey === character.key);
  
  if (existingSaveIndex === -1) {
    // Если почему-то сохранения нет, сохраняем как новое
    saveMaterialsToProfile(character, lang);
    return;
  }
  
  // Собираем текущие данные
  const storedData = localStorage.getItem('characterData');
  const levelData = localStorage.getItem('characterLevelData');
  
  let data, levelDataObj;
  
  if (storedData) {
    try {
      data = JSON.parse(storedData);
    } catch (error) {
      console.error('Ошибка парсинга characterData:', error);
    }
  }
  
  if (levelData) {
    try {
      levelDataObj = JSON.parse(levelData);
    } catch (error) {
      console.error('Ошибка парсинга characterLevelData:', error);
    }
  }
  
  const charName = character[`${lang}_name`] || character.en_name;
  const charKey = character.key || 'Flins';
  
  // Собираем введенные пользователем значения
  const userInputs = {};
  const inputElements = document.querySelectorAll('.all .materials-container input[type="number"]');
  
  inputElements.forEach(input => {
    const value = parseInt(input.value) || 0;
    const materialId = input.id.replace('all_', '').replace(/_/g, '.');
    userInputs[materialId] = value;
  });
  
  // Сохраняем старые данные для истории
  const oldSave = savedMaterials[existingSaveIndex];
  
  // Обновляем существующее сохранение
  savedMaterials[existingSaveIndex] = {
    ...savedMaterials[existingSaveIndex],
    characterName: charName,
    characterAvatar: character.avatar,
    date: new Date().toLocaleString(),
    lastModified: Date.now(),
    level: data?.level || levelDataObj?.level || 1,
    attackLevel: data?.attackLevel || levelDataObj?.attackLevel || 1,
    skillLevel: data?.skillLevel || levelDataObj?.skillLevel || 1,
    explosionLevel: data?.explosionLevel || levelDataObj?.explosionLevel || 1,
    userInputs: userInputs,
    characterData: {
      rangeVal: data?.rangeVal || levelDataObj?.rangeVal || 0,
      fullCharacterData: character
    },
    // Сохраняем историю изменений
    history: [...(oldSave.history || []), {
      date: oldSave.date,
      level: oldSave.level,
      attackLevel: oldSave.attackLevel,
      skillLevel: oldSave.skillLevel,
      explosionLevel: oldSave.explosionLevel,
      materialsCount: Object.keys(oldSave.userInputs || {}).length
    }].slice(-5) // Храним последние 5 версий
  };
  
  localStorage.setItem('savedMaterials', JSON.stringify(savedMaterials));
  
  // Обновляем исходные данные
  storeOriginalSaveData();
  
  // Обновляем characterData чтобы добавить userInputs
  const currentCharData = JSON.parse(localStorage.getItem('characterData') || '{}');
  currentCharData.userInputs = userInputs;
  // Устанавливаем флаг, что это теперь не новая страница, а загруженное сохранение
  currentCharData.isFromLoad = true;
  localStorage.setItem('characterData', JSON.stringify(currentCharData));
  
  // Также обновляем characterLevelData
  const currentLevelData = JSON.parse(localStorage.getItem('characterLevelData') || '{}');
  currentLevelData.userInputs = userInputs;
  currentLevelData.isFromLoad = true;
  localStorage.setItem('characterLevelData', JSON.stringify(currentLevelData));
  
  // После обновления/перезаписи должна быть кнопка "Обновить" (зеленая)
  checkAndSetupSaveButton(character, lang);
  
  // Показываем уведомление об успешном обновлении
  showSaveNotification('Сохранение обновлено!', 'success');
  
  console.log('Сохранение обновлено для персонажа:', charName);
}

// Функция показа уведомления
function showSaveNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `save-notification ${type}`;
  notification.textContent = message;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 24px;
    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Добавляем CSS для анимации
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Удаляем уведомление через 3 секунды
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Обновляем функцию saveMaterialsToProfile
function saveMaterialsToProfile(character, lang) {
  console.log('=== СОХРАНЕНИЕ НАЧАЛО ===');
  console.log('Персонаж:', character);
  console.log('Язык:', lang);
  
  const storedData = localStorage.getItem('characterData');
  const levelData = localStorage.getItem('characterLevelData');
  
  if (!storedData && !levelData) {
    console.error("Нет данных для сохранения");
    alert('Нет данных для сохранения. Сначала настройте материалы.');
    return;
  }

  let data, levelDataObj;
  
  if (storedData) {
    try {
      data = JSON.parse(storedData);
    } catch (error) {
      console.error('Ошибка парсинга characterData:', error);
    }
  }
  
  if (levelData) {
    try {
      levelDataObj = JSON.parse(levelData);
    } catch (error) {
      console.error('Ошибка парсинга characterLevelData:', error);
    }
  }
  
  const charName = character[`${lang}_name`] || character.en_name;
  const charKey = character.key || 'Flins';
  
  // Собираем введенные пользователем значения
  const userInputs = {};
  const inputElements = document.querySelectorAll('.all .materials-container input[type="number"]');
  
  inputElements.forEach(input => {
    const value = parseInt(input.value) || 0;
    const materialId = input.id.replace('all_', '').replace(/_/g, '.');
    userInputs[materialId] = value;
  });
  
  // Создаем объект для сохранения
  const saveData = {
    id: `${charKey}_${Date.now()}`,
    charKey: charKey,
    characterName: charName,
    characterAvatar: character.avatar,
    date: new Date().toLocaleString(),
    lastModified: Date.now(),
    level: data?.level || levelDataObj?.level || 1,
    attackLevel: data?.attackLevel || levelDataObj?.attackLevel || 1,
    skillLevel: data?.skillLevel || levelDataObj?.skillLevel || 1,
    explosionLevel: data?.explosionLevel || levelDataObj?.explosionLevel || 1,
    userInputs: userInputs,
    characterData: {
      rangeVal: data?.rangeVal || levelDataObj?.rangeVal || 0,
      fullCharacterData: character
    }
  };
  
  // Сохраняем
  const existingSaves = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  
  // Проверяем, есть ли уже сохранение для этого персонажа
  const existingSaveIndex = existingSaves.findIndex(save => save.charKey === charKey);
  
  if (existingSaveIndex !== -1) {
    // Заменяем существующее сохранение
    existingSaves[existingSaveIndex] = saveData;
  } else {
    // Добавляем новое сохранение
    existingSaves.push(saveData);
  }
  
  localStorage.setItem('savedMaterials', JSON.stringify(existingSaves));

  console.log('✅ Сохранение успешно!');
  console.log('Все сохранения:', JSON.parse(localStorage.getItem('savedMaterials')));
  
  // Обновляем профиль, если открыт
  forceRefreshProfile();
  
  // Обновляем исходные данные
  storeOriginalSaveData();
  
  // ВАЖНО: Обновляем characterData чтобы добавить флаги
  const currentCharData = JSON.parse(localStorage.getItem('characterData') || '{}');
  currentCharData.userInputs = userInputs;
  // Устанавливаем флаг, что это теперь не новая страница, а загруженное сохранение
  currentCharData.isFromLoad = true;
  localStorage.setItem('characterData', JSON.stringify(currentCharData));
  
  // Также обновляем characterLevelData
  const currentLevelData = JSON.parse(localStorage.getItem('characterLevelData') || '{}');
  currentLevelData.userInputs = userInputs;
  currentLevelData.isFromLoad = true;
  localStorage.setItem('characterLevelData', JSON.stringify(currentLevelData));
  
  // После сохранения должна быть кнопка "Обновить" (зеленая)
  checkAndSetupSaveButton(character, lang);
  
  // Показываем уведомление
  showSaveNotification('Материалы успешно сохранены!', 'success');
  
  console.log('Сохранение создано/обновлено для персонажа:', charName);
}

function checkAndLoadCharacterData() {
  console.log('Проверка данных персонажа...');
  
  // Проверяем все возможные источники данных
  const savedChar = localStorage.getItem('selectedCharacter');
  const levelData = localStorage.getItem('characterLevelData');
  const charData = localStorage.getItem('characterData');
  
  console.log('selectedCharacter:', savedChar ? 'есть' : 'нет');
  console.log('characterLevelData:', levelData ? 'есть' : 'нет');
  console.log('characterData:', charData ? 'есть' : 'нет');
  
  if (levelData) {
    try {
      const parsedData = JSON.parse(levelData);
      console.log('Данные уровня:', parsedData);
      
      // Проверяем, что данные не старые (созданы менее 5 минут назад)
      if (parsedData.timestamp && (Date.now() - parsedData.timestamp < 300000)) {
        console.log('Данные актуальны');
        return parsedData;
      } else {
        console.log('Данные устарели');
      }
    } catch (error) {
      console.error('Ошибка парсинга данных:', error);
    }
  }
  
  console.log('Возвращаем данные по умолчанию');
  return {
    rangeVal: 0,
    level: 1,
    attackLevel: 1,
    skillLevel: 1,
    explosionLevel: 1
  };
}

// Функция для получения реального уровня персонажа из значения слайдера
function getRealLevelFromRange(rangeVal) {
  const val = parseInt(rangeVal) || 0;
  if (val >= 70) return 90;
  else if (val >= 60) return 80;
  else if (val >= 50) return 70;
  else if (val >= 40) return 60;
  else if (val >= 30) return 50;
  else if (val >= 20) return 40;
  else if (val >= 10) return 20;
  else return 1;
}

// Функция для отображения реальных материалов
function renderRealMaterials(data, characterData) {
  console.log('renderRealMaterials вызван с данными:', data);
  console.log('Данные персонажа:', characterData);
  
  // Получаем реальный уровень из диапазона
  const realLevel = getRealLevelFromRange(data.rangeVal || 0);
  console.log('Реальный уровень персонажа:', realLevel);
  
  // Получаем значения для поиска материалов
  const attackLevel = data.attackLevel || 1;
  const skillLevel = data.skillLevel || 1;
  const explosionLevel = data.explosionLevel || 1;
  
  console.log('Поиск материалов для:', {
    realLevel, attackLevel, skillLevel, explosionLevel
  });
  
  // Проверяем наличие данных материалов
  if (!materialCategories) {
    console.error("materialCategories не загружен");
    showErrorMessage("Данные о материалах не загружены.");
    return;
  }
  
  // 1. Материалы для уровня персонажа
  const levelMaterials = getLevelMaterials(realLevel);
  console.log('Материалы уровня для уровня', realLevel, ':', levelMaterials);
  
  // 2. Материалы для атаки
  const attackMaterials = getTalentMaterials('attack', attackLevel);
  console.log('Материалы атаки для уровня', attackLevel, ':', attackMaterials);
  
  // 3. Материалы для навыка
  const skillMaterials = getTalentMaterials('skill', skillLevel);
  console.log('Материалы навыка для уровня', skillLevel, ':', skillMaterials);
  
  // 4. Материалы для взрыва
  const burstMaterials = getTalentMaterials('burst', explosionLevel);
  console.log('Материалы взрыва для уровня', explosionLevel, ':', burstMaterials);
  
  // Рендерим все материалы
  renderMaterialsToContainer('section.level .materials-container', levelMaterials, 'level', characterData);
  renderMaterialsToContainer('section.mat-attack .materials-container', attackMaterials, 'attack', characterData);
  renderMaterialsToContainer('section.mat-skill .materials-container', skillMaterials, 'skill', characterData);
  renderMaterialsToContainer('section.mat-explosion .materials-container', burstMaterials, 'explosion', characterData);
  
  // Все материалы вместе
  renderAllMaterials(levelMaterials, attackMaterials, skillMaterials, burstMaterials, characterData);
}

// Функция для получения материалов уровня
function getLevelMaterials(realLevel) {
  if (!materialCategories.amountsPerLevel) return {};
  
  // Определяем ключ для amountsPerLevel на основе реального уровня
  let targetKey = 1; // По умолчанию 1
  
  if (realLevel >= 90) targetKey = 70;
  else if (realLevel >= 80) targetKey = 60;
  else if (realLevel >= 70) targetKey = 50;
  else if (realLevel >= 60) targetKey = 40;
  else if (realLevel >= 50) targetKey = 30;
  else if (realLevel >= 40) targetKey = 20;
  else if (realLevel >= 20) targetKey = 10;
  
  console.log('Поиск материалов уровня для ключа:', targetKey);
  
  return materialCategories.amountsPerLevel[targetKey] || {};
}

// Функция для получения материалов талантов
function getTalentMaterials(talentType, level) {
  if (!materialCategories[talentType]) return {};
  
  // Находим ближайший уровень таланта
  const validLevels = Object.keys(materialCategories[talentType])
    .map(Number)
    .sort((a, b) => a - b);
  
  let targetLevel = 1;
  for (const lvl of validLevels) {
    if (level >= lvl) {
      targetLevel = lvl;
    } else {
      break;
    }
  }
  
  return materialCategories[talentType][targetLevel] || {};
}

// Функция для рендеринга материалов в контейнер
function renderMaterialsToContainer(selector, materials, sectionType, characterData) {
  const container = document.querySelector(selector);
  if (!container) {
    console.error('Контейнер не найден:', selector);
    return;
  }
  
  container.innerHTML = '';
  
  if (!materials || Object.keys(materials).length === 0) {
    container.textContent = 'Нет материалов для этого уровня';
    return;
  }
  
  // Создаем элементы для каждого материала
  Object.entries(materials).forEach(([materialKey, amount]) => {
    if (amount > 0) {
      const materialElement = createMaterialElement(materialKey, amount, sectionType, characterData);
      container.appendChild(materialElement);
    }
  });
}

// Функция для создания элемента материала
function createMaterialElement(materialKey, amount, sectionType, characterData) {
  const div = document.createElement('div');
  div.className = 'material-item';
  
  // Получаем информацию о материале с учетом персонажа
  const materialInfo = getMaterialInfo(materialKey, characterData);
  
  // Создаем содержимое
  div.innerHTML = `
    <img src="${materialInfo.icon || 'assets/unknown.png'}" alt="${materialInfo.name}" class="material-icon">
    <div class="material-info">
      <span class="material-name">${materialInfo.name}</span>
      <span class="material-amount">${amount}</span>
    </div>
  `;
  
  // Для секции "Все материалы" добавляем поле ввода
  if (sectionType === 'all') {
    const inputId = `all_${materialKey.replace(/\./g, '_')}`;
    div.innerHTML += `
      <div class="material-input">
        <input type="number" id="${inputId}" min="0" value="0" placeholder="Имеется">
        <span class="material-remaining">Осталось: ${amount}</span>
      </div>
    `;
    
    // Добавляем обработчик события для input
    setTimeout(() => {
      const input = document.getElementById(inputId);
      if (input) {
        input.addEventListener('input', function() {
          const have = parseInt(this.value) || 0;
          const remaining = Math.max(0, amount - have);
          const remainingSpan = this.parentElement.querySelector('.material-remaining');
          if (remainingSpan) {
            remainingSpan.textContent = `Осталось: ${remaining}`;
          }
        });
      }
    }, 10);
  }
  
  return div;
}

// Функция для получения информации о материале
function getMaterialInfo(materialKey, character = null) {
  console.log('=== ПОИСК МАТЕРИАЛА ===');
  console.log('Ключ материала:', materialKey);
  console.log('Персонаж:', character?.ru_name);
  
  if (character && character.ascensionMaterials) {
    console.log('Ascension материалы персонажа:', character.ascensionMaterials);
    const materialType = getMaterialTypeForCharacter(materialKey, character);
    console.log('Тип материала для персонажа:', materialType);
    
    if (materialType && materialType.length > 0) {
      const mainCategory = materialKey.toLowerCase();
      const subCategory = materialType[0];
      
      console.log('Поиск в materialsInfo:', mainCategory, '->', subCategory);
      console.log('materialsInfo[mainCategory]:', materialsInfo[mainCategory]);
      
      if (materialsInfo[mainCategory] && materialsInfo[mainCategory][subCategory]) {
        const info = materialsInfo[mainCategory][subCategory];
        console.log('Найден персонаж   специфичный материал:', info);
        return {
          name: info.name || materialKey,
          icon: info.icon || 'assets/unknown.png'
        };
      }
    }
  }
  
  // Проверяем простые случаи (например, mora, crown, experience)
  if (materialsInfo[materialKey]) {
    const info = materialsInfo[materialKey];
    console.log('Найден простой материал:', materialKey, info);
    return {
      name: info.name || materialKey,
      icon: info.icon || 'assets/unknown.png'
    };
  }
  
  // Проверяем сложные ключи (например, "weeklyBossDrops.AscendedSampleQueen")
  const parts = materialKey.split('.');
  if (parts.length === 2) {
    const [category, subKey] = parts;
    if (materialsInfo[category] && materialsInfo[category][subKey]) {
      const info = materialsInfo[category][subKey];
      console.log('Найден вложенный материал по частям:', category, subKey, info);
      return {
        name: info.name || materialKey,
        icon: info.icon || 'assets/unknown.png'
      };
    }
  }
  
  // Проверяем вложенные структуры без привязки к персонажу
  for (const mainCategory in materialsInfo) {
    if (typeof materialsInfo[mainCategory] === 'object') {
      for (const subKey in materialsInfo[mainCategory]) {
        // Если materialKey равен subKey (например, "Electro" внутри "sliver")
        if (subKey === materialKey || 
            (typeof materialsInfo[mainCategory][subKey] === 'object' && 
             materialsInfo[mainCategory][subKey].name)) {
          const info = materialsInfo[mainCategory][subKey];
          console.log('Найден вложенный материал по ключу:', mainCategory, subKey, info);
          return {
            name: info.name || materialKey,
            icon: info.icon || 'assets/unknown.png'
          };
        }
      }
    }
  }
  
  console.log('Материал не найден, используем базовую информацию:', materialKey);
  return {
    name: materialKey,
    icon: 'assets/unknown.png'
  };
}

// Функция для получения типа материала для персонажа
function getMaterialTypeForCharacter(materialKey, character) {
  if (!character.ascensionMaterials) return null;
  
  // Сопоставление ключей материала с ключами в ascensionMaterials
  const keyMapping = {
    'sliver': 'sliver',
    'fragment': 'fragment', 
    'chunk': 'chunk',
    'gemstone': 'gemstone',
    'enemydropsst1': 'EnemyDropsSt1',
    'enemydropsst2': 'EnemyDropsSt2',
    'enemydropsst3': 'EnemyDropsSt3',
    'teachings': 'teachings',
    'guide': 'guide',
    'philosophies': 'philosophies',
    'weeklybossdrops': 'weeklyBossDrops',
    'bossmaterial': 'bossMaterial',
    'localspecialty': 'localSpecialty',
    'crown': 'crown',
    'experience': 'experience',
    'mora': 'mora'
  };
  
  const cleanKey = materialKey.toLowerCase();
  const mappedKey = keyMapping[cleanKey] || materialKey;
  
  console.log('Поиск типа материала:', mappedKey, 'в', character.ascensionMaterials);
  
  return character.ascensionMaterials[mappedKey];
}

// Функция для рендеринга всех материалов
function renderAllMaterials(levelMats, attackMats, skillMats, burstMats, characterData) {
  const container = document.querySelector('section.all .materials-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Объединяем все материалы
  const allMaterials = {};
  
  // Функция для добавления материалов
  function addMaterials(materials) {
    if (!materials) return;
    
    Object.entries(materials).forEach(([key, amount]) => {
      if (amount > 0) {
        allMaterials[key] = (allMaterials[key] || 0) + amount;
      }
    });
  }
  
  addMaterials(levelMats);
  addMaterials(attackMats);
  addMaterials(skillMats);
  addMaterials(burstMats);
  
  // Если нет материалов
  if (Object.keys(allMaterials).length === 0) {
    container.textContent = 'Нет материалов';
    return;
  }
  
  // Сортируем материалы по названию
  const sortedMaterials = Object.entries(allMaterials)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
  
  // Рендерим каждый материал
  sortedMaterials.forEach(([materialKey, amount]) => {
    const materialElement = createMaterialElement(materialKey, amount, 'all', characterData);
    container.appendChild(materialElement);
  });
}

// Функция для показа сообщения об ошибке
function showErrorMessage(message) {
  const allSections = document.querySelectorAll('section .materials-container');
  allSections.forEach(container => {
    if (container) {
      container.innerHTML = `<div style="color: red; padding: 20px; background: #ffe6e6; border-radius: 5px;">
        <strong>Ошибка:</strong> ${message}
        <br><br>
        <button onclick="location.reload()">Обновить страницу</button>
        <button onclick="history.back()">Вернуться назад</button>
      </div>`;
    }
  });
}

function fillCharacterDetailData(pageId, character, lang) {
  const prefix = pageId.split('/')[1]; // 'mat', 'info', 'guide'
  
  // Общие данные
  const nameElement = document.getElementById(`${prefix}-name`);
  if (nameElement) {
    nameElement.textContent = character[`${lang}_name`] || character.en_name;
  }
  
  const avatar = document.getElementById(`${prefix}-avatar`);
  if (avatar && character.avatar) {
    avatar.src = character.avatar;
    avatar.alt = character[`${lang}_name`] || character.en_name;
  }
  
  // Специфичные данные для каждой страницы
  if (pageId === 'characters/mat') {
    const levelData = JSON.parse(localStorage.getItem('characterLevelData') || '{}');
    
    const levelElements = [
      { id: 'mat-level', value: levelData.level || 1 },
      { id: 'mat-char-level', value: levelData.level || 1 },
      { id: 'mat-attack-level', value: levelData.attackLevel || 1 },
      { id: 'mat-skill-level', value: levelData.skillLevel || 1 },
      { id: 'mat-explosion-level', value: levelData.explosionLevel || 1 }
    ];
    
    levelElements.forEach(({ id, value }) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });
    
  } else if (pageId === 'characters/info') {
    const infoElements = [
      { id: 'info-element', value: character.element || 'Не указано' },
      { id: 'info-weapon', value: character.type || 'Не указано' },
      { id: 'info-rarity', value: character.rarity || 'Не указано' },
      { id: 'info-region', value: character.region || 'Не указано' }
    ];
    
    infoElements.forEach(({ id, value }) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });
    
    const bioElement = document.getElementById('info-bio');
    if (bioElement) {
      bioElement.textContent = character[`${lang}_bio`] || character.description || 'Описание отсутствует';
    }
    
  } else if (pageId === 'characters/guide') {
    // Здесь можно добавить логику для гайда
  }
}

function setLanguage(lang) {
  if (currentLang === lang) return;
  
  console.log('Смена языка:', lang);
  currentLang = lang;
  localStorage.setItem('lang', lang);
  
  localizeNavigation(lang);
  retranslateDynamicContent(lang);
  
  if (serverTimer) {
    serverTimer.updateLanguage(lang);
  }
  
  moveHighlight();
}

function checkBirthday() {
  const today = new Date();
  const todayStr = `${today.getMonth() + 1}-${today.getDate()}`;
  const announcement = document.getElementById('birthday-announcement');
  const image = document.getElementById('birthday-image');
  const calendar = document.getElementById('mini-calendar');

  if (!calendar) return;

  let foundBirthday = false;

  Object.keys(charsData).forEach(key => {
    const char = charsData[key];
    if (char.date === todayStr) {
      const name = char[`${currentLang}_name`] || char.en_name;
      const announcementText = translations[currentLang].birthdayAnnouncementFormat
        .replace('{name}', name);
      
      if (announcement) announcement.textContent = announcementText;
      if (image) {
        image.src = char.avatar;
        image.alt = translations[currentLang].imageAlt.replace('{name}', name);
      }
      foundBirthday = true;
    }
  });

  if (!foundBirthday) {
    if (announcement) announcement.textContent = translations[currentLang].noBirthdayToday;
    if (image) {
      const svg = `data:image/svg+xml,${encodeURIComponent('<svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="200" fill="#f8f9fa"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="#666" text-anchor="middle" dy=".3em">Сегодня нет дней рождения</text></svg>')}`;
      image.src = svg;
      image.alt = currentLang === 'ru' ? 'Нет дней рождения сегодня' : 'No birthdays today';
    }
  }

  renderMiniCalendar(calendar, today, currentLang);
}

function moveHighlight() {
  const highlight = document.querySelector('.nav-highlight');
  const activeItem = document.querySelector('.nav-item.active');

  if (!highlight || !activeItem) return;

  try {
    const activeRect = activeItem.getBoundingClientRect();
    const navRect = document.querySelector('.nav-links').getBoundingClientRect();
    
    highlight.style.left = `${activeRect.left - navRect.left}px`;
    highlight.style.top = `${activeRect.top - navRect.top}px`;
    highlight.style.width = `${activeRect.width}px`;
    highlight.style.height = `${activeRect.height}px`;
    highlight.style.borderRadius = getComputedStyle(activeItem).borderRadius;
  } catch (error) {
    console.error('Ошибка в moveHighlight:', error);
  }
}

function handleResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    moveHighlight();
  }, 150);
}

function updateActiveNav() {
  const navItems = document.querySelectorAll('.nav-item');
  const currentPage = window.location.hash.slice(2) || 'home';
  
  navItems.forEach(item => {
    const pageId = item.getAttribute('data-page');
    item.classList.remove('active');
    
    if (currentPage === pageId || currentPage.startsWith(pageId + '/')) {
      item.classList.add('active');
    }
  });

  setTimeout(() => moveHighlight(), 50);
}

function handleNavigation(e) {
  e.preventDefault();
  
  let link = e.target.closest('a[data-page]');
  if (!link && e.target.closest('.nav-item')) {
    link = e.target.closest('.nav-item');
  }
  
  if (!link || !link.hasAttribute('data-page')) return;

  const pageId = link.getAttribute('data-page');
  history.pushState({ page: pageId }, '', `#/${pageId}`);
  showPage(pageId);
}

function handleHashChange() {
  const pageId = window.location.hash.slice(2) || 'home';
  showPage(pageId);
}

function handleLanguageChange(e) {
  e.preventDefault();
  e.stopPropagation();
  
  let langBtn = e.target.closest('.lang-btn');
  if (!langBtn && e.target.hasAttribute('data-lang')) {
    langBtn = e.target;
  }
  
  if (!langBtn) return;
  
  const lang = langBtn.getAttribute('data-lang');
  setLanguage(lang);
}

function updateAfterImagesLoad() {
  const images = document.querySelectorAll('img');
  let imagesLoaded = 0;
  
  if (images.length === 0) {
    moveHighlight();
    return;
  }
  
  images.forEach(img => {
    if (img.complete) {
      imagesLoaded++;
    } else {
      img.addEventListener('load', () => {
        imagesLoaded++;
        if (imagesLoaded === images.length) {
          setTimeout(() => moveHighlight(), 100);
        }
      });
    }
  });
  
  if (imagesLoaded === images.length) {
    setTimeout(() => moveHighlight(), 100);
  }
}

function initApp() {
  const savedLang = localStorage.getItem('lang');
  if (savedLang) {
    currentLang = savedLang;
  }

  localizeNavigation(currentLang);
  setupEventListeners();

  const hash = window.location.hash;
  const initialPage = hash.slice(2) || 'home';
  showPage(initialPage);
  
  setTimeout(() => moveHighlight(), 100);
}

function setupEventListeners() {
  const mainNav = document.querySelector('.main-nav');
  if (mainNav) {
    mainNav.addEventListener('click', handleNavigation);
  }
  
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', handleLanguageChange);
  });

  window.addEventListener('hashchange', handleHashChange);
  window.addEventListener('popstate', handleHashChange);
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', () => {
    setTimeout(() => moveHighlight(), 300);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  updateAfterImagesLoad();
  convertImgToSVG();
});

export {
  currentLang,
  currentPageId,
  showPage,
  setLanguage,
  updateActiveNav
};