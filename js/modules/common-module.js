// common-module.js - общие функции и данные
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
        <section class="characters br-drk pad-3">
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
        <section class="characters br-drk pad-3">
          <div id="char-icon"></div>
          <h5 data-i18n="character.info">Информация о персонаже</h5>
          <h1 id="char-name" data-i18n-target="name">???</h1>
        </section>
        <section class="character-description br-drk pad-3">
          <p id="char-description" data-i18n-target="description">???</p>
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
        
        <h2 data-i18n="character.stats">Характеристики</h2>
        <!-- Статистика персонажа -->
        <div class="stats br-drk br-r4 pad-3">
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
                <h3 id="char-atack-name" data-i18n-target="attack">???</h3>
            </div>
        </div>
        
        <div class="talent-description">
            <p id="des-attack" data-i18n-target="des_attack">???</p>
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
        <div class="talent-stats" id="attack-stats-container">
            <!-- Статистика атаки будет загружена динамически -->
        </div>
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
            <button id="skill-minus" data-i18n-title="character.decreaseLevel">
                <img src="./assets/minus.svg" alt="-" data-i18n-alt="character.decreaseLevel">
            </button>
            <button id="skill-plus" data-i18n-title="character.increaseLevel">
                <img src="./assets/plus.svg" alt="+" data-i18n-alt="character.increaseLevel">
            </button>
            <input type="range" id="level-skill" min="1" max="10" value="1" class="talent-slider" data-i18n-title="character.talentLevel">
            <span class="talent-level" id="skill-level">1</span>
        </div>
        <div class="talent-stats" id="skill-stats-container">
            <!-- Статистика навыка будет загружена динамически -->
        </div>
    </div>
    
    <!-- Взрыв стихии -->
    <div class="talent-card br-drk br-r4 pad-2">
        <div class="talent-header">
            <div id="char-s3" class="talent-icon">💥</div>
            <div class="talent-info">
                <h4 data-i18n="character.elementalBurst">Взрыв стихии</h4>
                <h3 id="char-burst-name">???</h3>
            </div>
        </div>
        <div class="talent-description">
            <p id="des-burst">???</p>
        </div>
        <div class="talent-controls">
            <button class="arrow left" data-i18n-title="character.decreaseLevel">&lt;</button>
            <span class="talent-level" id="burst-level">1</span>
            <button class="arrow right" data-i18n-title="character.increaseLevel">&gt;</button>
        </div>
        <div class="talent-stats" id="burst-stats-container">
            <!-- Статистика взрыва стихии будет загружена динамически -->
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

    <article class="date-card" data-page="date/creatures">
      <a href="#/date/creatures" class="date-card-link">
        <svg  class="icon-sssv"  >
          <use href="#date2"></use>
        </svg>
          
        <div class="date-card-text">
          <h3 data-i18n="date.creatures">Существа</h3>
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
      <h1 data-i18n="pages.profile.title">Профиль</h1>
      
      <!-- Блок профиля пользователя -->
      <section class="profile-user-section br-drk br-r4 pad-3" style="margin-bottom: 30px;">
        <div class="user-profile-container" style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap;">
          <!-- Левая часть: Аватар -->
          <div class="user-avatar-section">
            <div class="avatar-container" style="position: relative;">
              <img id="user-avatar" src="assets/avatar-icon/default-user.png" 
                   alt="Аватар пользователя" 
                   class="user-avatar br-r4"
                   style="width: 100px; height: 100px; object-fit: cover; cursor: pointer;">
              <button id="change-avatar-btn" class="avatar-change-btn br-r4"
                      style="position: absolute; bottom: -10px; right: -10px; background: #4CAF50; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                ✏️
              </button>
            </div>
            
            <!-- Меню выбора аватара (скрыто по умолчанию) -->
            <div id="avatar-selector" class="avatar-selector-container br-drk br-r4 pad-2" 
                 style="display: none; position: absolute; z-index: 1000; background: white; width: 300px; max-height: 400px; overflow-y: auto; box-shadow: 0 5px 20px rgba(0,0,0,0.2);">
              <h4 style="margin: 0 0 10px 0; color: #333;">Выберите аватар</h4>
              <div class="avatar-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 15px 0;">
                <!-- Аватары будут загружены динамически -->
              </div>
              <button id="close-avatar-selector" style="margin-top: 10px; padding: 8px 15px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Закрыть
              </button>
            </div>
          </div>
          
          <!-- Правая часть: Имя и описание -->
          <div class="user-info-section" style="flex: 1;">
            <div class="username-section" style="margin-bottom: 15px;">
              <label for="username-input" style="display: block; margin-bottom: 5px; color: #666; font-size: 14px;">
                Имя пользователя
              </label>
              <div style="display: flex; gap: 10px; align-items: center;">
                <input type="text" id="username-input" class="username-input br-r4 pad-2" 
                       placeholder="Введите ваше имя" 
                       style="flex: 1; padding: 10px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px;">
                <button id="save-username-btn" class="save-btn br-r4 pad-2"
                        style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">
                  Сохранить
                </button>
              </div>
            </div>
            
            <div class="profile-description">
              <p style="color: #666; margin: 0; font-style: italic;">
                Это ваш персональный профиль. Здесь вы можете сохранять настройки персонажей, 
                оружия и сборки калькулятора. Все данные сохраняются автоматически.
              </p>
            </div>
            
            <!-- Информация о сохранении -->
            <div id="profile-save-info" class="save-info br-drk br-r4 pad-2" 
                 style="margin-top: 15px; background: #f8f9fa; display: none;">
              <p style="margin: 0; color: #28a745; font-size: 14px;">
                ✓ Данные сохранены
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Блок функций -->
      <section class="profile-functions-section" style="margin-bottom: 30px;">
        <h2 style="color: #333; margin-bottom: 15px;">Функции</h2>
        <div class="functions-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
          <!-- Кнопка калькулятора -->
          <a href="#/profile/calculator" class="function-card br-drk br-r4 pad-3" 
             style="display: flex; align-items: center; gap: 15px; background: #e3f2fd; text-decoration: none; color: #333; transition: transform 0.2s;">
            <div class="function-icon" style="font-size: 32px; color: #2196F3;">
              🧮
            </div>
            <div class="function-info">
              <h3 style="margin: 0 0 5px 0; color: #2196F3;">Калькулятор характеристик</h3>
              <p style="margin: 0; color: #666; font-size: 14px;">
                Расчет характеристик персонажа с учетом оружия и артефактов
              </p>
            </div>
          </a>
          
          <!-- Дополнительные функции можно добавить здесь -->
          <div class="function-card br-drk br-r4 pad-3" 
               style="display: flex; align-items: center; gap: 15px; background: #f3e5f5; opacity: 0.7; cursor: not-allowed;">
            <div class="function-icon" style="font-size: 32px; color: #9C27B0;">
              📊
            </div>
            <div class="function-info">
              <h3 style="margin: 0 0 5px 0; color: #9C27B0;">Статистика (скоро)</h3>
              <p style="margin: 0; color: #666; font-size: 14px;">
                Анализ ваших сохранений и прогресса
              </p>
            </div>
          </div>
          
          <div class="function-card br-drk br-r4 pad-3" 
               style="display: flex; align-items: center; gap: 15px; background: #f1f8e9; opacity: 0.7; cursor: not-allowed;">
            <div class="function-icon" style="font-size: 32px; color: #7CB342;">
              📈
            </div>
            <div class="function-info">
              <h3 style="margin: 0 0 5px 0; color: #7CB342;">Прогресс (скоро)</h3>
              <p style="margin: 0; color: #666; font-size: 14px;">
                Отслеживание прогресса прокачки
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Блок сохранений -->
      <section class="saved-content-section">
        <div class="saved-content-header" style="margin-bottom: 20px;">
          <h2 style="color: #333; margin-bottom: 5px;">Мои сохранения</h2>
          <p style="color: #666; margin: 0;">
            Все ваши сохраненные настройки персонажей, оружия и калькулятора
          </p>
        </div>
        
        <div id="saved-materials-container" class="saved-materials-list">
          <!-- Здесь будут отображаться сохраненные материалы -->
        </div>
        
        <!-- Кнопка обновления -->
        <button id="refresh-saves-btn" class="refresh-btn br-r4 pad-2"
                style="display: block; margin: 30px auto 0; padding: 12px 30px; background: #2196F3; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; transition: background 0.3s;">
          🔄 Обновить список сохранений
        </button>
      </section>
    </div>
  `,
  // В pageLayouts добавляем новый макет калькулятора
'profile/calculator': `
  <div class="page calculator-page">
    <h1 data-i18n="calculator.title">Калькулятор характеристик</h1>
    
    <!-- Кнопки слотов сохранения -->
    <div class="calculator-save-slots" id="calculator-save-slots">
      <!-- Слоты будут добавлены динамически -->
    </div>
    
    <div class="calculator-container">
      <!-- Левая колонка - выбор персонажа и оружия -->
      <div class="calculator-left">
        <!-- Выбор персонажа -->
        <section class="calculator-section character-section">
          <h2 data-i18n="calculator.selectCharacter">Выбор персонажа</h2>
          <div class="character-selector" id="character-selector">
            <button class="select-button" id="select-character-btn">
              <span data-i18n="calculator.clickToSelect">Нажмите для выбора</span>
            </button>
            <div class="selected-character" id="selected-character-display">
              <div class="empty-state">
                <div class="empty-icon">👤</div>
                <p data-i18n="calculator.noCharacterSelected">Персонаж не выбран</p>
              </div>
            </div>
          </div>
          
          <!-- Статы выбранного персонажа -->
          <div class="character-base-stats" id="character-base-stats" style="display: none;">
            <h3 data-i18n="calculator.baseStats">Базовые характеристики (90 уровень)</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-label" data-i18n="character.hp">HP</span>
                <span class="stat-value" id="char-base-hp">-</span>
              </div>
              <div class="stat-item">
                <span class="stat-label" data-i18n="character.attack">ATK</span>
                <span class="stat-value" id="char-base-atk">-</span>
              </div>
              <div class="stat-item">
                <span class="stat-label" data-i18n="character.defense">DEF</span>
                <span class="stat-value" id="char-base-def">-</span>
              </div>
              <div class="stat-item">
                <span class="stat-label" data-i18n="calculator.critRate">Крит. шанс</span>
                <span class="stat-value" id="char-base-crit-rate">5%</span>
              </div>
              <div class="stat-item">
                <span class="stat-label" data-i18n="calculator.critDmg">Крит. урон</span>
                <span class="stat-value" id="char-base-crit-dmg">50%</span>
              </div>
              <div class="stat-item">
                <span class="stat-label" data-i18n="calculator.elementalMastery">Мастерство стихий</span>
                <span class="stat-value" id="char-base-em">0</span>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Выбор оружия -->
        <section class="calculator-section weapon-section">
          <h2 data-i18n="calculator.selectWeapon">Выбор оружия</h2>
          <div class="weapon-selector" id="weapon-selector">
            <button class="select-button" id="select-weapon-btn" disabled>
              <span data-i18n="calculator.selectCharacterFirst">Сначала выберите персонажа</span>
            </button>
            <div class="selected-weapon" id="selected-weapon-display">
              <div class="empty-state">
                <div class="empty-icon">⚔️</div>
                <p data-i18n="calculator.noWeaponSelected">Оружие не выбрано</p>
              </div>
            </div>
          </div>
          
          <!-- Статы выбранного оружия -->
          <div class="weapon-stats" id="weapon-stats" style="display: none;">
            <h3 data-i18n="calculator.weaponStats">Характеристики оружия (90 уровень)</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-label" data-i18n="character.attack">Базовая атака</span>
                <span class="stat-value" id="weapon-base-atk">-</span>
              </div>
              <div class="stat-item">
                <span class="stat-label" id="weapon-substat-label">Доп. стата</span>
                <span class="stat-value" id="weapon-substat-value">-</span>
              </div>
              <div class="stat-item">
                <span class="stat-label" data-i18n="calculator.passiveAbility">Пассивная способность</span>
                <span class="stat-value" id="weapon-passive">-</span>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <!-- Правая колонка - выбор артефактов -->
      <div class="calculator-right">
        <section class="calculator-section artifacts-section">
          <h2 data-i18n="calculator.selectArtifacts">Выбор артефактов</h2>
          <p class="section-description" data-i18n="calculator.artifactsDescription">Выберите 5 артефактов (при выборе 2/4 предметов одного сета учитываются бонусы)</p>
          
          <div class="artifacts-slots">
            <!-- Цветок -->
            <div class="artifact-slot" data-slot="flower">
              <div class="slot-header">
                <div class="slot-icon">🌸</div>
                <h4 data-i18n="calculator.flower">Цветок жизни</h4>
              </div>
              <div class="artifact-preview" data-artifact-type="flower">
                <div class="empty-state small">
                  <p data-i18n="calculator.notSelected">Не выбран</p>
                </div>
              </div>
              <button class="select-artifact-btn" data-slot="flower" disabled>
                <span data-i18n="calculator.select">Выбрать</span>
              </button>
            </div>
            
            <!-- Перо -->
            <div class="artifact-slot" data-slot="plume">
              <div class="slot-header">
                <div class="slot-icon">🪶</div>
                <h4 data-i18n="calculator.plume">Перо смерти</h4>
              </div>
              <div class="artifact-preview" data-artifact-type="plume">
                <div class="empty-state small">
                  <p data-i18n="calculator.notSelected">Не выбран</p>
                </div>
              </div>
              <button class="select-artifact-btn" data-slot="plume" disabled>
                <span data-i18n="calculator.select">Выбрать</span>
              </button>
            </div>
            
            <!-- Часы -->
            <div class="artifact-slot" data-slot="sands">
              <div class="slot-header">
                <div class="slot-icon">⏳</div>
                <h4 data-i18n="calculator.sands">Пески времени</h4>
              </div>
              <div class="artifact-preview" data-artifact-type="sands">
                <div class="empty-state small">
                  <p data-i18n="calculator.notSelected">Не выбран</p>
                </div>
              </div>
              <button class="select-artifact-btn" data-slot="sands" disabled>
                <span data-i18n="calculator.select">Выбрать</span>
              </button>
            </div>
            
            <!-- Кубок -->
            <div class="artifact-slot" data-slot="goblet">
              <div class="slot-header">
                <div class="slot-icon">🍶</div>
                <h4 data-i18n="calculator.goblet">Кубок пространства</h4>
              </div>
              <div class="artifact-preview" data-artifact-type="goblet">
                <div class="empty-state small">
                  <p data-i18n="calculator.notSelected">Не выбран</p>
                </div>
              </div>
              <button class="select-artifact-btn" data-slot="goblet" disabled>
                <span data-i18n="calculator.select">Выбрать</span>
              </button>
            </div>
            
            <!-- Корона -->
            <div class="artifact-slot" data-slot="circlet">
              <div class="slot-header">
                <div class="slot-icon">👑</div>
                <h4 data-i18n="calculator.circlet">Корона разума</h4>
              </div>
              <div class="artifact-preview" data-artifact-type="circlet">
                <div class="empty-state small">
                  <p data-i18n="calculator.notSelected">Не выбран</p>
                </div>
              </div>
              <button class="select-artifact-btn" data-slot="circlet" disabled>
                <span data-i18n="calculator.select">Выбрать</span>
              </button>
            </div>
          </div>
          
          <!-- Бонусы сетов -->
          <div class="set-bonuses" id="set-bonuses">
            <h3 data-i18n="calculator.setBonuses">Бонусы наборов артефактов</h3>
            <div class="bonuses-list" id="bonuses-list">
              <div class="no-bonuses">
                <p data-i18n="calculator.noSetBonuses">Нет активных бонусов наборов</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    
    <!-- Итоговые характеристики -->
    <section class="calculator-section final-stats-section">
      <h2 data-i18n="calculator.finalStats">Итоговые характеристики</h2>
      <div class="final-stats-container">
        <div class="stats-column">
          <div class="stat-card main">
            <div class="stat-header">
              <div class="stat-icon">❤️</div>
              <h4 data-i18n="character.hp">HP</h4>
            </div>
            <div class="stat-value" id="final-hp">0</div>
            <div class="stat-breakdown" id="hp-breakdown">
              <span class="breakdown-item">База: 0</span>
              <span class="breakdown-item">Проценты: 0%</span>
              <span class="breakdown-item">Бонус: 0</span>
            </div>
          </div>
          
          <div class="stat-card main">
            <div class="stat-header">
              <div class="stat-icon">⚔️</div>
              <h4 data-i18n="character.attack">ATK</h4>
            </div>
            <div class="stat-value" id="final-atk">0</div>
            <div class="stat-breakdown" id="atk-breakdown">
              <span class="breakdown-item">База: 0</span>
              <span class="breakdown-item">Проценты: 0%</span>
              <span class="breakdown-item">Бонус: 0</span>
            </div>
          </div>
          
          <div class="stat-card main">
            <div class="stat-header">
              <div class="stat-icon">🛡️</div>
              <h4 data-i18n="character.defense">DEF</h4>
            </div>
            <div class="stat-value" id="final-def">0</div>
            <div class="stat-breakdown" id="def-breakdown">
              <span class="breakdown-item">База: 0</span>
              <span class="breakdown-item">Проценты: 0%</span>
              <span class="breakdown-item">Бонус: 0</span>
            </div>
          </div>
        </div>
        
        <div class="stats-column">
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon">🎯</div>
              <h4 data-i18n="calculator.critRate">Крит. шанс</h4>
            </div>
            <div class="stat-value" id="final-crit-rate">5%</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon">💥</div>
              <h4 data-i18n="calculator.critDmg">Крит. урон</h4>
            </div>
            <div class="stat-value" id="final-crit-dmg">50%</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon">✨</div>
              <h4 data-i18n="calculator.elementalMastery">Мастерство стихий</h4>
            </div>
            <div class="stat-value" id="final-em">0</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon">⚡</div>
              <h4 data-i18n="calculator.energyRecharge">Восст. энергии</h4>
            </div>
            <div class="stat-value" id="final-er">100%</div>
          </div>
        </div>
        
        <div class="stats-column">
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon">🔥</div>
              <h4 data-i18n="calculator.pyroDmg">Бонус Пиро урона</h4>
            </div>
            <div class="stat-value" id="final-pyro-dmg">0%</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon">💧</div>
              <h4 data-i18n="calculator.hydroDmg">Бонус Гидро урона</h4>
            </div>
            <div class="stat-value" id="final-hydro-dmg">0%</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon">🌪️</div>
              <h4 data-i18n="calculator.anemoDmg">Бонус Анемо урона</h4>
            </div>
            <div class="stat-value" id="final-anemo-dmg">0%</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon">⛰️</div>
              <h4 data-i18n="calculator.geoDmg">Бонус Гео урона</h4>
            </div>
            <div class="stat-value" id="final-geo-dmg">0%</div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Кнопки управления -->
    <div class="calculator-controls">
      <button class="calc-btn secondary" id="reset-calculator" data-i18n="calculator.reset">
        Сбросить все
      </button>
      <button class="calc-btn primary" id="save-build" disabled data-i18n="calculator.saveBuild">
        Сохранить сборку
      </button>
    </div>
  </div>
