// save-manager.js - добавьте в начало файла
import { translations } from '../translations.js';
export const updateButtonManager = {
    originalData: null,
    initialized: false,
    initTimer: null,
    checkTimer: null,
    updateButton: null,
    currentLang: null,
    currentCharacter: null,
    
    init: async function(character, lang, updateButton) {
        console.log('Инициализация системы кнопки обновления', lang);
        
        this.updateButton = updateButton;
        this.currentLang = lang;
        this.currentCharacter = character;
        
        // Очищаем предыдущие таймеры
        if (this.initTimer) clearTimeout(this.initTimer);
        if (this.checkTimer) clearTimeout(this.checkTimer);
        
        this.initialized = false;
        this.originalData = null;
        
        // Устанавливаем кнопку как неактивную по умолчанию
        if (this.updateButton) {
            this.updateButton.disabled = true;
            this.updateButton.style.opacity = '0.5';
            this.updateButton.style.cursor = 'not-allowed';
            this.updateButton.style.filter = 'grayscale(20%)';
        }
        
        // Уменьшаем задержку инициализации
        this.initTimer = setTimeout(async () => {
            try {
                console.log('Захват начального состояния...');
                await this.captureInitialState(character, lang);
                this.setupEventListeners();
                this.initialized = true;
                
                // Проверяем изменения сразу
                this.checkForChanges();
                
                // Обновляем текст кнопки
                this.updateButtonText();
                
                console.log('Система кнопки обновления инициализирована');
            } catch (error) {
                console.error('Ошибка инициализации кнопки обновления:', error);
            }
        }, 150);
    },
    
    captureInitialState: async function(character, lang) {
        console.log('Захват начального состояния');
        
        const levelData = JSON.parse(localStorage.getItem('characterLevelData') || '{}');
        const charData = JSON.parse(localStorage.getItem('characterData') || '{}');
        
        // ОЖИДАЕМ полной загрузки DOM
        await this.waitForFullDOM();
        
        // Восстанавливаем сохраненные значения СНАЧАЛА
        if (charData.userInputs || levelData.userInputs) {
            await this.restoreSavedInputs(charData.userInputs || levelData.userInputs);
        }
        
        // Теперь, после восстановления, захватываем состояние как начальное
        this.originalData = this.getCurrentState();
        
        console.log('Начальное состояние захвачено (после восстановления):', this.originalData);
        
        // Сразу делаем кнопку неактивной
        if (this.updateButton) {
            this.updateButton.disabled = true;
            this.updateButton.style.opacity = '0.5';
            this.updateButton.style.cursor = 'not-allowed';
            this.updateButton.style.filter = 'grayscale(20%)';
        }
    },

    // Новая функция для ожидания полной загрузки DOM
    waitForFullDOM: function() {
        return new Promise((resolve) => {
            const checkDOM = () => {
                const inputsExist = document.querySelectorAll('.all .materials-container input[type="number"]').length > 0;
                const nameElement = document.getElementById('char-name');
                const levelElements = document.getElementById('lvl') && document.getElementById('lvl-attack');
                
                if (inputsExist && nameElement && levelElements) {
                    console.log('DOM полностью загружен');
                    resolve();
                } else {
                    console.log('Ожидание загрузки DOM...');
                    setTimeout(checkDOM, 100);
                }
            };
            checkDOM();
        });
    },

    // Новая функция для восстановления сохраненных вводов
    restoreSavedInputs: async function(userInputs) {
        console.log('Восстановление сохраненных вводов:', userInputs);
        
        return new Promise((resolve) => {
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
                        
                        // Диспатчим событие input для обновления расчетов
                        const inputEvent = new Event('input', { bubbles: true });
                        input.dispatchEvent(inputEvent);
                    } else {
                        console.warn(`Поле не найдено: ${inputId}`);
                    }
                });
                
                console.log(`Всего восстановлено полей: ${restoredCount}`);
                resolve();
            }, 100);
        });
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
        const levelElement = document.getElementById('lvl-attack');
        return levelElement ? parseInt(levelElement.textContent) || 1 : 1;
    },

    getCurrentSkillLevelFromDOM: function() {
        const levelElement = document.getElementById('lvl-skill');
        return levelElement ? parseInt(levelElement.textContent) || 1 : 1;
    },

    getCurrentExplosionLevelFromDOM: function() {
        const levelElement = document.getElementById('lvl-explosion');
        return levelElement ? parseInt(levelElement.textContent) || 1 : 1;
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
        console.log('Текущее состояние:', state);
        return state;
    },

    getCurrentInputsFromDOM: function() {
        const inputs = {};
        const inputElements = document.querySelectorAll('.all .materials-container input[type="number"]');
        
        inputElements.forEach(input => {
            const value = parseInt(input.value) || 0;
            const materialId = input.id.replace('all_', '').replace(/_/g, '.');
            if (materialId && value >= 0) {
                inputs[materialId] = value;
            }
        });
        console.log('Инпуты из DOM:', inputs);
        return inputs;
    },
    
    setupEventListeners: function() {
        console.log('Настройка слушателей событий для кнопки обновления');
        
        // Слушатели для полей ввода материалов
        document.querySelectorAll('.all .materials-container input[type="number"]').forEach(input => {
            input.addEventListener('input', () => this.onChange());
            input.addEventListener('change', () => this.onChange());
            input.addEventListener('keyup', () => this.onChange());
        });
        
        // Слушатели для уровней талантов
        document.querySelectorAll('.level-group button, .arrow, .range button').forEach(button => {
            button.addEventListener('click', () => {
                setTimeout(() => this.onChange(), 50);
            });
        });
        
        // Слушатель для слайдера уровня
        const rangeSlider = document.getElementById('range');
        if (rangeSlider) {
            rangeSlider.addEventListener('input', () => this.onChange());
            rangeSlider.addEventListener('change', () => this.onChange());
        }
        
        // Слушатели для кнопок +/-
        const minusRangeBtn = document.getElementById('minus-range');
        const plusRangeBtn = document.getElementById('plus-range');
        
        if (minusRangeBtn) minusRangeBtn.addEventListener('click', () => this.onChange());
        if (plusRangeBtn) plusRangeBtn.addEventListener('click', () => this.onChange());
        
        console.log('Слушатели событий настроены');
    },
    
    onChange: function() {
        if (this.checkTimer) clearTimeout(this.checkTimer);
        this.checkTimer = setTimeout(() => {
            this.checkForChanges();
        }, 150);
    },
    
    checkForChanges: function() {
        if (!this.initialized || !this.originalData) {
            console.log('Менеджер не инициализирован или нет начальных данных');
            return;
        }
        
        const currentState = this.getCurrentState();
        const hasInputChanges = !this.areInputsEqual(currentState.inputs, this.originalData.inputs);
        const hasLevelChanges = !this.areLevelsEqual(currentState.levels, this.originalData.levels);
        const hasChanges = hasInputChanges || hasLevelChanges;
        
        console.log('Проверка изменений:', {
            hasInputChanges,
            hasLevelChanges,
            hasChanges
        });
        
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
            if (currentValue !== originalValue) {
                console.log(`Изменение обнаружено в ${key}: ${originalValue} -> ${currentValue}`);
                return false;
            }
        }
        return true;
    },

    areLevelsEqual: function(currentLevels, originalLevels) {
        const fields = ['level', 'attackLevel', 'skillLevel', 'explosionLevel', 'rangeVal'];
        for (const field of fields) {
            const currentValue = parseInt(currentLevels[field]) || 0;
            const originalValue = parseInt(originalLevels[field]) || 0;
            if (currentValue !== originalValue) {
                console.log(`Изменение уровня обнаружено в ${field}: ${originalValue} -> ${currentValue}`);
                return false;
            }
        }
        return true;
    },
    
    updateButtonState: function(hasChanges) {
        if (!this.updateButton) {
            console.error('Кнопка обновления не найдена');
            return;
        }
        
        console.log('Обновление состояния кнопки:', hasChanges);
        
        this.updateButton.disabled = !hasChanges;
        if (hasChanges) {
            this.updateButton.style.opacity = '1';
            this.updateButton.style.cursor = 'pointer';
            this.updateButton.style.filter = 'none';
            console.log('Кнопка "Обновить" АКТИВИРОВАНА');
        } else {
            this.updateButton.style.opacity = '0.5';
            this.updateButton.style.cursor = 'not-allowed';
            this.updateButton.style.filter = 'grayscale(20%)';
            console.log('Кнопка "Обновить" НЕАКТИВНА');
        }
    },
    
    // save-manager.js - исправленная функция updateButtonText
    updateButtonText: function() {
    if (!this.updateButton) return;
    
    const lang = this.currentLang || window.currentLang || 'ru';
    const translationsObj = translations[lang] || translations['ru'];
    const buttonText = translationsObj.buttons?.update || 'Обновить';
    
    const span = this.updateButton.querySelector('span');
    if (span) {
        span.textContent = buttonText;
    }
    
    // Обновляем aria-label
    this.updateButton.setAttribute('aria-label', buttonText);
    },
    
    updateLanguage: function(newLang) {
        console.log('updateButtonManager: смена языка на', newLang);
        this.currentLang = newLang;
        
        // Обновляем текст кнопки
        this.updateButtonText();
        
        // Заново проверяем изменения
        setTimeout(() => {
            this.checkForChanges();
        }, 100);
    },
    
    reset: function() {
        console.log('Сброс системы кнопки обновления');
        this.initialized = false;
        this.originalData = null;
        this.updateButton = null;
        
        if (this.initTimer) clearTimeout(this.initTimer);
        if (this.checkTimer) clearTimeout(this.checkTimer);
    },
    
    updateAfterSave: function() {
        console.log('Обновление данных после сохранения');
        this.originalData = this.getCurrentState();
        setTimeout(() => {
            this.checkForChanges();
        }, 100);
    }
};

