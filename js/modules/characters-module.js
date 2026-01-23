// characters-module.js - исправленная версия (без дублирования)
import { renderCharacterCards, createCharacterFilterButton } from '../list-char.js';
import { translations } from '../translations.js';
import { 
    localizeCharacterInfoPage, 
    localizeMaterialNames 
} from '../utils/translation-utils.js';
import { materialCategories, materialsInfo } from '../materialsData.js';
import { getTranslation } from '../utils/language-utils.js';
import { 
    updateCharacterStats, 
    updateAttackStats, 
    getLevelFromSliderValue 
} from './character-pages.js';
import { getLocalizedCharacterString } from '../utils/character-localization.js';

// Инициализация модуля персонажей
export function initCharactersModule(pageId) {
    console.log('Инициализация модуля персонажей для:', pageId);
    
    if (pageId === 'characters') {
        console.log('Главная страница персонажей');
        
        // Проверяем фильтры
        const hasFilters = window.characterFilters && 
            (window.characterFilters.element || window.characterFilters.weapon || window.characterFilters.rarity);
        
        if (hasFilters) {
            console.log('Применяем фильтры:', window.characterFilters);
            setTimeout(() => {
                if (typeof window.renderCharacterCards === 'function') {
                    window.renderCharacterCards(window.currentLang, window.characterFilters);
                }
            }, 100);
        } else {
            setTimeout(() => {
                if (typeof window.renderCharacterCards === 'function') {
                    window.renderCharacterCards(window.currentLang);
                }
            }, 100);
        }
    } else if (pageId === 'characters/mat') {
        // Инициализация страницы материалов персонажа
        initCharacterMaterialsPage();
        // Дополнительная инициализация
        setTimeout(() => {
            initMaterialsPage();
        }, 500);
    } else if (pageId === 'characters/info') {
        // Инициализация страницы информации о персонаже
        initCharacterInfoPage();
    } else if (pageId === 'characters/guide') {
        // Инициализация страницы гайда
        initCharacterGuidePage();
    }
}

// Инициализация страницы материалов персонажа
function initCharacterMaterialsPage() {
    console.log('Инициализация страницы материалов персонажа');
    
    // Загружаем сохраненного персонажа
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
            nameElement.textContent = data[`${window.currentLang}_name`] || data.en_name;
        }
        
        // Обновляем иконку персонажа
        const iconElement = document.getElementById('char-icon');
        if (iconElement && data.avatar) {
            iconElement.innerHTML = `<img src="${data.avatar}" alt="${data[`${window.currentLang}_name`] || data.en_name}">`;
        }
        
        // Локализуем заголовки страницы
        const translationsObj = translations[window.currentLang] || translations['ru'];
        const pageTitle = document.querySelector('.character-detail-page h1');
        if (pageTitle) {
            pageTitle.textContent = translationsObj['materialsPage.title'] || 'Материалы для развития';
        }
        
        // Загружаем данные уровня
        const levelData = JSON.parse(localStorage.getItem('characterLevelData') || '{}');
        const charData = JSON.parse(localStorage.getItem('characterData') || '{}');
        
        // Подготавливаем данные для рендеринга материалов
        const currentData = {
            level: levelData.level || 1,
            attackLevel: levelData.attackLevel || 1,
            skillLevel: levelData.skillLevel || 1,
            explosionLevel: levelData.explosionLevel || 1,
            rangeVal: levelData.rangeVal || 0,
            inputs: charData.userInputs || {}
        };
        
        // Рендерим материалы
        setTimeout(() => {
            if (typeof renderRealMaterials === 'function') {
                renderRealMaterials(currentData, data);
            } else {
                console.error('Функция renderRealMaterials не найдена');
            }
        }, 500);
        
        // Настраиваем кнопки сохранения
        setTimeout(() => {
            if (typeof checkAndSetupSaveButton === 'function') {
                checkAndSetupSaveButton(data, window.currentLang);
            } else {
                console.error('Функция checkAndSetupSaveButton не найдена');
            }
        }, 1000);
        
        // Добавляем контейнер для кнопок если его нет
        setTimeout(() => {
            addSaveButtonsContainer();
        }, 300);
        
        console.log('Персонаж загружен:', data[`${window.currentLang}_name`] || data.en_name);
    } catch (error) {
        console.error('Ошибка загрузки персонажа:', error);
    }
}

