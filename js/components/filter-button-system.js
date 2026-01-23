// components/filter-button-system.js
import { translations } from '../translations.js';

export const filterButtonSystem = {
    // Флаг для отслеживания текущей кнопки
    currentPageId: null,
    
    // Инициализация системы
    init: function() {
        console.log('Система кнопок фильтра инициализирована');
        window.filterButtonSystem = this;
        return this;
    },
    
    // Обновление кнопок при смене страницы
updateForPage: function(pageId) {
    console.log('Обновление кнопок фильтра для страницы:', pageId);
    this.currentPageId = pageId;
    
    // Очищаем все существующие кнопки
    this.clearAllButtons();
    
    // Определяем, какие кнопки нужны для этой страницы
    if (pageId === 'characters' || pageId === 'weapon') {
        // Главная страница с фильтром
        this.createFilterButton(pageId);
    } else if (pageId.startsWith('characters/') || 
               pageId.startsWith('weapon/')) {
        // Подстраница - нужна кнопка "Назад"
        this.createBackButton(pageId);
    } else if (pageId.startsWith('date/')) {
        // Подстраница базы знаний - нужна кнопка "Назад" И кнопка фильтра
        this.createBackButton(pageId);
        this.createDateSubpageFilterButton(pageId);
    }
    // Для home, profile и главной date ничего не создаем
},
    // Создание кнопки фильтра для подстраниц date
createDateSubpageFilterButton: function(pageId) {
    const navLeftArea = document.querySelector('.nav-left-area');
    if (!navLeftArea) {
        console.error('nav-left-area не найден');
        return;
    }
    
    const lang = window.currentLang || 'ru';
    const translationsObj = translations[lang] || translations['ru'];
    
    // Удаляем существующую кнопку фильтра (если есть)
    const existingFilterBtn = navLeftArea.querySelector('.filter-button.date-filter');
    if (existingFilterBtn) {
        existingFilterBtn.remove();
    }
    
    // Создаем кнопку фильтра
    const filterBtn = document.createElement('button');
    filterBtn.className = 'filter-button date-filter';
    filterBtn.setAttribute('data-page', pageId);
    
    // Определяем текст в зависимости от подстраницы
    let filterText = translationsObj['filter.title'] || 'Фильтр';
    const subpageType = pageId.replace('date/', '');
    
    switch(subpageType) {
        case 'fish':
            filterText = translationsObj['filter.fish'] || 'Фильтр рыб';
            break;
        case 'creatures':
            filterText = translationsObj['filter.creatures'] || 'Фильтр существ';
            break;
        case 'artifacts':
            filterText = translationsObj['filter.artifacts'] || 'Фильтр артефактов';
            break;
    }
    
    filterBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
        </svg>
    `;
    
    filterBtn.style.cssText = `
        background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
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
        margin-left: 10px;
    `;
    
    filterBtn.addEventListener('mouseenter', () => {
        filterBtn.style.background = 'linear-gradient(135deg, #138496, #117a8b)';
        filterBtn.style.transform = 'scale(1.05)';
    });
    
    filterBtn.addEventListener('mouseleave', () => {
        filterBtn.style.background = 'linear-gradient(135deg, #17a2b8, #138496)';
        filterBtn.style.transform = 'scale(1)';
    });
    
    filterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Открытие фильтра для подстраницы date:', pageId);
        this.showDateSubpageFilterModal(pageId);
    });
    
    navLeftArea.appendChild(filterBtn);
    return filterBtn;
},

// Показать модальное окно фильтра для подстраниц date
showDateSubpageFilterModal: function(pageId) {
    const subpageType = pageId.replace('date/', '');
    const lang = window.currentLang || 'ru';
    const translationsObj = translations[lang] || translations['ru'];
    
    let title = translationsObj['filter.title'] || 'Фильтр';
    let sections = [];
    
    switch(subpageType) {
        case 'fish':
            title = translationsObj['filter.fish'] || 'Фильтр рыб';
            sections = [
                translationsObj['filter.region'] || 'Регион',
                translationsObj['filter.rarity'] || 'Редкость', 
                translationsObj['filter.difficulty'] || 'Сложность'
            ];
            break;
        case 'creatures':
            title = translationsObj['filter.creatures'] || 'Фильтр существ';
            sections = [
                translationsObj['filter.type'] || 'Тип',
                translationsObj['filter.element'] || 'Элемент',
                translationsObj['filter.region'] || 'Регион'
            ];
            break;
        case 'artifacts':
            title = translationsObj['filter.artifacts'] || 'Фильтр артефактов';
            sections = [
                translationsObj['filter.rarity'] || 'Редкость',
                translationsObj['filter.setType'] || 'Тип сета',
                translationsObj['filter.obtainMethod'] || 'Способ получения'
            ];
            break;
    }
    
    this.showTempModal(title, sections);
},
    // Создание кнопки фильтра
createFilterButton: function(pageId) {
    const navTopBar = document.querySelector('.nav-top-bar');
    if (!navTopBar) return;
    
    const lang = window.currentLang || 'ru';
    const translationsObj = translations[lang] || translations['ru'];
    
    // Для страницы оружия используем специальную функцию
    if (pageId === 'weapon') {
        if (typeof createWeaponFilterButton === 'function') {
            // Даем время на рендеринг карточек
            setTimeout(() => {
                createWeaponFilterButton();
            }, 100);
        } else {
            // Запасной вариант
            this.createDefaultFilterButton(pageId, translationsObj);
        }
        return;
    }
    
    // Для других страниц создаем стандартную кнопку
    this.createDefaultFilterButton(pageId, translationsObj);
},

// Создание стандартной кнопки фильтра
createDefaultFilterButton: function(pageId, translationsObj) {
    const navLeftArea = this.getOrCreateNavLeftArea();
    if (!navLeftArea) return;
    
    // Очищаем только кнопки фильтра
    const existingFilterBtn = navLeftArea.querySelector('.filter-button');
    if (existingFilterBtn) {
        existingFilterBtn.remove();
    }
    
    // Создаем кнопку
    const filterBtn = document.createElement('button');
    filterBtn.className = 'filter-button';
    filterBtn.setAttribute('data-page', pageId);
    filterBtn.setAttribute('aria-label', translationsObj['filter.title'] || 'Фильтр');
    
    filterBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
        </svg>
    `;
    
    // Стили и обработчики
    filterBtn.style.cssText = `
        
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
    `;
    
    filterBtn.addEventListener('mouseenter', () => {
        
        filterBtn.style.transform = 'translateY(-2px)';
    });
    
    filterBtn.addEventListener('mouseleave', () => {
        
        filterBtn.style.transform = 'translateY(0)';
    });
    
    // Обработчик клика
    filterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Открытие фильтра для страницы:', pageId);
        this.openFilterModal(pageId);
    });
    
    // Добавляем в DOM
    navLeftArea.appendChild(filterBtn);
    
    console.log('Кнопка фильтра создана для:', pageId);
    return filterBtn;
},

