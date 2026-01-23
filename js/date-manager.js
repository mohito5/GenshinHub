// date-manager.js - исправленная версия с правильной структурой
import { fishingData, creaturesData, artifactsData } from './date-data.js';
import { translations } from './translations.js';
// Импортируем функции из calculator-module для субстатов
import { 
  substatTiers,
  calculateUpgradesForSubstat,
  getSubstatRangeDisplay,
  formatSubstatValue,
  getStatDisplayName as getCalculatorStatName
} from './modules/calculator-module.js';

class DateManager {
  constructor() {
    this.currentFishIndex = 0;
    this.currentFishList = [];
    this.currentCreatureIndex = 0;
    this.currentCreatureList = [];
    this.currentArtifactSet = null;
    this.currentArtifactPiece = 'flower';
    this.currentArtifactSetIndex = 0;
    this.currentMainStatIndex = 0;
    this.currentArtifactLevel = 0;
    this.selectedSubstats = [];
  }

  // ==================== ОСНОВНЫЕ МЕТОДЫ ====================

  // Инициализация главной страницы date
  initDatePage() {
    console.log('Инициализация главной страницы date');
    this.initCategoryCards();
  }

  // Инициализация подстраницы
  initSubpage(subpageId) {
    console.log('Инициализация подстраницы:', subpageId);
    
    switch(subpageId) {
      case 'date/fish':
        this.initFishPage();
        break;
      case 'date/creatures':
        this.initCreaturesPage();
        break;
      case 'date/artifacts':
        this.initArtifactsPage();
        break;
    }
  }

  // ==================== ГЛАВНАЯ СТРАНИЦА ====================

