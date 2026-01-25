// web.js - полный исправленный файл
import { initTelegramDebug } from './telegram-debug.js';
import { modalManager } from './components/modal-manager.js';
import { initFilterButtonSystem } from './components/filter-button-system.js';
import { pageLayouts } from './modules/common-module.js';
import { translations } from './translations.js';
import { ServerTimer } from './serverTimer.js';
import { renderMiniCalendar } from './utils/calendar-utils.js';
import { initGlobalLocaleHandler } from './global-locale-handler.js';
import { dateManager } from './date-manager.js';
import telegramStorage from './telegram-storage.js';

// Импорт модулей
import { initHomeModule } from './modules/home-module.js';
import { initCharactersModule } from './modules/characters-module.js';
import { initWeaponModule } from './modules/weapon-module.js';
import { initDateModule } from './modules/date-module.js';
import { initProfileModule, renderSavedMaterials } from './modules/profile-module.js';

import { 
    loadCharacterDetailPage,
    updateCharacterStats,
    updateAttackStats,
    getLevelFromSliderValue,
} from './modules/character-pages.js';

import { materialCategories, materialsInfo } from './materialsData.js';
import { initCalculatorModule, loadCalculatorSaveById } from './modules/calculator-module.js';

// Импорт утилит
import { 
    setLanguage,
    updateLanguageButtons,
    localizeNavigation,
    applyTranslations,
    retranslateDynamicContent,
    updateSaveButtonText,
    triggerLanguageChange,
    getTranslation
} from './utils/language-utils.js';

import {
    updateActiveNav,
    moveHighlight,
    handleNavigation,
    handleHashChange,
    handleResize,
    updateAfterImagesLoad,
    setupNavigationListeners
} from './utils/navigation-utils.js';

import { 
    localizeCharacterInfoPage, 
    localizeMaterialNames,
    updateCharacterMaterialsPageLang as utilsUpdateCharacterMaterialsPageLang
} from './utils/translation-utils.js';

import { 
    saveMaterialsToProfile, 
    updateExistingSave, 
    showSaveNotification,
    updateButtonManager,
    initSaveManager
} from './components/save-manager.js';

import { formatNumber, parseFormattedNumber } from './utils/number-utils.js';

import { charsData } from './characterData.js';

// Добавьте charsData в глобальный объект window
window.charsData = charsData;
console.log('charsData добавлен в глобальную область видимости:', Object.keys(charsData).length, 'персонажей');

// Делаем telegramStorage глобально доступным
window.telegramStorage = telegramStorage;
console.log('telegramStorage добавлен в глобальную область видимости');

// Глобальные переменные
let currentPageId = 'home';

// Инициализация глобальных объектов
window.currentLang = localStorage.getItem('lang') || 'ru';
window.modalManager = modalManager;

// Делаем функции доступными глобально
window.setLanguage = setLanguage;
window.updateLanguageButtons = updateLanguageButtons;
window.getTranslation = getTranslation;

// Инициализация системы кнопок фильтра
const filterButtonSystem = initFilterButtonSystem();

// Функция для обновления страницы оружия
function updateWeaponPage(lang) {
    const title = document.querySelector('.weapon-page h1');
    if (title) {
        title.textContent = translations[lang]?.['weapon.title'] || 'Оружие';
    }
    
    // Обновляем кнопку фильтра для оружия
    if (typeof createWeaponFilterButton === 'function') {
        createWeaponFilterButton();
    }
    
    // Обновляем карточки оружия
    if (typeof renderWeaponCards === 'function') {
        renderWeaponCards(lang);
    }
}

// Функция для обновления карточек персонажей
function updateCharacterCards(lang) {
    const nameElements = document.querySelectorAll('.card-character .name p');
    nameElements.forEach(element => {
        const article = element.closest('.card-character');
        if (!article) return;
        
        const charKey = article.getAttribute('data-name');
        const charData = window.charsData?.[charKey];
        
        if (charData) {
            element.textContent = charData[`${lang}_name`] || charData.en_name;
        }
    });
}

// Основная функция переключения страниц
window.showPage = function(pageId) {
    console.log('showPage вызван:', pageId, 'язык:', window.currentLang);
    const content = document.getElementById('content');

    if (!content) return;
    
    // Закрываем все модальные окна
    if (window.modalManager) {
        window.modalManager.closeAll();
    }

    // Обновляем кнопки фильтра/назад
    if (filterButtonSystem) {
        filterButtonSystem.updateForPage(pageId);
    }

    if (pageLayouts[pageId]) {
        const layout = pageLayouts[pageId];
        const localizedHtml = applyTranslations(layout, window.currentLang);
        content.innerHTML = localizedHtml;
        
        // Специальная обработка для страницы материалов
        if (pageId === 'characters/mat') {
            console.log('Страница материалов - специальная инициализация');
            
            // Даем время для рендеринга DOM
            setTimeout(() => {
                // Сначала обновляем уровни
                updateCharacterLevelsOnPage();
                
                // Затем рендерим материалы
                setTimeout(() => {
                    renderMaterialsPage();
                }, 100);
            }, 50);
        } else {
            // Для других страниц используем стандартную инициализацию
            setTimeout(() => {
                initPageContent(pageId);
            }, 50);
        }
    }
    
    updateActiveNav();
    updateAfterImagesLoad();
};

