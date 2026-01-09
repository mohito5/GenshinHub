// weapon-pages.js
import { weaponsData } from './weaponData.js';
import { translations } from './translations.js';
import { materialsInfo, materialCategories } from './materialsData.js';

// Глобальные переменные
let currentWeapon = null;
let currentWeaponLevel = 1;
let currentRefinementLevel = 1;

// Функция для загрузки страницы материалов оружия
export function loadWeaponMaterialsPage() {
  const savedWeapon = localStorage.getItem('selectedWeapon');
  if (!savedWeapon) {
    showWeaponErrorMessage('Нет выбранного оружия');
    return;
  }

  try {
    const { key, data, lang } = JSON.parse(savedWeapon);
    currentWeapon = data;
    
    // Загружаем сохраненные уровни если есть
    const savedLevelData = JSON.parse(localStorage.getItem('weaponLevelData') || '{}');
    currentWeaponLevel = savedLevelData.level || 1;
    currentRefinementLevel = savedLevelData.refinementLevel || 1;
    
    // Обновляем интерфейс
    updateWeaponMaterialsUI(data, lang);
    renderWeaponMaterials(data, lang);
    setupWeaponLevelControls(data, lang);
    setupRefinementControls(data, lang);
    setupWeaponSaveButtons(data, lang, 'materials'); // Добавляем кнопки сохранения
    
  } catch (error) {
    console.error('Ошибка загрузки страницы материалов оружия:', error);
    showWeaponErrorMessage('Ошибка загрузки данных');
  }
}

// Обновление UI страницы материалов
function updateWeaponMaterialsUI(weapon, lang) {
  // Обновляем заголовок
  const weaponName = weapon[`${lang}_name`] || weapon.en_name;
  document.getElementById('weapon-name').textContent = weaponName;
  
  // Обновляем иконку
  const iconContainer = document.getElementById('weapon-icon');
  if (iconContainer && (weapon.avatar || weapon.icon)) {
    iconContainer.innerHTML = `<img src="${weapon.avatar || weapon.icon}" alt="${weaponName}">`;
  }
  
  // Обновляем мета-информацию
  document.getElementById('weapon-rarity').textContent = '★'.repeat(weapon.rarity || 1);
  
  const weaponTypeText = translations[lang]?.['weapons']?.[weapon.weaponType] || weapon.weaponType;
  document.getElementById('weapon-type').textContent = weaponTypeText;
  
  // Устанавливаем начальные значения
  document.getElementById('weapon-level-value').textContent = currentWeaponLevel;
  document.getElementById('refinement-level').textContent = currentRefinementLevel;
}

// Рендеринг материалов оружия
function renderWeaponMaterials(weapon, lang) {
  // Материалы для уровня оружия
  const levelMaterials = getWeaponLevelMaterials(weapon, currentWeaponLevel);
  renderWeaponMaterialsToContainer('weapon-level', levelMaterials, lang);
  
  // Материалы для пробуждения
  const refinementMaterials = getRefinementMaterials(weapon, currentRefinementLevel);
  renderWeaponMaterialsToContainer('weapon-refinement', refinementMaterials, lang);
  
  // Все материалы
  renderAllWeaponMaterials(levelMaterials, refinementMaterials, lang);
}

// Получение материалов для уровня оружия
function getWeaponLevelMaterials(weapon, level) {
  // Здесь должна быть логика расчета материалов для уровня оружия
  // На основе weapon.ascensionMaterials и level
  
  // Заглушка - вернем тестовые данные
  return {
    'weapon.ascension.mora': 25000,
    'weapon.ascension.elite': 6,
    'weapon.ascension.common': 12,
    'weapon.ascension.sliver': 3
  };
}

// Получение материалов для пробуждения
function getRefinementMaterials(weapon, refinementLevel) {
  // Материалы нужны только при повышении пробуждения
  if (refinementLevel <= 1) return {};
  
  return {
    'weapon.refinement.mora': 1000 * (refinementLevel - 1),
    'weapon.refinement.duplicate': refinementLevel - 1
  };
}

// Рендеринг материалов в контейнер
function renderWeaponMaterialsToContainer(sectionType, materials, lang) {
  const container = document.querySelector(`[data-type="${sectionType}"]`);
  if (!container) return;
  
  container.innerHTML = '';
  
  if (!materials || Object.keys(materials).length === 0) {
    container.innerHTML = `<p class="no-materials">${translations[lang]?.weapon?.noMaterials || 'Нет материалов для этого уровня'}</p>`;
    return;
  }
  
  Object.entries(materials).forEach(([materialKey, amount]) => {
    const materialElement = createWeaponMaterialElement(materialKey, amount, lang);
    container.appendChild(materialElement);
  });
}

// Создание элемента материала для оружия
function createWeaponMaterialElement(materialKey, amount, lang) {
  const div = document.createElement('div');
  div.className = 'material-item weapon-material-item';
  
  const materialInfo = getWeaponMaterialInfo(materialKey, lang);
  
  div.innerHTML = `
    <img src="${materialInfo.icon || 'assets/unknown.png'}" alt="${materialInfo.name}" class="material-icon">
    <div class="material-info">
      <span class="material-name">${materialInfo.name}</span>
      <span class="material-amount">${amount}</span>
    </div>
  `;
  
  return div;
}