  // Инициализация карточек категорий
  initCategoryCards() {
    const cards = document.querySelectorAll('.date-category-card');
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = card.getAttribute('data-page');
        if (pageId) {
          history.pushState({}, '', `#/${pageId}`);
          showPage(pageId);
        }
      });
    });
  }

  // ==================== СТРАНИЦА РЫБ ====================

  // Инициализация страницы рыб
  initFishPage() {
    const container = document.getElementById('fish-content');
    if (!container) return;
    
    setTimeout(() => {
      this.renderFishPage(container);
    }, 100);
  }

  // Рендер страницы рыб
  renderFishPage(container) {
    const lang = window.currentLang || 'ru';
    const translationsObj = translations[lang] || translations['ru'];
    
    let html = `
      <div class="fish-page">
        <div class="page-controls">
          
          <div class="page-filters">
            <div class="filter-group">
              <label data-i18n="date.filterByRegion">Фильтр по региону:</label>
              <select id="region-filter" class="region-select">
                <option value="all" data-i18n="date.allRegions">Все регионы</option>
                ${fishingData.categories.map(cat => 
                  `<option value="${cat.id}">${cat.name}</option>`
                ).join('')}
              </select>
            </div>
            
            <div class="filter-group">
              <label data-i18n="date.filterByRarity">Фильтр по редкости:</label>
              <select id="rarity-filter" class="rarity-select">
                <option value="all" data-i18n="date.allRarities">Все редкости</option>
                <option value="1">★</option>
                <option value="2">★★</option>
                <option value="3">★★★</option>
                <option value="4">★★★★</option>
              </select>
            </div>
            
            <div class="filter-group">
              <button id="reset-filters" class="reset-btn" data-i18n="buttons.reset">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
                Сбросить
              </button>
            </div>
          </div>
        </div>
        
        <div class="fish-stats-summary">
          <div class="stat-card">
            <div class="stat-icon">🐟</div>
            <div class="stat-info">
              <span class="stat-value" id="total-fish-count">${this.getTotalFishCount()}</span>
              <span class="stat-label" data-i18n="date.totalFish">Всего рыб</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📍</div>
            <div class="stat-info">
              <span class="stat-value">${fishingData.categories.length}</span>
              <span class="stat-label" data-i18n="date.regions">Регионов</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🎣</div>
            <div class="stat-info">
              <span class="stat-value">3</span>
              <span class="stat-label" data-i18n="date.baitTypes">Типов наживки</span>
            </div>
          </div>
        </div>
        
        <div class="fish-categories-container">
    `;

    fishingData.categories.forEach(category => {
      html += `
        <div class="fish-category-section" data-category="${category.id}">
          <div class="category-header">
            <h3 class="category-title">${category.name}</h3>
            <span class="category-count">${category.fishes.length} <span data-i18n="date.fishes">рыб</span></span>
          </div>
          
          <div class="fishes-grid">
      `;

      category.fishes.forEach(fish => {
        const fishName = fish.name[lang] || fish.name.ru;
        const starsCount = fish.rarity.length;
        
        html += `
          <div class="fish-card" data-fish-id="${fish.id}" data-category="${category.id}" data-rarity="${starsCount}">
            <div class="fish-card-inner">
              <div class="fish-card-header">
                <div class="fish-icon">
                  <span class="fish-emoji">🐟</span>
                  <div class="fish-rarity">${fish.rarity}</div>
                </div>
                <div class="fish-name-container">
                  <h4 class="fish-name">${fishName}</h4>
                  <span class="fish-family">${fish.family}</span>
                </div>
              </div>
              
              <div class="fish-card-body">
                <div class="fish-info-row">
                  <span class="info-label" data-i18n="date.location">Локация:</span>
                  <span class="info-value">${fish.location}</span>
                </div>
                <div class="fish-info-row">
                  <span class="info-label" data-i18n="date.time">Время:</span>
                  <span class="info-value">${fish.time}</span>
                </div>
                <div class="fish-info-row">
                  <span class="info-label" data-i18n="date.bait">Наживка:</span>
                  <span class="info-value bait-value">${fish.bait[lang] || fish.bait.ru}</span>
                </div>
              </div>
              
              <div class="fish-card-footer">
                <div class="difficulty-badge ${fish.difficulty.toLowerCase()}">
                  ${fish.difficulty}
                </div>
                <button class="view-details-btn" data-i18n="buttons.details">
                  Подробнее
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    html += `
        </div>
        
        <div class="no-results-message" style="display: none;">
          <div class="empty-state">
            <div class="empty-icon">🎣</div>
            <h3 data-i18n="date.noFishFound">Рыбы не найдены</h3>
            <p data-i18n="date.tryChangingFilters">Попробуйте изменить параметры фильтрации</p>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
    
    this.initFishPageFunctionality();
  }

  // Инициализация функционала страницы рыб
  initFishPageFunctionality() {
    // Кнопка "Назад"
    const backBtn = document.getElementById('fish-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        history.pushState({}, '', '#/date');
        showPage('date');
      });
    }
    
    // Фильтры
    this.initFishFilters();
    
    // Карточки рыб
    this.initFishCards();
    
    // Кнопка сброса фильтров
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        document.getElementById('region-filter').value = 'all';
        document.getElementById('rarity-filter').value = 'all';
        this.filterFishes();
      });
    }
  }

  // Инициализация фильтров рыб
  initFishFilters() {
    const regionFilter = document.getElementById('region-filter');
    const rarityFilter = document.getElementById('rarity-filter');

    if (regionFilter) {
      regionFilter.addEventListener('change', () => {
        this.filterFishes();
      });
    }

    if (rarityFilter) {
      rarityFilter.addEventListener('change', () => {
        this.filterFishes();
      });
    }
  }
  
  // Инициализация карточек рыб
  initFishCards() {
    const fishCards = document.querySelectorAll('.fish-card');
    fishCards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.view-details-btn')) {
          const fishId = card.getAttribute('data-fish-id');
          const categoryId = card.getAttribute('data-category');
          this.showFishModal(fishId, categoryId);
        }
      });
      
      const detailsBtn = card.querySelector('.view-details-btn');
      if (detailsBtn) {
        detailsBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const fishId = card.getAttribute('data-fish-id');
          const categoryId = card.getAttribute('data-category');
          this.showFishModal(fishId, categoryId);
        });
      }
    });
  }

  // Фильтрация рыб
  filterFishes() {
    const regionFilter = document.getElementById('region-filter');
    const rarityFilter = document.getElementById('rarity-filter');
    
    const selectedRegion = regionFilter?.value || 'all';
    const selectedRarity = rarityFilter?.value || 'all';
    
    const categories = document.querySelectorAll('.fish-category-section');
    const allFishCards = document.querySelectorAll('.fish-card');
    
    let hasVisibleFish = false;
    let totalVisibleFish = 0;
    
    categories.forEach(category => {
      const categoryId = category.getAttribute('data-category');
      const categoryFishCards = category.querySelectorAll('.fish-card');
      let categoryHasVisibleFish = false;
      
      categoryFishCards.forEach(card => {
        const fishRarity = card.getAttribute('data-rarity');
        const starsCount = parseInt(fishRarity);
        
        const regionMatch = selectedRegion === 'all' || categoryId === selectedRegion;
        const rarityMatch = selectedRarity === 'all' || starsCount.toString() === selectedRarity;
        
        if (regionMatch && rarityMatch) {
          card.style.display = 'flex';
          categoryHasVisibleFish = true;
          hasVisibleFish = true;
          totalVisibleFish++;
        } else {
          card.style.display = 'none';
        }
      });
      
      if (categoryHasVisibleFish) {
        category.style.display = 'block';
      } else {
        category.style.display = 'none';
      }
    });
    
    // Обновляем счетчик рыб
    const totalCountElement = document.getElementById('total-fish-count');
    if (totalCountElement) {
      totalCountElement.textContent = totalVisibleFish;
    }
    
    // Показываем/скрываем сообщение о пустом результате
    const noResultsMessage = document.querySelector('.no-results-message');
    if (noResultsMessage) {
      if (!hasVisibleFish) {
        noResultsMessage.style.display = 'block';
      } else {
        noResultsMessage.style.display = 'none';
      }
    }
  }

  // Показ модального окна рыбы
  showFishModal(fishId, categoryId) {
    const category = fishingData.categories.find(cat => cat.id === categoryId);
    if (!category) return;
    
    const fish = category.fishes.find(f => f.id === fishId);
    if (!fish) return;
    
    // Собираем список всех рыб для навигации
    this.currentFishList = [];
    fishingData.categories.forEach(cat => {
      cat.fishes.forEach(f => {
        this.currentFishList.push({
          fish: f,
          category: cat.id
        });
      });
    });
    
    // Находим индекс текущей рыбы
    this.currentFishIndex = this.currentFishList.findIndex(item => 
      item.fish.id === fishId && item.category === categoryId
    );
    
    // Создаем модальное окно
    this.createFishModal(fish, category);
  }

  // Создание модального окна рыбы
  createFishModal(fish, category) {
    const lang = window.currentLang || 'ru';
    const translationsObj = translations[lang] || translations['ru'];
    const fishName = fish.name[lang] || fish.name.ru;
    
    const modal = document.createElement('div');
    modal.className = 'fish-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      animation: fadeIn 0.3s forwards;
    `;
    
    modal.innerHTML = `
      <div class="fish-modal-content" style="
        background: white;
        border-radius: 20px;
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        padding: 30px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      ">
        <button class="modal-close-btn" style="
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          z-index: 10;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.3s;
        ">×</button>
        
        <div class="fish-modal-nav" style="
          position: absolute;
          top: 50%;
          width: 100%;
          display: flex;
          justify-content: space-between;
          pointer-events: none;
          z-index: 5;
          padding: 0 20px;
          transform: translateY(-50%);
        ">
          <button class="nav-arrow prev-arrow" ${this.currentFishIndex === 0 ? 'disabled' : ''} style="
            pointer-events: all;
            background: white;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: ${this.currentFishIndex === 0 ? 'not-allowed' : 'pointer'};
            opacity: ${this.currentFishIndex === 0 ? 0.5 : 1};
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-size: 24px;
            color: #333;
            transition: all 0.3s;
          ">←</button>
          
          <button class="nav-arrow next-arrow" ${this.currentFishIndex === this.currentFishList.length - 1 ? 'disabled' : ''} style="
            pointer-events: all;
            background: white;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: ${this.currentFishIndex === this.currentFishList.length - 1 ? 'not-allowed' : 'pointer'};
            opacity: ${this.currentFishIndex === this.currentFishList.length - 1 ? 0.5 : 1};
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-size: 24px;
            color: #333;
            transition: all 0.3s;
          ">→</button>
        </div>
        
        <div class="fish-modal-body">
          <div class="fish-modal-header" style="
            display: flex;
            gap: 20px;
            align-items: center;
            margin-bottom: 30px;
          ">
            <div class="fish-modal-icon" style="
              flex-shrink: 0;
              position: relative;
            ">
              <div class="fish-icon-large" style="
                width: 100px;
                height: 100px;
                background: linear-gradient(135deg, #36d1dc 0%, #5b86e5 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 48px;
              ">🐟</div>
              <div class="fish-rarity-large" style="
                position: absolute;
                bottom: 0;
                right: 0;
                background: gold;
                color: #333;
                padding: 4px 12px;
                border-radius: 15px;
                font-weight: bold;
                font-size: 14px;
              ">${fish.rarity}</div>
            </div>
            <div class="fish-modal-title" style="flex: 1;">
              <h2 style="font-size: 2rem; margin-bottom: 10px; color: #333;">${fishName}</h2>
              <div class="fish-location-large" style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <span class="region-badge" style="
                  background: #e3f2fd;
                  color: #1976d2;
                  padding: 4px 12px;
                  border-radius: 15px;
                  font-size: 14px;
                  font-weight: 500;
                ">${category.name}</span>
                <span style="color: #666;">📍 ${fish.location}</span>
              </div>
              <div class="fish-family-large" style="
                background: #f0f7ff;
                padding: 6px 12px;
                border-radius: 10px;
                display: inline-block;
                font-size: 14px;
                color: #555;
              ">
                Семейство: ${fish.family}
              </div>
            </div>
          </div>
          
          <div class="fish-modal-description" style="
            margin-bottom: 30px;
            font-size: 16px;
            line-height: 1.6;
            color: #555;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 12px;
          ">
            <p>${fish.description}</p>
          </div>
          
          <div class="fish-modal-details" style="margin-bottom: 30px;">
            <h3 style="font-size: 1.4rem; margin-bottom: 20px; color: #333;">Подробная информация</h3>
            <div class="details-grid" style="
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 20px;
            ">
              <div class="detail-item" style="
                background: white;
                padding: 15px;
                border-radius: 10px;
                border: 1px solid #eee;
              ">
                <h4 style="font-size: 14px; color: #777; margin-bottom: 8px; text-transform: uppercase;">${translationsObj['date.time'] || 'Время ловли'}</h4>
                <p style="font-size: 16px; color: #333; font-weight: 500;">${fish.time}</p>
              </div>
              
              <div class="detail-item" style="
                background: white;
                padding: 15px;
                border-radius: 10px;
                border: 1px solid #eee;
              ">
                <h4 style="font-size: 14px; color: #777; margin-bottom: 8px; text-transform: uppercase;">${translationsObj['date.bait'] || 'Наживка'}</h4>
                <p style="font-size: 16px; color: #36d1dc; font-weight: 600;">${fish.bait[lang] || fish.bait.ru}</p>
              </div>
              
              <div class="detail-item" style="
                background: white;
                padding: 15px;
                border-radius: 10px;
                border: 1px solid #eee;
              ">
                <h4 style="font-size: 14px; color: #777; margin-bottom: 8px; text-transform: uppercase;">${translationsObj['date.difficulty'] || 'Сложность'}</h4>
                <p style="font-size: 16px; color: #333; font-weight: 500;">
                  <span class="difficulty-badge-inline ${fish.difficulty.toLowerCase()}" style="
                    padding: 4px 12px;
                    border-radius: 15px;
                    font-size: 12px;
                    font-weight: 500;
                    ${fish.difficulty === 'Легкая' ? 'background: #d4edda; color: #155724;' : 
                      fish.difficulty === 'Средняя' ? 'background: #fff3cd; color: #856404;' : 
                      'background: #f8d7da; color: #721c24;'}
                  ">${fish.difficulty}</span>
                </p>
              </div>
              
              <div class="detail-item" style="
                background: white;
                padding: 15px;
                border-radius: 10px;
                border: 1px solid #eee;
              ">
                <h4 style="font-size: 14px; color: #777; margin-bottom: 8px; text-transform: uppercase;">${translationsObj['date.size'] || 'Размер'}</h4>
                <p style="font-size: 16px; color: #333; font-weight: 500;">${fish.size}</p>
              </div>
              
              <div class="detail-item" style="
                background: white;
                padding: 15px;
                border-radius: 10px;
                border: 1px solid #eee;
              ">
                <h4 style="font-size: 14px; color: #777; margin-bottom: 8px; text-transform: uppercase;">${translationsObj['date.points'] || 'Очки рыбы'}</h4>
                <p style="font-size: 16px; color: #333; font-weight: 500;">${fish.stats.points}</p>
              </div>
              
              <div class="detail-item" style="
                background: white;
                padding: 15px;
                border-radius: 10px;
                border: 1px solid #eee;
              ">
                <h4 style="font-size: 14px; color: #777; margin-bottom: 8px; text-transform: uppercase;">${translationsObj['date.special'] || 'Особенность'}</h4>
                <p style="font-size: 16px; color: #333; font-weight: 500;">
                  ${fish.stats.special !== 'Нет' ? 
                    `<span class="special-tag" style="
                      background: #fff3e0;
                      color: #f57c00;
                      padding: 4px 12px;
                      border-radius: 15px;
                      font-size: 14px;
                    ">${fish.stats.special}</span>` : 
                    'Нет'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="fish-modal-counter" style="
          text-align: center;
          margin-top: 20px;
          color: #888;
          font-size: 14px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        ">
          <span>${this.currentFishIndex + 1} / ${this.currentFishList.length}</span>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Анимация появления
    setTimeout(() => {
      modal.style.opacity = '1';
    }, 10);
    
    // Обработчики событий
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = '#f5f5f5';
      });
      closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'none';
      });
      closeBtn.addEventListener('click', () => {
        this.closeModal(modal);
      });
    }
    
    // Навигация стрелками
    const prevArrow = modal.querySelector('.prev-arrow');
    const nextArrow = modal.querySelector('.next-arrow');
    
    if (prevArrow && !prevArrow.disabled) {
      prevArrow.addEventListener('mouseenter', () => {
        if (!prevArrow.disabled) prevArrow.style.background = '#f5f5f5';
      });
      prevArrow.addEventListener('mouseleave', () => {
        if (!prevArrow.disabled) prevArrow.style.background = 'white';
      });
      prevArrow.addEventListener('click', () => {
        this.navigateFish(-1, modal);
      });
    }
    
    if (nextArrow && !nextArrow.disabled) {
      nextArrow.addEventListener('mouseenter', () => {
        if (!nextArrow.disabled) nextArrow.style.background = '#f5f5f5';
      });
      nextArrow.addEventListener('mouseleave', () => {
        if (!nextArrow.disabled) nextArrow.style.background = 'white';
      });
      nextArrow.addEventListener('click', () => {
        this.navigateFish(1, modal);
      });
    }
    
    // Закрытие по клику вне модального окна
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal(modal);
      }
    });
    
    // Закрытие по Escape
    const closeOnEsc = (e) => {
      if (e.key === 'Escape') {
        this.closeModal(modal);
        document.removeEventListener('keydown', closeOnEsc);
      }
    };
    document.addEventListener('keydown', closeOnEsc);
    
    // Стрелки клавиатуры для навигации
    const handleKeyNavigation = (e) => {
      if (e.key === 'ArrowLeft' && this.currentFishIndex > 0) {
        this.navigateFish(-1, modal);
      } else if (e.key === 'ArrowRight' && this.currentFishIndex < this.currentFishList.length - 1) {
        this.navigateFish(1, modal);
      }
    };
    document.addEventListener('keydown', handleKeyNavigation);
    
    // Удаляем слушатели при закрытии
    modal.addEventListener('animationend', function handler(e) {
      if (e.animationName === 'fadeOut') {
        document.removeEventListener('keydown', closeOnEsc);
        document.removeEventListener('keydown', handleKeyNavigation);
        modal.removeEventListener('animationend', handler);
      }
    });
  }

  // Навигация по рыбам
  navigateFish(direction, currentModal) {
    const newIndex = this.currentFishIndex + direction;
    if (newIndex < 0 || newIndex >= this.currentFishList.length) return;
    
    this.currentFishIndex = newIndex;
    const nextFish = this.currentFishList[newIndex];
    const category = fishingData.categories.find(cat => cat.id === nextFish.category);
    
    this.closeModal(currentModal);
    setTimeout(() => {
      this.createFishModal(nextFish.fish, category);
    }, 300);
  }

  // ==================== СТРАНИЦА СУЩЕСТВ ====================

  // Инициализация страницы существ
  initCreaturesPage() {
    const container = document.getElementById('creatures-content');
    if (!container) return;
    
    setTimeout(() => {
      this.renderCreaturesPage(container);
    }, 100);
  }

  // Рендер страницы существ
  renderCreaturesPage(container) {
    const lang = window.currentLang || 'ru';
    const translationsObj = translations[lang] || translations['ru'];
    
    let html = `
      <div class="creatures-page">
        <div class="page-controls">
          <button class="back-button" id="creatures-back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span data-i18n="buttons.back">Назад к категориям</span>
          </button>
          
          <div class="page-filters">
            <div class="filter-group">
              <label data-i18n="date.filterByType">Фильтр по типу:</label>
              <select id="type-filter" class="type-select">
                <option value="all" data-i18n="date.allTypes">Все типы</option>
                <option value="common" data-i18n="date.commonEnemies">Обычные враги</option>
                <option value="elite" data-i18n="date.eliteEnemies">Элитные враги</option>
                <option value="boss" data-i18n="date.bosses">Боссы</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label data-i18n="date.filterByElement">Фильтр по элементу:</label>
              <select id="element-filter" class="element-select">
                <option value="all" data-i18n="date.allElements">Все элементы</option>
                <option value="pyro" data-i18n="elements.pyro">Пиро</option>
                <option value="hydro" data-i18n="elements.hydro">Гидро</option>
                <option value="electro" data-i18n="elements.electro">Электро</option>
                <option value="cryo" data-i18n="elements.cryo">Крио</option>
                <option value="anemo" data-i18n="elements.anemo">Анемо</option>
                <option value="geo" data-i18n="elements.geo">Гео</option>
                <option value="dendro" data-i18n="elements.dendro">Дендро</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="creatures-categories-container">
    `;

    creaturesData.categories.forEach(category => {
      html += `
        <div class="creature-category-section" data-category="${category.id}">
          <div class="category-header">
            <h3 class="category-title">${category.name}</h3>
            <span class="category-count">${category.creatures.length} <span data-i18n="date.creaturesCount">существ</span></span>
          </div>
          
          <div class="creatures-grid">
      `;

      category.creatures.forEach(creature => {
        const creatureName = creature.name[lang] || creature.name.ru;
        
        html += `
          <div class="creature-card" data-creature-id="${creature.id}" data-category="${category.id}" data-type="${creature.type}">
            <div class="creature-card-inner">
              <div class="creature-card-header">
                <div class="creature-icon">
                  <span class="creature-emoji">${this.getCreatureEmoji(category.id)}</span>
                  <div class="creature-type">${creature.type}</div>
                </div>
                <div class="creature-name-container">
                  <h4 class="creature-name">${creatureName}</h4>
                  <span class="creature-region">📍 ${creature.region}</span>
                </div>
              </div>
              
              <div class="creature-card-body">
                <div class="creature-stats-preview">
                  <div class="stat-preview">
                    <span class="stat-label" data-i18n="date.hp">HP:</span>
                    <span class="stat-value">${creature.stats.hp[2]}</span>
                  </div>
                  <div class="stat-preview">
                    <span class="stat-label" data-i18n="date.attack">Атака:</span>
                    <span class="stat-value">${creature.stats.attack[2]}</span>
                  </div>
                  <div class="stat-preview">
                    <span class="stat-label" data-i18n="date.defense">Защита:</span>
                    <span class="stat-value">${creature.stats.defense[2]}</span>
                  </div>
                </div>
                
                <div class="creature-drops-preview">
                  <span class="drops-label" data-i18n="date.drops">Дроп:</span>
                  <div class="drops-tags">
                    ${creature.drops.slice(0, 2).map(drop => `
                      <span class="drop-tag">${drop}</span>
                    `).join('')}
                    ${creature.drops.length > 2 ? `<span class="more-drops">+${creature.drops.length - 2}</span>` : ''}
                  </div>
                </div>
              </div>
              
              <div class="creature-card-footer">
                <button class="view-details-btn" data-i18n="buttons.details">
                  Подробнее
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;
    
    this.initCreaturesPageFunctionality();
  }

  // Инициализация функционала страницы существ
  initCreaturesPageFunctionality() {
    // Кнопка "Назад"
    const backBtn = document.getElementById('creatures-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        history.pushState({}, '', '#/date');
        showPage('date');
      });
    }
    
    // Карточки существ
    this.initCreatureCards();
  }

  // Инициализация карточек существ
  initCreatureCards() {
    const creatureCards = document.querySelectorAll('.creature-card');
    creatureCards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.view-details-btn')) {
          const creatureId = card.getAttribute('data-creature-id');
          const categoryId = card.getAttribute('data-category');
          this.showCreatureModal(creatureId, categoryId);
        }
      });
      
      const detailsBtn = card.querySelector('.view-details-btn');
      if (detailsBtn) {
        detailsBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const creatureId = card.getAttribute('data-creature-id');
          const categoryId = card.getAttribute('data-category');
          this.showCreatureModal(creatureId, categoryId);
        });
      }
    });
  }

  // Показ модального окна существа
  showCreatureModal(creatureId, categoryId) {
    const category = creaturesData.categories.find(cat => cat.id === categoryId);
    if (!category) return;
    
    const creature = category.creatures.find(c => c.id === creatureId);
    if (!creature) return;
    
    // Собираем список всех существ для навигации
    this.currentCreatureList = [];
    creaturesData.categories.forEach(cat => {
      cat.creatures.forEach(c => {
        this.currentCreatureList.push({
          creature: c,
          category: cat.id
        });
      });
    });
    
    // Находим индекс текущего существа
    this.currentCreatureIndex = this.currentCreatureList.findIndex(item => 
      item.creature.id === creatureId && item.category === categoryId
    );
    
    // Создаем модальное окно
    this.createCreatureModal(creature, category);
  }

  // Создание модального окна существа
  createCreatureModal(creature, category) {
    const lang = window.currentLang || 'ru';
    const translationsObj = translations[lang] || translations['ru'];
    const creatureName = creature.name[lang] || creature.name.ru;
    
    const modal = document.createElement('div');
    modal.className = 'creature-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      animation: fadeIn 0.3s forwards;
    `;
    
    modal.innerHTML = `
      <div class="creature-modal-content" style="
        background: white;
        border-radius: 20px;
        width: 90%;
        max-width: 900px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        padding: 30px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      ">
        <button class="modal-close-btn" style="
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          z-index: 10;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.3s;
        ">×</button>
        
        <div class="creature-modal-nav" style="
          position: absolute;
          top: 50%;
          width: 100%;
          display: flex;
          justify-content: space-between;
          pointer-events: none;
          z-index: 5;
          padding: 0 20px;
          transform: translateY(-50%);
        ">
          <button class="nav-arrow prev-arrow" ${this.currentCreatureIndex === 0 ? 'disabled' : ''} style="
            pointer-events: all;
            background: white;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: ${this.currentCreatureIndex === 0 ? 'not-allowed' : 'pointer'};
            opacity: ${this.currentCreatureIndex === 0 ? 0.5 : 1};
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-size: 24px;
            color: #333;
            transition: all 0.3s;
          ">←</button>
          
          <button class="nav-arrow next-arrow" ${this.currentCreatureIndex === this.currentCreatureList.length - 1 ? 'disabled' : ''} style="
            pointer-events: all;
            background: white;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: ${this.currentCreatureIndex === this.currentCreatureList.length - 1 ? 'not-allowed' : 'pointer'};
            opacity: ${this.currentCreatureIndex === this.currentCreatureList.length - 1 ? 0.5 : 1};
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-size: 24px;
            color: #333;
            transition: all 0.3s;
          ">→</button>
        </div>
        
        <div class="creature-modal-body">
          <div class="creature-modal-header" style="
            display: flex;
            gap: 20px;
            align-items: center;
            margin-bottom: 30px;
          ">
            <div class="creature-modal-icon" style="
              flex-shrink: 0;
              position: relative;
            ">
              <div class="creature-icon-large" style="
                width: 100px;
                height: 100px;
                background: linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 48px;
              ">${this.getCreatureEmoji(category.id)}</div>
              <div class="creature-type-large" style="
                position: absolute;
                bottom: 0;
                right: 0;
                background: #ff9800;
                color: white;
                padding: 4px 12px;
                border-radius: 15px;
                font-weight: bold;
                font-size: 12px;
              ">${creature.type}</div>
            </div>
            <div class="creature-modal-title" style="flex: 1;">
              <h2 style="font-size: 2rem; margin-bottom: 10px; color: #333;">${creatureName}</h2>
              <div class="creature-region-large" style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <span class="region-badge" style="
                  background: #e3f2fd;
                  color: #1976d2;
                  padding: 4px 12px;
                  border-radius: 15px;
                  font-size: 14px;
                  font-weight: 500;
                ">${category.name}</span>
                <span style="color: #666;">📍 ${creature.region}</span>
              </div>
            </div>
          </div>
          
          <div class="creature-modal-description" style="
            margin-bottom: 30px;
            font-size: 16px;
            line-height: 1.6;
            color: #555;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 12px;
          ">
            <p>${creature.description}</p>
          </div>
          
          <div class="creature-modal-section" style="margin-bottom: 30px;">
            <h3 style="font-size: 1.4rem; margin-bottom: 20px; color: #333;">${translationsObj['date.statsByLevel'] || 'Характеристики по уровням'}</h3>
            <div class="stats-table-container" style="
              overflow-x: auto;
              border-radius: 10px;
              border: 1px solid #eee;
            ">
              <table class="creature-stats-table" style="
                width: 100%;
                border-collapse: collapse;
                min-width: 500px;
              ">
                <thead>
                  <tr style="background: #f8f9fa;">
                    <th style="
                      padding: 12px 15px;
                      text-align: left;
                      font-weight: 600;
                      color: #555;
                      border-bottom: 2px solid #dee2e6;
                    ">${translationsObj['date.level'] || 'Уровень'}</th>
                    <th style="
                      padding: 12px 15px;
                      text-align: left;
                      font-weight: 600;
                      color: #555;
                      border-bottom: 2px solid #dee2e6;
                    ">${translationsObj['date.hp'] || 'HP'}</th>
                    <th style="
                      padding: 12px 15px;
                      text-align: left;
                      font-weight: 600;
                      color: #555;
                      border-bottom: 2px solid #dee2e6;
                    ">${translationsObj['date.attack'] || 'Атака'}</th>
                    <th style="
                      padding: 12px 15px;
                      text-align: left;
                      font-weight: 600;
                      color: #555;
                      border-bottom: 2px solid #dee2e6;
                    ">${translationsObj['date.defense'] || 'Защита'}</th>
                  </tr>
                </thead>
                <tbody>
                  ${creature.stats.hp.map((hp, index) => `
                    <tr style="
                      border-bottom: 1px solid #eee;
                      transition: background 0.2s;
                    " onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
                      <td style="padding: 12px 15px; font-weight: 500; color: #333;">
                        ${index === 0 ? '1' : index === 1 ? '20' : index === 2 ? '40' : index === 3 ? '60' : '80'}
                      </td>
                      <td style="padding: 12px 15px; color: #dc3545; font-weight: 600;">${hp}</td>
                      <td style="padding: 12px 15px; color: #007bff; font-weight: 600;">${creature.stats.attack[index]}</td>
                      <td style="padding: 12px 15px; color: #28a745; font-weight: 600;">${creature.stats.defense[index]}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="creature-modal-section" style="margin-bottom: 30px;">
            <h3 style="font-size: 1.4rem; margin-bottom: 20px; color: #333;">${translationsObj['date.elementalResistances'] || 'Сопротивления элементам'}</h3>
            <div class="resistances-grid" style="
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
              gap: 15px;
            ">
              ${Object.entries(creature.stats.resistances).map(([element, resistance]) => `
                <div class="resistance-item" style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding: 12px 15px;
                  background: #f8f9fa;
                  border-radius: 10px;
                  border: 1px solid #dee2e6;
                ">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span class="element-badge ${element}" style="font-size: 20px;">${this.getElementEmoji(element)}</span>
                    <span style="font-size: 14px; color: #555; text-transform: capitalize;">${element}</span>
                  </div>
                  <span class="resistance-value" style="
                    font-weight: 600;
                    color: ${resistance > 0 ? '#28a745' : resistance < 0 ? '#dc3545' : '#6c757d'};
                  ">${resistance}%</span>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="creature-modal-section" style="margin-bottom: 30px;">
            <h3 style="font-size: 1.4rem; margin-bottom: 20px; color: #333;">${translationsObj['date.drops'] || 'Дроп'}</h3>
            <div class="drops-list" style="
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
            ">
              ${creature.drops.map(drop => `
                <span class="drop-item" style="
                  background: #fff3e0;
                  color: #f57c00;
                  padding: 8px 15px;
                  border-radius: 20px;
                  font-size: 14px;
                  border: 1px solid #ffe0b2;
                ">${drop}</span>
              `).join('')}
            </div>
          </div>
          
          <div class="creature-modal-section">
            <h3 style="font-size: 1.4rem; margin-bottom: 20px; color: #333;">${translationsObj['date.behavior'] || 'Поведение'}</h3>
            <p style="
              color: #555;
              line-height: 1.6;
              padding: 15px;
              background: #f8f9fa;
              border-radius: 10px;
              border-left: 4px solid #ff7e5f;
            ">${creature.behavior}</p>
          </div>
        </div>
        
        <div class="creature-modal-counter" style="
          text-align: center;
          margin-top: 20px;
          color: #888;
          font-size: 14px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        ">
          <span>${this.currentCreatureIndex + 1} / ${this.currentCreatureList.length}</span>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Анимация появления
    setTimeout(() => {
      modal.style.opacity = '1';
    }, 10);
    
    // Обработчики событий (аналогично рыбному модальному окну)
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = '#f5f5f5';
      });
      closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'none';
      });
      closeBtn.addEventListener('click', () => {
        this.closeModal(modal);
      });
    }
    
    // Навигация стрелками
    const prevArrow = modal.querySelector('.prev-arrow');
    const nextArrow = modal.querySelector('.next-arrow');
    
    if (prevArrow && !prevArrow.disabled) {
      prevArrow.addEventListener('mouseenter', () => {
        if (!prevArrow.disabled) prevArrow.style.background = '#f5f5f5';
      });
      prevArrow.addEventListener('mouseleave', () => {
        if (!prevArrow.disabled) prevArrow.style.background = 'white';
      });
      prevArrow.addEventListener('click', () => {
        this.navigateCreature(-1, modal);
      });
    }
    
    if (nextArrow && !nextArrow.disabled) {
      nextArrow.addEventListener('mouseenter', () => {
        if (!nextArrow.disabled) nextArrow.style.background = '#f5f5f5';
      });
      nextArrow.addEventListener('mouseleave', () => {
        if (!nextArrow.disabled) nextArrow.style.background = 'white';
      });
      nextArrow.addEventListener('click', () => {
        this.navigateCreature(1, modal);
      });
    }
    
    // Закрытие по клику вне модального окна
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal(modal);
      }
    });
    
    // Закрытие по Escape и навигация стрелками
    const handleKeyEvents = (e) => {
      if (e.key === 'Escape') {
        this.closeModal(modal);
        document.removeEventListener('keydown', handleKeyEvents);
      } else if (e.key === 'ArrowLeft' && this.currentCreatureIndex > 0) {
        this.navigateCreature(-1, modal);
      } else if (e.key === 'ArrowRight' && this.currentCreatureIndex < this.currentCreatureList.length - 1) {
        this.navigateCreature(1, modal);
      }
    };
    document.addEventListener('keydown', handleKeyEvents);
  }

  // Навигация по существам
  navigateCreature(direction, currentModal) {
    const newIndex = this.currentCreatureIndex + direction;
    if (newIndex < 0 || newIndex >= this.currentCreatureList.length) return;
    
    this.currentCreatureIndex = newIndex;
    const nextCreature = this.currentCreatureList[newIndex];
    const category = creaturesData.categories.find(cat => cat.id === nextCreature.category);
    
    this.closeModal(currentModal);
    setTimeout(() => {
      this.createCreatureModal(nextCreature.creature, category);
    }, 300);
  }

  // ==================== СТРАНИЦА АРТЕФАКТОВ ====================

  // Инициализация страницы артефактов
  initArtifactsPage() {
    const container = document.getElementById('artifacts-content');
    if (!container) return;
    
    setTimeout(() => {
      this.renderArtifactsPage(container);
    }, 100);
  }

  // Рендер страницы артефактов
  renderArtifactsPage(container) {
    const lang = window.currentLang || 'ru';
    const translationsObj = translations[lang] || translations['ru'];
    
    let html = `
      <div class="artifacts-page">
        <div class="page-controls">
          <button class="back-button" id="artifacts-back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span data-i18n="buttons.back">Назад к категориям</span>
          </button>
          
          <div class="page-filters">
            <div class="filter-group">
              <label data-i18n="date.filterByRarity">Фильтр по редкости:</label>
              <select id="artifact-rarity-filter" class="artifact-rarity-select">
                <option value="all" data-i18n="date.allRarities">Все редкости</option>
                <option value="5">★★★★★</option>
                <option value="4">★★★★</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label data-i18n="date.filterBySetBonus">Фильтр по бонусу:</label>
              <select id="bonus-type-filter" class="bonus-type-select">
                <option value="all" data-i18n="date.allBonuses">Все бонусы</option>
                <option value="attack" data-i18n="stats.attack">Атака</option>
                <option value="defense" data-i18n="stats.defense">Защита</option>
                <option value="hp" data-i18n="stats.hp">HP</option>
                <option value="elemental" data-i18n="date.elemental">Элементальный</option>
                <option value="energy" data-i18n="stats.energyRecharge">Восстановление энергии</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="artifacts-sets-container">
    `;

    artifactsData.sets.forEach(artifactSet => {
      const setName = artifactSet.name[lang] || artifactSet.name.ru;
      const rarityNumber = artifactSet.rarity.length;
      
      html += `
        <div class="artifact-set-card" data-set-id="${artifactSet.id}" data-rarity="${rarityNumber}">
          <div class="artifact-set-card-inner">
            <div class="artifact-set-header">
              <div class="artifact-set-icon">
                <span class="artifact-emoji">⭐</span>
                <div class="artifact-rarity">${artifactSet.rarity}</div>
              </div>
              <div class="artifact-set-info">
                <h3 class="artifact-set-name">${setName}</h3>
                <div class="artifact-set-meta">
                  <span class="artifact-set-type">${translationsObj['date.artifactSet'] || 'Набор артефактов'}</span>
                  <span class="artifact-set-pieces">5 <span data-i18n="date.pieces">частей</span></span>
                </div>
              </div>
            </div>
            
            <div class="artifact-set-description">
              <p>${artifactSet.description}</p>
            </div>
            
            <div class="artifact-set-bonuses">
              <div class="bonus-item">
                <span class="bonus-count">2-<span data-i18n="date.piece">частный</span></span>
                <p class="bonus-text">${artifactSet.setBonus['2-piece']}</p>
              </div>
              <div class="bonus-item">
                <span class="bonus-count">4-<span data-i18n="date.piece">частный</span></span>
                <p class="bonus-text">${artifactSet.setBonus['4-piece']}</p>
              </div>
            </div>
            
            <div class="artifact-set-footer">
              <div class="set-pieces-preview">
                ${artifactSet.pieces.map(piece => {
                  const icon = piece.type === 'Цветок жизни' ? '🌸' : 
                              piece.type === 'Перо смерти' ? '🪶' : 
                              piece.type === 'Пески времени' ? '⏳' : 
                              piece.type === 'Кубок пространства' ? '🍷' : '👑';
                  return `<span class="piece-icon" title="${piece.type}">${icon}</span>`;
                }).join('')}
              </div>
              <button class="view-details-btn" data-i18n="buttons.details">
                Подробнее
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;
    
    this.initArtifactsPageFunctionality();
  }

  // Инициализация функционала страницы артефактов
  initArtifactsPageFunctionality() {
    // Кнопка "Назад"
    const backBtn = document.getElementById('artifacts-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        history.pushState({}, '', '#/date');
        showPage('date');
      });
    }
    
    // Карточки артефактов
    this.initArtifactCards();
  }

  // Инициализация карточек артефактов
  initArtifactCards() {
    const artifactCards = document.querySelectorAll('.artifact-set-card');
    artifactCards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.view-details-btn')) {
          const setId = card.getAttribute('data-set-id');
          this.showArtifactModal(setId);
        }
      });
      
      const detailsBtn = card.querySelector('.view-details-btn');
      if (detailsBtn) {
        detailsBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const setId = card.getAttribute('data-set-id');
          this.showArtifactModal(setId);
        });
      }
    });
  }

  // Показ модального окна артефакта
  showArtifactModal(setId) {
    const artifactSet = artifactsData.sets.find(set => set.id === setId);
    if (!artifactSet) return;
    
    this.currentArtifactSet = artifactSet;
    this.currentArtifactPiece = 'flower';
    this.createArtifactModal(artifactSet);
  }

  // Создание модального окна артефакта
  // Замените существующую функцию createArtifactModal на эту:
