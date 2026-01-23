// calculator-module.js - исправленная версия с рабочим модальным окном артефактов
import { charsData } from '../characterData.js';
import { weaponsData } from '../weaponData.js';
import { artifactsData } from '../date-data.js';
import { translations } from '../translations.js';
import { formatNumber } from '../utils/number-utils.js';

// Глобальные переменные калькулятора
let currentCharacter = null;
let currentWeapon = null;
let currentArtifacts = {
  flower: null,
  plume: null,
  sands: null,
  goblet: null,
  circlet: null
};

// Данные для субстатов по тирам (5★ артефакты)
const substatTiers = {
  'hp': { // фиксированный HP
    base: 209,
    increments: [239, 269, 299]
  },
  'hp%': { // HP%
    base: 4.1,
    increments: [4.7, 5.3, 5.8]
  },
  'atk': { // фиксированная атака
    base: 14,
    increments: [16, 18, 19]
  },
  'atk%': { // ATK%
    base: 4.1,
    increments: [4.7, 5.3, 5.8]
  },
  'def': { // фиксированная защита
    base: 16,
    increments: [19, 21, 23]
  },
  'def%': { // DEF%
    base: 5.1,
    increments: [5.8, 6.6, 7.3]
  },
  'em': { // мастерство стихий
    base: 16,
    increments: [19, 21, 23]
  },
  'er%': { // восстановление энергии
    base: 4.5,
    increments: [5.2, 5.8, 6.5]
  },
  'critRate%': { // шанс крита
    base: 2.7,
    increments: [3.1, 3.5, 3.9]
  },
  'critDmg%': { // крит урон
    base: 5.4,
    increments: [6.2, 7.0, 7.8]
  }
};

// Значения главных статов по уровням
const mainStatValues = {
  'flower': { // HP (цветок)
    'hp': [0, 717, 920, 1123, 1326, 1529, 1732, 1935, 2138, 2341, 2544, 2747, 2950, 3153, 3356, 3559, 3762, 3965, 4168, 4371, 4574]
  },
  'plume': { // ATK (перо)
    'atk': [0, 47, 60, 73, 86, 99, 112, 125, 138, 151, 164, 177, 190, 203, 216, 229, 242, 255, 268, 281, 294]
  },
  'sands': { // Пески времени
    'hp%': [0, 7.0, 9.0, 11.0, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6],
    'atk%': [0, 7.0, 9.0, 11.0, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6],
    'def%': [0, 8.7, 11.2, 13.7, 16.2, 18.6, 21.1, 23.6, 26.1, 28.6, 31.0, 33.5, 36.0, 38.5, 41.0, 43.5, 45.9, 48.4, 50.9, 53.4, 55.9],
    'em': [0, 28, 36, 44, 52, 60, 68, 76, 84, 92, 100, 108, 116, 124, 132, 140, 148, 156, 164, 172, 180],
    'er%': [0, 7.8, 10.0, 12.2, 14.4, 16.6, 18.8, 21.0, 23.2, 25.4, 27.6, 29.8, 32.0, 34.2, 36.4, 38.6, 40.8, 43.0, 45.2, 47.4, 49.6]
  },
  'goblet': { // Кубок пространства
    'hp%': [0, 7.0, 9.0, 11.0, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6],
    'atk%': [0, 7.0, 9.0, 11.0, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6],
    'def%': [0, 8.7, 11.2, 13.7, 16.2, 18.6, 21.1, 23.6, 26.1, 28.6, 31.0, 33.5, 36.0, 38.5, 41.0, 43.5, 45.9, 48.4, 50.9, 53.4, 55.9],
    'em': [0, 28, 36, 44, 52, 60, 68, 76, 84, 92, 100, 108, 116, 124, 132, 140, 148, 156, 164, 172, 180],
    'pyro%': [0, 7.0, 9.0, 11.0, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6],
    'hydro%': [0, 7.0, 9.0, 11.0, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6],
    'electro%': [0, 7.0, 9.0, 11.0, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6],
    'cryo%': [0, 7.0, 9.0, 11.0, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6],
    'anemo%': [0, 7.0, 9.0, 11.0, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6],
    'geo%': [0, 7.0, 9.0, 11.0, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6],
    'dendro%': [0, 7.0, 9.0, 11.0, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6],
    'physical%': [0, 8.7, 11.2, 13.7, 16.2, 18.6, 21.1, 23.6, 26.1, 28.6, 31.0, 33.5, 36.0, 38.5, 41.0, 43.5, 45.9, 48.4, 50.9, 53.4, 55.9]
  },
  'circlet': { // Корона
    'hp%': [0, 7.0, 9.0, 11.0, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6],
    'atk%': [0, 7.0, 9.0, 11.0, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6],
    'def%': [0, 8.7, 11.2, 13.7, 16.2, 18.6, 21.1, 23.6, 26.1, 28.6, 31.0, 33.5, 36.0, 38.5, 41.0, 43.5, 45.9, 48.4, 50.9, 53.4, 55.9],
    'em': [0, 28, 36, 44, 52, 60, 68, 76, 84, 92, 100, 108, 116, 124, 132, 140, 148, 156, 164, 172, 180],
    'critRate%': [0, 4.7, 6.0, 7.3, 8.6, 9.9, 11.2, 12.5, 13.8, 15.1, 16.4, 17.7, 19.0, 20.3, 21.6, 22.9, 24.2, 25.5, 26.8, 28.1, 29.4],
    'critDmg%': [0, 9.3, 11.9, 14.5, 17.2, 19.8, 22.4, 25.0, 27.6, 30.2, 32.8, 35.4, 38.0, 40.6, 43.2, 45.9, 48.5, 51.1, 53.7, 56.3, 58.9],
    'healing%': [0, 5.4, 6.9, 8.4, 10.0, 11.5, 13.0, 14.5, 16.1, 17.6, 19.1, 20.6, 22.2, 23.7, 25.2, 26.7, 28.2, 29.8, 31.3, 32.8, 34.3]
  }
};

// Инициализация калькулятора
function initCalculatorModule() {
  console.log('Инициализация калькулятора');
  
  const saveId = localStorage.getItem('loadCalculatorSaveId');
  if (saveId) {
    console.log('Загрузка сохранения калькулятора:', saveId);
    loadCalculatorSaveById(saveId);
    localStorage.removeItem('loadCalculatorSaveId');
  }
  
  setupCalculatorEventListeners();
}

// Настройка обработчиков событий
function setupCalculatorEventListeners() {
  const selectCharBtn = document.getElementById('select-character-btn');
  if (selectCharBtn) {
    selectCharBtn.addEventListener('click', openCharacterSelectModal);
  }
  
  const selectWeaponBtn = document.getElementById('select-weapon-btn');
  if (selectWeaponBtn) {
    selectWeaponBtn.addEventListener('click', openWeaponSelectModal);
  }
  
  // Используем делегирование событий для динамически создаваемых кнопок
  document.addEventListener('click', function(e) {
    const artifactBtn = e.target.closest('.select-artifact-btn');
    if (artifactBtn) {
      const slot = artifactBtn.dataset.slot;
      console.log('Клик по кнопке артефакта, слот:', slot);
      openArtifactSetModal(slot);
    }
  });
  
  const resetBtn = document.getElementById('reset-calculator');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetCalculator);
  }
  
  const saveBtn = document.getElementById('save-build');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveCalculatorBuildToProfile);
  }
}