// Получение информации о материале оружия
function getWeaponMaterialInfo(materialKey, lang) {
  // Ищем в materialsInfo
  const parts = materialKey.split('.');
  let materialInfo = null;
  let materialName = materialKey;
  
  if (parts.length === 2) {
    const [category, subKey] = parts;
    if (materialsInfo[category] && materialsInfo[category][subKey]) {
      materialInfo = materialsInfo[category][subKey];
      if (typeof materialInfo === 'object' && materialInfo.name) {
        if (materialInfo.name[lang]) {
          materialName = materialInfo.name[lang];
        } else if (materialInfo.name.ru) {
          materialName = materialInfo.name.ru;
        }
      }
    }
  } else if (parts.length === 3) {
    const [category, subCategory, subKey] = parts;
    if (materialsInfo[category] && materialsInfo[category][subCategory] && materialsInfo[category][subCategory][subKey]) {
      materialInfo = materialsInfo[category][subCategory][subKey];
      if (typeof materialInfo === 'object' && materialInfo.name) {
        if (materialInfo.name[lang]) {
          materialName = materialInfo.name[lang];
        } else if (materialInfo.name.ru) {
          materialName = materialInfo.name.ru;
        }
      }
    }
  }
  
  return {
    name: materialName,
    icon: (materialInfo && materialInfo.icon) || 'assets/unknown.png'
  };
}

// Рендеринг всех материалов
function renderAllWeaponMaterials(levelMats, refinementMats, lang) {
  const container = document.querySelector('[data-type="weapon-all"]');
  if (!container) return;
  
  container.innerHTML = '';
  
  const allMaterials = {};
  
  function addMaterials(materials) {
    if (!materials) return;
    
    Object.entries(materials).forEach(([key, amount]) => {
      if (amount > 0) {
        allMaterials[key] = (allMaterials[key] || 0) + amount;
      }
    });
  }
  
  addMaterials(levelMats);
  addMaterials(refinementMats);
  
  if (Object.keys(allMaterials).length === 0) {
    container.textContent = translations[lang]?.material?.none || 'Нет материалов';
    return;
  }
  
  const sortedMaterials = Object.entries(allMaterials)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
  
  sortedMaterials.forEach(([materialKey, amount]) => {
    const materialElement = createWeaponMaterialElement(materialKey, amount, lang);
    container.appendChild(materialElement);
  });
}

