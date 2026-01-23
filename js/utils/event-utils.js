// js/utils/event-utils.js
import { handleNavigation, handleHashChange, handleResize, moveHighlight } from './navigation-utils.js';
import { triggerLanguageChange } from './language-utils.js';

export function setupEventListeners() {
  const mainNav = document.querySelector('.main-nav');
  if (mainNav) {
    mainNav.addEventListener('click', handleNavigation);
  }
  
  // Обработчик для кнопок языка
  document.addEventListener('click', (e) => {
    const langBtn = e.target.closest('.lang-btn');
    if (langBtn) {
      e.preventDefault();
      e.stopPropagation();
      
      const lang = langBtn.getAttribute('data-lang');
      console.log('Клик по кнопке языка:', lang);
      
      // Добавляем анимацию переключения
      langBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        langBtn.style.transform = 'scale(1)';
      }, 150);
      
      triggerLanguageChange(lang);
    }
  });

  window.addEventListener('hashchange', handleHashChange);
  window.addEventListener('popstate', handleHashChange);
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', () => {
    setTimeout(() => moveHighlight(), 300);
  });
  
  // Глобальный слушатель для смены языка
  document.addEventListener('languageChange', (e) => {
    const newLang = e.detail.lang;
    console.log('Получено событие languageChange:', newLang);
    window.setLanguage(newLang);
  });
}