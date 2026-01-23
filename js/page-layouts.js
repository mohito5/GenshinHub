// page-layouts.js
export const pageLayouts = {
  home: `
    <section class="page home">
      <article>
        <div class="title">
          <h1 data-i18n="pages.home.title"></h1>
          <p data-i18n="pages.home.welcome"></p>
        </div>
        <h2 data-i18n="birthdays.imageAlt"></h2>
        <div class="birthday-banner">
          <img id="birthday-image" src="" alt="" class="banner-image">
          <div class="calendar-wrapper">
            <div id="birthday-announcement"></div>
            <div id="mini-calendar"></div> <!-- Здесь будет календарь -->
          </div>
        </div>
      </article>
      <!-- Таймер серверов -->
      <section>
        <div class="server-timer-header">
          <h2 data-i18n="serverTimer.title">Время сброса серверов</h2>
          <!-- Внутренний контейнер для часового пояса и чекбокса -->
          <div class="header-content">
            <div class="user-timezone-display">
              <!-- Сюда будет вставлен текст через JS -->
            </div>
            <!-- Чекбокс -->
            <div class="timezone-switch-container">
              <label class="timezone-switch">
                <input type="checkbox" id="show-server-time">
                <span data-i18n="serverTimer.showServerTime">Показать серверное время</span>
              </label>
            </div>
          </div>
        </div>
        <!-- Контейнер для таймеров серверов -->
        <div id="server-timer-container"></div>
      </section>
    </section>
  `,
  characters: `
    <div class="page characters">
    <h1 data-i18n="pages.characters.title"></h1>
    <section class="characters-cards-container">
      <!-- Карточки персонажей будут загружены динамически -->
    </section>
  </div>
  `,
  'characters/mat': `
    <div class="character-detail-page">
      <div id="character-content">
        <section class="characters">
          <div id="char-icon"></div>
          <h1 id="char-name">???</h1>
        </section>
        
        <section class="level">
          <article>
            <h2 data-i18n="character.level">Уровень</h2>
            <h2 id="lvl">?</h2>
          </article>
          <div class="materials-container" data-type="level"></div>
        </section>
        
        <section class="mat-attack">
          <article>
            <h2 data-i18n="character.attack">Базовая атака</h2>
            <h2 id="lvl-attack">???</h2>
          </article>
          <div class="materials-container" data-type="attack"></div>
        </section>
        
        <section class="mat-skill">
          <article>
            <h2 data-i18n="character.skill">Элементальный навык</h2>
            <h2 id="lvl-skill">???</h2>
          </article>
          <div class="materials-container" data-type="skill"></div>
        </section>
        
        <section class="mat-explosion">
          <article>
            <h2 data-i18n="character.explosion">Взрыв стихии</h2>
            <h2 id="lvl-explosion">???</h2>
          </article>
          <div class="materials-container" data-type="explosion"></div>
        </section>
        
        <section class="all">
          <article>
            <h2 data-i18n="character.allMaterials">Все материалы</h2>
          </article>
          <div class="materials-container" data-type="all"></div>
        </section>
      </div>
    </div>
  `,
  'characters/info': `
    <div class="character-detail-page">
      <div id="character-content">
        <section class="characters br-drk">
          <div id="char-icon"></div>
          <h5 data-i18n="character.info">Информация о персонаже</h5>
          <h1 id="char-name">???</h1>
        </section>
        <section class="character-description">
          <p id="char-description">???</p>
        </section>
        
        <!-- Основная информация -->
        <section class="character-basic-info">
          <div class="info-card">
            <h3 data-i18n="character.element">Стихия</h3>
            <p id="char-element">???</p>
          </div>
          <div class="info-card">
            <h3 data-i18n="character.weapon">Оружие</h3>
            <p id="char-weapon">???</p>
          </div>
          <div class="info-card">
            <h3 data-i18n="character.rarity">Редкость</h3>
            <p id="char-rarity">???</p>
          </div>
        </section>
        
        <!-- Статистика персонажа -->
        <div class="stats br-drk br-r4 pad-2">
          <h2 data-i18n="character.stats">Характеристики</h2>
          <div class="range">
            <button id="minus" data-i18n-title="character.decreaseLevel">
              <svg alt="-" data-i18n-alt="character.decreaseLevel"><use href="#icon-minus"></use></svg>
            </button>
            <input type="range" id="range" min="0" max="60" value="0" step="10" data-i18n-title="character.levelSlider">
            <span id="out">0</span>
            <button id="plus" data-i18n-title="character.increaseLevel">
              <svg alt="+" data-i18n-alt="character.increaseLevel"><use href="#icon-plus"></use></svg>
            </button>
          </div>
          <div class="current-level">
            <span data-i18n="character.level">Уровень:</span>
            <span id="lvl">1</span>
          </div>
          <div class="basic">
            <h3 data-i18n="character.basicStats">Базовые характеристики</h3>
            <div class="stat-row">
              <div class="stat-icon">
                <p>HP</p>
              </div>
              <p id="hp_1">???</p>
            </div>
            <div class="stat-row">
              <div class="stat-icon">
                <p data-i18n="character.attack">ATK</p>
              </div>
              <p id="char-atk">???</p>
            </div>
            <div class="stat-row">
              <div class="stat-icon">
                <p data-i18n="character.defense">DEF</p>
              </div>
              <p id="char-def">???</p>
            </div>
            <!-- Характеристика при возвышении -->
            <h3 data-i18n="character.basicStats">Базовые характеристики</h3>
            <div class="stat-row">
              <div class="stat-icon">
                <p data-i18n="character.defense">DEF</p>
              </div>
              <p id="char-def">???</p>
            </div>
          </div>
        </div>
        
        <!-- Таланты -->
        <div class="talents-section">
          <h2 data-i18n="character.talents">Таланты</h2>
          
          <!-- Обычная атака -->
          <div class="talent-card br-drk br-r4 pad-2">
            <div class="talent-header">
              <div id="char-s1" class="talent-icon">⚔️</div>
              <div class="talent-info">
                <h4 data-i18n="character.normalAttack">Обычная атака</h4>
                <h3 id="char-atack-name">???</h3>
              </div>
            </div>
            
            <div class="talent-description">
              <p id="des-attack">???</p>
            </div>
            <div class="talent-controls">
              <button id="attack-minus" data-i18n-title="character.decreaseLevel">
                <img src="./assets/minus.svg" alt="-" data-i18n-alt="character.decreaseLevel">
              </button>
              <button id="attack-plus" data-i18n-title="character.increaseLevel">
                <img src="./assets/plus.svg" alt="+" data-i18n-alt="character.increaseLevel">
              </button>
              <input type="range" id="level-attack" min="1" max="10" value="1" class="talent-slider" data-i18n-title="character.talentLevel">
              <span class="talent-level" id="attack-level">1</span>
              </div>
            <div class="talent-stats" id="attack-stats-container"></div>
          </div>
          
          <!-- Элементальный навык -->
          <div class="talent-card br-drk br-r4 pad-2">
            <div class="talent-header">
              <div id="char-s2" class="talent-icon">🌀</div>
              <div class="talent-info">
                <h4 data-i18n="character.elementalSkill">Элементальный навык</h4>
                <h3 id="char-skill-name">???</h3>
              </div>
            </div>
            <div class="talent-description">
              <p id="des-skill">???</p>
            </div>
            <div class="talent-controls">
              <button id="attack-minus" data-i18n-title="character.decreaseLevel">
                <img src="./assets/minus.svg" alt="-" data-i18n-alt="character.decreaseLevel">
              </button>
              <button id="attack-plus" data-i18n-title="character.increaseLevel">
                <img src="./assets/plus.svg" alt="+" data-i18n-alt="character.increaseLevel">
              </button>
              <input type="range" id="level-attack" min="1" max="10" value="1" class="talent-slider" data-i18n-title="character.talentLevel">
              <span class="talent-level" id="skill-level">1</span>
            </div>
            <div class="talent-stats" id="skill-stats-container"></div>
          </div>
          
          <!-- Взрыв стихии -->
          <div class="talent-card br-drk br-r4">
            <div class="talent-header">
              <div id="char-s3" class="talent-icon">💥</div>
              <div class="talent-info">
                <h3 data-i18n="character.elementalBurst">Взрыв стихии</h3>
                <h4 id="char-burst-name">???</h4>
              </div>
            </div>
            <div class="talent-controls">
              <button class="arrow left" data-i18n-title="character.decreaseLevel">&lt;</button>
              <span class="talent-level" id="burst-level">1</span>
              <button class="arrow right" data-i18n-title="character.increaseLevel">&gt;</button>
            </div>
            <div class="talent-description">
              <p id="des-burst">???</p>
            </div>
          </div>
        </div>
        
        <!-- Созвездия -->
        <div class="constellations-section">
          <h2 data-i18n="character.constellations">Созвездия</h2>
          <div class="constellations-grid br-drk br-r4 pad-2" id="constellations-container">
            <!-- Созвездия будут загружены динамически -->
          </div>
        </div>
      </div>
    </div>
  `,
  'characters/guide': `
    <div class="character-guide-page">
      <h1 data-i18n="character.guide">Гайд по персонажу</h1>
      <div id="guide-content">
        <section class="characters">
          <div id="guide-icon"></div>
          <h1 id="guide-name">???</h1>
        </section>
        <section class="guide-section">
          <h2 data-i18n="character.builds">Билды</h2>
          <p data-i18n="common.comingSoon">Скоро...</p>
        </section>
      </div>
    </div>
  `,
  weapon: `
    <div class="page weapon">
      <h1 data-i18n="pages.weapon.title">Оружие</h1>
      <div class="weapons-cards-container"></div>
    </div>
  `,
  
  'weapon/mat': `
    <div class="page weapon-materials">
      <h1 data-i18n="materials.title">Материалы для прокачки оружия</h1>
      
      <div id="weapon-content">
        <section class="weapons">
          <div id="weapon-icon"></div>
          <h1 id="weapon-name">???</h1>
          <div class="weapon-meta">
            <span class="weapon-rarity-display" id="weapon-rarity">★★★★★</span>
            <span class="weapon-type-display" id="weapon-type">Тип</span>
          </div>
        </section>
        
        <section class="weapon-level">
          <article>
            <h2 data-i18n="character.level">Уровень оружия</h2>
            <div class="level-controls">
              <div class="current-level-display">
                <span id="weapon-level-value">1</span>
                <span>/90</span>
              </div>
              <div class="range-control">
                <button id="weapon-minus-range" data-i18n-title="character.decreaseLevel">
                  <img src="./assets/minus.svg" alt="-" data-i18n-alt="character.decreaseLevel">
                </button>
                <input type="range" id="weapon-range" min="0" max="70" value="0" step="10" 
                       data-i18n-title="character.levelSlider">
                <span id="weapon-range-value">0</span>
                <button id="weapon-plus-range" data-i18n-title="character.increaseLevel">
                  <img src="./assets/plus.svg" alt="+" data-i18n-alt="character.increaseLevel">
                </button>
              </div>
            </div>
          </article>
          <div class="materials-container" data-type="weapon-level"></div>
        </section>
        
        <section class="weapon-refinement-section">
          <article>
            <h2 data-i18n="weapon.refinementLevel">Уровень пробуждения</h2>
            <div class="refinement-controls">
              <button id="refinement-minus" data-i18n-title="character.decreaseLevel">
                <img src="./assets/minus.svg" alt="-" data-i18n-alt="character.decreaseLevel">
              </button>
              <div class="refinement-level-display">
                <span id="refinement-level">1</span>
                <span>/5</span>
              </div>
              <button id="refinement-plus" data-i18n-title="character.increaseLevel">
                <img src="./assets/plus.svg" alt="+" data-i18n-alt="character.increaseLevel">
              </button>
            </div>
            <div class="refinement-description">
              <p id="current-refinement-desc">Описание пробуждения уровня 1</p>
            </div>
          </article>
          <div class="materials-container" data-type="weapon-refinement"></div>
        </section>
        
        <section class="weapon-all-materials">
          <article>
            <h2 data-i18n="character.allMaterials">Все материалы</h2>
          </article>
          <div class="materials-container" data-type="weapon-all"></div>
        </section>
        
        <!-- Контейнер для кнопок сохранения -->
        <div class="weapon-save-container" id="weapon-save-container">
          <!-- Кнопки будут добавлены динамически -->
        </div>
      </div>
    </div>
  `,
  
  'weapon/info': `
    <div class="page weapon-info">
      
      <div id="weapon-info-content">
        <section class="weapon-header br-drk br-r4 pad-2">
          <div id="weapon-info-icon"></div>
          <div class="weapon-header-info">
            <h5 data-i18n="character.info">Информация об оружии</h5>
            <h1 id="weapon-info-name">???</h1>
            <div class="weapon-header-meta">
              <span class="weapon-info-rarity" id="weapon-info-rarity">★★★★★</span>
              <span class="weapon-info-type" id="weapon-info-type">Тип оружия</span>
              <span class="weapon-info-stat" id="weapon-info-main-stat">Основная характеристика</span>
            </div>
          </div>
        </section>
        
        <section class="weapon-description br-drk br-r4 pad-2">
          <h2 data-i18n="character.description">Описание</h2>
          <p id="weapon-info-description">???</p>
        </section>
        
        <section class="weapon-stats br-drk br-r4 pad-2">
          <h2 data-i18n="character.stats">Характеристики</h2>
          
          <div class="stats-level-control br-drk br-r4 pad-2">
            <div class="stats-level-display">
              <span data-i18n="character.level">Уровень:</span>
              <span id="stats-weapon-level">1</span>
            </div>
            <div class="stats-range-control">
              <button id="stats-minus" data-i18n-title="character.decreaseLevel">
                <img src="./assets/minus.svg" alt="-" data-i18n-alt="character.decreaseLevel">
              </button>
              <input type="range" id="stats-range" min="0" max="70" value="0" step="10" 
                     data-i18n-title="character.levelSlider">
              <span id="stats-range-value">0</span>
              <button id="stats-plus" data-i18n-title="character.increaseLevel">
                <img src="./assets/plus.svg" alt="+" data-i18n-alt="character.increaseLevel">
              </button>
            </div>
          </div>
          
          <div class="weapon-stats-display">
            <div class="stat-item">
              <span class="stat-label" data-i18n="character.attack">Базовая атака:</span>
              <span class="stat-value" id="weapon-base-attack">???</span>
            </div>
            <div class="stat-item">
              <span class="stat-label" id="weapon-secondary-stat-label">Вторичная характеристика:</span>
              <span class="stat-value" id="weapon-secondary-stat">???</span>
            </div>
          </div>
          
          <div class="stats-table-container">
            <h3 data-i18n="weapon.statsTable">Таблица характеристик по уровням</h3>
            <div class="stats-table-scroll">
              <table class="stats-table" id="weapon-stats-table">
                <thead>
                  <tr>
                    <th data-i18n="character.level">Уровень</th>
                    <th data-i18n="character.attack">Базовая атака</th>
                    <th data-i18n="weapon.secondaryStat">Вторичная хар-ка</th>
                  </tr>
                </thead>
                <tbody id="weapon-stats-table-body">
                  <!-- Таблица будет заполнена динамически -->
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        <section class="weapon-passive br-drk br-r4 pad-2">
          <h2 data-i18n="weapon.passiveAbility">Пассивная способность</h2>
          
          <div class="passive-name-container br-drk br-r4 pad-2">
            <h3 id="weapon-passive-name">???</h3>
            <div class="refinement-selector">
              <span data-i18n="weapon.refinement">Пробуждение:</span>
              <div class="refinement-dots">
                ${Array.from({length: 5}, (_, i) => `
                  <button class="refinement-dot ${i === 0 ? 'active' : ''}" 
                          data-refinement="${i + 1}"
                          data-i18n-title="weapon.refinementLevel">
                    ${i + 1}
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
          
          <div class="passive-description">
            <p id="weapon-passive-description">???</p>
          </div>
          
          <div class="refinement-comparison">
            <h4 data-i18n="weapon.refinementLevels">Уровни пробуждения:</h4>
            <div class="refinement-levels" id="refinement-levels-container">
              <!-- Уровни пробуждения будут заполнены динамически -->
            </div>
          </div>
        </section>
        
        <section class="weapon-ascension">
          <h2 data-i18n="categories.ascension">Материалы возвышения</h2>
          <div class="ascension-stages" id="ascension-stages-container">
            <!-- Стадии возвышения будут заполнены динамически -->
          </div>
        </section>
      </div>
    </div>
  `,
  
  'weapon/refinement': `
    <div class="page weapon-refinement-calc">
      <h1 data-i18n="weapon.refinementCalculator">Калькулятор пробуждения</h1>
      
      <div id="refinement-content">
        <section class="weapon-selector">
          <div class="selected-weapon">
            <div id="refinement-weapon-icon"></div>
            <div class="selected-weapon-info">
              <h2 id="refinement-weapon-name">???</h2>
              <div class="selected-weapon-meta">
                <span id="refinement-weapon-rarity">★★★★★</span>
                <span id="refinement-weapon-type">Тип</span>
              </div>
            </div>
          </div>
          
          <div class="refinement-current">
            <h3 data-i18n="weapon.currentRefinement">Текущее пробуждение</h3>
            <div class="refinement-dots-large">
              ${Array.from({length: 5}, (_, i) => `
                <button class="refinement-dot-large ${i === 0 ? 'active' : ''}" 
                        data-refinement="${i + 1}">
                  <span class="dot-number">${i + 1}</span>
                  <span class="dot-label" data-i18n="weapon.refinementLevelShort">R${i + 1}</span>
                </button>
              `).join('')}
            </div>
          </div>
          
          <div class="refinement-target">
            <h3 data-i18n="weapon.targetRefinement">Целевое пробуждение</h3>
            <div class="refinement-dots-large">
              ${Array.from({length: 5}, (_, i) => `
                <button class="refinement-dot-large target ${i === 4 ? 'active' : ''}" 
                        data-target-refinement="${i + 1}">
                  <span class="dot-number">${i + 1}</span>
                  <span class="dot-label" data-i18n="weapon.refinementLevelShort">R${i + 1}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </section>
        
        <section class="refinement-materials">
          <h2 data-i18n="materials.required">Необходимые материалы</h2>
          <div class="materials-summary">
            <div class="material-summary-item">
              <span class="summary-label" data-i18n="weapon.copiesRequired">Требуется копий оружия:</span>
              <span class="summary-value" id="required-copies">4</span>
            </div>
            <div class="material-summary-item">
              <span class="summary-label" data-i18n="weapon.moraRequired">Мора:</span>
              <span class="summary-value" id="required-mora">0</span>
            </div>
            <div class="material-summary-item">
              <span class="summary-label" data-i18n="weapon.totalCost">Общая стоимость:</span>
              <span class="summary-value" id="total-cost">0</span>
            </div>
          </div>
          
          <div class="materials-details">
            <h3 data-i18n="weapon.materialsBreakdown">Детали материалов</h3>
            <div class="materials-container" id="refinement-materials-container"></div>
          </div>
        </section>
        
        <section class="refinement-benefits">
          <h2 data-i18n="weapon.benefitsComparison">Сравнение преимуществ</h2>
          
          <div class="benefits-current">
            <h3 data-i18n="weapon.currentBenefits">Текущее пробуждение (R<span id="current-benefits-level">1</span>)</h3>
            <div class="passive-description-box">
              <h4 id="current-passive-name">???</h4>
              <p id="current-passive-description">???</p>
            </div>
          </div>
          
          <div class="benefits-target">
            <h3 data-i18n="weapon.targetBenefits">Целевое пробуждение (R<span id="target-benefits-level">5</span>)</h3>
            <div class="passive-description-box">
              <h4 id="target-passive-name">???</h4>
              <p id="target-passive-description">???</p>
            </div>
          </div>
          
          <div class="improvement-summary">
            <h3 data-i18n="weapon.improvementSummary">Сводка улучшений</h3>
            <div class="improvement-items" id="improvement-items-container">
              <!-- Элементы улучшений будут заполнены динамически -->
            </div>
          </div>
        </section>
        
        <section class="refinement-strategy">
          <h2 data-i18n="weapon.refinementStrategy">Стратегия пробуждения</h2>
          <div class="strategy-tips">
            <div class="tip-card">
              <h4>📊 <span data-i18n="weapon.priority">Приоритетность</span></h4>
              <p data-i18n="weapon.priorityTip">Пробуждение наиболее эффективно для оружия с 5★, особенно для основного DPS персонажа.</p>
            </div>
            <div class="tip-card">
              <h4>💰 <span data-i18n="weapon.costEfficiency">Эффективность затрат</span></h4>
              <p data-i18n="weapon.costEfficiencyTip">R1 → R2 дает наибольший прирост за единицу затрат. Дальнейшие уровни менее эффективны.</p>
            </div>
            <div class="tip-card">
              <h4>🎯 <span data-i18n="weapon.recommendation">Рекомендация</span></h4>
              <p id="refinement-recommendation" data-i18n="weapon.recommendationDefault">
                Для этого оружия рекомендуется пробуждение до R3 для оптимального баланса силы и затрат.
              </p>
            </div>
          </div>
          
          <div class="user-input-section">
            <h3 data-i18n="weapon.yourMaterials">Ваши материалы</h3>
            <div class="user-materials-input">
              <div class="input-group">
                <label data-i18n="weapon.availableCopies">Имеется копий:</label>
                <input type="number" id="available-copies" min="0" max="10" value="1">
              </div>
              <div class="input-group">
                <label data-i18n="weapon.availableMora">Имеется мора:</label>
                <input type="number" id="available-mora" min="0" value="0">
              </div>
            </div>
            
            <div class="calculation-results">
              <div class="result-card success" id="can-refine-result">
                <h4 data-i18n="weapon.canYouRefine">Можете ли вы пробудить?</h4>
                <p id="refine-possibility">Да, можете достичь R5!</p>
              </div>
              <div class="result-card info" id="missing-materials-result">
                <h4 data-i18n="materials.missing">Недостающие материалы</h4>
                <p id="missing-materials-list">Все материалы есть</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  date: `
<div class="page info">
  <h1 data-i18n="pages.date.title">База знаний</h1>
  
  <section class="info-card-container">
    <article class="date-card" data-page="date/fish">
      <a href="#/date/fish" class="date-card-link">
        <div class="date-card-content">
          <div class="date-card-icon fishing">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              <path d="M9 12h6"></path>
            </svg>
          </div>
          <div class="date-card-text">
            <h3 data-i18n="pages.date.fishing">Рыбалка</h3>
          </div>
        </div>
      </a>
    </article>
    
    <article class="date-card" data-page="date/creatures">
      <a href="#/date/creatures" class="date-card-link">
        <div class="date-card-content">
          <div class="date-card-icon creature">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
          </div>
          <div class="date-card-text">
            <h3 data-i18n="date.creatures">Существа</h3>
          </div>
        </div>
      </a>
    </article>
    
    <article class="date-card" data-page="date/artifacts">
      <a href="#/date/artifacts" class="date-card-link">
        <div class="date-card-content">
          <div class="date-card-icon artifact">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <path d="M3 9h18M9 21V9"></path>
            </svg>
          </div>
          <div class="date-card-text">
            <h3 data-i18n="date.artifacts">Артефакты</h3>
          </div>
        </div>
      </a>
    </article>
  </section>
</div>
`,
  'date/fish': `
    <div class="page date-subpage">
      <div class="date-subpage-header">
        <h1 data-i18n="pages.date.fishing">Рыбалка</h1>
      </div>
    
      <div class="date-subpage-content" id="fish-content">
        <!-- Контент будет загружен динамически -->
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p data-i18n="loading.data">Загрузка данных...</p>
        </div>
      </div>
    </div>
  `,

'date/creatures': `
  <div class="page date-subpage">
    <div class="date-subpage-header">
      <h1 data-i18n="date.creatures">Существа</h1>
      <p data-i18n="date.creaturesDescription">Враги и нейтральные существа с характеристиками</p>
    </div>
    
    <div class="date-subpage-content" id="creatures-content">
      <!-- Контент будет загружен динамически -->
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p data-i18n="loading.data">Загрузка данных...</p>
      </div>
    </div>
  </div>
`,
  'date/artifacts': `
  <div class="page date-subpage">
    <div class="date-subpage-header">
      <h1 data-i18n="date.artifacts">Артефакты</h1>
      <p data-i18n="date.artifactsDescription">Полные наборы артефактов с детальными статами</p>
    </div>
    
    <div class="date-subpage-content" id="artifacts-content">
      <!-- Контент будет загружен динамически -->
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p data-i18n="loading.data">Загрузка данных...</p>
      </div>
    </div>
  </div>
`,
  profile: `
    <div class="page profile">
      <h1 data-i18n="pages.profile.title"></h1>
      <p data-i18n="profile.description">Содержание страницы Profile</p>
      <div class="profile-content">
        <div class="profile-info">
          <h2 data-i18n="profile.savedMaterials">Мои сохраненные материалы</h2>
          <p data-i18n="profile.savedDescription">Здесь отображаются все ваши сохраненные настройки персонажей.</p>
        </div>
        
        <!-- ВАЖНО: Добавьте этот контейнер! -->
        <div id="saved-materials-container" class="saved-materials-list">
          <!-- Здесь будут отображаться сохраненные материалы -->
        </div>
      </div>

    </div>
  `
};