// Инициализация контента страницы
function initPageContent(pageId) {
    console.log('Инициализация контента для страницы:', pageId);
    
    if (pageId === 'profile/calculator') {
        // Инициализируем калькулятор
        setTimeout(() => {
            if (typeof initCalculatorModule === 'function') {
                initCalculatorModule();
                
                const saveId = localStorage.getItem('loadCalculatorSaveId');
                if (saveId) {
                    setTimeout(() => {
                        loadCalculatorSaveById(saveId);
                        localStorage.removeItem('loadCalculatorSaveId');
                    }, 500);
                }
            }
        }, 100);
    } else if (pageId === 'characters/mat') {
        initCharactersModule(pageId);
        
        setTimeout(() => {
            if (localizeMaterialNames) {
                localizeMaterialNames(window.currentLang);
            }
        }, 100);
        
    } else if (pageId === 'characters/info') {
        initCharactersModule(pageId);
        setTimeout(() => {
            const savedChar = localStorage.getItem('selectedCharacter');
            if (savedChar) {
                const { data } = JSON.parse(savedChar);
                if (localizeCharacterInfoPage) {
                    localizeCharacterInfoPage(data, window.currentLang);
                }
            }
        }, 100);
    } else if (pageId === 'date' || pageId.startsWith('date/')) {
        // ОСОБЕННО ВАЖНО: Инициализация страниц Date
        console.log('Инициализация страницы Date через dateManager');
        if (dateManager && typeof dateManager.initSubpage === 'function') {
            setTimeout(() => {
                dateManager.initSubpage(pageId);
            }, 100);
        } else {
            console.error('dateManager не доступен или не имеет метода initSubpage');
            initDateModule(pageId); // Резервный вариант
        }
    } else {
        // Для других страниц
        if (pageId === 'home' || pageId.startsWith('home/')) {
            initHomeModule(pageId);
        } else if (pageId === 'characters' || pageId.startsWith('characters/')) {
            initCharactersModule(pageId);
        } else if (pageId === 'weapon' || pageId.startsWith('weapon/')) {
            initWeaponModule(pageId);
        } else if (pageId === 'profile') {
            initProfileModule();
        }
    }
    
    // ОСОБЕННО ВАЖНО: Инициализация карточек оружия
    if (pageId === 'weapon') {
        console.log('Рендерим карточки оружия...');
        setTimeout(() => {
            if (typeof renderWeaponCards === 'function') {
                renderWeaponCards(window.currentLang);
            }
            if (typeof createWeaponFilterButton === 'function') {
                createWeaponFilterButton();
            }
        }, 150);
    }
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

// Функция для рендеринга страницы материалов
function renderMaterialsPage() {
    console.log('=== RENDER MATERIALS PAGE - НАЧАЛО ===');
    
    const savedChar = localStorage.getItem('selectedCharacter');
    if (!savedChar) {
        console.error('Нет сохраненного персонажа');
        showErrorMessage('Персонаж не выбран');
        return;
    }
    
    let characterData;
    try {
        const parsed = JSON.parse(savedChar);
        characterData = parsed.data;
        console.log('Данные персонажа:', characterData.en_name);
    } catch (error) {
        console.error('Ошибка парсинга персонажа:', error);
        showErrorMessage('Ошибка загрузки данных персонажа');
        return;
    }

    // Обновляем имя и иконку персонажа
    updateCharacterNameAndIcon(characterData);
    
    // Обновляем уровни
    updateCharacterLevelsOnPage();

    // Получаем данные из localStorage
    const levelData = JSON.parse(localStorage.getItem('characterLevelData') || '{}');
    const charData = JSON.parse(localStorage.getItem('characterData') || '{}');
    
    // Объединяем данные
    const combinedData = { ...charData, ...levelData };
    console.log('Объединенные данные для рендеринга:', combinedData);

    // УСИЛЕННАЯ проверка наличия материалов в сохранении
    const hasMaterialsInSave = 
        (combinedData.levelMaterials && Object.keys(combinedData.levelMaterials).length > 0) ||
        (combinedData.attackMaterials && Object.keys(combinedData.attackMaterials).length > 0) ||
        (combinedData.skillMaterials && Object.keys(combinedData.skillMaterials).length > 0) ||
        (combinedData.burstMaterials && Object.keys(combinedData.burstMaterials).length > 0) ||
        (combinedData.characterData && combinedData.characterData.levelMaterials && 
         Object.keys(combinedData.characterData.levelMaterials).length > 0) ||
        (combinedData.characterData && combinedData.characterData.attackMaterials && 
         Object.keys(combinedData.characterData.attackMaterials).length > 0);

    console.log('Проверка материалов в сохранении:', {
        hasMaterialsInSave,
        levelMaterials: combinedData.levelMaterials,
        attackMaterials: combinedData.attackMaterials,
        skillMaterials: combinedData.skillMaterials,
        burstMaterials: combinedData.burstMaterials,
        characterDataLevel: combinedData.characterData?.levelMaterials
    });
    
    // ВАЖНО: Если материалы есть в сохранении - используем их
    if (hasMaterialsInSave) {
        console.log('Используем материалы из сохранения');
        
        // Извлекаем материалы из разных возможных мест
        let levelMaterials = combinedData.levelMaterials || 
                           combinedData.characterData?.levelMaterials || {};
        let attackMaterials = combinedData.attackMaterials || 
                            combinedData.characterData?.attackMaterials || {};
        let skillMaterials = combinedData.skillMaterials || 
                           combinedData.characterData?.skillMaterials || {};
        let burstMaterials = combinedData.burstMaterials || 
                           combinedData.characterData?.burstMaterials || {};
        
        console.log('Извлеченные материалы для рендеринга:', {
            level: levelMaterials,
            attack: attackMaterials,
            skill: skillMaterials,
            burst: burstMaterials
        });
        
        // Если материалы все еще пустые, вычисляем их на основе уровней
        if (Object.keys(levelMaterials).length === 0) {
            console.log('Материалы уровня пустые, вычисляем...');
            const realLevel = getRealLevelFromRange(combinedData.rangeVal || combinedData.characterData?.rangeVal || 0);
            levelMaterials = getLevelMaterials(realLevel);
            console.log('Вычисленные материалы уровня:', levelMaterials);
        }
        
        if (Object.keys(attackMaterials).length === 0) {
            const attackLevel = combinedData.attackLevel || 1;
            attackMaterials = getTalentMaterials('attack', attackLevel);
        }
        
        if (Object.keys(skillMaterials).length === 0) {
            const skillLevel = combinedData.skillLevel || 1;
            skillMaterials = getTalentMaterials('skill', skillLevel);
        }
        
        if (Object.keys(burstMaterials).length === 0) {
            const explosionLevel = combinedData.explosionLevel || 1;
            burstMaterials = getTalentMaterials('burst', explosionLevel);
        }
        
        console.log('Финальные материалы для рендеринга:', {
            level: levelMaterials,
            attack: attackMaterials,
            skill: skillMaterials,
            burst: burstMaterials
        });
        
        // Рендерим материалы
        renderMaterialsToContainer('section.level .materials-container', levelMaterials, 'level', characterData);
        renderMaterialsToContainer('section.mat-attack .materials-container', attackMaterials, 'attack', characterData);
        renderMaterialsToContainer('section.mat-skill .materials-container', skillMaterials, 'skill', characterData);
        renderMaterialsToContainer('section.mat-explosion .materials-container', burstMaterials, 'explosion', characterData);
        
        // Рендерим "Все материалы"
        const allMaterials = getAllMaterialsFromSections(levelMaterials, attackMaterials, skillMaterials, burstMaterials);
        renderAllMaterialsSection(allMaterials, characterData);
        
    } else {
        // Если нет сохраненных материалов, вычисляем их
        console.log('Нет сохраненных материалов, вычисляем заново...');
        const rangeVal = combinedData.rangeVal || combinedData.characterData?.rangeVal || 0;
        const realLevel = getRealLevelFromRange(rangeVal);
        
        const levelMaterials = getLevelMaterials(realLevel);
        const attackMaterials = getTalentMaterials('attack', combinedData.attackLevel || 1);
        const skillMaterials = getTalentMaterials('skill', combinedData.skillLevel || 1);
        const burstMaterials = getTalentMaterials('burst', combinedData.explosionLevel || 1);
        
        console.log('Вычисленные материалы:', {
            level: levelMaterials,
            attack: attackMaterials,
            skill: skillMaterials,
            burst: burstMaterials
        });
        
        // Рендерим материалы
        renderMaterialsToContainer('section.level .materials-container', levelMaterials, 'level', characterData);
        renderMaterialsToContainer('section.mat-attack .materials-container', attackMaterials, 'attack', characterData);
        renderMaterialsToContainer('section.mat-skill .materials-container', skillMaterials, 'skill', characterData);
        renderMaterialsToContainer('section.mat-explosion .materials-container', burstMaterials, 'explosion', characterData);
        
        // Рендерим "Все материалы"
        const allMaterials = getAllMaterialsFromSections(levelMaterials, attackMaterials, skillMaterials, burstMaterials);
        renderAllMaterialsSection(allMaterials, characterData);
    }
    
    // Восстанавливаем пользовательские вводы
    const userInputs = combinedData.userInputs || combinedData.characterData?.userInputs || {};
    if (Object.keys(userInputs).length > 0) {
        console.log('Восстанавливаем пользовательские вводы:', userInputs);
        setTimeout(() => {
            restoreUserInputs(userInputs);
        }, 500);
    }
    
    // Настраиваем кнопки сохранения
    setTimeout(() => {
        if (typeof window.checkAndSetupSaveButton === 'function') {
            window.checkAndSetupSaveButton(characterData, window.currentLang);
        }
    }, 500);
    
    // Сбрасываем флаги загрузки после рендеринга
    setTimeout(() => {
        resetLoadFlags();
    }, 1000);
}

// Добавьте новую вспомогательную функцию
function getAllMaterialsFromSections(levelMats, attackMats, skillMats, burstMats) {
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
    
    return allMaterials;
}

// Новая функция для обновления имени и иконки
function updateCharacterNameAndIcon(characterData) {
    console.log('Обновление имени и иконки персонажа');
    
    const lang = window.currentLang || 'ru';
    const charName = characterData[`${lang}_name`] || characterData.en_name;
    
    // Обновляем имя
    const nameElement = document.getElementById('char-name');
    if (nameElement) {
        nameElement.textContent = charName;
        console.log('Имя обновлено:', charName);
    } else {
        console.error('Элемент char-name не найден');
        // Пробуем найти позже
        setTimeout(() => {
            const retryElement = document.getElementById('char-name');
            if (retryElement) {
                retryElement.textContent = charName;
                console.log('Имя обновлено с задержкой:', charName);
            }
        }, 100);
    }
    
    // Обновляем иконку
    const iconElement = document.getElementById('char-icon');
    if (iconElement && characterData.avatar) {
        // Очищаем и добавляем новое изображение
        iconElement.innerHTML = '';
        const img = document.createElement('img');
        img.src = characterData.avatar;
        img.alt = charName;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '10px';
        iconElement.appendChild(img);
        console.log('Иконка обновлена:', characterData.avatar);
    } else if (characterData.avatar) {
        console.error('Элемент char-icon не найден, но avatar есть:', characterData.avatar);
    }
}

// Добавьте эту функцию в web.js
function updateCharacterLevelsOnPage() {
    console.log('Обновление уровней на странице...');
    
    // Получаем данные
    const savedChar = localStorage.getItem('selectedCharacter');
    const levelData = JSON.parse(localStorage.getItem('characterLevelData') || '{}');
    const charData = JSON.parse(localStorage.getItem('characterData') || '{}');
    
    // Объединяем данные
    const combinedData = { ...levelData, ...charData };
    
    // Функция для получения реального уровня
    function getRealLevel(rangeVal) {
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
    
    // Определяем уровень
    let level;
    if (combinedData.level && !isNaN(combinedData.level)) {
        level = parseInt(combinedData.level);
    } else if (combinedData.rangeVal !== undefined) {
        level = getRealLevel(combinedData.rangeVal);
    } else {
        level = 1;
    }
    
    // Обновляем элементы
    const elements = [
        { id: 'lvl', value: level },
        { id: 'lvl-attack', value: combinedData.attackLevel || 1 },
        { id: 'lvl-skill', value: combinedData.skillLevel || 1 },
        { id: 'lvl-explosion', value: combinedData.explosionLevel || 1 }
    ];
    
    elements.forEach(({ id, value }) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
            console.log(`${id}: ${value}`);
        }
    });
    
    return combinedData;
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
    
    // ВАЖНО: Проверяем, есть ли уже готовые материалы в данных
    let levelMaterials = data.levelMaterials;
    let attackMaterials = data.attackMaterials;
    let skillMaterials = data.skillMaterials;
    let burstMaterials = data.burstMaterials;
    
    // Если материалов нет в данных, вычисляем их
    if (!levelMaterials || Object.keys(levelMaterials).length === 0) {
        console.log('Вычисляем материалы уровня...');
        levelMaterials = getLevelMaterials(realLevel);
    }
    
    if (!attackMaterials || Object.keys(attackMaterials).length === 0) {
        console.log('Вычисляем материалы атаки...');
        attackMaterials = getTalentMaterials('attack', attackLevel);
    }
    
    if (!skillMaterials || Object.keys(skillMaterials).length === 0) {
        console.log('Вычисляем материалы навыка...');
        skillMaterials = getTalentMaterials('skill', skillLevel);
    }
    
    if (!burstMaterials || Object.keys(burstMaterials).length === 0) {
        console.log('Вычисляем материалы взрыва...');
        burstMaterials = getTalentMaterials('burst', explosionLevel);
    }
    
    console.log('Материалы уровня:', levelMaterials);
    console.log('Материалы атаки:', attackMaterials);
    console.log('Материалы навыка:', skillMaterials);
    console.log('Материалы взрыва:', burstMaterials);
    
    renderMaterialsToContainer('section.level .materials-container', levelMaterials, 'level', characterData);
    renderMaterialsToContainer('section.mat-attack .materials-container', attackMaterials, 'attack', characterData);
    renderMaterialsToContainer('section.mat-skill .materials-container', skillMaterials, 'skill', characterData);
    renderMaterialsToContainer('section.mat-explosion .materials-container', burstMaterials, 'explosion', characterData);
    
    renderAllMaterials(levelMaterials, attackMaterials, skillMaterials, burstMaterials, characterData);
}