`
};

// Функции для очистки флагов загрузки
export function clearAllLoadFlags() {
    console.log('Очищаем все флаги загрузки');
    
    localStorage.removeItem('isLoadingFromProfile');
    localStorage.removeItem('isLoadingFromSave');
    localStorage.removeItem('isNewCharacterSetup');
    
    const levelData = JSON.parse(localStorage.getItem('characterLevelData') || '{}');
    const charData = JSON.parse(localStorage.getItem('characterData') || '{}');
    
    delete levelData.isFromLoad;
    delete levelData.isFromProfile;
    delete levelData.isFromSave;
    delete levelData.loadedFromSave;
    
    delete charData.isFromLoad;
    delete charData.isFromProfile;
    delete charData.isFromSave;
    delete charData.loadedFromSave;
    
    localStorage.setItem('characterLevelData', JSON.stringify(levelData));
    localStorage.setItem('characterData', JSON.stringify(charData));
    
    console.log('Все флаги загрузки очищены');
}

// Функция для получения текущих данных персонажа
export function getCurrentCharacterData() {
    const data = {
        level: 1,
        attackLevel: 1,
        skillLevel: 1,
        explosionLevel: 1,
        rangeVal: 0,
        inputs: {}
    };
    
    const charLevelElement = document.getElementById('lvl');
    if (charLevelElement) {
        data.level = parseInt(charLevelElement.textContent) || 1;
    }
    
    const levelSpans = document.querySelectorAll('.section .level-value');
    if (levelSpans.length >= 3) {
        data.attackLevel = parseInt(levelSpans[0].textContent) || 1;
        data.skillLevel = parseInt(levelSpans[1].textContent) || 1;
        data.explosionLevel = parseInt(levelSpans[2].textContent) || 1;
    }
    
    const rangeSlider = document.getElementById('range');
    if (rangeSlider) {
        data.rangeVal = parseInt(rangeSlider.value) || 0;
    }
    
    const inputElements = document.querySelectorAll('.all .materials-container input[type="number"]');
    inputElements.forEach(input => {
        const value = parseInt(input.value) || 0;
        const materialId = input.id.replace('all_', '').replace(/_/g, '.');
        data.inputs[materialId] = value;
    });
    
    return data;
}

// Функция для сравнения с сохраненными данными
export function compareWithSavedData(currentData, savedData) {
    if (currentData.level !== savedData.level ||
        currentData.attackLevel !== savedData.attackLevel ||
        currentData.skillLevel !== savedData.skillLevel ||
        currentData.explosionLevel !== savedData.explosionLevel ||
        currentData.rangeVal !== (savedData.rangeVal || savedData.characterData?.rangeVal || 0)) {
        return true;
    }
    
    const savedInputs = savedData.userInputs || {};
    for (const key in savedInputs) {
        if (currentData.inputs[key] !== savedInputs[key]) {
            return true;
        }
    }
    
    return false;
}

// Функция для получения реального уровня персонажа из значения слайдера
export function getRealLevelFromRange(rangeVal) {
    const val = parseInt(rangeVal) || 0;
    if (val >= 70) return 90;
    else if (val >= 60) return 80;
    else if (val >= 50) return 70;
    else if (val >= 40) return 60;
    else if (val >= 30) return 50;
    else if (val >= 20) return 40;
    else if (val >= 10) return 20;
    else return 1;
}

// Функция для показа сообщения об ошибке
export function showErrorMessage(message) {
    const allSections = document.querySelectorAll('section .materials-container');
    const lang = window.currentLang || 'ru';
    
    allSections.forEach(container => {
        if (container) {
            container.innerHTML = `<div style="color: red; padding: 20px; background: #ffe6e6; border-radius: 5px;">
                <strong>Ошибка:</strong> ${message}
                <br><br>
                <button onclick="location.reload()">Обновить страницу</button>
                <button onclick="history.back()">Вернуться назад</button>
            </div>`;
        }
    });
}