// utils/material-localization.js
import { materialsInfo } from '../materialsData.js';
import { translations } from '../translations.js';

// Функция для форматирования чисел (1000 -> 1к, 1000000 -> 1млн)
export function formatNumber(number, lang = 'ru') {
    const num = parseInt(number);
    if (isNaN(num)) return number;
    
    if (num >= 1000000) {
        const formatted = (num / 1000000).toFixed(1).replace('.0', '');
        return formatted + (lang === 'ru' ? 'млн' : 'M');
    } else if (num >= 1000) {
        const formatted = (num / 1000).toFixed(1).replace('.0', '');
        return formatted + (lang === 'ru' ? 'к' : 'K');
    }
    return num.toString();
}

// Функция для получения информации о материале с локализацией
export function getLocalizedMaterialInfo(materialKey, character = null, lang = 'ru') {
    let materialInfo = null;
    let materialName = materialKey;
    let materialIcon = 'assets/unknown.png';
    
    const parts = materialKey.split('.');
    if (parts.length === 1) {
        // Простой ключ
        if (materialsInfo[materialKey]) {
            materialInfo = materialsInfo[materialKey];
            if (typeof materialInfo === 'object' && materialInfo.name) {
                materialName = materialInfo.name[lang] || materialInfo.name.ru || materialKey;
                materialIcon = materialInfo.icon || 'assets/unknown.png';
            }
        }
    } else if (parts.length === 2) {
        // Вложенный ключ
        const [category, subKey] = parts;
        if (materialsInfo[category] && materialsInfo[category][subKey]) {
            materialInfo = materialsInfo[category][subKey];
            if (typeof materialInfo === 'object' && materialInfo.name) {
                materialName = materialInfo.name[lang] || materialInfo.name.ru || materialKey;
                materialIcon = materialInfo.icon || 'assets/unknown.png';
            }
        }
    }
    
    return {
        name: materialName,
        icon: materialIcon
    };
}

// Функция для локализации всех секций материалов
export function localizeAllMaterialSections(lang) {
    console.log('Локализация всех секций материалов для языка:', lang);
    
    const sections = [
        { selector: 'section.level .materials-container', type: 'level' },
        { selector: 'section.mat-attack .materials-container', type: 'attack' },
        { selector: 'section.mat-skill .materials-container', type: 'skill' },
        { selector: 'section.mat-explosion .materials-container', type: 'explosion' },
        { selector: 'section.all .materials-container', type: 'all' }
    ];
    
    const savedChar = localStorage.getItem('selectedCharacter');
    let character = null;
    if (savedChar) {
        try {
            const { data } = JSON.parse(savedChar);
            character = data;
        } catch (error) {
            console.error('Ошибка загрузки персонажа для локализации:', error);
        }
    }
    
    sections.forEach(({ selector }) => {
        const container = document.querySelector(selector);
        if (!container) return;
        
        const materialItems = container.querySelectorAll('.material-item');
        materialItems.forEach(item => {
            const materialKey = item.dataset.materialKey || 
                               item.querySelector('.material-name')?.getAttribute('data-key') ||
                               item.querySelector('.material-icon')?.alt;
            
            if (materialKey) {
                const materialInfo = getLocalizedMaterialInfo(materialKey, character, lang);
                const nameElement = item.querySelector('.material-name');
                const iconElement = item.querySelector('.material-icon');
                
                if (nameElement) {
                    nameElement.textContent = materialInfo.name;
                }
                
                if (iconElement && materialInfo.icon !== 'assets/unknown.png') {
                    iconElement.src = materialInfo.icon;
                    iconElement.alt = materialInfo.name;
                }
                
                // Обновляем количество с форматированием
                const amountElement = item.querySelector('.material-amount');
                if (amountElement && amountElement.textContent) {
                    const amount = parseInt(amountElement.textContent.replace(/[^\d]/g, ''));
                    if (!isNaN(amount)) {
                        amountElement.textContent = formatNumber(amount, lang);
                    }
                }
                
                // Обновляем текст "Осталось" с сохранением языка
                const remainingElement = item.querySelector('.material-remaining');
                if (remainingElement) {
                    const input = item.querySelector('input[type="number"]');
                    if (input) {
                        const have = parseInt(input.value) || 0;
                        const amount = parseInt(input.dataset.amount) || 
                                      parseInt(amountElement?.textContent?.replace(/[^\d]/g, '')) || 0;
                        const remaining = Math.max(0, amount - have);
                        
                        const translationsObj = translations[lang] || translations['ru'];
                        remainingElement.textContent = 
                            `${translationsObj.material?.remaining || 'Осталось'}: ${formatNumber(remaining, lang)}`;
                    }
                }
            }
        });
    });
}

// Функция для создания элемента материала с правильной локализацией
export function createLocalizedMaterialElement(materialKey, amount, sectionType, character, lang) {
    const div = document.createElement('div');
    div.className = 'material-item';
    div.dataset.materialKey = materialKey;
    
    const materialInfo = getLocalizedMaterialInfo(materialKey, character, lang);
    const translationsObj = translations[lang] || translations['ru'];
    const formattedAmount = formatNumber(amount, lang);
    
    div.innerHTML = `
        <img src="${materialInfo.icon || 'assets/unknown.png'}" 
             alt="${materialInfo.name}" 
             class="material-icon"
             data-key="${materialKey}">
        <div class="material-info">
            <span class="material-name" data-key="${materialKey}">${materialInfo.name}</span>
            <span class="material-amount">${formattedAmount}</span>
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
                        const currentLang = remainingSpan.getAttribute('data-lang') || window.currentLang || 'ru';
                        const currentTranslations = translations[currentLang] || translations['ru'];
                        remainingSpan.textContent = 
                            `${currentTranslations.material?.remaining || 'Осталось'}: ${formatNumber(remaining, currentLang)}`;
                    }
                });
            }
        }, 10);
    }
    
    return div;
}