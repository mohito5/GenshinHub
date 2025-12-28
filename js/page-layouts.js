// page-layouts.js
export const pageLayouts = {
  home: `
    <div class="page home">
      <h1 data-i18n="home.title"></h1>
      <p data-i18n="home.welcome"></p>
    </div>
    <!-- Таймер серверов -->
      <div class="server-timer-header">
      <h3 data-i18n="serverTimer.title">Время сброса серверов</h3>
      
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
    <div class="birthday-banner">
        <img id="birthday-image" src="" alt="" class="banner-image">
        <div class="calendar-wrapper">
          <div id="birthday-announcement"></div>
          <div id="mini-calendar"></div> <!-- Здесь будет календарь -->
        </div>
      </div>
  `,
  characters: `
    <div class="page characters">
    <h1 data-i18n="character.title"></h1>
    <section class="cards-container">
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
            <h2 id="lvl">???</h2>
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
      <h1 data-i18n="character.info">Информация о персонаже</h1>
      <div id="character-content">
        <!-- Контент будет загружен динамически -->
      </div>
    </div>
  `,
  'characters/guide': `
    <div class="character-detail-page">
      <h1 data-i18n="character.guide">Гайд по персонажу</h1>
      <div id="character-content">
        <!-- Контент будет загружен динамически -->
      </div>
    </div>
  `,
  weapon: `
    <div class="page catalog">
      <h1 data-i18n="catalog.title"></h1>
      <ul>
        <li>
          <a href="#/weapon/electronics" data-page="weapon/electronics">
            <span data-i18n="catalog.electronics"></span>
          </a>
        </li>
        <li>
          <a href="#/catalog/clothing" data-page="catalog/clothing">
            <span data-i18n="catalog.clothing"></span>
          </a>
        </li>
      </ul>
    </div>
  `,
  'weapon/electronics': `
    <div class="page electronics">
      <h2 data-i18n="electronics.title"></h2>
      <p data-i18n="electronics.description"></p>
      <a href="#/weapon" data-i18n="common.backToCatalog"></a>
    </div>
  `,
  'catalog/clothing': `
    <div class="page clothing">
      <h2 data-i18n="clothing.title"></h2>
      <p data-i18n="clothing.description"></p>
      <a href="#/catalog" data-i18n="common.backToCatalog"></a>
    </div>
  `,
  date: `
    <div class="page date">
      <h1 data-i18n="date.title"></h1>
      <p>Содержание страницы Date</p>
    </div>
  `,
  profile: `
    <div class="page profile">
      <h1 data-i18n="profile.title"></h1>
      <p>Содержание страницы Profile</p>
      <div class="profile-content">
        <div class="profile-info">
          <h2>Мои сохраненные материалы</h2>
          <p>Здесь отображаются все ваши сохраненные настройки персонажей.</p>
        </div>
        
        <!-- ВАЖНО: Добавьте этот контейнер! -->
        <div id="saved-materials-container" class="saved-materials-list">
          <!-- Здесь будут отображаться сохраненные материалы -->
        </div>
      </div>

    </div>
  `
};
