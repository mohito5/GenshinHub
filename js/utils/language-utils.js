// language-utils.js - исправленная функция getTranslation
import { translations } from '../translations.js';

// Функция для получения перевода по ключу
export function getTranslation(key, lang = window.currentLang) {
    if (!key) return '';
    
    const keys = key.split('.');
    let value = translations[lang];
    
    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            // Пробуем найти в другом языке
            const fallbackLang = lang === 'ru' ? 'en' : 'ru';
            value = translations[fallbackLang];
            
            for (const k2 of keys) {
                if (value && typeof value === 'object' && k2 in value) {
                    value = value[k2];
                } else {
                    return key;
                }
            }
            break;
        }
    }
    
    // Если value - объект (например, для элементов или оружия), возвращаем ключ
    if (value && typeof value === 'object') {
        return key;
    }
    
    return value || key;
}

// Основная функция установки языка
export function setLanguage(lang) {
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
    
    // Обновляем все зарегистрированные модальные окна
    if (window.modalManager) {
        window.modalManager.translateAll(lang);
    }
    
    // Диспатчим событие смены языка
    const event = new CustomEvent('languageChange', { detail: { lang } });
    document.dispatchEvent(event);
}

// Функция обновления кнопок языка
export function updateLanguageButtons(lang) {
    console.log('Обновление кнопок языка:', lang);
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        const langCode = btn.getAttribute('data-lang');
        
        // Оставляем текст кнопки всегда на английском (или другом языке)
        if (langCode === 'ru') {
            btn.textContent = 'RU';
        } else if (langCode === 'en') {
            btn.textContent = 'EN';
        } else {
            btn.textContent = langCode.toUpperCase();
        }
        
        // Устанавливаем активный класс
        if (langCode === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Применяет переводы к HTML
export function applyTranslations(html, lang) {
    console.log('applyTranslations вызван с языком:', lang);
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const elements = tempDiv.querySelectorAll('[data-i18n]');
    console.log('Найдено элементов для перевода:', elements.length);
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        console.log('Обрабатываем ключ:', key);
        
        const translatedText = getTranslation(key, lang);
        console.log('Результат перевода:', translatedText);
        
        if (element.tagName === 'IMG') {
            element.alt = translatedText;
        } else {
            element.textContent = translatedText;
        }
    });

    return tempDiv.innerHTML;
}

// Локализация навигации
export function localizeNavigation(lang) {
    console.log('Локализация навигации:', lang);
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        
        // Пропускаем кнопки языка (они будут обрабатываться отдельно)
        if (element.classList.contains('lang-btn')) {
            return;
        }
        
        const translatedText = getTranslation(key, lang);
        
        if (element.tagName === 'IMG') {
            element.alt = translatedText;
        } else {
            element.textContent = translatedText;
        }
    });
}

// Обновленная функция retranslateDynamicContent
export function retranslateDynamicContent(lang) {
    console.log('retranslateDynamicContent вызван:', lang);
    
    // Обновляем все элементы с data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translatedText = getTranslation(key, lang);

        if (element.tagName === 'IMG') {
            element.alt = translatedText;
        } else {
            element.textContent = translatedText;
        }
    });
    
    // Обновляем кнопки сохранения
    updateSaveButtonText(lang);
    
    return true;
}

// Функция для обновления текста кнопки сохранения
export function updateSaveButtonText(lang) {
    const saveBtn = document.getElementById('save-materials-btn');
    const updateBtn = document.getElementById('update-materials-btn');
    const overwriteBtn = document.getElementById('overwrite-materials-btn');
    
    if (saveBtn) {
        const span = saveBtn.querySelector('span');
        if (span) {
            span.textContent = getTranslation('buttons.save', lang);
        }
    }
    
    if (updateBtn) {
        const span = updateBtn.querySelector('span');
        if (span) {
            span.textContent = getTranslation('buttons.update', lang);
        }
    }
    
    if (overwriteBtn) {
        const span = overwriteBtn.querySelector('span');
        if (span) {
            span.textContent = getTranslation('buttons.overwrite', lang);
        }
    }
}

// Триггер смены языка
export function triggerLanguageChange(lang) {
    console.log('Триггер смены языка:', lang);
    
    if (window.currentLang === lang) {
        console.log('Язык уже установлен:', lang);
        return;
    }
    
    if (window.setLanguage) {
        window.setLanguage(lang);
    } else {
        console.error('Функция setLanguage не найдена в глобальной области');
        const event = new CustomEvent('languageChange', { detail: { lang } });
        document.dispatchEvent(event);
    }
}