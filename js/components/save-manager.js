// save-manager.js - полный код функций с синхронизацией Telegram
import { translations } from '../translations.js';
import { formatNumber } from '../utils/number-utils.js';
import telegramStorage from '../telegram-storage.js';

// Глобальная переменная для менеджера кнопок
let buttonManager = null;

// Инициализация менеджера сохранений
export function initSaveManager() {
    console.log('Инициализация менеджера сохранений');
    
    // Проверяем и загружаем данные из Telegram Cloud при запуске
    setTimeout(async () => {
        try {
            const cloudData = await telegramStorage.getItem('savedMaterials', []);
            const localData = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
            
            // Если в облаке есть данные, объединяем их с локальными
            if (cloudData.length > 0) {
                console.log('Обнаружены данные в Telegram Cloud:', cloudData.length, 'записей');
                
                // Создаем Map для быстрого поиска по ID
                const savesMap = new Map();
                
                // Добавляем локальные данные
                localData.forEach(save => {
                    if (save.id) savesMap.set(save.id, save);
                    else if (save.charKey) savesMap.set(save.charKey, save);
                    else if (save.weaponKey) savesMap.set(save.weaponKey, save);
                });
                
                // Добавляем или обновляем из облака (приоритет у более новых)
                cloudData.forEach(cloudSave => {
                    const existingKey = cloudSave.id || cloudSave.charKey || cloudSave.weaponKey;
                    if (existingKey) {
                        const existingSave = savesMap.get(existingKey);
                        if (!existingSave || 
                            (cloudSave.lastModified && existingSave.lastModified && 
                             cloudSave.lastModified > existingSave.lastModified)) {
                            savesMap.set(existingKey, cloudSave);
                        }
                    }
                });
                
                // Преобразуем обратно в массив
                const mergedSaves = Array.from(savesMap.values());
                localStorage.setItem('savedMaterials', JSON.stringify(mergedSaves));
                console.log('Данные объединены. Всего записей:', mergedSaves.length);
            }
        } catch (error) {
            console.error('Ошибка загрузки данных из облака:', error);
        }
    }, 1000);
}

