// list-char.js - оптимизированная версия
import { charsData } from './characterData.js';
import { translations } from './translations.js';

let currentFilters = {
  element: null,
  weapon: null,
  rarity: null
};

export function renderCharacterCards(currentLang, filters = currentFilters) {
  const container = document.querySelector('.cards-container');
  if (!charsData || !container) return;

  // Очищаем контейнер перед рендерингом
  container.innerHTML = '';

  // Фильтруем Персонажей
  const filteredCharacters = Object.entries(charsData).filter(([key, data]) => {
    // Проверяем фильтр по элементу 
    if (filters.element && data.element !== filters.element) {
      return false;
    }

    // Проверяем фильтр по оружию
    if (filters.weapon && data.weaponType !== filters.weapon) {
      return false;
    }

    // Проверяем фильтр по редкости
    if (filters.rarity && data.rarity !== parseInt(filters.rarity)) {
      return false;
    }

    return true;
  });

  if (filteredCharacters.length === 0) {
    container.innerHTML = '<p class="no-results">Error</p>';
    return;
  }

  filteredCharacters.forEach(([key, data]) => {
    const article = document.createElement('article');
    article.classList.add('card-avatar');

    // Классы по фильтрам
    if (data.element) article.classList.add(`element-${data.element.toLowerCase()}`);
    if (data.type) article.classList.add(`type-${data.type.toLowerCase()}`);
    if (data.rarity) article.classList.add(`rarity-${data.rarity}`);
    article.classList.add('all');

    // data-name для фильтрации
    article.setAttribute('data-name', key);

    // Ссылка на персонажа
    const link = document.createElement('a');
    link.href = '#';
    link.className = 'link-to-char';
    link.addEventListener('click', (e) => {
      e.preventDefault();
      // Сохраняем данные о персонаже в localStorage
      localStorage.setItem('selectedCharacter', JSON.stringify({
        key: key,
        data: data,
        lang: currentLang
      }));
      
      // Открываем модальное окно с выбором вкладок
      openCharacterModal(key, data, currentLang);
    });

    // Аватар
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'avatar';
    const img = document.createElement('img');
    img.src = data.avatar_icon || '/images/default.png';
    img.alt = data[`${currentLang}_name`] || data.en_name;
    avatarDiv.appendChild(img);
    link.appendChild(avatarDiv);

    // Имя персонажа
    const nameSpan = document.createElement('span');
    nameSpan.className = 'name';
    const nameP = document.createElement('p');
    nameP.textContent = data[`${currentLang}_name`] || data.en_name;
    nameSpan.appendChild(nameP);
    link.appendChild(nameSpan);

    article.appendChild(link);
    container.appendChild(article);
  });

  // Обновляем счетчик персонажей
  updateCharacterCount(filteredCharacters.length);
}

// Функция для обновления счетчика персонажей
function updateCharacterCount(count) {
  let counterElement = document.querySelector('.character-counter');
  
  if (!counterElement) {
    const header = document.querySelector('.page.characters h1');
    if (header) {
      counterElement = document.createElement('span');
      counterElement.className = 'character-counter';
      header.appendChild(counterElement);
    }
  }
  
  if (counterElement) {
    counterElement.textContent = ` (${count})`;
  }
}

// Функция для сброса фильтров
export function resetFilters(currentLang) {
  currentFilters = {
    element: null,
    weapon: null,
    rarity: null
  };
  
  renderCharacterCards(currentLang);
  updateFilterButton();
}

// Функция для обновления кнопки фильтра
function updateFilterButton() {
  const filterBtn = document.querySelector('.filter-button');
  if (!filterBtn) return;
  
  // Проверяем, есть ли активные фильтры
  const hasActiveFilters = Object.values(currentFilters).some(filter => filter !== null);
  
  if (hasActiveFilters) {
    filterBtn.classList.add('active');
    filterBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
        <circle cx="12" cy="12" r="3" class="filter-indicator"/>
      </svg>
      <span>Фильтр</span>
      <span class="filter-clear">×</span>
    `;
    
    // Обновляем стили для активной кнопки
    filterBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
  } else {
    filterBtn.classList.remove('active');
    filterBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
      </svg>
      <span>Фильтр</span>
    `;
    
    // Возвращаем оригинальные стили
    filterBtn.style.background = 'var(--dark)';
  }
}