// Добавим функцию для создания контейнера кнопок
function addSaveButtonsContainer() {
    // Проверяем, есть ли уже контейнер
    let container = document.querySelector('.save-buttons-container');
    
    if (!container) {
        // Создаем контейнер
        container = document.createElement('div');
        container.className = 'save-buttons-container';
        container.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 15px;
            margin: 30px 0;
            padding: 20px;
            flex-wrap: wrap;
        `;
        
        // Добавляем контейнер в конец страницы
        const content = document.querySelector('.character-detail-page #character-content');
        if (content) {
            content.appendChild(container);
        } else {
            // Если нет content, добавляем после всех секций
            const allSection = document.querySelector('section.all');
            if (allSection) {
                allSection.after(container);
            }
        }
    }
}

// Также нужно добавить функцию для рендеринга материалов
// В characters-module.js, замените функцию renderMaterialsForCharacter:
function renderMaterialsForCharacter(characterData) {
    console.log('renderMaterialsForCharacter вызвана для:', characterData.key);
    
    if (!characterData || !materialCategories) {
        console.error('Нет данных для рендеринга материалов');
        showErrorMessage('Данные о материалах не загружены');
        return;
    }
    
    // Получаем текущие данные
    const levelData = JSON.parse(localStorage.getItem('characterLevelData') || '{}');
    const currentData = {
        level: levelData.level || 1,
        attackLevel: levelData.attackLevel || 1,
        skillLevel: levelData.skillLevel || 1,
        explosionLevel: levelData.explosionLevel || 1,
        rangeVal: levelData.rangeVal || 0
    };
    
    console.log('Данные для рендеринга материалов:', currentData);
    
    // Вызываем renderRealMaterials если она доступна глобально
    if (window.renderRealMaterials) {
        console.log('Вызываем window.renderRealMaterials');
        window.renderRealMaterials(currentData, characterData);
    } else {
        console.error('Функция renderRealMaterials не доступна');
        showErrorMessage('Функция рендеринга материалов недоступна');
    }
}

// Добавим функцию инициализации материалов
// Исправленная функция initMaterialsPage
export function initMaterialsPage() {
    console.log('initMaterialsPage вызвана');
    
    const savedChar = localStorage.getItem('selectedCharacter');
    if (!savedChar) {
        console.error('Нет сохраненного персонажа');
        return;
    }
    
    try {
        const { data } = JSON.parse(savedChar);
        console.log('Данные персонажа загружены:', data.key);
        
        // Рендерим материалы
        setTimeout(() => {
            renderMaterialsForCharacter(data);
        }, 300);
        
        // Инициализируем кнопки сохранения
        setTimeout(() => {
            if (window.checkAndSetupSaveButton) {
                window.checkAndSetupSaveButton(data, window.currentLang || 'ru');
            } else {
                console.error('Функция checkAndSetupSaveButton не доступна');
            }
        }, 800);
        
    } catch (error) {
        console.error('Ошибка инициализации страницы материалов:', error);
    }
}

// Функция инициализации кнопок сохранения
function initSaveButtons(characterData, lang) {
    console.log('Инициализация кнопок сохранения для:', characterData.key);
    
    // Создаем контейнер для кнопок
    const container = document.createElement('div');
    container.className = 'save-buttons-main-container';
    container.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 20px;
        margin: 40px 0;
        padding: 30px;
        background: rgba(0,0,0,0.03);
        border-radius: 12px;
        flex-wrap: wrap;
    `;
    
    // Проверяем есть ли сохранение для этого персонажа
    const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
    const existingSave = savedMaterials.find(save => save.charKey === characterData.key);
    
    const translationsObj = translations[lang] || translations['ru'];
    
    if (existingSave) {
        // Кнопка "Обновить"
        const updateBtn = document.createElement('button');
        updateBtn.className = 'save-btn update';
        updateBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span>${translationsObj['buttons.update'] || 'Обновить'}</span>
        `;
        updateBtn.onclick = () => updateExistingSave(characterData, lang);
        
        // Кнопка "Перезаписать"
        const overwriteBtn = document.createElement('button');
        overwriteBtn.className = 'save-btn overwrite';
        overwriteBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            <span>${translationsObj['buttons.overwrite'] || 'Перезаписать'}</span>
        `;
        overwriteBtn.onclick = () => showOverwriteConfirm(characterData, lang, existingSave);
        
        container.appendChild(updateBtn);
        container.appendChild(overwriteBtn);
    } else {
        // Кнопка "Сохранить"
        const saveBtn = document.createElement('button');
        saveBtn.className = 'save-btn primary';
        saveBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
            </svg>
            <span>${translationsObj['buttons.save'] || 'Сохранить'}</span>
        `;
        saveBtn.onclick = () => saveMaterialsToProfile(characterData, lang);
        
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

// Инициализация страницы информации о персонаже
// characters-module.js - добавьте вызов populateTalentsInfo
function initCharacterInfoPage() {
    console.log('Инициализация страницы информации о персонаже');
    
    const savedChar = localStorage.getItem('selectedCharacter');
    if (!savedChar) return;
    
    try {
        const { data } = JSON.parse(savedChar);
        
        // Заполняем базовые данные
        fillCharacterInfoData(data);
        
        // Локализуем информацию о персонаже
        localizeCharacterInfoPage(data, window.currentLang);
        
        // ЗАПОЛНЯЕМ ИКОНКИ ТАЛАНТОВ - ДОБАВЬТЕ ЭТО
        populateTalentsInfo(data, window.currentLang);
        
        // Инициализируем функционал страницы
        setTimeout(() => {
            initCharacterInfoFunctionality(data);
        }, 100);
        
        console.log('Информация о персонаже загружена:', data[`${window.currentLang}_name`] || data.en_name);
    } catch (error) {
        console.error('Ошибка загрузки информации о персонаже:', error);
    }
}

// Заполнение данных информации о персонаже
// characters-module.js - обновленная функция fillCharacterInfoData
// characters-module.js - исправленная функция fillCharacterInfoData
// characters-module.js - исправленная функция fillCharacterInfoData
function fillCharacterInfoData(characterData) {
    console.log('Заполнение данных информации о персонаже:', characterData.key);
    
    const lang = window.currentLang || 'ru';
    
    // Обновляем имя персонажа
    const nameElement = document.getElementById('char-name');
    if (nameElement) {
        if (typeof characterData.name === 'object') {
            nameElement.textContent = characterData.name[lang] || 
                                     characterData.name.ru || 
                                     characterData.name.en || 
                                     characterData.en_name;
        } else {
            nameElement.textContent = characterData[`${lang}_name`] || characterData.en_name;
        }
    }
    
    // ОБНОВЛЯЕМ ИКОНКУ ПЕРСОНАЖА (исправленная версия)
    const iconElement = document.getElementById('char-icon');
    if (iconElement) {
        // Очищаем элемент
        iconElement.innerHTML = '';
        
        if (characterData.avatar) {
            const img = document.createElement('img');
            
            // Проверяем и корректируем путь к изображению
            let avatarPath = characterData.avatar;
            
            // Если путь относительный и не начинается с точки, добавляем ./
            if (!avatarPath.startsWith('./') && !avatarPath.startsWith('/') && 
                !avatarPath.startsWith('http') && !avatarPath.startsWith('assets/')) {
                avatarPath = './' + avatarPath;
            }
            
            // Убираем дублирующиеся точки
            avatarPath = avatarPath.replace(/\.\//g, './').replace(/\.\.\//g, '../');
            
            img.src = avatarPath;
            const charName = characterData[`${lang}_name`] || characterData.en_name;
            img.alt = charName;
            img.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 10px;
                display: block;
            `;
            
            // Обработчик ошибок с повторной попыткой
            img.onerror = function() {
                console.warn('Ошибка загрузки аватара:', avatarPath, 'пробуем альтернативный путь');
                
                // Пробуем альтернативные пути
                const altPaths = [
                    characterData.avatar_icon,
                    `assets/avatar/${characterData.key}.png`,
                    `assets/avatar/${characterData.key.toLowerCase()}.png`,
                    `assets/avatar-icon/${characterData.key}.png`,
                    `assets/characters/${characterData.key}.png`
                ];
                
                let found = false;
                for (const altPath of altPaths) {
                    if (altPath) {
                        this.src = altPath;
                        console.log('Пробуем альтернативный путь:', altPath);
                        found = true;
                        break;
                    }
                }
                
                if (!found) {
                    console.error('Не удалось загрузить иконку персонажа');
                    iconElement.innerHTML = '<div style="color: white; text-align: center; font-size: 24px; line-height: 100px;">👤</div>';
                }
            };
            
            img.onload = function() {
                console.log('Аватар успешно загружен:', this.src);
            };
            
            iconElement.appendChild(img);
            console.log('Установлен аватар:', avatarPath);
        } else {
            iconElement.innerHTML = '<div style="color: white; text-align: center; font-size: 24px; line-height: 100px;">👤</div>';
        }
    }
    
    // Обновляем основную информацию
    const descElement = document.getElementById('char-description');
    if (descElement) {
        if (characterData.description) {
            if (typeof characterData.description === 'object') {
                descElement.textContent = characterData.description[lang] || 
                                        characterData.description.ru || 
                                        characterData.description.en || 
                                        'Описание отсутствует';
            } else {
                descElement.textContent = characterData.description;
            }
        } else {
            descElement.textContent = 'Описание отсутствует';
        }
    }
    
    // Обновляем характеристики элемента
    const elementElement = document.getElementById('char-element');
    if (elementElement && characterData.element) {
        elementElement.textContent = translations[lang]?.elements?.[characterData.element] || characterData.element;
    }
    
    // Обновляем оружие
    const weaponElement = document.getElementById('char-weapon');
    if (weaponElement && characterData.weapon) {
        weaponElement.textContent = translations[lang]?.weapons?.[characterData.weapon] || characterData.weapon;
    }
    
    // Обновляем редкость
    const rarityElement = document.getElementById('char-rarity');
    if (rarityElement && characterData.rarity) {
        const stars = '★'.repeat(parseInt(characterData.rarity) || 5);
        rarityElement.textContent = stars;
    }
}
// Инициализация функционала страницы информации
function initCharacterInfoFunctionality(characterData) {
    // Инициализируем слайдеры уровня
     // Инициализируем слайдеры уровня
    initLevelSliders(characterData); 
    
    // Заполняем созвездия
    populateConstellations(characterData);
    
    // Сохраняем данные персонажа для глобального доступа
    window.currentCharacterInfo = characterData;
     // ОБНОВЛЯЕМ характеристики сразу
    setTimeout(() => {
        updateCharacterStats(characterData, 1); // Начальный уровень
        updateAttackStats(characterData, 1); // Начальный уровень атаки
    }, 100);
}

