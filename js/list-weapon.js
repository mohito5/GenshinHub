// list-weapon.js - версия для оружия
import { weaponsData } from './weaponData.js';
import { translations } from './translations.js';
import { materialsInfo } from './materialsData.js';

let weaponFilters = {  // Изменено имя переменной
  weaponType: null,
  rarity: null,
  stats: null
};

// Добавить функцию для сброса фильтров при инициализации страницы
function resetWeaponFiltersOnPageLoad() {
  // Проверяем, находимся ли мы на странице оружия
  const isWeaponPage = window.location.hash.includes('weapon') || 
                       document.querySelector('.page.weapon');
  
  if (!isWeaponPage) {
    weaponFilters = {
      weaponType: null,
      rarity: null,
      stats: null
    };
    console.log('Фильтры оружия сброшены (не на странице оружия)');
  }
}

// Получаем текущий язык
function getCurrentLang() {
  return window.currentLang || 'ru';
}

// Основная функция рендеринга карточек оружия
export function renderWeaponCards(currentLang = getCurrentLang(), filters = weaponFilters) {
  const container = document.querySelector('.weapons-cards-container');
  if (!container) {
    // Если контейнера нет, значит мы не на странице оружия
    weaponFilters = {
      weaponType: null,
      rarity: null,
      stats: null
    };
    return;
  }

  container.innerHTML = '';

  const filteredWeapons = Object.entries(weaponsData).filter(([key, data]) => {
    if (filters.weaponType && data.weaponType !== filters.weaponType) {
      return false;
    }

    if (filters.rarity && data.rarity !== parseInt(filters.rarity)) {
      const weaponRarity = parseInt(data.rarity);
      if (weaponRarity !== filters.rarity) {
        return false;
      }
    }

    if (filters.stats && data.mainStatType !== filters.stats) {
      return false;
    }

    return true;
  });

  if (filteredWeapons.length === 0) {
    const errorMessage = translations[currentLang]?.errors?.noResults || 'Нет оружия, соответствующего фильтрам';
    container.innerHTML = `<p class="no-results">${errorMessage}</p>`;
    updateWeaponCount(0);
    return;
  }

  filteredWeapons.forEach(([key, data]) => {
    const article = document.createElement('article');
    article.classList.add('card-weapon');

    if (data.rarity) article.classList.add(`rarity-${data.rarity}`);
    if (data.weaponType) article.classList.add(`type-${data.weaponType.toLowerCase()}`);
    article.classList.add('all');

    article.setAttribute('data-name', key);
    article.setAttribute('data-lang', currentLang);

    const link = document.createElement('a');
    link.href = '#';
    link.className = 'link-to-weapon';
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const currentLang = getCurrentLang();
      localStorage.setItem('selectedWeapon', JSON.stringify({
        key: key,
        data: data,
        lang: currentLang
      }));
      
      openWeaponModal(key, data, currentLang);
    });

    // Аватар оружия
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'weapon-avatar';
    const img = document.createElement('img');
    img.src = data.avatar || data.icon || '/images/weapons/default.png';
    
    const weaponName = data[`${currentLang}_name`] || data.en_name;
    img.alt = weaponName;
    
    avatarDiv.appendChild(img);
    link.appendChild(avatarDiv);

    // Название оружия
    const nameSpan = document.createElement('span');
    nameSpan.className = 'weapon-name';
    const nameP = document.createElement('p');
    nameP.textContent = weaponName;
    nameSpan.appendChild(nameP);
    link.appendChild(nameSpan);

    article.appendChild(link);
    container.appendChild(article);
  });

  updateWeaponCount(filteredWeapons.length);
}

// Функция для обновления счетчика оружия
function updateWeaponCount(count) {
  let counterElement = document.querySelector('.weapon-counter');
  
  if (!counterElement) {
    const header = document.querySelector('.page.weapon h1');
    if (header) {
      counterElement = document.createElement('span');
      counterElement.className = 'weapon-counter';
      header.appendChild(counterElement);
    }
  }
  
  if (counterElement) {
    counterElement.textContent = ` (${count})`;
  }
}