// Добавьте эту функцию
function restoreMaterialsFromSave(savedMaterialsData) {
    console.log('Восстановление материалов из сохранения:', savedMaterialsData);
    
    if (!savedMaterialsData) return;
    
    const sections = [
        { type: 'level', data: savedMaterialsData.levelMaterials },
        { type: 'attack', data: savedMaterialsData.attackMaterials },
        { type: 'skill', data: savedMaterialsData.skillMaterials },
        { type: 'explosion', data: savedMaterialsData.burstMaterials }
    ];
    
    sections.forEach(({ type, data }) => {
        if (data && Object.keys(data).length > 0) {
            const container = document.querySelector(`.materials-container[data-type="${type}"]`);
            if (container) {
                container.innerHTML = '';
                Object.entries(data).forEach(([materialKey, amount]) => {
                    if (amount > 0) {
                        const savedChar = localStorage.getItem('selectedCharacter');
                        let characterData = {};
                        try {
                            const parsed = JSON.parse(savedChar);
                            characterData = parsed.data;
                        } catch (e) {
                            console.error('Ошибка парсинга персонажа:', e);
                        }
                        
                        const materialElement = createMaterialElement(materialKey, amount, type, characterData);
                        container.appendChild(materialElement);
                    }
                });
            }
        }
    });
}

// Вспомогательная функция для получения всех материалов со страницы
function getAllMaterialsFromPage() {
    const allMaterials = {};
    
    const sections = ['level', 'attack', 'skill', 'explosion'];
    sections.forEach(type => {
        const container = document.querySelector(`.materials-container[data-type="${type}"]`);
        if (container) {
            container.querySelectorAll('.material-item').forEach(item => {
                const materialKey = item.dataset.materialKey;
                const amountElement = item.querySelector('.material-amount');
                if (materialKey && amountElement) {
                    const amount = parseInt(amountElement.dataset.amount) || 0;
                    if (amount > 0) {
                        allMaterials[materialKey] = (allMaterials[materialKey] || 0) + amount;
                    }
                }
            });
        }
    });
    
    return allMaterials;
}

// Функция рендеринга секции "Все материалы"
function renderAllMaterialsSection(allMaterials, characterData) {
    const container = document.querySelector('section.all .materials-container');
    if (!container) return;
    
    container.innerHTML = '';
    
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

// Функция для получения материалов уровня
function getLevelMaterials(realLevel) {
    if (!materialCategories.amountsPerLevel) return {};
    
    let targetKey;
    
    if (realLevel >= 90) targetKey = 70;
    else if (realLevel >= 80) targetKey = 60;
    else if (realLevel >= 70) targetKey = 50;
    else if (realLevel >= 60) targetKey = 40;
    else if (realLevel >= 50) targetKey = 30;
    else if (realLevel >= 40) targetKey = 20;
    else if (realLevel >= 20) targetKey = 10;
    else targetKey = 10; // Для уровня 1-19 используем ключ 10
    
    console.log('Поиск материалов уровня для:', { realLevel, targetKey });
    
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
        container.textContent = translations[window.currentLang]?.material?.none || 'Нет материалов';
        return;
    }
    
    Object.entries(materials).forEach(([materialKey, amount]) => {
        if (amount > 0) {
            const materialElement = createMaterialElement(materialKey, amount, sectionType, characterData);
            container.appendChild(materialElement);
        }
    });
}

// Функция для инициализации скрипта материалов
async function initMaterialsScript(character, lang) {
    console.log('=== ИНИЦИАЛИЗАЦИЯ СКРИПТА МАТЕРИАЛОВ ===');
    
    const levelData = JSON.parse(localStorage.getItem('characterLevelData') || '{}');
    const charData = JSON.parse(localStorage.getItem('characterData') || '{}');
    
    console.log('Полученные данные:', { levelData, charData });
    
    // Если данных нет, создаем новые
    if (!levelData.charKey && !charData.charKey) {
        console.log('Создание новых данных для персонажа');
        
        const newData = {
            charName: character.en_name,
            charKey: character.key,
            rangeVal: 0,
            level: 1,
            attackLevel: 1,
            skillLevel: 1,
            explosionLevel: 1,
            lang: lang,
            fullCharacterData: character,
            userInputs: {},
            timestamp: Date.now(),
            isNewSetup: true
        };
        
        localStorage.setItem('characterLevelData', JSON.stringify(newData));
        localStorage.setItem('characterData', JSON.stringify(newData));
    }
    
    // Уменьшаем задержки
    setTimeout(() => {
        updateCharacterLevelsOnPage();
    }, 50);
    
    setTimeout(() => {
        renderMaterialsPage();
    }, 100);
}

// Функция для создания элемента материала
function createMaterialElement(materialKey, amount, sectionType, characterData) {
    const div = document.createElement('div');
    div.className = 'material-item';
    div.dataset.materialKey = materialKey;
    
    const materialInfo = getMaterialInfo(materialKey, characterData);
    const lang = window.currentLang || 'ru';
    const translationsObj = translations[lang] || translations['ru'];
    const formattedAmount = formatNumber(amount, lang);
    
    div.innerHTML = `
        <img src="${materialInfo.icon || 'assets/unknown.png'}" 
             alt="${materialInfo.name}" 
             class="material-icon"
             data-key="${materialKey}"
             onerror="this.src='assets/unknown.png'">
        <div class="material-info">
            <span class="material-name" data-key="${materialKey}">${materialInfo.name}</span>
            <span class="material-amount" data-amount="${amount}">${formattedAmount}</span>
        </div>
    `;
    
    if (sectionType === 'all') {
        const safeId = materialKey.replace(/[^a-zA-Z0-9]/g, '_');
        const inputId = `all_${safeId}`;
        
        div.innerHTML += `
            <div class="material-input">
                <input type="number" id="${inputId}" min="0" value="0" 
                       placeholder="${translationsObj.input?.placeholder || 'Имеется'}"
                       data-amount="${amount}"
                       data-lang="${lang}">
                <span class="material-remaining" data-lang="${lang}">
                    ${translationsObj.material?.remaining || 'Осталось'}: ${formattedAmount}
                </span>
            </div>
        `;
        
        // Обработчик input с сохранением языка
        setTimeout(() => {
            const input = div.querySelector(`#${inputId}`);
            if (input) {
                input.addEventListener('input', function() {
                    const have = parseInt(this.value) || 0;
                    const amount = parseInt(this.dataset.amount) || 0;
                    const remaining = Math.max(0, amount - have);
                    const remainingSpan = this.parentElement.querySelector('.material-remaining');
                    
                    if (remainingSpan) {
                        const currentLang = remainingSpan.getAttribute('data-lang') || lang;
                        const currentTranslations = translations[currentLang] || translations['ru'];
                        const formattedRemaining = formatNumber(remaining, currentLang);
                        remainingSpan.textContent = 
                            `${currentTranslations.material?.remaining || 'Осталось'}: ${formattedRemaining}`;
                    }
                });
            }
        }, 10);
    }
    
    return div;
}

