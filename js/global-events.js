// global-events.js
export function setupGlobalEventListeners() {
    console.log('Настройка глобальных обработчиков событий');
    
    // Обработчик смены языка
    document.addEventListener('languageChange', (e) => {
        const newLang = e.detail.lang;
        console.log('Событие languageChange:', newLang);
        
        window.currentLang = newLang;
        
        // Обновляем все страницы
        const currentPage = window.location.hash.slice(2) || 'home';
        
        // Для страницы профиля перерисовываем сохранения
        if (currentPage === 'profile') {
            setTimeout(() => {
                if (typeof renderSavedMaterials === 'function') {
                    renderSavedMaterials();
                }
            }, 100);
        }
    });
    
    // Обработчик хэша для обновления страниц
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash;
        const pageId = hash.slice(2) || 'home';
        
        // Для страницы профиля инициализируем модуль
        if (pageId === 'profile') {
            setTimeout(() => {
                if (typeof initProfileModule === 'function') {
                    initProfileModule();
                }
            }, 50);
        }
        
        // Для страницы калькулятора инициализируем модуль
        if (pageId === 'profile/calculator') {
            setTimeout(() => {
                if (typeof initCalculatorModule === 'function') {
                    initCalculatorModule();
                }
            }, 50);
        }
    });
}

// Инициализация при запуске
document.addEventListener('DOMContentLoaded', () => {
    setupGlobalEventListeners();
});