// Обновленная функция создания модального окна артефакта
  createArtifactModal(artifactSet) {
    const lang = window.currentLang || 'ru';
    const translationsObj = translations[lang] || translations['ru'];
    const setName = artifactSet.name[lang] || artifactSet.name.ru;
    
    this.currentArtifactSet = artifactSet;
    this.currentArtifactPiece = 'flower';
    this.currentMainStatIndex = 0;
    this.currentArtifactLevel = 0;
    this.selectedSubstats = [];
    
    const modal = document.createElement('div');
    modal.className = 'artifact-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      animation: fadeIn 0.3s forwards;
    `;
    
    modal.innerHTML = `
      <div class="artifact-modal-content" style="
        background: white;
        border-radius: 20px;
        width: 95%;
        max-width: 1400px;
        max-height: 95vh;
        overflow: hidden;
        position: relative;
        display: flex;
        flex-direction: column;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      ">
        <!-- Заголовок и кнопка закрытия -->
        <div class="artifact-modal-header" style="
          padding: 20px 30px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        ">
          <div>
            <h2 style="margin: 0; font-size: 1.5rem; font-weight: 600;">${setName}</h2>
            <div style="font-size: 14px; opacity: 0.9; margin-top: 5px;">
              ${artifactSet.rarity || '★★★★★'} • ${translationsObj['date.artifactSet'] || 'Набор артефактов'}
            </div>
          </div>
          <button class="modal-close-btn" style="
            background: rgba(255,255,255,0.2);
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: white;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.3s;
          ">×</button>
        </div>
        
        <!-- Основное содержимое -->
        <div style="display: flex; flex: 1; overflow: hidden;">
          <!-- Левая панель: иконки частей артефакта -->
          <div class="artifact-pieces-sidebar" style="
            width: 70px;
            background: #f8f9fa;
            border-right: 1px solid #eee;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px 0;
          ">
            ${this.createPieceIcons(artifactSet)}
          </div>
          
          <!-- Центральная панель: детали выбранной части -->
          <div class="artifact-piece-details" style="
            flex: 1;
            padding: 30px;
            overflow-y: auto;
            max-height: calc(95vh - 160px);
          ">
            <div id="piece-details-container"></div>
          </div>
        </div>
        
        <!-- Нижняя панель: навигация по сета и управление -->
        <div class="artifact-modal-footer" style="
          padding: 15px 30px;
          border-top: 1px solid #eee;
          background: #f8f9fa;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <!-- Навигация по сета -->
          <div class="artifact-set-nav" style="display: flex; align-items: center; gap: 15px;">
            <button id="prev-artifact-set" class="nav-arrow" style="
              background: #6c757d;
              color: white;
              border: none;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              cursor: pointer;
              font-size: 18px;
              display: flex;
              align-items: center;
              justify-content: center;
            ">←</button>
            
            <div style="text-align: center; min-width: 80px;">
              <div style="font-size: 14px; color: #666; margin-bottom: 2px;">
                ${translationsObj['date.set'] || 'Сет'}
              </div>
              <div style="font-size: 16px; font-weight: 600; color: #333;">
                ${this.currentArtifactSetIndex + 1} / ${artifactsData.sets.length}
              </div>
            </div>
            
            <button id="next-artifact-set" class="nav-arrow" style="
              background: #28a745;
              color: white;
              border: none;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              cursor: pointer;
              font-size: 18px;
              display: flex;
              align-items: center;
              justify-content: center;
            ">→</button>
          </div>
          
          <!-- Информация об уровне -->
          <div style="text-align: center;">
            <div style="font-size: 14px; color: #666; margin-bottom: 2px;">
              ${translationsObj['date.artifactLevel'] || 'Уровень'}
            </div>
            <div style="font-size: 18px; font-weight: 600; color: #2196F3;">
              <span id="current-artifact-level">0</span>/20
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Анимация появления
    setTimeout(() => {
      modal.style.opacity = '1';
    }, 10);
    
    // Инициализация модального окна
    this.initArtifactModal(modal, artifactSet);
  }