// Функция сохранения материалов в профиль
// save-manager.js - добавьте логирование в функцию saveMaterialsToProfile
export function saveMaterialsToProfile(character, lang) {
    console.log('=== СОХРАНЕНИЕ МАТЕРИАЛОВ - НАЧАЛО ===');
    console.log('Сохранение материалов для:', character.key);
    
    // Получаем текущие материалы со страницы
    const levelMaterials = getMaterialsFromSection('level');
    const attackMaterials = getMaterialsFromSection('attack');
    const skillMaterials = getMaterialsFromSection('skill');
    const burstMaterials = getMaterialsFromSection('explosion');
    
    console.log('Материалы для сохранения:', {
        level: levelMaterials,
        attack: attackMaterials,
        skill: skillMaterials,
        burst: burstMaterials
    });
    
    const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
    const existingIndex = savedMaterials.findIndex(save => save.charKey === character.key);
    
    const userInputs = {};
    const inputElements = document.querySelectorAll('.all .materials-container input[type="number"]');
    
    inputElements.forEach(input => {
        const value = parseInt(input.value) || 0;
        const materialId = input.id.replace('all_', '').replace(/_/g, '.');
        userInputs[materialId] = value;
    });
    
    const saveData = {
        id: Date.now().toString(),
        type: 'character',
        charKey: character.key,
        characterName: character[`${lang}_name`] || character.en_name,
        characterAvatar: character.avatar,
        date: new Date().toLocaleString(lang),
        lastModified: Date.now(),
        level: parseInt(document.getElementById('lvl')?.textContent) || 1,
        attackLevel: parseInt(document.getElementById('lvl-attack')?.textContent) || 1,
        skillLevel: parseInt(document.getElementById('lvl-skill')?.textContent) || 1,
        explosionLevel: parseInt(document.getElementById('lvl-explosion')?.textContent) || 1,
        userInputs: userInputs,
        // ВАЖНО: Сохраняем материалы на верхнем уровне
        levelMaterials: levelMaterials,
        attackMaterials: attackMaterials,
        skillMaterials: skillMaterials,
        burstMaterials: burstMaterials,
        characterData: {
            rangeVal: document.getElementById('range')?.value || 0,
            fullCharacterData: character,
            // Дублируем материалы и в characterData для совместимости
            levelMaterials: levelMaterials,
            attackMaterials: attackMaterials,
            skillMaterials: skillMaterials,
            burstMaterials: burstMaterials
        }
    };
    
    console.log('Данные для сохранения:', saveData);
    
    if (existingIndex !== -1) {
        savedMaterials[existingIndex] = saveData;
    } else {
        savedMaterials.push(saveData);
    }
    
    localStorage.setItem('savedMaterials', JSON.stringify(savedMaterials));
    
    // Также обновляем текущие данные
    const levelData = JSON.parse(localStorage.getItem('characterLevelData') || '{}');
    const updatedLevelData = {
        ...levelData,
        ...saveData.characterData,
        levelMaterials: levelMaterials,
        attackMaterials: attackMaterials,
        skillMaterials: skillMaterials,
        burstMaterials: burstMaterials,
        userInputs: userInputs,
        isFromSave: true,
        isFromLoad: true
    };
    
    localStorage.setItem('characterLevelData', JSON.stringify(updatedLevelData));
    localStorage.setItem('characterData', JSON.stringify(updatedLevelData));
    
    console.log('Материалы успешно сохранены в localStorage');
    showSaveNotification('Материалы успешно сохранены!', 'success');
    
    // Обновляем кнопки
    setTimeout(() => {
        if (typeof checkAndSetupSaveButton === 'function') {
            checkAndSetupSaveButton(character, lang);
        }
    }, 300);
    
    console.log('=== СОХРАНЕНИЕ МАТЕРИАЛОВ - КОНЕЦ ===');
}