// Функция для сброса фильтров оружия
export function resetWeaponFilters(currentLang = getCurrentLang()) {
  weaponFilters = {
    weaponType: null,
    rarity: null,
    stats: null
  };
  
  renderWeaponCards(currentLang);
  updateWeaponFilterButton(currentLang);
}

// Функция для обновления кнопки фильтра оружия
function updateWeaponFilterButton(currentLang = getCurrentLang()) {
  const filterBtn = document.querySelector('.filter-button');
  if (!filterBtn) return;
  
  const hasActiveFilters = Object.values(weaponFilters).some(filter => filter !== null);
  const translationsObj = translations[currentLang] || translations['ru'];
  
  const originalHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
    </svg>
    <span>${translationsObj['filter.weaponTitle'] || 'Фильтр оружия'}</span>
  `;
  
  if (hasActiveFilters) {
    filterBtn.classList.add('active');
    filterBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
        <circle cx="12" cy="12" r="3" class="filter-indicator"/>
      </svg>
      <span>${translationsObj['filter.weaponTitle'] || 'Фильтр оружия'}</span>
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
        resetWeaponFilters(currentLang);
      });
    }
    
  } else {
    filterBtn.classList.remove('active');
    filterBtn.innerHTML = originalHTML;
    filterBtn.style.background = 'var(--dark)';
  }
}

// Функция для создания модального окна фильтра оружия
export function createWeaponFilterModal() {
  console.log('Создание модального окна фильтра для оружия');

  // Закрываем все другие модальные окна фильтров
  if (window.modalManager) {
    window.modalManager.closeAllByType('filter');
  }
  
  const currentLang = getCurrentLang();
  const translationsObj = translations[currentLang] || translations['ru'];
  
  // Удаляем только фильтры оружия
  const existingModal = document.querySelector('.weapon-filter-modal');
  if (existingModal) existingModal.remove();
  
  const weaponTypes = new Set();
  const rarities = new Set();
  const stats = new Set();
  
  Object.values(weaponsData).forEach(weapon => {
    if (weapon.weaponType) weaponTypes.add(weapon.weaponType);
    if (weapon.rarity) rarities.add(weapon.rarity);
    if (weapon.mainStatType) stats.add(weapon.mainStatType);
  });

  const modal = document.createElement('div');
  modal.className = 'weapon-filter-modal';

  // Регистрируем с типом
  if (window.modalManager) {
    window.modalManager.registerModal(modal, 'weapon-filter');
  }

  const modalContent = document.createElement('div');
  modalContent.className = 'filter-modal-content weapon-filter-content';

  const headerDiv = document.createElement('div');
  headerDiv.className = 'filter-modal-header';
  
  const title = document.createElement('h2');
  title.textContent = translationsObj['filter.weaponTitle'] || 'Фильтр оружия';
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'filter-close-btn';
  closeBtn.innerHTML = '×';
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
      title: translationsObj['filter.weaponType'] || 'Тип оружия',
      key: 'weaponType',
      options: Array.from(weaponTypes).sort(),
      current: weaponFilters.weaponType
    },
    {
      title: translationsObj['filter.rarity'] || 'Редкость',
      key: 'rarity',
      options: Array.from(rarities).sort((a, b) => b - a),
      current: weaponFilters.rarity
    },
    {
      title: translationsObj['filter.mainStat'] || 'Основная характеристика',
      key: 'stats',
      options: Array.from(stats).sort(),
      current: weaponFilters.stats
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
      if (section.key === 'weaponType') {
        displayText = translationsObj['weapons']?.[option] || option;
      } else if (section.key === 'rarity') {
        displayText = '★'.repeat(option);
      } else if (section.key === 'stats') {
        displayText = translationsObj['stats']?.[option] || option;
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
      weaponType: null,
      rarity: null,
      stats: null
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

    weaponFilters = newFilters;
    renderWeaponCards(currentLang);
    updateWeaponFilterButton(currentLang);
    
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
      title.textContent = newTranslations['filter.weaponTitle'] || 'Фильтр оружия';
    }
    
    const sectionTitles = modalContent.querySelectorAll('h3');
    if (sectionTitles.length >= 3) {
      sectionTitles[0].textContent = newTranslations['filter.weaponType'] || 'Тип оружия';
      sectionTitles[1].textContent = newTranslations['filter.rarity'] || 'Редкость';
      sectionTitles[2].textContent = newTranslations['filter.mainStat'] || 'Основная характеристика';
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
      if (type === 'weaponType') {
        displayText = newTranslations['weapons']?.[value] || value;
      } else if (type === 'rarity') {
        displayText = '★'.repeat(value);
      } else if (type === 'stats') {
        displayText = newTranslations['stats']?.[value] || value;
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

// Функция для создания кнопки фильтра оружия
// Функция для создания кнопки фильтра оружия
export function createWeaponFilterButton() {
  const currentLang = getCurrentLang();
  const translationsObj = translations[currentLang] || translations['ru'];
  const navTopBar = document.querySelector('.nav-top-bar');
  if (!navTopBar) return;

  // Сбрасываем фильтры при создании кнопки
  resetWeaponFiltersOnPageLoad();

  // Удаляем существующую кнопку фильтра, если она есть
  let existingFilterBtn = document.querySelector('.filter-button');
  if (existingFilterBtn) {
    existingFilterBtn.remove();
  }
  
  // Создаем новую кнопку
  const filterBtn = document.createElement('button');
  filterBtn.className = 'filter-button weapon-filter';
  filterBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
    </svg>
    <span>${translationsObj['filter.weaponTitle'] || 'Фильтр оружия'}</span>
  `;
  
  // Добавляем data-атрибут для идентификации
  filterBtn.dataset.filterType = 'weapon';
  
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
      resetWeaponFilters(currentLang);
    } else {
      createWeaponFilterModal();
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
  
  updateWeaponFilterButton(currentLang);
}