// Создание иконок частей артефакта
  createPieceIcons(artifactSet) {
    const pieces = artifactSet.pieces;
    const icons = {
      'flower': '🌸',
      'plume': '🪶', 
      'sands': '⏳',
      'goblet': '🍷',
      'circlet': '👑'
    };
    
    let iconsHTML = '';
    pieces.forEach(piece => {
      const icon = icons[piece.id] || '❓';
      const isActive = this.currentArtifactPiece === piece.id;
      
      iconsHTML += `
        <button class="piece-icon-btn ${isActive ? 'active' : ''}" 
                data-piece="${piece.id}" 
                title="${piece.type}"
                style="
                  background: ${isActive ? '#e3f2fd' : 'transparent'};
                  border: none;
                  width: 50px;
                  height: 50px;
                  border-radius: 10px;
                  cursor: pointer;
                  font-size: 24px;
                  margin-bottom: 10px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  transition: all 0.3s;
                ">
          ${icon}
        </button>
      `;
    });
    
    return iconsHTML;
  }
// Новая функция для инициализации модального окна артефакта
// Инициализация модального окна артефакта
  initArtifactModal(modal, artifactSet) {
    // Загружаем детали первой части
    this.loadPieceDetails(artifactSet, this.currentArtifactPiece);
    
    // Обработчики для иконок частей
    modal.querySelectorAll('.piece-icon-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pieceId = e.target.closest('.piece-icon-btn').dataset.piece;
        
        // Снимаем активный класс
        modal.querySelectorAll('.piece-icon-btn').forEach(b => {
          b.style.background = 'transparent';
        });
        
        // Устанавливаем активный класс
        e.target.closest('.piece-icon-btn').style.background = '#e3f2fd';
        
        // Загружаем детали новой части
        this.currentArtifactPiece = pieceId;
        this.loadPieceDetails(artifactSet, pieceId);
      });
    });
    
    // Обработчики для навигации по сета
    const prevBtn = modal.querySelector('#prev-artifact-set');
    const nextBtn = modal.querySelector('#next-artifact-set');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.navigateArtifactSet(-1, modal);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.navigateArtifactSet(1, modal);
      });
    }
    
    // Обработчик закрытия
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeModal(modal);
      });
    }
    
    // Закрытие по клику вне модального окна
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal(modal);
      }
    });
    
    // Закрытие по Escape
    const closeOnEsc = (e) => {
      if (e.key === 'Escape') {
        this.closeModal(modal);
        document.removeEventListener('keydown', closeOnEsc);
      }
    };
    document.addEventListener('keydown', closeOnEsc);
  }
  // Функция для инициализации радиокнопок частей артефакта
