// list-char.js - исправленная версия без дублирования
import { charsData } from './characterData.js';
import { translations } from './translations.js';
import { getTranslation } from './utils/language-utils.js';


let characterFilters = {
  element: null,
  weapon: null,
  rarity: null
};

// Получаем текущий язык из глобальной переменной
function getCurrentLang() {
  return window.currentLang || 'ru';
}

// Функция для получения перевода (используем импортированную функцию)
function getLocalTranslation(key, lang = getCurrentLang()) {
  return getTranslation(key, lang);
}

// Функция для обновления имен персонажей при смене языка
export function updateCharacterCardsLanguage(lang) {
  console.log('Обновление карточек персонажей на язык:', lang);
  
  const cards = document.querySelectorAll('.card-character');
  console.log('Найдено карточек:', cards.length);
  
  cards.forEach(card => {
    const charKey = card.getAttribute('data-name');
    const charData = charsData[charKey];
    
    if (charData) {
      // Обновляем имя в карточке
      const nameElement = card.querySelector('.name p');
      if (nameElement) {
        const newName = charData[`${lang}_name`] || charData.en_name;
        nameElement.textContent = newName;
        console.log('Обновлено имя:', charKey, '->', newName);
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

// Функция для рендеринга карточек персонажей
export function renderCharacterCards(currentLang = 'ru', filters = characterFilters) {
  const container = document.querySelector('.characters-cards-container');
  if (!charsData || !container) return;

  // Сохраняем текущий HTML, чтобы не перерисовывать если уже есть
  if (container.innerHTML && container.children.length > 0) {
    // Если есть карточки, просто обновляем фильтры
    applyFiltersToExistingCards(filters);
    updateCharacterCount(getVisibleCardsCount());
    return;
  }

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
    
    const avatarIcon = data.avatar_icon || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiMzMzMiIHJ4PSI2MCIvPjxwYXRoIGQ9Ik02MCAzMEM1My4zNzIgMzAgNDggMzUuMzcyIDQ4IDQyQzQ4IDQ4LjYyOCA1My4zNzIgNTQgNjAgNTRDNjYuNjI4IDU0IDcyIDQ4LjYyOCA3MiA0MkM3MiAzNS4zNzIgNjYuNjI4IDMwIDYwIDMwWk00OCA2MEg3MkM3Ny4zMzUgNjAgODEuNiA2NC4yNjUgODEuNiA2OS42Vjc4QzgxLjYgODEuNzcgNzguMzcwIDg1IDc0LjYgODVINDUuNEM0MS42MzA4IDg1IDM4LjQgODEuNzcgMzguNCA3OFY2OS42QzM4LjQgNjQuMjY1IDQyLjY2NSA2MCA0OCA2MFoiIGZpbGw9IiM4ODgiLz48L3N2Zz4=';
    
    img.src = avatarIcon;
    const charName = data[`${currentLang}_name`] || data.en_name;
    img.alt = charName;
    
    avatarDiv.appendChild(img);
    link.appendChild(avatarDiv);

    // Название персонажа
    const nameSpan = document.createElement('span');
    nameSpan.className = 'name';
    const nameP = document.createElement('p');
    nameP.textContent = charName;
    nameSpan.appendChild(nameP);
    link.appendChild(nameSpan);

    article.appendChild(link);
    container.appendChild(article);
  });

  updateCharacterCount(filteredCharacters.length);
}

// Вспомогательная функция для фильтрации существующих карточек
function applyFiltersToExistingCards(filters) {
  const container = document.querySelector('.characters-cards-container');
  if (!container) return;
  
  const cards = container.querySelectorAll('.card-character');
  
  cards.forEach(card => {
    const charKey = card.getAttribute('data-name');
    const charData = charsData[charKey];
    
    if (charData) {
      const shouldShow = 
        (!filters.element || charData.element === filters.element) &&
        (!filters.weapon || charData.weapon === filters.weapon) &&
        (!filters.rarity || parseInt(charData.rarity) === parseInt(filters.rarity));
      
      card.style.display = shouldShow ? '' : 'none';
    }
  });
}

// Подсчет видимых карточек
function getVisibleCardsCount() {
  const container = document.querySelector('.characters-cards-container');
  if (!container) return 0;
  
  return container.querySelectorAll('.card-character[style=""], .card-character:not([style])').length;
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

// Функция для обновления кнопки фильтра персонажей
function updateFilterButton(currentLang = getCurrentLang()) {
    const filterBtn = document.querySelector('.filter-button');
    if (!filterBtn) return;
    
    const hasActiveFilters = Object.values(characterFilters).some(filter => filter !== null);
    
    const filterTitle = getLocalTranslation('filter.title', currentLang);
    
    const originalHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
        </svg>
        <span>${filterTitle}</span>
    `;
    
    if (hasActiveFilters) {
        filterBtn.classList.add('active');
        filterBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
            </svg>
            <span>${filterTitle}</span>
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
                e.preventDefault();
                console.log('Очистка фильтров');
                
                // Сбрасываем фильтры
                characterFilters = {
                    element: null,
                    weapon: null,
                    rarity: null
                };
                
                // Перерисовываем карточки
                if (typeof window.renderCharacterCards === 'function') {
                    window.renderCharacterCards(currentLang);
                }
                
                // Обновляем кнопку
                updateFilterButton(currentLang);
            });
        }
        
    } else {
        filterBtn.classList.remove('active');
        filterBtn.innerHTML = originalHTML;
        filterBtn.style.background = 'var(--primary)';
    }
}

// Функция для создания модального окна фильтра персонажей
export function createCharacterFilterModal() {
  console.log('Создание модального окна фильтра для персонажей');
  
  // Закрываем все другие модальные окна фильтров
  if (window.modalManager) {
    if (typeof window.modalManager.closeAllByType === 'function') {
      window.modalManager.closeAllByType('character-filter');
    } else if (typeof window.modalManager.closeAll === 'function') {
      window.modalManager.closeAll();
    }
  }

  const currentLang = getCurrentLang();
  
  // Удаляем только фильтры персонажей
  const existingModal = document.querySelector('.character-filter-modal');
  if (existingModal) existingModal.remove();
  
  // Получаем уникальные значения для фильтров
  const elements = new Set();
  const weapons = new Set();
  const rarities = new Set();
  
  Object.values(charsData).forEach(character => {
    if (character.element) elements.add(character.element);
    if (character.weapon) weapons.add(character.weapon);
    if (character.rarity) rarities.add(character.rarity);
  });

  // Создаем модальное окно
  const modal = document.createElement('div');
  modal.className = 'character-filter-modal';

  const modalContent = document.createElement('div');
  modalContent.className = 'filter-modal-content character-filter-content';

  // Создаем заголовок
  const headerDiv = document.createElement('div');
  headerDiv.className = 'filter-modal-header';
  
  const title = document.createElement('h2');
  title.textContent = getLocalTranslation('filter.title', currentLang);
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'filter-close-btn';
  closeBtn.innerHTML = '×';
  closeBtn.setAttribute('aria-label', getLocalTranslation('modal.close', currentLang));
  
  headerDiv.appendChild(title);
  headerDiv.appendChild(closeBtn);

  // Создаем секции фильтров
  const sections = [
    {
      title: getTranslation('filter.element', currentLang),
      key: 'element',
      options: Array.from(elements).sort(),
      current: characterFilters.element
    },
    {
      title: getTranslation('filter.weapon', currentLang),
      key: 'weapon',
      options: Array.from(weapons).sort(),
      current: characterFilters.weapon
    },
    {
      title: getTranslation('filter.rarity', currentLang),
      key: 'rarity',
      options: Array.from(rarities).sort((a, b) => b - a),
      current: characterFilters.rarity
    }
  ];

  const filtersContainer = document.createElement('div');
  filtersContainer.className = 'filters-container';

  // Функция для создания опций фильтра
  const createFilterOptions = (lang) => {
    filtersContainer.innerHTML = '';
    
    sections.forEach(section => {
      const sectionDiv = document.createElement('div');
      sectionDiv.className = 'filter-section';

      const sectionTitle = document.createElement('h3');
      sectionTitle.textContent = getTranslation(section.key === 'element' ? 'filter.element' : 
                                                    section.key === 'weapon' ? 'filter.weapon' : 
                                                    'filter.rarity', lang);

      const optionsContainer = document.createElement('div');
      optionsContainer.className = 'filter-options';

      // Кнопка "Все"
      const allOption = document.createElement('button');
      allOption.className = 'filter-option';
      allOption.textContent = getTranslation('filter.all', lang);
      allOption.dataset.value = '';
      allOption.dataset.type = section.key;
      
      if (section.current === null) {
        allOption.style.borderColor = '#4CAF50';
      }
      
      allOption.addEventListener('click', (e) => {
        const buttons = optionsContainer.querySelectorAll('.filter-option');
        buttons.forEach(btn => {
          btn.style.background = '#f8f9fa';
          btn.style.color = '#333';
          btn.style.borderColor = '#ddd';
        });
        e.target.style.background = '#4CAF50';
        e.target.style.color = 'white';
        e.target.style.borderColor = '#4CAF50';
      });
      
      optionsContainer.appendChild(allOption);

      // Кнопки опций
      section.options.forEach(option => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'filter-option';
        
        let displayText = option;
        
        if (section.key === 'element') {
          displayText = getTranslation(`elements.${option}`, lang);
        } else if (section.key === 'weapon') {
          displayText = getTranslation(`weapons.${option}`, lang);
        } else if (section.key === 'rarity') {
          displayText = '★'.repeat(option);
        }
        
        optionBtn.textContent = displayText;
        optionBtn.dataset.value = option;
        optionBtn.dataset.type = section.key;
        
        if (section.current === option) {
          optionBtn.style.borderColor = '#4CAF50';
        }
        
        optionBtn.addEventListener('click', (e) => {
          const buttons = optionsContainer.querySelectorAll('.filter-option');
          buttons.forEach(btn => {
            btn.style.background = '#f8f9fa';
            btn.style.color = '#333';
            btn.style.borderColor = '#ddd';
          });
          e.target.style.background = '#4CAF50';
          e.target.style.color = 'white';
          e.target.style.borderColor = '#4CAF50';
        });
        
        optionsContainer.appendChild(optionBtn);
      });

      sectionDiv.appendChild(sectionTitle);
      sectionDiv.appendChild(optionsContainer);
      filtersContainer.appendChild(sectionDiv);
    });
  };

  // Создаем опции на текущем языке
  createFilterOptions(currentLang);

  // Кнопки действий
  const actionsContainer = document.createElement('div');
  actionsContainer.className = 'filter-actions';

  const resetBtn = document.createElement('button');
  resetBtn.className = 'filter-action-btn reset';
  resetBtn.textContent = getTranslation('buttons.reset', currentLang);
  
  const applyBtn = document.createElement('button');
  applyBtn.className = 'filter-action-btn apply';
  applyBtn.textContent = getTranslation('buttons.apply', currentLang);

  actionsContainer.appendChild(resetBtn);
  actionsContainer.appendChild(applyBtn);

  // Собираем все вместе
  modalContent.appendChild(headerDiv);
  modalContent.appendChild(filtersContainer);
  modalContent.appendChild(actionsContainer);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Функция для перевода модального окна
  modal.translate = function(newLang) {
    console.log('Перевод модального окна фильтра на:', newLang);
    
    // Обновляем заголовок
    title.textContent = getTranslation('filter.title', newLang);
    closeBtn.setAttribute('aria-label', getTranslation('modal.close', newLang));
    
    // Обновляем кнопки действий
    resetBtn.textContent = ('buttons.reset', newLang);
    applyBtn.textContent = getTranslation('buttons.apply', newLang);
    
    // Обновляем опции фильтра
    createFilterOptions(newLang);
  };

  // Регистрируем модальное окно
  if (window.modalManager) {
    window.modalManager.registerModal(modal, 'character-filter');
  }

  // Обработчики событий
  closeBtn.addEventListener('click', () => {
    if (window.modalManager) {
      window.modalManager.unregisterModal(modal);
    }
    modal.remove();
  });

  resetBtn.addEventListener('click', () => {
    filtersContainer.querySelectorAll('.filter-option').forEach(btn => {
      btn.style.background = '#f8f9fa';
      btn.style.color = '#333';
      btn.style.borderColor = '#ddd';
      
      if (btn.dataset.value === '') {
        btn.style.background = '#4CAF50';
        btn.style.color = 'white';
        btn.style.borderColor = '#4CAF50';
      }
    });
  });

  applyBtn.addEventListener('click', () => {
    const newFilters = {
      element: null,
      weapon: null,
      rarity: null
    };

    const activeButtons = filtersContainer.querySelectorAll('.filter-option[style*="background: rgb(76, 175, 80)"]');
    
    if (activeButtons.length === 0) {
      characterFilters = newFilters;
    } else {
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
    }

    characterFilters = newFilters;
    renderCharacterCards(currentLang);
    updateFilterButton(currentLang);
    
    if (window.modalManager) {
      window.modalManager.unregisterModal(modal);
    }
    modal.remove();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      if (window.modalManager) {
        window.modalManager.unregisterModal(modal);
      }
      modal.remove();
    }
  });

  document.addEventListener('keydown', function closeOnEsc(e) {
    if (e.key === 'Escape') {
      if (window.modalManager) {
        window.modalManager.unregisterModal(modal);
      }
      modal.remove();
      document.removeEventListener('keydown', closeOnEsc);
    }
  });
}

// Функция для создания кнопки фильтра персонажей
export function createCharacterFilterButton() {
    console.log('Создание кнопки фильтра персонажей');
    
    const currentLang = getCurrentLang();
    const navTopBar = document.querySelector('.nav-top-bar');
    
    if (!navTopBar) {
        console.error('navTopBar не найден!');
        return;
    }

    // Удаляем существующую кнопку фильтра
    const existingFilterBtn = document.querySelector('.filter-button');
    if (existingFilterBtn) {
        console.log('Удаляем существующую кнопку фильтра');
        existingFilterBtn.remove();
    }

    // Создаем новую кнопку
    const filterBtn = document.createElement('button');
    filterBtn.className = 'filter-button';
    filterBtn.setAttribute('data-page', 'characters');
    filterBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
        </svg>
        <span>${getTranslation('filter.title')}</span>
    `;
    
    // Добавляем кнопку в навигацию
    const navLeftArea = navTopBar.querySelector('.nav-left-area');
    if (navLeftArea) {
        console.log('Добавляем кнопку фильтра в nav-left-area');
        navLeftArea.appendChild(filterBtn);
    } else {
        console.log('Создаем nav-left-area для кнопки фильтра');
        const leftArea = document.createElement('div');
        leftArea.className = 'nav-left-area';
        leftArea.style.cssText = 'display: flex; align-items: center; gap: 10px;';
        leftArea.appendChild(filterBtn);
        
        const langSwitcher = navTopBar.querySelector('.language-switcher');
        if (langSwitcher) {
            navTopBar.insertBefore(leftArea, langSwitcher);
        } else {
            navTopBar.appendChild(leftArea);
        }
    }
    
    // Обработчик клика
    filterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Клик по кнопке фильтра персонажей');
        
        createCharacterFilterModal();
    });
    
    // Обновляем состояние кнопки
    updateFilterButton(currentLang);
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

// Функция для открытия модального окна персонажа
export function openCharacterModal(charKey, char, lang = 'ru') {
  console.log('Открытие модального окна персонажа:', charKey);
  
  // Используем текущий язык из глобальной переменной
  lang = getCurrentLang();
  
  localStorage.setItem('selectedCharacter', JSON.stringify({
    key: charKey,
    data: char,
    lang: lang
  }));
  
  const existingModal = document.querySelector('.character-modal');
  if (existingModal) existingModal.remove();
  
  const modal = document.createElement('div');
  modal.className = 'character-modal';

  // Создаем элементы модального окна
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-btn';
  closeBtn.textContent = '×';
  closeBtn.setAttribute('aria-label', getTranslation('modal.close', lang));
  
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

  // Функция для создания кнопок секций
  const createSectionButtons = (currentLang) => {
    buttonsContainer.innerHTML = '';
    
    const sections = [
      { 
        id: 'materials', 
        label: getTranslation('character.allMaterials', currentLang), 
        icon: '📦' 
      },
      { 
        id: 'info', 
        label: getTranslation('character.info', currentLang), 
        icon: 'ℹ️' 
      },
      { 
        id: 'guide', 
        label: getTranslation('character.guide', currentLang), 
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
        
        if (section.id === 'materials') {
          setTimeout(() => {
            openMaterialsSetupModal(char, currentLang, null);
          }, 100);
        } else {
          navigateToCharacterPage(section.id, char, currentLang);
        }
      });
      
      buttonsContainer.appendChild(sectionBtn);
    });
  };

  // Создаем кнопки на текущем языке
  createSectionButtons(lang);

  modalContent.appendChild(closeBtn);
  modalContent.appendChild(avatarContainer);
  modalContent.appendChild(buttonsContainer);
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Функция для перевода модального окна
  modal.translate = function(newLang) {
    console.log('Перевод модального окна персонажа на:', newLang);
    
    // Обновляем имя персонажа
    const newCharName = char[`${newLang}_name`] || char.en_name;
    title.textContent = newCharName;
    avatarImg.alt = newCharName;
    
    // Обновляем aria-label кнопки закрытия
    closeBtn.setAttribute('aria-label', getTranslation('modal.close', newLang));
    
    // Обновляем кнопки секций
    createSectionButtons(newLang);
  };

  // Регистрируем модальное окно
  if (window.modalManager) {
    window.modalManager.registerModal(modal);
  }

  // Обработчики событий
  closeBtn.addEventListener('click', () => {
    if (window.modalManager) {
      window.modalManager.unregisterModal(modal);
    }
    modal.remove();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      if (window.modalManager) {
        window.modalManager.unregisterModal(modal);
      }
      modal.remove();
    }
  });
  
  document.addEventListener('keydown', function closeOnEsc(e) {
    if (e.key === 'Escape') {
      if (window.modalManager) {
        window.modalManager.unregisterModal(modal);
      }
      modal.remove();
      document.removeEventListener('keydown', closeOnEsc);
    }
  });
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
      ">×</button>
      
      <div style="margin-bottom: 20px;">
        <div style="font-size: 48px; color: #2196F3; margin-bottom: 10px;">💾</div>
        <h3 style="color: #333; margin-bottom: 10px;">
          ${translationsObj['loadSave.title'] || 'Загрузить сохраненные данные?'}
        </h3>
        <p class="modal-description" style="color: #666; margin-bottom: 5px;">
          ${(translationsObj['loadSave.description'] || 
            'Для <strong>{characterName}</strong> найдено сохранение от <strong>{saveDate}</strong>')
            .replace('{characterName}', `<strong style="color: #333;">${charName}</strong>`)
            .replace('{saveDate}', `<strong style="color: #333;">${saveDate}</strong>`)}
        </p>
      </div>
      
      <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin: 20px 0; text-align: left;">
        <p class="existing-data-title" style="font-weight: bold; margin-bottom: 10px; color: #555;">
          ${translationsObj['loadSaveOption.existingData'] || 'Текущие сохраненные данные:'}
        </p>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div class="info-item" style="display: flex; justify-content: space-between;">
            <span class="label" style="color: #777;">
              ${translationsObj['loadSave.level'] || 'Уровень:'}
            </span>
            <span style="font-weight: bold; color: #333;">${existingSave.level || 1}</span>
          </div>
          <div class="info-item" style="display: flex; justify-content: space-between;">
            <span class="label" style="color: #777;">
              ${translationsObj['loadSave.attack'] || 'Атака:'}
            </span>
            <span style="font-weight: bold; color: #333;">${existingSave.attackLevel || 1}</span>
          </div>
          <div class="info-item" style="display: flex; justify-content: space-between;">
            <span class="label" style="color: #777;">
              ${translationsObj['loadSave.skill'] || 'Навык:'}
            </span>
            <span style="font-weight: bold; color: #333;">${existingSave.skillLevel || 1}</span>
          </div>
          <div class="info-item" style="display: flex; justify-content: space-between;">
            <span class="label" style="color: #777;">
              ${translationsObj['loadSave.explosion'] || 'Взрыв:'}
            </span>
            <span style="font-weight: bold; color: #333;">${existingSave.explosionLevel || 1}</span>
          </div>
          ${materialsCount > 0 ? `
            <div class="info-item" style="display: flex; justify-content: space-between;">
              <span class="label" style="color: #777;">
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
        ">
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
        ">
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
      modal.remove();
      resolve('new');
    });
    
    modalContent.querySelector('#option-load').addEventListener('click', () => {
      if (window.modalManager) {
        window.modalManager.unregisterModal(modal);
      }
      modal.remove();
      resolve('load');
    });
    
    modalContent.querySelector('.close-btn').addEventListener('click', () => {
      if (window.modalManager) {
        window.modalManager.unregisterModal(modal);
      }
      modal.remove();
      resolve('new');
    });
    
    // Закрытие при клике вне окна
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        if (window.modalManager) {
          window.modalManager.unregisterModal(modal);
        }
        modal.remove();
        resolve('new');
      }
    });
    
    // Закрытие по клавише Esc
    document.addEventListener('keydown', function closeOnEsc(e) {
      if (e.key === 'Escape') {
        if (window.modalManager) {
          window.modalManager.unregisterModal(modal);
        }
        modal.remove();
        document.removeEventListener('keydown', closeOnEsc);
        resolve('new');
      }
    });
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
      
      // list-char.js - исправленная загрузка из профиля
      if (userChoice === 'load') {
        console.log('НЕМЕДЛЕННАЯ ЗАГРУЗКА сохраненных данных для персонажа:', character[`${lang}_name`] || character.en_name);
    
        // Устанавливаем флаги ЗАГРУЗКИ ИЗ СОХРАНЕНИЯ
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
          // ВАЖНО: устанавливаем флаги загрузки
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
    
        console.log('Данные сохранены для загрузки:', saveDataToLoad);
    
        // Переходим на страницу материалов
        history.pushState({}, '', '#/characters/mat');
    
        if (typeof window.showPage === 'function') {
          window.showPage('characters/mat');
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
  
  // Функция для получения локализованного названия таланта
  function getLocalizedTalent(talentData, currentLang) {
    if (!talentData) return '';
    
    if (typeof talentData === 'string') {
      return talentData;
    }
    
    if (typeof talentData === 'object') {
      // Проверяем, есть ли перевод на текущем языке
      if (talentData[currentLang]) {
        return talentData[currentLang];
      }
      
      // Пробуем русский, затем английский
      if (talentData.ru) {
        return talentData.ru;
      }
      
      if (talentData.en) {
        return talentData.en;
      }
      
      // Если ничего не найдено, возвращаем первое доступное значение
      const firstValue = Object.values(talentData)[0];
      return firstValue || '';
    }
    
    return '';
  }
  
  // Получаем локализованные названия талантов
  const attackName = getLocalizedTalent(character.attack, lang);
  const skillName = getLocalizedTalent(character.skill, lang);
  const explosionName = getLocalizedTalent(character.explosion, lang);
  
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
  closeBtn.setAttribute('aria-label', getTranslation('modal.close', lang) || 'Закрыть');
  
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
  title.textContent = `${charName} - ${getTranslation('talentsModal.title', lang) || 'Настройка уровней'}`;
  header.appendChild(title);

  // Добавляем кнопку закрытия в конец заголовка
  header.appendChild(closeBtn);
  
  const content = document.createElement('div');
  content.innerHTML = `
    <section class="sec">
      <article class="level">
        <div class="level-text">
          <h2 data-i18n="talentsModal.characterLevel">${getTranslation('talentsModal.characterLevel', lang) || 'Уровень персонажа'}</h2>
          <h2 class="current-level-display">${displayData.level}</h2>
        </div>
        
        <div class="range">
          <button id="minus-range" aria-label="${getTranslation('levelControls.decrease', lang) || 'Уменьшить'}">
            <svg alt="${getTranslation('levelControls.decrease', lang) || 'Уменьшить'}"><use href="#icon-minus"></use></svg>
          </button>
            
          <div>
            <input type="range" id="range" min="0" max="70" value="${displayData.rangeVal}" step="10" 
                  aria-label="${getTranslation('levelControls.slider', lang) || 'Регулировка уровня'}">
            <span id="range-value">${displayData.rangeVal}</span>
          </div>
            
          <button id="plus-range" aria-label="${getTranslation('levelControls.increase', lang) || 'Увеличить'}">
            <svg alt="${getTranslation('levelControls.increase', lang) || 'Увеличить'}"><use href="#icon-plus"></use></svg>
          </button>
        </div>
        
        <div class="basic_stat">
          <h2 data-i18n="talentsModal.talents">${getTranslation('talentsModal.talents', lang) || 'Уровни талантов'}</h2>
          
          <div class="section" data-group="attack">
            <div id="char-s1">
              ${character.s1 ? `<img src="${character.s1}" alt="Attack Icon">` : '⚔️'}
            </div>
            <div class="hp_icon">
              <p data-i18n="talentsModal.attack">${getTranslation('talentsModal.attack', lang) || 'Базовая атака'}</p>
              <h3 id="char-atack">${attackName || getTranslation('state.loading', lang) || 'Загрузка'}</h3>
            </div>
            <div class="level-group">
              <button class="arrow left" aria-label="${getTranslation('levelControls.decrease', lang) || 'Уменьшить'}">&lt;</button>
              <span class="level-value">${displayData.attackLevel}</span>
              <button class="arrow right" aria-label="${getTranslation('levelControls.increase', lang) || 'Увеличить'}">&gt;</button>
            </div>
          </div>
          
          <div class="section" data-group="skill">
            <div id="char-s2">
              ${character.s2 ? `<img src="${character.s2}" alt="Skill Icon">` : '🌀'}
            </div>
            <div class="atk_icon">
              <p data-i18n="talentsModal.skill">${getTranslation('talentsModal.skill', lang) || 'Элементальный навык'}</p>
              <h3 id="char-skill">${skillName || getTranslation('state.loading', lang) || 'Загрузка'}</h3>
            </div>
            <div class="level-group">
              <button class="arrow left" aria-label="${getTranslation('levelControls.decrease', lang) || 'Уменьшить'}">&lt;</button>
              <span class="level-value">${displayData.skillLevel}</span>
              <button class="arrow right" aria-label="${getTranslation('levelControls.increase', lang) || 'Увеличить'}">&gt;</button>
            </div>
          </div>
          
          <div class="section" data-group="explosion">
            <div id="char-s3">
              ${character.s3 ? `<img src="${character.s3}" alt="Explosion Icon">` : '💥'}
            </div>
            <div class="atk_icon">
              <p data-i18n="talentsModal.explosion">${getTranslation('talentsModal.explosion', lang) || 'Взрыв стихии'}</p>
              <h3 id="char-explosion">${explosionName || getTranslation('state.loading', lang) || 'Загрузка'}</h3>
            </div>
            <div class="level-group">
              <button class="arrow left" aria-label="${getTranslation('levelControls.decrease', lang) || 'Уменьшить'}">&lt;</button>
              <span class="level-value">${displayData.explosionLevel}</span>
              <button class="arrow right" aria-label="${getTranslation('levelControls.increase', lang) || 'Увеличить'}">&gt;</button>
            </div>
          </div>
        </div>
      </article>
    </section>
  `;

  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = 'display: flex; justify-content: space-between; margin-top: 30px; padding: 20px; border-top: 1px solid #eee;';

  const backButton = document.createElement('button');
  backButton.textContent = getTranslation('talentsModal.backButton', lang) || 'Назад к выбору';
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
  nextButton.textContent = getTranslation('talentsModal.continueButton', lang) || 'Продолжить';
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
  modalContent.appendChild(header);
  modalContent.appendChild(content);
  modalContent.appendChild(buttonContainer);
  
  materialsModal.appendChild(modalContent);
  document.body.appendChild(materialsModal);

  // Функция для перевода модального окна
  materialsModal.translate = function(newLang) {
    console.log('Перевод модального окна настроек материалов на язык:', newLang);
    
    const newTranslations = translations[newLang] || translations['ru'];
    const newCharName = character[`${newLang}_name`] || character.en_name;
    
    // Обновляем заголовок
    title.textContent = `${newCharName} - ${newTranslations['talentsModal.title'] || 'Настройка уровней'}`;
    
    // Обновляем тексты
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = newTranslations[key];
        if (text) {
            el.textContent = text;
        }
    });
    
    // Обновляем aria-лейблы
    closeBtn.setAttribute('aria-label', newTranslations['modal.close'] || 'Закрыть');
    
    // Обновляем названия талантов
    const attackElement = document.getElementById('char-atack');
    const skillElement = document.getElementById('char-skill');
    const explosionElement = document.getElementById('char-explosion');
    
    if (attackElement) {
      const newAttackName = getLocalizedTalent(character.attack, newLang);
      attackElement.textContent = newAttackName || newTranslations['state.loading'] || 'Загрузка';
    }
    
    if (skillElement) {
      const newSkillName = getLocalizedTalent(character.skill, newLang);
      skillElement.textContent = newSkillName || newTranslations['state.loading'] || 'Загрузка';
    }
    
    if (explosionElement) {
      const newExplosionName = getLocalizedTalent(character.explosion, newLang);
      explosionElement.textContent = newExplosionName || newTranslations['state.loading'] || 'Загрузка';
    }
    
    // Обновляем кнопки
    backButton.textContent = newTranslations['talentsModal.backButton'] || 'Назад к выбору';
    nextButton.textContent = newTranslations['talentsModal.continueButton'] || 'Продолжить';
    
    // Обновляем aria-лейблы для кнопок слайдера
    const minusRangeBtn = document.getElementById('minus-range');
    const plusRangeBtn = document.getElementById('plus-range');
    const rangeInput = document.getElementById('range');
    
    if (minusRangeBtn) {
      minusRangeBtn.setAttribute('aria-label', newTranslations['levelControls.decrease'] || 'Уменьшить');
      const svg = minusRangeBtn.querySelector('svg');
      if (svg) {
        svg.setAttribute('alt', newTranslations['levelControls.decrease'] || 'Уменьшить');
      }
    }
    
    if (plusRangeBtn) {
      plusRangeBtn.setAttribute('aria-label', newTranslations['levelControls.increase'] || 'Увеличить');
      const svg = plusRangeBtn.querySelector('svg');
      if (svg) {
        svg.setAttribute('alt', newTranslations['levelControls.increase'] || 'Увеличить');
      }
    }
    
    if (rangeInput) {
      rangeInput.setAttribute('aria-label', newTranslations['levelControls.slider'] || 'Регулировка уровня');
    }
    
    // Обновляем кнопки стрелок талантов
    document.querySelectorAll('.arrow.left').forEach(arrow => {
      arrow.setAttribute('aria-label', newTranslations['levelControls.decrease'] || 'Уменьшить');
    });
    
    document.querySelectorAll('.arrow.right').forEach(arrow => {
      arrow.setAttribute('aria-label', newTranslations['levelControls.increase'] || 'Увеличить');
    });
  };

  // Не забудьте зарегистрировать модальное окно в modalManager
  if (window.modalManager) {
    window.modalManager.registerModal(materialsModal, 'materials-setup');
  }

  setTimeout(() => {
    addSliderFunctionality();
  }, 100);

  // Закрытие модального окна при клике вне его
  materialsModal.addEventListener('click', (e) => {
    if (e.target === materialsModal) {
      if (window.modalManager) {
        window.modalManager.unregisterModal(materialsModal);
      }
      materialsModal.remove();
      // Возвращаемся к окну выбора персонажа
      setTimeout(() => {
        openCharacterModal(character.key || 'unknown', character, lang);
      }, 100);
    }
  });
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

// Добавляем слушатель для смены языка
function setupLanguageChangeListener() {
  document.addEventListener('languageChanged', (e) => {
    const newLang = e.detail.lang;
    console.log('Смена языка в list-char.js на:', newLang);
    
    // Обновляем имена персонажей в карточках
    updateCharacterCardsLanguage(newLang);
    
    // Обновляем кнопку фильтра
    updateFilterButton(newLang);
  });
}

// Инициализация слушателя
setupLanguageChangeListener();

// Экспортируем глобальные переменные
export { characterFilters };

// Добавляем функции в глобальную область
if (typeof window !== 'undefined') {
    window.renderCharacterCards = renderCharacterCards;
    window.createCharacterFilterButton = createCharacterFilterButton;
    window.createCharacterFilterModal = createCharacterFilterModal;
    window.openCharacterModal = openCharacterModal;
    window.resetCharacterFilters = resetCharacterFilters;
    window.updateCharacterCardsLanguage = updateCharacterCardsLanguage;
    window.updateFilterButton = updateFilterButton;
    window.characterFilters = characterFilters;
    
    console.log('list-char.js функции добавлены в window');
}