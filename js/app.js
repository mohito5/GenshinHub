// app.js - исправленная версия с правильной локализацией материалов
import { modalManager } from './modal-manager.js';
import { pageLayouts } from './page-layouts.js';
import { translations } from './translations.js';
import { ServerTimer } from './serverTimer.js';
import { charsData } from './characterData.js';
import { weaponsData as weaponData } from './weaponData.js';
import { renderMiniCalendar } from './calendar.js';
import { renderCharacterCards, createCharacterFilterButton } from './list-char.js';
import { renderWeaponCards, createWeaponFilterButton } from './list-weapon.js';
import { materialCategories, materialsInfo } from './materialsData.js';
import {loadWeaponMaterialsPage, 
  loadWeaponInfoPage, 
  loadWeaponRefinementPage } from'./weapon-pages.js'

// Глобальная переменная для доступа из всех модулей
window.currentLang = localStorage.getItem('lang') || 'ru';
let currentPageId = 'home';
let serverTimer = null;
let resizeTimer;

// Система управления кнопкой обновления
let updateButtonManager = {
  originalData: null,
  initialized: false,
  initTimer: null,
  checkTimer: null,
  
  init: function(character, lang) {
    console.log('Инициализация системы кнопки обновления');
    
    if (this.initTimer) clearTimeout(this.initTimer);
    if (this.checkTimer) clearTimeout(this.checkTimer);
    
    this.initialized = false;
    this.originalData = null;
    
    this.initTimer = setTimeout(() => {
      this.captureInitialState(character, lang);
      this.setupEventListeners();
      this.initialized = true;
      
      setTimeout(() => {
        this.checkForChanges();
      }, 500);
    }, 1500);
  },
  
  captureInitialState: function(character, lang) {
    console.log('Захват начального состояния');
    
    const levelData = JSON.parse(localStorage.getItem('characterLevelData') || '{}');
    const charData = JSON.parse(localStorage.getItem('characterData') || '{}');
    
    const isFromLoad = levelData.isFromLoad === true || charData.isFromLoad === true;
    const isFromProfile = levelData.isFromProfile === true || charData.isFromProfile === true;
    const isFromSave = levelData.isFromSave === true || charData.isFromSave === true;
    
    if (isFromLoad || isFromProfile || isFromSave) {
      this.originalData = {
        inputs: this.sanitizeInputs(charData.userInputs || levelData.userInputs || {}),
        levels: {
          level: this.getCurrentLevelFromDOM(),
          attackLevel: this.getCurrentAttackLevelFromDOM(),
          skillLevel: this.getCurrentSkillLevelFromDOM(),
          explosionLevel: this.getCurrentExplosionLevelFromDOM(),
          rangeVal: this.getCurrentRangeValueFromDOM()
        }
      };
    } else {
      this.originalData = this.getCurrentState();
    }
  },

  sanitizeInputs: function(inputs) {
    const sanitized = {};
    for (const key in inputs) {
      if (inputs.hasOwnProperty(key)) {
        const value = parseInt(inputs[key]) || 0;
        sanitized[key] = value;
      }
    }
    return sanitized;
  },

  getCurrentLevelFromDOM: function() {
    const charLevelElement = document.getElementById('lvl');
    return charLevelElement ? parseInt(charLevelElement.textContent) || 1 : 1;
  },

  getCurrentAttackLevelFromDOM: function() {
    const levelSpans = document.querySelectorAll('.section .level-value');
    return levelSpans.length >= 1 ? parseInt(levelSpans[0].textContent) || 1 : 1;
  },

  getCurrentSkillLevelFromDOM: function() {
    const levelSpans = document.querySelectorAll('.section .level-value');
    return levelSpans.length >= 2 ? parseInt(levelSpans[1].textContent) || 1 : 1;
  },

  getCurrentExplosionLevelFromDOM: function() {
    const levelSpans = document.querySelectorAll('.section .level-value');
    return levelSpans.length >= 3 ? parseInt(levelSpans[2].textContent) || 1 : 1;
  },

  getCurrentRangeValueFromDOM: function() {
    const rangeSlider = document.getElementById('range');
    return rangeSlider ? parseInt(rangeSlider.value) || 0 : 0;
  },
  
  getCurrentState: function() {
    const state = {
      inputs: this.sanitizeInputs(this.getCurrentInputsFromDOM()),
      levels: {
        level: this.getCurrentLevelFromDOM(),
        attackLevel: this.getCurrentAttackLevelFromDOM(),
        skillLevel: this.getCurrentSkillLevelFromDOM(),
        explosionLevel: this.getCurrentExplosionLevelFromDOM(),
        rangeVal: this.getCurrentRangeValueFromDOM()
      }
    };
    return state;
  },

  getCurrentInputsFromDOM: function() {
    const inputs = {};
    const inputElements = document.querySelectorAll('.all .materials-container input[type="number"]');
    
    inputElements.forEach(input => {
      const value = parseInt(input.value) || 0;
      const materialId = input.id.replace('all_', '').replace(/_/g, '.');
      inputs[materialId] = value;
    });
    return inputs;
  },
  
  setupEventListeners: function() {
    console.log('Настройка слушателей событий для кнопки обновления');
    
    document.querySelectorAll('.all .materials-container input[type="number"]').forEach(input => {
      input.addEventListener('input', () => this.onChange());
    });
    
    document.querySelectorAll('.level-group button, .arrow').forEach(button => {
      button.addEventListener('click', () => {
        setTimeout(() => this.onChange(), 100);
      });
    });
    
    const rangeSlider = document.getElementById('range');
    if (rangeSlider) {
      rangeSlider.addEventListener('input', () => this.onChange());
    }
    
    const minusRangeBtn = document.getElementById('minus-range');
    const plusRangeBtn = document.getElementById('plus-range');
    
    if (minusRangeBtn) minusRangeBtn.addEventListener('click', () => this.onChange());
    if (plusRangeBtn) plusRangeBtn.addEventListener('click', () => this.onChange());
  },
  
  onChange: function() {
    if (this.checkTimer) clearTimeout(this.checkTimer);
    this.checkTimer = setTimeout(() => {
      this.checkForChanges();
    }, 300);
  },
  
  checkForChanges: function() {
    if (!this.initialized || !this.originalData) return;
    
    const currentState = this.getCurrentState();
    const hasInputChanges = !this.areInputsEqual(currentState.inputs, this.originalData.inputs);
    const hasLevelChanges = !this.areLevelsEqual(currentState.levels, this.originalData.levels);
    const hasChanges = hasInputChanges || hasLevelChanges;
    
    this.updateButtonState(hasChanges);
  },

  areInputsEqual: function(currentInputs, originalInputs) {
    const allKeys = new Set([
      ...Object.keys(currentInputs || {}),
      ...Object.keys(originalInputs || {})
    ]);
    
    for (const key of allKeys) {
      const currentValue = parseInt(currentInputs[key]) || 0;
      const originalValue = parseInt(originalInputs[key]) || 0;
      if (currentValue !== originalValue) return false;
    }
    return true;
  },

  areLevelsEqual: function(currentLevels, originalLevels) {
    const fields = ['level', 'attackLevel', 'skillLevel', 'explosionLevel', 'rangeVal'];
    for (const field of fields) {
      const currentValue = parseInt(currentLevels[field]) || 0;
      const originalValue = parseInt(originalLevels[field]) || 0;
      if (currentValue !== originalValue) return false;
    }
    return true;
  },
  
  updateButtonState: function(hasChanges) {
    const updateBtn = document.getElementById('update-materials-btn');
    const overwriteBtn = document.getElementById('overwrite-materials-btn');
    
    if (updateBtn) {
      updateBtn.disabled = !hasChanges;
      if (hasChanges) {
        updateBtn.style.opacity = '1';
        updateBtn.style.cursor = 'pointer';
        updateBtn.style.filter = 'none';
      } else {
        updateBtn.style.opacity = '0.5';
        updateBtn.style.cursor = 'not-allowed';
        updateBtn.style.filter = 'grayscale(20%)';
      }
    }
    
    if (overwriteBtn) {
      overwriteBtn.disabled = false;
      overwriteBtn.style.opacity = '1';
      overwriteBtn.style.cursor = 'pointer';
      overwriteBtn.style.filter = 'none';
    }
  },
  
  reset: function() {
    console.log('Сброс системы кнопки обновления');
    this.initialized = false;
    this.originalData = null;
    
    if (this.initTimer) clearTimeout(this.initTimer);
    if (this.checkTimer) clearTimeout(this.checkTimer);
  },
  
  updateAfterSave: function() {
    console.log('Обновление данных после сохранения');
    this.originalData = this.getCurrentState();
    this.checkForChanges();
  }
};

// Глобальный менеджер модальных окон
window.modalManager = modalManager;

// Экспортируем в глобальную область
window.updateButtonManager = updateButtonManager;
window.showPage = showPage;

// Функция для инициации смены языка
function triggerLanguageChange(lang) {
  console.log('Триггер смены языка:', lang);
  const event = new CustomEvent('languageChange', { detail: { lang } });
  document.dispatchEvent(event);
}

// Основная функция установки языка
function setLanguage(lang) {
  if (window.currentLang === lang) return;
  
  console.log('Установка языка:', lang);
  window.currentLang = lang;
  localStorage.setItem('lang', lang);
  
  // Обновляем активные кнопки языка
  updateLanguageButtons(lang);
  
  // Обновляем навигацию
  localizeNavigation(lang);
  
  // Обновляем динамический контент
  retranslateDynamicContent(lang);
  
  // Обновляем таймер сервера
  if (serverTimer) {
    serverTimer.updateLanguage(lang);
  }
  
  moveHighlight();
  
  // Обновляем все зарегистрированные модальные окна
  if (window.modalManager) {
    window.modalManager.translateAll(lang);
  } else {
    // Фолбэк на старый метод
    translateAllModals(lang);
  }

  // Сохраняем выбранный язык для текущего персонажа
  const savedChar = localStorage.getItem('selectedCharacter');
  if (savedChar) {
    try {
      const charData = JSON.parse(savedChar);
      charData.lang = lang;
      localStorage.setItem('selectedCharacter', JSON.stringify(charData));
    } catch (error) {
      console.error('Ошибка сохранения языка персонажа:', error);
    }
  }
}

// Функция обновления кнопок языка
function updateLanguageButtons(lang) {
  console.log('Обновление кнопок языка:', lang);
  
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const langCode = btn.getAttribute('data-lang');
    const translationsObj = translations[lang] || translations['ru'];
    const langText = translationsObj[`nav.lang.${langCode}`] || langCode.toUpperCase();
    
    // Обновляем текст кнопки с переводом
    btn.textContent = langText;
    
    // Устанавливаем активный класс
    if (langCode === lang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Применяет переводы к HTML
function applyTranslations(html, lang) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  tempDiv.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translationsObj = translations[lang] || translations['ru'];
    const translatedText = translationsObj[key] || key;
    
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
  console.log('Локализация навигации:', lang);
  
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

// Функция перевода всех модальных окон
function translateAllModals(lang) {
  console.log('Перевод всех модальных окон:', lang);
  
  const modalSelectors = [
    '.character-modal',
    '.filter-modal',
    '.weapon-filter-modal',
    '.materials-setup-modal',
    '.overwrite-confirm-modal',
    '.load-save-option-modal',
    '.weapon-modal'
  ];
  
  modalSelectors.forEach(selector => {
    const modal = document.querySelector(selector);
    if (modal) {
      translateModal(modal, lang);
    }
  });
  
  // Также обновляем все кнопки на странице
  updateSaveButtonText(lang);
}

// Функция перевода конкретного модального окна
function translateModal(modal, lang) {
  console.log('Перевод модального окна:', modal.className);
  
  const translationsObj = translations[lang] || translations['ru'];
  
  // Общие элементы для всех модальных окон
  modal.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translatedText = translationsObj[key] || key;
    
    if (element.tagName === 'IMG') {
      element.alt = translatedText;
    } else {
      element.textContent = translatedText;
    }
  });
  
  // Специфичная логика для каждого типа модального окна
  if (modal.classList.contains('character-modal')) {
    translateCharacterModal(modal, lang);
  } else if (modal.classList.contains('filter-modal')) {
    translateFilterModal(modal, lang);
  } else if (modal.classList.contains('weapon-filter-modal')) {
    translateWeaponFilterModal(modal, lang);
  } else if (modal.classList.contains('materials-setup-modal')) {
    translateMaterialsSetupModal(modal, lang);
  } else if (modal.classList.contains('overwrite-confirm-modal')) {
    translateOverwriteConfirmModal(modal, lang);
  } else if (modal.classList.contains('load-save-option-modal')) {
    translateLoadSaveOptionModal(modal, lang);
  } else if (modal.classList.contains('weapon-modal')) {
    translateWeaponModal(modal, lang);
  }
}