initPieceRadioButtons(modal, artifactSet) {
  const radioGroup = modal.querySelector('.pieces-radio-group');
  if (!radioGroup) return;
  
  const pieces = artifactSet.pieces;
  const lang = window.currentLang || 'ru';
  
  radioGroup.innerHTML = '';
  
  pieces.forEach(piece => {
    const pieceName = piece.name[lang] || piece.name.ru;
    const icon = this.getPieceIcon(piece.type);
    
    const label = document.createElement('label');
    label.className = 'piece-radio-label';
    label.style.cssText = `
      display: flex;
      align-items: center;
      padding: 12px 15px;
      background: ${this.currentArtifactPiece === piece.id ? '#8e2de2' : '#f5f5f5'};
      border: 2px solid ${this.currentArtifactPiece === piece.id ? '#8e2de2' : 'transparent'};
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
      color: ${this.currentArtifactPiece === piece.id ? 'white' : '#666'};
    `;
    
    label.innerHTML = `
      <input type="radio" name="artifact-piece" value="${piece.id}" 
             ${this.currentArtifactPiece === piece.id ? 'checked' : ''} style="display: none;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 20px;">${icon}</span>
        <div>
          <div style="font-weight: 500;">${piece.type}</div>
          <div style="font-size: 12px; opacity: 0.8;">${pieceName}</div>
        </div>
      </div>
    `;
    
    label.addEventListener('click', () => {
      // Сбрасываем индекс главной статы при смене части
      this.currentMainStatIndex = 0;
      
      // Обновляем UI
      modal.querySelectorAll('.piece-radio-label').forEach(l => {
        l.style.background = '#f5f5f5';
        l.style.borderColor = 'transparent';
        l.style.color = '#666';
      });
      label.style.background = '#8e2de2';
      label.style.borderColor = '#8e2de2';
      label.style.color = 'white';
      
      // Загружаем детали выбранной части
      this.currentArtifactPiece = piece.id;
      this.loadPieceDetails(artifactSet, piece.id);
    });
    
    radioGroup.appendChild(label);
  });
}