// Функция для создания модального окна фильтра
export function createFilterModal(currentLang) {
  // Собираем уникальные значения для фильтров
  const elements = new Set();
  const weapons = new Set();
  const rarities = new Set();
  
  Object.values(charsData).forEach(character => {
    if (character.element) elements.add(character.element);
    if (character.weaponType) weapons.add(character.weaponType);
    if (character.rarity) rarities.add(character.rarity);
  });

  // Создаем модальное окно
  const modal = document.createElement('div');
  modal.className = 'filter-modal';

  const modalContent = document.createElement('div');
  modalContent.className = 'filter-modal-content';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'filter-close-btn';
  closeBtn.textContent = '×';
  
  closeBtn.addEventListener('click', () => modal.remove());

  const title = document.createElement('h2');
  title.textContent = 'Фильтр персонажей';

  // Создаем секции фильтров
  const sections = [
    {
      title: 'Стихия',
      key: 'element',
      options: Array.from(elements).sort(),
      current: currentFilters.element
    },
    {
      title: 'Оружие',
      key: 'weapon',
      options: Array.from(weapons).sort(),
      current: currentFilters.weapon
    },
    {
      title: 'Редкость',
      key: 'rarity',
      options: Array.from(rarities).sort((a, b) => b - a),
      current: currentFilters.rarity
    }
  ];

  const filtersContainer = document.createElement('div');
  

  sections.forEach(section => {
    const sectionDiv = document.createElement('div');

    const sectionTitle = document.createElement('h3');
    sectionTitle.textContent = section.title;

    const optionsContainer = document.createElement('div');

    // Добавляем опцию "Все"
    const allOption = document.createElement('button');
    allOption.className = 'filter-option';
    allOption.textContent = 'Все';
    allOption.dataset.value = '';
    allOption.dataset.type = section.key;
    
    if (section.current === null) {
      allOption.classList.add('active');
    }
    
    allOption.addEventListener('click', (e) => {
      const buttons = optionsContainer.querySelectorAll('.filter-option');
      buttons.forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
    });
    
    optionsContainer.appendChild(allOption);

    // Добавляем остальные опции
    section.options.forEach(option => {
      const optionBtn = document.createElement('button');
      optionBtn.className = 'filter-option';
      optionBtn.textContent = option;
      optionBtn.dataset.value = option;
      optionBtn.dataset.type = section.key;
      
      if (section.current === option) {
        optionBtn.classList.add('active');
      }
      
      optionBtn.addEventListener('click', (e) => {
        const buttons = optionsContainer.querySelectorAll('.filter-option');
        buttons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
      });
      
      optionsContainer.appendChild(optionBtn);
    });

    sectionDiv.appendChild(sectionTitle);
    sectionDiv.appendChild(optionsContainer);
    filtersContainer.appendChild(sectionDiv);
  });

  // Кнопки действий
  const actionsContainer = document.createElement('div');

  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'Сбросить';
  
  resetBtn.addEventListener('click', () => {
    // Сбрасываем все кнопки
    filtersContainer.querySelectorAll('.filter-option').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.value === '') {
        btn.classList.add('active');
      }
    });
  });

  const applyBtn = document.createElement('button');
  applyBtn.textContent = 'Применить';

  applyBtn.addEventListener('click', () => {
    // Собираем выбранные фильтры
    const newFilters = {
      element: null,
      weapon: null,
      rarity: null
    };

    const activeButtons = filtersContainer.querySelectorAll('.filter-option.active');
    activeButtons.forEach(btn => {
      const type = btn.dataset.type;
      const value = btn.dataset.value;
      
      if (value !== '') {
        if (type === 'rarity') {
          newFilters[type] = parseInt(value);
        } else {
          newFilters[type] = value;
        }
      }
    });

    // Применяем фильтры
    currentFilters = newFilters;
    renderCharacterCards(currentLang);
    updateFilterButton();
    modal.remove();
  });

  actionsContainer.appendChild(resetBtn);
  actionsContainer.appendChild(applyBtn);

  // Собираем модальное окно
  modalContent.appendChild(closeBtn);
  modalContent.appendChild(title);
  modalContent.appendChild(filtersContainer);
  modalContent.appendChild(actionsContainer);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Закрытие при клике вне модального окна
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Функция для создания кнопки фильтра в header
export function createFilterButton(currentLang) {
  const navTopBar = document.querySelector('.nav-top-bar');
  if (!navTopBar) return;

  // Проверяем, есть ли уже кнопка
  let filterBtn = document.querySelector('.filter-button');
  
  if (!filterBtn) {
    filterBtn = document.createElement('button');
    filterBtn.className = 'filter-button';
    filterBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
      </svg>
      <span>Фильтр</span>
    `;
    
    filterBtn.addEventListener('mouseenter', () => {
      
    });
    
    filterBtn.addEventListener('mouseleave', () => {
      
    });
    
    // Добавляем обработчик клика для фильтра
    filterBtn.addEventListener('click', () => {
      createFilterModal(currentLang);
    });
    
    // Добавляем кнопку в левую часть nav-top-bar
    const navLeftArea = navTopBar.querySelector('.nav-left-area');
    if (navLeftArea) {
      navLeftArea.appendChild(filterBtn);
    } else {
      // Создаем nav-left-area, если его нет
      const leftArea = document.createElement('div');
      leftArea.className = 'nav-left-area';
      leftArea.appendChild(filterBtn);
      
      // Вставляем перед language-switcher
      const langSwitcher = navTopBar.querySelector('.language-switcher');
      if (langSwitcher) {
        navTopBar.insertBefore(leftArea, langSwitcher);
      } else {
        navTopBar.appendChild(leftArea);
      }
    }
  }
  
  // Обновляем состояние кнопки
  updateFilterButton();
  
  // Добавляем обработчик для крестика, если есть активные фильтры
  filterBtn.addEventListener('click', (e) => {
    const clearBtn = e.target.closest('.filter-clear');
    if (clearBtn) {
      e.stopPropagation();
      resetFilters(currentLang);
    }
  });
}

export function openCharacterModal(charKey, character, lang) {
  // Добавим key в character объект для сохранения
  character.key = charKey;
  // Устанавливаем флаг, что это НЕ загрузка из профиля
  localStorage.setItem('isNewCharacterSetup', 'true');
  
  // Создаём модальное окно
  const modal = document.createElement('div');
  modal.className = 'character-modal';

  // Контейнер контента
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  // Кнопка закрытия
  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-btn';
  closeBtn.textContent = '×';
  
  closeBtn.addEventListener('click', () => modal.remove());

  // Аватар и имя персонажа
  const avatarContainer = document.createElement('div');
  avatarContainer.className = 'avatar-container'
  
  if (character.avatar) {
    const avatarImg = document.createElement('img');
    avatarImg.src = character.avatar;
    avatarImg.alt = character[`${lang}_name`] || character.en_name;

    avatarContainer.appendChild(avatarImg);
  }

  const title = document.createElement('h2');
  title.textContent = character[`${lang}_name`] || character.en_name;
  
  avatarContainer.appendChild(title);

  // Контейнер с кнопками выбора раздела
  const buttonsContainer = document.createElement('div');

  const sections = [
    { id: 'materials', label: translations[lang]?.materials || 'Материалы развития', icon: '📦' },
    { id: 'info', label: translations[lang]?.info || 'Информация', icon: 'ℹ️' },
    { id: 'guide', label: translations[lang]?.guide || 'Гайд', icon: '📖' }
  ];

  sections.forEach(section => {
    const sectionBtn = document.createElement('button');
    sectionBtn.className = 'section-btn';
    sectionBtn.dataset.section = section.id;
    
    sectionBtn.innerHTML = `${section.icon} ${section.label}`;
    
    sectionBtn.addEventListener('mouseenter', () => {
      
    });
    
    sectionBtn.addEventListener('mouseleave', () => {
      
    });
    
    sectionBtn.addEventListener('click', () => {
      if (section.id === 'materials') {
        // Для материалов открываем дополнительное модальное окно
        openMaterialsSetupModal(character, lang, modal);
      } else {
        // Для других разделов просто переходим на страницу
        modal.remove();
        navigateToCharacterPage(section.id, character, lang);
      }
    });
    
    buttonsContainer.appendChild(sectionBtn);
  });

  // Собираем модальное окно
  modalContent.appendChild(closeBtn);
  modalContent.appendChild(avatarContainer);
  modalContent.appendChild(buttonsContainer);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Закрытие модального окна при клике вне его
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Функция для навигации на страницу персонажа
async function navigateToCharacterPage(section, character, lang) {
  let targetPage;
  
  switch(section) {
    case 'materials':
      targetPage = 'characters/mat';
      break;
    case 'info':
      targetPage = 'characters/info';
      break;
    case 'guide':
      targetPage = 'characters/guide';
      break;
    default:
      targetPage = 'characters';
  }
  
  // Важно: сохраняем персонажа в localStorage
  localStorage.setItem('selectedCharacter', JSON.stringify({
    key: character.key,
    data: character,
    lang: lang
  }));
  
  console.log('Переходим на страницу:', targetPage);
  
  // Обновляем URL
  history.pushState({}, '', `#/${targetPage}`);
  
  // Используем глобальную функцию showPage
  if (window.showPage) {
    console.log('Вызываем window.showPage с:', targetPage);
    window.showPage(targetPage);
  } else {
    console.error('window.showPage не найдена!');
    window.location.reload();
  }
}

// Функция показа опции загрузки сохранения (возвращает Promise)
function showLoadSaveOptionPromise(character, lang, existingSave) {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.className = 'load-save-option-modal';
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
      z-index: 2000;
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
    
    modalContent.innerHTML = `
      <h3 style="color: #333; margin-bottom: 10px;">Загрузить сохраненные данные?</h3>
      <p style="color: #666; margin-bottom: 5px;">
        Для <strong>${existingSave.characterName}</strong> найдено сохранение от 
        <strong>${saveDate}</strong>
      </p>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin: 20px 0; text-align: left;">
        <p><strong>Уровень:</strong> ${existingSave.level}</p>
        <p><strong>Атака:</strong> ${existingSave.attackLevel}</p>
        <p><strong>Навык:</strong> ${existingSave.skillLevel}</p>
        <p><strong>Взрыв:</strong> ${existingSave.explosionLevel}</p>
        ${Object.keys(existingSave.userInputs || {}).length > 0 ? 
          `<p><strong>Сохранено материалов:</strong> ${Object.keys(existingSave.userInputs).length}</p>` : ''}
      </div>
      <div style="display: flex; gap: 15px; justify-content: center; margin-top: 25px;">
        <button id="option-new" style="
          padding: 12px 30px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          flex: 1;
        ">Создать новое</button>
        <button id="option-load" style="
          padding: 12px 30px;
          background: #2196F3;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          flex: 1;
        ">Загрузить сохраненное</button>
      </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Обработчики кнопок
    modalContent.querySelector('#option-new').addEventListener('click', () => {
      modal.remove();
      resolve('new');
    });
    
    modalContent.querySelector('#option-load').addEventListener('click', () => {
      modal.remove();
      resolve('load');
    });
    
    // Закрытие при клике вне окна
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
        resolve('new'); // По умолчанию создаем новое
      }
    });
  });
}

export async function openMaterialsSetupModal(character, lang, parentModal) {
  // Закрываем родительское модальное окно
  if (parentModal) parentModal.remove();

  // Проверяем, нужно ли сбросить настройки
  const isNewCharacterSetup = localStorage.getItem('isNewCharacterSetup') === 'true';
  const isLoadingFromProfile = localStorage.getItem('isLoadingFromProfile') === 'true';
  
  // Проверяем, есть ли уже сохранение для этого персонажа
  const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  const existingSave = savedMaterials.find(save => save.charKey === character.key);
  
  // Если есть сохранение и это не загрузка из профиля, показываем выбор
  if (existingSave && !isLoadingFromProfile) {
    try {
      const userChoice = await showLoadSaveOptionPromise(character, lang, existingSave);
      
      if (userChoice === 'load') {
        // Пользователь выбрал загрузить сохраненное - ЗАГРУЖАЕМ СОХРАНЕННЫЕ ДАННЫЕ
        console.log('Загружаем сохраненные данные для персонажа:', character[`${lang}_name`] || character.en_name);
        
        // СОЗДАЕМ ОБЪЕКТ С ДАННЫМИ ИЗ СОХРАНЕНИЯ
        const savedLevelData = {
          charName: existingSave.characterName,
          rangeVal: existingSave.characterData?.rangeVal || 0,
          level: existingSave.level,
          attackLevel: existingSave.attackLevel,
          skillLevel: existingSave.skillLevel,
          explosionLevel: existingSave.explosionLevel,
          timestamp: Date.now(),
          characterData: existingSave.characterData?.fullCharacterData || character,
          // Добавляем флаг, что данные загружены из сохранения
          loadedFromSave: true,
          // Сохраняем пользовательские вводы
          userInputs: existingSave.userInputs || {}
        };
        
        console.log('Сохраненные данные для загрузки:', savedLevelData);
        
        // Сохраняем данные для использования при создании модального окна
        localStorage.setItem('characterLevelData', JSON.stringify(savedLevelData));
        
        // Создаем модальное окно настроек с ЗАГРУЖЕННЫМИ данными
        createMaterialsModal(character, lang, existingSave, true); // true = данные загружены
        return;
        
      } else {
        // Пользователь выбрал создать новое - СБРАСЫВАЕМ данные
        console.log('Создаем новую настройку для персонажа');
        localStorage.removeItem('isNewCharacterSetup');
        
        // Сбрасываем данные уровня
        const resetLevelData = {
          charName: character[`${lang}_name`] || character.en_name,
          rangeVal: 0, // Сбрасываем в 0
          level: 1,    // Сбрасываем в 1
          attackLevel: 1,
          skillLevel: 1,
          explosionLevel: 1,
          timestamp: Date.now(),
          characterData: character
        };
        
        localStorage.setItem('characterLevelData', JSON.stringify(resetLevelData));
        
        // Создаем модальное окно настроек со сброшенными данными
        createMaterialsModal(character, lang, null, false); // false = новые данные
        return;
      }
      
    } catch (error) {
      console.error('Ошибка при показе окна выбора:', error);
      // В случае ошибки создаем новую настройку
      createMaterialsModal(character, lang, null, false);
    }
    
  } else {
    // Нет сохранений или это загрузка из профиля - создаем новую настройку
    console.log('Создаем новую настройку (нет сохранений)');
    createMaterialsModal(character, lang, null, false);
  }
}

// Функция для создания модального окна настроек материалов
function createMaterialsModal(character, lang, existingSave = null, loadFromSave = false) {
  console.log('createMaterialsModal вызвана с параметрами:', {
    loadFromSave,
    existingSave: !!existingSave
  });
  
  // СОЗДАЕМ ОБЪЕКТ ДАННЫХ ДЛЯ ОТОБРАЖЕНИЯ
  let displayData = {};
  
  if (loadFromSave && existingSave) {
    // ИСПОЛЬЗУЕМ ДАННЫЕ ИЗ СОХРАНЕНИЯ
    displayData = {
      level: existingSave.level,
      rangeVal: existingSave.characterData?.rangeVal || 0,
      attackLevel: existingSave.attackLevel,
      skillLevel: existingSave.skillLevel,
      explosionLevel: existingSave.explosionLevel
    };
    console.log('Загружаем данные из сохранения:', displayData);
  } else {
    // ИСПОЛЬЗУЕМ ТЕКУЩИЕ ДАННЫЕ ИЛИ ДАННЫЕ ПО УМОЛЧАНИЮ
    const levelData = JSON.parse(localStorage.getItem('characterLevelData') || '{}');
    
    // Проверяем, не нужно ли сбросить данные
    if (levelData.loadedFromSave) {
      // Если это были загруженные данные, сбрасываем
      displayData = {
        level: 1,
        rangeVal: 0,
        attackLevel: 1,
        skillLevel: 1,
        explosionLevel: 1
      };
      console.log('Сбрасываем загруженные данные:', displayData);
    } else {
      // Иначе используем текущие или значения по умолчанию
      displayData = {
        level: levelData.level || 1,
        rangeVal: levelData.rangeVal || 0,
        attackLevel: levelData.attackLevel || 1,
        skillLevel: levelData.skillLevel || 1,
        explosionLevel: levelData.explosionLevel || 1
      };
      console.log('Используем текущие данные:', displayData);
    }
  }
  
  // Создаем новое модальное окно для настройки материалов
  const materialsModal = document.createElement('div');
  materialsModal.className = 'materials-setup-modal';

  // Контейнер контента
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  // Кнопка закрытия
  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-btn';
  closeBtn.textContent = '×';
 
  closeBtn.addEventListener('click', () => {
    materialsModal.remove();
    openCharacterModal(character.key || 'unknown', character, lang);
  });

  // Заголовок
  const header = document.createElement('div');

  if (character.avatar) {
    const avatarImg = document.createElement('img');
    avatarImg.src = character.avatar;
    avatarImg.alt = character[`${lang}_name`] || character.en_name;
    header.appendChild(avatarImg);
  }

  const title = document.createElement('h2');
  title.textContent = `${character[`${lang}_name`] || character.en_name} - ${translations[lang]?.materials || 'Материалы развития'}`;
  title.style.margin = '0';
  header.appendChild(title);

  // В контенте устанавливаем начальные значения ИЗ displayData
  const content = document.createElement('div');
  content.innerHTML = `
    <section class="characters sec">
      <div id="char-icon" style="text-align: center; margin: 20px 0;">
        ${character.avatar ? `<img src="${character.avatar}" alt="${character[`${lang}_name`] || character.en_name}" style="width: 100px; height: 100px; border-radius: 50%;">` : ''}
      </div>
      <h1 id="char-name" style="text-align: center;">${character[`${lang}_name`] || character.en_name}</h1>
    </section>
    
    <section class="sec">
      <article class="level">
        <div style="margin-bottom: 20px; text-align: center;">
          <H2 style="margin-bottom: 10px;">Уровень</H2>
          <h2 class="current-level-display" style="font-size: 36px; color: #4CAF50;">${displayData.level}</h2>
        </div>
        
        <div class="level" style="margin: 25px 0;">
          <div class="range" style="display: flex; align-items: center; justify-content: center; gap: 15px; flex-wrap: wrap;">
            <button id="minus-range" aria-label="Minus" style="background: #6c757d; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-size: 18px;">
              <img src="./assets/minus.svg" alt="minus" style="width: 20px; height: 20px;">
            </button>
            
            <div style="display: flex; align-items: center; gap: 15px;">
              <input type="range" id="range" min="0" max="70" value="${displayData.rangeVal}" step="10" style="width: 200px;">
              <span id="range-value" style="font-size: 18px; font-weight: bold; min-width: 30px;">${displayData.rangeVal}</span>
            </div>
            
            <button id="plus-range" aria-label="Plus" style="background: #28a745; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-size: 18px;">
              <img src="./assets/plus.svg" alt="plus" style="width: 20px; height: 20px;">
            </button>
          </div>
        </div>
        
        <div class="basic_stat" style="margin-top: 30px;">
          <h2 style="text-align: center; margin-bottom: 20px;">Таланты</h2>
          
          <div class="section" data-group="attack" style="margin: 15px 0; padding: 20px; border: 2px solid #e0e0e0; border-radius: 10px; background: #f9f9f9;">
            <div id="char-s1" style="font-size: 24px; margin-bottom: 10px; text-align: center;">
              ${character.s1 ? `<img src="${character.s1}" alt="Attack Icon" style="width: 40px; height: 40px;">` : '⚔️'}
            </div>
            <div class="hp_icon" style="text-align: center;">
              <p style="margin: 5px 0; font-weight: bold; color: #333;">Базовая атака</p>
              <p id="char-atack" style="margin: 5px 0; color: #666;">${character.attack || 'Загрузка'}</p>
            </div>
            <div class="level-group" style="display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 15px;">
              <button class="arrow left" aria-label="Previous Attack" style="background: #6c757d; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 16px;">&lt;</button>
              <span class="level-value" style="font-size: 20px; font-weight: bold; min-width: 30px;">${displayData.attackLevel}</span>
              <button class="arrow right" aria-label="Next Attack" style="background: #28a745; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 16px;">&gt;</button>
            </div>
          </div>
          
          <div class="section" data-group="skill" style="margin: 15px 0; padding: 20px; border: 2px solid #e0e0e0; border-radius: 10px; background: #f9f9f9;">
            <div id="char-s2" style="font-size: 24px; margin-bottom: 10px; text-align: center;">
              ${character.s2 ? `<img src="${character.s2}" alt="Skill Icon" style="width: 40px; height: 40px;">` : '🌀'}
            </div>
            <div class="atk_icon" style="text-align: center;">
              <p style="margin: 5px 0; font-weight: bold; color: #333;">Элементальный навык</p>
              <p id="char-skill" style="margin: 5px 0; color: #666;">${character.skill || 'Загрузка'}</p>
            </div>
            <div class="level-group" style="display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 15px;">
              <button class="arrow left" aria-label="Previous skill" style="background: #6c757d; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 16px;">&lt;</button>
              <span class="level-value" style="font-size: 20px; font-weight: bold; min-width: 30px;">${displayData.skillLevel}</span>
              <button class="arrow right" aria-label="Next Skill" style="background: #28a745; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 16px;">&gt;</button>
            </div>
          </div>
          
          <div class="section" data-group="explosion" style="margin: 15px 0; padding: 20px; border: 2px solid #e0e0e0; border-radius: 10px; background: #f9f9f9;">
            <div id="char-s3" style="font-size: 24px; margin-bottom: 10px; text-align: center;">
              ${character.s3 ? `<img src="${character.s3}" alt="Explosion Icon" style="width: 40px; height: 40px;">` : '💥'}
            </div>
            <div class="atk_icon" style="text-align: center;">
              <p style="margin: 5px 0; font-weight: bold; color: #333;">Взрыв стихии</p>
              <p id="char-explosion" style="margin: 5px 0; color: #666;">${character.explosion || 'Загрузка'}</p>
            </div>
            <div class="level-group" style="display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 15px;">
              <button class="arrow left" aria-label="Previous Explosion" style="background: #6c757d; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 16px;">&lt;</button>
              <span class="level-value" style="font-size: 20px; font-weight: bold; min-width: 30px;">${displayData.explosionLevel}</span>
              <button class="arrow right" aria-label="Next Explosion" style="background: #28a745; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 16px;">&gt;</button>
            </div>
          </div>
        </div>
      </article>
    </section>
    
    <div id="char-description" style="margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 10px; border-left: 4px solid #4CAF50;">
      <h3 style="margin-top: 0; color: #333;">Описание</h3>
      <p style="margin: 0; line-height: 1.6;">${character[`${lang}_bio`] || character.description || 'Описание персонажа...'}</p>
    </div>
  `;

  // Кнопки действий
  const buttonContainer = document.createElement('div');

  const backButton = document.createElement('button');
  backButton.textContent = translations[lang]?.back || 'Назад';

  backButton.addEventListener('click', () => {
    materialsModal.remove();
    openCharacterModal(character.key || 'unknown', character, lang);
  });

  const nextButton = document.createElement('button');
  nextButton.textContent = translations[lang]?.continue || 'Продолжить';
  nextButton.className = 'next';
  nextButton.id = 'next-btn';
  
  nextButton.addEventListener('click', async () => {
    // Собираем данные из полей ввода
    const charName = character[`${lang}_name`] || character.en_name;
    const rangeValue = parseInt(document.getElementById('range')?.value) || 0;
    const level = parseInt(document.querySelector('.current-level-display')?.textContent) || 1;
    const attackLevel = parseInt(document.querySelector('.section[data-group="attack"] .level-value')?.textContent) || 1;
    const skillLevel = parseInt(document.querySelector('.section[data-group="skill"] .level-value')?.textContent) || 1;
    const explosionLevel = parseInt(document.querySelector('.section[data-group="explosion"] .level-value')?.textContent) || 1;

    console.log('Данные из модального окна:', {
      rangeValue,
      level, 
      attackLevel,
      skillLevel,
      explosionLevel
    });

    // Сохраняем ВСЕ данные в localStorage
    const dataToSave = {
      charName,
      rangeVal: rangeValue,
      level: level,
      attackLevel: attackLevel,
      skillLevel: skillLevel,
      explosionLevel: explosionLevel,
      timestamp: Date.now(),
      characterData: {
        key: character.key,
        ...character
      }
    };
    
    // Сохраняем данные для скрипта материалов
    localStorage.setItem('characterLevelData', JSON.stringify(dataToSave));
    
    // Также сохраняем отдельно для быстрого доступа
    localStorage.setItem('characterData', JSON.stringify({
      charName: character.en_name,
      charKey: character.key,
      rangeVal: rangeValue,
      level: level,
      attackLevel: attackLevel,
      skillLevel: skillLevel,
      explosionLevel: explosionLevel,
      lang: lang,
      fullCharacterData: character
    }));
    
    // Сохраняем персонажа
    localStorage.setItem('selectedCharacter', JSON.stringify({
      key: character.key,
      data: character,
      lang: lang
    }));

    console.log('Все данные сохранены в localStorage:', dataToSave);
    
    // Закрываем модальное окно
    materialsModal.remove();

    // Переходим на страницу материалов
    console.log('Переходим на страницу материалов');
    navigateToCharacterPage('materials', character, lang);
  });

  buttonContainer.appendChild(backButton);
  buttonContainer.appendChild(nextButton);

  // Собираем модальное окно
  modalContent.appendChild(closeBtn);
  modalContent.appendChild(header);
  modalContent.appendChild(content);
  modalContent.appendChild(buttonContainer);
  materialsModal.appendChild(modalContent);
  document.body.appendChild(materialsModal);

  // Добавляем функционал слайдера
  setTimeout(() => {
    addSliderFunctionality();
  }, 100);

  // Закрытие модального окна при клике вне его
  materialsModal.addEventListener('click', (e) => {
    if (e.target === materialsModal) {
      materialsModal.remove();
      openCharacterModal(character.key || 'unknown', character, lang);
    }
  });
}

// Функция для сброса данных персонажа
function resetCharacterData() {
  console.log('Сбрасываем данные персонажа');
  localStorage.removeItem('characterLevelData');
  localStorage.removeItem('characterData');
  
  // Удаляем флаг загрузки из сохранения
  localStorage.removeItem('isLoadingFromSave');
  localStorage.removeItem('loadedFromSave');
}

// Функция для добавления функционала слайдера
function addSliderFunctionality() {
  const rangeInput = document.getElementById('range');
  const rangeValueSpan = document.getElementById('range-value');
  const currentLevelDisplay = document.querySelector('.current-level-display');
  const minusRangeBtn = document.getElementById('minus-range');
  const plusRangeBtn = document.getElementById('plus-range');

  if (!rangeInput || !rangeValueSpan || !currentLevelDisplay) return;

  function getCustomNumber(value) {
    const val = parseInt(value);
    if (val >= 70) return 90;
    else if (val >= 60) return 80;
    else if (val >= 50) return 70;
    else if (val >= 40) return 60;
    else if (val >= 30) return 50;
    else if (val >= 20) return 40;
    else if (val >= 10) return 20;
    else return 1;
  }

  function getMaxLevel(rangeVal) {
    const val = parseInt(rangeVal);
    if (val >= 70) return 10;
    else if (val >= 60) return 8;
    else if (val >= 50) return 6;
    else if (val >= 40) return 4;
    else if (val >= 30) return 2;
    else return 1;
  }

  function updateRange(val) {
    const minVal = parseInt(rangeInput.min);
    const maxVal = parseInt(rangeInput.max);
    if (val < minVal) val = minVal;
    if (val > maxVal) val = maxVal;

    rangeInput.value = val;
    rangeValueSpan.textContent = val;
    currentLevelDisplay.textContent = getCustomNumber(val);

    document.querySelectorAll('.section').forEach(section => {
      const levelSpan = section.querySelector('.level-value');
      let currentLevel = parseInt(levelSpan.textContent);
      const maxLevel = getMaxLevel(val);
      if (currentLevel > maxLevel) {
        levelSpan.textContent = maxLevel;
      }
    });
  }

  // Инициализация значений
  // Используем значения из HTML, которые уже установлены
  const initialRangeValue = parseInt(rangeInput.value) || 0;
  rangeValueSpan.textContent = initialRangeValue;
  currentLevelDisplay.textContent = getCustomNumber(initialRangeValue);

  // Обработчики событий
  if (minusRangeBtn) {
    minusRangeBtn.addEventListener('click', () => {
      let currentVal = parseInt(rangeInput.value);
      updateRange(currentVal - 10);
    });
  }

  if (plusRangeBtn) {
    plusRangeBtn.addEventListener('click', () => {
      let currentVal = parseInt(rangeInput.value);
      updateRange(currentVal + 10);
    });
  }

  rangeInput.addEventListener('input', () => {
    const val = +rangeInput.value;
    rangeValueSpan.textContent = val;
    currentLevelDisplay.textContent = getCustomNumber(val);
  });

  document.querySelectorAll('.section').forEach(section => {
    const minusBtn = section.querySelector('.arrow.left');
    const plusBtn = section.querySelector('.arrow.right');
    const levelSpan = section.querySelector('.level-value');

    if (minusBtn && levelSpan) {
      minusBtn.addEventListener('click', () => {
        let level = parseInt(levelSpan.textContent);
        if (level > 1) {
          level--;
          levelSpan.textContent = level;
        }
      });
    }

    if (plusBtn && levelSpan) {
      plusBtn.addEventListener('click', () => {
        let level = parseInt(levelSpan.textContent);
        const maxLevel = getMaxLevel(parseInt(rangeInput.value));
        if (level < maxLevel) {
          level++;
          levelSpan.textContent = level;
        }
      });
    }
  });
}