// Настройка контролов уровня
function setupWeaponLevelControls(weapon, lang) {
  const rangeInput = document.getElementById('weapon-range');
  const rangeValueSpan = document.getElementById('weapon-range-value');
  const levelValueSpan = document.getElementById('weapon-level-value');
  const minusBtn = document.getElementById('weapon-minus-range');
  const plusBtn = document.getElementById('weapon-plus-range');
  
  if (!rangeInput || !rangeValueSpan || !levelValueSpan) return;
  
  function getWeaponLevelFromRange(rangeVal) {
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
  
  function updateWeaponRange(val) {
    const minVal = parseInt(rangeInput.min);
    const maxVal = parseInt(rangeInput.max);
    if (val < minVal) val = minVal;
    if (val > maxVal) val = maxVal;
    
    rangeInput.value = val;
    rangeValueSpan.textContent = val;
    levelValueSpan.textContent = getWeaponLevelFromRange(val);
    
    currentWeaponLevel = getWeaponLevelFromRange(val);
    renderWeaponMaterials(weapon, lang);
  }
  
  // Устанавливаем начальное значение
  const initialRangeValue = Math.min(currentWeaponLevel * 10 / 90 * 70, 70);
  rangeInput.value = Math.round(initialRangeValue / 10) * 10;
  rangeValueSpan.textContent = rangeInput.value;
  levelValueSpan.textContent = currentWeaponLevel;
  
  if (minusBtn) {
    minusBtn.addEventListener('click', () => {
      let currentVal = parseInt(rangeInput.value);
      updateWeaponRange(currentVal - 10);
    });
  }
  
  if (plusBtn) {
    plusBtn.addEventListener('click', () => {
      let currentVal = parseInt(rangeInput.value);
      updateWeaponRange(currentVal + 10);
    });
  }
  
  rangeInput.addEventListener('input', () => {
    const val = +rangeInput.value;
    rangeValueSpan.textContent = val;
    levelValueSpan.textContent = getWeaponLevelFromRange(val);
    currentWeaponLevel = getWeaponLevelFromRange(val);
    renderWeaponMaterials(weapon, lang);
  });
}

// Настройка контролов пробуждения
function setupRefinementControls(weapon, lang) {
  const minusBtn = document.getElementById('refinement-minus');
  const plusBtn = document.getElementById('refinement-plus');
  const levelSpan = document.getElementById('refinement-level');
  const descSpan = document.getElementById('current-refinement-desc');
  
  if (!minusBtn || !plusBtn || !levelSpan) return;
  
  function updateRefinementLevel(level) {
    if (level < 1) level = 1;
    if (level > 5) level = 5;
    
    levelSpan.textContent = level;
    currentRefinementLevel = level;
    
    // Обновляем описание пробуждения
    if (descSpan && weapon.passiveAbility) {
      const refinements = weapon.passiveAbility.refinements || [];
      if (refinements[level - 1]) {
        descSpan.textContent = refinements[level - 1];
      }
    }
    
    renderWeaponMaterials(weapon, lang);
  }
  
  minusBtn.addEventListener('click', () => {
    let level = parseInt(levelSpan.textContent);
    updateRefinementLevel(level - 1);
  });
  
  plusBtn.addEventListener('click', () => {
    let level = parseInt(levelSpan.textContent);
    updateRefinementLevel(level + 1);
  });
  
  // Устанавливаем начальное значение
  updateRefinementLevel(currentRefinementLevel);
}

// Настройка кнопок сохранения для страницы материалов
function setupWeaponSaveButtons(weapon, lang, pageType = 'materials') {
  const container = pageType === 'materials' 
    ? document.getElementById('weapon-save-container') 
    : document.getElementById('weapon-info-save-container');
  
  if (!container) {
    console.error('Контейнер для кнопок сохранения не найден');
    return;
  }
  
  container.innerHTML = '';
  
  const translationsObj = translations[lang] || translations['ru'];
  
  // Проверяем, есть ли уже сохранение для этого оружия
  const savedWeapons = JSON.parse(localStorage.getItem('savedWeapons') || '[]');
  const existingSaveIndex = savedWeapons.findIndex(save => save.weaponKey === weapon.key);
  const hasExistingSave = existingSaveIndex !== -1;
  
  if (hasExistingSave) {
    // Кнопка "Обновить сохранение"
    const updateButton = document.createElement('button');
    updateButton.className = 'save-btn update';
    updateButton.id = 'update-weapon-save-btn';
    
    updateButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
      </svg>
      <span>${translationsObj['buttons.update'] || 'Обновить'}</span>
    `;
    
    updateButton.addEventListener('click', () => {
      updateWeaponSave(weapon, lang);
    });
    
    // Кнопка "Удалить сохранение"
    const deleteButton = document.createElement('button');
    deleteButton.className = 'save-btn delete';
    deleteButton.id = 'delete-weapon-save-btn';
    
    deleteButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
      </svg>
      <span>${translationsObj['buttons.delete'] || 'Удалить'}</span>
    `;
    
    deleteButton.addEventListener('click', () => {
      showDeleteWeaponSaveConfirm(weapon, lang);
    });
    
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'save-button-group';
    buttonGroup.style.cssText = 'display: flex; gap: 10px; justify-content: center;';
    
    buttonGroup.appendChild(updateButton);
    buttonGroup.appendChild(deleteButton);
    container.appendChild(buttonGroup);
    
  } else {
    // Кнопка "Сохранить в профиль"
    const saveButton = document.createElement('button');
    saveButton.className = 'save-btn primary';
    saveButton.id = 'save-weapon-btn';
    
    saveButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
        <polyline points="17 21 17 13 7 13 7 21"/>
        <polyline points="7 3 7 8 15 8"/>
      </svg>
      <span>${translationsObj['buttons.saveToProfile'] || 'Сохранить в профиль'}</span>
    `;
    
    saveButton.addEventListener('click', () => {
      saveWeaponToProfile(weapon, lang);
    });
    
    container.appendChild(saveButton);
  }
  
  // Добавляем кнопку "Посмотреть все сохранения"
  const viewSavedButton = document.createElement('button');
  viewSavedButton.className = 'save-btn secondary';
  viewSavedButton.id = 'view-saved-weapons-btn';
  
  viewSavedButton.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
    </svg>
    <span>${translationsObj['buttons.viewSaved'] || 'Мои сохранения'}</span>
  `;
  
  viewSavedButton.addEventListener('click', () => {
    history.pushState({}, '', '#/profile');
    if (typeof window.showPage === 'function') {
      window.showPage('profile');
    }
  });
  
  const viewButtonContainer = document.createElement('div');
  viewButtonContainer.style.cssText = 'margin-top: 15px; display: flex; justify-content: center;';
  viewButtonContainer.appendChild(viewSavedButton);
  
  container.appendChild(viewButtonContainer);
}

// Функция сохранения оружия в профиль
function saveWeaponToProfile(weapon, lang) {
  console.log('Сохранение оружия в профиль:', weapon.key);
  
  const weaponName = weapon[`${lang}_name`] || weapon.en_name;
  const weaponKey = weapon.key;
  
  // Получаем текущие уровни из UI
  const level = currentWeaponLevel;
  const refinementLevel = currentRefinementLevel;
  
  const saveData = {
    id: `weapon_${weaponKey}_${Date.now()}`,
    type: 'weapon',
    weaponKey: weaponKey,
    weaponName: weaponName,
    weaponType: weapon.weaponType,
    weaponRarity: weapon.rarity,
    weaponAvatar: weapon.avatar || weapon.icon,
    date: new Date().toLocaleString(),
    lastModified: Date.now(),
    level: level,
    refinementLevel: refinementLevel,
    weaponData: {
      key: weapon.key,
      ...weapon
    }
  };
  
  // Получаем существующие сохранения
  const savedWeapons = JSON.parse(localStorage.getItem('savedWeapons') || '[]');
  
  // Проверяем, есть ли уже сохранение для этого оружия
  const existingIndex = savedWeapons.findIndex(save => 
    save.type === 'weapon' && save.weaponKey === weaponKey
  );
  
  if (existingIndex !== -1) {
    // Обновляем существующее сохранение
    savedWeapons[existingIndex] = saveData;
  } else {
    // Добавляем новое сохранение
    savedWeapons.push(saveData);
  }
  
  // Сохраняем обратно
  localStorage.setItem('savedWeapons', JSON.stringify(savedWeapons));
  
  // Также сохраняем в общий массив сохраненных материалов (для совместимости)
  const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  const weaponMaterialSave = {
    id: saveData.id,
    type: 'weapon',
    charKey: weaponKey,
    characterName: weaponName,
    characterAvatar: weapon.avatar || weapon.icon,
    date: saveData.date,
    lastModified: saveData.lastModified,
    level: level,
    weaponData: saveData.weaponData
  };
  
  const existingMaterialIndex = savedMaterials.findIndex(save => 
    save.charKey === weaponKey && save.type === 'weapon'
  );
  
  if (existingMaterialIndex !== -1) {
    savedMaterials[existingMaterialIndex] = weaponMaterialSave;
  } else {
    savedMaterials.push(weaponMaterialSave);
  }
  
  localStorage.setItem('savedMaterials', JSON.stringify(savedMaterials));
  
  // Показываем уведомление
  showWeaponNotification(translations[lang]?.notifications?.saveSuccess || 'Оружие успешно сохранено в профиль!', 'success');
  
  // Обновляем кнопки на странице
  setTimeout(() => {
    setupWeaponSaveButtons(weapon, lang, 'materials');
    // Обновляем страницу профиля если она открыта
    if (typeof window.forceRefreshProfile === 'function') {
      window.forceRefreshProfile();
    }
  }, 300);
  
  console.log('Оружие сохранено:', saveData);
}

// Функция обновления сохранения оружия
function updateWeaponSave(weapon, lang) {
  console.log('Обновление сохранения оружия:', weapon.key);
  
  const savedWeapons = JSON.parse(localStorage.getItem('savedWeapons') || '[]');
  const existingIndex = savedWeapons.findIndex(save => 
    save.type === 'weapon' && save.weaponKey === weapon.key
  );
  
  if (existingIndex === -1) {
    saveWeaponToProfile(weapon, lang);
    return;
  }
  
  const weaponName = weapon[`${lang}_name`] || weapon.en_name;
  const level = currentWeaponLevel;
  const refinementLevel = currentRefinementLevel;
  
  const updatedSave = {
    ...savedWeapons[existingIndex],
    weaponName: weaponName,
    date: new Date().toLocaleString(),
    lastModified: Date.now(),
    level: level,
    refinementLevel: refinementLevel,
    weaponData: {
      key: weapon.key,
      ...weapon
    }
  };
  
  savedWeapons[existingIndex] = updatedSave;
  localStorage.setItem('savedWeapons', JSON.stringify(savedWeapons));
  
  // Также обновляем в общем массиве
  const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  const materialIndex = savedMaterials.findIndex(save => 
    save.charKey === weapon.key && save.type === 'weapon'
  );
  
  if (materialIndex !== -1) {
    savedMaterials[materialIndex] = {
      ...savedMaterials[materialIndex],
      characterName: weaponName,
      date: updatedSave.date,
      lastModified: updatedSave.lastModified,
      level: level,
      weaponData: updatedSave.weaponData
    };
    localStorage.setItem('savedMaterials', JSON.stringify(savedMaterials));
  }
  
  showWeaponNotification(translations[lang]?.notifications?.updateSuccess || 'Сохранение оружия обновлено!', 'success');
  
  setTimeout(() => {
    setupWeaponSaveButtons(weapon, lang, 'materials');
    if (typeof window.forceRefreshProfile === 'function') {
      window.forceRefreshProfile();
    }
  }, 300);
}

// Функция подтверждения удаления сохранения
function showDeleteWeaponSaveConfirm(weapon, lang) {
  const modal = document.createElement('div');
  modal.className = 'weapon-delete-confirm-modal';
  
  const translationsObj = translations[lang] || translations['ru'];
  const weaponName = weapon[`${lang}_name`] || weapon.en_name;
  
  modal.innerHTML = `
    <div class="modal-content">
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="font-size: 48px; color: #f44336; margin-bottom: 10px;">🗑️</div>
        <h3>${translationsObj['weapon.deleteConfirmTitle'] || 'Удалить сохранение?'}</h3>
        <p>${translationsObj['weapon.deleteConfirmText'] || 'Вы уверены, что хотите удалить сохранение для оружия:'} <strong>${weaponName}</strong>?</p>
      </div>
      
      <div class="modal-buttons">
        <button class="modal-btn cancel" id="cancel-delete-btn">
          ${translationsObj['buttons.cancel'] || 'Отмена'}
        </button>
        <button class="modal-btn delete" id="confirm-delete-btn">
          ${translationsObj['buttons.delete'] || 'Удалить'}
        </button>
      </div>
    </div>
  `;
  
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  `;
  
  document.body.appendChild(modal);
  
  // Обработчики кнопок
  modal.querySelector('#cancel-delete-btn').addEventListener('click', () => {
    modal.remove();
  });
  
  modal.querySelector('#confirm-delete-btn').addEventListener('click', () => {
    deleteWeaponSave(weapon, lang);
    modal.remove();
  });
  
  // Закрытие при клике вне окна
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Функция удаления сохранения оружия
function deleteWeaponSave(weapon, lang) {
  const savedWeapons = JSON.parse(localStorage.getItem('savedWeapons') || '[]');
  const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  
  // Удаляем из массива оружий
  const updatedWeapons = savedWeapons.filter(save => 
    !(save.type === 'weapon' && save.weaponKey === weapon.key)
  );
  
  // Удаляем из общего массива
  const updatedMaterials = savedMaterials.filter(save => 
    !(save.charKey === weapon.key && save.type === 'weapon')
  );
  
  localStorage.setItem('savedWeapons', JSON.stringify(updatedWeapons));
  localStorage.setItem('savedMaterials', JSON.stringify(updatedMaterials));
  
  showWeaponNotification(translations[lang]?.notifications?.deleteSuccess || 'Сохранение оружия удалено!', 'success');
  
  // Обновляем кнопки на странице
  setTimeout(() => {
    setupWeaponSaveButtons(weapon, lang, 'materials');
    if (typeof window.forceRefreshProfile === 'function') {
      window.forceRefreshProfile();
    }
  }, 300);
}

// Функция для загрузки страницы информации об оружии
export function loadWeaponInfoPage() {
  const savedWeapon = localStorage.getItem('selectedWeapon');
  if (!savedWeapon) {
    showWeaponErrorMessage('Нет выбранного оружия');
    return;
  }

  try {
    const { key, data, lang } = JSON.parse(savedWeapon);
    currentWeapon = data;
    
    // Обновляем UI
    updateWeaponInfoUI(data, lang);
    renderWeaponStats(data, lang);
    setupWeaponInfoControls(data, lang);
    renderRefinementLevels(data, lang);
    renderAscensionStages(data, lang);
    
    // Добавляем кнопки сохранения на страницу информации
    setupWeaponSaveButtons(data, lang, 'info');
    
  } catch (error) {
    console.error('Ошибка загрузки страницы информации об оружии:', error);
    showWeaponErrorMessage('Ошибка загрузки данных');
  }
}

// Обновление UI страницы информации
function updateWeaponInfoUI(weapon, lang) {
  const weaponName = weapon[`${lang}_name`] || weapon.en_name;
  
  // Заголовок
  document.getElementById('weapon-info-name').textContent = weaponName;
  
  // Иконка
  const iconContainer = document.getElementById('weapon-info-icon');
  if (iconContainer && (weapon.avatar || weapon.icon)) {
    iconContainer.innerHTML = `<img src="${weapon.avatar || weapon.icon}" alt="${weaponName}">`;
  }
  
  // Мета-информация
  document.getElementById('weapon-info-rarity').textContent = '★'.repeat(weapon.rarity || 1);
  
  const weaponTypeText = translations[lang]?.['weapons']?.[weapon.weaponType] || weapon.weaponType;
  document.getElementById('weapon-info-type').textContent = weaponTypeText;
  
  const statTypeText = translations[lang]?.['stats']?.[weapon.mainStatType] || weapon.mainStatType;
  document.getElementById('weapon-info-main-stat').textContent = statTypeText;
  
  // Описание
  const descElement = document.getElementById('weapon-info-description');
  if (descElement && weapon.description) {
    descElement.textContent = weapon.description[lang] || weapon.description.en || weapon.description.ru || 'Описание отсутствует';
  }
  
  // Пассивная способность
  if (weapon.passiveAbility) {
    document.getElementById('weapon-passive-name').textContent = 
      weapon.passiveAbility.name[lang] || weapon.passiveAbility.name.en || weapon.passiveAbility.name.ru || 'Пассивная способность';
    
    document.getElementById('weapon-passive-description').textContent = 
      weapon.passiveAbility.description[lang] || weapon.passiveAbility.description.en || 
      weapon.passiveAbility.description.ru || 'Описание отсутствует';
  }
}

// Рендеринг статистики оружия
function renderWeaponStats(weapon, lang) {
  if (!weapon.stats || !weapon.stats.baseAttack) return;
  
  const baseAttack = weapon.stats.baseAttack;
  const secondaryStat = weapon.stats.secondaryStat;
  
  // Обновляем текущие значения (уровень 1 по умолчанию)
  document.getElementById('weapon-base-attack').textContent = baseAttack[1] || '???';
  
  if (secondaryStat) {
    document.getElementById('weapon-secondary-stat-label').textContent = 
      translations[lang]?.['stats']?.[secondaryStat.type] || secondaryStat.type;
    document.getElementById('weapon-secondary-stat').textContent = 
      `${secondaryStat.values?.[1] || '???'}%`;
  }
  
  // Заполняем таблицу
  const tableBody = document.getElementById('weapon-stats-table-body');
  if (!tableBody) return;
  
  tableBody.innerHTML = '';
  
  const levels = [1, 20, 40, 50, 60, 70, 80, 90];
  
  levels.forEach(level => {
    const row = document.createElement('tr');
    
    const levelCell = document.createElement('td');
    levelCell.textContent = level;
    
    const attackCell = document.createElement('td');
    attackCell.textContent = baseAttack[level] || '???';
    
    const statCell = document.createElement('td');
    if (secondaryStat && secondaryStat.values && secondaryStat.values[level]) {
      statCell.textContent = `${secondaryStat.values[level]}%`;
    } else {
      statCell.textContent = '???';
    }
    
    row.appendChild(levelCell);
    row.appendChild(attackCell);
    row.appendChild(statCell);
    tableBody.appendChild(row);
  });
}

// Настройка контролов для статистики
function setupWeaponInfoControls(weapon, lang) {
  const rangeInput = document.getElementById('stats-range');
  const rangeValueSpan = document.getElementById('stats-range-value');
  const levelSpan = document.getElementById('stats-weapon-level');
  const minusBtn = document.getElementById('stats-minus');
  const plusBtn = document.getElementById('stats-plus');
  
  if (!rangeInput || !rangeValueSpan || !levelSpan) return;
  
  function getWeaponLevelFromRange(rangeVal) {
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
  
  function updateWeaponStatsDisplay(level) {
    levelSpan.textContent = level;
    
    // Обновляем базовую атаку
    if (weapon.stats && weapon.stats.baseAttack) {
      document.getElementById('weapon-base-attack').textContent = 
        weapon.stats.baseAttack[level] || '???';
    }
    
    // Обновляем вторичную характеристику
    if (weapon.stats && weapon.stats.secondaryStat && weapon.stats.secondaryStat.values) {
      const value = weapon.stats.secondaryStat.values[level];
      if (value) {
        document.getElementById('weapon-secondary-stat').textContent = `${value}%`;
      }
    }
  }
  
  function updateRange(val) {
    const minVal = parseInt(rangeInput.min);
    const maxVal = parseInt(rangeInput.max);
    if (val < minVal) val = minVal;
    if (val > maxVal) val = maxVal;
    
    rangeInput.value = val;
    rangeValueSpan.textContent = val;
    const level = getWeaponLevelFromRange(val);
    updateWeaponStatsDisplay(level);
  }
  
  // Устанавливаем начальное значение
  updateRange(0);
  
  if (minusBtn) {
    minusBtn.addEventListener('click', () => {
      let currentVal = parseInt(rangeInput.value);
      updateRange(currentVal - 10);
    });
  }
  
  if (plusBtn) {
    plusBtn.addEventListener('click', () => {
      let currentVal = parseInt(rangeInput.value);
      updateRange(currentVal + 10);
    });
  }
  
  rangeInput.addEventListener('input', () => {
    const val = +rangeInput.value;
    rangeValueSpan.textContent = val;
    const level = getWeaponLevelFromRange(val);
    updateWeaponStatsDisplay(level);
  });
}

// Рендеринг уровней пробуждения
function renderRefinementLevels(weapon, lang) {
  const container = document.getElementById('refinement-levels-container');
  if (!container || !weapon.passiveAbility || !weapon.passiveAbility.refinements) return;
  
  container.innerHTML = '';
  
  const refinements = weapon.passiveAbility.refinements;
  
  refinements.forEach((desc, index) => {
    const levelDiv = document.createElement('div');
    levelDiv.className = 'refinement-level-item';
    
    const levelHeader = document.createElement('div');
    levelHeader.className = 'refinement-level-header';
    levelHeader.innerHTML = `<span class="refinement-level-number">R${index + 1}</span>`;
    
    const levelDesc = document.createElement('div');
    levelDesc.className = 'refinement-level-desc';
    levelDesc.textContent = desc;
    
    levelDiv.appendChild(levelHeader);
    levelDiv.appendChild(levelDesc);
    container.appendChild(levelDiv);
  });
  
  // Настраиваем переключение уровней пробуждения
  setupRefinementDots(weapon, lang);
}

// Настройка точек пробуждения
function setupRefinementDots(weapon, lang) {
  const dots = document.querySelectorAll('.refinement-dot');
  const descElement = document.getElementById('weapon-passive-description');
  
  if (!dots.length || !descElement || !weapon.passiveAbility) return;
  
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const refinementLevel = parseInt(dot.dataset.refinement);
      
      // Обновляем активную точку
      dots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      
      // Обновляем описание
      const refinements = weapon.passiveAbility.refinements || [];
      if (refinements[refinementLevel - 1]) {
        descElement.textContent = refinements[refinementLevel - 1];
      }
    });
  });
}

// Рендеринг стадий возвышения
function renderAscensionStages(weapon, lang) {
  const container = document.getElementById('ascension-stages-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Стадии возвышения (пример)
  const stages = [
    { level: '1 → 20', cost: '10,000 мора' },
    { level: '20 → 40', cost: '20,000 мора' },
    { level: '40 → 50', cost: '30,000 мора' },
    { level: '50 → 60', cost: '45,000 мора' },
    { level: '60 → 70', cost: '55,000 мора' },
    { level: '70 → 80', cost: '65,000 мора' },
    { level: '80 → 90', cost: '75,000 мора' }
  ];
  
  stages.forEach(stage => {
    const stageDiv = document.createElement('div');
    stageDiv.className = 'ascension-stage';
    
    stageDiv.innerHTML = `
      <div class="stage-level">
        <span class="stage-label" data-i18n="weapon.levelRange">Уровень:</span>
        <span class="stage-value">${stage.level}</span>
      </div>
      <div class="stage-cost">
        <span class="stage-label" data-i18n="weapon.ascensionCost">Стоимость:</span>
        <span class="stage-value">${stage.cost}</span>
      </div>
    `;
    
    container.appendChild(stageDiv);
  });
}

// Функция для загрузки страницы калькулятора пробуждения
export function loadWeaponRefinementPage() {
  const savedWeapon = localStorage.getItem('selectedWeapon');
  if (!savedWeapon) {
    showWeaponErrorMessage('Нет выбранного оружия');
    return;
  }

  try {
    const { key, data, lang } = JSON.parse(savedWeapon);
    currentWeapon = data;
    
    // Обновляем UI
    updateRefinementUI(data, lang);
    setupRefinementCalculator(data, lang);
    calculateRefinementMaterials(data);
    updateRefinementBenefits(data, lang);
    
  } catch (error) {
    console.error('Ошибка загрузки страницы калькулятора пробуждения:', error);
    showWeaponErrorMessage('Ошибка загрузки данных');
  }
}

// Обновление UI калькулятора
function updateRefinementUI(weapon, lang) {
  const weaponName = weapon[`${lang}_name`] || weapon.en_name;
  
  // Информация о выбранном оружии
  document.getElementById('refinement-weapon-name').textContent = weaponName;
  
  const iconContainer = document.getElementById('refinement-weapon-icon');
  if (iconContainer && (weapon.avatar || weapon.icon)) {
    iconContainer.innerHTML = `<img src="${weapon.avatar || weapon.icon}" alt="${weaponName}">`;
  }
  
  document.getElementById('refinement-weapon-rarity').textContent = '★'.repeat(weapon.rarity || 1);
  
  const weaponTypeText = translations[lang]?.['weapons']?.[weapon.weaponType] || weapon.weaponType;
  document.getElementById('refinement-weapon-type').textContent = weaponTypeText;
}

// Настройка калькулятора
function setupRefinementCalculator(weapon, lang) {
  // Точки текущего пробуждения
  const currentDots = document.querySelectorAll('.refinement-dot-large:not(.target)');
  // Точки целевого пробуждения
  const targetDots = document.querySelectorAll('.refinement-dot-large.target');
  
  let currentRefinement = 1;
  let targetRefinement = 5;
  
  // Настройка текущего пробуждения
  currentDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const level = parseInt(dot.dataset.refinement);
      currentRefinement = level;
      
      // Обновляем активные точки
      currentDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      
      // Обновляем расчеты
      calculateRefinementMaterials(weapon, currentRefinement, targetRefinement);
      updateRefinementBenefits(weapon, lang, currentRefinement, targetRefinement);
    });
  });
  
  // Настройка целевого пробуждения
  targetDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const level = parseInt(dot.dataset.targetRefinement);
      targetRefinement = level;
      
      // Обновляем активные точки
      targetDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      
      // Обновляем расчеты
      calculateRefinementMaterials(weapon, currentRefinement, targetRefinement);
      updateRefinementBenefits(weapon, lang, currentRefinement, targetRefinement);
    });
  });
  
  // Настройка пользовательского ввода
  setupUserInputCalculator(weapon, lang, currentRefinement, targetRefinement);
}

// Расчет необходимых материалов
function calculateRefinementMaterials(weapon, current = 1, target = 5) {
  const copiesNeeded = target - current;
  const moraPerCopy = getMoraCostForRefinement(weapon.rarity);
  const totalMora = moraPerCopy * copiesNeeded;
  
  // Обновляем отображение
  document.getElementById('required-copies').textContent = copiesNeeded;
  document.getElementById('required-mora').textContent = totalMora.toLocaleString();
  document.getElementById('total-cost').textContent = totalMora.toLocaleString();
  
  // Обновляем контейнер материалов
  renderRefinementMaterialsDetails(weapon, copiesNeeded, totalMora);
}

// Получение стоимости мора для пробуждения
function getMoraCostForRefinement(rarity) {
  switch (rarity) {
    case 5: return 1000;
    case 4: return 800;
    case 3: return 600;
    default: return 500;
  }
}

// Рендеринг деталей материалов
function renderRefinementMaterialsDetails(weapon, copiesNeeded, totalMora) {
  const container = document.getElementById('refinement-materials-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Копии оружия
  if (copiesNeeded > 0) {
    const copyItem = document.createElement('div');
    copyItem.className = 'material-item';
    copyItem.innerHTML = `
      <img src="${weapon.icon || weapon.avatar || 'assets/unknown.png'}" alt="${weapon.en_name}" class="material-icon">
      <div class="material-info">
        <span class="material-name">Копия оружия</span>
        <span class="material-amount">${copiesNeeded}</span>
      </div>
    `;
    container.appendChild(copyItem);
  }
  
  // Мора
  const moraItem = document.createElement('div');
  moraItem.className = 'material-item';
  moraItem.innerHTML = `
    <img src="assets/mora.png" alt="Мора" class="material-icon">
    <div class="material-info">
      <span class="material-name">Мора</span>
      <span class="material-amount">${totalMora.toLocaleString()}</span>
    </div>
  `;
  container.appendChild(moraItem);
}

// Обновление преимуществ пробуждения
function updateRefinementBenefits(weapon, lang, current = 1, target = 5) {
  // Обновляем уровни в заголовках
  document.getElementById('current-benefits-level').textContent = current;
  document.getElementById('target-benefits-level').textContent = target;
  
  if (!weapon.passiveAbility) return;
  
  const refinements = weapon.passiveAbility.refinements || [];
  
  // Текущее пробуждение
  if (refinements[current - 1]) {
    document.getElementById('current-passive-name').textContent = 
      weapon.passiveAbility.name[lang] || weapon.passiveAbility.name.en || weapon.passiveAbility.name.ru || 'Пассивная способность';
    document.getElementById('current-passive-description').textContent = refinements[current - 1];
  }
  
  // Целевое пробуждение
  if (refinements[target - 1]) {
    document.getElementById('target-passive-name').textContent = 
      weapon.passiveAbility.name[lang] || weapon.passiveAbility.name.en || weapon.passiveAbility.name.ru || 'Пассивная способность';
    document.getElementById('target-passive-description').textContent = refinements[target - 1];
  }
  
  // Обновляем рекомендацию
  updateRefinementRecommendation(weapon, current, target);
}

// Обновление рекомендации
function updateRefinementRecommendation(weapon, current, target) {
  const recElement = document.getElementById('refinement-recommendation');
  if (!recElement) return;
  
  const rarity = weapon.rarity || 4;
  const difference = target - current;
  
  let recommendation = '';
  
  if (difference === 0) {
    recommendation = 'У вас уже достигнут целевой уровень пробуждения.';
  } else if (rarity === 5) {
    if (difference >= 3) {
      recommendation = 'Для 5★ оружия пробуждение до R3-5 значительно увеличивает эффективность. Рекомендуется пробудить до R3 как минимум.';
    } else {
      recommendation = 'Даже небольшое пробуждение 5★ оружия дает заметный прирост. Рекомендуется пробудить хотя бы до R2.';
    }
  } else if (rarity === 4) {
    if (difference >= 3) {
      recommendation = 'Для 4★ оружия пробуждение до R5 очень эффективно. Рекомендуется пробудить полностью.';
    } else {
      recommendation = 'Пробуждение 4★ оружия до R3-4 дает хороший баланс затрат и эффективности.';
    }
  } else {
    recommendation = 'Пробуждение 3★ оружия обычно не является приоритетом, но может быть полезно на ранней стадии игры.';
  }
  
  recElement.textContent = recommendation;
}

// Настройка пользовательского ввода калькулятора
function setupUserInputCalculator(weapon, lang, current, target) {
  const availableCopiesInput = document.getElementById('available-copies');
  const availableMoraInput = document.getElementById('available-mora');
  
  if (!availableCopiesInput || !availableMoraInput) return;
  
  function updateCalculator() {
    const availableCopies = parseInt(availableCopiesInput.value) || 0;
    const availableMora = parseInt(availableMoraInput.value) || 0;
    const copiesNeeded = target - current;
    const moraPerCopy = getMoraCostForRefinement(weapon.rarity);
    const totalMoraNeeded = moraPerCopy * copiesNeeded;
    
    // Проверяем, можно ли пробудить
    const canRefine = availableCopies >= copiesNeeded && availableMora >= totalMoraNeeded;
    
    // Обновляем результат
    const possibilityElement = document.getElementById('refine-possibility');
    const missingElement = document.getElementById('missing-materials-list');
    
    if (canRefine) {
      possibilityElement.textContent = `Да, можете достичь R${target}!`;
      possibilityElement.parentElement.className = 'result-card success';
      missingElement.textContent = 'Все материалы есть';
    } else {
      possibilityElement.textContent = `Не хватает материалов для R${target}`;
      possibilityElement.parentElement.className = 'result-card error';
      
      const missingItems = [];
      if (availableCopies < copiesNeeded) {
        missingItems.push(`${copiesNeeded - availableCopies} копий оружия`);
      }
      if (availableMora < totalMoraNeeded) {
        missingItems.push(`${(totalMoraNeeded - availableMora).toLocaleString()} мора`);
      }
      missingElement.textContent = missingItems.join(', ');
    }
  }
  
  availableCopiesInput.addEventListener('input', updateCalculator);
  availableMoraInput.addEventListener('input', updateCalculator);
  
  // Инициализируем
  updateCalculator();
}

// Показ уведомлений
function showWeaponNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `weapon-notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 24px;
    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
    color: white;
    border-radius: 8px;
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Показ сообщения об ошибке
function showWeaponErrorMessage(message) {
  const content = document.getElementById('weapon-content') || 
                  document.getElementById('weapon-info-content') || 
                  document.getElementById('refinement-content');
  
  if (content) {
    content.innerHTML = `
      <div class="weapon-error">
        <h2>Ошибка</h2>
        <p>${message}</p>
        <button onclick="history.back()">Вернуться назад</button>
      </div>
    `;
  }
}

// Экспортируем функции для использования в app.js
export {
  currentWeapon,
  currentWeaponLevel,
  currentRefinementLevel
};