// Функция для получения иконки части артефакта
getPieceIcon(pieceType) {
  const icons = {
    'Цветок жизни': '🌸',
    'Перо смерти': '🪶',
    'Пески времени': '⏳',
    'Кубок пространства': '🍷',
    'Корона разума': '👑'
  };
  return icons[pieceType] || '❓';
} 

  // Загрузка деталей части артефакта
  // Обновленная функция loadPieceDetails
// Загрузка деталей части артефакта
  loadPieceDetails(artifactSet, pieceId) {
    const piece = artifactSet.pieces.find(p => p.id === pieceId);
    if (!piece) return;
    
    const container = document.querySelector('#piece-details-container');
    if (!container) return;
    
    const lang = window.currentLang || 'ru';
    const translationsObj = translations[lang] || translations['ru'];
    const pieceName = piece.name[lang] || piece.name.ru;
    
    // Определяем возможные главные статы для слота
    const possibleMainStats = this.getPossibleMainStats(pieceId);
    
    let mainStatSection = '';
    if (pieceId === 'flower' || pieceId === 'plume') {
      // Фиксированные главные статы для цветка и пера
      const mainStat = pieceId === 'flower' ? 'hp' : 'atk';
      mainStatSection = this.createFixedMainStatSection(piece, mainStat);
    } else {
      // Выбираемые главные статы для других частей
      mainStatSection = this.createSelectableMainStatSection(piece, possibleMainStats);
    }
    
    // Создаем HTML для деталей
    const html = `
      <div class="piece-details">
        <!-- Заголовок -->
        <div class="piece-header" style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 2px solid #dee2e6;
        ">
          <div>
            <h3 style="font-size: 1.8rem; margin: 0 0 5px 0; color: #333;">${pieceName}</h3>
            <div style="font-size: 14px; color: #666;">${piece.type}</div>
          </div>
          <div style="
            background: #f0f7ff;
            color: #1976d2;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 500;
          ">
            ${artifactSet.rarity}
          </div>
        </div>
        
        <!-- Уровень артефакта -->
        <div class="level-section" style="margin-bottom: 30px;">
          <h4 style="margin-bottom: 15px; color: #333;">
            ${translationsObj['date.artifactLevel'] || 'Уровень артефакта'}
          </h4>
          <div style="display: flex; align-items: center; gap: 20px;">
            <button id="level-minus" style="
              background: #6c757d;
              color: white;
              border: none;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              cursor: pointer;
              font-size: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
            ">-</button>
            
            <div style="flex: 1;">
              <input type="range" id="artifact-level-range" 
                     min="0" max="20" value="${this.currentArtifactLevel}" step="1" 
                     style="width: 100%; height: 6px; border-radius: 3px; background: #e9ecef;">
              <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 12px; color: #666;">
                ${[0, 4, 8, 12, 16, 20].map(lvl => `<span>${lvl}</span>`).join('')}
              </div>
            </div>
            
            <button id="level-plus" style="
              background: #28a745;
              color: white;
              border: none;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              cursor: pointer;
              font-size: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
            ">+</button>
            
            <div style="
              min-width: 60px;
              text-align: center;
              font-size: 1.2rem;
              font-weight: 600;
              color: #333;
            ">
              <span id="current-level-display">${this.currentArtifactLevel}</span>/20
            </div>
          </div>
        </div>
        
        <!-- Главная характеристика -->
        ${mainStatSection}
        
        <!-- Все возможные субстаты -->
        <div class="all-substats-section" style="margin-top: 40px;">
          <h4 style="margin-bottom: 20px; color: #333;">
            ${translationsObj['date.allPossibleSubstats'] || 'Все возможные субхарактеристики'}
          </h4>
          ${this.createAllSubstatsSection(piece)}
        </div>
      </div>
    `;
    
    container.innerHTML = html;
    
    // Инициализация обработчиков
    this.initPieceDetailsHandlers(piece);
  }
  // Создание секции фиксированной главной статы
  createFixedMainStatSection(piece, mainStat) {
    const lang = window.currentLang || 'ru';
    const translationsObj = translations[lang] || translations['ru'];
    const value = this.getMainStatValueDisplay(piece, this.currentArtifactLevel, mainStat);
    
    return `
      <div class="main-stat-section" style="margin-bottom: 30px;">
        <h4 style="margin-bottom: 15px; color: #333;">
          ${translationsObj['date.mainStat'] || 'Основная характеристика'}
        </h4>
        <div style="
          background: #e8f5e9;
          border: 2px solid #4CAF50;
          border-radius: 10px;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <div>
            <div style="font-size: 18px; font-weight: 600; color: #2e7d32;">
              ${getCalculatorStatName(mainStat, lang)}
            </div>
            <div style="font-size: 14px; color: #666; margin-top: 5px;">
              ${translationsObj['date.fixedStat'] || 'Фиксированная характеристика'}
            </div>
          </div>
          <div style="font-size: 24px; font-weight: 700; color: #2196F3;">
            ${value}
          </div>
        </div>
      </div>
    `;
  }

  // Создание секции выбираемой главной статы
  createSelectableMainStatSection(piece, possibleMainStats) {
    const lang = window.currentLang || 'ru';
    const translationsObj = translations[lang] || translations['ru'];
    const mainStats = piece.stats.mainStats || possibleMainStats;
    
    return `
      <div class="main-stat-section" style="margin-bottom: 30px;">
        <h4 style="margin-bottom: 15px; color: #333;">
          ${translationsObj['date.mainStat'] || 'Основная характеристика'}
          <span style="font-size: 14px; color: #666; margin-left: 10px;">
            (${translationsObj['date.selectable'] || 'выбираемая'})
          </span>
        </h4>
        <div class="main-stats-grid" style="
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
        ">
          ${mainStats.map((stat, index) => {
            const isSelected = index === this.currentMainStatIndex;
            const value = this.getMainStatValueDisplay(piece, this.currentArtifactLevel, stat);
            
            return `
              <button class="main-stat-btn ${isSelected ? 'selected' : ''}" 
                      data-index="${index}"
                      data-stat="${stat}"
                      style="
                        padding: 15px;
                        border: 2px solid ${isSelected ? '#2196F3' : '#e0e0e0'};
                        border-radius: 10px;
                        cursor: pointer;
                        background: ${isSelected ? '#e3f2fd' : 'white'};
                        text-align: left;
                        transition: all 0.3s;
                      ">
                <div style="font-weight: 600; color: #333; margin-bottom: 5px;">
                  ${getCalculatorStatName(stat, lang)}
                </div>
                <div style="font-size: 14px; color: #666;">
                  ${translationsObj['date.atLevel'] || 'На уровне'} ${this.currentArtifactLevel}:
                </div>
                <div style="font-size: 20px; font-weight: 700; color: #2196F3; margin-top: 5px;">
                  ${value}
                </div>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // Создание секции всех возможных субстатов
  createAllSubstatsSection(piece) {
    const lang = window.currentLang || 'ru';
    const translationsObj = translations[lang] || translations['ru'];
    
    // Получаем все возможные субстаты из calculator-module
    const allSubstats = Object.keys(substatTiers);
    
    // Группируем субстаты
    const percentageSubstats = allSubstats.filter(stat => stat.includes('%'));
    const flatSubstats = allSubstats.filter(stat => !stat.includes('%'));
    
    let html = `
      <div class="all-substats-container">
        <div style="color: #666; margin-bottom: 20px; font-size: 14px;">
          ${translationsObj['date.substatsHint'] || 'Вы можете посмотреть все возможные значения субхарактеристик для этого слота артефакта.'}
        </div>
    `;
    
    // Процентные субстаты
    if (percentageSubstats.length > 0) {
      html += `
        <div class="substat-category" style="margin-bottom: 25px;">
          <h5 style="color: #555; margin-bottom: 15px; font-size: 16px;">
            ${translationsObj['calculator.percentageSubstats'] || 'Процентные характеристики'}
          </h5>
          <div class="substats-grid" style="
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 15px;
          ">
      `;
      
      percentageSubstats.forEach(stat => {
        const tierData = substatTiers[stat];
        const allTiers = [tierData.base, ...tierData.increments];
        
        html += `
          <div class="substat-card" style="
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            padding: 15px;
            background: white;
          ">
            <div style="font-weight: 600; margin-bottom: 10px; color: #333;">
              ${getCalculatorStatName(stat, lang)}
            </div>
            
            <div style="margin-bottom: 10px;">
              <div style="font-size: 12px; color: #666; margin-bottom: 5px;">
                ${translationsObj['calculator.possibleValues'] || 'Возможные значения тиров'}:
              </div>
              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                ${allTiers.map((value, index) => `
                  <span style="
                    padding: 4px 8px;
                    background: ${index === 0 ? '#f0f8ff' : '#f8f9fa'};
                    border-radius: 4px;
                    font-size: 12px;
                    color: #333;
                  ">
                    Тир ${index + 1}: ${formatSubstatValue(value, stat)}
                  </span>
                `).join('')}
              </div>
            </div>
            
            <div>
              <div style="font-size: 12px; color: #666; margin-bottom: 5px;">
                ${translationsObj['calculator.improvementsAtLevels'] || 'Улучшения на уровнях'}:
              </div>
              <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; font-size: 11px;">
                ${[4, 8, 12, 16, 20].map(level => {
                  const upgrades = Math.floor(level / 4);
                  return `
                    <div style="
                      padding: 3px;
                      text-align: center;
                      background: #e8f5e9;
                      border-radius: 3px;
                      color: #2e7d32;
                    ">
                      Ур. ${level}: +${upgrades}
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
            
            <div style="margin-top: 10px; font-size: 12px; color: #888;">
              ${translationsObj['calculator.totalRange'] || 'Общий диапазон'}: 
              ${getSubstatRangeDisplay(stat)}
            </div>
          </div>
        `;
      });
      
      html += `
          </div>
        </div>
      `;
    }
    
    // Плоские субстаты
    if (flatSubstats.length > 0) {
      html += `
        <div class="substat-category">
          <h5 style="color: #555; margin-bottom: 15px; font-size: 16px;">
            ${translationsObj['calculator.flatSubstats'] || 'Плоские характеристики'}
          </h5>
          <div class="substats-grid" style="
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 15px;
          ">
      `;
      
      flatSubstats.forEach(stat => {
        const tierData = substatTiers[stat];
        const allTiers = [tierData.base, ...tierData.increments];
        
        html += `
          <div class="substat-card" style="
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            padding: 15px;
            background: white;
          ">
            <div style="font-weight: 600; margin-bottom: 10px; color: #333;">
              ${getCalculatorStatName(stat, lang)}
            </div>
            
            <div style="margin-bottom: 10px;">
              <div style="font-size: 12px; color: #666; margin-bottom: 5px;">
                ${translationsObj['calculator.possibleValues'] || 'Возможные значения тиров'}:
              </div>
              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                ${allTiers.map((value, index) => `
                  <span style="
                    padding: 4px 8px;
                    background: ${index === 0 ? '#f0f8ff' : '#f8f9fa'};
                    border-radius: 4px;
                    font-size: 12px;
                    color: #333;
                  ">
                    Тир ${index + 1}: ${formatSubstatValue(value, stat)}
                  </span>
                `).join('')}
              </div>
            </div>
            
            <div>
              <div style="font-size: 12px; color: #666; margin-bottom: 5px;">
                ${translationsObj['calculator.improvementsAtLevels'] || 'Улучшения на уровнях'}:
              </div>
              <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; font-size: 11px;">
                ${[4, 8, 12, 16, 20].map(level => {
                  const upgrades = Math.floor(level / 4);
                  return `
                    <div style="
                      padding: 3px;
                      text-align: center;
                      background: #e8f5e9;
                      border-radius: 3px;
                      color: #2e7d32;
                    ">
                      Ур. ${level}: +${upgrades}
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
            
            <div style="margin-top: 10px; font-size: 12px; color: #888;">
              ${translationsObj['calculator.totalRange'] || 'Общий диапазон'}: 
              ${getSubstatRangeDisplay(stat)}
            </div>
          </div>
        `;
      });
      
      html += `
          </div>
        </div>
      `;
    }
    
    html += `</div>`;
    return html;
  }

  // Инициализация обработчиков для деталей части
  initPieceDetailsHandlers(piece) {
    // Обработчики уровня
    const levelMinus = document.getElementById('level-minus');
    const levelPlus = document.getElementById('level-plus');
    const levelRange = document.getElementById('artifact-level-range');
    const levelDisplay = document.getElementById('current-level-display');
    const globalLevelDisplay = document.getElementById('current-artifact-level');
    
    const updateLevel = () => {
      this.currentArtifactLevel = parseInt(levelRange.value) || 0;
      levelDisplay.textContent = this.currentArtifactLevel;
      if (globalLevelDisplay) {
        globalLevelDisplay.textContent = this.currentArtifactLevel;
      }
      
      // Обновляем отображение главной статы
      this.updateMainStatDisplay(piece);
    };
    
    if (levelMinus) {
      levelMinus.addEventListener('click', () => {
        const newLevel = Math.max(0, this.currentArtifactLevel - 1);
        if (levelRange) levelRange.value = newLevel;
        updateLevel();
      });
    }
    
    if (levelPlus) {
      levelPlus.addEventListener('click', () => {
        const newLevel = Math.min(20, this.currentArtifactLevel + 1);
        if (levelRange) levelRange.value = newLevel;
        updateLevel();
      });
    }
    
    if (levelRange) {
      levelRange.addEventListener('input', updateLevel);
    }
    
    // Обработчики для выбираемых главных статов
    const mainStatButtons = document.querySelectorAll('.main-stat-btn');
    mainStatButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        this.currentMainStatIndex = index;
        
        // Обновляем UI
        mainStatButtons.forEach(b => {
          b.style.borderColor = '#e0e0e0';
          b.style.background = 'white';
        });
        e.currentTarget.style.borderColor = '#2196F3';
        e.currentTarget.style.background = '#e3f2fd';
        
        // Обновляем отображение значения
        this.updateMainStatDisplay(piece);
      });
    });
  }
  // Обновление отображения главной статы
  updateMainStatDisplay(piece) {
    const mainStatValueElements = document.querySelectorAll('.main-stat-value');
    const currentMainStat = this.getCurrentMainStat(piece);
    const value = this.getMainStatValueDisplay(piece, this.currentArtifactLevel, currentMainStat);
    
    mainStatValueElements.forEach(element => {
      element.textContent = value;
    });
  }

  // Получение текущей главной статы
  getCurrentMainStat(piece) {
    if (this.currentArtifactPiece === 'flower') return 'hp';
    if (this.currentArtifactPiece === 'plume') return 'atk';
    
    const mainStats = piece.stats.mainStats || this.getPossibleMainStats(this.currentArtifactPiece);
    return mainStats[this.currentMainStatIndex] || mainStats[0];
  }

  // Получение отображаемого значения главной статы
  getMainStatValueDisplay(piece, level, mainStat) {
    const slot = this.currentArtifactPiece;
    const slotData = artifactsData.mainStatLevels[slot];
    
    if (!slotData) return '0';
    
    if (slot === 'flower' || slot === 'plume') {
      const statKey = slot === 'flower' ? 'hp' : 'atk';
      const values = slotData[statKey];
      if (!values) return '0';
      
      const artifactLevels = artifactsData.artifactLevels;
      let nearestLevel = 0;
      for (let i = 0; i < artifactLevels.length; i++) {
        if (level >= artifactLevels[i]) {
          nearestLevel = artifactLevels[i];
        } else {
          break;
        }
      }
      
      const value = values[nearestLevel] || values[0] || 0;
      return slot === 'flower' ? `${value} HP` : `${value} ATK`;
    } else {
      const statData = slotData[mainStat];
      if (!statData) return '0';
      
      const artifactLevels = artifactsData.artifactLevels;
      let nearestLevel = 0;
      for (let i = 0; i < artifactLevels.length; i++) {
        if (level >= artifactLevels[i]) {
          nearestLevel = artifactLevels[i];
        } else {
          break;
        }
      }
      
      const value = statData[nearestLevel] || statData[0] || 0;
      return `${value}%`;
    }
  }

  // Получение возможных главных статов для слота
  getPossibleMainStats(slot) {
    switch(slot) {
      case 'flower':
        return ['hp'];
      case 'plume':
        return ['atk'];
      case 'sands':
        return ['hp%', 'atk%', 'def%', 'em', 'er%'];
      case 'goblet':
        return ['hp%', 'atk%', 'def%', 'em', 'pyro%', 'hydro%', 'electro%', 'cryo%', 'anemo%', 'geo%', 'dendro%', 'physical%'];
      case 'circlet':
        return ['hp%', 'atk%', 'def%', 'em', 'critRate%', 'critDmg%', 'healing%'];
      default:
        return [];
    }
  }

  // Навигация по сета артефактов
  navigateArtifactSet(direction, currentModal) {
    const sets = artifactsData.sets;
    const newIndex = this.currentArtifactSetIndex + direction;
    
    if (newIndex < 0 || newIndex >= sets.length) return;
    
    this.currentArtifactSetIndex = newIndex;
    const nextSet = sets[newIndex];
    
    // Закрываем текущее модальное окно
    this.closeModal(currentModal);
    
    // Открываем модальное окно с новым сетом
    setTimeout(() => {
      this.createArtifactModal(nextSet);
    }, 300);
  }

  // Закрытие модального окна
  closeModal(modal) {
    modal.style.animation = 'fadeOut 0.3s forwards';
    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    }, 300);
  }
