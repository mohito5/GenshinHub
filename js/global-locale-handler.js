// global-locale-handler.js - исправленный глобальный обработчик локализации
import { translations } from './translations.js';

// Глобальный обработчик смены языка
export function initGlobalLocaleHandler() {
    console.log('Инициализация глобального обработчика локализации');
    
    // Основной обработчик события languageChanged
    document.addEventListener('languageChanged', (e) => {
        const newLang = e.detail.lang;
        console.log('Глобальный обработчик: смена языка на', newLang);
        
        window.currentLang = newLang;
        
        // Обновляем кнопки языка
        updateLanguageButtons(newLang);
        
        // Обновляем модальные окна
        if (window.modalManager) {
            window.modalManager.translateAll(newLang);
        }
        
        // Обновляем карточки персонажей
        if (window.updateCharacterCardsLanguage) {
            window.updateCharacterCardsLanguage(newLang);
        }
        
        // Обновляем кнопку фильтра
        if (window.updateFilterButton) {
            window.updateFilterButton(newLang);
        }
        
        // Обновляем менеджер кнопок
        if (window.updateButtonManager && window.updateButtonManager.updateLanguage) {
            setTimeout(() => {
                window.updateButtonManager.updateLanguage(newLang);
            }, 50);
        }
    });
}

// Обновление кнопок языка
function updateLanguageButtons(lang) {
    console.log('Обновление кнопок языка:', lang);
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        const langCode = btn.getAttribute('data-lang');
        
        // Фиксированный текст для кнопок языка
        let buttonText = '';
        switch(langCode) {
            case 'ru':
                buttonText = 'RU';
                break;
            case 'en':
                buttonText = 'EN';
                break;
            default:
                buttonText = langCode.toUpperCase();
        }
        
        btn.textContent = buttonText;
        
        // Устанавливаем активный класс
        if (langCode === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Обновление карточек персонажей (для использования извне)
window.updateCharacterCardsLanguage = function(lang) {
    console.log('Обновление карточек персонажей на языке:', lang);
    
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
};

// Обновление кнопки фильтра
window.updateFilterButton = function(lang) {
    console.log('Обновление кнопки фильтра на языке:', lang);
    
    const filterBtn = document.querySelector('.filter-button');
    if (filterBtn) {
        const translationsObj = translations[lang] || translations['ru'];
        const span = filterBtn.querySelector('span:not(.filter-clear)');
        if (span) {
            span.textContent = translationsObj['filter.title'] || 'Фильтр';
        }
    }
};