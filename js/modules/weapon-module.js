// weapon-module.js - Функции для оружия
import { renderWeaponCards, createWeaponFilterButton } from '../list-weapon.js';
import { translations } from '../translations.js';

// Инициализация модуля оружия
export function initWeaponModule(pageId) {
    console.log('Инициализация модуля оружия для:', pageId);
    
    if (pageId === 'weapon') {
        console.log('Главная страница оружия');
        
        // Не рендерим карточки здесь, это будет сделано в initPageContent
        // Просто проверяем фильтры и обновляем кнопку
        const hasFilters = window.weaponFilters && 
            (window.weaponFilters.weaponType || window.weaponFilters.rarity || window.weaponFilters.stats);
        
        if (hasFilters) {
            console.log('Активные фильтры оружия:', window.weaponFilters);
        }
        
        // Обновляем кнопку фильтра через 200мс
        setTimeout(() => {
            if (typeof createWeaponFilterButton === 'function') {
                createWeaponFilterButton();
            }
        }, 200);
    }
}

// Функция для обновления страницы оружия при смене языка
export function updateWeaponPage(lang) {
    console.log('updateWeaponPage вызвана с языком:', lang);
    
    const title = document.querySelector('.page.weapon h1');
    if (title) {
        title.textContent = translations[lang]?.pages?.weapon?.title || 'Оружие';
    }
    
    // Обновляем карточки оружия
    setTimeout(() => {
        if (typeof renderWeaponCards === 'function') {
            console.log('Вызов renderWeaponCards из updateWeaponPage');
            renderWeaponCards(lang, window.weaponFilters);
        }
    }, 100);
}

// Создание кнопки фильтра на подстраницах оружия
export function createWeaponSubpageFilterButton() {
    console.log('Создание кнопки фильтра для подстраницы оружия');
    
    const navLeftArea = document.querySelector('.nav-left-area');
    if (!navLeftArea) {
        console.error('nav-left-area не найден');
        return;
    }
    
    // Удаляем существующую кнопку фильтра
    const existingFilterBtn = navLeftArea.querySelector('.filter-button');
    if (existingFilterBtn) {
        existingFilterBtn.remove();
    }
    
    const translationsObj = translations[window.currentLang] || translations['ru'];
    
    // Создаем кнопку фильтра
    const filterBtn = document.createElement('button');
    filterBtn.className = 'filter-button';
    filterBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
        </svg>
    `;
    
    navLeftArea.appendChild(filterBtn);
}