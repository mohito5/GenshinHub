// js/modules/characters-module.js
import { renderCharacterCards, createCharacterFilterButton } from '../list-char.js';

export function initCharactersPage() {
  console.log('Инициализация страницы персонажей');
  
  setTimeout(() => {
    renderCharacterCards(window.currentLang);
    createCharacterFilterButton();
  }, 100);
}

export function initCharacterSubpages(pageId) {
  console.log('Инициализация подстраницы персонажей:', pageId);
  
  // Для подстраниц персонажей загружаем детальную информацию
  if (pageId === 'characters/info' || pageId === 'characters/guide' || pageId === 'characters/mat') {
    console.log(`Загрузка подстраницы ${pageId}...`);
    
    // Даем время для загрузки DOM
    setTimeout(() => {
      if (typeof window.initCharacterDetailPage === 'function') {
        window.initCharacterDetailPage(pageId);
      } else {
        console.error('Функция initCharacterDetailPage не найдена в window');
        // Пробуем импортировать динамически
        import('./character-detail-module.js').then(module => {
          if (module.initCharacterDetailPage) {
            module.initCharacterDetailPage(pageId);
          }
        }).catch(err => {
          console.error('Ошибка загрузки character-detail-module:', err);
        });
      }
    }, 150);
  }
}