// Сохранение материалов в профиль
export function saveMaterialsToProfile(character, lang) {
    console.log('Сохранение материалов в профиль для:', character.key);
    
    // Получаем данные с страницы
    const level = parseInt(document.getElementById('lvl')?.textContent) || 1;
    const attackLevel = parseInt(document.getElementById('lvl-attack')?.textContent) || 1;
    const skillLevel = parseInt(document.getElementById('lvl-skill')?.textContent) || 1;
    const explosionLevel = parseInt(document.getElementById('lvl-explosion')?.textContent) || 1;
    const rangeVal = document.getElementById('range')?.value || 0;
    
    // Собираем пользовательские вводы из секции "Все материалы"
    const userInputs = {};
    const inputElements = document.querySelectorAll('.all .materials-container input[type="number"]');
    
    inputElements.forEach(input => {
        const value = parseInt(input.value) || 0;
        const materialId = input.id.replace('all_', '').replace(/_/g, '.');
        userInputs[materialId] = value;
    });
    
    // Собираем материалы из всех секций
    const levelMaterials = getMaterialsFromSection('section.level .materials-container');
    const attackMaterials = getMaterialsFromSection('section.mat-attack .materials-container');
    const skillMaterials = getMaterialsFromSection('section.mat-skill .materials-container');
    const burstMaterials = getMaterialsFromSection('section.mat-explosion .materials-container');
    
    // Генерируем уникальный ID для сохранения
    const saveId = `save_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newSave = {
        id: saveId,
        type: 'character',
        charKey: character.key,
        characterName: character[`${lang}_name`] || character.en_name,
        characterAvatar: character.avatar,
        level: level,
        attackLevel: attackLevel,
        skillLevel: skillLevel,
        explosionLevel: explosionLevel,
        rangeVal: rangeVal,
        levelMaterials: levelMaterials,
        attackMaterials: attackMaterials,
        skillMaterials: skillMaterials,
        burstMaterials: burstMaterials,
        userInputs: userInputs,
        characterData: {
            rangeVal: rangeVal,
            fullCharacterData: character
        },
        date: new Date().toLocaleString(lang),
        lastModified: Date.now(),
        synced: false, // Будет обновлено после синхронизации
        lang: lang
    };
    
    console.log('Новое сохранение:', newSave);
    
    // Сохраняем в localStorage
    const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
    savedMaterials.push(newSave);
    localStorage.setItem('savedMaterials', JSON.stringify(savedMaterials));
    
    // Обновляем данные персонажа с флагом загрузки из сохранения
    const updatedCharData = {
        charName: character[`${lang}_name`] || character.en_name,
        charKey: character.key,
        rangeVal: rangeVal,
        level: level,
        attackLevel: attackLevel,
        skillLevel: skillLevel,
        explosionLevel: explosionLevel,
        userInputs: userInputs,
        characterAvatar: character.avatar,
        timestamp: Date.now(),
        characterData: {
            rangeVal: rangeVal,
            fullCharacterData: character
        },
        // Сохраняем материалы для быстрого доступа
        levelMaterials: levelMaterials,
        attackMaterials: attackMaterials,
        skillMaterials: skillMaterials,
        burstMaterials: burstMaterials,
        // Флаги загрузки
        isFromLoad: true,
        isFromSave: true,
        isFromProfile: true,
        loadedFromSave: true,
        saveId: saveId,
        lastModified: Date.now()
    };
    
    localStorage.setItem('characterLevelData', JSON.stringify(updatedCharData));
    localStorage.setItem('characterData', JSON.stringify(updatedCharData));
    
    // Синхронизируем с Telegram Cloud
    telegramStorage.syncSavedMaterials().then(() => {
        // Обновляем флаг синхронизации в сохранении
        const saves = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
        const saveIndex = saves.findIndex(s => s.id === saveId);
        if (saveIndex !== -1) {
            saves[saveIndex].synced = true;
            localStorage.setItem('savedMaterials', JSON.stringify(saves));
        }
    }).catch(error => {
        console.error('Ошибка синхронизации с Telegram Cloud:', error);
    });
    
    // Показываем уведомление
    const translationsObj = translations[lang] || translations['ru'];
    showSaveNotification(translationsObj.notifications?.saveSuccess || 'Материалы сохранены в профиль!', 'success');
    
    // Обновляем кнопки на странице
    setTimeout(() => {
        if (typeof checkAndSetupSaveButton === 'function') {
            checkAndSetupSaveButton(character, lang);
        }
    }, 500);
    
    return newSave;
}

// Обновление существующего сохранения
export function updateExistingSave(character, lang) {
    console.log('Обновление существующего сохранения для:', character.key);
    
    // Получаем текущие данные
    const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
    const existingSave = savedMaterials.find(save => save.charKey === character.key);
    
    if (!existingSave) {
        console.error('Сохранение для обновления не найдено');
        const translationsObj = translations[lang] || translations['ru'];
        showSaveNotification(translationsObj.notifications?.saveNotFound || 'Сохранение не найдено', 'error');
        return null;
    }
    
    // Получаем обновленные данные с страницы
    const level = parseInt(document.getElementById('lvl')?.textContent) || 1;
    const attackLevel = parseInt(document.getElementById('lvl-attack')?.textContent) || 1;
    const skillLevel = parseInt(document.getElementById('lvl-skill')?.textContent) || 1;
    const explosionLevel = parseInt(document.getElementById('lvl-explosion')?.textContent) || 1;
    const rangeVal = document.getElementById('range')?.value || 0;
    
    // Собираем пользовательские вводы
    const userInputs = {};
    const inputElements = document.querySelectorAll('.all .materials-container input[type="number"]');
    
    inputElements.forEach(input => {
        const value = parseInt(input.value) || 0;
        const materialId = input.id.replace('all_', '').replace(/_/g, '.');
        userInputs[materialId] = value;
    });
    
    // Собираем материалы из всех секций
    const levelMaterials = getMaterialsFromSection('section.level .materials-container');
    const attackMaterials = getMaterialsFromSection('section.mat-attack .materials-container');
    const skillMaterials = getMaterialsFromSection('section.mat-skill .materials-container');
    const burstMaterials = getMaterialsFromSection('section.mat-explosion .materials-container');
    
    const updatedSave = {
        ...existingSave,
        characterName: character[`${lang}_name`] || character.en_name,
        level: level,
        attackLevel: attackLevel,
        skillLevel: skillLevel,
        explosionLevel: explosionLevel,
        rangeVal: rangeVal,
        levelMaterials: levelMaterials,
        attackMaterials: attackMaterials,
        skillMaterials: skillMaterials,
        burstMaterials: burstMaterials,
        userInputs: userInputs,
        characterData: {
            ...existingSave.characterData,
            rangeVal: rangeVal,
            fullCharacterData: character
        },
        date: new Date().toLocaleString(lang),
        lastModified: Date.now(),
        synced: false
    };
    
    // Обновляем в массиве сохранений
    const saveIndex = savedMaterials.findIndex(save => save.charKey === character.key);
    if (saveIndex !== -1) {
        savedMaterials[saveIndex] = updatedSave;
        localStorage.setItem('savedMaterials', JSON.stringify(savedMaterials));
        
        // Обновляем данные персонажа
        const updatedCharData = {
            charName: character[`${lang}_name`] || character.en_name,
            charKey: character.key,
            rangeVal: rangeVal,
            level: level,
            attackLevel: attackLevel,
            skillLevel: skillLevel,
            explosionLevel: explosionLevel,
            userInputs: userInputs,
            characterAvatar: character.avatar,
            timestamp: Date.now(),
            characterData: {
                rangeVal: rangeVal,
                fullCharacterData: character
            },
            levelMaterials: levelMaterials,
            attackMaterials: attackMaterials,
            skillMaterials: skillMaterials,
            burstMaterials: burstMaterials,
            isFromLoad: true,
            isFromSave: true,
            isFromProfile: true,
            loadedFromSave: true,
            saveId: existingSave.id,
            lastModified: Date.now()
        };
        
        localStorage.setItem('characterLevelData', JSON.stringify(updatedCharData));
        localStorage.setItem('characterData', JSON.stringify(updatedCharData));
        
        // Синхронизируем с Telegram Cloud через метод updateSave
        telegramStorage.updateSave(updatedSave).then(updatedSaves => {
            // Обновляем локальное хранилище с синхронизированными данными
            localStorage.setItem('savedMaterials', JSON.stringify(updatedSaves));
            
            // Обновляем флаг синхронизации в сохранении
            const saves = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
            const updatedIndex = saves.findIndex(s => s.id === existingSave.id);
            if (updatedIndex !== -1) {
                saves[updatedIndex].synced = true;
                localStorage.setItem('savedMaterials', JSON.stringify(saves));
            }
        }).catch(error => {
            console.error('Ошибка синхронизации обновления:', error);
        });
        
        // Показываем уведомление
        const translationsObj = translations[lang] || translations['ru'];
        showSaveNotification(translationsObj.notifications?.updateSuccess || 'Сохранение обновлено!', 'success');
        
        // Обновляем кнопки на странице
        setTimeout(() => {
            if (typeof checkAndSetupSaveButton === 'function') {
                checkAndSetupSaveButton(character, lang);
            }
        }, 500);
        
        return updatedSave;
    }
    
    return null;
}

// Получение материалов из секции
function getMaterialsFromSection(selector) {
    const materials = {};
    const container = document.querySelector(selector);
    
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

// Показать уведомление о сохранении
export function showSaveNotification(message, type = 'success') {
    console.log('Показать уведомление:', message, type);
    
    // Удаляем старые уведомления
    document.querySelectorAll('.save-notification').forEach(el => el.remove());
    
    const notification = document.createElement('div');
    notification.className = `save-notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-width: 350px;
        word-break: break-word;
    `;
    
    // Добавляем иконку в зависимости от типа
    let icon = '✅';
    let bgColor = '#4CAF50';
    
    switch(type) {
        case 'success':
            icon = '✅';
            bgColor = '#4CAF50';
            break;
        case 'error':
            icon = '❌';
            bgColor = '#f44336';
            break;
        case 'warning':
            icon = '⚠️';
            bgColor = '#FF9800';
            break;
        case 'info':
            icon = 'ℹ️';
            bgColor = '#2196F3';
            break;
    }
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">${icon}</span>
            <span>${message}</span>
        </div>
    `;
    notification.style.background = bgColor;
    
    document.body.appendChild(notification);
    
    // Автоматическое скрытие через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
    
    // Добавляем стили для анимаций если их еще нет
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
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
    
    // Добавляем возможность закрытия по клику
    notification.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

// Инициализация менеджера кнопок обновления
export class UpdateButtonManager {
    constructor() {
        this.initialized = false;
        this.updateButton = null;
        this.character = null;
        this.lang = null;
        this.originalData = null;
    }
    
    init(character, lang, updateButton) {
        this.character = character;
        this.lang = lang;
        this.updateButton = updateButton;
        
        // Сохраняем исходные данные для сравнения
        this.originalData = this.getCurrentPageData();
        
        // Настраиваем кнопку
        this.setupUpdateButton();
        
        this.initialized = true;
        console.log('UpdateButtonManager инициализирован для:', character.key);
    }
    
    getCurrentPageData() {
        const level = parseInt(document.getElementById('lvl')?.textContent) || 1;
        const attackLevel = parseInt(document.getElementById('lvl-attack')?.textContent) || 1;
        const skillLevel = parseInt(document.getElementById('lvl-skill')?.textContent) || 1;
        const explosionLevel = parseInt(document.getElementById('lvl-explosion')?.textContent) || 1;
        const rangeVal = document.getElementById('range')?.value || 0;
        
        // Собираем пользовательские вводы
        const userInputs = {};
        const inputElements = document.querySelectorAll('.all .materials-container input[type="number"]');
        
        inputElements.forEach(input => {
            const value = parseInt(input.value) || 0;
            const materialId = input.id.replace('all_', '').replace(/_/g, '.');
            userInputs[materialId] = value;
        });
        
        return {
            level,
            attackLevel,
            skillLevel,
            explosionLevel,
            rangeVal,
            userInputs
        };
    }
    
    setupUpdateButton() {
        if (!this.updateButton) return;
        
        // Начальное состояние - неактивна
        this.updateButton.disabled = true;
        this.updateButton.style.opacity = '0.5';
        this.updateButton.style.cursor = 'not-allowed';
        
        // Добавляем обработчики изменений на странице
        this.addChangeListeners();
        
        console.log('Кнопка "Обновить" настроена');
    }
    
    addChangeListeners() {
        // Слайдер уровня персонажа
        const rangeInput = document.getElementById('range');
        if (rangeInput) {
            rangeInput.addEventListener('input', () => this.checkForChanges());
            rangeInput.addEventListener('change', () => this.checkForChanges());
        }
        
        // Слайдеры талантов
        const attackRange = document.querySelector('section.mat-attack input[type="range"]');
        const skillRange = document.querySelector('section.mat-skill input[type="range"]');
        const burstRange = document.querySelector('section.mat-explosion input[type="range"]');
        
        [attackRange, skillRange, burstRange].forEach(slider => {
            if (slider) {
                slider.addEventListener('input', () => this.checkForChanges());
                slider.addEventListener('change', () => this.checkForChanges());
            }
        });
        
        // Поля ввода материалов
        const materialInputs = document.querySelectorAll('.all .materials-container input[type="number"]');
        materialInputs.forEach(input => {
            input.addEventListener('input', () => this.checkForChanges());
            input.addEventListener('change', () => this.checkForChanges());
        });
        
        // Также проверяем изменения периодически
        setInterval(() => this.checkForChanges(), 1000);
    }
    
    checkForChanges() {
        if (!this.initialized || !this.updateButton) return;
        
        const currentData = this.getCurrentPageData();
        const hasChanges = this.hasDataChanged(currentData);
        
        console.log('Проверка изменений:', {
            original: this.originalData,
            current: currentData,
            hasChanges: hasChanges
        });
        
        if (hasChanges) {
            // Есть изменения - активируем кнопку
            this.updateButton.disabled = false;
            this.updateButton.style.opacity = '1';
            this.updateButton.style.cursor = 'pointer';
            this.updateButton.style.filter = 'none';
            
            // Добавляем визуальный индикатор изменений
            if (!this.updateButton.querySelector('.change-indicator')) {
                const indicator = document.createElement('span');
                indicator.className = 'change-indicator';
                indicator.innerHTML = ' •';
                indicator.style.color = '#FF9800';
                indicator.style.fontSize = '24px';
                indicator.style.verticalAlign = 'middle';
                this.updateButton.appendChild(indicator);
            }
        } else {
            // Нет изменений - деактивируем кнопку
            this.updateButton.disabled = true;
            this.updateButton.style.opacity = '0.5';
            this.updateButton.style.cursor = 'not-allowed';
            
            // Убираем индикатор изменений
            const indicator = this.updateButton.querySelector('.change-indicator');
            if (indicator) {
                indicator.remove();
            }
        }
    }
    
    hasDataChanged(currentData) {
        // Сравниваем уровни
        if (currentData.level !== this.originalData.level ||
            currentData.attackLevel !== this.originalData.attackLevel ||
            currentData.skillLevel !== this.originalData.skillLevel ||
            currentData.explosionLevel !== this.originalData.explosionLevel ||
            currentData.rangeVal !== this.originalData.rangeVal) {
            return true;
        }
        
        // Сравниваем пользовательские вводы
        const originalKeys = Object.keys(this.originalData.userInputs || {});
        const currentKeys = Object.keys(currentData.userInputs || {});
        
        if (originalKeys.length !== currentKeys.length) {
            return true;
        }
        
        for (const key of originalKeys) {
            if (this.originalData.userInputs[key] !== currentData.userInputs[key]) {
                return true;
            }
        }
        
        return false;
    }
    
    updateLanguage(newLang) {
        this.lang = newLang;
        // Обновляем текст кнопки
        if (this.updateButton) {
            const span = this.updateButton.querySelector('span');
            if (span) {
                const translationsObj = translations[newLang] || translations['ru'];
                span.textContent = translationsObj.buttons?.update || 'Обновить';
            }
        }
    }
}

// Создаем и экспортируем глобальный экземпляр менеджера
export const updateButtonManager = new UpdateButtonManager();

// Экспортируем для использования в других модулях
export { updateButtonManager as default };