// Вспомогательная функция для получения материалов из секции
function getMaterialsFromSection(sectionType) {
    const container = document.querySelector(`.materials-container[data-type="${sectionType}"]`);
    const materials = {};
    
    if (container) {
        container.querySelectorAll('.material-item').forEach(item => {
            const materialKey = item.dataset.materialKey;
            const amountElement = item.querySelector('.material-amount');
            if (materialKey && amountElement) {
                const amount = parseInt(amountElement.dataset.amount) || 0;
                if (amount > 0) {
                    materials[materialKey] = amount;
                }
            }
        });
    }
    
    return materials;
}

// Вспомогательная функция для получения текущих материалов
function getCurrentMaterials(type) {
  const container = document.querySelector(`.materials-container[data-type="${type}"]`);
  const materials = {};
  
  if (container) {
    container.querySelectorAll('.material-item').forEach(item => {
      const materialKey = item.dataset.materialKey;
      const amountElement = item.querySelector('.material-amount');
      if (materialKey && amountElement) {
        const amount = parseInt(amountElement.dataset.amount) || 0;
        if (amount > 0) {
          materials[materialKey] = amount;
        }
      }
    });
  }
  
  return materials;
}

// Функция обновления существующего сохранения
export function updateExistingSave(character, lang) {
    console.log('updateExistingSave вызвана');
    
    // Проверяем, что кнопка не была случайно кликнута когда неактивна
    const updateBtn = document.getElementById('update-materials-btn');
    if (updateBtn && updateBtn.disabled) {
        console.log('Кнопка обновления неактивна - игнорируем вызов');
        return;
    }
    
    const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
    const existingSaveIndex = savedMaterials.findIndex(save => save.charKey === character.key);
    
    if (existingSaveIndex === -1) {
        saveMaterialsToProfile(character, lang);
        return;
    }
    
    // Ждем полной загрузки DOM перед сбором данных
    setTimeout(() => {
        const userInputs = {};
        const inputElements = document.querySelectorAll('section.all .materials-container input[type="number"]');
        
        console.log('Найдено инпутов для обновления:', inputElements.length);
        
        inputElements.forEach(input => {
            const value = parseInt(input.value) || 0;
            const materialId = input.id.replace('all_', '').replace(/_/g, '.');
            
            if (materialId && !materialId.includes('undefined')) {
                userInputs[materialId] = value;
                console.log(`Собран инпут для обновления: ${materialId} = ${value}`);
            }
        });
        
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
        
        // Обновляем менеджер кнопок после обновления
        if (window.updateButtonManager && window.updateButtonManager.updateAfterSave) {
            setTimeout(() => {
                window.updateButtonManager.updateAfterSave();
            }, 200);
        }
        
        setTimeout(() => {
            if (typeof window.checkAndSetupSaveButton === 'function') {
                window.checkAndSetupSaveButton(character, lang);
            }
        }, 300);
        
        showSaveNotification(translations[lang]?.notifications?.updateSuccess || 'Сохранение успешно обновлено!', 'success');
        
        console.log('Сохранение обновлено для персонажа:', charName);
    }, 300);
}