// Функция для динамической локализации всех материалов
function localizeAllMaterials(lang) {
    console.log('Локализация всех материалов для языка:', lang);
    
    const translationsObj = translations[lang] || translations['ru'];
    
    // Локализуем названия материалов во ВСЕХ секциях
    const allSections = [
        'section.level .materials-container',
        'section.mat-attack .materials-container',
        'section.mat-skill .materials-container',
        'section.mat-explosion .materials-container',
        'section.all .materials-container'
    ];
    
    allSections.forEach(selector => {
        const container = document.querySelector(selector);
        if (!container) return;
        
        container.querySelectorAll('.material-item').forEach(item => {
            const materialKey = item.dataset.materialKey;
            if (materialKey) {
                const materialInfo = getMaterialInfo(materialKey, window.currentCharacter);
                
                // Обновляем имя
                const nameElement = item.querySelector('.material-name');
                if (nameElement && materialInfo) {
                    nameElement.textContent = materialInfo.name;
                }
                
                // Обновляем иконку
                const iconElement = item.querySelector('.material-icon');
                if (iconElement && materialInfo.icon) {
                    iconElement.src = materialInfo.icon;
                    iconElement.alt = materialInfo.name;
                }
                
                // Обновляем количество с форматированием
                const amountElement = item.querySelector('.material-amount');
                if (amountElement && amountElement.dataset.amount) {
                    const amount = parseInt(amountElement.dataset.amount) || 0;
                    amountElement.textContent = formatNumber(amount, lang);
                }
                
                // Обновляем текст "Осталось" с сохранением языка
                const remainingElement = item.querySelector('.material-remaining');
                if (remainingElement) {
                    const input = item.querySelector('input[type="number"]');
                    if (input) {
                        const have = parseInt(input.value) || 0;
                        const amount = parseInt(input.dataset.amount) || 0;
                        const remaining = Math.max(0, amount - have);
                        const formattedRemaining = formatNumber(remaining, lang);
                        
                        remainingElement.textContent = 
                            `${translationsObj.material?.remaining || 'Осталось'}: ${formattedRemaining}`;
                        remainingElement.setAttribute('data-lang', lang);
                    }
                }
                
                // Обновляем placeholder инпута
                const inputElement = item.querySelector('input[type="number"]');
                if (inputElement) {
                    inputElement.setAttribute('placeholder', 
                        translationsObj.input?.placeholder || 'Имеется');
                    inputElement.setAttribute('data-lang', lang);
                }
            }
        });
    });
    
    // Локализуем заголовки секций
    const sectionTitles = {
        'section.level h2': 'character.level',
        'section.mat-attack h2': 'character.attack',
        'section.mat-skill h2': 'character.skill', 
        'section.mat-explosion h2': 'character.explosion',
        'section.all h2': 'character.allMaterials'
    };
    
    Object.entries(sectionTitles).forEach(([selector, key]) => {
        const element = document.querySelector(selector);
        if (element) {
            const translation = getTranslation(key, lang);
            if (translation && translation !== key) {
                element.textContent = translation;
            }
        }
    });
}

// Функция для обновления всех динамических текстов
function updateDynamicTexts(lang) {
    console.log('updateDynamicTexts вызвана для языка:', lang);
    
    // Обновляем все элементы с data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getTranslation(key, lang);
        
        if (translation && translation !== key) {
            if (element.tagName === 'IMG') {
                element.alt = translation;
            } else if (element.tagName === 'INPUT') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        }
    });
    
    // Обновляем элементы с data-i18n-title и data-i18n-alt
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        const translation = getTranslation(key, lang);
        if (translation && translation !== key) {
            element.title = translation;
        }
    });
    
    document.querySelectorAll('[data-i18n-alt]').forEach(element => {
        const key = element.getAttribute('data-i18n-alt');
        const translation = getTranslation(key, lang);
        if (translation && translation !== key) {
            element.alt = translation;
        }
    });
    
    // Обновляем кнопки сохранения
    updateSaveButtonsLanguage(lang);
}

// Функция для получения информации о материале
function getMaterialInfo(materialKey, character = null) {
    const lang = window.currentLang || 'ru';
    
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
                if (materialInfo.name[lang]) {
                    materialName = materialInfo.name[lang];
                } else if (materialInfo.name.ru) {
                    materialName = materialInfo.name.ru;
                } else if (materialInfo.name.en) {
                    materialName = materialInfo.name.en;
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
                if (materialInfo.name[lang]) {
                    materialName = materialInfo.name[lang];
                } else if (materialInfo.name.ru) {
                    materialName = materialInfo.name.ru;
                } else if (materialInfo.name.en) {
                    materialName = materialInfo.name.en;
                }
            }
        }
    }
    
    // Если это элементный материал (sliver, fragment, etc.), используем элемент персонажа
    if (character && character.element) {
        const element = character.element.toLowerCase();
        const elementMaterials = {
            'sliver': element,
            'fragment': element,
            'chunk': element,
            'gemstone': element
        };
        
        for (const [materialType, elementType] of Object.entries(elementMaterials)) {
            if (materialKey.toLowerCase().includes(materialType)) {
                const elementMaterial = materialsInfo[materialType]?.[character.element];
                if (elementMaterial && elementMaterial.name) {
                    if (elementMaterial.name[lang]) {
                        materialName = elementMaterial.name[lang];
                    } else if (elementMaterial.name.ru) {
                        materialName = elementMaterial.name.ru;
                    }
                }
            }
        }
    }
    
    return {
        name: materialName,
        icon: (materialInfo && materialInfo.icon) || 'assets/unknown.png'
    };
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

// Функция для обновления языка кнопок сохранения
function updateSaveButtonsLanguage(lang) {
    const translationsObj = translations[lang] || translations['ru'];
    
    // Кнопка "Сохранить"
    const saveBtn = document.getElementById('save-materials-btn');
    if (saveBtn) {
        const span = saveBtn.querySelector('span');
        if (span) {
            span.textContent = translationsObj.buttons?.save || 'Сохранить';
        }
    }
    
    // Кнопка "Обновить"
    const updateBtn = document.getElementById('update-materials-btn');
    if (updateBtn) {
        const span = updateBtn.querySelector('span');
        if (span) {
            span.textContent = translationsObj.buttons?.update || 'Обновить';
        }
    }
    
    // Кнопка "Перезаписать"
    const overwriteBtn = document.getElementById('overwrite-materials-btn');
    if (overwriteBtn) {
        const span = overwriteBtn.querySelector('span');
        if (span) {
            span.textContent = translationsObj.buttons?.overwrite || 'Перезаписать';
        }
    }
}

