// page-layouts.js
export const pageLayouts = {
  home: `
    <div class="page home">
      <h1 data-i18n="home.title"></h1>
      <p data-i18n="home.welcome"></p>
    </div>
  `,
  about: `
    <div class="page about">
      <h1 data-i18n="about.title"></h1>
      <p data-i18n="about.description"></p>
      <img src="about.jpg" alt="" data-i18n="about.imgAlt">
    </div>
  `,
  catalog: `
    <div class="page catalog">
      <h1 data-i18n="catalog.title"></h1>
      <ul>
        <li>
          <a href="#/catalog/electronics" data-page="catalog/electronics">
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
  'catalog/electronics': `
    <div class="page electronics">
      <h2 data-i18n="electronics.title"></h2>
      <p data-i18n="electronics.description"></p>
      <a href="#/catalog" data-i18n="common.backToCatalog"></a>
    </div>
  `,
  'catalog/clothing': `
    <div class="page clothing">
      <h2 data-i18n="clothing.title"></h2>
      <p data-i18n="clothing.description"></p>
      <a href="#/catalog" data-i18n="common.backToCatalog"></a>
    </div>
  `
};
