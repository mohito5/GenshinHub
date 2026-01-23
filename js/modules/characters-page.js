// modules/characters-page.js
import { renderCharacterCards, createCharacterFilterButton, characterFilters } from '../list-char.js';

// Инициализация страницы персонажей
export function initCharactersPage() {
    console.log('Инициализация страницы персонажей');
    
    const currentLang = window.currentLang || 'ru';
    
    // Рендерим карточки персонажей
    setTimeout(() => {
        if (typeof renderCharacterCards === 'function') {
            renderCharacterCards(currentLang, characterFilters);
            console.log('Карточки персонажей отрендерены');
        } else {
            console.error('renderCharacterCards не найдена');
        }
        
        // Создаем кнопку фильтра
        if (typeof createCharacterFilterButton === 'function') {
            createCharacterFilterButton();
            console.log('Кнопка фильтра создана');
        }
    }, 100);
}