// Функция для проверки и настройки кнопки сохранения/обновления с динамической локализацией
function checkAndSetupSaveButton(character, lang) {
    console.log('checkAndSetupSaveButton вызвана для:', character.key);
    
    // Удаляем старые контейнеры кнопок
    document.querySelectorAll('.save-buttons-container').forEach(container => {
        container.remove();
    });
    
    // Создаем новый контейнер для кнопок
    const container = document.createElement('div');
    container.className = 'save-buttons-container';
    container.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 15px;
        margin: 30px 0;
        padding: 20px;
        flex-wrap: wrap;
    `;
    
    const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
    const existingSave = savedMaterials.find(save => save.charKey === character.key);
    
    const translationsObj = translations[lang] || translations['ru'];
    
    const levelData = JSON.parse(localStorage.getItem('characterLevelData') || '{}');
    const charData = JSON.parse(localStorage.getItem('characterData') || '{}');
    
    // ОПРЕДЕЛЯЕМ КОНТЕКСТ ЗАГРУЗКИ
    const isFromProfile = levelData.isFromProfile === true || charData.isFromProfile === true;
    const isFromLoad = levelData.isFromLoad === true || charData.isFromLoad === true;
    const isFromSave = levelData.isFromSave === true || charData.isFromSave === true;
    
    console.log('Контекст загрузки:', {
        isFromProfile,
        isFromLoad,
        isFromSave,
        existingSave: existingSave ? 'Да' : 'Нет'
    });
    
    const currentCharacter = character;
    const currentLang = lang;
    
    // 1. Кнопка "Сохранить" - только когда НЕТ сохранения
    const saveBtn = document.createElement('button');
    saveBtn.id = 'save-materials-btn';
    saveBtn.className = 'save-btn primary';
    saveBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
        </svg>
        <span>${translationsObj.buttons?.save || 'Сохранить'}</span>
    `;
    
    saveBtn.addEventListener('click', () => {
        saveMaterialsToProfile(currentCharacter, currentLang);
    });
    
    // 2. Кнопка "Обновить" - только если загружено из сохранения
    const updateBtn = document.createElement('button');
    updateBtn.id = 'update-materials-btn';
    updateBtn.className = 'save-btn update';
    updateBtn.disabled = true;
    updateBtn.style.cursor = 'not-allowed';
    updateBtn.style.filter = 'grayscale(20%)';
    updateBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        <span>${translationsObj.buttons?.update || 'Обновить'}</span>
    `;
    
    updateBtn.addEventListener('click', (e) => {
        console.log('Клик по кнопке "Обновить"');
        
        if (updateBtn.disabled) {
            console.log('Кнопка "Обновить" неактивна');
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        
        console.log('Вызов updateExistingSave');
        updateExistingSave(currentCharacter, currentLang);
    });
    
    // 3. Кнопка "Перезаписать" - когда ЕСТЬ сохранение, но НЕ загружено из него
    const overwriteBtn = document.createElement('button');
    overwriteBtn.id = 'overwrite-materials-btn';
    overwriteBtn.className = 'save-btn overwrite';
    overwriteBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
        <span>${translationsObj.buttons?.overwrite || 'Перезаписать'}</span>
    `;
    
    overwriteBtn.addEventListener('click', () => {
        if (existingSave) {
            showOverwriteConfirm(currentCharacter, currentLang, existingSave);
        }
    });
    
    // ЛОГИКА ОТОБРАЖЕНИЯ КНОПОК:
    if (existingSave) {
        // ЕСТЬ сохранение
        if (isFromProfile || isFromLoad || isFromSave) {
            // ЗАГРУЖЕНО из сохранения -> показываем "Обновить"
            console.log('Показываем кнопку "Обновить" (загружено из сохранения)');
            container.appendChild(updateBtn);
            
            // Инициализируем менеджер кнопок
            setTimeout(() => {
                if (window.updateButtonManager) {
                    console.log('Инициализируем updateButtonManager...');
                    
                    updateBtn.disabled = true;
                    updateBtn.style.opacity = '0.5';
                    updateBtn.style.cursor = 'not-allowed';
                    
                    window.updateButtonManager.init(currentCharacter, currentLang, updateBtn);
                    
                    setTimeout(() => {
                        window.updateButtonManager.checkForChanges();
                    }, 300);
                }
            }, 200);
        } else {
            // НЕ загружено из сохранения -> показываем "Перезаписать"
            console.log('Показываем кнопку "Перезаписать" (есть сохранение, но не загружено)');
            container.appendChild(overwriteBtn);
        }
    } else {
        // НЕТ сохранения -> показываем "Сохранить"
        console.log('Показываем кнопку "Сохранить" (нет сохранения)');
        container.appendChild(saveBtn);
    }
    
    // Добавляем контейнер на страницу
    const allSection = document.querySelector('section.all');
    if (allSection) {
        allSection.after(container);
    } else {
        const content = document.querySelector('.character-detail-page');
        if (content) content.appendChild(container);
    }
}

// Функция для сброса флагов загрузки
function resetLoadFlags() {
    console.log('Сброс флагов загрузки...');
    
    const levelData = JSON.parse(localStorage.getItem('characterLevelData') || '{}');
    const charData = JSON.parse(localStorage.getItem('characterData') || '{}');
    
    // Сбрасываем только временные флаги, но оставляем isFromProfile для определения контекста
    delete levelData.loadedFromSave;
    delete charData.loadedFromSave;
    delete levelData.isNewSetup;
    delete charData.isNewSetup;
    
    // НЕ сбрасываем эти флаги - они нужны для определения контекста
    // levelData.isFromProfile остается
    // levelData.isFromLoad остается
    // levelData.isFromSave остается
    
    localStorage.setItem('characterLevelData', JSON.stringify(levelData));
    localStorage.setItem('characterData', JSON.stringify(charData));
    
    console.log('Флаги загрузки сброшены');
}

// Функция для принудительного обновления всех кнопок сохранения
function refreshSaveButtons(lang) {
    console.log('Обновление всех кнопок сохранения для языка:', lang);
    
    const translationsObj = translations[lang] || translations['ru'];
    
    // Обновляем кнопку "Сохранить"
    const saveBtn = document.getElementById('save-materials-btn');
    if (saveBtn) {
        const span = saveBtn.querySelector('span');
        if (span) {
            span.textContent = translationsObj.buttons?.save || 'Сохранить';
        }
    }
    
    // Обновляем кнопку "Обновить"
    const updateBtn = document.getElementById('update-materials-btn');
    if (updateBtn) {
        const span = updateBtn.querySelector('span');
        if (span) {
            span.textContent = translationsObj.buttons?.update || 'Обновить';
        }
        
        // Также обновляем через менеджер
        if (window.updateButtonManager && window.updateButtonManager.updateButton === updateBtn) {
            window.updateButtonManager.updateLanguage(lang);
        }
    }
    
    // Обновляем кнопку "Перезаписать"
    const overwriteBtn = document.getElementById('overwrite-materials-btn');
    if (overwriteBtn) {
        const span = overwriteBtn.querySelector('span');
        if (span) {
            span.textContent = translationsObj.buttons?.overwrite || 'Перезаписать';
        }
    }
    
    // Обновляем все кнопки с классом save-btn
    document.querySelectorAll('.save-btn span').forEach(span => {
        const btn = span.closest('button');
        if (btn.id === 'save-materials-btn') {
            span.textContent = translationsObj.buttons?.save || 'Сохранить';
        } else if (btn.id === 'update-materials-btn') {
            span.textContent = translationsObj.buttons?.update || 'Обновить';
        } else if (btn.id === 'overwrite-materials-btn') {
            span.textContent = translationsObj.buttons?.overwrite || 'Перезаписать';
        }
    });
}

// Функция для принудительной проверки изменений (можно вызывать в консоли для тестирования)
function forceCheckChanges() {
    if (window.updateButtonManager && window.updateButtonManager.checkForChanges) {
        console.log('Принудительная проверка изменений...');
        window.updateButtonManager.checkForChanges();
    } else {
        console.error('updateButtonManager не доступен');
    }
}

// Сделайте ее глобальной
window.forceCheckChanges = forceCheckChanges;