// Получение или создание области для кнопок
getOrCreateNavLeftArea: function() {
    const navTopBar = document.querySelector('.nav-top-bar');
    if (!navTopBar) return null;
    
    let navLeftArea = navTopBar.querySelector('.nav-left-area');
    
    if (!navLeftArea) {
        navLeftArea = document.createElement('div');
        navLeftArea.className = 'nav-left-area';
        navLeftArea.style.cssText = 'display: flex; align-items: center; gap: 10px;';
        
        const langSwitcher = navTopBar.querySelector('.language-switcher');
        if (langSwitcher) {
            navTopBar.insertBefore(navLeftArea, langSwitcher);
        } else {
            navTopBar.appendChild(navLeftArea);
        }
    }
    
    return navLeftArea;
},
    
    // Создание кнопки "Назад"
    createBackButton: function(pageId) {
        const navTopBar = document.querySelector('.nav-top-bar');
        if (!navTopBar) return;
        
        const lang = window.currentLang || 'ru';
        const buttons = translations[lang]?.buttons || translations['ru'].buttons;
        
        const backBtn = document.createElement('button');
        backBtn.className = 'back-button';
        
        // Определяем текст и страницу для возврата
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
        
        // Стили
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
        
        // Анимации
        backBtn.addEventListener('mouseenter', () => {
            backBtn.style.background = 'linear-gradient(135deg, #495057, #343a40)';
            backBtn.style.transform = 'scale(1.05)';
        });
        
        backBtn.addEventListener('mouseleave', () => {
            backBtn.style.background = 'linear-gradient(135deg, var(--light), #6c757d)';
            backBtn.style.transform = 'scale(1)';
        });
        
        // Обработчик клика
        backBtn.addEventListener('click', () => {
            history.pushState({}, '', `#/${backToPage}`);
            if (typeof window.showPage === 'function') {
                window.showPage(backToPage);
            }
        });
        
        // Добавляем в DOM
        this.addButtonToNav(backBtn);
        
        console.log('Кнопка "Назад" создана для:', pageId);
        return backBtn;
    },
    
    // Добавление кнопки в навигацию
    addButtonToNav: function(button) {
        const navTopBar = document.querySelector('.nav-top-bar');
        if (!navTopBar) return;
        
        let navLeftArea = navTopBar.querySelector('.nav-left-area');
        
        // Если области нет - создаем
        if (!navLeftArea) {
            navLeftArea = document.createElement('div');
            navLeftArea.className = 'nav-left-area';
            navLeftArea.style.cssText = 'display: flex; align-items: center; gap: 10px;';
            
            const langSwitcher = navTopBar.querySelector('.language-switcher');
            if (langSwitcher) {
                navTopBar.insertBefore(navLeftArea, langSwitcher);
            } else {
                navTopBar.appendChild(navLeftArea);
            }
        }
        
        // Очищаем и добавляем новую кнопку
        navLeftArea.innerHTML = '';
        navLeftArea.appendChild(button);
    },
    
    // Очистка всех кнопок
    // Также обновите функцию clearAllButtons чтобы правильно очищать кнопки:
