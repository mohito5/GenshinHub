// js/modules/character-detail-module.js
import { charsData } from '../characterData.js';
import { translations } from '../translations.js';

// Слушатель для смены языка
let characterDetailLanguageHandler = null;

export function initCharacterDetailPage(pageId) {
  console.log('=== ИНИЦИАЛИЗАЦИЯ ПОДСТРАНИЦЫ ПЕРСОНАЖА ===');
  console.log('pageId:', pageId);
  console.log('Текущий язык:', window.currentLang);
  console.log('localStorage selectedCharacter:', localStorage.getItem('selectedCharacter'));
  console.log('localStorage characterLevelData:', localStorage.getItem('characterLevelData'));
  console.log('localStorage characterData:', localStorage.getItem('characterData'));
  
  // Получаем данные из localStorage
  const savedCharacter = localStorage.getItem('characterLevelData') || localStorage.getItem('characterData');
  const selectedChar = localStorage.getItem('selectedCharacter');
  
  if (!savedCharacter && !selectedChar) {
    console.error('Нет данных персонажа в localStorage');
    showErrorMessage('Нет данных персонажа. Выберите персонажа заново.');
    return;
  }
  
  let characterData = null;
  let levelData = null;
  
  try {
    if (savedCharacter) {
      levelData = JSON.parse(savedCharacter);
      console.log('Загружены данные уровней:', levelData);
    }
    
    if (selectedChar) {
      const parsed = JSON.parse(selectedChar);
      characterData = parsed.data || charsData[parsed.key];
      console.log('Загружены данные персонажа:', characterData?.en_name);
    } else if (levelData && levelData.charKey) {
      characterData = charsData[levelData.charKey] || levelData.characterData || levelData.fullCharacterData;
    }
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    showErrorMessage('Ошибка загрузки данных персонажа.');
    return;
  }
  
  if (!characterData) {
    console.error('Не удалось загрузить данные персонажа');
    showErrorMessage('Не удалось загрузить данные персонажа.');
    return;
  }
  
  const currentLang = window.currentLang || 'ru';
  
  // Добавляем слушатель для смены языка если его еще нет
  if (!characterDetailLanguageHandler) {
    characterDetailLanguageHandler = (e) => {
      console.log('Смена языка на детальной странице персонажа:', e.detail.lang);
      updateCharacterDetailPage(e.detail.lang);
    };
    document.addEventListener('languageChange', characterDetailLanguageHandler);
  }
  
  // В зависимости от страницы вызываем соответствующую функцию
  switch (pageId) {
    case 'characters/mat':
      initMaterialsPage(characterData, levelData, currentLang);
      break;
    case 'characters/info':
      initInfoPage(characterData, levelData, currentLang);
      break;
    case 'characters/guide':
      initGuidePage(characterData, levelData, currentLang);
      break;
  }
  
  console.log('==========================================');
}

function initMaterialsPage(characterData, levelData, lang) {
  console.log('Инициализация страницы материалов для:', characterData.en_name);
  
  const translationsObj = translations[lang] || translations['ru'];
  
  // Обновляем заголовок и иконку
  const charNameElement = document.getElementById('char-name');
  const charIconElement = document.getElementById('char-icon');
  
  if (charNameElement) {
    const charName = characterData[`${lang}_name`] || characterData.en_name;
    charNameElement.textContent = charName;
    console.log('Установлено имя:', charName);
  }
  
  if (charIconElement && characterData.avatar_icon) {
    const charName = characterData[`${lang}_name`] || characterData.en_name;
    charIconElement.innerHTML = `<img src="${characterData.avatar_icon}" alt="${charName}" style="width: 100px; height: 100px; border-radius: 50%;">`;
  }
  
  // Обновляем уровни из сохраненных данных
  if (levelData) {
    // Уровень персонажа
    const levelElement = document.getElementById('lvl');
    if (levelElement) {
      levelElement.textContent = levelData.level || 1;
      console.log('Уровень персонажа:', levelData.level);
    }
    
    // Уровень атаки
    const attackLevelElement = document.getElementById('lvl-attack');
    if (attackLevelElement) {
      attackLevelElement.textContent = levelData.attackLevel || 1;
      console.log('Уровень атаки:', levelData.attackLevel);
    }
    
    // Уровень навыка
    const skillLevelElement = document.getElementById('lvl-skill');
    if (skillLevelElement) {
      skillLevelElement.textContent = levelData.skillLevel || 1;
      console.log('Уровень навыка:', levelData.skillLevel);
    }
    
    // Уровень взрыва
    const explosionLevelElement = document.getElementById('lvl-explosion');
    if (explosionLevelElement) {
      explosionLevelElement.textContent = levelData.explosionLevel || 1;
      console.log('Уровень взрыва:', levelData.explosionLevel);
    }
  }
  
  // Загружаем материалы (заглушка - нужно реализовать отдельно)
  loadMaterials(characterData, levelData, lang);
}

