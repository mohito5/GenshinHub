// translation-utils.js - исправленная версия с использованием getTranslation
import { translations } from '../translations.js';
import { materialsInfo } from '../materialsData.js';
import { getTranslation } from './language-utils.js';
import { formatNumber } from './number-utils.js';

// Функция для локализации имен материалов
export function localizeMaterialNames(lang) {
    console.log('Локализация имен материалов:', lang);
    
    const materialItems = document.querySelectorAll('.material-item');
    
    console.log('Найдено элементов .material-item:', materialItems.length);
    
    materialItems.forEach(item => {
        const materialNameElement = item.querySelector('.material-name');
        const inputElement = item.querySelector('input[type="number"]');
        
        if (materialNameElement) {
            const materialKey = materialNameElement.getAttribute('data-key') || 
                               item.dataset.materialKey;
            if (materialKey) {
                // Пытаемся получить перевод из materialsInfo
                const translatedName = getMaterialName(materialKey, lang);
                if (translatedName && translatedName !== materialKey) {
                    materialNameElement.textContent = translatedName;
                    console.log('Переведен материал:', materialKey, '->', translatedName);
                }
            }
        }
        
        // Обновляем placeholder у input
        if (inputElement) {
            inputElement.placeholder = getTranslation('input.placeholder', lang);
        }
        
        // Обновляем текст "Осталось"
        const remainingSpan = item.querySelector('.material-remaining');
        if (remainingSpan) {
            const amountElement = item.querySelector('.material-amount');
            if (amountElement) {
                const amountText = amountElement.textContent;
                const amount = parseInt(amountText.replace(/[^\d]/g, '')) || 0;
                const have = parseInt(inputElement?.value) || 0;
                const remaining = Math.max(0, amount - have);
                
                const formattedRemaining = formatNumber(remaining, lang);
                remainingSpan.textContent = `${getTranslation('material.remaining', lang)}: ${formattedRemaining}`;
            }
        }
    });
}

// Функция для локализации информации о персонаже
export function localizeCharacterInfoPage(characterData, lang) {
    console.log('Локализация страницы информации персонажа:', characterData?.key, lang);
    
    // Обновляем имя персонажа
    const nameElement = document.getElementById('char-name');
    if (nameElement) {
        nameElement.textContent = characterData[`${lang}_name`] || characterData.en_name;
    }
    
    // Обновляем описание персонажа
    const descElement = document.getElementById('char-description');
    if (descElement) {
        if (typeof characterData.description === 'object') {
            descElement.textContent = characterData.description[lang] || 
                                   characterData.description.ru || 
                                   characterData.description.en || 
                                   'Описание отсутствует';
        } else {
            descElement.textContent = characterData.description || 'Описание отсутствует';
        }
    } 
    
    // Обновляем основную информацию
    const elementElement = document.getElementById('char-element');
    if (elementElement && characterData.element) {
        elementElement.textContent = getTranslation(`elements.${characterData.element}`, lang);
    }
    
    const weaponElement = document.getElementById('char-weapon');
    if (weaponElement && characterData.weapon) {
        weaponElement.textContent = getTranslation(`weapons.${characterData.weapon}`, lang);
    }
    
    const rarityElement = document.getElementById('char-rarity');
    if (rarityElement && characterData.rarity) {
        const stars = '★'.repeat(parseInt(characterData.rarity) || 5);
        rarityElement.textContent = stars;
    }
    
    // Локализуем таланты
    localizeCharacterTalents(characterData, lang);
}

// Функция для локализации талантов
export function localizeCharacterTalents(characterData, lang) {
    console.log('Локализация талантов для языка:', lang);
    
    // Названия талантов
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
    
    // Описания талантов
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

// Функция для извлечения ключа материала из элемента
function extractMaterialKeyFromElement(element) {
    const inputElement = element.querySelector('input[type="number"]');
    if (inputElement && inputElement.id) {
        return inputElement.id.replace('all_', '').replace(/_/g, '.');
    }
    return null;
}

// Функция для получения переведенного имени материала
function getMaterialName(materialKey, lang) {
    const parts = materialKey.split('.');
    
    if (parts.length === 1) {
        // Простой ключ
        const materialData = materialsInfo[materialKey];
        if (materialData && materialData.name) {
            if (typeof materialData.name === 'object') {
                return materialData.name[lang] || materialData.name.ru || materialKey;
            }
            return materialData.name || materialKey;
        }
    } else if (parts.length === 2) {
        // Вложенный ключ
        const [category, subKey] = parts;
        if (materialsInfo[category] && materialsInfo[category][subKey]) {
            const materialData = materialsInfo[category][subKey];
            if (materialData && materialData.name) {
                if (typeof materialData.name === 'object') {
                    return materialData.name[lang] || materialData.name.ru || materialKey;
                }
                return materialData.name || materialKey;
            }
        }
    }
    
    return materialKey;
}

// Функция для обновления страницы материалов персонажа (альтернативная версия)
export function updateCharacterMaterialsPageLang(lang) {
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
    setTimeout(() => {
        localizeMaterialNames(lang);
    }, 100);
}