// Функция для перевода модального окна персонажа
function translateCharacterModal(modal, lang) {
  const translationsObj = translations[lang] || translations['ru'];
  
  const buttons = modal.querySelectorAll('.section-btn');
  const sections = [
    { id: 'materials', label: translationsObj['materials'] || 'Материалы развития' },
    { id: 'info', label: translationsObj['info'] || 'Информация' },
    { id: 'guide', label: translationsObj['guide'] || 'Гайд' }
  ];
  
  buttons.forEach((btn, index) => {
    if (sections[index]) {
      const icon = btn.innerHTML.match(/^[^\s]+/)?.[0] || '📦';
      btn.innerHTML = `${icon} ${sections[index].label}`;
    }
  });
  
  // Обновляем имя персонажа если есть
  const title = modal.querySelector('h2');
  const avatarImg = modal.querySelector('img[alt*="name"]');
  if (title && avatarImg) {
    const charName = extractCharacterNameFromModal(modal);
    if (charName) {
      title.textContent = charName;
      avatarImg.alt = charName;
    }
  }
}

// Функция для перевода модального окна фильтра
function translateFilterModal(modal, lang) {
  console.log('Перевод модального окна фильтра:', modal.className);
  
  const translationsObj = translations[lang] || translations['ru'];
  
  // Проверяем, это фильтр персонажей или оружия
  if (modal.classList.contains('weapon-filter-modal')) {
    // ФИЛЬТР ОРУЖИЯ
    translateWeaponFilterModal(modal, lang);
    return;
  }
  
  // ФИЛЬТР ПЕРСОНАЖЕЙ (оригинальный код)
  const title = modal.querySelector('h2');
  if (title) {
    title.textContent = translationsObj['filter.title'] || 'Фильтр персонажей';
  }
  
  const sectionTitles = modal.querySelectorAll('h3');
  const sections = [
    translationsObj['filter.element'] || 'Стихия',
    translationsObj['filter.weapon'] || 'Оружие',
    translationsObj['filter.rarity'] || 'Редкость'
  ];
  
  sectionTitles.forEach((title, index) => {
    if (sections[index]) title.textContent = sections[index];
  });
  
  // Обновляем опцию "Все"
  const allOptions = modal.querySelectorAll('.filter-option[data-value=""]');
  allOptions.forEach(option => {
    option.textContent = translationsObj['filter.all'] || 'Все';
  });
  
  // Обновляем значения стихий и оружия
  modal.querySelectorAll('.filter-option[data-type="element"]').forEach(option => {
    const value = option.dataset.value;
    if (value && translationsObj['elements']?.[value]) {
      option.textContent = translationsObj['elements'][value];
    }
  });
  
  modal.querySelectorAll('.filter-option[data-type="weapon"]').forEach(option => {
    const value = option.dataset.value;
    if (value && translationsObj['weapons']?.[value]) {
      option.textContent = translationsObj['weapons'][value];
    }
  });
  
  const resetBtn = modal.querySelector('.filter-action-btn.reset');
  const applyBtn = modal.querySelector('.filter-action-btn.apply');
  if (resetBtn) resetBtn.textContent = translationsObj['buttons.reset'] || 'Сбросить';
  if (applyBtn) applyBtn.textContent = translationsObj['buttons.apply'] || 'Применить';
}

// Функция для перевода модального окна фильтра оружия
function translateWeaponFilterModal(modal, lang) {
  console.log('Перевод фильтра оружия:', lang);
  
  const translationsObj = translations[lang] || translations['ru'];
  
  const title = modal.querySelector('h2');
  if (title) {
    title.textContent = translationsObj['filter.weaponTitle'] || 'Фильтр оружия';
  }
  
  const sectionTitles = modal.querySelectorAll('h3');
  const sections = [
    translationsObj['filter.weaponType'] || 'Тип оружия',
    translationsObj['filter.rarity'] || 'Редкость',
    translationsObj['filter.mainStat'] || 'Основная характеристика'
  ];
  
  sectionTitles.forEach((title, index) => {
    if (sections[index]) title.textContent = sections[index];
  });
  
  // Обновляем опцию "Все"
  const allOptions = modal.querySelectorAll('.filter-option[data-value=""]');
  allOptions.forEach(option => {
    option.textContent = translationsObj['filter.all'] || 'Все';
  });
  
  // Обновляем значения типов оружия
  modal.querySelectorAll('.filter-option[data-type="weaponType"]').forEach(option => {
    const value = option.dataset.value;
    if (value && translationsObj['weapons']?.[value]) {
      option.textContent = translationsObj['weapons'][value];
    }
  });
  
  // Обновляем значения характеристик
  modal.querySelectorAll('.filter-option[data-type="stats"]').forEach(option => {
    const value = option.dataset.value;
    if (value && translationsObj['stats']?.[value]) {
      option.textContent = translationsObj['stats'][value];
    }
  });
  
  // Редкость уже отображается звездами, не нужно переводить
  
  const resetBtn = modal.querySelector('.filter-action-btn.reset');
  const applyBtn = modal.querySelector('.filter-action-btn.apply');
  if (resetBtn) resetBtn.textContent = translationsObj['buttons.reset'] || 'Сбросить';
  if (applyBtn) applyBtn.textContent = translationsObj['buttons.apply'] || 'Применить';
}

// Функция для перевода модального окна оружия
function translateWeaponModal(modal, lang) {
  const translationsObj = translations[lang] || translations['ru'];
  
  const buttons = modal.querySelectorAll('.section-btn');
  const sections = [
    { id: 'materials', label: translationsObj['materials'] || 'Материалы развития' },
    { id: 'info', label: translationsObj['info'] || 'Информация' },
    { id: 'refinement', label: translationsObj['refinement'] || 'Пробуждение' }
  ];
  
  buttons.forEach((btn, index) => {
    if (sections[index]) {
      const icon = btn.innerHTML.match(/^[^\s]+/)?.[0] || '📦';
      btn.innerHTML = `${icon} ${sections[index].label}`;
    }
  });
  
  // Обновляем имя оружия если есть
  const title = modal.querySelector('h2');
  const avatarImg = modal.querySelector('img[alt*="name"]');
  if (title && avatarImg) {
    const weaponName = extractWeaponNameFromModal(modal);
    if (weaponName) {
      title.textContent = weaponName;
      avatarImg.alt = weaponName;
    }
  }
  
  // Обновляем тип оружия
  const typeDiv = modal.querySelector('.weapon-modal-type');
  if (typeDiv) {
    const weaponType = typeDiv.textContent;
    const translatedType = translationsObj['weapons']?.[weaponType] || weaponType;
    typeDiv.textContent = translatedType;
  }
}

// Вспомогательная функция для извлечения имени оружия из модального окна
function extractWeaponNameFromModal(modal) {
  const avatar = modal.querySelector('img[alt*="name"]');
  const title = modal.querySelector('h2');
  
  if (!avatar || !title) return null;
  
  // Извлекаем имя оружия из заголовка
  const titleText = title.textContent;
  const parts = titleText.split(' - ');
  return parts[0];
}

// Функция для перевода модального окна настроек материалов
function translateMaterialsSetupModal(modal, lang) {
  const translationsObj = translations[lang] || translations['ru'];
  
  const title = modal.querySelector('h2');
  if (title) {
    const charName = extractCharacterNameFromModal(modal);
    if (charName) {
      title.textContent = `${charName} - ${translationsObj['talentsModal.title'] || 'Настройка уровней'}`;
    }
  }
  
  // Обновляем тексты в контенте
  const content = modal.querySelector('.modal-content > div:nth-child(3)');
  
  if (content) {
    const h2Elements = content.querySelectorAll('h2');
    if (h2Elements.length >= 2) {
      h2Elements[0].textContent = translationsObj['talentsModal.characterLevel'] || 'Уровень персонажа';
      h2Elements[1].textContent = translationsObj['talentsModal.talents'] || 'Уровни талантов';
    }
    
    // Обновляем заголовки секций
    const sectionHeaders = content.querySelectorAll('.section p[style*="font-weight: bold"]');
    if (sectionHeaders.length >= 3) {
      sectionHeaders[0].textContent = translationsObj['talentsModal.attack'] || 'Базовая атака';
      sectionHeaders[1].textContent = translationsObj['talentsModal.skill'] || 'Элементальный навык';
      sectionHeaders[2].textContent = translationsObj['talentsModal.explosion'] || 'Взрыв стихии';
    }
    
    // Обновляем описание
    const descriptionTitle = content.querySelector('#char-description h3');
    if (descriptionTitle) {
      descriptionTitle.textContent = translationsObj['talentsModal.description'] || 'Описание персонажа';
    }
    
    // Обновляем имя персонажа
    const charNameElement = content.querySelector('#char-name');
    if (charNameElement) {
      const charName = extractCharacterNameFromModal(modal);
      if (charName) {
        charNameElement.textContent = charName;
      }
    }
  }
  
  const backBtn = modal.querySelector('button:first-of-type:not(.close-btn)');
  const nextBtn = modal.querySelector('.next, #next-btn');
  if (backBtn) backBtn.textContent = translationsObj['talentsModal.backButton'] || 'Назад к выбору';
  if (nextBtn) nextBtn.textContent = translationsObj['talentsModal.continueButton'] || 'Продолжить';
}

// Функция для перевода модального окна подтверждения перезаписи
function translateOverwriteConfirmModal(modal, lang) {
  const translationsObj = translations[lang] || translations['ru'];
  
  const title = modal.querySelector('h3');
  if (title) title.textContent = translationsObj['overwrite.title'] || 'Перезаписать сохранение?';
  
  const description = modal.querySelector('p');
  if (description) {
    const charMatch = description.innerHTML.match(/<strong[^>]*>([^<]+)<\/strong>/);
    const charName = charMatch ? charMatch[1] : 'Персонаж';
    description.innerHTML = (translationsObj['overwrite.description'] || 'Для {characterName} уже есть сохранение:')
      .replace('{characterName}', `<strong style="color: #333;">${charName}</strong>`);
  }
  
  // Обновляем метки в info-box
  const infoBox = modal.querySelector('.info-box');
  if (infoBox) {
    const paragraphs = infoBox.querySelectorAll('p');
    const labels = [
      translationsObj['overwrite.date'] || 'Дата:',
      translationsObj['overwrite.level'] || 'Уровень:',
      translationsObj['overwrite.talents'] || 'Таланты:',
      translationsObj['overwrite.materialsCount'] || 'Материалы:'
    ];
    
    paragraphs.forEach((p, index) => {
      const span = p.querySelector('span');
      if (span && labels[index]) {
        span.textContent = labels[index];
      }
    });
  }
  
  const warningBox = modal.querySelector('.warning-box');
  if (warningBox) {
    warningBox.innerHTML = translationsObj['overwrite.warning'] || 
      'Старое сохранение будет <strong>безвозвратно удалено</strong> и заменено новым.';
  }
  
  const cancelBtn = modal.querySelector('.action-button.cancel');
  const confirmBtn = modal.querySelector('.action-button.confirm');
  if (cancelBtn) cancelBtn.textContent = translationsObj['buttons.cancel'] || 'Отмена';
  if (confirmBtn) confirmBtn.textContent = translationsObj['buttons.overwrite'] || 'Перезаписать';
}

// Функция для перевода модального окна загрузки сохранения
function translateLoadSaveOptionModal(modal, lang) {
  const translationsObj = translations[lang] || translations['ru'];
  
  const title = modal.querySelector('h3');
  if (title) title.textContent = translationsObj['loadSave.title'] || 'Загручить сохраненные данные?';
  
  const description = modal.querySelector('p');
  if (description) {
    const charMatch = description.innerHTML.match(/<strong[^>]*>([^<]+)<\/strong>/);
    const charName = charMatch ? charMatch[1] : 'Персонаж';
    const dateMatch = description.innerHTML.match(/<strong[^>]*>([^<]+)<\/strong>/g);
    const saveDate = dateMatch && dateMatch[1] ? dateMatch[1] : new Date().toLocaleString();
    
    description.innerHTML = (translationsObj['loadSave.description'] || 
      'Для <strong>{characterName}</strong> найдено сохранение от <strong>{saveDate}</strong>')
      .replace('{characterName}', charName)
      .replace('{saveDate}', saveDate);
  }
  
  // Обновляем метки в info-box
  const infoBox = modal.querySelector('div[style*="background: #f8f9fa"]');
  if (infoBox) {
    const paragraphs = infoBox.querySelectorAll('p');
    const labels = [
      translationsObj['loadSave.level'] || 'Уровень:',
      translationsObj['loadSave.attack'] || 'Атака:',
      translationsObj['loadSave.skill'] || 'Навык:',
      translationsObj['loadSave.explosion'] || 'Взрыв:',
      translationsObj['loadSave.materialsCount'] || 'Сохранено материалов:'
    ];
    
    paragraphs.forEach((p, index) => {
      const strong = p.querySelector('strong');
      if (strong && labels[index]) {
        strong.textContent = labels[index];
      }
    });
  }
  
  const newBtn = modal.querySelector('#option-new');
  const loadBtn = modal.querySelector('#option-load');
  if (newBtn) newBtn.textContent = translationsObj['loadSave.newButton'] || 'Создать новое';
  if (loadBtn) loadBtn.textContent = translationsObj['loadSave.loadButton'] || 'Загручить сохраненное';
}

