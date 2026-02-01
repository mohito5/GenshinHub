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
        if (pageId === 'characters' || pageId === 'weapon' || pageId === 'date') {
            // Главная страница с фильтром
            this.createFilterButton(pageId);
        } else if (pageId.startsWith('characters/') || 
                   pageId.startsWith('weapon/') || 
                   pageId.startsWith('date/')) {
            // Подстраница - нужна кнопка "Назад"
            this.createBackButton(pageId);
        }
        // Для home и profile ничего не создаем
    },
    
    // Создание кнопки фильтра
    createFilterButton: function(pageId) {
        const navTopBar = document.querySelector('.nav-top-bar');
        if (!navTopBar) return;
        
        const lang = window.currentLang || 'ru';
        const translationsObj = translations[lang] || translations['ru'];
        
        // Создаем кнопку
        const filterBtn = document.createElement('button');
        filterBtn.className = 'filter-button';
        filterBtn.setAttribute('data-page', pageId);
        filterBtn.setAttribute('aria-label', translationsObj['filter.title'] || 'Фильтр');
        
        filterBtn.innerHTML = `
            <svg <svg><use href="#icon-filter"></use></svg>
        `;
        
        // Обработчик клика
        filterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Открытие фильтра для страницы:', pageId);
            this.openFilterModal(pageId);
        });
        
        // Добавляем в DOM
        this.addButtonToNav(filterBtn);
        
        console.log('Кнопка фильтра создана для:', pageId);
        return filterBtn;
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
            <svg <svg><use href="#icon-arrow"></use></svg>
            
        `;
        
        
        
        
        
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
    clearAllButtons: function() {
        const navLeftArea = document.querySelector('.nav-left-area');
        if (navLeftArea) {
            navLeftArea.innerHTML = '';
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
        const translationsObj = translations[lang] || translations['ru'];
        
        if (filterBtn) {
            const filterText = filterBtn.querySelector('.filter-text');
            if (filterText) {
                filterText.textContent = translationsObj['filter.title'] || 'Фильтр';
            }
            filterBtn.setAttribute('aria-label', translationsObj['filter.title'] || 'Фильтр');
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