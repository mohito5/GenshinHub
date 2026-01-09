// list-char.js - оптимизированная версия с исправленной локализацией
import { charsData } from './characterData.js';
import { translations } from './translations.js';

let characterFilters = {
  element: null,
  weapon: null,
  rarity: null
};

// Кэш для переведенных имен материалов
let materialNameCache = {};

// Функция для получения переведенного имени материала
function getTranslatedMaterialName(materialKey, lang = 'ru') {
  const cacheKey = `${materialKey}_${lang}`;
  
  if (materialNameCache[cacheKey]) {
    return materialNameCache[cacheKey];
  }

  let translatedName = null;

  // Пытаемся найти материал в materialsInfo
  if (materialsInfo[materialKey]) {
    const materialData = materialsInfo[materialKey];
    if (typeof materialData === 'object' && materialData.name) {
      // materialData.name - это объект {ru: "...", en: "..."}
      if (materialData.name[lang]) {
        translatedName = materialData.name[lang];
      } else if (materialData.name.ru) {
        translatedName = materialData.name.ru;
      }
    }
  } else {
    // Проверяем вложенные структуры
    const parts = materialKey.split('.');
    if (parts.length === 2) {
      const [category, subKey] = parts;
      if (materialsInfo[category] && materialsInfo[category][subKey]) {
        const materialData = materialsInfo[category][subKey];
        if (typeof materialData === 'object' && materialData.name) {
          // materialData.name - это объект {ru: "...", en: "..."}
          if (materialData.name[lang]) {
            translatedName = materialData.name[lang];
          } else if (materialData.name.ru) {
            translatedName = materialData.name.ru;
          }
        }
      }
    }
  }
  
  if (translatedName) {
    console.log('Найден переведенный материал:', translatedName);
    materialNameCache[cacheKey] = translatedName;
    return translatedName;
  }

  // Если не нашли в materialsInfo, используем ключ как fallback
  console.log('Материал не найден, используем ключ:', materialKey);
  materialNameCache[cacheKey] = materialKey;
  return materialKey;
}
// Функция для обновления имен персонажей при смене языка
export function updateCharacterCardsLanguage(lang) {
  const cards = document.querySelectorAll('.card-character');
  cards.forEach(card => {
    const charKey = card.getAttribute('data-name');
    const charData = charsData[charKey];
    
    if (charData) {
      // Обновляем имя в карточке
      const nameElement = card.querySelector('.name p');
      if (nameElement) {
        nameElement.textContent = charData[`${lang}_name`] || charData.en_name;
      }
      
      // Обновляем alt атрибут изображения
      const imgElement = card.querySelector('.card-avatar img');
      if (imgElement) {
        imgElement.alt = charData[`${lang}_name`] || charData.en_name;
      }
      
      // Обновляем data-lang атрибут
      card.setAttribute('data-lang', lang);
    }
  });
}
// Получаем текущий язык из глобальной переменной
function getCurrentLang() {
  return window.currentLang || 'ru';
}

// Функция для рендеринга карточек персонажей
export function renderCharacterCards(currentLang = 'ru', filters = characterFilters) {
  const container = document.querySelector('.characters-cards-container');
  if (!charsData || !container) return;

  container.innerHTML = '';

  const filteredCharacters = Object.entries(charsData).filter(([key, data]) => {
    if (filters.element && data.element !== filters.element) {
      return false;
    }

    if (filters.weapon && data.weapon !== filters.weapon) {
      return false;
    }

    if (filters.rarity && parseInt(data.rarity) !== parseInt(filters.rarity)) {
      return false;
    }

    return true;
  });

  if (filteredCharacters.length === 0) {
    const errorMessage = translations[currentLang]?.errors?.noResults || 'Нет персонажей, соответствующих фильтрам';
    container.innerHTML = `<p class="no-results">${errorMessage}</p>`;
    updateCharacterCount(0);
    return;
  }

  filteredCharacters.forEach(([key, data]) => {
    const article = document.createElement('article');
    article.classList.add('card-character');

    if (data.rarity) article.classList.add(`rarity-${data.rarity}`);
    if (data.element) article.classList.add(`element-${data.element}`);
    if (data.weapon) article.classList.add(`weapon-${data.weapon}`);
    article.classList.add('all');

    article.setAttribute('data-name', key);
    article.setAttribute('data-lang', currentLang);

    const link = document.createElement('a');
    link.href = '#';
    link.className = 'link-to-character';
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openCharacterModal(key, data, currentLang);
    });

    // Аватар персонажа
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'card-avatar';
    const img = document.createElement('img');
    img.src = data.avatar_icon || '/images/characters/default.png';
    img.alt = data[`${currentLang}_name`] || data.en_name;
    avatarDiv.appendChild(img);
    link.appendChild(avatarDiv);

    // Название персонажа
    const nameSpan = document.createElement('span');
    nameSpan.className = 'name';
    const nameP = document.createElement('p');
    nameP.textContent = data[`${currentLang}_name`] || data.en_name;
    nameSpan.appendChild(nameP);
    link.appendChild(nameSpan);

    article.appendChild(link);
    container.appendChild(article);
  });

  updateCharacterCount(filteredCharacters.length);
}

// Функция для обновления счетчика персонажей
function updateCharacterCount(count) {
  let counterElement = document.querySelector('.character-counter');
  
  if (!counterElement) {
    const header = document.querySelector('.page.characters h1');
    if (header) {
      counterElement = document.createElement('span');
      counterElement.className = 'character-counter';
      header.appendChild(counterElement);
    }
  }
  
  if (counterElement) {
    counterElement.textContent = ` (${count})`;
  }
}

// Функция для сброса фильтров персонажей
export function resetCharacterFilters(currentLang = 'ru') {
  characterFilters = {
    element: null,
    weapon: null,
    rarity: null
  };
  
  renderCharacterCards(currentLang);
  updateFilterButton(currentLang);
}

// Функция для обновления кнопки фильтра персонажей
function updateFilterButton(currentLang = 'ru') {
  const filterBtn = document.querySelector('.filter-button');
  if (!filterBtn) return;
  
  const hasActiveFilters = Object.values(characterFilters).some(filter => filter !== null);
  const translationsObj = translations[currentLang] || translations['ru'];
  
  const originalHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
    </svg>
    <span>${translationsObj['filter.title'] || 'Фильтр'}</span>
  `;
  
  if (hasActiveFilters) {
    filterBtn.classList.add('active');
    filterBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
        <circle cx="12" cy="12" r="3" class="filter-indicator"/>
      </svg>
      <span>${translationsObj['filter.title'] || 'Фильтр'}</span>
      <span class="filter-clear" style="
        background: #fff;
        color: #4CAF50;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        margin-left: 5px;
        cursor: pointer;
      ">×</span>
    `;
    
    filterBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
    
    const clearBtn = filterBtn.querySelector('.filter-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resetCharacterFilters(currentLang);
      });
    }
    
  } else {
    filterBtn.classList.remove('active');
    filterBtn.innerHTML = originalHTML;
    filterBtn.style.background = 'var(--dark)';
  }
}