// Функция показа окна подтверждения перезаписи
function showOverwriteConfirm(character, lang, existingSave) {
    console.log('Показ окна подтверждения перезаписи для:', character.key);
    
    const modal = document.createElement('div');
    modal.className = 'overwrite-confirm-modal';
    
    if (window.modalManager) {
        window.modalManager.registerModal(modal);
    }
    
    const modalContent = document.createElement('div');
    modalContent.className = 'overwrite-content-modal';
    
    const saveDate = new Date(existingSave.lastModified || existingSave.date).toLocaleString(lang);
    const charName = existingSave.characterName || character[`${lang}_name`] || character.en_name;
    
    const translationsObj = translations[lang] || translations['ru'];
    
    // Функция для обновления текста при смене языка
    const updateModalContent = (currentLang) => {
        const currentTranslations = translations[currentLang] || translations['ru'];
        const currentCharName = existingSave.characterName || character[`${currentLang}_name`] || character.en_name;
        const currentSaveDate = new Date(existingSave.lastModified || existingSave.date).toLocaleString(currentLang);
        
        modalContent.innerHTML = `
            <div style="margin-bottom: 20px;">
                <div style="font-size: 48px; color: #FF9800; margin-bottom: 10px;">⚠️</div>
                <h3 style="color: #333; margin-bottom: 10px;">${currentTranslations.modals?.overwrite?.title || 'Перезаписать сохранение?'}</h3>
                <p style="color: #666; margin-bottom: 20px;">
                    ${(currentTranslations.modals?.overwrite?.description || 'Для')} <strong style="color: #333;">${currentCharName}</strong> 
                    ${(currentTranslations.modals?.overwrite?.alreadyExists || 'уже есть сохранение')} <strong style="color: #333;">${currentSaveDate}</strong>.
                </p>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin: 20px 0; text-align: left;">
                <p style="margin-bottom: 8px; color: #555;">
                    <strong>${currentTranslations.modals?.overwrite?.level || 'Уровень'}:</strong> ${existingSave.level || 1}
                </p>
                <p style="margin-bottom: 8px; color: #555;">
                    <strong>${currentTranslations.modals?.overwrite?.talents || 'Таланты'}:</strong> 
                    ${existingSave.attackLevel || 1}/${existingSave.skillLevel || 1}/${existingSave.explosionLevel || 1}
                </p>
                ${Object.keys(existingSave.userInputs || {}).length > 0 ? 
                    `<p style="color: #555;">
                        <strong>${currentTranslations.modals?.overwrite?.materialsCount || 'Сохранено материалов'}:</strong> 
                        ${Object.keys(existingSave.userInputs).length}
                    </p>` : ''}
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 10px; margin: 20px 0; color: #856404;">
                <strong>⚠️ ${currentTranslations.notification?.warning || 'Внимание'}:</strong> 
                ${currentTranslations.modals?.overwrite?.warningText || 'Старое сохранение будет безвозвратно удалено и заменено новым.'}
            </div>
            
            <div style="display: flex; gap: 15px; justify-content: center; margin-top: 25px;">
                <button id="option-cancel" class="action-button cancel" style="
                    padding: 12px 30px;
                    background: #6c757d;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    flex: 1;
                    transition: background 0.3s;
                ">
                    ${currentTranslations.common?.cancel || 'Отмена'}
                </button>
                <button id="option-overwrite" class="action-button confirm" style="
                    padding: 12px 30px;
                    background: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    flex: 1;
                    transition: background 0.3s;
                ">
                    ${currentTranslations.buttons?.overwrite || 'Перезаписать'}
                </button>
            </div>
        `;
        
        // Обработчики кнопок
        modalContent.querySelector('#option-cancel').addEventListener('click', () => {
            if (window.modalManager) {
                window.modalManager.unregisterModal(modal);
            }
            modal.remove();
        });
        
        modalContent.querySelector('#option-overwrite').addEventListener('click', () => {
            if (window.modalManager) {
                window.modalManager.unregisterModal(modal);
            }
            modal.remove();
            
            // Перезаписываем сохранение
            const userInputs = {};
            const inputElements = document.querySelectorAll('.all .materials-container input[type="number"]');
            
            inputElements.forEach(input => {
                const value = parseInt(input.value) || 0;
                const materialId = input.id.replace('all_', '').replace(/_/g, '.');
                userInputs[materialId] = value;
            });
            
            const updatedSave = {
                ...existingSave,
                characterName: character[`${currentLang}_name`] || character.en_name,
                characterAvatar: character.avatar,
                date: new Date().toLocaleString(currentLang),
                lastModified: Date.now(),
                level: parseInt(document.getElementById('lvl')?.textContent) || 1,
                attackLevel: parseInt(document.getElementById('lvl-attack')?.textContent) || 1,
                skillLevel: parseInt(document.getElementById('lvl-skill')?.textContent) || 1,
                explosionLevel: parseInt(document.getElementById('lvl-explosion')?.textContent) || 1,
                userInputs: userInputs,
                characterData: {
                    rangeVal: document.getElementById('range')?.value || 0,
                    fullCharacterData: character
                }
            };
            
            const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
            const existingSaveIndex = savedMaterials.findIndex(save => save.charKey === character.key);
            
            if (existingSaveIndex !== -1) {
                savedMaterials[existingSaveIndex] = updatedSave;
                localStorage.setItem('savedMaterials', JSON.stringify(savedMaterials));
                
                // Обновляем данные в localStorage
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
                
                // Синхронизируем с Telegram Cloud
                if (window.telegramStorage) {
                    setTimeout(async () => {
                        try {
                            await window.telegramStorage.syncAllUserData();
                            console.log('Синхронизировано после перезаписи');
                        } catch (error) {
                            console.error('Ошибка синхронизации:', error);
                        }
                    }, 100);
                }
                
                // Показываем уведомление
                showSaveNotification(currentTranslations.notifications?.overwriteSuccess || 'Сохранение успешно перезаписано!', 'success');
                
                // Обновляем кнопки на странице
                setTimeout(() => {
                    checkAndSetupSaveButton(character, currentLang);
                }, 300);
            }
        });
    };
    
    // Инициализируем контент
    updateModalContent(lang);
    
    // Добавляем функцию перевода в модальное окно
    modal.translate = function(newLang) {
        updateModalContent(newLang);
    };
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Закрытие при клике вне окна
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            if (window.modalManager) {
                window.modalManager.unregisterModal(modal);
            }
            modal.remove();
        }
    });
    
    // Закрытие по клавише Esc
    document.addEventListener('keydown', function closeOnEsc(e) {
        if (e.key === 'Escape') {
            if (window.modalManager) {
                window.modalManager.unregisterModal(modal);
            }
            modal.remove();
            document.removeEventListener('keydown', closeOnEsc);
        }
    });
}

// Функция для проверки и загрузки данных персонажа
function checkAndLoadCharacterData() {
    console.log('Проверка данных персонажа...');
    
    const savedChar = localStorage.getItem('selectedCharacter');
    const levelDataStr = localStorage.getItem('characterLevelData');
    const charDataStr = localStorage.getItem('characterData');
    
    console.log('selectedCharacter:', savedChar ? 'есть' : 'нет');
    console.log('characterLevelData:', levelDataStr ? 'есть' : 'нет');
    console.log('characterData:', charDataStr ? 'есть' : 'нет');
    
    let levelData = {};
    let charData = {};
    
    try {
        if (levelDataStr) levelData = JSON.parse(levelDataStr);
        if (charDataStr) charData = JSON.parse(charDataStr);
    } catch (error) {
        console.error('Ошибка парсинга данных:', error);
    }
    
    // ВАЖНО: Проверяем наличие данных материалов
    if (levelData.levelMaterials && Object.keys(levelData.levelMaterials).length > 0) {
        console.log('Найдены сохраненные материалы уровня');
        return levelData;
    }
    
    if (charData.levelMaterials && Object.keys(charData.levelMaterials).length > 0) {
        console.log('Найдены сохраненные материалы уровня в charData');
        return charData;
    }
    
    console.log('Материалы не найдены, возвращаем данные по умолчанию');
    return {
        rangeVal: 0,
        level: 1,
        attackLevel: 1,
        skillLevel: 1,
        explosionLevel: 1,
        levelMaterials: {},
        attackMaterials: {},
        skillMaterials: {},
        burstMaterials: {}
    };
}

// Функция для восстановления пользовательских вводов
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

// Функция для обновления страницы информации о персонаже при смене языка
function updateCharacterInfoPageLang(lang) {
    console.log('Обновление страницы информации для языка:', lang);
    
    const savedChar = localStorage.getItem('selectedCharacter');
    if (!savedChar) {
        console.error('Нет выбранного персонажа');
        return;
    }
    
    try {
        const { data } = JSON.parse(savedChar);
        
        // Обновляем имя персонажа
        const nameElement = document.getElementById('char-name');
        if (nameElement) {
            nameElement.textContent = data[`${lang}_name`] || data.en_name;
        }
        
        // Обновляем описание
        const descElement = document.getElementById('char-description');
        if (descElement) {
            const desc = data.description;
            if (typeof desc === 'object') {
                descElement.textContent = desc[lang] || desc.ru || desc.en || 'Описание отсутствует';
            } else if (desc) {
                descElement.textContent = desc;
            }
        }
        
        // Обновляем элемент
        const elementElement = document.getElementById('char-element');
        if (elementElement && data.element) {
            const translationsObj = translations[lang] || translations['ru'];
            elementElement.textContent = translationsObj.elements?.[data.element] || data.element;
        }
        
        // Обновляем оружие
        const weaponElement = document.getElementById('char-weapon');
        if (weaponElement && data.weapon) {
            const translationsObj = translations[lang] || translations['ru'];
            weaponElement.textContent = translationsObj.weapons?.[data.weapon] || data.weapon;
        }
        
        // Обновляем таланты
        updateTalentsLanguage(data, lang);
        
        // Обновляем созвездия
        updateConstellationsLanguage(data, lang);
        
        console.log('Страница информации обновлена для языка:', lang);
    } catch (error) {
        console.error('Ошибка обновления страницы информации:', error);
    }
}