function initInfoPage(characterData, levelData, lang) {
  console.log('Инициализация информационной страницы для:', characterData.en_name);
  
  const translationsObj = translations[lang] || translations['ru'];
  
  // Обновляем основную информацию
  updateBasicInfo(characterData, lang);
  
  // Обновляем статистику
  updateStats(characterData, levelData, lang);
  
  // Обновляем таланты
  updateTalents(characterData, levelData, lang);
  
  // Обновляем созвездия
  updateConstellations(characterData, lang);
  
  // Применяем переводы для всех элементов с data-i18n
  applyTranslationsToPage(lang);
}

function initGuidePage(characterData, levelData, lang) {
  console.log('Инициализация страницы гайда для:', characterData.en_name);
  
  const charNameElement = document.getElementById('guide-name');
  const charIconElement = document.getElementById('guide-icon');
  
  if (charNameElement) {
    const charName = characterData[`${lang}_name`] || characterData.en_name;
    charNameElement.textContent = charName;
  }
  
  if (charIconElement && characterData.avatar_icon) {
    const charName = characterData[`${lang}_name`] || characterData.en_name;
    charIconElement.innerHTML = `<img src="${characterData.avatar_icon}" alt="${charName}">`;
  }
  
  // Применяем переводы для всех элементов с data-i18n
  applyTranslationsToPage(lang);
}

function updateBasicInfo(characterData, lang) {
  const translationsObj = translations[lang] || translations['ru'];
  
  // Имя персонажа
  const charNameElement = document.getElementById('char-name');
  if (charNameElement) {
    charNameElement.textContent = characterData[`${lang}_name`] || characterData.en_name;
  }
  
  // Иконка
  const charIconElement = document.getElementById('char-icon');
  if (charIconElement && characterData.avatar_icon) {
    const charName = characterData[`${lang}_name`] || characterData.en_name;
    charIconElement.innerHTML = `<img src="${characterData.avatar_icon}" alt="${charName}">`;
  }
  
  // Описание
  const descriptionElement = document.getElementById('char-description');
  if (descriptionElement) {
    const description = characterData[`${lang}_bio`] || characterData.description || translationsObj['default.noDescription'] || 'Описание отсутствует';
    descriptionElement.textContent = description;
  }
  
  // Элемент
  const elementElement = document.getElementById('char-element');
  if (elementElement && characterData.element) {
    elementElement.textContent = translationsObj['elements']?.[characterData.element] || characterData.element;
  }
  
  // Оружие
  const weaponElement = document.getElementById('char-weapon');
  if (weaponElement && characterData.weapon) {
    weaponElement.textContent = translationsObj['weapons']?.[characterData.weapon] || characterData.weapon;
  }
  
  // Редкость
  const rarityElement = document.getElementById('char-rarity');
  if (rarityElement && characterData.rarity) {
    const stars = '★'.repeat(parseInt(characterData.rarity));
    rarityElement.textContent = stars;
  }
}