// Вспомогательная функция для извлечения имени персонажа из модального окна
function extractCharacterNameFromModal(modal) {
  const avatar = modal.querySelector('img[alt*="name"]');
  const title = modal.querySelector('h2');
  
  if (!avatar || !title) return null;
  
  // Извлекаем имя персонажа из заголовка
  const titleText = title.textContent;
  const parts = titleText.split(' - ');
  return parts[0];
}

// Обновленная функция retranslateDynamicContent
// app.js - исправленная функция retranslateDynamicContent
function retranslateDynamicContent(lang) {
  console.log('Перевод динамического контента:', lang);
  
  const translationsObj = translations[lang] || translations['ru'];
  
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

  const calendar = document.getElementById('mini-calendar');
  if (calendar) renderMiniCalendar(calendar, new Date(), lang);
  
  // Обновляем кнопку фильтра ТОЛЬКО на странице персонажей
  if (currentPageId === 'characters') {
    const filterBtn = document.querySelector('.filter-button');
    if (filterBtn) {
      const span = filterBtn.querySelector('span:not(.filter-clear)');
      if (span) span.textContent = translationsObj['filter.title'] || 'Фильтр';
    }
    
    // Обновляем карточки персонажей
    if (typeof updateCharacterCardsLanguage === 'function') {
      updateCharacterCardsLanguage(lang);
    } else {
      updateCharacterCards(lang);
    }
    // Не создаем кнопку фильтра здесь, она уже создана в initDynamicContent
  } else if (currentPageId === 'weapon') {
    // Только для страницы оружия
    const filterBtn = document.querySelector('.filter-button');
    if (filterBtn) {
      const span = filterBtn.querySelector('span:not(.filter-clear)');
      if (span) span.textContent = translationsObj['filter.weaponTitle'] || 'Фильтр оружия';
    }
  }
  
  // НИКОГДА не создаем кнопку фильтра на подстраницах персонажей!
  // Только обновляем контент без создания кнопок
  if (currentPageId.startsWith('characters/')) {
    if (typeof updateAllCharacterCardsLocalization === 'function') {
      updateAllCharacterCardsLocalization(lang);
    }
    
    // Обновляем страницу информации
    if (currentPageId === 'characters/info') {
      localizeCharacterInfoPage(lang);
    }
    
    // Обновляем страницу материалов
    if (currentPageId === 'characters/mat') {
      updateCharacterMaterialsPageLang(lang);
    }
  }
  
  // Обновляем страницу оружия
  if (currentPageId === 'weapon') {
    updateWeaponPage(lang);
  }
  
  updateSaveButtonText(lang);
  
  // Обновляем имена материалов на странице материалов
  if (currentPageId === 'characters/mat') {
    localizeMaterialNames(lang);
  }
}

// Функция для обновления страницы оружия
function updateWeaponPage(lang) {
  const title = document.querySelector('.weapon-page h1');
  if (title) {
    title.textContent = translations[lang]?.['weapon.title'] || 'Оружие';
  }
  
  // Обновляем кнопку фильтра для оружия
  createWeaponFilterButton(); // Используем импортированную функцию
  
  // Обновляем карточки оружия
  if (typeof renderWeaponCards === 'function') {
    renderWeaponCards(lang);
  }
}

// Функция для очистки всех флагов загрузки
function clearAllLoadFlags() {
  console.log('Очищаем все флаги загрузки');
  
  localStorage.removeItem('isLoadingFromProfile');
  localStorage.removeItem('isLoadingFromSave');
  localStorage.removeItem('isNewCharacterSetup');
  
  const levelData = JSON.parse(localStorage.getItem('characterLevelData') || '{}');
  const charData = JSON.parse(localStorage.getItem('characterData') || '{}');
  
  delete levelData.isFromLoad;
  delete levelData.isFromProfile;
  delete levelData.isFromSave;
  delete levelData.loadedFromSave;
  
  delete charData.isFromLoad;
  delete charData.isFromProfile;
  delete charData.isFromSave;
  delete charData.loadedFromSave;
  
  localStorage.setItem('characterLevelData', JSON.stringify(levelData));
  localStorage.setItem('characterData', JSON.stringify(charData));
  
  console.log('Все флаги загрузки очищены');
}

// Функция для получения текущих данных персонажа
function getCurrentCharacterData() {
  const data = {
    level: 1,
    attackLevel: 1,
    skillLevel: 1,
    explosionLevel: 1,
    rangeVal: 0,
    inputs: {}
  };
  
  const charLevelElement = document.getElementById('lvl');
  if (charLevelElement) {
    data.level = parseInt(charLevelElement.textContent) || 1;
  }
  
  const levelSpans = document.querySelectorAll('.section .level-value');
  if (levelSpans.length >= 3) {
    data.attackLevel = parseInt(levelSpans[0].textContent) || 1;
    data.skillLevel = parseInt(levelSpans[1].textContent) || 1;
    data.explosionLevel = parseInt(levelSpans[2].textContent) || 1;
  }
  
  const rangeSlider = document.getElementById('range');
  if (rangeSlider) {
    data.rangeVal = parseInt(rangeSlider.value) || 0;
  }
  
  const inputElements = document.querySelectorAll('.all .materials-container input[type="number"]');
  inputElements.forEach(input => {
    const value = parseInt(input.value) || 0;
    const materialId = input.id.replace('all_', '').replace(/_/g, '.');
    data.inputs[materialId] = value;
  });
  
  return data;
}

// Функция для сравнения с сохраненными данными
function compareWithSavedData(currentData, savedData) {
  if (currentData.level !== savedData.level ||
      currentData.attackLevel !== savedData.attackLevel ||
      currentData.skillLevel !== savedData.skillLevel ||
      currentData.explosionLevel !== savedData.explosionLevel ||
      currentData.rangeVal !== (savedData.rangeVal || savedData.characterData?.rangeVal || 0)) {
    return true;
  }
  
  const savedInputs = savedData.userInputs || {};
  for (const key in savedInputs) {
    if (currentData.inputs[key] !== savedInputs[key]) {
      return true;
    }
  }
  
  return false;
}

// Функция для обновления текста кнопки сохранения
function updateSaveButtonText(lang) {
  const translationsObj = translations[lang] || translations['ru'];
  
  // Обновляем все кнопки сохранения на странице
  const saveBtn = document.getElementById('save-materials-btn');
  const updateBtn = document.getElementById('update-materials-btn');
  const overwriteBtn = document.getElementById('overwrite-materials-btn');
  
  if (saveBtn) {
    const span = saveBtn.querySelector('span');
    if (span) {
      span.textContent = translationsObj['buttons.save'] || 'Сохранить';
    }
  }
  
  if (updateBtn) {
    const span = updateBtn.querySelector('span');
    if (span) {
      span.textContent = translationsObj['buttons.update'] || 'Обновить';
    }
  }
  
  if (overwriteBtn) {
    const span = overwriteBtn.querySelector('span');
    if (span) {
      span.textContent = translationsObj['buttons.overwrite'] || 'Перезаписать';
    }
  }
}

// Обновляет карточки персонажей без пересоздания
function updateCharacterCards(lang) {
  const nameElements = document.querySelectorAll('.card-character .name p');
  nameElements.forEach(element => {
    const article = element.closest('.card-character');
    if (!article) return;
    
    const charKey = article.getAttribute('data-name');
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
  
  const charNameElements = document.querySelectorAll('#mat-name, #info-name, #guide-name');
  charNameElements.forEach(el => {
    if (el.textContent) {
      el.textContent = data[`${lang}_name`] || data.en_name;
    }
  });
  
  const avatars = document.querySelectorAll('#mat-avatar, #info-avatar, #guide-avatar');
  avatars.forEach(avatar => {
    if (data.avatar && !avatar.src.includes(data.avatar)) {
      avatar.src = data.avatar;
      avatar.alt = data[`${lang}_name`] || data.en_name;
    }
  });
  
  const bioElement = document.getElementById('info-bio');
  if (bioElement) {
    bioElement.textContent = data[`${lang}_bio`] || 'Описание отсутствует';
  }
}

// Добавим функцию для динамического обновления имени персонажа на странице материалов
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
    currentLang: window.currentLang
  });
  serverTimer.init();
}