// Функция для обновления талантов
function updateTalentsLanguage(characterData, lang) {
    console.log('Обновление талантов для языка:', lang);
    
    // Названия талантов
    const attackNameElement = document.getElementById('char-atack-name');
    if (attackNameElement && characterData.attack) {
        if (typeof characterData.attack === 'object') {
            attackNameElement.textContent = characterData.attack[lang] || 
                                         characterData.attack.ru || 
                                         characterData.attack.en || 
                                         characterData.attack;
        } else {
            attackNameElement.textContent = characterData.attack;
        }
    }
    
    const skillNameElement = document.getElementById('char-skill-name');
    if (skillNameElement && characterData.skill) {
        if (typeof characterData.skill === 'object') {
            skillNameElement.textContent = characterData.skill[lang] || 
                                        characterData.skill.ru || 
                                        characterData.skill.en || 
                                        characterData.skill;
        } else {
            skillNameElement.textContent = characterData.skill;
        }
    }
    
    const burstNameElement = document.getElementById('char-burst-name');
    if (burstNameElement && characterData.explosion) {
        if (typeof characterData.explosion === 'object') {
            burstNameElement.textContent = characterData.explosion[lang] || 
                                        characterData.explosion.ru || 
                                        characterData.explosion.en || 
                                        characterData.explosion;
        } else {
            burstNameElement.textContent = characterData.explosion;
        }
    }
    
    // Описания талантов
    const attackDescElement = document.getElementById('des-attack');
    if (attackDescElement && characterData.des_attack) {
        if (typeof characterData.des_attack === 'object') {
            attackDescElement.innerHTML = characterData.des_attack[lang] || 
                                       characterData.des_attack.ru || 
                                       characterData.des_attack.en || 
                                       characterData.des_attack;
        } else {
            attackDescElement.innerHTML = characterData.des_attack;
        }
    }
    
    const skillDescElement = document.getElementById('des-skill');
    if (skillDescElement && characterData.des_skill) {
        if (typeof characterData.des_skill === 'object') {
            skillDescElement.textContent = characterData.des_skill[lang] || 
                                        characterData.des_skill.ru || 
                                        characterData.des_skill.en || 
                                        characterData.des_skill;
        } else {
            skillDescElement.textContent = characterData.des_skill;
        }
    }
    
    const burstDescElement = document.getElementById('des-burst');
    if (burstDescElement && characterData.des_burst) {
        if (typeof characterData.des_burst === 'object') {
            burstDescElement.textContent = characterData.des_burst[lang] || 
                                        characterData.des_burst.ru || 
                                        characterData.des_burst.en || 
                                        characterData.des_burst;
        } else {
            burstDescElement.textContent = characterData.des_burst;
        }
    }
    
    // Alt тексты для иконок
    const s1Element = document.getElementById('char-s1');
    if (s1Element && s1Element.querySelector('img')) {
        const attackName = typeof characterData.attack === 'object' 
        ? (characterData.attack[lang] || characterData.attack.ru || characterData.attack.en)
        : characterData.attack;
        s1Element.querySelector('img').alt = attackName || 'Атака';
    }
    
    const s2Element = document.getElementById('char-s2');
    if (s2Element && s2Element.querySelector('img')) {
        const skillName = typeof characterData.skill === 'object' 
        ? (characterData.skill[lang] || characterData.skill.ru || characterData.skill.en)
        : characterData.skill;
        s2Element.querySelector('img').alt = skillName || 'Навык';
    }
    
    const s3Element = document.getElementById('char-s3');
    if (s3Element && s3Element.querySelector('img')) {
        const burstName = typeof characterData.explosion === 'object' 
        ? (characterData.explosion[lang] || characterData.explosion.ru || characterData.explosion.en)
        : characterData.explosion;
        s3Element.querySelector('img').alt = burstName || 'Взрыв';
    }
}

// Функция для обновления созвездий
function updateConstellationsLanguage(characterData, lang) {
    console.log('Обновление созвездий для языка:', lang);
    
    const container = document.getElementById('constellations-container');
    if (!container || !characterData.constellations) return;
    
    const constellations = characterData.constellations;
    
    Object.keys(constellations).forEach((constKey, index) => {
        const constellation = constellations[constKey];
        const constellationCard = container.querySelector(`.constellation-card:nth-child(${index + 1})`);
        
        if (constellationCard) {
            // Обновляем название
            const nameElement = constellationCard.querySelector('.constellation-name');
            if (nameElement && constellation.name) {
                if (typeof constellation.name === 'object') {
                    nameElement.textContent = `${index + 1}. ${constellation.name[lang] || constellation.name.ru || constellation.name.en || `Созвездие ${index + 1}`}`;
                } else {
                    nameElement.textContent = `${index + 1}. ${constellation.name}`;
                }
            }
            
            // Обновляем описание
            const descElement = constellationCard.querySelector('.constellation-description');
            if (descElement && constellation.description) {
                if (typeof constellation.description === 'object') {
                    descElement.textContent = constellation.description[lang] || 
                                           constellation.description.ru || 
                                           constellation.description.en || '';
                } else {
                    descElement.textContent = constellation.description;
                }
            }
        }
    });
}

// Функция для обновления страницы материалов персонажа при смене языка
function updateCharacterMaterialsPageLang(lang) {
    console.log('Обновление языка страницы материалов:', lang);
    
    // Обновляем заголовки через data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translatedText = getTranslation(key, lang);
        
        if (translatedText && translatedText !== key) {
            if (element.tagName === 'IMG') {
                element.alt = translatedText;
            } else {
                element.textContent = translatedText;
            }
        }
    });
    
    // Обновляем имя персонажа
    const nameElement = document.getElementById('char-name');
    if (nameElement) {
        const savedChar = localStorage.getItem('selectedCharacter');
        if (savedChar) {
            try {
                const { data } = JSON.parse(savedChar);
                nameElement.textContent = data[`${lang}_name`] || data.en_name;
            } catch (error) {
                console.error('Ошибка обновления имени:', error);
            }
        }
    }
    
    // Локализуем имена материалов
    if (typeof localizeMaterialNames === 'function') {
        setTimeout(() => {
            localizeMaterialNames(lang);
        }, 100);
    }
    
    // Обновляем кнопки сохранения
    if (typeof checkAndSetupSaveButton === 'function') {
        const savedChar = localStorage.getItem('selectedCharacter');
        if (savedChar) {
            try {
                const { data } = JSON.parse(savedChar);
                setTimeout(() => {
                    checkAndSetupSaveButton(data, lang);
                }, 200);
            } catch (error) {
                console.error('Ошибка обновления кнопок сохранения:', error);
            }
        }
    }
}

// Инициализация глобальных обработчиков событий
function initGlobalEventListeners() {
    console.log('Инициализация глобальных обработчиков событий');
    
    // Обработчик смены языка (наше кастомное событие)
    document.addEventListener('languageChange', (e) => {
        const newLang = e.detail.lang;
        console.log('Событие languageChange:', newLang);
        
        // Триггерим стандартное событие
        const event = new CustomEvent('languageChanged', { detail: { lang: newLang } });
        document.dispatchEvent(event);
    });
    
    // Обработчик стандартного события смены языка
    document.addEventListener('languageChanged', (e) => {
        const newLang = e.detail.lang;
        console.log('Событие languageChanged:', newLang);
        
        window.currentLang = newLang;
        
        // Определяем текущую страницу
        const currentPage = window.location.hash.slice(2) || 'home';
        
        console.log('Текущая страница при смене языка:', currentPage);
        
        // Обработка подстраниц персонажей
        if (currentPage && currentPage.startsWith('characters/')) {
            if (currentPage === 'characters/mat') {
                console.log('Динамическая локализация страницы материалов');
                updateCharacterMaterialsPageLang(newLang);
            } else if (currentPage === 'characters/info') {
                console.log('Динамическая локализация страницы информации');
                updateCharacterInfoPageLang(newLang);
            }
        }
        
        // Обновляем все динамические тексты
        setTimeout(() => {
            updateDynamicTexts(newLang);
        }, 100);
    });
}

// ОБНОВЛЕННАЯ версия функции setupGlobalFunctions
function setupGlobalFunctions() {
    // Эти функции будут доступны немедленно
    window.checkAndSetupSaveButton = checkAndSetupSaveButton;
    window.renderRealMaterials = renderRealMaterials;
    window.updateSaveButtonsLanguage = updateSaveButtonsLanguage;
    window.localizeAllMaterials = localizeAllMaterials;
    window.showErrorMessage = showErrorMessage;
    window.getMaterialInfo = getMaterialInfo;
    window.showOverwriteConfirm = showOverwriteConfirm;
    window.showSaveNotification = showSaveNotification;
    window.refreshSaveButtons = refreshSaveButtons;
    window.formatNumber = formatNumber;
    window.parseFormattedNumber = parseFormattedNumber;
    window.updateCharacterStats = updateCharacterStats;
    window.updateAttackStats = updateAttackStats;
    window.getLevelFromSliderValue = getLevelFromSliderValue;
    
    // НОВЫЕ ФУНКЦИИ ДЛЯ ЛОКАЛИЗАЦИИ
    window.updateCharacterMaterialsPageLang = updateCharacterMaterialsPageLang;
    window.updateCharacterInfoPageLang = updateCharacterInfoPageLang;
    window.updateTalentsLanguage = updateTalentsLanguage;
    window.updateConstellationsLanguage = updateConstellationsLanguage;

    // Функция для принудительной проверки изменений
    window.forceCheckChanges = forceCheckChanges;

    // Функции калькулятора
    window.loadCalculatorSaveById = loadCalculatorSaveById;
    window.initCalculatorModule = initCalculatorModule;
    
    // Функции профиля
    window.initProfileModule = initProfileModule;
    window.renderSavedMaterials = renderSavedMaterials;
   
    // Функция для принудительного обновления профиля
    window.forceRefreshProfile = function() {
        console.log('Принудительное обновление профиля...');
        if (typeof renderSavedMaterials === 'function') {
            renderSavedMaterials();
        }
    };
    
    console.log('Глобальные функции установлены');
}