function updateStats(characterData, levelData, lang) {
  const translationsObj = translations[lang] || translations['ru'];
  
  // Устанавливаем уровень из сохраненных данных
  const level = levelData?.level || 1;
  const rangeValue = levelData?.rangeVal || 0;
  
  const levelElement = document.getElementById('lvl');
  const rangeElement = document.getElementById('range');
  const outElement = document.getElementById('out');
  
  if (levelElement) {
    levelElement.textContent = level;
    console.log('Установлен уровень персонажа:', level);
  }
  
  if (rangeElement) {
    rangeElement.value = rangeValue;
    console.log('Установлен range value:', rangeValue);
  }
  
  if (outElement) {
    outElement.textContent = rangeValue;
  }
  
  // Добавляем функционал слайдера
  if (rangeElement && outElement) {
    rangeElement.addEventListener('input', () => {
      outElement.textContent = rangeElement.value;
      // Здесь нужно будет обновлять статистику в зависимости от уровня
      // Пока просто обновляем отображение уровня
      if (levelElement) {
        // Преобразуем range value в уровень персонажа
        const rangeVal = parseInt(rangeElement.value);
        let newLevel = 1;
        if (rangeVal >= 70) newLevel = 90;
        else if (rangeVal >= 60) newLevel = 80;
        else if (rangeVal >= 50) newLevel = 70;
        else if (rangeVal >= 40) newLevel = 60;
        else if (rangeVal >= 30) newLevel = 50;
        else if (rangeVal >= 20) newLevel = 40;
        else if (rangeVal >= 10) newLevel = 20;
        
        levelElement.textContent = newLevel;
      }
    });
  }
  
  // Здесь можно добавить загрузку реальной статистики персонажа
  // по данным из characterData.stats или других полей
}

function updateTalents(characterData, levelData, lang) {
  const translationsObj = translations[lang] || translations['ru'];
  
  // Устанавливаем уровни талантов из сохраненных данных
  const attackLevel = levelData?.attackLevel || 1;
  const skillLevel = levelData?.skillLevel || 1;
  const explosionLevel = levelData?.explosionLevel || 1;
  
  const attackLevelElement = document.getElementById('attack-level');
  const skillLevelElement = document.getElementById('skill-level');
  const explosionLevelElement = document.getElementById('burst-level');
  
  if (attackLevelElement) {
    attackLevelElement.textContent = attackLevel;
    console.log('Уровень атаки:', attackLevel);
  }
  
  if (skillLevelElement) {
    skillLevelElement.textContent = skillLevel;
    console.log('Уровень навыка:', skillLevel);
  }
  
  if (explosionLevelElement) {
    explosionLevelElement.textContent = explosionLevel;
    console.log('Уровень взрыва:', explosionLevel);
  }
  
  // Обновляем иконки талантов
  const s1Element = document.getElementById('char-s1');
  const s2Element = document.getElementById('char-s2');
  const s3Element = document.getElementById('char-s3');
  
  if (s1Element && characterData.s1) {
    s1Element.innerHTML = `<img src="${characterData.s1}" alt="Атака">`;
  }
  
  if (s2Element && characterData.s2) {
    s2Element.innerHTML = `<img src="${characterData.s2}" alt="Навык">`;
  }
  
  if (s3Element && characterData.s3) {
    s3Element.innerHTML = `<img src="${characterData.s3}" alt="Взрыв стихии">`;
  }
  
  // Обновляем названия талантов
  const attackNameElement = document.getElementById('char-atack-name');
  if (attackNameElement) {
    attackNameElement.textContent = characterData[`${lang}_attack`] || characterData.attack || 'Обычная атака';
  }
  
  const skillNameElement = document.getElementById('char-skill-name');
  if (skillNameElement) {
    skillNameElement.textContent = characterData[`${lang}_skill`] || characterData.skill || 'Элементальный навык';
  }
  
  const burstNameElement = document.getElementById('char-burst-name');
  if (burstNameElement) {
    burstNameElement.textContent = characterData[`${lang}_explosion`] || characterData.explosion || 'Взрыв стихии';
  }
  
  // Обновляем описания талантов
  const attackDescElement = document.getElementById('des-attack');
  if (attackDescElement) {
    attackDescElement.textContent = characterData[`${lang}_des_attack`] || characterData.des_attack || 'Описание атаки';
  }
  
  const skillDescElement = document.getElementById('des-skill');
  if (skillDescElement) {
    skillDescElement.textContent = characterData[`${lang}_des_skill`] || characterData.des_skill || 'Описание навыка';
  }
  
  const burstDescElement = document.getElementById('des-burst');
  if (burstDescElement) {
    burstDescElement.textContent = characterData[`${lang}_des_burst`] || characterData.des_burst || 'Описание взрыва стихии';
  }
}