function showPage(pageId) {
  console.log('showPage вызван:', pageId, 'язык:', window.currentLang);
  const content = document.getElementById('content');

  updateButtonManager.reset();

  // Закрываем все модальные окна при смене страницы
  if (window.modalManager) {
    window.modalManager.closeAll();
  }

  if (!pageId.startsWith('characters/mat')) {
    localStorage.removeItem('isLoadingFromProfile');
    localStorage.removeItem('isLoadingFromSave');
  }
  
  // ВАЖНОЕ ИСПРАВЛЕНИЕ: Сбрасываем глобальные фильтры при переходе на другую страницу
  if (pageId !== 'characters' && window.characterFilters) {
    window.characterFilters = {
      element: null,
      weapon: null,
      rarity: null
    };
    console.log('Фильтры персонажей сброшены при переходе на страницу:', pageId);
  }
  
  if (pageId !== 'weapon' && window.weaponFilters) {
    window.weaponFilters = {
      weaponType: null,
      rarity: null,
      stats: null
    };
    console.log('Фильтры оружия сброшены при переходе на страницу:', pageId);
  }
  
  // Удаляем ВСЕ существующие кнопки фильтра
  const filterBtns = document.querySelectorAll('.filter-button');
  filterBtns.forEach(btn => btn.remove());
  
  // Удаляем все nav-left-area (на всякий случай)
  const navLeftAreas = document.querySelectorAll('.nav-left-area');
  navLeftAreas.forEach(area => {
  const filterBtnInArea = area.querySelector('.filter-button');
    if (filterBtnInArea) {
      filterBtnInArea.remove();
    }
  });
  
  if (!content) return;
  
  currentPageId = pageId;

  if (pageLayouts[pageId]) {
    const layout = pageLayouts[pageId];
    const localizedHtml = applyTranslations(layout, window.currentLang);
    content.innerHTML = localizedHtml;
    
    setTimeout(() => {
      initDynamicContent(pageId);
      
      // ДОБАВЛЯЕМ: Обновляем имя персонажа на странице материалов сразу после рендеринга
      if (pageId === 'characters/mat') {
        setTimeout(() => {
          updateCharacterMaterialsPageLang(window.currentLang);
        }, 100);
      }
      
      // ДОБАВЛЯЕМ: Инициализируем страницу информации если это characters/info
      if (pageId === 'characters/info') {
        setTimeout(() => {
          const savedChar = localStorage.getItem('selectedCharacter');
          if (savedChar) {
            const { data } = JSON.parse(savedChar);
            initCharacterInfoPage(data);
          }
        }, 200);
      }
      
      // Инициализируем страницу оружия если это weapon
      if (pageId === 'weapon') {
        setTimeout(() => {
          updateWeaponPage(window.currentLang);
        }, 100);
      }
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
  const calendar = document.getElementById('mini-calendar');
  if (calendar) {
    renderMiniCalendar(calendar, new Date(), window.currentLang);
  }
  
  checkBirthday();
  
  if (pageId === 'home' || pageId.startsWith('home/')) {
    if (serverTimer) destroyServerTimer();
    setTimeout(() => initServerTimer(), 100);
  } else {
    destroyServerTimer();
  }
  
  // ОЧЕНЬ ВАЖНО: Создаем кнопку фильтра ТОЛЬКО на странице персонажей, НЕ на подстраницах
  if (pageId === 'characters') {
    setTimeout(() => {
      renderCharacterCards(window.currentLang);
      createCharacterFilterButton(); // Создаем кнопку фильтра ТОЛЬКО здесь
    }, 100);
  } else if (pageId === 'weapon') {
    setTimeout(() => {
      renderWeaponCards(window.currentLang);
      createWeaponFilterButton(); // Используем импортированную функцию
    }, 100);
  } else {
    // Удаляем кнопку фильтра с других страниц
    const filterBtn = document.querySelector('.filter-button');
    if (filterBtn) {
      filterBtn.remove();
    }
    
    // Также удаляем контейнер nav-left-area если он пустой
    const navLeftArea = document.querySelector('.nav-left-area');
    if (navLeftArea && !navLeftArea.hasChildNodes()) {
      navLeftArea.remove();
    }
  }
  
  if (pageId.startsWith('characters/')) {
    if (pageId === 'characters/info' || pageId === 'characters/guide') {
      loadCharacterDetailPage(pageId);
    } else if (pageId === 'characters/mat') {
      loadCharacterDetailPage(pageId);
      
      setTimeout(async () => {
        const savedChar = localStorage.getItem('selectedCharacter');
        if (savedChar) {
          const { data, lang } = JSON.parse(savedChar);
          try {
            await initMaterialsScript(data, lang);
          } catch (error) {
            console.error('Ошибка инициализации материалов:', error);
          }
        }
        
        const levelData = JSON.parse(localStorage.getItem('characterLevelData') || '{}');
        const charData = JSON.parse(localStorage.getItem('characterData') || '{}');
        
        if (levelData.isFromLoad && !levelData.isFromProfile && !levelData.isFromSave) {
          delete levelData.isFromLoad;
          localStorage.setItem('characterLevelData', JSON.stringify(levelData));
        }
        
        if (charData.isFromLoad && !charData.isFromProfile && !charData.isFromSave) {
          delete charData.isFromLoad;
          localStorage.setItem('characterData', JSON.stringify(charData));
        }
      }, 100);
    }
  }

  if (pageId === 'weapon/mat') {
    setTimeout(() => {
      if (typeof loadWeaponMaterialsPage === 'function') {
        loadWeaponMaterialsPage();
      }
    }, 100);
  } else if (pageId === 'weapon/info') {
    setTimeout(() => {
      if (typeof loadWeaponInfoPage === 'function') {
        loadWeaponInfoPage();
      }
    }, 100);
  } else if (pageId === 'weapon/refinement') {
    setTimeout(() => {
      if (typeof loadWeaponRefinementPage === 'function') {
        loadWeaponRefinementPage();
      }
    }, 100);
  }
  
  // Инициализация страницы профиля
  if (pageId === 'profile') {
    setTimeout(() => {
      renderSavedMaterials();
      
      const container = document.getElementById('saved-materials-container');
      if (container) {
        const translationsObj = translations[window.currentLang] || translations['ru'];
        
        const refreshBtn = document.createElement('button');
        refreshBtn.textContent = translationsObj['buttons.refresh'] || 'Обновить список';
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

// В функции renderSavedMaterials() в app.js добавьте поддержку оружия:

function renderSavedMaterials() {
  console.log('=== RENDER SAVED MATERIALS START ===');
  const container = document.getElementById('saved-materials-container');
  console.log('Контейнер найден:', container ? 'Да' : 'Нет');
  if (!container) {
    console.error('❌ Контейнер saved-materials-container не найден!');
    console.log('Проверьте HTML структуру страницы profile');
    return;
  }
  
  const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  const savedWeapons = JSON.parse(localStorage.getItem('savedWeapons') || '[]');
  
  console.log('Сохранений в localStorage:', savedMaterials.length);
  console.log('Сохранений оружия:', savedWeapons.length);
  
  // Объединяем все сохранения (персонажи + оружие)
  const allSaves = [];
  
  // Добавляем персонажей
  savedMaterials.forEach(save => {
    if (!save.type || save.type === 'character') {
      allSaves.push({...save, saveType: 'character'});
    }
  });
  
  // Добавляем оружия
  savedWeapons.forEach(save => {
    if (save.type === 'weapon') {
      allSaves.push({...save, saveType: 'weapon'});
    }
  });
  
  // Сортируем по дате изменения (новые сверху)
  allSaves.sort((a, b) => new Date(b.lastModified || b.date) - new Date(a.lastModified || a.date));
  
  if (allSaves.length === 0) {
    const translationsObj = translations[window.currentLang] || translations['ru'];
    container.innerHTML = `
      <div class="no-saves-message">
        <div style="font-size: 48px; color: #ccc; margin-bottom: 20px;">📂</div>
        <h3>${translationsObj['profile.noSaves'] || 'Нет сохраненных настроек'}</h3>
        <p>${translationsObj['profile.noSavesDescription'] || 'Сохраните настройки персонажей или оружия, чтобы они появились здесь.'}</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = allSaves.map((save, index) => {
    const isWeapon = save.saveType === 'weapon' || save.type === 'weapon';
    const icon = isWeapon ? '⚔️' : '👤';
    const typeText = isWeapon ? 
      (translations[window.currentLang]?.profile?.weapon || 'Оружие') : 
      (translations[window.currentLang]?.profile?.character || 'Персонаж');
    
    return `
      <div class="saved-material-card ${isWeapon ? 'weapon-save' : 'character-save'}" 
           data-save-id="${save.id || save.charKey + '_' + index}">
        <div class="saved-header">
          <div class="save-type-icon">${icon}</div>
          <img src="${save.characterAvatar || save.weaponAvatar || save.avatar || 'assets/default-avatar.png'}" 
               alt="${save.characterName || save.weaponName || 'Объект'}" 
               style="width: 60px; height: 60px; ${isWeapon ? '' : 'border-radius: 50%;'} object-fit: cover;">
          <div class="saved-info">
            <div class="save-header-top">
              <h3>${save.characterName || save.weaponName || 'Неизвестно'}</h3>
              <span class="save-type-badge">${typeText}</span>
            </div>
            <p style="color: #666; font-size: 14px;">${save.date || 'Дата не указана'}</p>
            <div class="save-stats">
              ${isWeapon ? `
                <span style="color: #888; font-size: 12px;">
                  ${translations[window.currentLang]?.weapon?.level || 'Уровень'}: ${save.level || 1} | 
                  ${translations[window.currentLang]?.weapon?.refinement || 'Пробуждение'}: ${save.refinementLevel || 1}
                </span>
              ` : `
                <span style="color: #888; font-size: 12px;">
                  ${translations[window.currentLang]?.loadSave?.level || 'Уровень'}: ${save.level || 1} | 
                  ${translations[window.currentLang]?.loadSave?.attack || 'Атака'}: ${save.attackLevel || 1} | 
                  ${translations[window.currentLang]?.loadSave?.skill || 'Навык'}: ${save.skillLevel || 1}
                </span>
              `}
            </div>
            ${save.weaponType ? `
              <p style="color: #777; font-size: 12px; margin-top: 5px;">
                ${translations[window.currentLang]?.weapons?.[save.weaponType] || save.weaponType}
                <span style="margin-left: 10px; color: gold;">${'★'.repeat(save.weaponRarity || 4)}</span>
              </p>
            ` : ''}
          </div>
        </div>
        
        <div class="saved-actions">
          <button class="load-save-btn" data-index="${index}" data-type="${isWeapon ? 'weapon' : 'character'}" 
                  style="background: #4CAF50; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">
            ${translations[window.currentLang]?.buttons?.open || 'Открыть'}
          </button>
          <button class="delete-save-btn" data-index="${index}" data-type="${isWeapon ? 'weapon' : 'character'}" 
                  style="background: #f44336; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">
            ${translations[window.currentLang]?.buttons?.delete || 'Удалить'}
          </button>
        </div>
      </div>
    `;
  }).join('');
  
  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('load-save-btn')) {
      const index = parseInt(e.target.dataset.index);
      const saveType = e.target.dataset.type;
      console.log('Загрузка сохранения с индексом:', index, 'тип:', saveType);
      
      if (saveType === 'weapon') {
        loadSavedWeapon(index);
      } else {
        loadSavedMaterials(index);
      }
    }
    
    if (e.target.classList.contains('delete-save-btn')) {
      const index = parseInt(e.target.dataset.index);
      const saveType = e.target.dataset.type;
      
      if (saveType === 'weapon') {
        deleteSavedWeapon(index);
      } else {
        deleteSavedMaterials(index);
      }
    }
  });
}

// Функция загрузки сохраненного оружия
function loadSavedWeapon(index) {
  const savedWeapons = JSON.parse(localStorage.getItem('savedWeapons') || '[]');
  if (index >= 0 && index < savedWeapons.length) {
    const save = savedWeapons[index];
    
    console.log('Загрузка сохранения оружия из профиля:', save);
    
    // Сохраняем выбранное оружие
    localStorage.setItem('selectedWeapon', JSON.stringify({
      key: save.weaponKey,
      data: save.weaponData,
      lang: window.currentLang
    }));
    
    // Сохраняем данные уровня оружия
    const saveDataToLoad = {
      weaponName: save.weaponName,
      weaponKey: save.weaponKey,
      level: save.level || 1,
      refinementLevel: save.refinementLevel || 1,
      timestamp: Date.now(),
      weaponData: save.weaponData,
      isFromLoad: true,
      isFromProfile: true,
      loadedFromSave: true
    };
    
    localStorage.setItem('weaponLevelData', JSON.stringify(saveDataToLoad));
    
    // Переходим на страницу материалов оружия
    history.pushState({}, '', '#/weapon/mat');
    showPage('weapon/mat');
  }
}

// Функция удаления сохраненного оружия
function deleteSavedWeapon(index) {
  const savedWeapons = JSON.parse(localStorage.getItem('savedWeapons') || '[]');
  const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  
  if (index >= 0 && index < savedWeapons.length) {
    const weaponToDelete = savedWeapons[index];
    
    // Удаляем из массива оружий
    savedWeapons.splice(index, 1);
    localStorage.setItem('savedWeapons', JSON.stringify(savedWeapons));
    
    // Удаляем из общего массива
    const updatedMaterials = savedMaterials.filter(save => 
      !(save.charKey === weaponToDelete.weaponKey && save.type === 'weapon')
    );
    localStorage.setItem('savedMaterials', JSON.stringify(updatedMaterials));
    
    renderSavedMaterials();
    
    showSaveNotification('Сохранение оружия удалено!', 'success');
  }
}

// Загрузка сохраненных материалов из профиля
function loadSavedMaterials(index) {
  const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  if (index >= 0 && index < savedMaterials.length) {
    const save = savedMaterials[index];
    
    console.log('Загрузка сохранения из профиля:', save);
    
    const saveDataToLoad = {
      charName: save.characterName,
      charKey: save.charKey,
      rangeVal: save.characterData?.rangeVal || save.rangeVal || 0,
      level: save.level || 1,
      attackLevel: save.attackLevel || 1,
      skillLevel: save.skillLevel || 1,
      explosionLevel: save.explosionLevel || 1,
      userInputs: save.userInputs || {},
      characterAvatar: save.characterAvatar,
      timestamp: Date.now(),
      characterData: save.characterData?.fullCharacterData || save.characterData,
      isFromLoad: true,
      isFromSave: true,
      isFromProfile: true,
      loadedFromSave: true,
      saveId: save.id || save.charKey,
      lastModified: save.lastModified || Date.now()
    };
    
    localStorage.setItem('selectedCharacter', JSON.stringify({
      key: save.charKey || save.characterData?.key || 'Flins',
      data: save.characterData?.fullCharacterData || save.characterData,
      lang: window.currentLang
    }));
    
    localStorage.setItem('characterLevelData', JSON.stringify(saveDataToLoad));
    localStorage.setItem('characterData', JSON.stringify(saveDataToLoad));
    
    console.log('Данные загружены из профиля с флагами:', {
      isFromLoad: true,
      isFromProfile: true,
      isFromSave: true
    });
    
    history.pushState({}, '', '#/characters/mat');
    showPage('characters/mat');
  }
}

// Восстановление введенных пользователем значений
function restoreUserInputs(userInputs) {
  console.log('=== ВОССТАНОВЛЕНИЕ ПОЛЬЗОВАТЕЛЬСКИХ ВВОДОВ ===');
  console.log('Данные для восстановления:', userInputs);
  
  setTimeout(() => {
    let restoredCount = 0;
    
    Object.entries(userInputs).forEach(([materialId, amount]) => {
      const inputId = `all_${materialId.replace(/\./g, '_')}`;
      const input = document.getElementById(inputId);
      
      if (input) {
        const numericAmount = parseInt(amount) || 0;
        input.value = numericAmount;
        restoredCount++;
        
        console.log(`Восстановлено: ${inputId} = ${numericAmount}`);
        
        const inputEvent = new Event('input', { bubbles: true });
        input.dispatchEvent(inputEvent);
      } else {
        console.log(`Поле не найдено: ${inputId}`);
      }
    });
    
    console.log(`Всего восстановлено полей: ${restoredCount}`);
    
    setTimeout(() => {
      console.log('Проверка изменений после восстановления');
      if (updateButtonManager.initialized) {
        updateButtonManager.checkForChanges();
      }
    }, 1000);
    
  }, 1000);
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
  
  const existingBackBtn = document.querySelector('.back-button');
  if (existingBackBtn) {
    existingBackBtn.remove();
  }
  
  // Добавляем кнопку "Назад" для страниц персонажей И оружия
  if ((pageId.startsWith('characters/') && pageId !== 'characters') ||
      (pageId.startsWith('weapon/') && pageId !== 'weapon')) {
    const translationsObj = translations[window.currentLang] || translations['ru'];
    
    const backBtn = document.createElement('button');
    backBtn.className = 'back-button';
    
    let backText = translationsObj['buttons.backToCharacters'] || 'Назад к персонажам';
    let backToPage = 'characters';
    
    // Определяем, куда возвращаться
    if (pageId.startsWith('weapon/')) {
      backText = translationsObj['buttons.backToWeapons'] || 'Назад к оружию';
      backToPage = 'weapon';
    }
    
    backBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      <span>${backText}</span>
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
      history.pushState({}, '', `#/${backToPage}`);
      showPage(backToPage);
    });
    
    const navLeftArea = navTopBar.querySelector('.nav-left-area');
    if (navLeftArea) {
      const filterBtn = navLeftArea.querySelector('.filter-button');
      if (filterBtn) {
        navLeftArea.insertBefore(backBtn, filterBtn);
      } else {
        navLeftArea.appendChild(backBtn);
      }
    } else {
      const leftArea = document.createElement('div');
      leftArea.className = 'nav-left-area';
      leftArea.style.cssText = 'display: flex; align-items: center; gap: 10px;';
      leftArea.appendChild(backBtn);
      
      const langSwitcher = navTopBar.querySelector('.language-switcher');
      if (langSwitcher) {
        navTopBar.insertBefore(leftArea, langSwitcher);
      } else {
        navTopBar.appendChild(leftArea);
      }
    }
  } else {
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
  
  if (pageId === 'characters/info') {
    // Для страницы информации о персонаже
    fillCharacterDetailData(pageId, data, lang);
    // Инициализируем функционал слайдеров
    setTimeout(() => {
      initCharacterInfoPage(data);
    }, 100);
  } else {
    fillCharacterDetailData(pageId, data, lang);
  }
}

// Функция для инициализации страницы информации о персонаже
function initCharacterInfoPage(characterData) {
  console.log('Инициализация страницы информации о персонаже:', characterData.key);
  
  // Сохраняем данные персонажа
  window.currentCharacterInfo = characterData;
  
  // Инициализируем слайдеры
  initCharacterInfoSliders();
  
  // Заполняем начальные значения
  updateCharacterStats();
  
  // Заполняем информацию об атаках
  populateAttackInfo(characterData);
  
  // Заполняем созвездия
  populateConstellations(characterData);
  
  // Обновляем локализацию
  localizeCharacterInfoPage(window.currentLang);
}

// Функция для заполнения созвездий
function populateConstellations(characterData) {
  const container = document.getElementById('constellations-container');
  if (!container || !characterData.constellations) {
    container.innerHTML = '<p data-i18n="character.noConstellations">Информация о созвездиях отсутствует</p>';
    return;
  }
  
  container.innerHTML = '';
  
  const constellations = characterData.constellations;
  const lang = window.currentLang;
  
  Object.keys(constellations).forEach((constKey, index) => {
    const constellation = constellations[constKey];
    const constellationCard = document.createElement('div');
    constellationCard.className = 'constellation-card';
    
    const constellationHTML = `
      <div class="constellation-icon">
        ${constellation.icon ? `<img src="${constellation.icon}" alt="C${index + 1}">` : `<div class="constellation-placeholder">C${index + 1}</div>`}
      </div>
      <div class="constellation-content">
        <h4 class="constellation-name">${index + 1}. ${constellation.name?.[lang] || constellation.name?.ru || constellation.name?.en || `Созвездие ${index + 1}`}</h4>
        <p class="constellation-description">${constellation.description?.[lang] || constellation.description?.ru || constellation.description?.en || ''}</p>
      </div>
    `;
    
    constellationCard.innerHTML = constellationHTML;
    container.appendChild(constellationCard);
  });
}

// Функция для инициализации слайдеров
function initCharacterInfoSliders() {
  const rangeSlider = document.getElementById('range');
  const minusBtn = document.getElementById('minus');
  const plusBtn = document.getElementById('plus');
  const outSpan = document.getElementById('out');
  const lvlSpan = document.getElementById('lvl');
  
  // Слайдер для уровня атаки
  const attackRangeSlider = document.getElementById('level-attack');
  const attackMinusBtn = document.getElementById('attack-minus');
  const attackPlusBtn = document.getElementById('attack-plus');
  
  if (rangeSlider) {
    // Устанавливаем начальное значение
    const initialValue = 0;
    rangeSlider.value = initialValue;
    if (outSpan) outSpan.textContent = initialValue;
    
    // Обновляем уровень персонажа
    updateCharacterLevel(initialValue, lvlSpan);
    
    // Обработчик изменения слайдера
    rangeSlider.addEventListener('input', () => {
      const value = parseInt(rangeSlider.value);
      if (outSpan) outSpan.textContent = value;
      updateCharacterLevel(value, lvlSpan);
      updateCharacterStats();
    });
    
    // Обработчики кнопок минус/плюс
    if (minusBtn) {
      minusBtn.addEventListener('click', () => {
        let value = parseInt(rangeSlider.value);
        value = Math.max(0, value - 10);
        rangeSlider.value = value;
        if (outSpan) outSpan.textContent = value;
        updateCharacterLevel(value, lvlSpan);
        updateCharacterStats();
      });
    }
    
    if (plusBtn) {
      plusBtn.addEventListener('click', () => {
        let value = parseInt(rangeSlider.value);
        value = Math.min(60, value + 10);
        rangeSlider.value = value;
        if (outSpan) outSpan.textContent = value;
        updateCharacterLevel(value, lvlSpan);
        updateCharacterStats();
      });
    }
  }
  
  if (attackRangeSlider) {
    // Устанавливаем начальное значение
    attackRangeSlider.value = 1;
    
    // Обработчик изменения слайдера атаки
    attackRangeSlider.addEventListener('input', () => {
      updateAttackStats();
    });
    
    // Обработчики кнопок минус/плюс для атаки
    if (attackMinusBtn) {
      attackMinusBtn.addEventListener('click', () => {
        let value = parseInt(attackRangeSlider.value);
        value = Math.max(1, value - 1);
        attackRangeSlider.value = value;
        updateAttackStats();
      });
    }
    
    if (attackPlusBtn) {
      attackPlusBtn.addEventListener('click', () => {
        let value = parseInt(attackRangeSlider.value);
        value = Math.min(10, value + 1);
        attackRangeSlider.value = value;
        updateAttackStats();
      });
    }
  }
}

// Функция для обновления уровня персонажа
function updateCharacterLevel(rangeValue, lvlSpan) {
  if (!lvlSpan) return;
  
  const levelMap = {
    0: '1',
    10: '20',
    20: '40',
    30: '50',
    40: '60',
    50: '70',
    60: '80',
    70: '8',
    80: '9'
  };
  
  lvlSpan.textContent = levelMap[rangeValue] || '1';
}

// Функция для обновления характеристик персонажа
function updateCharacterStats() {
  const characterData = window.currentCharacterInfo;
  if (!characterData) return;
  
  const rangeSlider = document.getElementById('range');
  const rangeValue = rangeSlider ? parseInt(rangeSlider.value) : 0;
  
  // Получаем реальный уровень на основе значения слайдера
  const realLevel = getCharacterLevelFromRange(rangeValue);
  
  // Обновляем HP
  const hpElement = document.getElementById('hp_1');
  if (hpElement && characterData.hp) {
    const hpValue = getStatValueForLevel(characterData.hp, realLevel);
    hpElement.textContent = hpValue || 'Не указано';
  }
  
  // Обновляем ATK (если есть в values2)
  const atkElement = document.getElementById('values2');
  if (atkElement && characterData.values2) {
    const atkValue = getStatValueForLevel(characterData.values2, realLevel);
    atkElement.textContent = atkValue || 'Не указано';
  }
  
  // Обновляем DEF (если есть в values3)
  const defElement = document.getElementById('values3');
  if (defElement && characterData.values3) {
    const defValue = getStatValueForLevel(characterData.values3, realLevel);
    defElement.textContent = defValue || 'Не указано';
  }
}

// Функция для получения реального уровня из значения слайдера
function getCharacterLevelFromRange(rangeValue) {
  // Слайдер: 0-60 с шагом 10
  if (rangeValue >= 60) return 'lv80';
  else if (rangeValue >= 50) return 'lv70';
  else if (rangeValue >= 40) return 'lv60';
  else if (rangeValue >= 30) return 'lv50';
  else if (rangeValue >= 20) return 'lv40';
  else if (rangeValue >= 10) return 'lv20';
  else return 'lv10';
}

// Функция для получения значения характеристики по уровню
function getStatValueForLevel(statData, level) {
  if (!statData || typeof statData !== 'object') return null;
  
  // Если statData - объект с уровнями
  if (statData[level]) {
    return statData[level];
  }
  
  // Если statData - просто объект, пробуем найти ближайший уровень
  const availableLevels = Object.keys(statData)
    .filter(key => key.startsWith('lv'))
    .map(key => parseInt(key.replace('lv', '')))
    .sort((a, b) => a - b);
  
  const targetLevel = parseInt(level.replace('lv', ''));
  
  // Ищем ближайший меньший или равный уровень
  let closestLevel = availableLevels[0];
  for (const lvl of availableLevels) {
    if (lvl <= targetLevel) {
      closestLevel = lvl;
    } else {
      break;
    }
  }
  
  return statData[`lv${closestLevel}`];
}

// Функция для заполнения информации об атаках
function populateAttackInfo(characterData) {
  // Заполняем названия талантов
  const attackNameElement = document.getElementById('char-atack-name');
  if (attackNameElement && characterData.attack) {
    attackNameElement.textContent = characterData.attack;
  }
  
  const skillNameElement = document.getElementById('char-skill-name');
  if (skillNameElement && characterData.skill) {
    skillNameElement.textContent = characterData.skill;
  }
  
  const burstNameElement = document.getElementById('char-burst-name');
  if (burstNameElement && characterData.explosion) {
    burstNameElement.textContent = characterData.explosion;
  }
  
  // Заполняем описания талантов
  const attackDescriptionElement = document.getElementById('des-attack');
  if (attackDescriptionElement && characterData.des_attack) {
    attackDescriptionElement.innerHTML = characterData.des_attack;
  }
  
  const skillDescriptionElement = document.getElementById('des-skill');
  if (skillDescriptionElement && characterData.des_skill) {
    skillDescriptionElement.textContent = characterData.des_skill;
  } else if (skillDescriptionElement && characterData.skill) {
    skillDescriptionElement.textContent = characterData.skill;
  }
  
  const burstDescriptionElement = document.getElementById('des-burst');
  if (burstDescriptionElement && characterData.des_burst) {
    burstDescriptionElement.textContent = characterData.des_burst;
  } else if (burstDescriptionElement && characterData.explosion) {
    burstDescriptionElement.textContent = characterData.explosion;
  }
  
  // Заполняем иконки
  const s1Element = document.getElementById('char-s1');
  if (s1Element && characterData.s1) {
    s1Element.innerHTML = `<img src="${characterData.s1}" alt="${characterData.attack || 'Атака'}" style="width: 50px; height: 50px;">`;
  }
  
  const s2Element = document.getElementById('char-s2');
  if (s2Element && characterData.s2) {
    s2Element.innerHTML = `<img src="${characterData.s2}" alt="${characterData.skill || 'Навык'}" style="width: 50px; height: 50px;">`;
  }
  
  const s3Element = document.getElementById('char-s3');
  if (s3Element && characterData.s3) {
    s3Element.innerHTML = `<img src="${characterData.s3}" alt="${characterData.explosion || 'Взрыв'}" style="width: 50px; height: 50px;">`;
  }
  
  // Инициализируем статистику атак
  updateAttackStats();
}

// Функция для обновления статистики атак
function updateAttackStats() {
  const characterData = window.currentCharacterInfo;
  if (!characterData || !characterData.stat_attack) return;
  
  const attackRangeSlider = document.getElementById('level-attack');
  const attackLevel = attackRangeSlider ? parseInt(attackRangeSlider.value) : 1;
  
  // Обновляем отображение уровня атаки
  const attackLevelElement = document.getElementById('attack-level');
  if (attackLevelElement) {
    attackLevelElement.textContent = attackLevel;
  }
  
  const statsContainer = document.getElementById('attack-stats-container');
  if (!statsContainer) return;
  
  // Очищаем контейнер
  statsContainer.innerHTML = '';
  
  // Создаем элементы статистики для каждой атаки
  Object.entries(characterData.stat_attack).forEach(([key, attackData]) => {
    if (!attackData || !attackData.label) return;
    
    const statItem = document.createElement('div');
    statItem.className = 'attack-stat-item';
    
    const labelSpan = document.createElement('span');
    labelSpan.className = 'attack-stat-label';
    labelSpan.textContent = attackData.label;
    
    const valueSpan = document.createElement('span');
    valueSpan.className = 'attack-stat-value';
    
    // Получаем значение для текущего уровня атаки
    let statValue = '-';
    if (attackData.levels && attackData.levels[attackLevel]) {
      statValue = attackData.levels[attackLevel];
    } else if (attackData.value) {
      statValue = attackData.value;
    }
    
    valueSpan.textContent = statValue;
    
    statItem.appendChild(labelSpan);
    statItem.appendChild(valueSpan);
    statsContainer.appendChild(statItem);
  });
}

// Функция для инициализации страницы оружия
function initWeaponPage() {
  console.log('Инициализация страницы оружия');
  
  const container = document.querySelector('.weapons-container');
  if (!container) return;
  
  // Пока заглушка - в будущем можно добавить реальные данные об оружии
  const translationsObj = translations[window.currentLang] || translations['ru'];
  
  container.innerHTML = `
    <div class="weapon-placeholder">
      <div style="font-size: 48px; margin-bottom: 20px;">⚔️</div>
      <h3>${translationsObj['weapon.comingSoon'] || 'Скоро будут добавлены оружия...'}</h3>
      <p>${translationsObj['weapon.description'] || 'В этом разделе будут отображаться все доступные оружия с их характеристиками и материалами для улучшения.'}</p>
    </div>
  `;
}

// Функция для инициализации скрипта материалов
function initMaterialsScript(character, lang) {
  console.log('=== ИНИЦИАЛИЗАЦИЯ СКРИПТА МАТЕРИАЛОВ ===');
  
  const levelData = JSON.parse(localStorage.getItem('characterLevelData') || '{}');
  const charData = JSON.parse(localStorage.getItem('characterData') || '{}');
  
  const isFromLoad = levelData.isFromLoad === true || charData.isFromLoad === true;
  const isFromProfile = levelData.isFromProfile === true || charData.isFromProfile === true;
  const isFromSave = levelData.isFromSave === true || charData.isFromSave === true;
  
  console.log('Флаги при инициализации:', { 
    isFromLoad, 
    isFromProfile, 
    isFromSave,
    levelData,
    charData 
  });
  
  if (levelData && Object.keys(levelData).length > 0 && !levelData.isNewSetup) {
    console.log('Используем существующие данные из characterLevelData:', levelData);
    
    if (isFromLoad || isFromProfile || isFromSave) {
      console.log('Инициализация с загруженными данными (флаги установлены)');
      
      if (!levelData.isFromLoad) levelData.isFromLoad = true;
      if (!levelData.isFromProfile && isFromProfile) levelData.isFromProfile = true;
      if (!levelData.isFromSave && isFromSave) levelData.isFromSave = true;
      
      if (!charData.isFromLoad) charData.isFromLoad = true;
      if (!charData.isFromProfile && isFromProfile) charData.isFromProfile = true;
      if (!charData.isFromSave && isFromSave) charData.isFromSave = true;
      
      localStorage.setItem('characterLevelData', JSON.stringify(levelData));
      localStorage.setItem('characterData', JSON.stringify(charData));
    }
    
  } else {
    console.log('Создаем новые данные для персонажа');
    
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
    
    const newData = {
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
      userInputs: levelData.userInputs || {},
      timestamp: Date.now(),
      isNewSetup: true
    };
    
    localStorage.setItem('characterData', JSON.stringify(newData));
    console.log('Созданы новые данные для персонажа:', newData);
  }
  
  setTimeout(() => {
    renderMaterialsPage();
  }, 100);
}

// Функция для рендеринга страницы материалов
function renderMaterialsPage() {
  console.log('=== RENDER MATERIALS PAGE - НАЧАЛО ===');
  
  const levelData = JSON.parse(localStorage.getItem('characterLevelData') || '{}');
  const charData = JSON.parse(localStorage.getItem('characterData') || '{}');
  
  console.log('Данные перед рендерингом страницы:', {
    levelData,
    charData,
    hasLevelData: Object.keys(levelData).length > 0,
    hasCharData: Object.keys(charData).length > 0
  });

  const translationsObj = translations[window.currentLang] || translations['ru'];
  
  // Локализуем заголовки на странице
  const content = document.querySelector('.characters.sec');
  if (content) {
    // Обновляем заголовки секций
    const sectionTitles = content.querySelectorAll('h2');
    const titleKeys = [
      'materialsPage.characterLevel',
      'materialsPage.characterAttack',
      'materialsPage.characterSkill',
      'materialsPage.characterExplosion',
      'materialsPage.allMaterials'
    ];
    
    sectionTitles.forEach((title, index) => {
      if (titleKeys[index]) {
        title.textContent = translationsObj[titleKeys[index]];
        title.setAttribute('data-i18n', titleKeys[index]);
      }
    });
    
    // Обновляем заголовок страницы
    const pageTitle = document.querySelector('.page.characters h1');
    if (pageTitle) {
      pageTitle.textContent = translationsObj['materialsPage.title'] || 'Материалы для развития';
      pageTitle.setAttribute('data-i18n', 'materialsPage.title');
    }
    
    // Локализуем имена материалов
    localizeMaterialNames(window.currentLang);
  }

  const contentSections = document.querySelectorAll('section.level, section.mat-attack, section.mat-skill, section.mat-explosion, section.all');
  contentSections.forEach(section => {
    section.style.display = 'none';
  });
  
  const loadingIndicator = document.createElement('div');
  loadingIndicator.id = 'materials-loading';
  loadingIndicator.innerHTML = `<p>${translationsObj['loading.materials'] || 'Загрузка материалов...'}</p>`;
  loadingIndicator.style.cssText = 'text-align: center; padding: 50px; font-size: 18px;';
  
  const mainContent = document.querySelector('.characters.sec');
  if (mainContent) {
    mainContent.appendChild(loadingIndicator);
  }
  
  setTimeout(async () => {
    try {
      if (loadingIndicator) loadingIndicator.remove();
      
      contentSections.forEach(section => {
        section.style.display = 'block';
      });
      
      if (!localStorage.getItem('selectedCharacter') && localStorage.getItem('characterData')) {
        try {
          const charData = JSON.parse(localStorage.getItem('characterData'));
          if (charData.fullCharacterData) {
            localStorage.setItem('selectedCharacter', JSON.stringify({
              key: charData.charKey || 'Flins',
              data: charData.fullCharacterData,
              lang: charData.lang || window.currentLang
            }));
          }
        } catch (error) {
          console.error('Ошибка восстановления персонажа:', error);
        }
      }
      
      const levelData = checkAndLoadCharacterData();
      
      const savedChar = localStorage.getItem('selectedCharacter');
      let charData = null;
      let currentLang = window.currentLang;
      
      if (savedChar) {
        try {
          const parsedChar = JSON.parse(savedChar);
          charData = parsedChar.data;
          currentLang = parsedChar.lang || window.currentLang;
          // Обновляем язык если отличается
          if (parsedChar.lang !== window.currentLang) {
            parsedChar.lang = window.currentLang;
            localStorage.setItem('selectedCharacter', JSON.stringify(parsedChar));
          }
        } catch (error) {
          console.error('Ошибка парсинга сохраненного персонажа:', error);
        }
      }
      
      if (!charData) {
        showErrorMessage("Нет данных персонажа.");
        return;
      }
      
      const charIconDiv = document.getElementById('char-icon');
      const charNameH1 = document.getElementById('char-name');
      
      if (charIconDiv && charData.avatar) {
        charIconDiv.innerHTML = `<img src="${charData.avatar}" alt="${charData[`${currentLang}_name`] || charData.en_name}">`;
      }
      
      if (charNameH1) {
        const charName = charData[`${currentLang}_name`] || charData.en_name;
        charNameH1.textContent = charName;
        charNameH1.setAttribute('data-char-key', charData.key);
        charNameH1.setAttribute('data-lang', currentLang);
      }
      
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
        }
      });
      
      renderRealMaterials({
        rangeVal: levelData.rangeVal || 0,
        level: realLevel,
        attackLevel: levelData.attackLevel || 1,
        skillLevel: levelData.skillLevel || 1,
        explosionLevel: levelData.explosionLevel || 1
      }, charData);
      
      // Восстанавливаем введенные пользователем значения
      setTimeout(() => {
        const storedCharData = JSON.parse(localStorage.getItem('characterData') || '{}');
        if (storedCharData.userInputs && Object.keys(storedCharData.userInputs).length > 0) {
          console.log('Восстанавливаем сохраненные вводы из данных:', storedCharData.userInputs);
          restoreUserInputs(storedCharData.userInputs);
        }
      }, 500);
      
      // Настраиваем кнопки сохранения
      setTimeout(() => {
        checkAndSetupSaveButton(charData, currentLang);
      }, 1000);
      
    } catch (error) {
      console.error('Ошибка при рендеринге страницы материалов:', error);
      showErrorMessage("Произошла ошибка при загрузке страницы.");
    }
  }, 100);
  
  console.log('=== RENDER MATERIALS PAGE - КОНЕЦ ===');
}

// Новая функция для локализации имен материалов
function localizeMaterialNames(lang) {
  const materialItems = document.querySelectorAll('.material-item');
  const translationsObj = translations[lang] || translations['ru'];
  
  materialItems.forEach(item => {
    const materialNameElement = item.querySelector('.material-name');
    const inputElement = item.querySelector('input[type="number"]');
    
    if (materialNameElement) {
      const materialKey = extractMaterialKeyFromElement(item);
      if (materialKey) {
        // Используем исправленную функцию для получения имени
        const translatedName = getTranslatedMaterialNameFromInfo(materialKey, lang);
        if (translatedName && translatedName !== materialKey) {
          materialNameElement.textContent = translatedName;
        }
      }
    }
    
    // Обновляем placeholder у input
    if (inputElement) {
      inputElement.placeholder = translationsObj['input.placeholder'] || 'Имеется';
    }
    
    // Обновляем текст "Осталось"
    const remainingSpan = item.querySelector('.material-remaining');
    if (remainingSpan) {
      const remainingText = remainingSpan.textContent;
      if (remainingText.includes(':')) {
        const amount = remainingText.split(':')[1].trim();
        remainingSpan.textContent = `${translationsObj['material.remaining'] || 'Осталось'}: ${amount}`;
      }
    }
  });
}

// Функция для извлечения ключа материала из элемента
function extractMaterialKeyFromElement(element) {
  const inputElement = element.querySelector('input[type="number"]');
  if (inputElement && inputElement.id) {
    // Извлекаем ключ из ID вида "all_material_key"
    return inputElement.id.replace('all_', '').replace(/_/g, '.');
  }
  return null;
}

// Функция для получения переведенного имени материала из materialsInfo
function getTranslatedMaterialNameFromInfo(materialKey, lang) {
  // Попробуем найти материал в materialsInfo
  const parts = materialKey.split('.');
  
  if (parts.length === 1) {
    // Простой ключ
    if (materialsInfo[materialKey]) {
      const materialData = materialsInfo[materialKey];
      if (typeof materialData === 'object' && materialData.name) {
        // materialData.name - это объект {ru: "...", en: "..."}
        // Нужно выбрать правильный язык
        if (materialData.name[lang]) {
          return materialData.name[lang];
        } else if (materialData.name.ru) {
          return materialData.name.ru;
        } else {
          return materialKey;
        }
      }
    }
  } else if (parts.length === 2) {
    // Вложенный ключ
    const [category, subKey] = parts;
    if (materialsInfo[category] && materialsInfo[category][subKey]) {
      const materialData = materialsInfo[category][subKey];
      if (typeof materialData === 'object' && materialData.name) {
        // materialData.name - это объект {ru: "...", en: "..."}
        if (materialData.name[lang]) {
          return materialData.name[lang];
        } else if (materialData.name.ru) {
          return materialData.name.ru;
        } else {
          return materialKey;
        }
      }
    }
  }
  
  // Если не нашли в materialsInfo, вернем оригинальный ключ
  return materialKey;
}

// Функция для проверки и настройки кнопки сохранения/обновления
function checkAndSetupSaveButton(character, lang) {
  console.log('checkAndSetupSaveButton: настройка кнопки сохранения');
  console.log('Персонаж:', character.key);
  console.log('Текущий язык:', lang);
  
  document.querySelectorAll('.save-button-container').forEach(container => {
    container.remove();
  });
  
  let buttonContainer = document.querySelector('.save-button-container');
  if (!buttonContainer) {
    buttonContainer = document.createElement('div');
    buttonContainer.className = 'save-button-container';
    buttonContainer.style.cssText = `
      display: flex;
      justify-content: center;
      margin: 30px 0;
      padding: 20px;
      gap: 15px;
    `;
    
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
  
  buttonContainer.innerHTML = '';
  
  const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  const existingSaveIndex = savedMaterials.findIndex(save => save.charKey === character.key);
  const existingSave = existingSaveIndex !== -1 ? savedMaterials[existingSaveIndex] : null;
  
  const levelData = JSON.parse(localStorage.getItem('characterLevelData') || '{}');
  const charData = JSON.parse(localStorage.getItem('characterData') || '{}');
  
  const isFromLoad = levelData.isFromLoad === true || charData.isFromLoad === true;
  const isFromProfile = levelData.isFromProfile === true || charData.isFromProfile === true;
  const isFromSave = levelData.isFromSave === true || charData.isFromSave === true;
  
  console.log('Состояние сохранений:', {
    existingSave: !!existingSave,
    existingSaveIndex,
    isFromLoad,
    isFromProfile,
    isFromSave
  });
  
  const translationsObj = translations[lang] || translations['ru'];
  
  // Если есть сохранение и мы его загрузили
  if (existingSave && (isFromLoad || isFromProfile || isFromSave)) {
    console.log('Создаем кнопку "Обновить"');
    
    // Кнопка "Обновить" (только если есть изменения)
    const updateButton = document.createElement('button');
    updateButton.id = 'update-materials-btn';
    updateButton.className = 'save-btn update';
    updateButton.disabled = true;
    updateButton.style.opacity = '0.5';
    updateButton.style.cursor = 'not-allowed';
    
    updateButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
      </svg>
      <span>${translationsObj['buttons.update'] || 'Обновить'}</span>
    `;
    
    updateButton.addEventListener('click', () => {
      if (!updateButton.disabled) {
        updateExistingSave(character, lang);
      }
    });
    
    buttonContainer.appendChild(updateButton);
    
    // Инициализируем менеджер кнопки обновления
    setTimeout(() => {
      if (window.updateButtonManager) {
        console.log('Инициализируем updateButtonManager для кнопки "Обновить"');
        updateButtonManager.init(character, lang);
      }
    }, 300);
    
  } else if (existingSave) {
    // Есть сохранение, но не загружено - кнопка "Перезаписать"
    console.log('Создаем кнопку "Перезаписать"');
    
    const overwriteButton = document.createElement('button');
    overwriteButton.id = 'overwrite-materials-btn';
    overwriteButton.className = 'save-btn overwrite';
    
    overwriteButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
      </svg>
      <span>${translationsObj['buttons.overwrite'] || 'Перезаписать'}</span>
    `;
    
    overwriteButton.addEventListener('click', () => {
      showOverwriteConfirm(character, lang, existingSave);
    });
    
    buttonContainer.appendChild(overwriteButton);
    
  } else {
    // Нет сохранения - кнопка "Сохранить"
    console.log('Создаем кнопку "Сохранить"');
    
    const saveButton = document.createElement('button');
    saveButton.id = 'save-materials-btn';
    saveButton.className = 'save-btn primary';
    
    saveButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
        <polyline points="17 21 17 13 7 13 7 21"/>
        <polyline points="7 3 7 8 15 8"/>
      </svg>
      <span>${translationsObj['buttons.save'] || 'Сохранить'}</span>
    `;
    
    saveButton.addEventListener('click', () => {
      saveMaterialsToProfile(character, lang);
    });
    
    buttonContainer.appendChild(saveButton);
  }
}

// Функция создания кнопки "Сохранить" (для новых сохранений)
function createSaveButton(container, character, lang, isDisabled = false) {
  console.log('Создаем кнопку "Сохранить"');
  
  const translationsObj = translations[lang] || translations['ru'];
  
  const saveButton = document.createElement('button');
  saveButton.id = 'save-materials-btn';
  saveButton.className = 'save-btn primary';
  saveButton.disabled = false;
  
  saveButton.innerHTML = `
    <svg><use href="#icon-primary"></use></svg>
    <span>${translationsObj['buttons.saveMaterials'] || 'Сохранить материалы'}</span>
  `;
  
  saveButton.addEventListener('click', () => {
    console.log('Кнопка "Сохранить" нажата');
    saveMaterialsToProfile(character, lang);
  });
  
  container.appendChild(saveButton);
}

// Функция создания кнопки "Обновить"/"Перезаписать"
function createUpdateButton(container, character, lang, isUpdate = false) {
  const translationsObj = translations[lang] || translations['ru'];
  
  const buttonText = isUpdate ? 
    (translationsObj['buttons.updateMaterials'] || 'Обновить материалы') : 
    (translationsObj['buttons.overwriteMaterials'] || 'Перезаписать материалы');
  
  console.log(`Создаем кнопку "${buttonText}"`);
  
  const updateButton = document.createElement('button');
  updateButton.id = isUpdate ? 'update-materials-btn' : 'overwrite-materials-btn';
  updateButton.className = isUpdate ? 'save-btn update' : 'save-btn overwrite';
  
  const isDisabledInitially = isUpdate;
  updateButton.disabled = isDisabledInitially;
  
  const iconSvg = isUpdate ? `
    <svg  fill="none" stroke="currentColor">
      <use href="#icon-update"></use>
    </svg>
  ` : `
    <svg  fill="none" stroke="currentColor">
      <use href="#icon-overwrite"></use>
    </svg>
  `;
  
  updateButton.innerHTML = `${iconSvg}<span>${buttonText}</span>`;
  
  updateButton.addEventListener('click', (e) => {
    if (isUpdate && updateButton.disabled) {
      console.log('Кнопка "Обновить" неактивна, изменения не обнаружены');
      return;
    }
    
    if (isUpdate) {
      updateExistingSave(character, lang);
    } else {
      const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
      const existingSave = savedMaterials.find(save => save.charKey === character.key);
      if (existingSave) {
        showOverwriteConfirm(character, lang, existingSave);
      }
    }
  });
  
  container.appendChild(updateButton);
}

// Функция показа окна подтверждения перезаписи
function showOverwriteConfirm(character, lang, existingSave) {
  const modal = document.createElement('div');
  modal.className = 'overwrite-confirm-modal';
  
  // Регистрируем модальное окно в менеджере
  if (window.modalManager) {
    window.modalManager.registerModal(modal);
  }
  
  const modalContent = document.createElement('div');
  modalContent.className = 'overwrite-content-modal';
  
  const saveDate = new Date(existingSave.lastModified || existingSave.date).toLocaleString();
  const hasUserInputs = Object.keys(existingSave.userInputs || {}).length > 0;
  const charName = existingSave.characterName || character[`${lang}_name`] || character.en_name;
  
  const translationsObj = translations[lang] || translations['ru'];
  
  modalContent.innerHTML = `
    <div style="margin-bottom: 20px;">
      <div style="font-size: 48px; color: #FF9800; margin-bottom: 10px;">⚠️</div>
      <h3 data-i18n="overwrite.title">${translationsObj['overwrite.title'] || 'Перезаписать сохранение?'}</h3>
    </div>
    
    <div style="text-align: left; margin-bottom: 25px;">
      <p data-i18n="overwrite.description">${(translationsObj['overwrite.description'] || 'Для {characterName} уже есть сохранение:').replace('{characterName}', `<strong style="color: #333;">${charName}</strong>`)}</p>
      
      <div class="info-box">
        <p>
          <span style="display: inline-block; width: 100px; color: #777;" data-i18n="overwrite.date">${translationsObj['overwrite.date'] || 'Дата:'}</span>
          <strong>${saveDate}</strong>
        </p>
        <p>
          <span style="display: inline-block; width: 100px; color: #777;" data-i18n="overwrite.level">${translationsObj['overwrite.level'] || 'Уровень:'}</span>
          ${existingSave.level}
        </p>
        <p>
          <span style="display: inline-block; width: 100px; color: #777;" data-i18n="overwrite.talents">${translationsObj['overwrite.talents'] || 'Таланты:'}</span>
          ${existingSave.attackLevel}/${existingSave.skillLevel}/${existingSave.explosionLevel}
        </p>
        ${hasUserInputs ? 
          `<p>
            <span style="display: inline-block; width: 100px; color: #777;" data-i18n="overwrite.materialsCount">${translationsObj['overwrite.materialsCount'] || 'Материалы:'}</span>
            ${Object.keys(existingSave.userInputs).length} шт.
          </p>` : ''}
      </div>
      
      <div class="warning-box">
        ${translationsObj['overwrite.warning'] || 'Старое сохранение будет <strong>безвозвратно удалено</strong> и заменено новым.'}
      </div>
    </div>
    
    <div class="button-group">
      <button id="option-cancel" class="action-button cancel" data-i18n="buttons.cancel">
        ${translationsObj['buttons.cancel'] || 'Отмена'}
      </button>
      <button id="option-overwrite" class="action-button confirm" data-i18n="buttons.overwrite">
        ${translationsObj['buttons.overwrite'] || 'Перезаписать'}
      </button>
    </div>
  `;
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  // Добавляем слушатель для смены языка
  const languageChangeHandler = (e) => {
    const newLang = e.detail.lang;
    const newTranslations = translations[newLang] || translations['ru'];
    
    // Обновляем тексты
    const title = modalContent.querySelector('h3');
    const description = modalContent.querySelector('p');
    const dateLabel = modalContent.querySelector('.info-box p:nth-child(1) span');
    const levelLabel = modalContent.querySelector('.info-box p:nth-child(2) span');
    const talentsLabel = modalContent.querySelector('.info-box p:nth-child(3) span');
    const materialsLabel = modalContent.querySelector('.info-box p:nth-child(4) span');
    const warningBox = modalContent.querySelector('.warning-box');
    const cancelBtn = modalContent.querySelector('.action-button.cancel');
    const confirmBtn = modalContent.querySelector('.action-button.confirm');
    
    if (title) title.textContent = newTranslations['overwrite.title'] || 'Перезаписать сохранение?';
    if (description) {
      description.innerHTML = (newTranslations['overwrite.description'] || 'Для {characterName} уже есть сохранение:')
        .replace('{characterName}', `<strong style="color: #333;">${charName}</strong>`);
    }
    if (dateLabel) dateLabel.textContent = newTranslations['overwrite.date'] || 'Дата:';
    if (levelLabel) levelLabel.textContent = newTranslations['overwrite.level'] || 'Уровень:';
    if (talentsLabel) talentsLabel.textContent = newTranslations['overwrite.talents'] || 'Таланты:';
    if (materialsLabel) materialsLabel.textContent = newTranslations['overwrite.materialsCount'] || 'Материалы:';
    if (warningBox) {
      warningBox.innerHTML = newTranslations['overwrite.warning'] || 
        'Старое сохранение будет <strong>безвозвратно удалено</strong> и заменено новым.';
    }
    if (cancelBtn) cancelBtn.textContent = newTranslations['buttons.cancel'] || 'Отмена';
    if (confirmBtn) confirmBtn.textContent = newTranslations['buttons.overwrite'] || 'Перезаписать';
  };
  
  document.addEventListener('languageChange', languageChangeHandler);
  
  // Обработчики кнопок
  modalContent.querySelector('#option-cancel').addEventListener('click', () => {
    if (window.modalManager) {
      window.modalManager.unregisterModal(modal);
    }
    document.removeEventListener('languageChange', languageChangeHandler);
    modal.remove();
  });
  
  modalContent.querySelector('#option-overwrite').addEventListener('click', () => {
    if (window.modalManager) {
      window.modalManager.unregisterModal(modal);
    }
    document.removeEventListener('languageChange', languageChangeHandler);
    modal.remove();
    updateExistingSave(character, lang);
  });
  
  // Закрытие при клике вне окна
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      if (window.modalManager) {
        window.modalManager.unregisterModal(modal);
      }
      document.removeEventListener('languageChange', languageChangeHandler);
      modal.remove();
    }
  });
  
  // Закрытие по клавише Esc
  document.addEventListener('keydown', function closeOnEsc(e) {
    if (e.key === 'Escape') {
      if (window.modalManager) {
        window.modalManager.unregisterModal(modal);
      }
      document.removeEventListener('languageChange', languageChangeHandler);
      modal.remove();
      document.removeEventListener('keydown', closeOnEsc);
    }
  });
  
  // Удаляем слушатель при закрытии модального окна
  const originalRemove = modal.remove;
  modal.remove = function() {
    if (window.modalManager) {
      window.modalManager.unregisterModal(modal);
    }
    document.removeEventListener('languageChange', languageChangeHandler);
    originalRemove.call(this);
  };
}

// Обновляем функцию обновления существующего сохранения
function updateExistingSave(character, lang) {
  console.log('updateExistingSave вызвана');
  
  const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  const existingSaveIndex = savedMaterials.findIndex(save => save.charKey === character.key);
  
  if (existingSaveIndex === -1) {
    saveMaterialsToProfile(character, lang);
    return;
  }
  
  const storedData = localStorage.getItem('characterData');
  const levelData = localStorage.getItem('characterLevelData');
  
  let data, levelDataObj;
  
  if (storedData) {
    try {
      data = JSON.parse(storedData);
    } catch (error) {
      console.error('Ошибка парсинга characterData:', error);
      showSaveNotification(translations[lang]?.errors?.saveFailed || 'Ошибка при сохранении', 'error');
      return;
    }
  }
  
  if (levelData) {
    try {
      levelDataObj = JSON.parse(levelData);
    } catch (error) {
      console.error('Ошибка парсинга characterLevelData:', error);
      showSaveNotification(translations[lang]?.errors?.saveFailed || 'Ошибка при сохранении', 'error');
      return;
    }
  }
  
  const charName = character[`${lang}_name`] || character.en_name;
  const charKey = character.key || 'Flins';
  
  const userInputs = {};
  const inputElements = document.querySelectorAll('.all .materials-container input[type="number"]');
  
  inputElements.forEach(input => {
    const value = parseInt(input.value) || 0;
    const materialId = input.id.replace('all_', '').replace(/_/g, '.');
    userInputs[materialId] = value;
  });
  
  const updatedSave = {
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
    }
  };
  
  savedMaterials[existingSaveIndex] = updatedSave;
  localStorage.setItem('savedMaterials', JSON.stringify(savedMaterials));
  
  const currentCharData = JSON.parse(localStorage.getItem('characterData') || '{}');
  currentCharData.userInputs = userInputs;
  currentCharData.isFromLoad = true;
  currentCharData.isFromSave = true;
  localStorage.setItem('characterData', JSON.stringify(currentCharData));
  
  const currentLevelData = JSON.parse(localStorage.getItem('characterLevelData') || '{}');
  currentLevelData.userInputs = userInputs;
  currentLevelData.isFromLoad = true;
  currentLevelData.isFromSave = true;
  localStorage.setItem('characterLevelData', JSON.stringify(currentLevelData));
  
  setTimeout(() => {
    checkAndSetupSaveButton(character, lang);
  }, 300);
  
  showSaveNotification(translations[lang]?.notifications?.updateSuccess || 'Сохранение успешно обновлено!', 'success');
  
  console.log('Сохранение обновлено для персонажа:', charName);
}

// Функция показа уведомления
function showSaveNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `save-notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Обновленная функция saveMaterialsToProfile с локализацией
function saveMaterialsToProfile(character, lang) {
  console.log('=== СОХРАНЕНИЕ НАЧАЛО ===');
  
  const storedData = localStorage.getItem('characterData');
  const levelData = localStorage.getItem('characterLevelData');
  
  if (!storedData && !levelData) {
    console.error("Нет данных для сохранения");
    showSaveNotification(translations[lang]?.notifications?.noData || 'Нет данных для сохранения', 'error');
    return;
  }

  let data, levelDataObj;
  
  if (storedData) {
    try {
      data = JSON.parse(storedData);
    } catch (error) {
      console.error('Ошибка парсинга characterData:', error);
      showSaveNotification(translations[lang]?.errors?.saveFailed || 'Ошибка при сохранении', 'error');
      return;
    }
  }
  
  if (levelData) {
    try {
      levelDataObj = JSON.parse(levelData);
    } catch (error) {
      console.error('Ошибка парсинга characterLevelData:', error);
      showSaveNotification(translations[lang]?.errors?.saveFailed || 'Ошибка при сохранении', 'error');
      return;
    }
  }
  
  const charName = character[`${lang}_name`] || character.en_name;
  const charKey = character.key || 'Flins';
  
  const userInputs = {};
  const inputElements = document.querySelectorAll('.all .materials-container input[type="number"]');
  
  inputElements.forEach(input => {
    const value = parseInt(input.value) || 0;
    const materialId = input.id.replace('all_', '').replace(/_/g, '.');
    userInputs[materialId] = value;
  });
  
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
  
  const existingSaves = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  
  const existingSaveIndex = existingSaves.findIndex(save => save.charKey === charKey);
  
  if (existingSaveIndex !== -1) {
    existingSaves[existingSaveIndex] = saveData;
  } else {
    existingSaves.push(saveData);
  }
  
  localStorage.setItem('savedMaterials', JSON.stringify(existingSaves));

  console.log('✅ Сохранение успешно!');
  
  forceRefreshProfile();
  
  const currentCharData = JSON.parse(localStorage.getItem('characterData') || '{}');
  currentCharData.userInputs = userInputs;
  currentCharData.isFromLoad = true;
  currentCharData.isFromSave = true;
  localStorage.setItem('characterData', JSON.stringify(currentCharData));
  
  const currentLevelData = JSON.parse(localStorage.getItem('characterLevelData') || '{}');
  currentLevelData.userInputs = userInputs;
  currentLevelData.isFromLoad = true;
  currentLevelData.isFromSave = true;
  localStorage.setItem('characterLevelData', JSON.stringify(currentLevelData));
  
  setTimeout(() => {
    checkAndSetupSaveButton(character, lang);
  }, 300);
  
  showSaveNotification(translations[lang]?.notifications?.saveSuccess || 'Материалы успешно сохранены!', 'success');
  
  console.log('Сохранение создано/обновлено для персонажа:', charName);
}

function checkAndLoadCharacterData() {
  console.log('Проверка данных персонажа...');
  
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
  
  const realLevel = getRealLevelFromRange(data.rangeVal || 0);
  console.log('Реальный уровень персонажа:', realLevel);
  
  const attackLevel = data.attackLevel || 1;
  const skillLevel = data.skillLevel || 1;
  const explosionLevel = data.explosionLevel || 1;
  
  console.log('Поиск материалов для:', {
    realLevel, attackLevel, skillLevel, explosionLevel
  });
  
  if (!materialCategories) {
    console.error("materialCategories не загружен");
    showErrorMessage("Данные о материалах не загружены.");
    return;
  }
  
  const levelMaterials = getLevelMaterials(realLevel);
  console.log('Материалы уровня для уровня', realLevel, ':', levelMaterials);
  
  const attackMaterials = getTalentMaterials('attack', attackLevel);
  console.log('Материалы атаки для уровня', attackLevel, ':', attackMaterials);
  
  const skillMaterials = getTalentMaterials('skill', skillLevel);
  console.log('Материалы навыка для уровня', skillLevel, ':', skillMaterials);
  
  const burstMaterials = getTalentMaterials('burst', explosionLevel);
  console.log('Материалы взрыва для уровня', explosionLevel, ':', burstMaterials);
  
  renderMaterialsToContainer('section.level .materials-container', levelMaterials, 'level', characterData);
  renderMaterialsToContainer('section.mat-attack .materials-container', attackMaterials, 'attack', characterData);
  renderMaterialsToContainer('section.mat-skill .materials-container', skillMaterials, 'skill', characterData);
  renderMaterialsToContainer('section.mat-explosion .materials-container', burstMaterials, 'explosion', characterData);
  
  renderAllMaterials(levelMaterials, attackMaterials, skillMaterials, burstMaterials, characterData);
}

// Функция для получения материалов уровня
function getLevelMaterials(realLevel) {
  if (!materialCategories.amountsPerLevel) return {};
  
  let targetKey = 1;
  
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
  
  const materialInfo = getMaterialInfo(materialKey, characterData);
  
  div.innerHTML = `
    <img src="${materialInfo.icon || 'assets/unknown.png'}" alt="${materialInfo.name}" class="material-icon">
    <div class="material-info">
      <span class="material-name">${materialInfo.name}</span>
      <span class="material-amount">${amount}</span>
    </div>
  `;
  
  if (sectionType === 'all') {
    const inputId = `all_${materialKey.replace(/\./g, '_')}`;
    div.innerHTML += `
      <div class="material-input">
        <input type="number" id="${inputId}" min="0" value="0" placeholder="${translations[window.currentLang]?.input?.placeholder || 'Имеется'}">
        <span class="material-remaining">${translations[window.currentLang]?.material?.remaining || 'Осталось'}: ${amount}</span>
      </div>
    `;
    
    setTimeout(() => {
      const input = document.getElementById(inputId);
      if (input) {
        input.addEventListener('input', function() {
          const have = parseInt(this.value) || 0;
          const remaining = Math.max(0, amount - have);
          const remainingSpan = this.parentElement.querySelector('.material-remaining');
          if (remainingSpan) {
            remainingSpan.textContent = `${translations[window.currentLang]?.material?.remaining || 'Осталось'}: ${remaining}`;
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
  console.log('Текущий язык:', window.currentLang);
  
  // Сначала попробуем найти в materialsInfo
  let materialInfo = null;
  let materialName = materialKey; // fallback
  
  const parts = materialKey.split('.');
  if (parts.length === 1) {
    // Простой ключ
    if (materialsInfo[materialKey]) {
      materialInfo = materialsInfo[materialKey];
      if (typeof materialInfo === 'object' && materialInfo.name) {
        // materialInfo.name - это объект {ru: "...", en: "..."}
        if (materialInfo.name[window.currentLang]) {
          materialName = materialInfo.name[window.currentLang];
        } else if (materialInfo.name.ru) {
          materialName = materialInfo.name.ru;
        }
      }
    }
  } else if (parts.length === 2) {
    // Вложенный ключ
    const [category, subKey] = parts;
    if (materialsInfo[category] && materialsInfo[category][subKey]) {
      materialInfo = materialsInfo[category][subKey];
      if (typeof materialInfo === 'object' && materialInfo.name) {
        // materialInfo.name - это объект {ru: "...", en: "..."}
        if (materialInfo.name[window.currentLang]) {
          materialName = materialInfo.name[window.currentLang];
        } else if (materialInfo.name.ru) {
          materialName = materialInfo.name.ru;
        }
      }
    }
  }
  
  console.log('Найден материал:', materialName);
  
  return {
    name: materialName,
    icon: (materialInfo && materialInfo.icon) || 'assets/unknown.png'
  };
}

// Функция для получения типа материала для персонажа
function getMaterialTypeForCharacter(materialKey, character) {
  if (!character.ascensionMaterials) return null;
  
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
  
  const allMaterials = {};
  
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
  
  if (Object.keys(allMaterials).length === 0) {
    container.textContent = translations[window.currentLang]?.material?.none || 'Нет материалов';
    return;
  }
  
  const sortedMaterials = Object.entries(allMaterials)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
  
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
        <strong>${translations[window.currentLang]?.notification?.error || 'Ошибка'}:</strong> ${message}
        <br><br>
        <button onclick="location.reload()">${translations[window.currentLang]?.buttons?.reload || 'Обновить страницу'}</button>
        <button onclick="history.back()">${translations[window.currentLang]?.buttons?.back || 'Вернуться назад'}</button>
      </div>`;
    }
  });
}

function fillCharacterDetailData(pageId, character, lang) {
  const prefix = pageId.split('/')[1];
  
  const nameElement = document.getElementById(`${prefix}-name`);
  if (nameElement) {
    nameElement.textContent = character[`${lang}_name`] || character.en_name;
  }
  
  const avatar = document.getElementById(`${prefix}-avatar`);
  if (avatar && character.avatar) {
    avatar.src = character.avatar;
    avatar.alt = character[`${lang}_name`] || character.en_name;
  }
  
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
    const infoElements = [
      { id: 'char-description', value: character.description || 'Описание отсутствует' },
      { id: 'char-name', value: character[`${lang}_name`] || character.en_name }
    ];
    
    infoElements.forEach(({ id, value }) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
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
        element.innerHTML = `<img src="${icon}" alt="Skill Icon" style="width: 40px; height: 40px;">`;
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
    
    // Заполняем иконку персонажа
    const charIconElement = document.getElementById('char-icon');
    if (charIconElement && character.avatar) {
      charIconElement.innerHTML = `<img src="${character.avatar}" alt="${character[`${lang}_name`] || character.en_name}" style="width: 100px; height: 100px; border-radius: 50%;">`;
    }
    
  } else if (pageId === 'characters/guide') {
    // Для страницы гайда
  }
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
      const name = char[`${window.currentLang}_name`] || char.en_name;
      const announcementText = translations[window.currentLang].birthdayAnnouncementFormat
        .replace('{name}', name);
      
      if (announcement) announcement.textContent = announcementText;
      if (image) {
        image.src = char.avatar;
        image.alt = translations[window.currentLang].imageAlt.replace('{name}', name);
      }
      foundBirthday = true;
    }
  });

  if (!foundBirthday) {
    if (announcement) announcement.textContent = translations[window.currentLang].noBirthdayToday;
    if (image) {
      const svg = `data:image/svg+xml,${encodeURIComponent('<svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="200" fill="#f8f9fa"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="#666" text-anchor="middle" dy=".3em">Сегодня нет дней рождения</text></svg>')}`;
      image.src = svg;
      image.alt = window.currentLang === 'ru' ? 'Нет дней рождения сегодня' : 'No birthdays today';
    }
  }

  renderMiniCalendar(calendar, today, window.currentLang);
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

function setupEventListeners() {
  const mainNav = document.querySelector('.main-nav');
  if (mainNav) {
    mainNav.addEventListener('click', handleNavigation);
  }
  
  // ГЛАВНОЕ ИСПРАВЛЕНИЕ: Делегированный обработчик для ВСЕХ кнопок языка
  document.addEventListener('click', (e) => {
    const langBtn = e.target.closest('.lang-btn');
    if (langBtn) {
      e.preventDefault();
      e.stopPropagation();
      
      const lang = langBtn.getAttribute('data-lang');
      console.log('Клик по кнопке языка:', lang);
      
      // Добавляем анимацию переключения
      langBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        langBtn.style.transform = 'scale(1)';
      }, 150);
      
      triggerLanguageChange(lang);
    }
  });

  window.addEventListener('hashchange', handleHashChange);
  window.addEventListener('popstate', handleHashChange);
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', () => {
    setTimeout(() => moveHighlight(), 300);
  });
  
  // Глобальный слушатель для смены языка
  document.addEventListener('languageChange', (e) => {
    const newLang = e.detail.lang;
    console.log('Получено событие languageChange:', newLang);
    setLanguage(newLang);
  });
}

// Инициализация приложения
function initApp() {
  const savedLang = localStorage.getItem('lang');
  if (savedLang) {
    window.currentLang = savedLang;
  }

  localizeNavigation(window.currentLang);
  setupEventListeners();

  // Обновляем кнопки языка сразу при загрузке
  updateLanguageButtons(window.currentLang);

  const hash = window.location.hash;
  const initialPage = hash.slice(2) || 'home';
  showPage(initialPage);
  
  setTimeout(() => moveHighlight(), 100);
}

// Запуск при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  updateAfterImagesLoad();
});

// Экспортируем необходимые функции
export {
  currentPageId,
  showPage,
  setLanguage,
  updateActiveNav
};

export const currentLang = () => window.currentLang;