// Функция для получения значения главной характеристики
getMainStatValue(piece, level, statName = null) {
  const slot = piece.id;
  
  if (slot === 'flower' || slot === 'plume') {
    // Фиксированные статы для цветка и пера
    const levels = artifactsData.mainStatLevels[slot];
    if (!levels) return '0';
    
    // Находим ближайший уровень
    const artifactLevels = artifactsData.artifactLevels;
    let nearestLevel = 0;
    for (let i = 0; i < artifactLevels.length; i++) {
      if (level >= artifactLevels[i]) {
        nearestLevel = artifactLevels[i];
      } else {
        break;
      }
    }
    
    const value = levels[nearestLevel] || levels[0] || 0;
    return slot === 'flower' ? `${value} HP` : `${value} ATK`;
  } else {
    // Процентные статы для других частей
    const slotData = artifactsData.mainStatLevels[slot];
    if (!slotData) return '0';
    
    const statKey = statName || piece.stats.mainStats[0];
    const statData = slotData[statKey];
    if (!statData) return '0';
    
    // Находим ближайший уровень
    const artifactLevels = artifactsData.artifactLevels;
    let nearestLevel = 0;
    for (let i = 0; i < artifactLevels.length; i++) {
      if (level >= artifactLevels[i]) {
        nearestLevel = artifactLevels[i];
      } else {
        break;
      }
    }
    
    const value = statData[nearestLevel] || statData[0] || 0;
    return `${value}%`;
  }
}