function updateConstellations(characterData, lang) {
  const container = document.getElementById('constellations-container');
  if (!container || !characterData.constellations) {
    console.log('Нет созвездий или контейнера');
    return;
  }
  
  console.log('Обновление созвездий:', characterData.constellations);
  
  const constellations = characterData.constellations;
  container.innerHTML = '';
  
  // Создаем карточки созвездий
  Object.keys(constellations).forEach((constKey, index) => {
    const constellation = constellations[constKey];
    
    const constellationElement = document.createElement('div');
    constellationElement.className = 'constellation-card';
    
    const constellationName = constellation[`${lang}_name`] || constellation.name || `Созвездие ${index + 1}`;
    const constellationDescription = constellation[`${lang}_description`] || constellation.description || '';
    
    constellationElement.innerHTML = `
      <div class="constellation-header">
        <span class="constellation-number">C${index + 1}</span>
        <h4 class="constellation-name">${constellationName}</h4>
      </div>
      <div class="constellation-description">
        <p>${constellationDescription}</p>
      </div>
    `;
    
    container.appendChild(constellationElement);
  });
  
  console.log('Созвездия обновлены, создано:', Object.keys(constellations).length, 'карточек');
}

function loadMaterials(characterData, levelData, lang) {
  console.log('Загрузка материалов для персонажа:', characterData.en_name);
  
  // Здесь будет код для загрузки материалов
  // Пока просто показываем сообщение
  const containers = document.querySelectorAll('.materials-container');
  containers.forEach(container => {
    const type = container.getAttribute('data-type');
    container.innerHTML = `<p style="padding: 20px; text-align: center; color: #666;">
      Материалы для ${type} (функциональность в разработке)
    </p>`;
  });
}

function showErrorMessage(message) {
  const content = document.getElementById('character-content') || 
                  document.getElementById('guide-content') ||
                  document.querySelector('.character-detail-page') ||
                  document.querySelector('.character-guide-page');
  
  if (content) {
    content.innerHTML = `
      <div class="error-message" style="
        text-align: center;
        padding: 40px 20px;
        color: #666;
      ">
        <h2 style="color: #f44336; margin-bottom: 20px;">Ошибка</h2>
        <p style="margin-bottom: 30px;">${message}</p>
        <button onclick="window.history.back()" style="
          padding: 12px 24px;
          background: #2196F3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        ">Вернуться назад</button>
      </div>
    `;
  }
}

function applyTranslationsToPage(lang) {
  const translationsObj = translations[lang] || translations['ru'];
  
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translatedText = translationsObj[key] || key;
    
    if (element.tagName === 'IMG') {
      element.alt = translatedText;
    } else {
      element.textContent = translatedText;
    }
  });
}