// Инициализация слайдеров уровня
// Исправленная функция initLevelSliders в characters-module.js
function initLevelSliders(characterData) {
    console.log('Инициализация слайдеров уровня для:', characterData.key);
    
    const rangeSlider = document.getElementById('range');
    const minusBtn = document.getElementById('minus');
    const plusBtn = document.getElementById('plus');
    const outSpan = document.getElementById('out');
    const lvlSpan = document.getElementById('lvl');
    
    if (rangeSlider && outSpan && lvlSpan) {
        // Устанавливаем начальное значение
        const initialValue = 0;
        rangeSlider.value = initialValue;
        outSpan.textContent = initialValue;
        
        // Обновляем уровень персонажа И характеристики
        const level = getLevelFromSliderValue(initialValue);
        lvlSpan.textContent = level;
        updateCharacterStats(characterData, level);
        
        // Обработчик изменения слайдера
        rangeSlider.addEventListener('input', () => {
            const value = parseInt(rangeSlider.value);
            outSpan.textContent = value;
            const newLevel = getLevelFromSliderValue(value);
            lvlSpan.textContent = newLevel;
            updateCharacterStats(characterData, newLevel);
        });
        
        // Обработчики кнопок минус/плюс
        if (minusBtn) {
            minusBtn.addEventListener('click', () => {
                let value = parseInt(rangeSlider.value);
                value = Math.max(0, value - 10);
                rangeSlider.value = value;
                outSpan.textContent = value;
                const newLevel = getLevelFromSliderValue(value);
                lvlSpan.textContent = newLevel;
                updateCharacterStats(characterData, newLevel);
            });
        }
        
        if (plusBtn) {
            plusBtn.addEventListener('click', () => {
                let value = parseInt(rangeSlider.value);
                value = Math.min(60, value + 10);
                rangeSlider.value = value;
                outSpan.textContent = value;
                const newLevel = getLevelFromSliderValue(value);
                lvlSpan.textContent = newLevel;
                updateCharacterStats(characterData, newLevel);
            });
        }
    }
    
    // Слайдеры талантов
    initTalentSlidersInfo(characterData);
}