// Функция для открытия модального окна оружия
export function openWeaponModal(weaponKey, weapon, lang = getCurrentLang()) {
  console.log('Открытие модального окна оружия:', weaponKey);
  
  const translationsObj = translations[lang] || translations['ru'];
  
  localStorage.setItem('selectedWeapon', JSON.stringify({
    key: weaponKey,
    data: weapon,
    lang: lang
  }));
  
  const existingModal = document.querySelector('.weapon-modal');
  if (existingModal) existingModal.remove();
  
  const modal = document.createElement('div');
  modal.className = 'weapon-modal';

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
  avatarContainer.className = 'weapon-avatar-container';
  
  const avatarImg = document.createElement('img');
  avatarImg.src = weapon.avatar || weapon.icon;
  const weaponName = weapon[`${lang}_name`] || weapon.en_name;
  avatarImg.alt = weaponName;
  avatarContainer.appendChild(avatarImg);

  const title = document.createElement('h2');
  title.textContent = weaponName;
  avatarContainer.appendChild(title);

  // Редкость
  const rarityDiv = document.createElement('div');
  rarityDiv.className = 'weapon-modal-rarity';
  rarityDiv.textContent = '★'.repeat(weapon.rarity || 1);
  avatarContainer.appendChild(rarityDiv);

  // Тип оружия
  const typeDiv = document.createElement('div');
  typeDiv.className = 'weapon-modal-type';
  const typeText = translationsObj['weapons']?.[weapon.weaponType] || weapon.weaponType;
  typeDiv.textContent = typeText;
  avatarContainer.appendChild(typeDiv);

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
      id: 'refinement', 
      label: translationsObj['refinement'] || 'Пробуждение', 
      icon: '⭐' 
    }
  ];

  sections.forEach(section => {
    const sectionBtn = document.createElement('button');
    sectionBtn.className = 'section-btn';
    sectionBtn.dataset.section = section.id;
    
    sectionBtn.innerHTML = `${section.icon} ${section.label}`;
    
    sectionBtn.addEventListener('click', () => {
      if (section.id === 'materials') {
        openWeaponMaterialsSetupModal(weapon, lang, modal);
      } else {
        if (window.modalManager) {
          window.modalManager.unregisterModal(modal);
        }
        modal.remove();
        navigateToWeaponPage(section.id, weapon, lang);
      }
    });
    
    buttonsContainer.appendChild(sectionBtn);
  });

  modalContent.appendChild(closeBtn);
  modalContent.appendChild(avatarContainer);
  modalContent.appendChild(buttonsContainer);
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Добавляем слушатель для смены языка
  const languageChangeHandler = (e) => {
    const newLang = e.detail.lang;
    const newTranslations = translations[newLang] || translations['ru'];
    
    const newWeaponName = weapon[`${newLang}_name`] || weapon.en_name;
    title.textContent = newWeaponName;
    avatarImg.alt = newWeaponName;
    
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
        id: 'refinement', 
        label: newTranslations['refinement'] || 'Пробуждение', 
        icon: '⭐' 
      }
    ];
    
    buttonsContainer.querySelectorAll('.section-btn').forEach((btn, index) => {
      if (updatedSections[index]) {
        btn.innerHTML = `${updatedSections[index].icon} ${updatedSections[index].label}`;
      }
    });
    
    closeBtn.setAttribute('aria-label', newTranslations['misc.close'] || 'Закрыть');
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
  
  const originalRemove = modal.remove;
  modal.remove = function() {
    if (window.modalManager) {
      window.modalManager.unregisterModal(modal);
    }
    document.removeEventListener('languageChange', languageChangeHandler);
    originalRemove.call(this);
  };
}