clearAllButtons: function() {
    const navLeftArea = document.querySelector('.nav-left-area');
    if (navLeftArea) {
        // Очищаем только кнопки фильтра и назад, оставляя другие элементы если есть
        const filterButtons = navLeftArea.querySelectorAll('.filter-button, .back-button');
        filterButtons.forEach(button => button.remove());
    }
},
    
    // Открытие модального окна фильтра
    openFilterModal: function(pageId) {
        switch(pageId) {
            case 'characters':
                if (typeof window.createCharacterFilterModal === 'function') {
                    window.createCharacterFilterModal();
                } else {
                    console.error('createCharacterFilterModal не найдена');
                    this.showTempModal('Фильтр персонажей', ['Стихия', 'Оружие', 'Редкость']);
                }
                break;
                
            case 'weapon':
                this.showTempModal('Фильтр оружия', ['Тип оружия', 'Редкость', 'Статы']);
                break;
                
            case 'date':
                this.showTempModal('Фильтр базы знаний', ['Рыба', 'Существа', 'Артефакты']);
                break;
        }
    },
    
    // Временное модальное окно
    showTempModal: function(title, sections) {
        const lang = window.currentLang || 'ru';
        const translationsObj = translations[lang] || translations['ru'];
        
        const modal = document.createElement('div');
        modal.className = 'temp-filter-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 24px;
            border-radius: 16px;
            max-width: 400px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;
        
        modalContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; font-size: 18px;">${title}</h3>
                <button class="close-btn" style="
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                ">×</button>
            </div>
            <div style="color: #666; margin-bottom: 20px;">
                <p>Функция фильтра находится в разработке.</p>
                <p>Доступные фильтры:</p>
                <ul style="padding-left: 20px; margin: 10px 0;">
                    ${sections.map(section => `<li>${section}</li>`).join('')}
                </ul>
            </div>
            <div style="display: flex; justify-content: flex-end;">
                <button class="close-modal-btn" style="
                    background: var(--primary);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                ">${translationsObj['buttons.close'] || 'Закрыть'}</button>
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Обработчики закрытия
        const closeModal = () => modal.remove();
        modal.querySelector('.close-btn').addEventListener('click', closeModal);
        modal.querySelector('.close-modal-btn').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => e.target === modal && closeModal());
        
        document.addEventListener('keydown', function closeOnEsc(e) {
            if (e.key === 'Escape') closeModal();
        });
    },
    
    // Обновление при смене языка
updateOnLanguageChange: function(lang) {
    const filterBtn = document.querySelector('.filter-button');
    const backBtn = document.querySelector('.back-button');
    const dateFilterBtn = document.querySelector('.filter-button.date-filter');
    const translationsObj = translations[lang] || translations['ru'];
    
    if (filterBtn && !filterBtn.classList.contains('date-filter')) {
        const filterText = filterBtn.querySelector('.filter-text');
        if (filterText) {
            filterText.textContent = translationsObj['filter.title'] || 'Фильтр';
        }
        filterBtn.setAttribute('aria-label', translationsObj['filter.title'] || 'Фильтр');
    }
    
    if (dateFilterBtn) {
        const pageId = dateFilterBtn.getAttribute('data-page') || '';
        const subpageType = pageId.replace('date/', '');
        let filterText = translationsObj['filter.title'] || 'Фильтр';
        
        switch(subpageType) {
            case 'fish':
                filterText = translationsObj['filter.fish'] || 'Фильтр рыб';
                break;
            case 'creatures':
                filterText = translationsObj['filter.creatures'] || 'Фильтр существ';
                break;
            case 'artifacts':
                filterText = translationsObj['filter.artifacts'] || 'Фильтр артефактов';
                break;
        }
        
        const span = dateFilterBtn.querySelector('span');
        if (span) {
            span.textContent = filterText;
        }
    }
    
    if (backBtn) {
        const backTextSpan = backBtn.querySelector('span');
        if (backTextSpan) {
            const currentPage = this.currentPageId;
            let newText = translationsObj['buttons']?.backToCharacters || 'Назад к персонажам';
            
            if (currentPage?.startsWith('weapon/')) {
                newText = translationsObj['buttons']?.backToWeapons || 'Назад к оружию';
            } else if (currentPage?.startsWith('date/')) {
                newText = translationsObj['buttons']?.backToDate || 'Назад к базе знаний';
            }
            
            backTextSpan.textContent = newText;
        }
    }
}
};

// Экспорт для использования
export function initFilterButtonSystem() {
    const system = filterButtonSystem.init();
    console.log('Система кнопок фильтра готова');
    return system;
}