// Функция для инициализации субстатов
initSubstats(modal) {
  const container = modal.querySelector('#artifact-substats-container .substats-grid');
  if (!container) return;
  
  const lang = window.currentLang || 'ru';
  const translationsObj = translations[lang] || translations['ru'];
  
  // Инициализируем массив субстатов (4 слота)
  if (!this.currentSubstats) {
    this.currentSubstats = [
      { type: 'atk%', level: 0 },
      { type: 'critRate%', level: 0 },
      { type: 'critDmg%', level: 0 },
      { type: 'er%', level: 0 }
    ];
  }
  
  container.innerHTML = '';
  
  this.currentSubstats.forEach((substat, index) => {
    const substatElement = this.createSubstatElement(substat, index);
    container.appendChild(substatElement);
  });
}

// Функция для создания элемента субстата
createSubstatElement(substat, index) {
  const lang = window.currentLang || 'ru';
  const translationsObj = translations[lang] || translations['ru'];
  
  const div = document.createElement('div');
  div.className = 'substat-item';
  div.style.cssText = `
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 10px;
    padding: 15px;
  `;
  
  // Получаем информацию о субстате
  const substatInfo = artifactsData.substatValues[substat.type];
  const baseValue = substatInfo?.base || 0;
  const increments = substatInfo?.increments || [];
  const maxUpgrades = substatInfo?.maxUpgrades || 4;
  
  // Вычисляем текущее значение
  const currentValue = baseValue + (increments[substat.level] || 0);
  
  div.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
      <h4 style="font-size: 14px; color: #333; font-weight: 500;">${this.getSubstatName(substat.type)}</h4>
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 12px; color: #666;">${translationsObj['date.upgradeLevel'] || 'Уровень'}:</span>
        <span style="font-size: 16px; font-weight: 600; color: #333;">${substat.level}/${maxUpgrades}</span>
      </div>
    </div>
    
    <div style="
      font-size: 1.2rem;
      font-weight: 600;
      color: #8e2de2;
      text-align: center;
      margin-bottom: 20px;
    " id="substat-value-${index}">
      ${substat.type.includes('%') ? `${currentValue.toFixed(1)}%` : Math.round(currentValue)}
    </div>
    
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
      <button class="substat-level-minus" data-index="${index}" style="
        background: #6c757d;
        color: white;
        border: none;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      ">-</button>
      
      <div style="flex: 1;">
        <input type="range" class="substat-level-range" data-index="${index}" 
               min="0" max="${maxUpgrades}" value="${substat.level}" step="1" style="
          width: 100%;
          height: 4px;
          border-radius: 2px;
          background: #e9ecef;
          outline: none;
        ">
      </div>
      
      <button class="substat-level-plus" data-index="${index}" style="
        background: #28a745;
        color: white;
        border: none;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      ">+</button>
    </div>
    
    <!-- Выбор типа субстата -->
    <div style="margin-top: 15px;">
      <select class="substat-type-select" data-index="${index}" style="
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #dee2e6;
        border-radius: 6px;
        font-size: 14px;
        color: #333;
        background: white;
      ">
        <option value="">${translationsObj['date.selectSubstat'] || 'Выберите характеристику'}</option>
        ${Object.keys(artifactsData.substatValues).map(key => `
          <option value="${key}" ${substat.type === key ? 'selected' : ''}>
            ${this.getSubstatName(key)}
          </option>
        `).join('')}
      </select>
    </div>
  `;
  
  // Добавляем обработчики событий
  const minusBtn = div.querySelector('.substat-level-minus');
  const plusBtn = div.querySelector('.substat-level-plus');
  const rangeInput = div.querySelector('.substat-level-range');
  const typeSelect = div.querySelector('.substat-type-select');
  
  const updateSubstatValue = () => {
    const level = parseInt(rangeInput.value) || 0;
    const type = typeSelect.value;
    
    if (type && artifactsData.substatValues[type]) {
      const substatInfo = artifactsData.substatValues[type];
      const baseValue = substatInfo.base;
      const increments = substatInfo.increments;
      const currentValue = baseValue + (increments[level] || 0);
      
      const valueDisplay = div.querySelector(`#substat-value-${index}`);
      if (valueDisplay) {
        valueDisplay.textContent = type.includes('%') ? 
          `${currentValue.toFixed(1)}%` : 
          Math.round(currentValue);
      }
      
      // Обновляем данные
      this.currentSubstats[index].type = type;
      this.currentSubstats[index].level = level;
    }
  };
  
  minusBtn.addEventListener('click', () => {
    const newLevel = Math.max(0, (parseInt(rangeInput.value) || 0) - 1);
    rangeInput.value = newLevel;
    updateSubstatValue();
  });
  
  plusBtn.addEventListener('click', () => {
    const maxUpgrades = artifactsData.substatValues[this.currentSubstats[index].type]?.maxUpgrades || 4;
    const newLevel = Math.min(maxUpgrades, (parseInt(rangeInput.value) || 0) + 1);
    rangeInput.value = newLevel;
    updateSubstatValue();
  });
  
  rangeInput.addEventListener('input', updateSubstatValue);
  typeSelect.addEventListener('change', updateSubstatValue);
  
  return div;
}

// Функция для получения имени субстата
getSubstatName(substatKey) {
  const names = {
    'hp%': 'HP%',
    'atk%': 'ATK%',
    'def%': 'DEF%',
    'er%': 'Восст. энергии%',
    'em': 'Мастерство стихий',
    'critRate%': 'Крит. шанс%',
    'critDmg%': 'Крит. урон%',
    'hp': 'HP',
    'atk': 'ATK',
    'def': 'DEF'
  };
  return names[substatKey] || substatKey;
}

// Функция для обновления значений субстатов
updateSubstatsValues() {
  if (!this.currentSubstats) return;
  
  this.currentSubstats.forEach((substat, index) => {
    const valueDisplay = document.querySelector(`#substat-value-${index}`);
    if (valueDisplay && artifactsData.substatValues[substat.type]) {
      const substatInfo = artifactsData.substatValues[substat.type];
      const baseValue = substatInfo.base;
      const increments = substatInfo.increments;
      const currentValue = baseValue + (increments[substat.level] || 0);
      
      valueDisplay.textContent = substat.type.includes('%') ? 
        `${currentValue.toFixed(1)}%` : 
        Math.round(currentValue);
    }
  });
}

// Функция для обновления главной характеристики
updateMainStatValue() {
  const valueDisplay = document.querySelector('#main-stat-value');
  if (!valueDisplay || !this.currentArtifactSet) return;
  
  const piece = this.currentArtifactSet.pieces.find(p => p.id === this.currentArtifactPiece);
  if (!piece) return;
  
  const isFlowerOrPlume = this.currentArtifactPiece === 'flower' || this.currentArtifactPiece === 'plume';
  
  if (isFlowerOrPlume) {
    valueDisplay.textContent = this.getMainStatValue(piece, this.currentArtifactLevel);
  } else {
    const mainStats = piece.stats.mainStats || [];
    const stat = mainStats[this.currentMainStatIndex] || mainStats[0];
    valueDisplay.textContent = this.getMainStatValue(piece, this.currentArtifactLevel, stat);
  }
}

// Функция для навигации по сета артефактов
navigateArtifactSet(direction, currentModal) {
  const sets = artifactsData.sets;
  const newIndex = this.currentArtifactSetIndex + direction;
  
  if (newIndex < 0 || newIndex >= sets.length) return;
  
  this.currentArtifactSetIndex = newIndex;
  const nextSet = sets[newIndex];
  
  // Закрываем текущее модальное окно
  this.closeModal(currentModal);
  
  // Открываем модальное окно с новым сетом
  setTimeout(() => {
    this.createArtifactModal(nextSet);
  }, 300);
}

  // ==================== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ====================

  // Получение общего количества рыб
  getTotalFishCount() {
    return fishingData.categories.reduce((total, category) => {
      return total + category.fishes.length;
    }, 0);
  }

  // Вспомогательная функция для эмодзи существ
  getCreatureEmoji(categoryId) {
    const emojis = {
      'hilichurls': '👹',
      'slimes': '💧',
      'whooperflowers': '🌺',
      'specters': '👻',
      'abyss': '🌌',
      'fatui': '🎭'
    };
    return emojis[categoryId] || '👾';
  }

  // Вспомогательная функция для эмодзи элементов
  getElementEmoji(element) {
    const emojis = {
      pyro: '🔥',
      hydro: '💧',
      electro: '⚡',
      cryo: '❄️',
      anemo: '🌪️',
      geo: '🪨',
      dendro: '🍃',
      physical: '⚔️'
    };
    return emojis[element] || '❓';
  }

  // Закрытие модального окна
  closeModal(modal) {
    modal.style.animation = 'fadeOut 0.3s forwards';
    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    }, 300);
  }
}

// Экспортируем менеджер
export const dateManager = new DateManager();

// Делаем доступным глобально для вызова из app.js
window.dateManager = dateManager;