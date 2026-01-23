// home-module.js - с динамической локализацией
import { ServerTimer } from '../serverTimer.js';
import { charsData } from '../characterData.js';
import { renderMiniCalendar } from '../utils/calendar-utils.js';
import { translations } from '../translations.js';
import { getTranslation } from '../utils/language-utils.js';

let serverTimer = null;

// Инициализация таймера сервера
function initServerTimer() {
    destroyServerTimer();
    
    const currentLang = window.currentLang || 'ru';
    
    serverTimer = new ServerTimer({
        containerId: 'server-timer-container',
        switchId: 'show-server-time',
        translations: translations,
        currentLang: currentLang
    });
    
    serverTimer.init();
    
    // Добавляем глобальный слушатель смены языка
    document.addEventListener('languageChanged', handleLanguageChangeForTimer);
}

// Обработчик смены языка для таймера
function handleLanguageChangeForTimer(e) {
    const newLang = e.detail.lang;
    console.log('Home модуль: обновление языка таймера на', newLang);
    
    if (serverTimer && typeof serverTimer.updateLanguage === 'function') {
        serverTimer.updateLanguage(newLang);
    }
}

// Уничтожение таймера
function destroyServerTimer() {
    if (serverTimer) {
        serverTimer.destroy();
        serverTimer = null;
    }
    
    // Удаляем слушатель события
    document.removeEventListener('languageChanged', handleLanguageChangeForTimer);
}

// Проверка дней рождения с локализацией
function checkBirthday() {
    const today = new Date();
    const todayStr = `${today.getMonth() + 1}-${today.getDate()}`;
    const announcement = document.getElementById('birthday-announcement');
    const image = document.getElementById('birthday-image');
    const calendar = document.getElementById('mini-calendar');

    if (!calendar) return;

    const currentLang = window.currentLang || 'ru';
    
    let foundBirthday = false;

    Object.keys(charsData).forEach(key => {
        const char = charsData[key];
        if (char.date === todayStr) {
            const name = char[`${currentLang}_name`] || char.en_name;
            const announcementText = getTranslation('birthdays.announcementFormat', currentLang)
                .replace('{name}', name);
            
            if (announcement) announcement.textContent = announcementText;
            if (image) {
                image.src = char.avatar;
                image.alt = getTranslation('birthdays.imageAlt', currentLang).replace('{name}', name);
            }
            foundBirthday = true;
        }
    });

    if (!foundBirthday) {
        if (announcement) {
            announcement.textContent = getTranslation('birthdays.noBirthdayToday', currentLang);
        }
        if (image) {
            const svg = `data:image/svg+xml,${encodeURIComponent('<svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="200" fill="#f8f9fa"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="#666" text-anchor="middle" dy=".3em">Сегодня нет дней рождения</text></svg>')}`;
            image.src = svg;
            image.alt = getTranslation('birthdays.noBirthdayToday', currentLang);
        }
    }

    renderMiniCalendar(calendar, today, currentLang);
}

// Обновление языка для всей домашней страницы
function updateHomePageLanguage(lang) {
    console.log('Обновление языка домашней страницы:', lang);
    
    // Обновляем таймер
    if (serverTimer) {
        serverTimer.updateLanguage(lang);
    }
    
    // Обновляем дни рождения
    checkBirthday();
    
    // Обновляем другие элементы на странице с data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getTranslation(key, lang);
        
        if (element.tagName === 'IMG') {
            element.alt = translation;
        } else {
            element.textContent = translation;
        }
    });
}

// Инициализация модуля Home
export function initHomeModule(pageId) {
    const currentLang = window.currentLang || 'ru';
    
    // Обновляем язык при инициализации
    updateHomePageLanguage(currentLang);
    
    if (pageId === 'home' || pageId.startsWith('home/')) {
        if (serverTimer) destroyServerTimer();
        setTimeout(() => initServerTimer(), 100);
    } else {
        destroyServerTimer();
    }
}