// Функция показа уведомления
// save-manager.js - добавьте эту функцию
// save-manager.js - исправленная функция showSaveNotification
export function showSaveNotification(message, type = 'success') {
    console.log('Показ уведомления:', message, type);
    
    const lang = window.currentLang || 'ru';
    const translationsObj = translations[lang] || translations['ru'];
    
    // Проверяем, есть ли уже уведомление
    const existingNotification = document.querySelector('.save-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `save-notification ${type}`;
    notification.textContent = message;
    notification.setAttribute('data-lang', lang);
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? '#4CAF50' : 
                     type === 'error' ? '#f44336' : 
                     type === 'warning' ? '#ff9800' : '#2196F3'};
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    // Добавляем уведомление в modalManager для перевода
    if (window.modalManager) {
        window.modalManager.registerNotification(notification);
    }
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            if (window.modalManager) {
                window.modalManager.unregisterNotification(notification);
            }
        }, 300);
    }, 4000);
    
    document.body.appendChild(notification);
    
    // Добавляем анимации если их нет
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
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
    }
}

// Инициализация менеджера сохранений
export function initSaveManager() {
    window.updateButtonManager = updateButtonManager;
    window.saveMaterialsToProfile = saveMaterialsToProfile;
    window.updateExistingSave = updateExistingSave;
    window.showSaveNotification = showSaveNotification;
    
    // Добавляем слушатель события смены языка
    document.addEventListener('languageChanged', (e) => {
        const newLang = e.detail.lang;
        console.log('save-manager: смена языка на', newLang);
        
        // Обновляем менеджер кнопок
        if (window.updateButtonManager && window.updateButtonManager.updateLanguage) {
            window.updateButtonManager.updateLanguage(newLang);
        }
        
        // Обновляем текст в уведомлениях
        const notifications = document.querySelectorAll('.save-notification');
        notifications.forEach(notification => {
            if (notification.translate && typeof notification.translate === 'function') {
                notification.translate(newLang);
            }
        });
    });
}