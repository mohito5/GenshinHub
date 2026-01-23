// character-pages.js - исправленная версия для работы с массивами
import { charsData } from '../characterData.js';
import { translations } from '../translations.js';

// Функция для загрузки детальной страницы персонажа
function loadCharacterDetailPage(pageId) {
    console.log('Загрузка детальной страницы персонажа:', pageId);
    
    const savedChar = localStorage.getItem('selectedCharacter');
    if (!savedChar) {
        console.error('Нет выбранного персонажа');
        return;
    }
    
    try {
        const { data, lang } = JSON.parse(savedChar);
        
        // Определяем тип страницы
        const pageType = pageId.split('/')[1];
        
        // Заполняем общие данные
        fillCharacterCommonData(pageType, data, lang);
        
        // Заполняем специфичные данные для каждой страницы
        switch (pageType) {
            case 'mat':
                fillMaterialsData(data);
                break;
            case 'info':
                fillCharacterInfoData(data);
                initCharacterInfoPage(data, lang);
                break;
            case 'guide':
                fillGuideData(data);
                break;
        }
        
        console.log(`Страница ${pageType} загружена для персонажа:`, data[`${lang}_name`] || data.en_name);
    } catch (error) {
        console.error('Ошибка загрузки детальной страницы:', error);
    }
}

// Заполнение общих данных персонажа
function fillCharacterCommonData(pageType, character, lang) {
    const nameElement = document.getElementById(`${pageType}-name`);
    const iconElement = document.getElementById(`${pageType}-icon`);
    
    if (nameElement) {
        nameElement.textContent = character[`${lang}_name`] || character.en_name;
    }
    
    if (iconElement && character.avatar) {
        iconElement.innerHTML = `<img src="${character.avatar}" alt="${character[`${lang}_name`] || character.en_name}">`;
    }
}

// Заполнение данных для страницы материалов
function fillMaterialsData(character) {
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
}

// Заполнение данных для страницы информации
function fillCharacterInfoData(character) {
    // Обновляем основную информацию
    const descElement = document.getElementById('char-description');
    if (descElement) {
        descElement.textContent = character.description || 'Описание отсутствует';
    }
    
    // Обновляем характеристики элемента
    const elementElement = document.getElementById('char-element');
    if (elementElement && character.element) {
        elementElement.textContent = character.element;
    }
    
    // Обновляем оружие
    const weaponElement = document.getElementById('char-weapon');
    if (weaponElement && character.weapon) {
        weaponElement.textContent = character.weapon;
    }
    
    // Обновляем редкость
    const rarityElement = document.getElementById('char-rarity');
    if (rarityElement && character.rarity) {
        const stars = '★'.repeat(parseInt(character.rarity) || 5);
        rarityElement.textContent = stars;
    }
    
    // Изначально устанавливаем уровень 1
    const level = 1;
    updateCharacterStats(character, level);
}

// Инициализация страницы информации
function initCharacterInfoPage(characterData, lang) {
    console.log('Инициализация страницы информации:', characterData.key);
    
    // Инициализируем слайдеры
    initInfoPageSliders(characterData);
    
    // Заполняем таланты
    populateTalentsInfo(characterData, lang);
    
    // Заполняем созвездия
    populateConstellationsInfo(characterData, lang);
}

// Инициализация слайдеров на странице информации
function initInfoPageSliders(characterData) {
    // Слайдер уровня персонажа
    const rangeSlider = document.getElementById('range');
    const minusBtn = document.getElementById('minus');
    const plusBtn = document.getElementById('plus');
    const outSpan = document.getElementById('out');
    const lvlSpan = document.getElementById('lvl');
    
    if (rangeSlider && lvlSpan) {
        // Устанавливаем начальное значение
        rangeSlider.value = 0;
        outSpan.textContent = '0';
        lvlSpan.textContent = '1';
        
        // Обработчик изменения слайдера
        rangeSlider.addEventListener('input', () => {
            const value = parseInt(rangeSlider.value);
            outSpan.textContent = value;
            
            const level = getLevelFromSliderValue(value);
            lvlSpan.textContent = level;
            
            // Обновляем характеристики
            updateCharacterStats(characterData, level);
        });
        
        // Обработчики кнопок минус/плюс
        if (minusBtn) {
            minusBtn.addEventListener('click', () => {
                let value = parseInt(rangeSlider.value);
                value = Math.max(0, value - 10);
                rangeSlider.value = value;
                outSpan.textContent = value;
                
                const level = getLevelFromSliderValue(value);
                lvlSpan.textContent = level;
                updateCharacterStats(characterData, level);
            });
        }
        
        if (plusBtn) {
            plusBtn.addEventListener('click', () => {
                let value = parseInt(rangeSlider.value);
                value = Math.min(70, value + 10);
                rangeSlider.value = value;
                outSpan.textContent = value;
                
                const level = getLevelFromSliderValue(value);
                lvlSpan.textContent = level;
                updateCharacterStats(characterData, level);
            });
        }
    }
    
    // Слайдеры талантов
    initTalentSlidersInfo(characterData);
}