// Функция для создания модального окна фильтра персонажей
export function createCharacterFilterModal() {
  console.log('Создание модального окна фильтра для персонажей');
  
  // Закрываем все другие модальные окна фильтров
  if (window.modalManager) {
    window.modalManager.closeAllByType('filter');
  }

  const currentLang = window.currentLang || 'ru';
  const translationsObj = translations[currentLang] || translations['ru'];
  
  // Удаляем только фильтры персонажей
  const existingModal = document.querySelector('.character-filter-modal');
  if (existingModal) existingModal.remove();
  
  const elements = new Set();
  const weapons = new Set();
  const rarities = new Set();
  
  Object.values(charsData).forEach(character => {
    if (character.element) elements.add(character.element);
    if (character.weapon) weapons.add(character.weapon);
    if (character.rarity) rarities.add(character.rarity);
  });

  const modal = document.createElement('div');
  modal.className = 'character-filter-modal';

  // Регистрируем с типом
  if (window.modalManager) {
    window.modalManager.registerModal(modal, 'character-filter');
  }

  const modalContent = document.createElement('div');
  modalContent.className = 'filter-modal-content character-filter-content';

  const headerDiv = document.createElement('div');
  headerDiv.className = 'filter-modal-header';
  
  const title = document.createElement('h2');
  title.textContent = translationsObj['filter.title'] || 'Фильтр персонажей';
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'filter-close-btn';
  closeBtn.innerHTML = '<svg><use href="#icon-close"></use></svg>';
  closeBtn.setAttribute('aria-label', translationsObj['misc.close'] || 'Закрыть');
  
  closeBtn.addEventListener('click', () => {
    if (window.modalManager) {
      window.modalManager.unregisterModal(modal);
    }
    modal.remove();
  });
  
  headerDiv.appendChild(title);
  headerDiv.appendChild(closeBtn);

  const sections = [
    {
      title: translationsObj['filter.element'] || 'Стихия',
      key: 'element',
      options: Array.from(elements).sort(),
      current: characterFilters.element
    },
    {
      title: translationsObj['filter.weapon'] || 'Оружие',
      key: 'weapon',
      options: Array.from(weapons).sort(),
      current: characterFilters.weapon
    },
    {
      title: translationsObj['filter.rarity'] || 'Редкость',
      key: 'rarity',
      options: Array.from(rarities).sort((a, b) => b - a),
      current: characterFilters.rarity
    }
  ];

  const filtersContainer = document.createElement('div');
  filtersContainer.className = 'filters-container';

  sections.forEach(section => {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'filter-section';

    const sectionTitle = document.createElement('h3');
    sectionTitle.textContent = section.title;

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'filter-options';

    const allOption = document.createElement('button');
    allOption.className = 'filter-option';
    allOption.textContent = translationsObj['filter.all'] || 'Все';
    allOption.dataset.value = '';
    allOption.dataset.type = section.key;
    
    if (section.current === null) {
      allOption.classList.add('active');
    }
    
    allOption.addEventListener('click', (e) => {
      const buttons = optionsContainer.querySelectorAll('.filter-option');
      buttons.forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
    });
    
    optionsContainer.appendChild(allOption);

    section.options.forEach(option => {
      const optionBtn = document.createElement('button');
      optionBtn.className = 'filter-option';
      
      let displayText = option;
      if (section.key === 'element') {
        displayText = translationsObj['elements']?.[option] || option;
      } else if (section.key === 'weapon') {
        displayText = translationsObj['weapons']?.[option] || option;
      } else if (section.key === 'rarity') {
        displayText = '★'.repeat(option);
      }
      
      optionBtn.textContent = displayText;
      optionBtn.dataset.value = option;
      optionBtn.dataset.type = section.key;
      
      if (section.current === option) {
        optionBtn.classList.add('active');
      }
      
      optionBtn.addEventListener('click', (e) => {
        const buttons = optionsContainer.querySelectorAll('.filter-option');
        buttons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
      });
      
      optionsContainer.appendChild(optionBtn);
    });

    sectionDiv.appendChild(sectionTitle);
    sectionDiv.appendChild(optionsContainer);
    filtersContainer.appendChild(sectionDiv);
  });

  const actionsContainer = document.createElement('div');
  actionsContainer.className = 'filter-actions';

  const resetBtn = document.createElement('button');
  resetBtn.className = 'filter-action-btn reset';
  resetBtn.textContent = translationsObj['buttons.reset'] || 'Сбросить';
  
  resetBtn.addEventListener('click', () => {
    filtersContainer.querySelectorAll('.filter-option').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.value === '') {
        btn.classList.add('active');
      }
    });
  });

  const applyBtn = document.createElement('button');
  applyBtn.className = 'filter-action-btn apply';
  applyBtn.textContent = translationsObj['buttons.apply'] || 'Применить';

  applyBtn.addEventListener('click', () => {
    const newFilters = {
      element: null,
      weapon: null,
      rarity: null
    };

    const activeButtons = filtersContainer.querySelectorAll('.filter-option.active');
    activeButtons.forEach(btn => {
      const type = btn.dataset.type;
      const value = btn.dataset.value;
      
      if (value !== '') {
        if (type === 'rarity') {
          newFilters[type] = parseInt(value);
        } else {
          newFilters[type] = value;
        }
      }
    });

    characterFilters = newFilters;
    renderCharacterCards(currentLang);
    updateFilterButton(currentLang);
    
    if (window.modalManager) {
      window.modalManager.unregisterModal(modal);
    }
    modal.remove();
  });

  actionsContainer.appendChild(resetBtn);
  actionsContainer.appendChild(applyBtn);

  modalContent.appendChild(headerDiv);
  modalContent.appendChild(filtersContainer);
  modalContent.appendChild(actionsContainer);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Добавляем слушатель для смены языка
  const languageChangeHandler = (e) => {
    const newLang = e.detail.lang;
    const newTranslations = translations[newLang] || translations['ru'];
    
    if (title) {
      title.textContent = newTranslations['filter.title'] || 'Фильтр персонажей';
    }
    
    const sectionTitles = modalContent.querySelectorAll('h3');
    if (sectionTitles.length >= 3) {
      sectionTitles[0].textContent = newTranslations['filter.element'] || 'Стихия';
      sectionTitles[1].textContent = newTranslations['filter.weapon'] || 'Оружие';
      sectionTitles[2].textContent = newTranslations['filter.rarity'] || 'Редкость';
    }
    
    const allOptions = modalContent.querySelectorAll('.filter-option[data-value=""]');
    allOptions.forEach(option => {
      option.textContent = newTranslations['filter.all'] || 'Все';
    });
    
    if (resetBtn) resetBtn.textContent = newTranslations['buttons.reset'] || 'Сбросить';
    if (applyBtn) applyBtn.textContent = newTranslations['buttons.apply'] || 'Применить';
    
    updateFilterOptionsTranslation(newLang);
  };
  
  const updateFilterOptionsTranslation = (lang) => {
    const newTranslations = translations[lang] || translations['ru'];
    
    modalContent.querySelectorAll('.filter-option').forEach(option => {
      const value = option.dataset.value;
      const type = option.dataset.type;
      
      if (value === '') return;
      
      let displayText = value;
      if (type === 'element') {
        displayText = newTranslations['elements']?.[value] || value;
      } else if (type === 'weapon') {
        displayText = newTranslations['weapons']?.[value] || value;
      }
      
      option.textContent = displayText;
    });
  };
  
  document.addEventListener('languageChange', languageChangeHandler);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      if (window.modalManager) {
        window.modalManager.unregisterModal(modal);
      }
      document.removeEventListener('languageChange', languageChangeHandler);
      modal.remove();
    }
  });
  
  const originalRemove = modal.remove;
  modal.remove = function() {
    if (window.modalManager) {
      window.modalManager.unregisterModal(modal);
    }
    document.removeEventListener('languageChange', languageChangeHandler);
    originalRemove.call(this);
  };
  
  document.addEventListener('keydown', function closeOnEsc(e) {
    if (e.key === 'Escape') {
      if (window.modalManager) {
        window.modalManager.unregisterModal(modal);
      }
      document.removeEventListener('languageChange', languageChangeHandler);
      modal.remove();
      document.removeEventListener('keydown', closeOnEsc);
    }
  });
}