// Функция для динамического обновления имени персонажа на странице материалов
function updateCharacterMaterialsPageLang(lang) {
  const savedChar = localStorage.getItem('selectedCharacter');
  if (!savedChar) return;
  
  try {
    const { data } = JSON.parse(savedChar);
    
    // Обновляем имя персонажа везде на странице
    const nameElements = document.querySelectorAll('#char-name, .page-title, .char-name-title');
    nameElements.forEach(el => {
      if (el) {
        const charName = data[`${lang}_name`] || data.en_name;
        el.textContent = charName;
      }
    });
    
    // Обновляем аватар
    const avatarElements = document.querySelectorAll('#char-icon img, .char-avatar img');
    avatarElements.forEach(avatar => {
      if (avatar && data.avatar) {
        avatar.alt = data[`${lang}_name`] || data.en_name;
      }
    });
    
    // Обновляем заголовок страницы если есть
    const pageTitle = document.querySelector('.page.characters h1');
    if (pageTitle) {
      const translationsObj = translations[lang] || translations['ru'];
      pageTitle.textContent = translationsObj['materialsPage.title'] || 'Материалы для развития';
    }
    
  } catch (error) {
    console.error('Ошибка обновления языка страницы материалов:', error);
  }
}

// Функция для динамической локализации страницы информации
function localizeCharacterInfoPage(lang) {
  const savedChar = localStorage.getItem('selectedCharacter');
  if (!savedChar) return;
  
  try {
    const { data } = JSON.parse(savedChar);
    const translationsObj = translations[lang] || translations['ru'];
    
    // Обновляем имя персонажа
    const nameElements = document.querySelectorAll('#char-name, .character-detail-page h1');
    nameElements.forEach(el => {
      if (el && el.id === 'char-name') {
        el.textContent = data[`${lang}_name`] || data.en_name;
      }
    });
    
    // Обновляем описание
    const descElement = document.getElementById('char-description');
    if (descElement && data.description) {
      descElement.textContent = data.description;
    }
    
    // Обновляем основную информацию
    const elementElement = document.getElementById('char-element');
    if (elementElement && data.element) {
      elementElement.textContent = translationsObj['elements']?.[data.element] || data.element;
    }
    
    const weaponElement = document.getElementById('char-weapon');
    if (weaponElement && data.weapon) {
      weaponElement.textContent = translationsObj['weapons']?.[data.weapon] || data.weapon;
    }
    
    const rarityElement = document.getElementById('char-rarity');
    if (rarityElement && data.rarity) {
      const stars = '★'.repeat(parseInt(data.rarity));
      rarityElement.textContent = stars;
    }
    
    // Обновляем названия талантов
    const attackNameElement = document.getElementById('char-atack-name');
    if (attackNameElement && data.attack) {
      attackNameElement.textContent = data.attack;
    }
    
    const skillNameElement = document.getElementById('char-skill-name');
    if (skillNameElement && data.skill) {
      skillNameElement.textContent = data.skill;
    }
    
    const burstNameElement = document.getElementById('char-burst-name');
    if (burstNameElement && data.explosion) {
      burstNameElement.textContent = data.explosion;
    }
    
    // Обновляем описания талантов
    const attackDescElement = document.getElementById('des-attack');
    if (attackDescElement && data.des_attack) {
      attackDescElement.innerHTML = data.des_attack;
    }
    
    const skillDescElement = document.getElementById('des-skill');
    if (skillDescElement && data.des_skill) {
      skillDescElement.textContent = data.des_skill;
    } else if (skillDescElement && data.skill) {
      skillDescElement.textContent = data.skill;
    }
    
    const burstDescElement = document.getElementById('des-burst');
    if (burstDescElement && data.des_burst) {
      burstDescElement.textContent = data.des_burst;
    } else if (burstDescElement && data.explosion) {
      burstDescElement.textContent = data.explosion;
    }
    
    // Обновляем созвездия
    updateConstellationsLocalization(data, lang);
    
    // Обновляем заголовки секций
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translatedText = translationsObj[key] || key;
      
      if (element.tagName === 'IMG') {
        element.alt = translatedText;
      } else {
        element.textContent = translatedText;
      }
    });
    
  } catch (error) {
    console.error('Ошибка локализации страницы информации:', error);
  }
}

