// date-module.js - функции для Date и подстраниц
import { translations } from '../translations.js';
import { dateManager } from '../date-manager.js';

// Глобальные фильтры для подстраниц date
window.dateFilters = {
    fish: {
        region: null,
        rarity: null,
        difficulty: null
    },
    creatures: {
        type: null,
        element: null,
        region: null
    },
    artifacts: {
        rarity: null,
        setType: null,
        obtainMethod: null
    }
};

// Инициализация модуля Date
// date-module.js - упрощенная версия
// date-module.js - упрощенная версия
// date-module.js - исправленная версия


export function initDateModule(pageId) {
    console.log('Инициализация модуля даты для:', pageId);
    
    if (pageId === 'date') {
        console.log('Главная страница базы знаний');
        dateManager.initDatePage();
    } else if (pageId.startsWith('date/')) {
        console.log('Подстраница базы знаний:', pageId);
        dateManager.initSubpage(pageId);
    }
}

// Инициализация главной страницы Date
function initDateMainPage() {
    console.log('Инициализация главной страницы Date');
    const container = document.querySelector('.info-card-container');
    if (!container) return;
    
    // Убеждаемся, что карточки кликабельны
    container.querySelectorAll('.date-card').forEach(card => {
        const link = card.querySelector('.date-card-link');
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = card.dataset.page;
                console.log('Переход на подстраницу:', targetPage);
                
                if (targetPage) {
                    history.pushState({}, '', `#/${targetPage}`);
                    if (typeof window.showPage === 'function') {
                        window.showPage(targetPage);
                    }
                }
            });
        }
    });
}

// Инициализация подстраниц Date
function initDateSubpage(pageId) {
    console.log('Инициализация подстраницы:', pageId);
    
    const subpageType = pageId.replace('date/', '');
    const contentContainer = document.querySelector('.date-subpage-content');
    
    if (!contentContainer) {
        console.error('Контейнер контента не найден');
        return;
    }
    
    // Убираем спиннер загрузки
    const loadingContainer = contentContainer.querySelector('.loading-container');
    if (loadingContainer) {
        loadingContainer.style.display = 'none';
    }
    
    // Создаем заглушку контента
    const lang = window.currentLang || 'ru';
    const translationsObj = translations[lang] || translations['ru'];
    
    let contentHtml = '';
    let title = '';
    
    switch(subpageType) {
        case 'fish':
            title = translationsObj['pages.date.fishing'] || 'Рыбалка';
            contentHtml = `
                <div class="date-content-placeholder">
                    <div style="text-align: center; padding: 40px;">
                        <div style="font-size: 48px; margin-bottom: 20px;">🐟</div>
                        <h3>${title}</h3>
                        <p style="color: #666; margin: 20px 0;">Содержимое этой страницы находится в разработке.</p>
                        <p style="color: #666;">В будущем здесь будет отображаться информация о рыбах, местах ловли, наживках и т.д.</p>
                    </div>
                </div>
            `;
            break;
        case 'creatures':
            title = translationsObj['date.creatures'] || 'Существа';
            contentHtml = `
                <div class="date-content-placeholder">
                    <div style="text-align: center; padding: 40px;">
                        <div style="font-size: 48px; margin-bottom: 20px;">🦊</div>
                        <h3>${title}</h3>
                        <p style="color: #666; margin: 20px 0;">Содержимое этой страницы находится в разработке.</p>
                        <p style="color: #666;">В будущем здесь будет отображаться информация о врагах и нейтральных существах.</p>
                    </div>
                </div>
            `;
            break;
        case 'artifacts':
            title = translationsObj['date.artifacts'] || 'Артефакты';
            contentHtml = `
                <div class="date-content-placeholder">
                    <div style="text-align: center; padding: 40px;">
                        <div style="font-size: 48px; margin-bottom: 20px;">🏆</div>
                        <h3>${title}</h3>
                        <p style="color: #666; margin: 20px 0;">Содержимое этой страницы находится в разработке.</p>
                        <p style="color: #666;">В будущем здесь будет отображаться информация о наборах артефактов, статах и бонусах.</p>
                    </div>
                </div>
            `;
            break;
        default:
            contentHtml = `
                <div class="date-content-placeholder">
                    <div style="text-align: center; padding: 40px; color: #666;">
                        <h3>Страница не найдена</h3>
                        <p>Запрошенная подстраница не существует.</p>
                    </div>
                </div>
            `;
    }
    
    contentContainer.innerHTML = contentHtml;
}

// Загрузка контента подстраницы
function loadDateSubpageContent(pageId) {
    console.log('Загрузка контента для подстраницы:', pageId);
    // Здесь в будущем можно загружать реальные данные
}





// Инициализация подстраницы рыбалки
function initFishSubpage() {
    console.log('Инициализация подстраницы рыбалки');
    // Загрузка данных о рыбе
    loadFishData();
}

// Инициализация подстраницы существ
function initCreaturesSubpage() {
    console.log('Инициализация подстраницы существ');
    // Загрузка данных о существах
    loadCreaturesData();
}

// Инициализация подстраницы артефактов
function initArtifactsSubpage() {
    console.log('Инициализация подстраницы артефактов');
    // Загрузка данных об артефактах
    loadArtifactsData();
}

// Создание кнопки фильтра для подстраниц date
function createDateSubpageFilterButton(pageId) {
    console.log('Создание кнопки фильтра для подстраницы date:', pageId);
    
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
    
    const lang = window.currentLang || 'ru';
    const translationsObj = translations[lang] || translations['ru'];
    
    // Создаем кнопку фильтра
    const filterBtn = document.createElement('button');
    filterBtn.className = 'filter-button';
    filterBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
        </svg>
        <span>${translationsObj.filter.title || 'Фильтр'}</span>
    `;
    
    filterBtn.style.cssText = `
        background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
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
        filterBtn.style.background = 'linear-gradient(135deg, #0056b3, #004085)';
        filterBtn.style.transform = 'scale(1.05)';
    });
    
    filterBtn.addEventListener('mouseleave', () => {
        filterBtn.style.background = 'linear-gradient(135deg, #007bff, #0056b3)';
        filterBtn.style.transform = 'scale(1)';
    });
    
    filterBtn.addEventListener('click', () => {
        showDateFilterModal(pageId);
    });
    
    navLeftArea.appendChild(filterBtn);
}

// Показать модальное окно фильтра для подстраниц date
function showDateFilterModal(pageId) {
    console.log('Показ модального окна фильтра для:', pageId);
    
    // Определяем тип подстраницы для загрузки соответствующих фильтров
    const subpageType = pageId.replace('date/', '');
    
    // Здесь будет логика создания модального окна фильтра
    // в зависимости от типа подстраницы
    console.log('Создание фильтра для:', subpageType);
}

// Загрузка данных о рыбе
function loadFishData() {
    console.log('Загрузка данных о рыбе...');
    // Здесь будет загрузка данных из API или файла
}

// Загрузка данных о существах
function loadCreaturesData() {
    console.log('Загрузка данных о существах...');
    // Здесь будет загрузка данных из API или файла
}

// Загрузка данных об артефактах
function loadArtifactsData() {
    console.log('Загрузка данных об артефактах...');
    // Здесь будет загрузка данных из API или файла
}