// Функция для навигации на страницу оружия
function navigateToWeaponPage(section, weapon, lang) {
  let targetPage;
  
  switch(section) {
    case 'materials':
      targetPage = 'weapon/mat';
      break;
    case 'info':
      targetPage = 'weapon/info';
      break;
    case 'refinement':
      targetPage = 'weapon/refinement';
      break;
    default:
      targetPage = 'weapon';
  }
  
  localStorage.setItem('selectedWeapon', JSON.stringify({
    key: weapon.key,
    data: weapon,
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

// Функция для открытия модального окна материалов оружия
// Функция для открытия модального окна материалов оружия
export function openWeaponMaterialsSetupModal(weapon, lang = getCurrentLang(), parentModal) {
  if (parentModal) parentModal.remove();

  const existingModal = document.querySelector('.weapon-materials-setup-modal');
  if (existingModal) existingModal.remove();

  const materialsModal = document.createElement('div');
  materialsModal.className = 'weapon-materials-setup-modal';

  if (window.modalManager) {
    window.modalManager.registerModal(materialsModal);
  }

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-btn';
  closeBtn.textContent = '×';
  
  closeBtn.addEventListener('click', () => {
    if (window.modalManager) {
      window.modalManager.unregisterModal(materialsModal);
    }
    materialsModal.remove();
    setTimeout(() => {
      openWeaponModal(weapon.key, weapon, lang);
    }, 100);
  });

  const header = document.createElement('div');
  header.className = 'modal-header';

  if (weapon.avatar || weapon.icon) {
    const avatarImg = document.createElement('img');
    avatarImg.src = weapon.avatar || weapon.icon;
    const weaponName = weapon[`${lang}_name`] || weapon.en_name;
    avatarImg.alt = weaponName;
    avatarImg.style.cssText = 'width: 60px; height: 60px; margin-right: 15px;';
    header.appendChild(avatarImg);
  }

  const title = document.createElement('h2');
  const weaponName = weapon[`${lang}_name`] || weapon.en_name;
  title.textContent = `${weaponName} - Настройка уровня`;
  title.style.margin = '0';
  header.appendChild(title);
  
  header.style.cssText = 'display: flex; align-items: center;';

  const content = document.createElement('div');
  content.innerHTML = `
    <section class="weapons sec">
      <div id="weapon-icon" style="text-align: center; margin: 20px 0;">
        ${weapon.avatar || weapon.icon ? `<img src="${weapon.avatar || weapon.icon}" alt="${weaponName}" style="width: 100px; height: 100px;">` : ''}
      </div>
      <h1 id="weapon-name" style="text-align: center;">${weaponName}</h1>
      <div style="text-align: center; margin: 10px 0;">
        <span style="color: gold; font-size: 20px;">${'★'.repeat(weapon.rarity || 1)}</span>
        <span style="margin-left: 10px; color: #666;">${translations[lang]?.['weapons']?.[weapon.weaponType] || weapon.weaponType}</span>
      </div>
    </section>
    
    <section class="sec">
      <article class="level">
        <div style="margin-bottom: 20px; text-align: center;">
          <h2 style="margin-bottom: 10px;">Уровень оружия</h2>
          <h2 class="current-level-display" style="font-size: 36px; color: #4CAF50;">1</h2>
        </div>
        
        <div class="level" style="margin: 25px 0;">
          <div class="range" style="display: flex; align-items: center; justify-content: center; gap: 15px; flex-wrap: wrap;">
            <button id="minus-range" aria-label="Уменьшить" style="background: #6c757d; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-size: 18px;">
              <img src="./assets/minus.svg" alt="Уменьшить" style="width: 20px; height: 20px;">
            </button>
            
            <div style="display: flex; align-items: center; gap: 15px;">
              <input type="range" id="range" min="0" max="70" value="0" step="10" 
                     aria-label="Регулировка уровня"
                     style="width: 200px;">
              <span id="range-value" style="font-size: 18px; font-weight: bold; min-width: 30px;">0</span>
            </div>
            
            <button id="plus-range" aria-label="Увеличить" style="background: #28a745; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-size: 18px;">
              <img src="./assets/plus.svg" alt="Увеличить" style="width: 20px; height: 20px;">
            </button>
          </div>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: #f9f9f9; border-radius: 10px;">
          <h3 style="margin-bottom: 15px; text-align: center;">Уровень пробуждения</h3>
          <div class="refinement-level" style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-top: 15px;">
            <button class="refinement-minus" style="background: #6c757d; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-size: 18px;">-</button>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span class="refinement-value" style="font-size: 24px; font-weight: bold;">1</span>
              <span style="color: #666;">/ 5</span>
            </div>
            <button class="refinement-plus" style="background: #28a745; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-size: 18px;">+</button>
          </div>
          <p style="text-align: center; margin-top: 10px; color: #666; font-size: 14px;">
            Уровень пробуждения влияет на пассивную способность оружия
          </p>
        </div>
      </article>
    </section>
    
    <div id="weapon-description" style="margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 10px; border-left: 4px solid #4CAF50;">
      <h3 style="margin-top: 0; color: #333;">Описание оружия</h3>
      <p style="margin: 0; line-height: 1.6;">${weapon[`${lang}_description`] || weapon.description || 'Описание отсутствует'}</p>
    </div>
  `;

  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = 'display: flex; justify-content: space-between; margin-top: 30px; padding: 20px; border-top: 1px solid #eee;';

  const backButton = document.createElement('button');
  backButton.textContent = 'Назад к выбору';
  backButton.style.cssText = 'background: #6c757d; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer;';
  
  backButton.addEventListener('click', () => {
    if (window.modalManager) {
      window.modalManager.unregisterModal(materialsModal);
    }
    materialsModal.remove();
    setTimeout(() => {
      openWeaponModal(weapon.key, weapon, lang);
    }, 100);
  });

  const nextButton = document.createElement('button');
  nextButton.textContent = 'Продолжить';
  nextButton.className = 'next';
  nextButton.id = 'next-btn';
  nextButton.style.cssText = 'background: #2196F3; color: white; border: none; padding: 12px 30px; border-radius: 5px; cursor: pointer; font-weight: bold;';
  
  nextButton.addEventListener('click', () => {
    const weaponName = weapon[`${lang}_name`] || weapon.en_name;
    const rangeValue = parseInt(document.getElementById('range')?.value) || 0;
    const level = parseInt(document.querySelector('.current-level-display')?.textContent) || 1;
    const refinementLevel = parseInt(document.querySelector('.refinement-value')?.textContent) || 1;

    const dataToSave = {
      weaponName,
      weaponKey: weapon.key,
      rangeVal: rangeValue,
      level: level,
      refinementLevel: refinementLevel,
      timestamp: Date.now(),
      weaponData: {
        key: weapon.key,
        ...weapon
      },
      lang: lang,
      fullWeaponData: weapon
    };
    
    localStorage.setItem('weaponLevelData', JSON.stringify(dataToSave));
    localStorage.setItem('weaponData', JSON.stringify(dataToSave));
    localStorage.setItem('selectedWeapon', JSON.stringify({
      key: weapon.key,
      data: weapon,
      lang: lang
    }));

    console.log('Данные оружия сохранены:', dataToSave);
    
    if (window.modalManager) {
      window.modalManager.unregisterModal(materialsModal);
    }
    materialsModal.remove();

    navigateToWeaponPage('materials', weapon, lang);
  });

  buttonContainer.appendChild(backButton);
  buttonContainer.appendChild(nextButton);

  modalContent.appendChild(closeBtn);
  modalContent.appendChild(header);
  modalContent.appendChild(content);
  modalContent.appendChild(buttonContainer);
  materialsModal.appendChild(modalContent);
  document.body.appendChild(materialsModal);

  // Добавляем функциональность слайдера
  setTimeout(() => {
    addWeaponSliderFunctionality();
  }, 100);

  // Функциональность пробуждения
  const refinementMinus = materialsModal.querySelector('.refinement-minus');
  const refinementPlus = materialsModal.querySelector('.refinement-plus');
  const refinementValue = materialsModal.querySelector('.refinement-value');

  if (refinementMinus && refinementPlus && refinementValue) {
    refinementMinus.addEventListener('click', () => {
      let value = parseInt(refinementValue.textContent);
      if (value > 1) {
        value--;
        refinementValue.textContent = value;
      }
    });

    refinementPlus.addEventListener('click', () => {
      let value = parseInt(refinementValue.textContent);
      if (value < 5) {
        value++;
        refinementValue.textContent = value;
      }
    });
  }

  materialsModal.addEventListener('click', (e) => {
    if (e.target === materialsModal) {
      if (window.modalManager) {
        window.modalManager.unregisterModal(materialsModal);
      }
      materialsModal.remove();
      setTimeout(() => {
        openWeaponModal(weapon.key, weapon, lang);
      }, 100);
    }
  });
}

// Функция для добавления функционала слайдера оружия
function addWeaponSliderFunctionality() {
  const rangeInput = document.getElementById('range');
  const rangeValueSpan = document.getElementById('range-value');
  const currentLevelDisplay = document.querySelector('.current-level-display');
  const minusRangeBtn = document.getElementById('minus-range');
  const plusRangeBtn = document.getElementById('plus-range');

  if (!rangeInput || !rangeValueSpan || !currentLevelDisplay) return;

  function getWeaponLevel(value) {
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

  function updateRange(val) {
    const minVal = parseInt(rangeInput.min);
    const maxVal = parseInt(rangeInput.max);
    if (val < minVal) val = minVal;
    if (val > maxVal) val = maxVal;

    rangeInput.value = val;
    rangeValueSpan.textContent = val;
    currentLevelDisplay.textContent = getWeaponLevel(val);
  }

  const initialRangeValue = parseInt(rangeInput.value) || 0;
  rangeValueSpan.textContent = initialRangeValue;
  currentLevelDisplay.textContent = getWeaponLevel(initialRangeValue);

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
    currentLevelDisplay.textContent = getWeaponLevel(val);
  });
}


export { weaponFilters };
window.weaponFilters = weaponFilters;