// Функция для обновления локализации созвездий
function updateConstellationsLocalization(characterData, lang) {
  const container = document.getElementById('constellations-container');
  if (!container || !characterData.constellations) return;
  
  const constellations = characterData.constellations;
  const translationsObj = translations[lang] || translations['ru'];
  
  // Обновляем текст каждого созвездия
  Object.keys(constellations).forEach((constKey, index) => {
    const constellation = constellations[constKey];
    const constellationElement = container.querySelector(`.constellation-card:nth-child(${index + 1})`);
    
    if (constellationElement) {
      const nameElement = constellationElement.querySelector('.constellation-name');
      const descElement = constellationElement.querySelector('.constellation-description');
      
      if (nameElement && constellation.name) {
        nameElement.textContent = `${index + 1}. ${constellation.name[lang] || constellation.name.ru || constellation.name.en || ''}`;
      }
      
      if (descElement && constellation.description) {
        descElement.textContent = constellation.description[lang] || constellation.description.ru || constellation.description.en || '';
      }
    }
  });
}

// Функция для заполнения данных персонажа на детальных страницах
function fillCharacterDetailData(pageId, character, lang) {
  console.log('Заполнение данных персонажа для страницы:', pageId);
  
  const prefix = pageId.split('/')[1] || 'mat';
  
  // Обновляем имя персонажа
  const nameElement = document.getElementById(`${prefix}-name`) || document.getElementById('char-name');
  if (nameElement) {
    nameElement.textContent = character[`${lang}_name`] || character.en_name;
  }
  
  // Обновляем аватар
  const avatar = document.getElementById(`${prefix}-avatar`) || document.getElementById('char-icon')?.querySelector('img');
  if (avatar && character.avatar) {
    avatar.src = character.avatar;
    avatar.alt = character[`${lang}_name`] || character.en_name;
  }
  
  // Для страницы материалов
  if (pageId === 'characters/mat') {
    const levelData = JSON.parse(localStorage.getItem('characterLevelData') || '{}');
    
    const levelElements = [
      { id: 'lvl', value: levelData.level || 1 },
      { id: 'lvl-attack', value: levelData.attackLevel || 1 },
      { id: 'lvl-skill', value: levelData.skillLevel || 1 },
      { id: 'lvl-explosion', value: levelData.explosionLevel || 1 }
    ];
    
    levelElements.forEach(({ id, value }) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });
    
  } else if (pageId === 'characters/info') {
    // Для страницы информации заполняем базовые данные
    const descriptionElement = document.getElementById('char-description');
    if (descriptionElement) {
      descriptionElement.textContent = character.description || character.bio || 'Описание отсутствует';
    }
    
    // Заполняем основные характеристики
    const infoElements = [
      { id: 'char-element', value: character.element },
      { id: 'char-weapon', value: character.weapon },
      { id: 'char-rarity', value: character.rarity }
    ];
    
    const translationsObj = translations[lang] || translations['ru'];
    
    infoElements.forEach(({ id, value }) => {
      const element = document.getElementById(id);
      if (element && value) {
        if (id === 'char-element') {
          element.textContent = translationsObj['elements']?.[value] || value;
        } else if (id === 'char-weapon') {
          element.textContent = translationsObj['weapons']?.[value] || value;
        } else if (id === 'char-rarity') {
          element.textContent = '★'.repeat(parseInt(value) || 5);
        }
      }
    });
    
    // Заполняем иконки навыков
    const skillIcons = {
      'char-s1': character.s1,
      'char-s2': character.s2,
      'char-s3': character.s3
    };
    
    Object.entries(skillIcons).forEach(([id, icon]) => {
      const element = document.getElementById(id);
      if (element && icon) {
        element.innerHTML = `<img src="${icon}" alt="Skill Icon" style="width: 50px; height: 50px;">`;
      }
    });
    
    // Заполняем названия атак
    const skillNames = {
      'char-atack': character.attack,
      'char-skill': character.skill,
      'char-explosion': character.explosion
    };
    
    Object.entries(skillNames).forEach(([id, name]) => {
      const element = document.getElementById(id);
      if (element && name) {
        element.textContent = name;
      }
    });
    
    // Заполняем описание атаки
    const desAttackElement = document.getElementById('des-attack');
    if (desAttackElement && character.des_attack) {
      desAttackElement.innerHTML = character.des_attack;
    }
    
    // Заполняем иконку персонажа в секции characters
    const charIconElement = document.getElementById('char-icon');
    if (charIconElement && character.avatar) {
      charIconElement.innerHTML = `<img src="${character.avatar_icon || character.avatar}" alt="${character[`${lang}_name`] || character.en_name}" style="width: 100px; height: 100px; border-radius: 50%;">`;
    }
    
  } else if (pageId === 'characters/guide') {
    // Для страницы гайда
    const guideIcon = document.getElementById('guide-icon');
    if (guideIcon && character.avatar) {
      guideIcon.innerHTML = `<img src="${character.avatar}" alt="${character[`${lang}_name`] || character.en_name}">`;
    }
  }
}

