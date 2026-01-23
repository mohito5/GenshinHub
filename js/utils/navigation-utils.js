// navigation-utils.js - функции для навигации
import { translations } from '../translations.js';

// Функция для добавления кнопки "Назад" на подстраницах
// navigation-utils.js - окончательная версия addBackButtonForSubpages
export function addBackButtonForSubpages(pageId) {
    const navTopBar = document.querySelector('.nav-top-bar');
    if (!navTopBar) return;
    
    console.log('Обработка кнопок для страницы:', pageId);
    
    // Удаляем существующую кнопку "Назад"
    const existingBackBtn = document.querySelector('.back-button');
    if (existingBackBtn) existingBackBtn.remove();
    
    // Удаляем кнопку фильтра если мы на подстранице
    if (pageId.startsWith('characters/') || pageId.startsWith('weapon/') || pageId.startsWith('date/')) {
        // Удаляем кнопку фильтра через менеджер
        if (window.filterButtonManager && typeof window.filterButtonManager.removeFilterButton === 'function') {
            window.filterButtonManager.removeFilterButton();
        }
    }
    
    // Добавляем кнопку "Назад" для подстраниц
    if ((pageId.startsWith('characters/') && pageId !== 'characters') ||
        (pageId.startsWith('weapon/') && pageId !== 'weapon') ||
        (pageId.startsWith('date/') && pageId !== 'date')) {
        
        console.log('Добавляем кнопку "Назад" для:', pageId);
        createBackButton(pageId);
    }
}
// Добавьте в setupLanguageSwitcher или создайте отдельный слушатель
document.addEventListener('languageChange', (e) => {
    const newLang = e.detail.lang;
    console.log('Получено событие languageChange:', newLang);
    
    // Обновляем текст кнопки фильтра
    if (window.filterButtonManager && typeof window.filterButtonManager.updateFilterButtonText === 'function') {
        window.filterButtonManager.updateFilterButtonText(newLang);
    }
    
    // Прямой вызов setLanguage
    if (window.setLanguage) {
        window.setLanguage(newLang);
    }
});
// Создание кнопки "Назад"
function createBackButton(pageId) {
    const navTopBar = document.querySelector('.nav-top-bar');
    const lang = window.currentLang || 'ru';
    const buttons = translations[lang]?.buttons || translations['ru'].buttons;
    
    const backBtn = document.createElement('button');
    backBtn.className = 'back-button';
    
    let backText = buttons.backToCharacters || 'Назад к персонажам';
    let backToPage = 'characters';
    
    if (pageId.startsWith('weapon/')) {
        backText = buttons.backToWeapons || 'Назад к оружию';
        backToPage = 'weapon';
    } else if (pageId.startsWith('date/')) {
        backText = buttons.backToDate || 'Назад к базе знаний';
        backToPage = 'date';
    }
    
    backBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span>${backText}</span>
    `;
    
    // Стилизация
    backBtn.style.cssText = `
        background: linear-gradient(135deg, var(--light) 0%, #6c757d 100%);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        z-index: 100;
    `;
    
    backBtn.addEventListener('mouseenter', () => {
        backBtn.style.background = 'linear-gradient(135deg, #495057, #343a40)';
        backBtn.style.transform = 'scale(1.05)';
    });
    
    backBtn.addEventListener('mouseleave', () => {
        backBtn.style.background = 'linear-gradient(135deg, var(--light), #6c757d)';
        backBtn.style.transform = 'scale(1)';
    });
    
    backBtn.addEventListener('click', () => {
        history.pushState({}, '', `#/${backToPage}`);
        if (typeof window.showPage === 'function') {
            window.showPage(backToPage);
        }
    });
    
    // Добавляем кнопку в навигацию
    const navLeftArea = navTopBar.querySelector('.nav-left-area');
    if (navLeftArea) {
        navLeftArea.insertBefore(backBtn, navLeftArea.firstChild);
    } else {
        const leftArea = document.createElement('div');
        leftArea.className = 'nav-left-area';
        leftArea.style.cssText = 'display: flex; align-items: center; gap: 10px;';
        leftArea.appendChild(backBtn);
        
        const langSwitcher = navTopBar.querySelector('.language-switcher');
        if (langSwitcher) {
            navTopBar.insertBefore(leftArea, langSwitcher);
        } else {
            navTopBar.appendChild(leftArea);
        }
    }
}