// Инициализация приложения - ИСПРАВЛЕННАЯ ВЕРСИЯ
// web.js - исправленный initApp для Telegram

// Инициализация приложения - ИСПРАВЛЕННАЯ ВЕРСИЯ ДЛЯ TELEGRAM
async function initApp() {
  console.log('=== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ===');

  // Инициализация отладки Telegram
  setTimeout(() => {
    initTelegramDebug();
  }, 500);

  // УСИЛЕННАЯ ПРОВЕРКА TELEGRAM
    console.log('=== ПРОВЕРКА TELEGRAM МИНИ-ПРИЛОЖЕНИЯ ===');
    console.log('URL:', window.location.href);
    console.log('Origin:', window.location.origin);
    console.log('User-Agent:', navigator.userAgent);
    
    // Проверяем все возможные способы определения Telegram
    let isTelegramDetected = false;
    
    // 1. Проверяем стандартный способ
    if (typeof window.Telegram !== 'undefined') {
        console.log('✅ Telegram объект найден в window');
        if (Telegram.WebApp) {
            console.log('✅ Telegram.WebApp доступен');
            isTelegramDetected = true;
            
            // Инициализируем Telegram WebApp
            try {
                Telegram.WebApp.ready();
                Telegram.WebApp.expand();
                console.log('✅ Telegram.WebApp инициализирован');
                
                // Показываем информацию о пользователе
                const user = Telegram.WebApp.initDataUnsafe?.user;
                if (user) {
                    console.log('✅ Пользователь Telegram:', {
                        id: user.id,
                        username: user.username,
                        firstName: user.first_name
                    });
                }
            } catch (error) {
                console.error('❌ Ошибка инициализации Telegram:', error);
            }
        }
    }
    
    // 2. Проверяем параметры URL (Telegram передает данные так)
    const urlParams = new URLSearchParams(window.location.search);
    console.log('Параметры URL:', Object.fromEntries(urlParams));
    
    if (urlParams.has('tgWebAppData') || urlParams.has('tgWebAppVersion')) {
        console.log('✅ Telegram параметры найдены в URL');
        isTelegramDetected = true;
    }
    
    // 3. Проверяем hash (еще один способ передачи данных)
    if (window.location.hash) {
        console.log('Hash URL:', window.location.hash);
        if (window.location.hash.includes('tgWebAppData=')) {
            console.log('✅ Telegram параметры найдены в hash');
            isTelegramDetected = true;
        }
    }
    
    // 4. Проверяем window.parent (если в iframe)
    try {
        if (window.parent && window.parent.Telegram) {
            console.log('✅ Telegram найден в window.parent');
            isTelegramDetected = true;
        }
    } catch (e) {
        console.log('window.parent недоступен:', e.message);
    }
    
    console.log('Итог проверки Telegram:', isTelegramDetected ? '✅ Обнаружен' : '❌ Не обнаружен');
    
    // Если Telegram не обнаружен, проверяем локальное хранилище
    if (!isTelegramDetected) {
        const isManualTelegram = localStorage.getItem('forceTelegramMode') === 'true';
        if (isManualTelegram) {
            console.log('⚠️ Режим Telegram принудительно включен вручную');
            isTelegramDetected = true;
        }
    }
    
    // Сохраняем статус в глобальной переменной
    window.isTelegramMiniApp = isTelegramDetected;
  // Проверяем, в Telegram Mini App ли мы
  const isTelegram = typeof Telegram !== 'undefined' && Telegram.WebApp;
  
  if (isTelegram) {
    console.log('✅ Запуск в Telegram Mini App');
    try {
      // Инициализируем Telegram WebApp
      Telegram.WebApp.ready();
      Telegram.WebApp.expand();
      
      // Настраиваем тему
      const theme = Telegram.WebApp.colorScheme;
      document.documentElement.setAttribute('data-theme', theme);
      console.log('Тема установлена:', theme);
      
      // Показываем основную кнопку если нужно
      if (Telegram.WebApp.MainButton) {
        Telegram.WebApp.MainButton.hide();
      }
      
      // Устанавливаем BackButton поведение
      if (Telegram.WebApp.BackButton) {
        Telegram.WebApp.BackButton.onClick(() => {
          if (window.location.hash && window.location.hash !== '#/home') {
            window.history.back();
          } else {
            Telegram.WebApp.close();
          }
        });
      }
      
      // Проверяем Cloud Storage
      if (Telegram.WebApp.CloudStorage) {
        console.log('✅ Telegram Cloud Storage доступен');
      } else {
        console.log('⚠️ Telegram Cloud Storage не доступен');
      }
      
    } catch (error) {
      console.error('Ошибка инициализации Telegram WebApp:', error);
    }
  } else {
    console.log('🌐 Запуск в браузере');
  }
  
  // Загружаем синхронизированные данные из облака ПЕРЕД инициализацией
  if (isTelegram && window.telegramStorage) {
    console.log('📥 Загрузка синхронизированных данных из облака...');
    try {
      const cloudData = await window.telegramStorage.loadUserData();
      if (cloudData) {
        console.log('✅ Данные успешно загружены из облака');
      } else {
        console.log('⚠️ Данных в облаке нет или ошибка загрузки');
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки данных из облака:', error);
    }
  }
  
  // Устанавливаем глобальные функции
  setupGlobalFunctions();

  // Инициализируем глобальные обработчики событий
  initGlobalEventListeners();

  // Инициализируем менеджер сохранений
  if (typeof initSaveManager === 'function') {
    initSaveManager();
  }
  
  // Устанавливаем язык из localStorage или по умолчанию
  const savedLang = localStorage.getItem('lang');
  if (savedLang && (savedLang === 'ru' || savedLang === 'en')) {
    window.currentLang = savedLang;
  } else {
    window.currentLang = 'ru';
    localStorage.setItem('lang', 'ru');
  }
  
  console.log('Установлен язык:', window.currentLang);
  
  // Инициализируем глобальный обработчик локализации
  initGlobalLocaleHandler();
  
  // Немедленно обновляем кнопки языка
  setTimeout(() => {
    updateLanguageButtons(window.currentLang);
  }, 0);
  
  // Применяем переводы к навигации
  localizeNavigation(window.currentLang);
  
  // Настраиваем слушатели
  setupNavigationListeners();
  
  // ОБНОВЛЯЕМ АКТИВНУЮ НАВИГАЦИЮ ПЕРЕД ПОКАЗОМ СТРАНИЦЫ
  updateActiveNav();

  // ВАЖНО: Получаем хэш и определяем начальную страницу
  const hash = window.location.hash;
  console.log('Текущий хэш при инициализации:', hash);
  
  let initialPage = 'home'; // По умолчанию показываем home
  
  if (hash && hash.length > 2) {
    // Убираем #/ из хэша
    const pageFromHash = hash.slice(2);
    if (pageFromHash && pageLayouts[pageFromHash]) {
      initialPage = pageFromHash;
      console.log('Страница из хэша:', initialPage);
    } else {
      console.log('Страница из хэша не найдена:', pageFromHash);
    }
  } else {
    console.log('Хэш пустой или некорректный, используем страницу по умолчанию: home');
  }
  
  console.log('Начальная страница:', initialPage);
  
  // Показываем начальную страницу
  window.showPage(initialPage);
  
  // ЕЩЕ РАЗ ОБНОВЛЯЕМ НАВИГАЦИЮ ПОСЛЕ ПОКАЗА СТРАНИЦЫ
  setTimeout(() => {
    updateActiveNav();
    moveHighlight();
  }, 300);
  
  // Для Telegram: сохраняем флаг первого запуска
  if (isTelegram) {
    localStorage.setItem('telegramFirstLaunch', 'true');
  }
}

// Запуск при загрузке DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  // DOM уже загружен
  initApp();
}

// Экспортируем для модулей
export {
    renderRealMaterials,
    checkAndSetupSaveButton,
    updateSaveButtonsLanguage,
    localizeAllMaterials,
    showErrorMessage,
    getMaterialInfo,
    updateCharacterStats,
    updateAttackStats,
    getLevelFromSliderValue,
    updateCharacterMaterialsPageLang,
    updateCharacterInfoPageLang
};