// Получение уровня из значения слайдера
function getLevelFromSliderValue(sliderValue) {
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
    
    return levelMap[sliderValue] || '1';
}

// Обновление характеристик персонажа (работает с массивами)
function updateCharacterStats(characterData, level) {
    console.log('Обновление характеристик для уровня:', level);
    
    // Определяем индекс массива на основе уровня
    const levelIndexMap = {
        '1': 0, '20': 1, '40': 2, '50': 3,
        '60': 4, '70': 5, '80': 6, '90': 7
    };
    
    const index = levelIndexMap[level] || 0;
    
    const hpElement = document.getElementById('hp_1');
    const atkElement = document.getElementById('char-atk');
    const defElement = document.getElementById('char-def');
    
    // Проверяем формат данных (массив или объект)
    if (hpElement && characterData.hp) {
        if (Array.isArray(characterData.hp)) {
            // Работа с массивом
            if (characterData.hp[index] !== undefined) {
                hpElement.textContent = characterData.hp[index];
                console.log('HP обновлено из массива:', characterData.hp[index]);
            } else {
                console.warn('HP: индекс массива не существует', index);
                hpElement.textContent = '???';
            }
        } else if (typeof characterData.hp === 'object') {
            // Работа с объектом (старый формат)
            const levelKey = 'lv' + level;
            if (characterData.hp[levelKey]) {
                hpElement.textContent = characterData.hp[levelKey];
                console.log('HP обновлено из объекта:', characterData.hp[levelKey]);
            } else {
                console.warn('HP: ключ объекта не существует', levelKey);
                hpElement.textContent = '???';
            }
        }
    } else {
        console.warn('HP данные отсутствуют для уровня', level);
        hpElement.textContent = '???';
    }
    
    // Аналогично для ATK
    if (atkElement && characterData.atk) {
        if (Array.isArray(characterData.atk)) {
            if (characterData.atk[index] !== undefined) {
                atkElement.textContent = characterData.atk[index];
                console.log('ATK обновлено из массива:', characterData.atk[index]);
            } else {
                atkElement.textContent = '???';
            }
        } else if (typeof characterData.atk === 'object') {
            const levelKey = 'lv' + level;
            if (characterData.atk[levelKey]) {
                atkElement.textContent = characterData.atk[levelKey];
            } else {
                atkElement.textContent = '???';
            }
        }
    } else {
        atkElement.textContent = '???';
    }
    
    // Аналогично для DEF
    if (defElement && characterData.def) {
        if (Array.isArray(characterData.def)) {
            if (characterData.def[index] !== undefined) {
                defElement.textContent = characterData.def[index];
                console.log('DEF обновлено из массива:', characterData.def[index]);
            } else {
                defElement.textContent = '???';
            }
        } else if (typeof characterData.def === 'object') {
            const levelKey = 'lv' + level;
            if (characterData.def[levelKey]) {
                defElement.textContent = characterData.def[levelKey];
            } else {
                defElement.textContent = '???';
            }
        }
    } else {
        defElement.textContent = '???';
    }
}