// Обновление уровня персонажа
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
        70: '90'
    };
    
    lvlSpan.textContent = levelMap[rangeValue] || '1';
}

// Инициализация слайдеров талантов
// Исправленная функция initTalentSlidersInfo в characters-module.js
function initTalentSlidersInfo(characterData) {
    console.log('Инициализация слайдеров талантов для:', characterData.key);
    
    // Атака
    const attackSlider = document.querySelector('#level-attack');
    const attackMinusBtn = document.querySelector('#attack-minus');
    const attackPlusBtn = document.querySelector('#attack-plus');
    const attackLevelSpan = document.querySelector('#attack-level');
    
    if (attackSlider && attackLevelSpan) {
        attackSlider.value = 1;
        attackLevelSpan.textContent = '1';
        
        attackSlider.addEventListener('input', () => {
            const level = parseInt(attackSlider.value);
            attackLevelSpan.textContent = level;
            updateAttackStats(characterData, level);
        });
        
        if (attackMinusBtn) {
            attackMinusBtn.addEventListener('click', () => {
                let value = parseInt(attackSlider.value);
                value = Math.max(1, value - 1);
                attackSlider.value = value;
                attackLevelSpan.textContent = value;
                updateAttackStats(characterData, value);
            });
        }
        
        if (attackPlusBtn) {
            attackPlusBtn.addEventListener('click', () => {
                let value = parseInt(attackSlider.value);
                value = Math.min(10, value + 1);
                attackSlider.value = value;
                attackLevelSpan.textContent = value;
                updateAttackStats(characterData, value);
            });
        }
        
        // Инициализируем статистику атаки
        updateAttackStats(characterData, 1);
    }
    
    // Навык
    const skillSlider = document.querySelector('#level-skill');
    const skillMinusBtn = document.querySelector('#skill-minus');
    const skillPlusBtn = document.querySelector('#skill-plus');
    const skillLevelSpan = document.querySelector('#skill-level');
    
    if (skillSlider && skillLevelSpan) {
        skillSlider.value = 1;
        skillLevelSpan.textContent = '1';
        
        skillSlider.addEventListener('input', () => {
            skillLevelSpan.textContent = skillSlider.value;
        });
        
        if (skillMinusBtn) {
            skillMinusBtn.addEventListener('click', () => {
                let value = parseInt(skillSlider.value);
                value = Math.max(1, value - 1);
                skillSlider.value = value;
                skillLevelSpan.textContent = value;
            });
        }
        
        if (skillPlusBtn) {
            skillPlusBtn.addEventListener('click', () => {
                let value = parseInt(skillSlider.value);
                value = Math.min(10, value + 1);
                skillSlider.value = value;
                skillLevelSpan.textContent = value;
            });
        }
    }
    
    // Взрыв стихии
    const burstSlider = document.querySelector('#level-burst'); // Убедитесь, что есть этот элемент
    const burstMinusBtn = document.querySelector('.talent-card:last-child .arrow.left');
    const burstPlusBtn = document.querySelector('.talent-card:last-child .arrow.right');
    const burstLevelSpan = document.querySelector('#burst-level');
    
    if (burstLevelSpan) {
        burstLevelSpan.textContent = '1';
        
        if (burstMinusBtn) {
            burstMinusBtn.addEventListener('click', () => {
                let value = parseInt(burstLevelSpan.textContent);
                value = Math.max(1, value - 1);
                burstLevelSpan.textContent = value;
            });
        }
        
        if (burstPlusBtn) {
            burstPlusBtn.addEventListener('click', () => {
                let value = parseInt(burstLevelSpan.textContent);
                value = Math.min(10, value + 1);
                burstLevelSpan.textContent = value;
            });
        }
    }
}
// characters-module.js - исправленная функция populateTalentsInfo
// characters-module.js - исправленная функция populateTalentsInfo
function populateTalentsInfo(characterData, lang) {
  console.log('Заполнение информации о талантах для языка:', lang);
  
  // Заполняем названия талантов
  const attackNameElement = document.getElementById('char-atack-name');
  if (attackNameElement) {
    if (typeof characterData.attack === 'object') {
      attackNameElement.textContent = characterData.attack[lang] || 
                                     characterData.attack.ru || 
                                     characterData.attack.en || 
                                     characterData.attack;
    } else {
      attackNameElement.textContent = characterData.attack || '???';
    }
  }
  
  const skillNameElement = document.getElementById('char-skill-name');
  if (skillNameElement) {
    if (typeof characterData.skill === 'object') {
      skillNameElement.textContent = characterData.skill[lang] || 
                                    characterData.skill.ru || 
                                    characterData.skill.en || 
                                    characterData.skill;
    } else {
      skillNameElement.textContent = characterData.skill || '???';
    }
  }
  
  const burstNameElement = document.getElementById('char-burst-name');
  if (burstNameElement) {
    if (typeof characterData.explosion === 'object') {
      burstNameElement.textContent = characterData.explosion[lang] || 
                                    characterData.explosion.ru || 
                                    characterData.explosion.en || 
                                    characterData.explosion;
    } else {
      burstNameElement.textContent = characterData.explosion || '???';
    }
  }
  
  // Заполняем описания талантов
  const attackDescElement = document.getElementById('des-attack');
  if (attackDescElement) {
    if (typeof characterData.des_attack === 'object') {
      attackDescElement.innerHTML = characterData.des_attack[lang] || 
                                   characterData.des_attack.ru || 
                                   characterData.des_attack.en || 
                                   characterData.des_attack;
    } else {
      attackDescElement.innerHTML = characterData.des_attack || '???';
    }
  }
  
  const skillDescElement = document.getElementById('des-skill');
  if (skillDescElement) {
    if (typeof characterData.des_skill === 'object') {
      skillDescElement.textContent = characterData.des_skill[lang] || 
                                    characterData.des_skill.ru || 
                                    characterData.des_skill.en || 
                                    characterData.des_skill;
    } else {
      skillDescElement.textContent = characterData.des_skill || '???';
    }
  }
  
  const burstDescElement = document.getElementById('des-burst');
  if (burstDescElement) {
    if (typeof characterData.des_burst === 'object') {
      burstDescElement.textContent = characterData.des_burst[lang] || 
                                    characterData.des_burst.ru || 
                                    characterData.des_burst.en || 
                                    characterData.des_burst;
    } else {
      burstDescElement.textContent = characterData.des_burst || '???';
    }
  }
  
  // Обновляем alt тексты для иконок
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
// Заполнение статистики атак


// Заполнение созвездий
// characters-module.js - исправленная функция populateConstellations
function populateConstellations(characterData) {
    const container = document.getElementById('constellations-container');
    if (!container || !characterData.constellations) return;
    
    container.innerHTML = '';
    
    const constellations = characterData.constellations;
    const lang = window.currentLang || 'ru';
    
    Object.keys(constellations).forEach((constKey, index) => {
        const constellation = constellations[constKey];
        const constellationCard = document.createElement('div');
        constellationCard.className = 'constellation-card';
        
        // Получаем локализованное название
        let constellationName = `Созвездие ${index + 1}`;
        if (constellation.name) {
            if (typeof constellation.name === 'object') {
                constellationName = constellation.name[lang] || 
                                   constellation.name.ru || 
                                   constellation.name.en || 
                                   constellationName;
            } else {
                constellationName = constellation.name;
            }
        }
        
        // Получаем локализованное описание
        let constellationDescription = '';
        if (constellation.description) {
            if (typeof constellation.description === 'object') {
                constellationDescription = constellation.description[lang] || 
                                         constellation.description.ru || 
                                         constellation.description.en || '';
            } else {
                constellationDescription = constellation.description;
            }
        }
        
        const constellationHTML = `
            <div class="constellation-icon">
                ${constellation.icon ? `<img src="${constellation.icon}" alt="C${index + 1}" loading="lazy">` : `<div class="constellation-placeholder">C${index + 1}</div>`}
            </div>
            <div class="constellation-content">
                <h4 class="constellation-name">${index + 1}. ${constellationName}</h4>
                <p class="constellation-description">${constellationDescription}</p>
            </div>
        `;
        
        constellationCard.innerHTML = constellationHTML;
        container.appendChild(constellationCard);
    });
}

// Инициализация страницы гайда
function initCharacterGuidePage() {
    console.log('Инициализация страницы гайда персонажа');
    
    const savedChar = localStorage.getItem('selectedCharacter');
    if (!savedChar) return;
    
    try {
        const { data } = JSON.parse(savedChar);
        
        // Обновляем имя персонажа в гайде
        const nameElement = document.getElementById('guide-name');
        if (nameElement) {
            nameElement.textContent = data[`${window.currentLang}_name`] || data.en_name;
        }
        
        // Обновляем иконку
        const iconElement = document.getElementById('guide-icon');
        if (iconElement && data.avatar) {
            iconElement.innerHTML = `<img src="${data.avatar}" alt="${data[`${window.currentLang}_name`] || data.en_name}">`;
        }
        
        // Локализуем заголовки
        const translationsObj = translations[window.currentLang] || translations['ru'];
        const pageTitle = document.querySelector('.character-guide-page h1');
        if (pageTitle) {
            pageTitle.textContent = translationsObj['character.guide'] || 'Гайд по персонажу';
        }
        
        console.log('Гайд персонажа загружен:', data[`${window.currentLang}_name`] || data.en_name);
    } catch (error) {
        console.error('Ошибка загрузки гайда персонажа:', error);
    }
}