// Функция для добавления кнопки фильтра
export function addFilterButtonForPages(pageId) {
    const navTopBar = document.querySelector('.nav-top-bar');
    if (!navTopBar) return;
    
    // Определяем, на каких страницах нужен фильтр
    const pagesWithFilter = ['characters', 'weapon', 'date'];
    
    if (!pagesWithFilter.includes(pageId)) {
        console.log('Для страницы', pageId, 'фильтр не нужен');
        return;
    }
    
    console.log('Добавляем кнопку фильтра для:', pageId);
    
    const lang = window.currentLang || 'ru';
    const translationsObj = translations[lang] || translations['ru'];
    
    const filterBtn = document.createElement('button');
    filterBtn.className = 'filter-button';
    filterBtn.setAttribute('data-page', pageId);
    filterBtn.setAttribute('aria-label', translationsObj['filter.title'] || 'Фильтр');
    
    filterBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
        </svg>
    `;
    
    // Обработчик клика
    filterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Клик по фильтру для страницы:', pageId);
        
        // Открываем соответствующее модальное окно фильтра
        switch(pageId) {
            case 'characters':
                if (typeof window.createCharacterFilterModal === 'function') {
                    window.createCharacterFilterModal();
                }
                break;
            case 'weapon':
                if (typeof window.createWeaponFilterModal === 'function') {
                    window.createWeaponFilterModal();
                }
                break;
            case 'date':
                if (typeof window.createDateFilterModal === 'function') {
                    window.createDateFilterModal();
                }
                break;
        }
    });
    
    // Добавляем кнопку в навигацию
    const navLeftArea = navTopBar.querySelector('.nav-left-area');
    if (navLeftArea) {
        navLeftArea.appendChild(filterBtn);
    } else {
        const leftArea = document.createElement('div');
        leftArea.className = 'nav-left-area';
        leftArea.style.cssText = 'display: flex; align-items: center; gap: 10px;';
        leftArea.appendChild(filterBtn);
        
        const langSwitcher = navTopBar.querySelector('.language-switcher');
        if (langSwitcher) {
            navTopBar.insertBefore(leftArea, langSwitcher);
        } else {
            navTopBar.appendChild(leftArea);
        }
    }
}

// Обновление активной навигации
// navigation-utils.js - упрощенная версия
export function updateActiveNav() {
    const navItems = document.querySelectorAll('.nav-item');
    const currentPage = window.location.hash.slice(2) || 'home';
    
    navItems.forEach(item => {
        const pageId = item.getAttribute('data-page');
        item.classList.remove('active');
        
        if (currentPage === pageId || currentPage.startsWith(pageId + '/')) {
            item.classList.add('active');
        }
    });

    setTimeout(() => moveHighlight(), 50);
}

export function moveHighlight() {
    const highlight = document.querySelector('.nav-highlight');
    const activeItem = document.querySelector('.nav-item.active');

    if (!highlight || !activeItem) return;

    try {
        const activeRect = activeItem.getBoundingClientRect();
        const navRect = document.querySelector('.nav-links').getBoundingClientRect();
        
        highlight.style.left = `${activeRect.left - navRect.left}px`;
        highlight.style.top = `${activeRect.top - navRect.top}px`;
        highlight.style.width = `${activeRect.width}px`;
        highlight.style.height = `${activeRect.height}px`;
        highlight.style.borderRadius = getComputedStyle(activeItem).borderRadius;
    } catch (error) {
        console.error('Ошибка в moveHighlight:', error);
    }
}

export function handleNavigation(e) {
    e.preventDefault();
    
    let link = e.target.closest('a[data-page]');
    if (!link && e.target.closest('.nav-item')) {
        link = e.target.closest('.nav-item');
    }
    
    if (!link || !link.hasAttribute('data-page')) return;

    const pageId = link.getAttribute('data-page');
    history.pushState({ page: pageId }, '', `#/${pageId}`);
    if (typeof window.showPage === 'function') {
        window.showPage(pageId);
    }
}

export function handleHashChange() {
    const pageId = window.location.hash.slice(2) || 'home';
    if (typeof window.showPage === 'function') {
        window.showPage(pageId);
    }
}

export function handleResize() {
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(() => {
        moveHighlight();
    }, 150);
}

export function updateAfterImagesLoad() {
    const images = document.querySelectorAll('img');
    if (images.length === 0) {
        moveHighlight();
        return;
    }
    
    let loaded = 0;
    images.forEach(img => {
        if (img.complete) {
            loaded++;
        } else {
            img.addEventListener('load', () => {
                loaded++;
                if (loaded === images.length) {
                    setTimeout(() => moveHighlight(), 100);
                }
            });
        }
    });
    
    if (loaded === images.length) {
        setTimeout(() => moveHighlight(), 100);
    }
}

export function setupNavigationListeners() {
    const mainNav = document.querySelector('.main-nav');
    if (mainNav) {
        mainNav.addEventListener('click', handleNavigation);
    }
    
    setupLanguageSwitcher();
    
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
        setTimeout(() => moveHighlight(), 300);
    });
}

// Обновленная функция настройки переключателя языка
export function setupLanguageSwitcher() {
    console.log('Настройка переключателя языка...');
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const lang = this.getAttribute('data-lang');
            console.log('Изменение языка на:', lang);
            
            // Вызываем функцию setLanguage
            if (window.setLanguage) {
                window.setLanguage(lang);
            } else {
                console.error('Функция setLanguage не найдена');
            }
        });
    });
}