// Модальное окно выбора персонажа
function openCharacterSelectModal() {
  const modal = document.createElement('div');
  modal.className = 'calculator-modal character-select-modal';
  modal.id = 'character-select-modal';
  
  const lang = window.currentLang || 'ru';
  
  modal.innerHTML = `
    <div class="calculator-modal-content">
      <div class="modal-header">
        <h2 data-i18n="calculator.selectCharacter">Выбор персонажа</h2>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <div class="characters-grid" id="calculator-characters-grid">
          ${Object.values(charsData).map(char => {
            const charName = char[`${lang}_name`] || char.en_name;
            return `
              <div class="character-card-select" data-key="${char.key}">
                <div class="char-select-avatar">
                  <img src="${char.avatar || 'assets/default-avatar.png'}" alt="${charName}">
                </div>
                <div class="char-select-info">
                  <h4>${charName}</h4>
                  <div class="char-select-meta">
                    <span class="char-element ${char.element?.toLowerCase()}">${char.element}</span>
                    <span class="char-weapon">${translations[lang]?.weapons?.[char.weapon] || char.weapon}</span>
                    <span class="char-rarity">${'★'.repeat(char.rarity || 5)}</span>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Обработчик выбора персонажа
  modal.querySelectorAll('.character-card-select').forEach(card => {
    card.addEventListener('click', () => {
      const charKey = card.dataset.key;
      selectCharacter(charKey);
      modal.remove();
    });
  });
  
  // Закрытие модального окна
  const closeModal = () => {
    if (modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
  };
  
  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  // Закрытие по Escape
  const handleEscape = (e) => {
    if (e.key === 'Escape') closeModal();
  };
  document.addEventListener('keydown', handleEscape);
  
  // Удаляем обработчик при закрытии
  modal.addEventListener('modal-close', () => {
    document.removeEventListener('keydown', handleEscape);
  });
}

// Выбор персонажа
function selectCharacter(charKey) {
  const character = charsData[charKey];
  if (!character) return;
  
  currentCharacter = character;
  
  // Обновляем отображение
  updateCharacterDisplay(character);
  
  // Активируем кнопки
  document.getElementById('select-weapon-btn').disabled = false;
  document.querySelectorAll('.select-artifact-btn').forEach(btn => {
    btn.disabled = false;
  });
  
  // Рассчитываем статы
  calculateStats();
}


// Обновление отображения персонажа
function updateCharacterDisplay(character) {
  const display = document.getElementById('selected-character-display');
  const baseStats = document.getElementById('character-base-stats');
  const lang = window.currentLang || 'ru';
  
  if (display) {
    const charName = character[`${lang}_name`] || character.en_name;
    display.innerHTML = `
      <div class="selected-char-info">
        <div class="char-display-avatar">
          <img src="${character.avatar || 'assets/default-avatar.png'}" alt="${charName}">
        </div>
        <div class="char-display-details">
          <h3>${charName}</h3>
          <div class="char-display-meta">
            <span class="char-element-badge ${character.element?.toLowerCase()}">
              ${translations[lang]?.elements?.[character.element] || character.element}
            </span>
            <span class="char-weapon-badge">
              ${translations[lang]?.weapons?.[character.weapon] || character.weapon}
            </span>
            <span class="char-rarity-badge">
              ${'★'.repeat(character.rarity || 5)}
            </span>
          </div>
        </div>
      </div>
    `;
  }
  
  if (baseStats) {
    // Берем последние значения (уровень 90)
    const baseHP = character.hp?.[character.hp.length - 1] || 0;
    const baseATK = character.atk?.[character.atk.length - 1] || 0;
    const baseDEF = character.def?.[character.def.length - 1] || 0;
    
    document.getElementById('char-base-hp').textContent = formatNumber(baseHP, lang);
    document.getElementById('char-base-atk').textContent = formatNumber(baseATK, lang);
    document.getElementById('char-base-def').textContent = formatNumber(baseDEF, lang);
    
    baseStats.style.display = 'block';
  }
}

// Модальное окно выбора оружия
function openWeaponSelectModal() {
  if (!currentCharacter) return;
  
  const modal = document.createElement('div');
  modal.className = 'calculator-modal weapon-select-modal';
  modal.id = 'weapon-select-modal';
  
  const lang = window.currentLang || 'ru';
  const characterWeaponType = currentCharacter.weapon;
  
  // Фильтруем оружие по типу персонажа
  const filteredWeapons = Object.values(weaponsData).filter(
    weapon => weapon.weaponType && weapon.weaponType.toLowerCase() === characterWeaponType.toLowerCase()
  );
  
  modal.innerHTML = `
    <div class="calculator-modal-content">
      <div class="modal-header">
        <h2 data-i18n="calculator.selectWeapon">Выбор оружия</h2>
        <p class="modal-subtitle">${translations[lang]?.weapons?.[characterWeaponType] || characterWeaponType}</p>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <div class="weapons-grid" id="calculator-weapons-grid">
          ${filteredWeapons.map(weapon => {
            const weaponName = weapon[`${lang}_name`] || weapon.en_name || weapon.key;
            return `
              <div class="weapon-card-select" data-key="${weapon.key}">
                <div class="weapon-select-icon">
                  <img src="${weapon.icon || weapon.avatar || 'assets/default-weapon.png'}" alt="${weaponName}">
                </div>
                <div class="weapon-select-info">
                  <h4>${weaponName}</h4>
                  <div class="weapon-select-meta">
                    <span class="weapon-rarity">${'★'.repeat(weapon.rarity || 4)}</span>
                    <span class="weapon-type">${translations[lang]?.weapons?.[weapon.weaponType] || weapon.weaponType}</span>
                  </div>
                  <p class="weapon-desc">${(weapon.description?.[lang] || weapon.description?.ru || '').substring(0, 60)}...</p>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Обработчик выбора оружия
  modal.querySelectorAll('.weapon-card-select').forEach(card => {
    card.addEventListener('click', () => {
      const weaponKey = card.dataset.key;
      selectWeapon(weaponKey);
      modal.remove();
    });
  });
  
  // Закрытие модального окна
  const closeModal = () => {
    if (modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
  };
  
  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  // Закрытие по Escape
  const handleEscape = (e) => {
    if (e.key === 'Escape') closeModal();
  };
  document.addEventListener('keydown', handleEscape);
}

// Выбор оружия
function selectWeapon(weaponKey) {
  const weapon = weaponsData[weaponKey];
  if (!weapon) return;
  
  currentWeapon = weapon;
  
  // Обновляем отображение оружия
  updateWeaponDisplay(weapon);
  
  // Рассчитываем статы
  calculateStats();
}

// Обновление отображения оружия
function updateWeaponDisplay(weapon) {
  const display = document.getElementById('selected-weapon-display');
  const weaponStats = document.getElementById('weapon-stats');
  const lang = window.currentLang || 'ru';
  
  if (display) {
    const weaponName = weapon[`${lang}_name`] || weapon.en_name || weapon.key;
    display.innerHTML = `
      <div class="selected-weapon-info">
        <div class="weapon-display-icon">
          <img src="${weapon.icon || weapon.avatar || 'assets/default-weapon.png'}" alt="${weaponName}">
        </div>
        <div class="weapon-display-details">
          <h3>${weaponName}</h3>
          <div class="weapon-display-meta">
            <span class="weapon-rarity-badge">
              ${'★'.repeat(weapon.rarity || 4)}
            </span>
            <span class="weapon-type-badge">
              ${translations[lang]?.weapons?.[weapon.weaponType] || weapon.weaponType}
            </span>
          </div>
        </div>
      </div>
    `;
  }
  
  if (weaponStats) {
    const baseATK = weapon.stats?.baseAttack?.[90] || weapon.stats?.baseAttack || 0;
    
    document.getElementById('weapon-base-atk').textContent = baseATK;
    
    const substatLabel = document.getElementById('weapon-substat-label');
    const substatValueEl = document.getElementById('weapon-substat-value');
    
    if (weapon.stats?.secondaryStat) {
      const substatType = weapon.stats.secondaryStat.type;
      const substatValue = weapon.stats.secondaryStat.values?.[90] || weapon.stats.secondaryStat.value || 0;
      
      const labelMap = {
        'attack': translations[lang]?.calculator?.atkPercent || 'Сила атаки %',
        'physical': translations[lang]?.calculator?.physicalDmg || 'Физ. урон %',
        'crit': translations[lang]?.calculator?.critRate || 'Крит. шанс %',
        'energy': translations[lang]?.calculator?.energyRecharge || 'Восст. энергии %',
        'defense': translations[lang]?.character?.defense || 'Защита %',
        'hp': translations[lang]?.character?.hp || 'HP %',
        'elemental': translations[lang]?.calculator?.elementalMastery || 'Мастерство стихий'
      };
      
      substatLabel.textContent = labelMap[substatType] || substatType;
      substatValueEl.textContent = substatType === 'elemental' ? 
        formatNumber(substatValue, lang) : 
        `${substatValue}%`;
    } else {
      substatLabel.textContent = translations[lang]?.calculator?.noSecondary || 'Нет второй статы';
      substatValueEl.textContent = '-';
    }
    
    weaponStats.style.display = 'block';
  }
}

// Модальное окно выбора набора артефактов (ПЕРВЫЙ ЭКРАН)
function openArtifactSetModal(slot) {
  console.log('Открытие модального окна выбора набора для слота:', slot);
  
  // Закрываем предыдущие модальные окна
  closeAllArtifactModals();
  
  const modal = document.createElement('div');
  modal.className = 'artifact-set-modal';
  modal.id = `artifact-set-modal-${slot}`;
  
  const lang = window.currentLang || 'ru';
  const translationsObj = translations[lang] || translations['ru'];
  
  // Получаем текущий артефакт (если есть)
  const currentArtifact = currentArtifacts[slot];
  
  modal.innerHTML = `
    <div class="modal-overlay" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    ">
      <div class="modal-content" style="
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
        padding: 20px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      ">
        <div class="modal-header" style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        ">
          <h2 style="margin: 0; font-size: 1.5rem; color: #333;">
            ${translationsObj.calculator?.selectArtifactSet || 'Выбор набора артефактов'} - ${getSlotName(slot, lang)}
          </h2>
          <button class="modal-close-btn" style="
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: #666;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
          ">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="sets-grid" style="
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 15px;
            max-height: 60vh;
            overflow-y: auto;
            padding: 10px;
          ">
            <!-- Опция "Без сета" -->
            <div class="set-card ${!currentArtifact?.set ? 'selected' : ''}" data-set="none" style="
              padding: 15px;
              border: 2px solid ${!currentArtifact?.set ? '#2196F3' : '#e0e0e0'};
              border-radius: 8px;
              cursor: pointer;
              background: ${!currentArtifact?.set ? '#f0f8ff' : 'white'};
              transition: all 0.3s;
              text-align: center;
            ">
              <div style="font-size: 32px; margin-bottom: 10px;">📦</div>
              <div style="font-weight: bold; margin-bottom: 5px;">${translationsObj.calculator?.noSet || 'Без сета'}</div>
              <div style="font-size: 12px; color: #666;">${translationsObj.calculator?.chooseLater || 'Можно выбрать позже'}</div>
            </div>
            
            <!-- Все доступные сеты -->
            ${Object.values(artifactsData.sets || {}).map(set => {
              const setName = set.name?.[lang] || set.name?.en || set.id || 'Неизвестный сет';
              const isSelected = currentArtifact?.set === set.id;
              
              return `
                <div class="set-card ${isSelected ? 'selected' : ''}" data-set="${set.id}" style="
                  padding: 15px;
                  border: 2px solid ${isSelected ? '#2196F3' : '#e0e0e0'};
                  border-radius: 8px;
                  cursor: pointer;
                  background: ${isSelected ? '#f0f8ff' : 'white'};
                  transition: all 0.3s;
                  text-align: center;
                ">
                  <div style="font-size: 32px; margin-bottom: 10px;">${set.icon || '⭐'}</div>
                  <div style="font-weight: bold; margin-bottom: 5px;">${setName}</div>
                  <div style="font-size: 12px; color: #666; margin-bottom: 5px;">${set.rarity || '★★★★★'}</div>
                  <div style="font-size: 11px; color: #888; max-height: 40px; overflow: hidden;">
                    ${set.description ? (typeof set.description === 'object' ? 
                      (set.description[lang] || set.description.en || '').substring(0, 60) : 
                      set.description.substring(0, 60)) + '...' : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <div class="modal-actions" style="
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        ">
          <button class="next-btn" id="next-btn-${slot}" style="
            background: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
          ">
            ${translationsObj.common?.next || 'Далее'} →
          </button>
          <button class="cancel-btn" style="
            background: #f44336;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
          ">
            ${translationsObj.common?.cancel || 'Отмена'}
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Обработчики событий для первого модального окна
  setupArtifactSetModalHandlers(slot, modal, currentArtifact);
}

// Настройка обработчиков для модального окна выбора набора
function setupArtifactSetModalHandlers(slot, modal, currentArtifact) {
  let selectedSet = currentArtifact?.set || 'none';
  
  // Функция закрытия модального окна
  const closeModal = () => {
    if (modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
  };
  
  // Закрытие по крестику
  const closeBtn = modal.querySelector('.modal-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  
  // Закрытие по кнопке "Отмена"
  const cancelBtn = modal.querySelector('.cancel-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeModal);
  }
  
  // Закрытие по клику вне окна
  const overlay = modal.querySelector('.modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });
  }
  
  // Закрытие по Escape
  const handleEscape = (e) => {
    if (e.key === 'Escape') closeModal();
  };
  document.addEventListener('keydown', handleEscape);
  
  // Выбор сета
  modal.querySelectorAll('.set-card').forEach(card => {
    card.addEventListener('click', () => {
      modal.querySelectorAll('.set-card').forEach(c => {
        c.style.borderColor = '#e0e0e0';
        c.style.background = 'white';
      });
      card.style.borderColor = '#2196F3';
      card.style.background = '#f0f8ff';
      selectedSet = card.dataset.set;
    });
  });
  
  // Кнопка "Далее"
  const nextBtn = modal.querySelector(`#next-btn-${slot}`);
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      closeModal();
      // Открываем второе модальное окно для настройки артефакта
      openArtifactConfigModal(slot, selectedSet, currentArtifact);
    });
  }
}

function openArtifactConfigModal(slot, selectedSet, currentArtifact) {
  console.log('Открытие модального окна настройки для слота:', slot, 'набор:', selectedSet);
  
  const modal = document.createElement('div');
  modal.className = 'artifact-config-modal';
  modal.id = `artifact-config-modal-${slot}`;
  
  const lang = window.currentLang || 'ru';
  const translationsObj = translations[lang] || translations['ru'];
  
  // Определяем возможные главные статы для слота
  const possibleMainStats = getPossibleMainStats(slot);
  
  // Получаем текущие субстаты (если есть)
  const currentSubstats = currentArtifact?.substats || [];
  
  modal.innerHTML = `
    <div class="modal-overlay" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1001;
    ">
      <div class="modal-content" style="
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        padding: 20px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      ">
        <div class="modal-header" style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        ">
          <div>
            <h2 style="margin: 0; font-size: 1.5rem; color: #333;">
              ${translationsObj.calculator?.configureArtifact || 'Настройка артефакта'} - ${getSlotName(slot, lang)}
            </h2>
            ${selectedSet !== 'none' ? `
              <div style="font-size: 14px; color: #666; margin-top: 5px;">
                ${translationsObj.calculator?.set || 'Набор'}: <strong>${artifactsData.sets?.[selectedSet]?.name?.[lang] || selectedSet}</strong>
              </div>
            ` : ''}
          </div>
          <button class="modal-close-btn" style="
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: #666;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
          ">&times;</button>
        </div>
        
        <div class="modal-body">
          <!-- Уровень артефакта -->
          <div class="section" style="margin-bottom: 25px; display:flex; flex-direction:column;">
            <h3 style="margin-bottom: 15px; color: #333;">
              ${translationsObj.calculator?.artifactLevel || 'Уровень артефакта'}
              <span id="level-value-${slot}" style="color: #2196F3; margin-left: 10px;">${currentArtifact?.level || 0}</span>/20
            </h3>
            <div style="display: flex; align-items: center; gap: 15px;">
              <input type="range" 
                     id="level-slider-${slot}" 
                     min="0" 
                     max="20" 
                     value="${currentArtifact?.level || 0}" 
                     step="1"
                     style="flex: 1;">
              <div style="display: flex; gap: 5px;">
                <button class="level-btn" data-level="0" style="padding: 5px 10px; border: 1px solid #ccc; border-radius: 4px; background: white; cursor: pointer;">0</button>
                <button class="level-btn" data-level="4" style="padding: 5px 10px; border: 1px solid #ccc; border-radius: 4px; background: white; cursor: pointer;">4</button>
                <button class="level-btn" data-level="8" style="padding: 5px 10px; border: 1px solid #ccc; border-radius: 4px; background: white; cursor: pointer;">8</button>
                <button class="level-btn" data-level="12" style="padding: 5px 10px; border: 1px solid #ccc; border-radius: 4px; background: white; cursor: pointer;">12</button>
                <button class="level-btn" data-level="16" style="padding: 5px 10px; border: 1px solid #ccc; border-radius: 4px; background: white; cursor: pointer;">16</button>
                <button class="level-btn" data-level="20" style="padding: 5px 10px; border: 1px solid #ccc; border-radius: 4px; background: white; cursor: pointer;">20</button>
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 12px; color: #888;">
              <span>0</span>
              <span>4</span>
              <span>8</span>
              <span>12</span>
              <span>16</span>
              <span>20</span>
            </div>
          </div>
          
          <!-- Главная характеристика -->
          <div class="section" style="margin-bottom: 25px;display:flex; flex-direction:column;">
            <h3 style="margin-bottom: 15px; color: #333;">
              ${translationsObj.calculator?.mainStat || 'Главная характеристика'}
              <span id="mainstat-value-${slot}" style="color: #4CAF50; margin-left: 10px; font-size: 14px;">
                ${currentArtifact?.mainStat ? getStatDisplayName(currentArtifact.mainStat, lang) : ''}
              </span>
            </h3>
            
            <div id="mainstat-container-${slot}" style="
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
            ">
              <!-- Кнопки главных статов будут добавлены динамически -->
            </div>
            
            <!-- Значение главной статы в зависимости от уровня -->
            <div id="mainstat-display-${slot}" style="
              margin-top: 15px;
              padding: 15px;
              background: #f8f9fa;
              border-radius: 8px;
              border: 1px solid #e0e0e0; display:flex; flex-direction:column;
              display: ${currentArtifact?.mainStat ? 'block' : 'none'};
            ">
              <div style="font-weight: bold; margin-bottom: 5px;">
                ${translationsObj.calculator?.valueAtLevel || 'Значение на уровне'} <span id="current-level-display-${slot}">${currentArtifact?.level || 0}</span>:
              </div>
              <div id="mainstat-numeric-value-${slot}" style="font-size: 18px; color: #2196F3; font-weight: bold;">
                ${getMainStatValueDisplay(slot, currentArtifact?.mainStat, currentArtifact?.level || 0, lang)}
              </div>
            </div>
          </div>
          
          <!-- Субхарактеристики - 4 поля -->
        <div class="section" style="margin-bottom: 25px; display:flex; flex-direction:column">
          <h3 style="margin-bottom: 15px; color: #333;">
            ${translationsObj.calculator?.substats || 'Субхарактеристики'}
            <span style="font-size: 14px; color: #666; margin-left: 10px;">
              (${translationsObj.calculator?.max4 || 'максимум 4'})
            </span>
          </h3>
          
          <div style="color: #666; margin-bottom: 15px; font-size: 14px;">
            ${translationsObj.calculator?.substatsHint || 'Выберите до 4 субхарактеристик. Введите значение, система автоматически рассчитает количество улучшений.'}
          </div>
          
          <!-- КОНТЕЙНЕР ДЛЯ 4 ПОЛЕЙ СУБСТАТОВ -->
          <div id="substats-fields-${slot}" class="substats-fields" style="
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
          ">
            <!-- 4 поля будут добавлены динамически -->
          </div>
          
          <!-- Отображение числа улучшений -->
          <div id="upgrades-summary-${slot}" style="
            margin-top: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
            display: block; /* Убедимся, что отображается */
          ">
            <h4 style="margin-bottom: 10px; color: #555;">
              ${translationsObj.calculator?.upgradesSummary || 'Сводка улучшений'}
            </h4>
            <div id="upgrades-list-${slot}" style="
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
              gap: 10px;
            ">
              <!-- Сводка улучшений будет заполнена динамически -->
              <div style="text-align: center; padding: 20px; color: #999;">
                ${translationsObj.calculator?.noSubstats || 'Нет выбранных субстатов'}
              </div>
            </div>
          </div>
        </div>
        </div>
        
        <div class="modal-actions" style="
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        ">
          <button class="save-btn" id="save-artifact-${slot}" style="
            background: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            ${!currentArtifact?.mainStat ? 'opacity: 0.5; cursor: not-allowed;' : ''}
          " ${!currentArtifact?.mainStat ? 'disabled' : ''}>
            ${translationsObj.common?.save || 'Сохранить'}
          </button>
          <button class="cancel-btn" style="
            background: #f44336;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
          ">
            ${translationsObj.common?.cancel || 'Отмена'}
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Загружаем данные
  setTimeout(() => {
    loadMainStatButtons(slot, modal, currentArtifact, possibleMainStats);
    loadSubstatFields(slot, modal, currentArtifact);
    updateUpgradesSummary(slot, modal, currentArtifact);
  }, 10);
  
  // Настраиваем обработчики
  setupArtifactConfigModalHandlers(slot, modal, selectedSet, currentArtifact);
}

// Новая функция для загрузки 4 полей субстатов
// Обновленная функция для загрузки полей субстатов
function loadSubstatFields(slot, modal, currentArtifact) {
  const container = modal.querySelector(`#substats-fields-${slot}`);
  if (!container) return;
  
  const lang = window.currentLang || 'ru';
  const t = translations[lang] || translations['ru'];
  const currentSubstats = currentArtifact?.substats || [];
  
  // Создаем 4 поля для субстатов
  let fieldsHTML = '';
  
  for (let i = 0; i < 4; i++) {
    const substat = currentSubstats[i] || {};
    const substatType = substat.stat || '';
    const substatValue = substat.value || '';
    const upgrades = substat.upgrades || 0;
    
    // Получаем список доступных типов субстатов (исключая главную стату)
    const availableTypes = getAvailableSubstatTypes(currentArtifact?.mainStat);
    
    fieldsHTML += `
      <div class="substat-field" data-index="${i}" style="
        padding: 15px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        background: #fafafa;
      ">
        <div style="font-weight: bold; margin-bottom: 8px; color: #555;">
          ${t.calculator?.substat || 'Субстат'} ${i + 1}
        </div>
        
        <!-- Выбор типа субстата -->
        <div style="margin-bottom: 10px;">
          <label style="display: block; margin-bottom: 5px; font-size: 14px; color: #666;">
            ${t.calculator?.type || 'Тип'}:
          </label>
          <select class="substat-type-select" data-index="${i}" style="
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
          ">
            <option value="">${t.calculator?.selectType || 'Выберите тип'}</option>
            ${availableTypes.map(type => `
              <option value="${type}" ${substatType === type ? 'selected' : ''}>
                ${getStatDisplayName(type, lang)}
              </option>
            `).join('')}
          </select>
        </div>
        
        <!-- Ввод значения -->
        <div style="margin-bottom: 10px;">
          <label style="display: block; margin-bottom: 5px; font-size: 14px; color: #666;">
            ${t.calculator?.value || 'Значение'}:
          </label>
          <input type="number" 
                 class="substat-value-input" 
                 data-index="${i}" 
                 value="${substatValue}"
                 placeholder="${getSubstatPlaceholder(substatType)}"
                 step="0.1"
                 min="0"
                 style="
                   width: 100%;
                   padding: 8px 12px;
                   border: 1px solid #ccc;
                   border-radius: 4px;
                   font-size: 14px;
                 ">
        </div>
        
        <!-- Отображение улучшений -->
        <div class="upgrades-display" style="
          margin-top: 10px;
          padding: 8px;
          background: #e8f5e9;
          border-radius: 4px;
          display: ${substatType && substatValue ? 'block' : 'none'};
        ">
          <div style="font-size: 14px; color: #2e7d32;">
            ${t.calculator?.calculatedUpgrades || 'Рассчитано улучшений'}: 
            <span class="upgrades-count" style="font-weight: bold;">${upgrades}</span>
          </div>
          <div style="font-size: 12px; color: #666; margin-top: 4px;">
            ${getUpgradesExplanation(substatType, substatValue, lang)}
          </div>
        </div>
        
        <!-- Сообщение об ошибке -->
        <div class="error-message" style="
          margin-top: 8px;
          color: #d32f2f;
          font-size: 12px;
          display: none;
        "></div>
      </div>
    `;
  }
  
  container.innerHTML = fieldsHTML;
}

// Функция для получения доступных типов субстатов (исключая главную стату)
function getAvailableSubstatTypes(mainStat) {
  const allSubstats = Object.keys(substatTiers);
  
  if (!mainStat) return allSubstats;
  
  // Исключаем главную стату и связанные с ней
  const mainStatBase = mainStat.replace('%', '');
  return allSubstats.filter(stat => {
    const statBase = stat.replace('%', '');
    return statBase !== mainStatBase;
  });
}

// Функция для получения подсказки для поля ввода
function getSubstatPlaceholder(substatType) {
  if (!substatType) return 'Введите значение';
  
  const tierData = substatTiers[substatType];
  if (!tierData) return 'Введите значение';
  
  const base = tierData.base;
  if (substatType.includes('%')) {
    return `Например: ${base.toFixed(1)}%`;
  } else {
    return `Например: ${base}`;
  }
}

// Функция для расчета и отображения улучшений
// Функция для расчета и отображения улучшений
function calculateAndDisplayUpgrades(slot, modal, substatType, value, index) {
  const field = modal.querySelector(`.substat-field[data-index="${index}"]`);
  if (!field) return;
  
  const upgradesDisplay = field.querySelector('.upgrades-display');
  const upgradesCount = field.querySelector('.upgrades-count');
  const explanation = field.querySelector('.upgrades-display div:nth-child(2)');
  const errorMessage = field.querySelector('.error-message');
  
  // Сбрасываем ошибку
  errorMessage.style.display = 'none';
  errorMessage.textContent = '';
  
  if (!substatType || value === '' || isNaN(value)) {
    if (upgradesDisplay) {
      upgradesDisplay.style.display = 'none';
    }
    return;
  }
  
  const numValue = parseFloat(value);
  const result = calculateUpgradesForSubstat(substatType, numValue);
  
  if (result.valid) {
    if (upgradesDisplay) {
      upgradesDisplay.style.display = 'block';
    }
    if (upgradesCount) {
      upgradesCount.textContent = result.upgrades;
    }
    
    const lang = window.currentLang || 'ru';
    if (explanation) {
      explanation.textContent = getUpgradesExplanation(substatType, numValue, lang);
    }
    
    // Обновляем общую сводку
    updateUpgradesSummary(slot, modal);
  } else {
    if (upgradesDisplay) {
      upgradesDisplay.style.display = 'none';
    }
    if (errorMessage) {
      errorMessage.textContent = result.error;
      errorMessage.style.display = 'block';
    }
  }
}

// Функция для расчета количества улучшений
function calculateUpgradesForSubstat(substatType, value) {
  const tierData = substatTiers[substatType];
  if (!tierData) {
    return { valid: false, error: 'Неизвестный тип субстата' };
  }
  
  const base = tierData.base;
  const increments = tierData.increments; // [inc1, inc2, inc3]
  
  // Все возможные значения тиров (4 уровня)
  const allTiers = [base, ...increments]; // [base, inc1, inc2, inc3]
  
  // Ищем комбинацию от 1 до 5 улучшений, которая дает точное значение
  // Каждое улучшение добавляет одно значение из allTiers
  const maxUpgrades = 5; // Начальное значение + 4 улучшения
  const epsilon = 0.0001; // Для сравнения чисел с плавающей точкой
  
  // Проверяем, является ли значение одним из тиров
  for (let i = 0; i < allTiers.length; i++) {
    if (Math.abs(value - allTiers[i]) < epsilon) {
      // Это начальное значение без улучшений
      return { valid: true, upgrades: 0, tier: i + 1 };
    }
  }
  
  // Проверяем комбинации с улучшениями
  // Проходим по всем возможным количествам улучшений (1-4)
  for (let upgrades = 1; upgrades <= 4; upgrades++) {
    // Генерируем все комбинации из allTiers длиной upgrades
    const combinations = generateCombinations(allTiers, upgrades);
    
    for (const combination of combinations) {
      // Начальное значение может быть любым из allTiers
      for (let startTier = 0; startTier < allTiers.length; startTier++) {
        const startValue = allTiers[startTier];
        const totalValue = combination.reduce((sum, val) => sum + val, startValue);
        
        if (Math.abs(totalValue - value) < epsilon) {
          return { valid: true, upgrades: upgrades, startTier: startTier + 1, combination };
        }
      }
    }
  }
  
  // Если не нашли точное совпадение, ищем ближайшее
  let bestMatch = null;
  let minDiff = Infinity;
  
  // Перебираем все возможные комбинации начального значения и улучшений
  for (let startTier = 0; startTier < allTiers.length; startTier++) {
    for (let upgrades = 0; upgrades <= 4; upgrades++) {
      const combinations = upgrades > 0 ? generateCombinations(allTiers, upgrades) : [[]];
      
      for (const combination of combinations) {
        const startValue = allTiers[startTier];
        const totalValue = combination.reduce((sum, val) => sum + val, startValue);
        const diff = Math.abs(totalValue - value);
        
        if (diff < minDiff) {
          minDiff = diff;
          bestMatch = {
            valid: false,
            upgrades: upgrades,
            startTier: startTier + 1,
            combination,
            totalValue,
            diff
          };
        }
      }
    }
  }
  
  if (bestMatch && minDiff < 0.1) { // Допустимая погрешность 0.1
    return { 
      valid: true, 
      upgrades: bestMatch.upgrades, 
      startTier: bestMatch.startTier,
      approximate: true 
    };
  }
  
  return { 
    valid: false, 
    error: `Значение ${value} не соответствует возможным комбинациям для ${substatType}. Возможные значения: ${allTiers.join(', ')} + улучшения` 
  };
}

// Вспомогательная функция для генерации комбинаций
function generateCombinations(arr, length) {
  if (length === 0) return [[]];
  
  const result = [];
  
  function backtrack(current, start) {
    if (current.length === length) {
      result.push([...current]);
      return;
    }
    
    for (let i = start; i < arr.length; i++) {
      current.push(arr[i]);
      backtrack(current, i); // Разрешаем повторения
      current.pop();
    }
  }
  
  backtrack([], 0);
  return result;
}

// Функция для получения объяснения улучшений
// Исправленная функция для получения объяснения улучшений
function getUpgradesExplanation(substatType, value, lang) {
  if (!substatType || value === '' || isNaN(value)) {
    const t = translations[lang] || translations['ru'];
    return t.calculator?.selectTypeAndValue || 'Выберите тип и введите значение';
  }
  
  const result = calculateUpgradesForSubstat(substatType, value);
  
  if (!result.valid) {
    return translations[lang]?.calculator?.invalidValue || 'Неверное значение';
  }
  
  const tierData = substatTiers[substatType];
  if (!tierData) {
    return 'Неизвестный тип субстата';
  }
  
  const allTiers = [tierData.base, ...tierData.increments];
  
  if (result.upgrades === 0) {
    const tierValue = allTiers[result.startTier - 1];
    return `${translations[lang]?.calculator?.initialTier || 'Начальный тир'} ${result.startTier}: ${formatSubstatValue(tierValue, substatType)}`;
  } else {
    return `${translations[lang]?.calculator?.initialTier || 'Начальный тир'} ${result.startTier} + ${result.upgrades} ${translations[lang]?.calculator?.upgrades || 'улучшений'}`;
  }
}
// Функция для форматирования значения субстата

// Функция для обновления сводки улучшений
function updateUpgradesSummary(slot, modal, currentArtifact = null) {
  const summaryContainer = modal.querySelector(`#upgrades-list-${slot}`);
  if (!summaryContainer) return;
  
  const lang = window.currentLang || 'ru';
  const substatFields = modal.querySelectorAll(`.substat-field`);
  
  let summaryHTML = '';
  let totalUpgrades = 0;
  
  substatFields.forEach(field => {
    const index = field.dataset.index;
    const typeSelect = field.querySelector('.substat-type-select');
    const valueInput = field.querySelector('.substat-value-input');
    
    if (typeSelect.value && valueInput.value) {
      const substatType = typeSelect.value;
      const value = parseFloat(valueInput.value);
      const result = calculateUpgradesForSubstat(substatType, value);
      
      if (result.valid) {
        totalUpgrades += result.upgrades;
        
        summaryHTML += `
          <div style="padding: 8px; background: white; border-radius: 4px; border: 1px solid #e0e0e0;">
            <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">
              ${getStatDisplayName(substatType, lang)}
            </div>
            <div style="font-size: 12px; color: #666;">
              ${translations[lang]?.calculator?.value || 'Значение'}: ${formatSubstatValue(value, substatType)}
            </div>
            <div style="font-size: 12px; color: ${result.upgrades > 0 ? '#4CAF50' : '#666'};">
              ${translations[lang]?.calculator?.upgrades || 'Улучшений'}: ${result.upgrades}
            </div>
          </div>
        `;
      }
    }
  });
  
  if (summaryHTML === '') {
    summaryHTML = `
      <div style="text-align: center; padding: 20px; color: #999;">
        ${translations[lang]?.calculator?.noSubstats || 'Нет выбранных субстатов'}
      </div>
    `;
  } else {
    // Добавляем итоговую строку
    summaryHTML += `
      <div style="padding: 10px; background: #e3f2fd; border-radius: 4px; grid-column: 1 / -1;">
        <div style="font-weight: bold; font-size: 14px; color: #1976d2;">
          ${translations[lang]?.calculator?.totalUpgrades || 'Всего улучшений'}: ${totalUpgrades}
        </div>
        <div style="font-size: 12px; color: #666;">
          ${translations[lang]?.calculator?.artifactLevel || 'Уровень артефакта'}: <span id="current-level-display-${slot}">0</span>/20
        </div>
      </div>
    `;
  }
  
  summaryContainer.innerHTML = summaryHTML;
}


// Загрузка кнопок главных статов
function loadMainStatButtons(slot, modal, currentArtifact, possibleStats) {
  const container = modal.querySelector(`#mainstat-container-${slot}`);
  if (!container) return;
  
  const lang = window.currentLang || 'ru';
  const currentMainStat = currentArtifact?.mainStat;
  
  let buttonsHTML = '';
  
  if (slot === 'flower' || slot === 'plume') {
    // Для цветка и пера только одна кнопка
    const stat = slot === 'flower' ? 'hp' : 'atk';
    const isSelected = currentMainStat === stat;
    
    buttonsHTML = `
      <button class="mainstat-btn ${isSelected ? 'selected' : ''}" 
              data-stat="${stat}" 
              style="
                padding: 12px 20px;
                border: 2px solid ${isSelected ? '#4CAF50' : '#e0e0e0'};
                border-radius: 8px;
                cursor: pointer;
                background: ${isSelected ? '#f0fff0' : 'white'};
                font-weight: bold;
                transition: all 0.3s;
              ">
        ${getStatDisplayName(stat, lang)}
      </button>
    `;
  } else {
    // Для остальных слотов - несколько кнопок
    possibleStats.forEach(stat => {
      const isSelected = currentMainStat === stat;
      
      buttonsHTML += `
        <button class="mainstat-btn ${isSelected ? 'selected' : ''}" 
                data-stat="${stat}" 
                style="
                  padding: 12px 20px;
                  border: 2px solid ${isSelected ? '#4CAF50' : '#e0e0e0'};
                  border-radius: 8px;
                  cursor: pointer;
                  background: ${isSelected ? '#f0fff0' : 'white'};
                  font-weight: bold;
                  transition: all 0.3s;
                  min-width: 120px;
                ">
          ${getStatDisplayName(stat, lang)}
        </button>
      `;
    });
  }
  
  container.innerHTML = buttonsHTML;
}

// Загрузка селектора субстатов
// Загрузка селектора субстатов с выбором тиров
function loadSubstatsSelector(slot, modal, currentArtifact) {
  const container = modal.querySelector(`#substats-selector-${slot}`);
  if (!container) return;
  
  const lang = window.currentLang || 'ru';
  const currentSubstats = currentArtifact?.substats || [];
  const currentMainStat = currentArtifact?.mainStat;
  
  // Все возможные субстаты (исключая главную)
  const allSubstats = Object.keys(substatTiers);
  const availableSubstats = currentMainStat ? 
    allSubstats.filter(stat => stat !== currentMainStat && !currentMainStat.includes(stat.replace('%', ''))) : 
    allSubstats;
  
  // Обновляем substatTiers с правильными значениями (по вашим данным)
  const updatedSubstatTiers = {
    'hp': { // фиксированный HP
      base: 209,
      increments: [239, 269, 299]
    },
    'hp%': { // HP%
      base: 4.1,
      increments: [4.7, 5.3, 5.8]
    },
    'atk': { // фиксированная атака
      base: 14,
      increments: [16, 18, 19]
    },
    'atk%': { // ATK%
      base: 4.1,
      increments: [4.7, 5.3, 5.8]
    },
    'def': { // фиксированная защита
      base: 16,
      increments: [19, 21, 23]
    },
    'def%': { // DEF%
      base: 5.1,
      increments: [5.8, 6.6, 7.3]
    },
    'em': { // мастерство стихий
      base: 16,
      increments: [19, 21, 23]
    },
    'er%': { // восстановление энергии
      base: 4.5,
      increments: [5.2, 5.8, 6.5]
    },
    'critRate%': { // шанс крита
      base: 2.7,
      increments: [3.1, 3.5, 3.9]
    },
    'critDmg%': { // крит урон
      base: 5.4,
      increments: [6.2, 7.0, 7.8]
    }
  };
  
  // Группируем по типу
  const percentageSubstats = availableSubstats.filter(stat => stat.includes('%'));
  const flatSubstats = availableSubstats.filter(stat => !stat.includes('%'));
  
  let selectorHTML = '';
  
  // Процентные субстаты
  if (percentageSubstats.length > 0) {
    selectorHTML += `
      <div style="margin-bottom: 25px;">
        <div style="font-weight: bold; margin-bottom: 15px; color: #555; font-size: 16px; padding-bottom: 8px; border-bottom: 1px solid #ddd;">
          ${translations[lang]?.calculator?.percentageSubstats || 'Процентные характеристики'} (${percentageSubstats.length})
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px;">
          ${percentageSubstats.map(stat => {
            const isSelected = currentSubstats.some(s => s.stat === stat);
            const tierData = updatedSubstatTiers[stat];
            const tiers = [
              { level: 1, value: tierData.base },
              { level: 2, value: tierData.increments[0] },
              { level: 3, value: tierData.increments[1] },
              { level: 4, value: tierData.increments[2] }
            ];
            
            // Находим текущий выбранный тир для этого субстата
            const currentSubstat = currentSubstats.find(s => s.stat === stat);
            const currentTier = currentSubstat?.initialTier || 1;
            
            return `
              <div class="substat-selector" data-stat="${stat}" style="
                border: 2px solid ${isSelected ? '#4CAF50' : '#e0e0e0'};
                border-radius: 10px;
                padding: 15px;
                background: ${isSelected ? '#f8fff8' : 'white'};
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
              ">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                  <input type="checkbox" 
                         class="substat-checkbox" 
                         value="${stat}" 
                         ${isSelected ? 'checked' : ''}
                         style="
                           margin-right: 15px;
                           width: 20px;
                           height: 20px;
                           cursor: pointer;
                           ${currentSubstats.length >= 4 && !isSelected ? 'opacity: 0.5; cursor: not-allowed;' : ''}
                         "
                         ${currentSubstats.length >= 4 && !isSelected ? 'disabled' : ''}>
                  <div style="flex: 1;">
                    <div style="font-weight: bold; font-size: 15px; margin-bottom: 5px;">
                      ${getStatDisplayName(stat, lang)}
                    </div>
                    <div style="font-size: 13px; color: #666;">
                      ${isSelected ? 'Выбрано' : 'Не выбрано'}
                    </div>
                  </div>
                </div>
                
                ${isSelected ? `
                  <div class="tier-selection" style="margin-top: 15px;">
                    <div style="font-size: 14px; color: #555; margin-bottom: 12px; font-weight: 500;">
                      ${translations[lang]?.calculator?.selectInitialTier || 'Выберите начальный тир'}:
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
                      ${tiers.map((tier, index) => `
                        <label style="
                          display: flex;
                          flex-direction: column;
                          align-items: center;
                          justify-content: center;
                          padding: 10px 5px;
                          border: 2px solid ${currentTier === tier.level ? '#2196F3' : '#ddd'};
                          border-radius: 6px;
                          cursor: pointer;
                          background: ${currentTier === tier.level ? '#e3f2fd' : 'white'};
                          text-align: center;
                          transition: all 0.2s;
                        ">
                          <input type="radio" 
                                 name="tier-${stat}" 
                                 value="${tier.level}" 
                                 ${currentTier === tier.level ? 'checked' : ''}
                                 style="display: none;">
                          <div style="font-size: 12px; font-weight: bold; margin-bottom: 3px;">
                            Тир ${tier.level}
                          </div>
                          <div style="font-size: 14px; font-weight: bold; color: #2196F3;">
                            +${stat.includes('%') ? tier.value.toFixed(1) + '%' : tier.value}
                          </div>
                          <div style="font-size: 10px; color: #888; margin-top: 2px;">
                            ${getTierDescription(tier.level, stat, lang)}
                          </div>
                        </label>
                      `).join('')}
                    </div>
                    <div style="margin-top: 12px; padding: 10px; background: #f8f9fa; border-radius: 6px; border: 1px solid #eee;">
                      <div style="font-size: 12px; color: #666; margin-bottom: 5px;">
                        <strong>${translations[lang]?.calculator?.possibleUpgrades || 'Возможные улучшения'}:</strong>
                      </div>
                      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px; font-size: 11px;">
                        ${tiers.map((tier, index) => `
                          <div style="color: #555;">
                            Тир ${tier.level}: +${stat.includes('%') ? tier.value.toFixed(1) + '%' : tier.value}
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
  
  // Плоские субстаты
  if (flatSubstats.length > 0) {
    selectorHTML += `
      <div style="margin-top: 25px;">
        <div style="font-weight: bold; margin-bottom: 15px; color: #555; font-size: 16px; padding-bottom: 8px; border-bottom: 1px solid #ddd;">
          ${translations[lang]?.calculator?.flatSubstats || 'Плоские характеристики'} (${flatSubstats.length})
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px;">
          ${flatSubstats.map(stat => {
            const isSelected = currentSubstats.some(s => s.stat === stat);
            const tierData = updatedSubstatTiers[stat];
            const tiers = [
              { level: 1, value: tierData.base },
              { level: 2, value: tierData.increments[0] },
              { level: 3, value: tierData.increments[1] },
              { level: 4, value: tierData.increments[2] }
            ];
            
            // Находим текущий выбранный тир для этого субстата
            const currentSubstat = currentSubstats.find(s => s.stat === stat);
            const currentTier = currentSubstat?.initialTier || 1;
            
            return `
              <div class="substat-selector" data-stat="${stat}" style="
                border: 2px solid ${isSelected ? '#4CAF50' : '#e0e0e0'};
                border-radius: 10px;
                padding: 15px;
                background: ${isSelected ? '#f8fff8' : 'white'};
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
              ">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                  <input type="checkbox" 
                         class="substat-checkbox" 
                         value="${stat}" 
                         ${isSelected ? 'checked' : ''}
                         style="
                           margin-right: 15px;
                           width: 20px;
                           height: 20px;
                           cursor: pointer;
                           ${currentSubstats.length >= 4 && !isSelected ? 'opacity: 0.5; cursor: not-allowed;' : ''}
                         "
                         ${currentSubstats.length >= 4 && !isSelected ? 'disabled' : ''}>
                  <div style="flex: 1;">
                    <div style="font-weight: bold; font-size: 15px; margin-bottom: 5px;">
                      ${getStatDisplayName(stat, lang)}
                    </div>
                    <div style="font-size: 13px; color: #666;">
                      ${isSelected ? 'Выбрано' : 'Не выбрано'}
                    </div>
                  </div>
                </div>
                
                ${isSelected ? `
                  <div class="tier-selection" style="margin-top: 15px;">
                    <div style="font-size: 14px; color: #555; margin-bottom: 12px; font-weight: 500;">
                      ${translations[lang]?.calculator?.selectInitialTier || 'Выберите начальный тир'}:
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
                      ${tiers.map((tier, index) => `
                        <label style="
                          display: flex;
                          flex-direction: column;
                          align-items: center;
                          justify-content: center;
                          padding: 10px 5px;
                          border: 2px solid ${currentTier === tier.level ? '#2196F3' : '#ddd'};
                          border-radius: 6px;
                          cursor: pointer;
                          background: ${currentTier === tier.level ? '#e3f2fd' : 'white'};
                          text-align: center;
                          transition: all 0.2s;
                        ">
                          <input type="radio" 
                                 name="tier-${stat}" 
                                 value="${tier.level}" 
                                 ${currentTier === tier.level ? 'checked' : ''}
                                 style="display: none;">
                          <div style="font-size: 12px; font-weight: bold; margin-bottom: 3px;">
                            Тир ${tier.level}
                          </div>
                          <div style="font-size: 14px; font-weight: bold; color: #2196F3;">
                            +${tier.value}
                          </div>
                          <div style="font-size: 10px; color: #888; margin-top: 2px;">
                            ${getTierDescription(tier.level, stat, lang)}
                          </div>
                        </label>
                      `).join('')}
                    </div>
                    <div style="margin-top: 12px; padding: 10px; background: #f8f9fa; border-radius: 6px; border: 1px solid #eee;">
                      <div style="font-size: 12px; color: #666; margin-bottom: 5px;">
                        <strong>${translations[lang]?.calculator?.possibleUpgrades || 'Возможные улучшения'}:</strong>
                      </div>
                      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px; font-size: 11px;">
                        ${tiers.map((tier, index) => `
                          <div style="color: #555;">
                            Тир ${tier.level}: +${tier.value}
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
  
  // Если нет доступных субстатов
  if (percentageSubstats.length === 0 && flatSubstats.length === 0) {
    selectorHTML = `
      <div style="text-align: center; padding: 40px 20px; color: #666; background: #f8f9fa; border-radius: 8px;">
        <div style="font-size: 48px; margin-bottom: 20px;">📊</div>
        <div style="font-size: 16px; margin-bottom: 10px;">
          ${translations[lang]?.calculator?.noAvailableSubstats || 'Нет доступных субхарактеристик'}
        </div>
        <div style="font-size: 14px;">
          ${translations[lang]?.calculator?.selectMainStatFirst || 'Сначала выберите главную характеристику'}
        </div>
      </div>
    `;
  }
  
  container.innerHTML = selectorHTML;
  
  // Обновляем substatTiers глобально
  Object.assign(substatTiers, updatedSubstatTiers);
}

// Вспомогательная функция для описания тира
function getTierDescription(tier, stat, lang) {
  const translationsObj = translations[lang] || translations['ru'];
  
  if (tier === 1) {
    return translationsObj.calculator?.tierLow || 'Низкий';
  } else if (tier === 2) {
    return translationsObj.calculator?.tierMedium || 'Средний';
  } else if (tier === 3) {
    return translationsObj.calculator?.tierHigh || 'Высокий';
  } else if (tier === 4) {
    return translationsObj.calculator?.tierMax || 'Максимальный';
  }
  return '';
}

// Обновление сетки улучшений
function updateUpgradesGrid(slot, modal, currentArtifact) {
  const container = modal.querySelector(`#upgrades-grid-${slot}`);
  const upgradesContainer = modal.querySelector(`#upgrades-container-${slot}`);
  
  if (!container || !upgradesContainer) return;
  
  const currentSubstats = currentArtifact?.substats || [];
  const lang = window.currentLang || 'ru';
  
  if (currentSubstats.length === 0) {
    upgradesContainer.style.display = 'none';
    return;
  }
  
  upgradesContainer.style.display = 'block';
  
  const upgradeLevels = [4, 8, 12, 16, 20];
  let gridHTML = '';
  
  upgradeLevels.forEach(level => {
    gridHTML += `
      <div class="upgrade-level" style="
        padding: 10px;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        background: #f8f9fa;
      ">
        <div style="font-weight: bold; margin-bottom: 5px; color: #333;">
          ${translations[lang]?.calculator?.level || 'Уровень'} ${level}
        </div>
        <select class="upgrade-select" data-level="${level}" style="
          width: 100%;
          padding: 5px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 12px;
        ">
          <option value="">-- ${translations[lang]?.calculator?.chooseImprovement || 'Выберите улучшение'} --</option>
          ${currentSubstats.map((substat, index) => `
            <option value="${index}" ${currentArtifact?.upgrades?.[level] === index ? 'selected' : ''}>
              ${getStatDisplayName(substat.stat, lang)}
            </option>
          `).join('')}
        </select>
        
        <!-- Выбор тира для этого улучшения -->
        <div class="tier-selection" style="margin-top: 8px; display: ${currentArtifact?.upgrades?.[level] !== undefined ? 'block' : 'none'};">
          <div style="font-size: 11px; color: #666; margin-bottom: 3px;">
            ${translations[lang]?.calculator?.tier || 'Тир'}:
          </div>
          <div style="display: flex; gap: 3px;">
            ${[1, 2, 3, 4].map(tier => `
              <label style="
                flex: 1;
                text-align: center;
                padding: 3px;
                border: 1px solid #ccc;
                border-radius: 3px;
                font-size: 10px;
                cursor: pointer;
                background: ${currentArtifact?.tiers?.[level] === tier ? '#4CAF50' : 'white'};
                color: ${currentArtifact?.tiers?.[level] === tier ? 'white' : '#333'};
              ">
                <input type="radio" 
                       name="tier-${level}" 
                       value="${tier}" 
                       ${currentArtifact?.tiers?.[level] === tier ? 'checked' : ''}
                       style="display: none;">
                ${tier}
              </label>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = gridHTML;
}

// Настройка обработчиков для модального окна настройки
// Обновленная функция setupArtifactConfigModalHandlers
function setupArtifactConfigModalHandlers(slot, modal, selectedSet, currentArtifact) {
  const state = {
    set: selectedSet !== 'none' ? selectedSet : null,
    level: currentArtifact?.level || 0,
    mainStat: currentArtifact?.mainStat || null,
    substats: currentArtifact?.substats || [],
    upgrades: currentArtifact?.upgrades || {},
    tiers: currentArtifact?.tiers || {}
  };
  
  const lang = window.currentLang || 'ru';
  const t = translations[lang] || translations['ru'];
  
  // Функция обновления состояния кнопки сохранения
  function updateSaveButtonState() {
    const saveBtn = modal.querySelector(`#save-artifact-${slot}`);
    if (!saveBtn) return;
    
    const validation = validateArtifactForSave(slot, state, modal);
    
    if (validation.valid) {
      saveBtn.disabled = false;
      saveBtn.style.opacity = '1';
      saveBtn.style.cursor = 'pointer';
      saveBtn.title = '';
    } else {
      saveBtn.disabled = true;
      saveBtn.style.opacity = '0.5';
      saveBtn.style.cursor = 'not-allowed';
      saveBtn.title = validation.message || t.calculator?.cannotSave || 'Нельзя сохранить';
    }
  }
  
  // Функция проверки валидности артефакта
  function validateArtifactForSave(slot, state, modal) {
    // 1. Главная характеристика должна быть выбрана
    if (!state.mainStat) {
      return { valid: false, reason: 'mainStat', message: t.calculator?.selectMainStat || 'Выберите главную характеристику' };
    }
    
    // Для цветка и пера - только одна характеристика, но все равно должна быть "выбрана"
    if (slot === 'flower' || slot === 'plume') {
      const stat = slot === 'flower' ? 'hp' : 'atk';
      state.mainStat = stat; // Автоматически устанавливаем
    }
    
    const level = state.level;
    
    // Получаем субстаты из полей
    const substatFields = modal.querySelectorAll('.substat-field');
    const substats = [];
    
    substatFields.forEach(field => {
      if (field.style.display !== 'none') {
        const typeSelect = field.querySelector('.substat-type-select');
        const valueInput = field.querySelector('.substat-value-input');
        
        if (typeSelect.value && valueInput.value) {
          const result = calculateUpgradesForSubstat(typeSelect.value, parseFloat(valueInput.value));
          if (result.valid) {
            substats.push({
              stat: typeSelect.value,
              value: parseFloat(valueInput.value),
              upgrades: result.upgrades
            });
          }
        }
      }
    });
    
    // 2. Проверка количества субстатов в зависимости от уровня
    if (level < 4) {
      // Уровень 0-3: должно быть 3-4 субстата
      if (substats.length < 3) {
        return { 
          valid: false, 
          reason: 'substatsCount',
          message: t.calculator?.min3Substats || `На уровне ${level} требуется минимум 3 субстата` 
        };
      }
    } else {
      // Уровень 4-20: должно быть ровно 4 субстата
      if (substats.length !== 4) {
        return { 
          valid: false, 
          reason: 'substatsCount',
          message: t.calculator?.exactly4Substats || `На уровне ${level} требуется ровно 4 субстата` 
        };
      }
    }
    
    // 3. Проверяем уникальность типов субстатов
    const statTypes = substats.map(s => s.stat);
    const uniqueTypes = new Set(statTypes);
    if (uniqueTypes.size !== substats.length) {
      return { 
        valid: false, 
        reason: 'duplicateStats',
        message: t.calculator?.duplicateStats || 'Типы субстатов не должны повторяться' 
      };
    }
    
    // 4. Проверяем, что субстат не совпадает с главной характеристикой
    const mainStatBase = state.mainStat.replace('%', '');
    for (const substat of substats) {
      const substatBase = substat.stat.replace('%', '');
      if (substatBase === mainStatBase) {
        return { 
          valid: false, 
          reason: 'mainStatConflict',
          message: t.calculator?.mainStatConflict || 'Субстат не может совпадать с главной характеристикой' 
        };
      }
    }
    
    // 5. Проверка улучшений для уровней >= 4
    if (level >= 4 && substats.length > 0) {
      // Рассчитываем общее количество улучшений
      const totalUpgrades = substats.reduce((sum, s) => sum + (s.upgrades || 0), 0);
      
      // Минимальное количество улучшений в зависимости от уровня
      const minUpgrades = Math.floor(level / 4); // 4->1, 8->2, 12->3, 16->4, 20->5
      
      if (totalUpgrades < minUpgrades) {
        return { 
          valid: false, 
          reason: 'insufficientUpgrades',
          message: t.calculator?.insufficientUpgrades || `На уровне ${level} требуется минимум ${minUpgrades} улучшений` 
        };
      }
      
      // Максимальное количество улучшений (5 на уровне 20)
      const maxUpgrades = 5; // Максимум 5 улучшений для 5★ артефакта
      if (totalUpgrades > maxUpgrades) {
        return { 
          valid: false, 
          reason: 'excessiveUpgrades',
          message: t.calculator?.excessiveUpgrades || `Не может быть больше ${maxUpgrades} улучшений` 
        };
      }
    }
    
    return { valid: true, substats };
  }
  
  // Функция закрытия модального окна
  const closeModal = () => {
    if (modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
  };
  
  // Закрытие по крестику
  const closeBtn = modal.querySelector('.modal-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  
  // Закрытие по кнопке "Отмена"
  const cancelBtn = modal.querySelector('.cancel-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeModal);
  }
  
  // Закрытие по клику вне окна
  const overlay = modal.querySelector('.modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });
  }
  
  // Закрытие по Escape
  const handleEscape = (e) => {
    if (e.key === 'Escape') closeModal();
  };
  document.addEventListener('keydown', handleEscape);
  
  // Для цветка и пера автоматически устанавливаем главную характеристику
  if (slot === 'flower' || slot === 'plume') {
    const autoStat = slot === 'flower' ? 'hp' : 'atk';
    state.mainStat = autoStat;
    
    // Обновляем отображение
    const mainstatValue = modal.querySelector(`#mainstat-value-${slot}`);
    const mainstatDisplay = modal.querySelector(`#mainstat-display-${slot}`);
    if (mainstatValue) {
      mainstatValue.textContent = getStatDisplayName(autoStat, lang);
    }
    if (mainstatDisplay) {
      mainstatDisplay.style.display = 'block';
      updateMainStatValueDisplay(slot, autoStat, state.level);
    }
    
    // Обновляем кнопки (если они есть)
    const mainstatBtn = modal.querySelector(`.mainstat-btn[data-stat="${autoStat}"]`);
    if (mainstatBtn) {
      mainstatBtn.style.borderColor = '#4CAF50';
      mainstatBtn.style.background = '#f0fff0';
    }
    
    // Обновляем кнопку сохранения
    setTimeout(() => updateSaveButtonState(), 50);
  }
  
  // Слайдер уровня
  const levelSlider = modal.querySelector(`#level-slider-${slot}`);
  const levelValue = modal.querySelector(`#level-value-${slot}`);
  const currentLevelDisplay = modal.querySelector(`#current-level-display-${slot}`);
  
  if (levelSlider && levelValue && currentLevelDisplay) {
    levelSlider.addEventListener('input', (e) => {
      const level = parseInt(e.target.value);
      levelValue.textContent = level;
      currentLevelDisplay.textContent = level;
      state.level = level;
      updateMainStatValueDisplay(slot, state.mainStat, level);
      
      // Обновляем состояния полей субстатов
      updateSubstatFieldsVisibility(slot, modal, level);
      
      // Обновляем кнопку сохранения
      updateSaveButtonState();
    });
  }
  
  // Кнопки быстрого выбора уровня
  modal.querySelectorAll('.level-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const level = parseInt(e.target.dataset.level);
      if (levelSlider) {
        levelSlider.value = level;
        levelSlider.dispatchEvent(new Event('input'));
      }
    });
  });
  
  // Кнопки главной статы
  modal.querySelectorAll('.mainstat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const stat = e.target.dataset.stat;
      
      // Снимаем выделение со всех кнопок
      modal.querySelectorAll('.mainstat-btn').forEach(b => {
        b.style.borderColor = '#e0e0e0';
        b.style.background = 'white';
      });
      
      // Выделяем выбранную
      e.target.style.borderColor = '#4CAF50';
      e.target.style.background = '#f0fff0';
      
      state.mainStat = stat;
      
      // Обновляем отображение
      const mainstatValue = modal.querySelector(`#mainstat-value-${slot}`);
      const mainstatDisplay = modal.querySelector(`#mainstat-display-${slot}`);
      if (mainstatValue) {
        mainstatValue.textContent = getStatDisplayName(stat, lang);
      }
      if (mainstatDisplay) {
        mainstatDisplay.style.display = 'block';
        updateMainStatValueDisplay(slot, stat, state.level);
      }
      
      // Обновляем опции в выпадающих списках для субстатов
      updateSubstatTypeOptions(slot, modal, state.mainStat);
      
      // Обновляем кнопку сохранения
      updateSaveButtonState();
    });
  });
  
  // Функция для обновления видимости полей субстатов
  function updateSubstatFieldsVisibility(slot, modal, level) {
    const substatFields = modal.querySelectorAll('.substat-field');
    const requiredFields = level < 4 ? 3 : 4;
    
    substatFields.forEach((field, index) => {
      if (index >= requiredFields) {
        field.style.display = 'none';
        // Сбрасываем значения скрытых полей
        const typeSelect = field.querySelector('.substat-type-select');
        const valueInput = field.querySelector('.substat-value-input');
        if (typeSelect) typeSelect.value = '';
        if (valueInput) valueInput.value = '';
      } else {
        field.style.display = 'block';
      }
    });
    
    // Обновляем текст заголовка
    const substatsTitle = modal.querySelector(`#substats-fields-${slot}`)?.previousElementSibling;
    if (substatsTitle && substatsTitle.querySelector('h3')) {
      const span = substatsTitle.querySelector('h3 span');
      if (span) {
        span.textContent = `(${level < 4 ? t.calculator?.min3 || 'минимум 3' : t.calculator?.exactly4 || 'ровно 4'})`;
      }
    }
  }
  
  // Функция для обновления опций в выпадающих списках
  function updateSubstatTypeOptions(slot, modal, mainStat) {
    const lang = window.currentLang || 'ru';
    const availableTypes = getAvailableSubstatTypes(mainStat);
    
    modal.querySelectorAll('.substat-type-select').forEach(select => {
      if (select.closest('.substat-field').style.display !== 'none') {
        const currentValue = select.value;
        
        // Сохраняем первое опцию (пустую)
        const emptyOption = select.options[0];
        select.innerHTML = '';
        select.appendChild(emptyOption);
        
        // Добавляем доступные типы
        availableTypes.forEach(type => {
          const option = document.createElement('option');
          option.value = type;
          option.textContent = getStatDisplayName(type, lang);
          if (type === currentValue) {
            option.selected = true;
          }
          select.appendChild(option);
        });
        
        // Если текущее значение не доступно, сбрасываем
        if (currentValue && !availableTypes.includes(currentValue)) {
          select.value = '';
          const index = select.dataset.index;
          const upgradesDisplay = select.closest('.substat-field').querySelector('.upgrades-display');
          const valueInput = select.closest('.substat-field').querySelector('.substat-value-input');
          
          if (upgradesDisplay) upgradesDisplay.style.display = 'none';
          if (valueInput) valueInput.value = '';
          
          // Пересчитываем сводку
          updateUpgradesSummary(slot, modal);
        }
      }
    });
  }
  
  // Инициализируем видимость полей
  updateSubstatFieldsVisibility(slot, modal, state.level);
  
  // Обработчики для полей субстатов
  modal.addEventListener('change', (e) => {
    if (e.target.classList.contains('substat-type-select')) {
      const index = e.target.dataset.index;
      const type = e.target.value;
      const valueInput = modal.querySelector(`.substat-value-input[data-index="${index}"]`);
      
      // Обновляем placeholder
      if (valueInput) {
        valueInput.placeholder = getSubstatPlaceholder(type);
      }
      
      // Если есть значение, пересчитываем улучшения
      if (type && valueInput && valueInput.value) {
        calculateAndDisplayUpgrades(slot, modal, type, valueInput.value, index);
      } else {
        // Скрываем блок улучшений
        const upgradesDisplay = e.target.closest('.substat-field').querySelector('.upgrades-display');
        if (upgradesDisplay) {
          upgradesDisplay.style.display = 'none';
        }
      }
      
      updateUpgradesSummary(slot, modal);
      updateSaveButtonState();
    }
  });
  
  modal.addEventListener('input', (e) => {
    if (e.target.classList.contains('substat-value-input')) {
      const index = e.target.dataset.index;
      const value = e.target.value;
      const typeSelect = modal.querySelector(`.substat-type-select[data-index="${index}"]`);
      
      if (typeSelect && typeSelect.value && value) {
        calculateAndDisplayUpgrades(slot, modal, typeSelect.value, value, index);
      } else {
        // Скрываем блок улучшений
        const upgradesDisplay = e.target.closest('.substat-field').querySelector('.upgrades-display');
        if (upgradesDisplay) {
          upgradesDisplay.style.display = 'none';
        }
      }
      
      updateUpgradesSummary(slot, modal);
      updateSaveButtonState();
    }
  });
  
  // Обработчик кнопки "Сохранить"
  const saveBtn = modal.querySelector(`#save-artifact-${slot}`);
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const validation = validateArtifactForSave(slot, state, modal);
      
      if (!validation.valid) {
        alert(validation.message || t.calculator?.cannotSaveArtifact || 'Нельзя сохранить артефакт');
        return;
      }
      
      // Собираем данные о субстатах
      const substats = [];
      const substatFields = modal.querySelectorAll('.substat-field');
      
      substatFields.forEach(field => {
        if (field.style.display !== 'none') {
          const typeSelect = field.querySelector('.substat-type-select');
          const valueInput = field.querySelector('.substat-value-input');
          
          if (typeSelect.value && valueInput.value) {
            const result = calculateUpgradesForSubstat(typeSelect.value, parseFloat(valueInput.value));
            
            if (result.valid) {
              substats.push({
                stat: typeSelect.value,
                value: parseFloat(valueInput.value),
                upgrades: result.upgrades,
                startTier: result.startTier || 1
              });
            }
          }
        }
      });
      
      const artifactData = {
        set: state.set,
        slot: slot,
        mainStat: state.mainStat,
        level: state.level,
        substats: substats
      };
      
      saveArtifact(slot, artifactData);
      closeModal();
    });
  }
  
  // Обновляем кнопку сохранения при загрузке
  setTimeout(() => {
    updateSaveButtonState();
  }, 100);
}
// Обновление отображения значения главной статы
function updateMainStatValueDisplay(slot, mainStat, level) {
  const displayElement = document.querySelector(`#mainstat-numeric-value-${slot}`);
  if (!displayElement || !mainStat) return;
  
  const lang = window.currentLang || 'ru';
  displayElement.textContent = getMainStatValueDisplay(slot, mainStat, level, lang);
}

// Получение отображаемого значения главной статы
function getMainStatValueDisplay(slot, mainStat, level, lang) {
  const values = mainStatValues[slot]?.[mainStat];
  if (!values || level < 0 || level >= values.length) {
    return '?';
  }
  
  const value = values[level];
  
  if (mainStat.includes('%')) {
    return `${value.toFixed(1)}%`;
  } else if (mainStat === 'em') {
    return value.toString();
  } else {
    return formatNumber(Math.round(value), lang);
  }
}




// Вспомогательные функции
function getPossibleMainStats(slot) {
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

function getSlotName(slot, lang) {
  const slotNames = {
    flower: translations[lang]?.calculator?.flower || 'Цветок жизни',
    plume: translations[lang]?.calculator?.plume || 'Перо смерти',
    sands: translations[lang]?.calculator?.sands || 'Пески времени',
    goblet: translations[lang]?.calculator?.goblet || 'Кубок пространства',
    circlet: translations[lang]?.calculator?.circlet || 'Корона разума'
  };
  return slotNames[slot] || slot;
}



function closeAllArtifactModals() {
  // Закрываем только модальные окна артефактов
  document.querySelectorAll('.artifact-set-modal, .artifact-config-modal').forEach(modal => {
    if (modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
  });
  
  // Не закрываем другие типы модальных окон
  console.log('Закрыты все модальные окна артефактов');
}
// Функция проверки валидности артефакта для сохранения
function validateArtifactForSave(slot, state, modal) {
  // 1. Главная характеристика должна быть выбрана
  if (!state.mainStat) {
    return { valid: false, reason: 'mainStat' };
  }
  
  // Для цветка и пера - только одна характеристика, но все равно должна быть "выбрана"
  if (slot === 'flower' || slot === 'plume') {
    const stat = slot === 'flower' ? 'hp' : 'atk';
    state.mainStat = stat; // Автоматически устанавливаем
  }
  
  const level = state.level;
  
  // Получаем субстаты из полей
  const substatFields = modal.querySelectorAll('.substat-field');
  const substats = [];
  
  substatFields.forEach(field => {
    const typeSelect = field.querySelector('.substat-type-select');
    const valueInput = field.querySelector('.substat-value-input');
    
    if (typeSelect.value && valueInput.value) {
      const result = calculateUpgradesForSubstat(typeSelect.value, parseFloat(valueInput.value));
      if (result.valid) {
        substats.push({
          stat: typeSelect.value,
          value: parseFloat(valueInput.value),
          upgrades: result.upgrades
        });
      }
    }
  });
  
  // 2. Проверка количества субстатов в зависимости от уровня
  if (level < 4) {
    // Уровень 0-3: должно быть 3-4 субстата
    if (substats.length < 3) {
      return { 
        valid: false, 
        reason: 'substatsCount',
        message: `На уровне ${level} требуется минимум 3 субстата` 
      };
    }
  } else {
    // Уровень 4-20: должно быть ровно 4 субстата
    if (substats.length !== 4) {
      return { 
        valid: false, 
        reason: 'substatsCount',
        message: `На уровне ${level} требуется ровно 4 субстата` 
      };
    }
    
    // 3. Проверка улучшений для уровней > 4
    if (level >= 4) {
      // Рассчитываем общее количество улучшений
      const totalUpgrades = substats.reduce((sum, s) => sum + (s.upgrades || 0), 0);
      
      // На уровне 4+ должно быть минимум 1 улучшение
      if (totalUpgrades === 0) {
        return { 
          valid: false, 
          reason: 'upgrades',
          message: 'Требуется хотя бы одно улучшение для уровня 4+' 
        };
      }
      
      // Проверяем, что улучшения распределены по уровням
      const expectedUpgrades = Math.floor(level / 4); // 4->1, 8->2, 12->3, 16->4, 20->5
      
      // Фактические улучшения должны быть <= ожидаемых
      if (totalUpgrades > expectedUpgrades) {
        return { 
          valid: false, 
          reason: 'upgrades',
          message: `Слишком много улучшений. На уровне ${level} максимум ${expectedUpgrades} улучшений` 
        };
      }
      
      // Для уровней 8+ проверяем наличие улучшений на соответствующих уровнях
      if (level >= 8) {
        // Собираем улучшения по уровням
        const upgradeLevels = [8, 12, 16, 20].filter(l => l <= level);
        // На каждом из этих уровней должно быть хотя бы одно улучшение
        // Но это сложно проверить без учета распределения по уровням
        // Пока просто проверяем общее количество
      }
    }
  }
  
  // 4. Проверяем уникальность типов субстатов
  const statTypes = substats.map(s => s.stat);
  const uniqueTypes = new Set(statTypes);
  if (uniqueTypes.size !== substats.length) {
    return { 
      valid: false, 
      reason: 'duplicateStats',
      message: 'Типы субстатов не должны повторяться' 
    };
  }
  
  // 5. Проверяем, что субстат не совпадает с главной характеристикой
  const mainStatBase = state.mainStat.replace('%', '');
  for (const substat of substats) {
    const substatBase = substat.stat.replace('%', '');
    if (substatBase === mainStatBase) {
      return { 
        valid: false, 
        reason: 'mainStatConflict',
        message: 'Субстат не может совпадать с главной характеристикой' 
      };
    }
  }
  
  return { valid: true, substats };
}
// Сохранение артефакта
// Обновляем функцию сохранения артефакта
// Обновляем функцию сохранения артефакта, чтобы она вызывала пересчет
function saveArtifact(slot, artifactData) {
  console.log('Сохранение артефакта:', artifactData);
  
  // Дополнительная проверка перед сохранением
  if (!artifactData.mainStat) {
    console.error('Не выбрана главная характеристика');
    return;
  }
  
  currentArtifacts[slot] = artifactData;
  updateArtifactSlotDisplay(slot);
  calculateStats(); // ПЕРЕСЧИТЫВАЕМ ХАРАКТЕРИСТИКИ
  document.getElementById('save-build').disabled = false;
  
  console.log('Артефакт сохранен:', artifactData);
}


// Обновление отображения слота артефакта
function updateArtifactSlotDisplay(slot) {
  const preview = document.querySelector(`[data-artifact-type="${slot}"]`);
  if (!preview) return;
  
  const artifact = currentArtifacts[slot];
  const lang = window.currentLang || 'ru';
  
  if (!artifact || !artifact.mainStat) {
    preview.innerHTML = `
      <div class="empty-state small">
        <p data-i18n="calculator.notSelected">Не выбран</p>
      </div>
    `;
    return;
  }
  
  const mainStatName = getStatDisplayName(artifact.mainStat, lang);
  const setName = artifact.set ? 
    (artifactsData.sets?.[artifact.set]?.name?.[lang] || artifact.set) : 
    translations[lang]?.calculator?.noSet || 'Без сета';
  
  preview.innerHTML = `
    <div class="artifact-mini-preview">
      <div style="font-weight: bold; margin-bottom: 5px; font-size: 14px;">${setName}</div>
      <div style="color: #4CAF50; margin-bottom: 5px;">${mainStatName}</div>
      <div style="color: #666; font-size: 12px;">Ур. ${artifact.level}/20</div>
      ${artifact.substats && artifact.substats.length > 0 ? `
        <div style="color: #888; font-size: 11px; margin-top: 5px;">
          ${artifact.substats.length} субстат(ов)
        </div>
      ` : ''}
    </div>
  `;
}
// Функция для получения значения главной статы артефакта
// Функция для получения значения главной статы артефакта
function getArtifactMainStatValue(slot, mainStatType, level) {
  console.log(`Получение главной статы: ${slot}, ${mainStatType}, уровень ${level}`);
  
  const slotData = mainStatValues[slot];
  if (!slotData) {
    console.error(`Нет данных для слота: ${slot}`);
    return 0;
  }
  
  const statData = slotData[mainStatType];
  if (!statData) {
    console.error(`Нет данных для статы: ${mainStatType} в слоте ${slot}`);
    return 0;
  }
  
  // level от 0 до 20
  if (level < 0 || level >= statData.length) {
    console.error(`Неверный уровень: ${level} для статы ${mainStatType}`);
    return statData[statData.length - 1] || 0;
  }
  
  const value = statData[level];
  console.log(`Значение главной статы: ${value}`);
  return value;
}

// Функция для суммирования статов из артефактов
// Обновленная функция расчета статов артефактов
function calculateArtifactStats() {
  console.log('=== РАСЧЕТ СТАТОВ АРТЕФАКТОВ ===');
  
  const stats = {
    hp: { flat: 0, percent: 0 },
    atk: { flat: 0, percent: 0 },
    def: { flat: 0, percent: 0 },
    em: 0,
    er: 0,
    critRate: 0,
    critDmg: 0,
    elementalDmg: {}
  };
  
  // Обрабатываем каждый артефакт
  Object.entries(currentArtifacts).forEach(([slot, artifact]) => {
    if (!artifact || !artifact.mainStat || artifact.level === undefined) {
      console.log(`Артефакт ${slot} не выбран или не настроен`);
      return;
    }
    
    console.log(`Обработка артефакта ${slot}:`, artifact);
    
    // Главная стата
    const mainStatValue = getArtifactMainStatValue(slot, artifact.mainStat, artifact.level);
    console.log(`Главная стата ${slot}: ${artifact.mainStat} = ${mainStatValue}`);
    
    addStatToTotal(artifact.mainStat, mainStatValue, stats, true);
    
    // Субстаты
    if (artifact.substats && Array.isArray(artifact.substats)) {
      artifact.substats.forEach((substat, i) => {
        if (substat.stat && substat.value !== undefined) {
          console.log(`Субстат ${i}: ${substat.stat} = ${substat.value}`);
          addStatToTotal(substat.stat, substat.value, stats, false);
        }
      });
    }
  });
  
  console.log('Итоговые статы артефактов:', stats);
  return stats;
}

// Функция для добавления стата в общую сумму
// Обновленная функция добавления стата
function addStatToTotal(stat, value, stats, isMainStat) {
  const numValue = parseFloat(value) || 0;
  console.log(`Добавление стата: ${stat} = ${numValue} (главный: ${isMainStat})`);
  
  switch(stat) {
    case 'hp':
      stats.hp.flat += numValue;
      break;
    case 'atk':
      stats.atk.flat += numValue;
      break;
    case 'def':
      stats.def.flat += numValue;
      break;
    case 'hp%':
      stats.hp.percent += numValue;
      break;
    case 'atk%':
      stats.atk.percent += numValue;
      break;
    case 'def%':
      stats.def.percent += numValue;
      break;
    case 'em':
      stats.em += numValue;
      break;
    case 'er%':
      stats.er += numValue;
      break;
    case 'critRate%':
      stats.critRate += numValue;
      break;
    case 'critDmg%':
      stats.critDmg += numValue;
      break;
    case 'pyro%':
    case 'hydro%':
    case 'electro%':
    case 'cryo%':
    case 'anemo%':
    case 'geo%':
    case 'dendro%':
    case 'physical%':
      const element = stat.replace('%', '');
      stats.elementalDmg[element] = (stats.elementalDmg[element] || 0) + numValue;
      break;
    case 'healing%':
      // Бонус лечения пока не учитываем в общих статах
      break;
    default:
      console.warn('Неизвестный стат:', stat);
  }
}
// calculator-module.js - добавьте эти функции
// Получение диапазона значений субстата
// Функция для получения диапазона значений субстата
function getSubstatRangeDisplay(stat) {
  const tierData = substatTiers[stat];
  if (!tierData) return '';
  
  const min = tierData.base;
  const maxIncrement = tierData.increments[tierData.increments.length - 1] || 0;
  const max = min + (maxIncrement * 5); // Максимум 5 улучшений
  
  if (stat.includes('%')) {
    return `${min.toFixed(1)}% - ${max.toFixed(1)}%`;
  } else {
    return `${min} - ${Math.round(max)}`;
  }
}

// Функция для форматирования значения субстата
function formatSubstatValue(value, substatType) {
  if (substatType.includes('%')) {
    return `${parseFloat(value).toFixed(1)}%`;
  } else if (substatType === 'em') {
    return Math.round(value).toString();
  } else {
    return Math.round(value).toString();
  }
}

// Функция для получения имени стата (из translations)
function getStatDisplayName(stat, lang) {
  const translationsObj = translations[lang] || translations['ru'];
  
  const statNames = {
    'hp': translationsObj.character?.hp || 'HP',
    'atk': translationsObj.character?.attack || 'ATK',
    'def': translationsObj.character?.defense || 'DEF',
    'hp%': (translationsObj.character?.hp || 'HP') + '%',
    'atk%': (translationsObj.character?.attack || 'ATK') + '%',
    'def%': (translationsObj.character?.defense || 'DEF') + '%',
    'em': translationsObj.calculator?.elementalMastery || 'Мастерство стихий',
    'er%': translationsObj.calculator?.energyRecharge || 'Восст. энергии',
    'critRate%': translationsObj.calculator?.critRate || 'Крит. шанс',
    'critDmg%': translationsObj.calculator?.critDmg || 'Крит. урон',
    'healing%': translationsObj.calculator?.healingBonus || 'Бонус лечения',
    'pyro%': translationsObj.calculator?.pyroDmg || 'Пиро урон',
    'hydro%': translationsObj.calculator?.hydroDmg || 'Гидро урон',
    'electro%': translationsObj.calculator?.electroDmg || 'Электро урон',
    'cryo%': translationsObj.calculator?.cryoDmg || 'Крио урон',
    'anemo%': translationsObj.calculator?.anemoDmg || 'Анемо урон',
    'geo%': translationsObj.calculator?.geoDmg || 'Гео урон',
    'dendro%': translationsObj.calculator?.dendroDmg || 'Дендро урон',
    'physical%': translationsObj.calculator?.physicalDmg || 'Физ. урон'
  };
  
  return statNames[stat] || stat;
}

// Расчет характеристик (упрощенная версия)
// ОБНОВЛЕННАЯ ФУНКЦИЯ РАСЧЕТА ХАРАКТЕРИСТИК
// Обновленная функция расчета характеристик
function calculateStats() {
  console.log('=== РАСЧЕТ ХАРАКТЕРИСТИК ===');
  
  if (!currentCharacter) {
    console.log('Персонаж не выбран');
    return;
  }
  
  const lang = window.currentLang || 'ru';
  
  // 1. Базовые характеристики персонажа (уровень 90)
  const baseHP = currentCharacter.hp?.[currentCharacter.hp.length - 1] || 0;
  const baseATK = currentCharacter.atk?.[currentCharacter.atk.length - 1] || 0;
  const baseDEF = currentCharacter.def?.[currentCharacter.def.length - 1] || 0;
  
  console.log('Базовые статы персонажа:', { baseHP, baseATK, baseDEF });
  
  // 2. Статы оружия
  const weaponATK = currentWeapon?.stats?.baseAttack?.[90] || 
                   currentWeapon?.stats?.baseAttack || 0;
  
  let weaponSubstatValue = 0;
  let weaponSubstatType = '';
  
  if (currentWeapon?.stats?.secondaryStat) {
    weaponSubstatType = currentWeapon.stats.secondaryStat.type;
    weaponSubstatValue = currentWeapon.stats.secondaryStat.values?.[90] || 
                        currentWeapon.stats.secondaryStat.value || 0;
    console.log('Вторая стата оружия:', weaponSubstatType, weaponSubstatValue);
  }
  
  // 3. Статы от артефактов
  const artifactStats = calculateArtifactStats();
  console.log('Статы от артефактов:', artifactStats);
  
  // 4. Добавляем стату оружия к артефактным статам
  if (weaponSubstatType && weaponSubstatValue) {
    const weaponStatType = convertWeaponStatType(weaponSubstatType);
    if (weaponStatType) {
      addStatToTotal(weaponStatType, weaponSubstatValue, artifactStats, false);
    }
  }
  
  // 5. Рассчитываем итоговые значения
  
  // HP: (база * (1 + процентные бонусы/100)) + плоские бонусы
  const finalHP = Math.round(
    baseHP * (1 + artifactStats.hp.percent / 100) + 
    artifactStats.hp.flat
  );
  
  // ATK: ((база персонажа + база оружия) * (1 + процентные бонусы ATK/100)) + плоские бонусы ATK
  const baseATKTotal = baseATK + weaponATK;
  const finalATK = Math.round(
    baseATKTotal * (1 + artifactStats.atk.percent / 100) + 
    artifactStats.atk.flat
  );
  
  // DEF: (база * (1 + процентные бонусы/100)) + плоские бонусы
  const finalDEF = Math.round(
    baseDEF * (1 + artifactStats.def.percent / 100) + 
    artifactStats.def.flat
  );
  
  // Крит характеристики (базовые + бонусы)
  const finalCritRate = Math.min(5 + artifactStats.critRate, 100); // Максимум 100%
  const finalCritDmg = 50 + artifactStats.critDmg;
  
  // Восстановление энергии (базовые 100% + бонусы)
  const finalER = 100 + artifactStats.er;
  
  // 6. Обновляем отображение
  document.getElementById('final-hp').textContent = formatNumber(finalHP, lang);
  document.getElementById('final-atk').textContent = formatNumber(finalATK, lang);
  document.getElementById('final-def').textContent = formatNumber(finalDEF, lang);
  document.getElementById('final-crit-rate').textContent = finalCritRate.toFixed(1) + '%';
  document.getElementById('final-crit-dmg').textContent = finalCritDmg.toFixed(1) + '%';
  document.getElementById('final-em').textContent = formatNumber(artifactStats.em, lang);
  document.getElementById('final-er').textContent = finalER.toFixed(1) + '%';
  
  // Обновляем детализацию
  updateStatBreakdowns(baseHP, baseATK, baseDEF, weaponATK, artifactStats);
  
  console.log('Итоговые статы:', {
    finalHP, finalATK, finalDEF,
    critRate: finalCritRate,
    critDmg: finalCritDmg,
    em: artifactStats.em,
    er: finalER
  });
}
// calculator-module.js - добавить после функции calculateStats
function calculateStatsForSave() {
  if (!currentCharacter) {
    return {};
  }
  
  const lang = window.currentLang || 'ru';
  
  // 1. Базовые характеристики персонажа (уровень 90)
  const baseHP = currentCharacter.hp?.[currentCharacter.hp.length - 1] || 0;
  const baseATK = currentCharacter.atk?.[currentCharacter.atk.length - 1] || 0;
  const baseDEF = currentCharacter.def?.[currentCharacter.def.length - 1] || 0;
  
  // 2. Статы оружия
  const weaponATK = currentWeapon?.stats?.baseAttack?.[90] || 0;
  const weaponSubstat = currentWeapon?.stats?.secondaryStat;
  let weaponSubstatValue = 0;
  
  if (weaponSubstat && weaponSubstat.values) {
    weaponSubstatValue = weaponSubstat.values[90] || 0;
  }
  
  // 3. Статы от артефактов
  const artifactStats = calculateArtifactStats();
  
  // 4. Рассчитываем итоговые значения
  const baseATKTotal = baseATK + weaponATK;
  const finalHP = Math.round(
    baseHP * (1 + artifactStats.hp.percent / 100) + 
    artifactStats.hp.flat
  );
  
  const finalATK = Math.round(
    baseATKTotal * (1 + artifactStats.atk.percent / 100) + 
    artifactStats.atk.flat
  );
  
  const finalDEF = Math.round(
    baseDEF * (1 + artifactStats.def.percent / 100) + 
    artifactStats.def.flat
  );
  
  const finalCritRate = Math.min(5 + artifactStats.critRate, 100);
  const finalCritDmg = 50 + artifactStats.critDmg;
  const finalER = 100 + artifactStats.er;
  
  return {
    hp: finalHP,
    atk: finalATK,
    def: finalDEF,
    critRate: finalCritRate,
    critDmg: finalCritDmg,
    em: artifactStats.em,
    er: finalER,
    baseHP: baseHP,
    baseATK: baseATK,
    baseDEF: baseDEF,
    weaponATK: weaponATK
  };
}
// Вспомогательная функция для конвертации типа статы оружия
function convertWeaponStatType(weaponStatType) {
  const mapping = {
    'attack': 'atk%',
    'physical': 'physical%',
    'crit': 'critRate%',
    'energy': 'er%',
    'defense': 'def%',
    'hp': 'hp%',
    'elemental': 'em'
  };
  
  return mapping[weaponStatType] || weaponStatType;
}
// Функция для обновления детализации статов
function updateStatBreakdowns(baseHP, baseATK, baseDEF, weaponATK, artifactStats) {
  const lang = window.currentLang || 'ru';
  
  // HP breakdown
  const hpBreakdown = document.getElementById('hp-breakdown');
  if (hpBreakdown) {
    hpBreakdown.innerHTML = `
      <div style="font-size: 12px; color: #666;">
        <div>База: ${formatNumber(baseHP, lang)}</div>
        <div>Проценты: ${artifactStats.hp.percent.toFixed(1)}%</div>
        <div>Бонус: ${formatNumber(artifactStats.hp.flat, lang)}</div>
      </div>
    `;
  }
  
  // ATK breakdown
  const atkBreakdown = document.getElementById('atk-breakdown');
  if (atkBreakdown) {
    atkBreakdown.innerHTML = `
      <div style="font-size: 12px; color: #666;">
        <div>База персонажа: ${formatNumber(baseATK, lang)}</div>
        <div>База оружия: ${formatNumber(weaponATK, lang)}</div>
        <div>Проценты: ${artifactStats.atk.percent.toFixed(1)}%</div>
        <div>Бонус: ${formatNumber(artifactStats.atk.flat, lang)}</div>
      </div>
    `;
  }
  
  // DEF breakdown
  const defBreakdown = document.getElementById('def-breakdown');
  if (defBreakdown) {
    defBreakdown.innerHTML = `
      <div style="font-size: 12px; color: #666;">
        <div>База: ${formatNumber(baseDEF, lang)}</div>
        <div>Проценты: ${artifactStats.def.percent.toFixed(1)}%</div>
        <div>Бонус: ${formatNumber(artifactStats.def.flat, lang)}</div>
      </div>
    `;
  }
}
function addStatBonus(stat, value, bonuses, isMainStat) {
  if (stat === 'hp') {
    bonuses.hp.flat += value;
  } else if (stat === 'atk') {
    bonuses.atk.flat += value;
  } else if (stat === 'def') {
    bonuses.def.flat += value;
  } else if (stat === 'hp%') {
    bonuses.hp.percent += value;
  } else if (stat === 'atk%') {
    bonuses.atk.percent += value;
  } else if (stat === 'def%') {
    bonuses.def.percent += value;
  } else if (stat === 'em') {
    bonuses.em += value;
  } else if (stat === 'er%') {
    bonuses.er += value;
  } else if (stat === 'critRate%') {
    bonuses.critRate += value;
  } else if (stat === 'critDmg%') {
    bonuses.critDmg += value;
  } else if (stat.includes('%') && !['er%', 'critRate%', 'critDmg%'].includes(stat)) {
    const element = stat.replace('%', '');
    bonuses.elementalDmg[element] = (bonuses.elementalDmg[element] || 0) + value;
  }
}

// Сброс калькулятора
function resetCalculator() {
  currentCharacter = null;
  currentWeapon = null;
  currentArtifacts = {
    flower: null,
    plume: null,
    sands: null,
    goblet: null,
    circlet: null
  };
  
  const lang = window.currentLang || 'ru';
  
  document.getElementById('selected-character-display').innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">👤</div>
      <p data-i18n="calculator.noCharacterSelected">Персонаж не выбран</p>
    </div>
  `;
  
  document.getElementById('character-base-stats').style.display = 'none';
  
  document.getElementById('select-weapon-btn').disabled = true;
  document.querySelectorAll('.select-artifact-btn').forEach(btn => {
    btn.disabled = true;
  });
  
  document.getElementById('save-build').disabled = true;
  
  // Сбрасываем артефакты
  document.querySelectorAll('.artifact-preview').forEach(preview => {
    preview.innerHTML = `
      <div class="empty-state small">
        <p data-i18n="calculator.notSelected">Не выбран</p>
      </div>
    `;
  });
  
  // Сбрасываем статы
  document.getElementById('final-hp').textContent = '0';
  document.getElementById('final-atk').textContent = '0';
  document.getElementById('final-def').textContent = '0';
  document.getElementById('final-crit-rate').textContent = '5%';
  document.getElementById('final-crit-dmg').textContent = '50%';
  document.getElementById('final-em').textContent = '0';
  document.getElementById('final-er').textContent = '100%';
}

// Сохранение сборки в профиль
// calculator-module.js - убедитесь, что функция сохранения работает правильно
function saveCalculatorBuildToProfile() {
  if (!currentCharacter) {
    alert('Выберите персонажа');
    return;
  }
  
  const lang = window.currentLang || 'ru';
  const translationsObj = translations[lang] || translations['ru'];
  
  const saveName = prompt(
    translationsObj.calculator?.enterBuildName || 'Введите название сборки:',
    `${currentCharacter[`${lang}_name`] || currentCharacter.en_name} - ${translationsObj.calculator?.build || 'Сборка'}`
  );
  
  if (!saveName || saveName.trim() === '') return;
  
  // Рассчитываем текущие статы
  const stats = calculateStatsForSave();
  
  // Создаем сохранение
  const save = {
    id: Date.now(),
    name: saveName.trim(),
    type: 'calculator',
    characterName: currentCharacter[`${lang}_name`] || currentCharacter.en_name,
    characterAvatar: currentCharacter.avatar,
    characterKey: currentCharacter.key,
    weaponName: currentWeapon ? (currentWeapon[`${lang}_name`] || currentWeapon.en_name) : null,
    weaponKey: currentWeapon?.key,
    artifacts: JSON.parse(JSON.stringify(currentArtifacts)), // глубокое копирование
    stats: stats,
    date: new Date().toLocaleString(lang),
    timestamp: Date.now(),
    lastModified: Date.now()
  };
  
  // Сохраняем в общий список сохранений профиля
  const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  savedMaterials.push(save);
  localStorage.setItem('savedMaterials', JSON.stringify(savedMaterials));
  
  // Показываем уведомление
  showCalculatorNotification('Сборка сохранена в профиль!', 'success');
  
  // Обновляем профиль
  setTimeout(() => {
    if (window.forceRefreshProfile) {
      window.forceRefreshProfile();
    }
  }, 500);
}

// Загрузка сборки калькулятора по ID
function loadCalculatorSaveById(saveId) {
  console.log('Загрузка сборки калькулятора по ID:', saveId);
  
  const calculatorSaves = JSON.parse(localStorage.getItem('calculatorSaves') || '[]');
  const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  
  // Ищем в обеих базах
  let save = calculatorSaves.find(s => s && s.id == saveId);
  if (!save) {
    save = savedMaterials.find(s => s && s.id == saveId && s.type === 'calculator');
  }
  
  if (!save) {
    console.error('Сохранение не найдено:', saveId);
    return;
  }
  
  console.log('Найдено сохранение:', save);
  
  // Восстанавливаем данные
  currentCharacter = charsData[save.characterKey];
  if (!currentCharacter) {
    console.error('Персонаж не найден:', save.characterKey);
    return;
  }
  
  if (save.weaponKey) {
    currentWeapon = weaponsData[save.weaponKey];
  }
  
  if (save.artifacts) {
    currentArtifacts = save.artifacts;
  }
  
  // Обновляем отображение
  updateCharacterDisplay(currentCharacter);
  
  if (currentWeapon) {
    updateWeaponDisplay(currentWeapon);
  }
  
  // Обновляем артефакты
  Object.keys(currentArtifacts).forEach(slot => {
    if (currentArtifacts[slot]) {
      updateArtifactSlotDisplay(slot);
    }
  });
  
  // Рассчитываем статы
  calculateStats();
  
  // Активируем кнопки
  document.getElementById('select-weapon-btn').disabled = false;
  document.querySelectorAll('.select-artifact-btn').forEach(btn => {
    btn.disabled = false;
  });
  
  document.getElementById('save-build').disabled = false;
  
  showCalculatorNotification('Сборка загружена из профиля', 'success');
}

// Показать уведомление
function showCalculatorNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `calc-notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 6px;
    color: white;
    font-weight: bold;
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  
  if (type === 'success') {
    notification.style.background = '#4CAF50';
  } else if (type === 'error') {
    notification.style.background = '#f44336';
  } else if (type === 'info') {
    notification.style.background = '#2196F3';
  } else {
    notification.style.background = '#FF9800';
  }
  
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

// Экспортируем функцию для инициализации
// Экспортируем функции для использования в web.js
export { 
  initCalculatorModule, 
  loadCalculatorSaveById,
  selectCharacter,
  selectWeapon,
  saveArtifact,
  calculateStats,
  calculateStatsForSave,
  // Добавьте эти экспорты для date-manager
  substatTiers,
  calculateUpgradesForSubstat,
  getSubstatRangeDisplay,
  formatSubstatValue,
  getStatDisplayName
};