// Функция для обновления данных на детальной странице при смене языка
export function updateCharacterDetailPage(lang) {
  console.log('Обновление детальной страницы персонажа на язык:', lang);
  
  const savedChar = localStorage.getItem('selectedCharacter');
  if (!savedChar) {
    console.warn('Нет сохраненного персонажа в selectedCharacter');
    return;
  }
  
  try {
    const { data: characterData } = JSON.parse(savedChar);
    console.log('Данные персонажа для обновления:', characterData?.en_name);
    
    if (!characterData) {
      console.error('Нет данных персонажа для обновления');
      return;
    }
    
    const translationsObj = translations[lang] || translations['ru'];
    
    // В зависимости от текущей страницы вызываем соответствующую функцию
    const currentPage = window.currentPageId || getCurrentPageFromURL();
    
    if (currentPage === 'characters/mat') {
      updateCharacterMaterialsPageLang(lang);
    } else if (currentPage === 'characters/info') {
      localizeCharacterInfoPage(lang);
    } else if (currentPage === 'characters/guide') {
      // Обновляем страницу гайда
      const guideNameElement = document.getElementById('guide-name');
      if (guideNameElement) {
        guideNameElement.textContent = characterData[`${lang}_name`] || characterData.en_name;
      }
    }
    
    // Обновляем все элементы с data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translatedText = translationsObj[key] || key;
      
      if (element.tagName === 'IMG') {
        element.alt = translatedText;
      } else {
        element.textContent = translatedText;
      }
    });
    
    console.log('Детальная страница персонажа обновлена на язык:', lang);
    
  } catch (error) {
    console.error('Ошибка обновления детальной страницы:', error);
  }
}

// Вспомогательная функция для получения текущей страницы из URL
function getCurrentPageFromURL() {
  const hash = window.location.hash;
  if (hash.startsWith('#/')) {
    return hash.substring(2);
  }
  return 'home';
}

// Функция для очистки слушателей
export function cleanupCharacterSubpages() {
  if (characterDetailLanguageHandler) {
    document.removeEventListener('languageChange', characterDetailLanguageHandler);
    characterDetailLanguageHandler = null;
    console.log('Слушатели детальных страниц персонажа очищены');
  }
}

// Экспорт для тестирования
export { 
  initCharacterDetailPage,
  cleanupCharacterSubpages,
  updateCharacterDetailPage,
  updateCharacterMaterialsPageLang, 
  localizeCharacterInfoPage, 
  updateConstellationsLocalization,
  fillCharacterDetailData,
  initMaterialsPage,
  initInfoPage,
  initGuidePage
};