// Функция для создания кнопки фильтра персонажей
export function createCharacterFilterButton() {
  const currentLang = window.currentLang || 'ru';
  const translationsObj = translations[currentLang] || translations['ru'];
  const navTopBar = document.querySelector('.nav-top-bar');
  if (!navTopBar) return;

  // Сбрасываем фильтры при создании кнопки
  resetFiltersOnPageLoad();

  let filterBtn = document.querySelector('.filter-button');
  
  if (!filterBtn) {
    filterBtn = document.createElement('button');
    filterBtn.className = 'filter-button';
    filterBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
      </svg>
      <span>${translationsObj['filter.title'] || 'Фильтр'}</span>
    `;
    
    filterBtn.addEventListener('mouseenter', () => {
      filterBtn.style.transform = 'translateY(-2px)';
      filterBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    });
    
    filterBtn.addEventListener('mouseleave', () => {
      filterBtn.style.transform = 'translateY(0)';
      filterBtn.style.boxShadow = 'none';
    });
    
    filterBtn.addEventListener('click', (e) => {
      const clearBtn = e.target.closest('.filter-clear');
      if (clearBtn) {
        e.stopPropagation();
        resetCharacterFilters(currentLang);
      } else {
        createCharacterFilterModal();
      }
    });
    
    const navLeftArea = navTopBar.querySelector('.nav-left-area');
    if (navLeftArea) {
      navLeftArea.appendChild(filterBtn);
    } else {
      const leftArea = document.createElement('div');
      leftArea.className = 'nav-left-area';
      leftArea.appendChild(filterBtn);
      
      const langSwitcher = navTopBar.querySelector('.language-switcher');
      if (langSwitcher) {
        navTopBar.insertBefore(leftArea, langSwitcher);
      } else {
        navTopBar.appendChild(leftArea);
      }
    }
  }
  
  updateFilterButton(currentLang);
}

// Функция для сброса фильтров при загрузке страницы
function resetFiltersOnPageLoad() {
  // Проверяем, находимся ли мы на странице персонажей
  const isCharactersPage = window.location.hash.includes('characters') || 
                          document.querySelector('.page.characters');
  
  if (!isCharactersPage) {
    characterFilters = {
      element: null,
      weapon: null,
      rarity: null
    };
    console.log('Фильтры персонажей сброшены (не на странице персонажей)');
  }
}

// Функция для открытия модального окна персонажа
export function openCharacterModal(charKey, char, lang = 'ru') {
  console.log('Открытие модального окна персонажа:', charKey);
  
  // Используем текущий язык из глобальной переменной
  lang = getCurrentLang();
  const translationsObj = translations[lang] || translations['ru'];
  
  localStorage.setItem('selectedCharacter', JSON.stringify({
    key: charKey,
    data: char,
    lang: lang
  }));
  
  const existingModal = document.querySelector('.character-modal');
  if (existingModal) existingModal.remove();
  
  const modal = document.createElement('div');
  modal.className = 'character-modal';

  if (window.modalManager) {
    window.modalManager.registerModal(modal);
  }

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-btn';
  closeBtn.textContent = '×';
  closeBtn.setAttribute('aria-label', translationsObj['misc.close'] || 'Закрыть');
  
  closeBtn.addEventListener('click', () => {
    if (window.modalManager) {
      window.modalManager.unregisterModal(modal);
    }
    modal.remove();
  });

  const avatarContainer = document.createElement('div');
  avatarContainer.className = 'character-avatar-container';
  
  const avatarImg = document.createElement('img');
  avatarImg.src = char.avatar || '/images/characters/default.png';
  const charName = char[`${lang}_name`] || char.en_name;
  avatarImg.alt = charName;
  avatarContainer.appendChild(avatarImg);

  const title = document.createElement('h2');
  title.textContent = charName;
  avatarContainer.appendChild(title);

  // Редкость
  const rarityDiv = document.createElement('div');
  rarityDiv.className = 'character-modal-rarity';
  rarityDiv.textContent = '★'.repeat(char.rarity || 1);
  avatarContainer.appendChild(rarityDiv);

  // Элемент
  const elementDiv = document.createElement('div');
  elementDiv.className = 'character-modal-element';
  elementDiv.innerHTML = `<img src="./assets/elements/${char.element}.svg" alt="${char.element}">`;
  avatarContainer.appendChild(elementDiv);

  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'modal-buttons-container';

  const sections = [
    { 
      id: 'materials', 
      label: translationsObj['materials'] || 'Материалы развития', 
      icon: '📦' 
    },
    { 
      id: 'info', 
      label: translationsObj['info'] || 'Информация', 
      icon: 'ℹ️' 
    },
    { 
      id: 'guide', 
      label: translationsObj['guide'] || 'Гайд', 
      icon: '📚' 
    }
  ];

  sections.forEach(section => {
    const sectionBtn = document.createElement('button');
    sectionBtn.className = 'section-btn';
    sectionBtn.dataset.section = section.id;
    
    sectionBtn.innerHTML = `${section.icon} ${section.label}`;
    
    sectionBtn.addEventListener('click', () => {
      if (window.modalManager) {
        window.modalManager.unregisterModal(modal);
      }
      modal.remove();
      
      // ЗАМЕНА: Вместо прямого перехода на страницу, открываем модальное окно настроек для кнопки "materials"
      if (section.id === 'materials') {
        // Открываем модальное окно настроек уровней
        setTimeout(() => {
          openMaterialsSetupModal(char, lang, null);
        }, 100);
      } else {
        // Для остальных кнопок (info, guide) используем старый переход
        navigateToCharacterPage(section.id, char, lang);
      }
    });
    
    buttonsContainer.appendChild(sectionBtn);
  });

  modalContent.appendChild(closeBtn);
  modalContent.appendChild(avatarContainer);
  modalContent.appendChild(buttonsContainer);
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Функция для обновления перевода модального окна
  const updateModalTranslation = (newLang) => {
    console.log('Обновление перевода модального окна персонажа на:', newLang);
    const newTranslations = translations[newLang] || translations['ru'];
    
    // Обновляем имя персонажа
    const newCharName = char[`${newLang}_name`] || char.en_name;
    title.textContent = newCharName;
    avatarImg.alt = newCharName;
    
    // Обновляем заголовки кнопок
    const updatedSections = [
      { 
        id: 'materials', 
        label: newTranslations['materials'] || 'Материалы развития', 
        icon: '📦' 
      },
      { 
        id: 'info', 
        label: newTranslations['info'] || 'Информация', 
        icon: 'ℹ️' 
      },
      { 
        id: 'guide', 
        label: newTranslations['guide'] || 'Гайд', 
        icon: '📚' 
      }
    ];
    
    const sectionButtons = buttonsContainer.querySelectorAll('.section-btn');
    sectionButtons.forEach((btn, index) => {
      if (updatedSections[index]) {
        const iconMatch = btn.innerHTML.match(/^[^\s]+/);
        const icon = iconMatch ? iconMatch[0] : '📦';
        btn.innerHTML = `${icon} ${updatedSections[index].label}`;
      }
    });
    
    // Обновляем aria-label кнопки закрытия
    closeBtn.setAttribute('aria-label', newTranslations['misc.close'] || 'Закрыть');
  };

  // Добавляем слушатель для смены языка
  const languageChangeHandler = (e) => {
    const newLang = e.detail.lang;
    updateModalTranslation(newLang);
  };
  
  document.addEventListener('languageChange', languageChangeHandler);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      if (window.modalManager) {
        window.modalManager.unregisterModal(modal);
      }
      document.removeEventListener('languageChange', languageChangeHandler);
      modal.remove();
    }
  });
  
  document.addEventListener('keydown', function closeOnEsc(e) {
    if (e.key === 'Escape') {
      if (window.modalManager) {
        window.modalManager.unregisterModal(modal);
      }
      document.removeEventListener('languageChange', languageChangeHandler);
      modal.remove();
      document.removeEventListener('keydown', closeOnEsc);
    }
  });
  
  // Переопределяем метод remove для корректной очистки слушателей
  const originalRemove = modal.remove;
  modal.remove = function() {
    if (window.modalManager) {
      window.modalManager.unregisterModal(modal);
    }
    document.removeEventListener('languageChange', languageChangeHandler);
    originalRemove.call(this);
  };
}

// Функция для навигации на страницу персонажа
function navigateToCharacterPage(section, char, lang) {
  let targetPage;
  
  switch(section) {
    case 'materials':
      targetPage = 'characters/mat';
      break;
    case 'info':
      targetPage = 'characters/info';
      break;
    case 'guide':
      targetPage = 'characters/guide';
      break;
    default:
      targetPage = 'characters';
  }
  
  localStorage.setItem('selectedCharacter', JSON.stringify({
    key: char.key,
    data: char,
    lang: lang
  }));
  
  console.log('Переходим на страницу:', targetPage);
  
  history.pushState({}, '', `#/${targetPage}`);
  
  if (window.showPage) {
    window.showPage(targetPage);
  } else {
    window.location.href = `#/${targetPage}`;
    window.location.reload();
  }
}

// Функция показа опции загрузки сохранения (возвращает Promise)
function showLoadSaveOptionPromise(character, lang, existingSave) {
  return new Promise((resolve) => {
    const translationsObj = translations[lang] || translations['ru'];
    const charName = character[`${lang}_name`] || character.en_name;
    const saveDate = new Date(existingSave.lastModified || existingSave.date).toLocaleString();
    const materialsCount = Object.keys(existingSave.userInputs || {}).length;
    
    const modal = document.createElement('div');
    modal.className = 'load-save-option-modal';
    
    // Регистрируем модальное окно
    if (window.modalManager) {
      window.modalManager.registerModal(modal);
    }
    
    // Функция для обновления перевода модального окна
    const updateModalTranslation = (newLang) => {
      const newTranslations = translations[newLang] || translations['ru'];
      const newCharName = character[`${newLang}_name`] || character.en_name;
      
      // Обновляем все текстовые элементы
      const title = modalContent.querySelector('h3');
      const description = modalContent.querySelector('.modal-description');
      const existingDataTitle = modalContent.querySelector('.existing-data-title');
      const levelLabel = modalContent.querySelector('.info-item:nth-child(1) .label');
      const attackLabel = modalContent.querySelector('.info-item:nth-child(2) .label');
      const skillLabel = modalContent.querySelector('.info-item:nth-child(3) .label');
      const explosionLabel = modalContent.querySelector('.info-item:nth-child(4) .label');
      const materialsLabel = modalContent.querySelector('.info-item:nth-child(5) .label');
      const newButton = modalContent.querySelector('#option-new');
      const loadButton = modalContent.querySelector('#option-load');
      const cancelHint = modalContent.querySelector('.cancel-hint');
      
      if (title) {
        title.textContent = newTranslations['loadSave.title'] || 'Загрузить сохраненные данные?';
      }
      
      if (description) {
        description.innerHTML = (newTranslations['loadSave.description'] || 
          'Для <strong>{characterName}</strong> найдено сохранение от <strong>{saveDate}</strong>')
          .replace('{characterName}', newCharName)
          .replace('{saveDate}', saveDate);
      }
      
      if (existingDataTitle) {
        existingDataTitle.textContent = newTranslations['loadSaveOption.existingData'] || 'Текущие сохраненные данные:';
      }
      
      const labels = [levelLabel, attackLabel, skillLabel, explosionLabel, materialsLabel];
      const labelKeys = ['loadSave.level', 'loadSave.attack', 'loadSave.skill', 'loadSave.explosion', 'loadSave.materialsCount'];
      
      labels.forEach((label, index) => {
        if (label) {
          label.textContent = (newTranslations[labelKeys[index]] || 
            labelKeys[index] === 'loadSave.level' ? 'Уровень:' :
            labelKeys[index] === 'loadSave.attack' ? 'Атака:' :
            labelKeys[index] === 'loadSave.skill' ? 'Навык:' :
            labelKeys[index] === 'loadSave.explosion' ? 'Взрыв:' :
            'Сохранено материалов:') + ' ';
        }
      });
      
      if (newButton) {
        newButton.textContent = newTranslations['loadSave.newButton'] || 'Создать новое';
      }
      
      if (loadButton) {
        loadButton.textContent = newTranslations['loadSave.loadButton'] || 'Загрузить сохраненное';
      }
      
      if (cancelHint) {
        cancelHint.textContent = newTranslations['hint.clickOutside'] || 'Нажмите вне окна для отмены';
      }
    };
    
    const modalContent = document.createElement('div');
    modalContent.className = 'load-save-content';
    
    modalContent.innerHTML = `
      <button class="close-btn" style="
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.3s;
      " onclick="this.closest('.load-save-option-modal').remove(); resolve('new');">×</button>
      
      <div style="margin-bottom: 20px;">
        <div style="font-size: 48px; color: #2196F3; margin-bottom: 10px;">💾</div>
        <h3 data-i18n="loadSave.title" style="color: #333; margin-bottom: 10px;">
          ${translationsObj['loadSave.title'] || 'Загрузить сохраненные данные?'}
        </h3>
        <p class="modal-description" data-i18n="loadSave.description" style="color: #666; margin-bottom: 5px;">
          ${(translationsObj['loadSave.description'] || 
            'Для <strong>{characterName}</strong> найдено сохранение от <strong>{saveDate}</strong>')
            .replace('{characterName}', `<strong style="color: #333;">${charName}</strong>`)
            .replace('{saveDate}', `<strong style="color: #333;">${saveDate}</strong>`)}
        </p>
      </div>
      
      <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin: 20px 0; text-align: left;">
        <p class="existing-data-title" data-i18n="loadSaveOption.existingData" style="font-weight: bold; margin-bottom: 10px; color: #555;">
          ${translationsObj['loadSaveOption.existingData'] || 'Текущие сохраненные данные:'}
        </p>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div class="info-item" style="display: flex; justify-content: space-between;">
            <span class="label" data-i18n="loadSave.level" style="color: #777;">
              ${translationsObj['loadSave.level'] || 'Уровень:'}
            </span>
            <span style="font-weight: bold; color: #333;">${existingSave.level || 1}</span>
          </div>
          <div class="info-item" style="display: flex; justify-content: space-between;">
            <span class="label" data-i18n="loadSave.attack" style="color: #777;">
              ${translationsObj['loadSave.attack'] || 'Атака:'}
            </span>
            <span style="font-weight: bold; color: #333;">${existingSave.attackLevel || 1}</span>
          </div>
          <div class="info-item" style="display: flex; justify-content: space-between;">
            <span class="label" data-i18n="loadSave.skill" style="color: #777;">
              ${translationsObj['loadSave.skill'] || 'Навык:'}
            </span>
            <span style="font-weight: bold; color: #333;">${existingSave.skillLevel || 1}</span>
          </div>
          <div class="info-item" style="display: flex; justify-content: space-between;">
            <span class="label" data-i18n="loadSave.explosion" style="color: #777;">
              ${translationsObj['loadSave.explosion'] || 'Взрыв:'}
            </span>
            <span style="font-weight: bold; color: #333;">${existingSave.explosionLevel || 1}</span>
          </div>
          ${materialsCount > 0 ? `
            <div class="info-item" style="display: flex; justify-content: space-between;">
              <span class="label" data-i18n="loadSave.materialsCount" style="color: #777;">
                ${translationsObj['loadSave.materialsCount'] || 'Сохранено материалов:'}
              </span>
              <span style="font-weight: bold; color: #333;">${materialsCount}</span>
            </div>
          ` : ''}
        </div>
      </div>
      
      <div style="display: flex; gap: 15px; justify-content: center; margin-top: 25px;">
        <button id="option-new" class="load-option-btn new" style="
          padding: 12px 30px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          flex: 1;
          transition: background 0.3s;
        " data-i18n="loadSave.newButton">
          ${translationsObj['loadSave.newButton'] || 'Создать новое'}
        </button>
        <button id="option-load" class="load-option-btn load" style="
          padding: 12px 30px;
          background: #2196F3;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          flex: 1;
          transition: background 0.3s;
        " data-i18n="loadSave.loadButton">
          ${translationsObj['loadSave.loadButton'] || 'Загрузить сохраненное'}
        </button>
      </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Обработчики кнопок
    modalContent.querySelector('#option-new').addEventListener('click', () => {
      if (window.modalManager) {
        window.modalManager.unregisterModal(modal);
      }
      document.removeEventListener('languageChange', languageChangeHandler);
      modal.remove();
      resolve('new');
    });
    
    modalContent.querySelector('#option-load').addEventListener('click', () => {
      if (window.modalManager) {
        window.modalManager.unregisterModal(modal);
      }
      document.removeEventListener('languageChange', languageChangeHandler);
      modal.remove();
      resolve('load');
    });
    
    // Закрытие при клике вне окна
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        if (window.modalManager) {
          window.modalManager.unregisterModal(modal);
        }
        document.removeEventListener('languageChange', languageChangeHandler);
        modal.remove();
        // При клике вне - возвращаемся к предыдущему модальному окну
        setTimeout(() => {
          openCharacterModal(character.key, character, lang);
        }, 100);
      }
    });
    
    // Закрытие по клавише Esc
    document.addEventListener('keydown', function closeOnEsc(e) {
      if (e.key === 'Escape') {
        if (window.modalManager) {
          window.modalManager.unregisterModal(modal);
        }
        document.removeEventListener('languageChange', languageChangeHandler);
        modal.remove();
        document.removeEventListener('keydown', closeOnEsc);
        // При Esc - возвращаемся к предыдущему модальному окну
        setTimeout(() => {
          openCharacterModal(character.key, character, lang);
        }, 100);
      }
    });
    
    // Добавляем слушатель для смены языка
    const languageChangeHandler = (e) => {
      const newLang = e.detail.lang;
      updateModalTranslation(newLang);
    };
    
    document.addEventListener('languageChange', languageChangeHandler);
    
    // Удаляем слушатель при закрытии модального окна
    const originalRemove = modal.remove;
    modal.remove = function() {
      if (window.modalManager) {
        window.modalManager.unregisterModal(modal);
      }
      document.removeEventListener('languageChange', languageChangeHandler);
      originalRemove.call(this);
    };
  });
}

export async function openMaterialsSetupModal(character, lang = getCurrentLang(), parentModal) {
  // Используем текущий язык
  lang = getCurrentLang();
  
  if (parentModal) parentModal.remove();

  const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  const existingSave = savedMaterials.find(save => save.charKey === character.key);
  
  if (existingSave) {
    try {
      const userChoice = await showLoadSaveOptionPromise(character, lang, existingSave);
      
      if (userChoice === 'load') {
        console.log('НЕМЕДЛЕННАЯ ЗАГРУЗКА сохраненных данных для персонажа:', character[`${lang}_name`] || character.en_name);
        
        localStorage.setItem('isLoadingFromSave', 'true');
        localStorage.setItem('isLoadingFromProfile', 'true');
        localStorage.setItem('isFromLoad', 'true');
        localStorage.setItem('isFromSave', 'true');
        
        const saveDataToLoad = {
          charName: existingSave.characterName,
          charKey: existingSave.charKey,
          rangeVal: existingSave.characterData?.rangeVal || existingSave.rangeVal || 0,
          level: existingSave.level || 1,
          attackLevel: existingSave.attackLevel || 1,
          skillLevel: existingSave.skillLevel || 1,
          explosionLevel: existingSave.explosionLevel || 1,
          userInputs: existingSave.userInputs || {},
          characterAvatar: existingSave.characterAvatar,
          timestamp: Date.now(),
          characterData: existingSave.characterData || character,
          isFromLoad: true,
          isFromSave: true,
          isFromProfile: true,
          loadedFromSave: true,
          saveId: existingSave.id || existingSave.charKey,
          lastModified: existingSave.lastModified || Date.now()
        };
        
        localStorage.setItem('selectedCharacter', JSON.stringify({
          key: character.key,
          data: character,
          lang: lang
        }));
        
        localStorage.setItem('characterLevelData', JSON.stringify(saveDataToLoad));
        localStorage.setItem('characterData', JSON.stringify(saveDataToLoad));
        
        console.log('Данные сохранены для немедленной загрузки с флагом isFromProfile:', saveDataToLoad);
        
        history.pushState({}, '', '#/characters/mat');
        
        if (typeof window.showPage === 'function') {
          window.showPage('characters/mat');
        } else {
          window.location.href = '#/characters/mat';
          window.location.reload();
        }
        
        return;
        
      } else {
        console.log('Создаем новую настройку для персонажа');
        localStorage.removeItem('isNewCharacterSetup');
        localStorage.removeItem('isLoadingFromSave');
        localStorage.removeItem('isLoadingFromProfile');
        localStorage.removeItem('isFromLoad');
        localStorage.removeItem('isFromSave');
        
        const resetLevelData = {
          charName: character[`${lang}_name`] || character.en_name,
          rangeVal: 0,
          level: 1,
          attackLevel: 1,
          skillLevel: 1,
          explosionLevel: 1,
          timestamp: Date.now(),
          characterData: character,
          isNew: true
        };
        
        localStorage.setItem('characterLevelData', JSON.stringify(resetLevelData));
        localStorage.setItem('characterData', JSON.stringify({
          charName: character.en_name,
          charKey: character.key,
          rangeVal: 0,
          level: 1,
          attackLevel: 1,
          skillLevel: 1,
          explosionLevel: 1,
          lang: lang,
          fullCharacterData: character,
          isNew: true
        }));
        
        createMaterialsModal(character, lang, null, false);
        return;
      }
      
    } catch (error) {
      console.error('Ошибка при показе окна выбора:', error);
      localStorage.removeItem('isLoadingFromSave');
      localStorage.removeItem('isLoadingFromProfile');
      localStorage.removeItem('isFromLoad');
      localStorage.removeItem('isFromSave');
      createMaterialsModal(character, lang, null, false);
    }
    
  } else {
    console.log('Создаем новую настройку (нет сохранений или загрузка из профиля)');
    createMaterialsModal(character, lang, null, false);
  }
}

// Функция для создания модального окна настроек материалов
// Функция для создания модального окна настроек материалов
function createMaterialsModal(character, lang = getCurrentLang(), existingSave = null, loadFromSave = false) {
  console.log('createMaterialsModal вызвана с параметрами:', {
    loadFromSave,
    existingSave: existingSave ? 'Да' : 'Нет',
    lang
  });
  
  const existingModal = document.querySelector('.materials-setup-modal');
  if (existingModal) existingModal.remove();

  const currentCharacterData = { ...character };
  
  // Используем текущий язык
  lang = getCurrentLang();
  const translationsObj = translations[lang] || translations['ru'];
  
  let displayData = {};
  
  if (loadFromSave && existingSave) {
    displayData = {
      level: existingSave.level || 1,
      rangeVal: existingSave.rangeVal || 
                existingSave.characterData?.rangeVal || 0,
      attackLevel: existingSave.attackLevel || 1,
      skillLevel: existingSave.skillLevel || 1,
      explosionLevel: existingSave.explosionLevel || 1
    };
    
    console.log('Display данные для загрузки:', displayData);
  } else {
    displayData = {
      level: 1,
      rangeVal: 0,
      attackLevel: 1,
      skillLevel: 1,
      explosionLevel: 1
    };
    
    const resetData = {
      charName: character[`${lang}_name`] || character.en_name,
      charKey: character.key,
      rangeVal: 0,
      level: 1,
      attackLevel: 1,
      skillLevel: 1,
      explosionLevel: 1,
      userInputs: {},
      timestamp: Date.now(),
      characterData: character,
      lang: lang,
      fullCharacterData: character,
      isNewSetup: true,
      isFromLoad: false,
      isFromProfile: false,
      isFromSave: false
    };
    
    localStorage.setItem('characterLevelData', JSON.stringify(resetData));
    localStorage.setItem('characterData', JSON.stringify(resetData));
    
    console.log('Данные сброшены при создании новой настройки:', resetData);
  }
  
  const materialsModal = document.createElement('div');
  materialsModal.className = 'materials-setup-modal';

  // Регистрируем модальное окно
  if (window.modalManager) {
    window.modalManager.registerModal(materialsModal);
  }

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  // Создаем заголовок модального окна
  const header = document.createElement('div');
  header.className = 'modal-header';

  // Кнопка закрытия внутри заголовка
  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-btn2';
  closeBtn.innerHTML = '<svg><use href="#icon-close"></use></svg>';
  closeBtn.setAttribute('aria-label', translationsObj['misc.close'] || 'Закрыть');
  
  closeBtn.addEventListener('click', () => {
    if (window.modalManager) {
      window.modalManager.unregisterModal(materialsModal);
    }
    materialsModal.remove();
    setTimeout(() => {
      openCharacterModal(character.key || 'unknown', character, lang);
    }, 100);
  });

  // Аватар и название в заголовке
  if (character.avatar) {
    const avatarImg = document.createElement('img');
    avatarImg.src = character.avatar_icon;
    const charName = character[`${lang}_name`] || character.en_name;
    avatarImg.alt = charName;
    header.appendChild(avatarImg);
  }

  const title = document.createElement('h3');
  const charName = character[`${lang}_name`] || character.en_name;
  title.textContent = `${charName} - ${translationsObj['talentsModal.title'] || 'Настройка уровней'}`;
  header.appendChild(title);

  // Добавляем кнопку закрытия в конец заголовка
  header.appendChild(closeBtn);
  
  const content = document.createElement('div');
  content.innerHTML = `
    <section class="sec">
      <article class="level">
        <div class="level-text">
          <h2 data-i18n="talentsModal.characterLevel">${translationsObj['talentsModal.characterLevel'] || 'Уровень персонажа'}</h2>
          <h2 class="current-level-display">${displayData.level}</h2>
        </div>
        
        <div class="range">
          <button id="minus-range" aria-label="${translationsObj['levelControls.decrease'] || 'Уменьшить'}">
            <svg alt="${translationsObj['levelControls.decrease'] || 'Уменьшить'}"><use href="#icon-minus"></use></svg>
          </button>
            
          <div>
            <input type="range" id="range" min="0" max="70" value="${displayData.rangeVal}" step="10" 
                  aria-label="${translationsObj['levelControls.slider'] || 'Регулировка уровня'}">
            <span id="range-value">${displayData.rangeVal}</span>
          </div>
            
          <button id="plus-range" aria-label="${translationsObj['levelControls.increase'] || 'Увеличить'}">
            <svg alt="${translationsObj['levelControls.increase'] || 'Увеличить'}"><use href="#icon-plus"></use></svg>
          </button>
        </div>
        
        <div class="basic_stat">
          <h2 data-i18n="talentsModal.talents">${translationsObj['talentsModal.talents'] || 'Уровни талантов'}</h2>
          
          <div class="section" data-group="attack">
            <div id="char-s1">
              ${character.s1 ? `<img src="${character.s1}" alt="Attack Icon">` : '⚔️'}
            </div>
            <div class="hp_icon">
              <p data-i18n="talentsModal.attack">${translationsObj['talentsModal.attack'] || 'Базовая атака'}</p>
              <h3 id="char-atack">${character.attack || translationsObj['state.loading'] || 'Загрузка'}</h3>
            </div>
            <div class="level-group">
              <button class="arrow left" aria-label="${translationsObj['levelControls.decrease'] || 'Уменьшить'}">&lt;</button>
              <span class="level-value">${displayData.attackLevel}</span>
              <button class="arrow right" aria-label="${translationsObj['levelControls.increase'] || 'Увеличить'}">&gt;</button>
            </div>
          </div>
          
          <div class="section" data-group="skill">
            <div id="char-s2">
              ${character.s2 ? `<img src="${character.s2}" alt="Skill Icon">` : '🌀'}
            </div>
            <div class="atk_icon">
              <p  data-i18n="talentsModal.skill">${translationsObj['talentsModal.skill'] || 'Элементальный навык'}</p>
              <h3 id="char-skill">${character.skill || translationsObj['state.loading'] || 'Загрузка'}</h3>
            </div>
            <div class="level-group">
              <button class="arrow left" aria-label="${translationsObj['levelControls.decrease'] || 'Уменьшить'}">&lt;</button>
              <span class="level-value">${displayData.skillLevel}</span>
              <button class="arrow right" aria-label="${translationsObj['levelControls.increase'] || 'Увеличить'}">&gt;</button>
            </div>
          </div>
          
          <div class="section" data-group="explosion">
            <div id="char-s3">
              ${character.s3 ? `<img src="${character.s3}" alt="Explosion Icon">` : '💥'}
            </div>
            <div class="atk_icon">
              <p data-i18n="talentsModal.explosion">${translationsObj['talentsModal.explosion'] || 'Взрыв стихии'}</p>
              <h3 id="char-explosion" >${character.explosion || translationsObj['state.loading'] || 'Загрузка'}</h3>
            </div>
            <div class="level-group">
              <button class="arrow left" aria-label="${translationsObj['levelControls.decrease'] || 'Уменьшить'}">&lt;</button>
              <span class="level-value" >${displayData.explosionLevel}</span>
              <button class="arrow right" aria-label="${translationsObj['levelControls.increase'] || 'Увеличить'}">&gt;</button>
            </div>
          </div>
        </div>
      </article>
    </section>
  `;

  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = 'display: flex; justify-content: space-between; margin-top: 30px; padding: 20px; border-top: 1px solid #eee;';

  const backButton = document.createElement('button');
  backButton.textContent = translationsObj['talentsModal.backButton'] || 'Назад к выбору';
  backButton.style.cssText = 'background: #6c757d; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer;';
  
  backButton.addEventListener('click', () => {
    if (window.modalManager) {
      window.modalManager.unregisterModal(materialsModal);
    }
    materialsModal.remove();
    setTimeout(() => {
      openCharacterModal(character.key || 'unknown', character, lang);
    }, 100);
  });

  const nextButton = document.createElement('button');
  nextButton.textContent = translationsObj['talentsModal.continueButton'] || 'Продолжить';
  nextButton.className = 'next';
  nextButton.id = 'next-btn';
  nextButton.style.cssText = 'background: #2196F3; color: white; border: none; padding: 12px 30px; border-radius: 5px; cursor: pointer; font-weight: bold;';
  
  nextButton.addEventListener('click', async () => {
    const charName = character[`${lang}_name`] || character.en_name;
    const rangeValue = parseInt(document.getElementById('range')?.value) || 0;
    const level = parseInt(document.querySelector('.current-level-display')?.textContent) || 1;
    const attackLevel = parseInt(document.querySelector('.section[data-group="attack"] .level-value')?.textContent) || 1;
    const skillLevel = parseInt(document.querySelector('.section[data-group="skill"] .level-value')?.textContent) || 1;
    const explosionLevel = parseInt(document.querySelector('.section[data-group="explosion"] .level-value')?.textContent) || 1;

    console.log('Данные из модального окна настроек:', {
      rangeValue,
      level, 
      attackLevel,
      skillLevel,
      explosionLevel
    });

    const dataToSave = {
      charName,
      charKey: character.key,
      rangeVal: rangeValue,
      level: level,
      attackLevel: attackLevel,
      skillLevel: skillLevel,
      explosionLevel: explosionLevel,
      timestamp: Date.now(),
      characterData: {
        key: character.key,
        ...character
      },
      lang: lang,
      fullCharacterData: character,
      loadedFromSave: loadFromSave,
      isFromLoad: loadFromSave
    };
    
    if (existingSave && existingSave.userInputs) {
      dataToSave.userInputs = existingSave.userInputs;
    } else {
      dataToSave.userInputs = {};
    }
    
    localStorage.setItem('characterLevelData', JSON.stringify(dataToSave));
    localStorage.setItem('characterData', JSON.stringify(dataToSave));
    
    localStorage.setItem('selectedCharacter', JSON.stringify({
      key: character.key,
      data: character,
      lang: lang
    }));

    console.log('Все данные сохранены в localStorage перед переходом:', dataToSave);
    
    if (window.modalManager) {
      window.modalManager.unregisterModal(materialsModal);
    }
    materialsModal.remove();

    console.log('Переходим на страницу материалов с сохраненными данными');
    navigateToCharacterPage('materials', character, lang);
  });

  buttonContainer.appendChild(backButton);
  buttonContainer.appendChild(nextButton);

  // Добавляем элементы в правильном порядке
  modalContent.appendChild(header); // Заголовок с кнопкой закрытия
  modalContent.appendChild(content);
  modalContent.appendChild(buttonContainer);
  
  materialsModal.appendChild(modalContent);
  document.body.appendChild(materialsModal);

  // Добавляем слушатель для смены языка
  const languageChangeHandler = (e) => {
    const newLang = e.detail.lang;
    const newTranslations = translations[newLang] || translations['ru'];
    const newCharName = character[`${newLang}_name`] || character.en_name;
    
    // Обновляем заголовок
    title.textContent = `${newCharName} - ${newTranslations['talentsModal.title'] || 'Настройка уровней'}`;

    // Обновляем тексты в content
    const updateTextContent = (element, text) => {
      if (element) element.textContent = text;
    };
    
    const h2Elements = content.querySelectorAll('h2');
    if (h2Elements.length >= 3) {
      updateTextContent(h2Elements[0], newTranslations['talentsModal.characterLevel'] || 'Уровень персонажа');
      updateTextContent(h2Elements[1], newTranslations['talentsModal.talents'] || 'Уровни талантов');
    }
    
    // Обновляем заголовки секций
    const sectionHeaders = content.querySelectorAll('.section p[style*="font-weight: bold"]');
    if (sectionHeaders.length >= 3) {
      updateTextContent(sectionHeaders[0], newTranslations['talentsModal.attack'] || 'Базовая атака');
      updateTextContent(sectionHeaders[1], newTranslations['talentsModal.skill'] || 'Элементальный навык');
      updateTextContent(sectionHeaders[2], newTranslations['talentsModal.explosion'] || 'Взрыв стихии');
    }
    
    // Обновляем описание
    const descriptionTitle = content.querySelector('#char-description h3');
    const descriptionText = content.querySelector('#char-description p');
    if (descriptionTitle) descriptionTitle.textContent = newTranslations['talentsModal.description'] || 'Описание персонажа';
    if (descriptionText) descriptionText.textContent = character[`${newLang}_bio`] || character.description || newTranslations['default.noDescription'] || 'Описание отсутствует';
    
    // Обновляем атрибуты aria-label
    const minusBtn = content.querySelector('#minus-range');
    const plusBtn = content.querySelector('#plus-range');
    const rangeSlider = content.querySelector('#range');
    const arrowLeftButtons = content.querySelectorAll('.arrow.left');
    const arrowRightButtons = content.querySelectorAll('.arrow.right');
    
    if (minusBtn) minusBtn.setAttribute('aria-label', newTranslations['levelControls.decrease'] || 'Уменьшить');
    if (plusBtn) plusBtn.setAttribute('aria-label', newTranslations['levelControls.increase'] || 'Увеличить');
    if (rangeSlider) rangeSlider.setAttribute('aria-label', newTranslations['levelControls.slider'] || 'Регулировка уровня');
    
    arrowLeftButtons.forEach(btn => {
      btn.setAttribute('aria-label', newTranslations['levelControls.decrease'] || 'Уменьшить');
    });
    
    arrowRightButtons.forEach(btn => {
      btn.setAttribute('aria-label', newTranslations['levelControls.increase'] || 'Увеличить');
    });
    
    // Обновляем alt атрибуты изображений
    const minusImg = content.querySelector('#minus-range img');
    const plusImg = content.querySelector('#plus-range img');
    if (minusImg) minusImg.alt = newTranslations['levelControls.decrease'] || 'Уменьшить';
    if (plusImg) plusImg.alt = newTranslations['levelControls.increase'] || 'Увеличить';
    
    backButton.textContent = newTranslations['talentsModal.backButton'] || 'Назад к выбору';
    nextButton.textContent = newTranslations['talentsModal.continueButton'] || 'Продолжить';
    
    // Обновляем имя персонажа
    const charNameElement = content.querySelector('#char-name');
    if (charNameElement) {
      charNameElement.textContent = newCharName;
    }
    
    // Обновляем подсказку о закрытии
    const cancelHint = content.querySelector('.cancel-hint');
    if (cancelHint) cancelHint.textContent = newTranslations['hint.clickOutside'] || 'Нажмите вне окна для отмены';
    
    // Обновляем aria-label кнопки закрытия
    closeBtn.setAttribute('aria-label', newTranslations['misc.close'] || 'Закрыть');
  };
  
  document.addEventListener('languageChange', languageChangeHandler);
  
  setTimeout(() => {
    addSliderFunctionality();
  }, 100);

  // Закрытие модального окна при клике вне его
  materialsModal.addEventListener('click', (e) => {
    if (e.target === materialsModal) {
      if (window.modalManager) {
        window.modalManager.unregisterModal(materialsModal);
      }
      document.removeEventListener('languageChange', languageChangeHandler);
      materialsModal.remove();
      // Возвращаемся к окну выбора персонажа
      setTimeout(() => {
        openCharacterModal(character.key || 'unknown', character, lang);
      }, 100);
    }
  });
  
  // Удаляем слушатель при закрытии модального окна
  const originalRemove = materialsModal.remove;
  materialsModal.remove = function() {
    if (window.modalManager) {
      window.modalManager.unregisterModal(materialsModal);
    }
    document.removeEventListener('languageChange', languageChangeHandler);
    originalRemove.call(this);
  };
}

// Функция для добавления функционала слайдера
function addSliderFunctionality() {
  const rangeInput = document.getElementById('range');
  const rangeValueSpan = document.getElementById('range-value');
  const currentLevelDisplay = document.querySelector('.current-level-display');
  const minusRangeBtn = document.getElementById('minus-range');
  const plusRangeBtn = document.getElementById('plus-range');

  if (!rangeInput || !rangeValueSpan || !currentLevelDisplay) return;

  function getCustomNumber(value) {
    const val = parseInt(value);
    if (val >= 70) return 90;
    else if (val >= 60) return 80;
    else if (val >= 50) return 70;
    else if (val >= 40) return 60;
    else if (val >= 30) return 50;
    else if (val >= 20) return 40;
    else if (val >= 10) return 20;
    else return 1;
  }

  function getMaxLevel(rangeVal) {
    const val = parseInt(rangeVal);
    if (val >= 70) return 10;
    else if (val >= 60) return 8;
    else if (val >= 50) return 6;
    else if (val >= 40) return 4;
    else if (val >= 30) return 2;
    else return 1;
  }

  function updateRange(val) {
    const minVal = parseInt(rangeInput.min);
    const maxVal = parseInt(rangeInput.max);
    if (val < minVal) val = minVal;
    if (val > maxVal) val = maxVal;

    rangeInput.value = val;
    rangeValueSpan.textContent = val;
    currentLevelDisplay.textContent = getCustomNumber(val);

    document.querySelectorAll('.section').forEach(section => {
      const levelSpan = section.querySelector('.level-value');
      let currentLevel = parseInt(levelSpan.textContent);
      const maxLevel = getMaxLevel(val);
      if (currentLevel > maxLevel) {
        levelSpan.textContent = maxLevel;
      }
    });
  }

  const initialRangeValue = parseInt(rangeInput.value) || 0;
  rangeValueSpan.textContent = initialRangeValue;
  currentLevelDisplay.textContent = getCustomNumber(initialRangeValue);

  if (minusRangeBtn) {
    minusRangeBtn.addEventListener('click', () => {
      let currentVal = parseInt(rangeInput.value);
      updateRange(currentVal - 10);
    });
  }

  if (plusRangeBtn) {
    plusRangeBtn.addEventListener('click', () => {
      let currentVal = parseInt(rangeInput.value);
      updateRange(currentVal + 10);
    });
  }

  rangeInput.addEventListener('input', () => {
    const val = +rangeInput.value;
    rangeValueSpan.textContent = val;
    currentLevelDisplay.textContent = getCustomNumber(val);
  });

  document.querySelectorAll('.section').forEach(section => {
    const minusBtn = section.querySelector('.arrow.left');
    const plusBtn = section.querySelector('.arrow.right');
    const levelSpan = section.querySelector('.level-value');

    if (minusBtn && levelSpan) {
      minusBtn.addEventListener('click', () => {
        let level = parseInt(levelSpan.textContent);
        if (level > 1) {
          level--;
          levelSpan.textContent = level;
        }
      });
    }

    if (plusBtn && levelSpan) {
      plusBtn.addEventListener('click', () => {
        let level = parseInt(levelSpan.textContent);
        const maxLevel = getMaxLevel(parseInt(rangeInput.value));
        if (level < maxLevel) {
          level++;
          levelSpan.textContent = level;
        }
      });
    }
  });
}
// Функция для обновления всех локализованных элементов в карточках персонажей
export function updateAllCharacterCardsLocalization(lang) {
  const cards = document.querySelectorAll('.card-character');
  const translationsObj = translations[lang] || translations['ru'];
  
  cards.forEach(card => {
    const charKey = card.getAttribute('data-name');
    const charData = charsData[charKey];
    
    if (charData) {
      // Обновляем имя персонажа
      const nameElement = card.querySelector('.name p');
      if (nameElement) {
        nameElement.textContent = charData[`${lang}_name`] || charData.en_name;
      }
      
      // Обновляем alt атрибут изображения
      const imgElement = card.querySelector('.card-avatar img');
      if (imgElement) {
        imgElement.alt = charData[`${lang}_name`] || charData.en_name;
      }
      
      // Обновляем атрибуты элемента и оружия
      const elementIcon = card.querySelector('.element-icon');
      const weaponIcon = card.querySelector('.weapon-icon');
      
      if (elementIcon && charData.element) {
        elementIcon.title = translationsObj['elements']?.[charData.element] || charData.element;
      }
      
      if (weaponIcon && charData.weapon) {
        weaponIcon.title = translationsObj['weapons']?.[charData.weapon] || charData.weapon;
      }
      
      // Обновляем data-lang атрибут
      card.setAttribute('data-lang', lang);
    }
  });
  
  // Обновляем счетчик персонажей
  const count = cards.length;
  updateCharacterCount(count);
}
// Экспортируем глобальные переменные
export { characterFilters };
window.characterFilters = characterFilters;