// Инициализация слайдеров талантов
function initTalentSlidersInfo(characterData) {
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
            
            // Обновляем статистику атаки
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
    const burstLevelSpan = document.querySelector('#burst-level');
    const burstMinusBtn = document.querySelector('.talent-card:last-child .arrow.left');
    const burstPlusBtn = document.querySelector('.talent-card:last-child .arrow.right');
    
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

// Обновление статистики атаки
function updateAttackStats(characterData, talentLevel) {
    console.log('Обновление статистики атаки для уровня:', talentLevel);
    
    const attackStatsContainer = document.getElementById('attack-stats-container');
    if (!attackStatsContainer || !characterData.stat_attack) {
        console.warn('Контейнер для статистики атаки не найден или нет данных');
        return;
    }
    
    // Очищаем контейнер
    attackStatsContainer.innerHTML = '';
    
    // Создаем статистику для каждого типа атаки
    if (characterData.stat_attack && typeof characterData.stat_attack === 'object') {
        Object.keys(characterData.stat_attack).forEach(key => {
            const attack = characterData.stat_attack[key];
            const statRow = document.createElement('div');
            statRow.className = 'stat-row';
            
            // Создаем иконку с названием атаки
            const statIcon = document.createElement('div');
            statIcon.className = 'stat-icon';
            const iconText = document.createElement('p');
            iconText.textContent = attack.label || key;
            statIcon.appendChild(iconText);
            
            // Создаем значение атаки
            const statValue = document.createElement('p');
            
            // Проверяем формат данных (массив или объект)
            if (Array.isArray(attack)) {
                // Если это массив
                if (attack[talentLevel - 1] !== undefined) {
                    statValue.textContent = attack[talentLevel - 1];
                } else {
                    statValue.textContent = '???';
                }
            } else if (attack.levels && typeof attack.levels === 'object') {
                // Если это объект с уровнями
                if (attack.levels[talentLevel]) {
                    statValue.textContent = attack.levels[talentLevel];
                } else if (attack.levels[1]) {
                    statValue.textContent = attack.levels[1]; // Значение по умолчанию
                } else {
                    statValue.textContent = '???';
                }
            } else if (typeof attack === 'string' || typeof attack === 'number') {
                // Если это просто значение
                statValue.textContent = attack;
            } else {
                statValue.textContent = '???';
            }
            
            // Добавляем элементы в строку
            statRow.appendChild(statIcon);
            statRow.appendChild(statValue);
            
            // Добавляем строку в контейнер
            attackStatsContainer.appendChild(statRow);
        });
    }
}

// Заполнение информации о талантах
function populateTalentsInfo(characterData, lang) {
    console.log('Заполнение информации о талантах для языка:', lang);
    
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
    
    // Заполняем описания
    const attackDescElement = document.getElementById('des-attack');
    if (attackDescElement && characterData.des_attack) {
        attackDescElement.innerHTML = characterData.des_attack;
    }
    
    const skillDescElement = document.getElementById('des-skill');
    if (skillDescElement && characterData.des_skill) {
        skillDescElement.textContent = characterData.des_skill;
    }
    
    const burstDescElement = document.getElementById('des-burst');
    if (burstDescElement && characterData.des_burst) {
        burstDescElement.textContent = characterData.des_burst;
    }
    
    // Заполняем иконки
    const s1Element = document.getElementById('char-s1');
    if (s1Element) {
        if (characterData.s1) {
            s1Element.innerHTML = `<img src="${characterData.s1}" alt="${characterData.attack || 'Атака'}">`;
        } else {
            s1Element.textContent = '⚔️';
        }
    }
    
    const s2Element = document.getElementById('char-s2');
    if (s2Element) {
        if (characterData.s2) {
            s2Element.innerHTML = `<img src="${characterData.s2}" alt="${characterData.skill || 'Навык'}">`;
        } else {
            s2Element.textContent = '🌀';
        }
    }
    
    const s3Element = document.getElementById('char-s3');
    if (s3Element) {
        if (characterData.s3) {
            s3Element.innerHTML = `<img src="${characterData.s3}" alt="${characterData.explosion || 'Взрыв'}">`;
        } else {
            s3Element.textContent = '💥';
        }
    }
}

// Заполнение созвездий
function populateConstellationsInfo(characterData, lang) {
    const container = document.getElementById('constellations-container');
    if (!container) {
        console.warn('Контейнер для созвездий не найден');
        return;
    }
    
    if (!characterData.constellations) {
        container.innerHTML = '<p>Информация о созвездиях отсутствует</p>';
        return;
    }
    
    container.innerHTML = '';
    
    const constellations = characterData.constellations;
    
    Object.keys(constellations).forEach((constKey, index) => {
        const constellation = constellations[constKey];
        const constellationCard = document.createElement('div');
        constellationCard.className = 'constellation-card';
        
        const displayName = constellation.name?.[lang] || 
                           constellation.name?.ru || 
                           constellation.name?.en || 
                           `Созвездие ${index + 1}`;
        
        const displayDescription = constellation.description?.[lang] || 
                                  constellation.description?.ru || 
                                  constellation.description?.en || 
                                  '';
        
        const constellationHTML = `
            <div class="constellation-icon">
                ${constellation.icon ? 
                    `<img src="${constellation.icon}" alt="C${index + 1}">` : 
                    `<div class="constellation-placeholder">C${index + 1}</div>`}
            </div>
            <div class="constellation-content">
                <h4 class="constellation-name">${index + 1}. ${displayName}</h4>
                <p class="constellation-description">${displayDescription}</p>
            </div>
        `;
        
        constellationCard.innerHTML = constellationHTML;
        container.appendChild(constellationCard);
    });
}

// Заполнение данных для страницы гайда
function fillGuideData(character) {
    const lang = window.currentLang || 'ru';
    
    const guideNameElement = document.getElementById('guide-name');
    if (guideNameElement) {
        guideNameElement.textContent = character[`${lang}_name`] || character.en_name;
    }
    
    const guideIconElement = document.getElementById('guide-icon');
    if (guideIconElement && character.avatar) {
        guideIconElement.innerHTML = `<img src="${character.avatar}" alt="${character[`${lang}_name`] || character.en_name}">`;
    }
}

// Экспортируем вспомогательные функции
// В конце character-pages.js добавьте
export {
    loadCharacterDetailPage,
    updateCharacterStats,
    updateAttackStats,
    getLevelFromSliderValue
};