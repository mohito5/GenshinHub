// date-data.js - расширенные данные для фильтрации
export const fishingData = {
  categories: [
    {
      id: 'mondstadt',
      name: 'Мондштадт',
      fishes: [
        {
          id: 'golden_koi',
          name: { ru: 'Золотой карп', en: 'Golden Koi' },
          rarity: '★★★',
          family: 'Карп',
          location: 'Озеро Звездопадов',
          time: 'День',
          bait: { ru: 'Дождевой червь', en: 'Rain Worm' },
          difficulty: 'Легкая',
          size: 'Средний',
          stats: { points: 10, special: 'Нет' },
          description: 'Редкая рыба, обитающая в водах Мондштадта.',
          filters: {
            region: 'mondstadt',
            rarity: 3,
            difficulty: 'easy'
          }
        },
        {
          id: 'snow_strider',
          name: { ru: 'Снежный ходок', en: 'Snow Strider' },
          rarity: '★★★★',
          family: 'Снежная рыба',
          location: 'Драконий хребет',
          time: 'Любое',
          bait: { ru: 'Сверчок', en: 'Cricket' },
          difficulty: 'Средняя',
          size: 'Крупный',
          stats: { points: 15, special: 'Морозостойкость' },
          description: 'Рыба, адаптированная к холодным водам.',
          filters: {
            region: 'mondstadt',
            rarity: 4,
            difficulty: 'medium'
          }
        }
        // Добавьте больше рыб...
      ]
    },
    {
      id: 'liyue',
      name: 'Ли Юэ',
      fishes: [
        {
          id: 'jade_loach',
          name: { ru: 'Нефритовый вьюн', en: 'Jade Loach' },
          rarity: '★★',
          family: 'Вьюн',
          location: 'Река Бишуй',
          time: 'Ночь',
          bait: { ru: 'Плод мушмулы', en: 'Medlar Fruit' },
          difficulty: 'Легкая',
          size: 'Мелкий',
          stats: { points: 8, special: 'Нет' },
          description: 'Вьюн с нефритовым отливом чешуи.',
          filters: {
            region: 'liyue',
            rarity: 2,
            difficulty: 'easy'
          }
        }
        // Добавьте больше рыб...
      ]
    }
    // Добавьте больше регионов...
  ]
};

export const creaturesData = {
  categories: [
    {
      id: 'hilichurls',
      name: 'Хиличурлы',
      creatures: [
        {
          id: 'hilichurl_fighter',
          name: { ru: 'Хиличурл-боец', en: 'Hilichurl Fighter' },
          type: 'common',
          region: 'Мондштадт',
          description: 'Обычный хиличурл с деревянной дубиной.',
          stats: {
            hp: [500, 1200, 2400, 4800, 9600],
            attack: [30, 60, 120, 240, 480],
            defense: [20, 40, 80, 160, 320],
            resistances: {
              pyro: 10,
              hydro: 0,
              electro: 0,
              cryo: 0,
              anemo: 0,
              geo: 0,
              dendro: 0,
              physical: 20
            }
          },
          drops: ['Разбитая маска', 'Грязная маска', 'Зловещая маска'],
          behavior: 'Атакует при приближении. Использует простые удары.',
          filters: {
            type: 'common',
            region: 'mondstadt',
            element: 'physical'
          }
        }
        // Добавьте больше существ...
      ]
    }
    // Добавьте больше категорий...
  ]
};

// artifactsData.js - исправленная структура данных для артефактов
// date-data.js - добавляем новые функции и данные для артефактов
// date-data.js - добавьте эти данные для тестирования

// В объект artifactsData добавьте:
export const artifactsData = {
  sets: [
    {
      id: 'gladiator_finale',
      name: { ru: 'Финал гладиатора', en: 'Gladiator\'s Finale' },
      rarity: '★★★★★',
      description: 'Древний набор артефактов гладиатора.',
      pieces: [
        {
          id: 'flower',
          name: { ru: 'Цветок гладиатора', en: 'Gladiator\'s Flower' },
          type: 'Цветок жизни',
          stats: {
            main: 'HP',
            substats: ['HP%', 'ATK%', 'DEF%', 'Крит. шанс%', 'Крит. урон%', 'Восст. энергии%', 'Мастерство стихий']
          }
        },
        {
          id: 'plume',
          name: { ru: 'Перо гладиатора', en: 'Gladiator\'s Plume' },
          type: 'Перо смерти',
          stats: {
            main: 'ATK',
            substats: ['HP%', 'ATK%', 'DEF%', 'Крит. шанс%', 'Крит. урон%', 'Восст. энергии%', 'Мастерство стихий']
          }
        },
        {
          id: 'sands',
          name: { ru: 'Пески гладиатора', en: 'Gladiator\'s Sands' },
          type: 'Пески времени',
          stats: {
            mainStats: ['HP%', 'ATK%', 'DEF%', 'Восст. энергии%', 'Мастерство стихий'],
            substats: ['HP', 'ATK', 'DEF', 'Крит. шанс%', 'Крит. урон%']
          }
        },
        {
          id: 'goblet',
          name: { ru: 'Кубок гладиатора', en: 'Gladiator\'s Goblet' },
          type: 'Кубок пространства',
          stats: {
            mainStats: ['HP%', 'ATK%', 'DEF%', 'Бонус Пиро урона%', 'Бонус Гидро урона%', 'Бонус Электро урона%', 'Бонус Крио урона%', 'Бонус Анемо урона%', 'Бонус Гео урона%', 'Бонус Дендро урона%', 'Бонус физ. урона%'],
            substats: ['HP', 'ATK', 'DEF', 'Крит. шанс%', 'Крит. урон%', 'Восст. энергии%', 'Мастерство стихий']
          }
        },
        {
          id: 'circlet',
          name: { ru: 'Корона гладиатора', en: 'Gladiator\'s Circlet' },
          type: 'Корона разума',
          stats: {
            mainStats: ['HP%', 'ATK%', 'DEF%', 'Крит. шанс%', 'Крит. урон%', 'Бонус лечения%'],
            substats: ['HP', 'ATK', 'DEF', 'Крит. шанс%', 'Крит. урон%', 'Восст. энергии%', 'Мастерство стихий']
          }
        }
      ],
      setBonus: {
        '2-piece': { ru: 'Увеличивает силу атаки на 18%', en: 'ATK +18%' },
        '4-piece': { ru: 'Увеличивает урон обычной атаки на 35%', en: 'Normal Attack DMG +35%' }
      }
    }
    // Добавьте больше сета артефактов...
  ],
  
  mainStatLevels: {
    flower: { 0: 717, 4: 920, 8: 1123, 12: 1326, 16: 1529, 20: 4780 },
    plume: { 0: 47, 4: 60, 8: 73, 12: 86, 16: 100, 20: 311 },
    sands: {
      'HP%': { 0: 7.0, 4: 9.0, 8: 11.0, 12: 12.9, 16: 14.9, 20: 46.6 },
      'ATK%': { 0: 7.0, 4: 9.0, 8: 11.0, 12: 12.9, 16: 14.9, 20: 46.6 },
      'DEF%': { 0: 8.7, 4: 11.2, 8: 13.7, 12: 16.2, 16: 18.6, 20: 58.3 },
      'Восст. энергии%': { 0: 7.8, 4: 10.0, 8: 12.2, 12: 14.4, 16: 16.6, 20: 51.8 },
      'Мастерство стихий': { 0: 28, 4: 36, 8: 44, 12: 52, 16: 60, 20: 187 }
    },
    goblet: {
      'HP%': { 0: 7.0, 4: 9.0, 8: 11.0, 12: 12.9, 16: 14.9, 20: 46.6 },
      'ATK%': { 0: 7.0, 4: 9.0, 8: 11.0, 12: 12.9, 16: 14.9, 20: 46.6 },
      'DEF%': { 0: 8.7, 4: 11.2, 8: 13.7, 12: 16.2, 16: 18.6, 20: 58.3 },
      'Мастерство стихий': { 0: 28, 4: 36, 8: 44, 12: 52, 16: 60, 20: 187 },
      'Бонус Пиро урона%': { 0: 7.0, 4: 9.0, 8: 11.0, 12: 12.9, 16: 14.9, 20: 46.6 },
      'Бонус Гидро урона%': { 0: 7.0, 4: 9.0, 8: 11.0, 12: 12.9, 16: 14.9, 20: 46.6 },
      'Бонус Электро урона%': { 0: 7.0, 4: 9.0, 8: 11.0, 12: 12.9, 16: 14.9, 20: 46.6 },
      'Бонус Крио урона%': { 0: 7.0, 4: 9.0, 8: 11.0, 12: 12.9, 16: 14.9, 20: 46.6 },
      'Бонус Анемо урона%': { 0: 7.0, 4: 9.0, 8: 11.0, 12: 12.9, 16: 14.9, 20: 46.6 },
      'Бонус Гео урона%': { 0: 7.0, 4: 9.0, 8: 11.0, 12: 12.9, 16: 14.9, 20: 46.6 },
      'Бонус Дендро урона%': { 0: 7.0, 4: 9.0, 8: 11.0, 12: 12.9, 16: 14.9, 20: 46.6 },
      'Бонус физ. урона%': { 0: 8.7, 4: 11.2, 8: 13.7, 12: 16.2, 16: 18.6, 20: 58.3 }
    },
    circlet: {
      'HP%': { 0: 7.0, 4: 9.0, 8: 11.0, 12: 12.9, 16: 14.9, 20: 46.6 },
      'ATK%': { 0: 7.0, 4: 9.0, 8: 11.0, 12: 12.9, 16: 14.9, 20: 46.6 },
      'DEF%': { 0: 8.7, 4: 11.2, 8: 13.7, 12: 16.2, 16: 18.6, 20: 58.3 },
      'Мастерство стихий': { 0: 28, 4: 36, 8: 44, 12: 52, 16: 60, 20: 187 },
      'Крит. шанс%': { 0: 4.7, 4: 6.0, 8: 7.3, 12: 8.6, 16: 9.9, 20: 31.1 },
      'Крит. урон%': { 0: 9.3, 4: 12.0, 8: 14.7, 12: 17.3, 16: 20.0, 20: 62.2 },
      'Бонус лечения%': { 0: 5.4, 4: 6.9, 8: 8.4, 12: 10.0, 16: 11.5, 20: 35.9 }
    }
  },
  
  substatValues: {
    'hp%': {
      base: 2.5,
      increments: [2.7, 3.1, 3.5, 3.9, 4.3, 4.7, 5.1, 5.4, 5.8],
      maxUpgrades: 4
    },
    'atk%': {
      base: 2.5,
      increments: [2.7, 3.1, 3.5, 3.9, 4.3, 4.7, 5.1, 5.4, 5.8],
      maxUpgrades: 4
    },
    'def%': {
      base: 3.1,
      increments: [3.5, 3.9, 4.3, 4.7, 5.2, 5.6, 6.0, 6.4, 6.8],
      maxUpgrades: 4
    },
    'er%': {
      base: 2.7,
      increments: [3.1, 3.5, 3.9, 4.3, 4.7, 5.2, 5.6, 6.0, 6.4],
      maxUpgrades: 4
    },
    'em': {
      base: 10,
      increments: [11, 12, 13, 14, 16, 17, 18, 19, 20],
      maxUpgrades: 4
    },
    'critRate%': {
      base: 1.7,
      increments: [1.9, 2.2, 2.5, 2.8, 3.1, 3.3, 3.5, 3.7, 3.9],
      maxUpgrades: 4
    },
    'critDmg%': {
      base: 3.5,
      increments: [3.9, 4.3, 4.7, 5.2, 5.6, 6.0, 6.4, 6.8, 7.2],
      maxUpgrades: 4
    },
    'hp': {
      base: 210,
      increments: [239, 268, 298, 327, 357, 386, 415, 445, 474],
      maxUpgrades: 4
    },
    'atk': {
      base: 14,
      increments: [16, 18, 19, 21, 23, 25, 27, 29, 31],
      maxUpgrades: 4
    },
    'def': {
      base: 16,
      increments: [19, 21, 23, 25, 28, 30, 32, 34, 37],
      maxUpgrades: 4
    }
  },
  
  artifactLevels: [0, 4, 8, 12, 16, 20],


  // Функция для получения главной статы по уровню
  getMainStatByLevel(slot, stat, level) {
    const slotData = this.mainStatLevels[slot];
    if (!slotData) return 0;
    
    if (slot === 'flower' || slot === 'plume') {
      // Для цветка и пера - плоские значения
      return slotData[level] || 0;
    } else {
      // Для остальных слотов - объект с статами
      const statData = slotData[stat];
      if (!statData) return 0;
      return statData[level] || 0;
    }
  },

  // Функция для расчета субстата
  calculateSubstatValue(substatType, upgrades = 0, rollValue = 0) {
    const substat = this.substatValues[substatType];
    if (!substat) return 0;
    
    // Базовое значение + улучшения
    const baseValue = substat.base;
    const increment = substat.increments[rollValue] || substat.increments[0];
    
    return baseValue + (increment * upgrades);
  },

  // Возможные уровни артефактов
  artifactLevels: [0, 4, 8, 12, 16, 20],

  // Максимальное количество субстатов
  maxSubstats: 4,

  // Возможные значения одного апгрейда (roll) для каждого субстата
  getPossibleRolls(substatType) {
    const substat = this.substatValues[substatType];
    if (!substat) return [];
    
    return substat.increments.map((value, index) => ({
      value: value,
      index: index,
      display: substatType.includes('%') ? 
        `${value.toFixed(1)}%` : 
        Math.round(value)
    }));
  }
};

// Экспортируем функции отдельно для удобства
export function getArtifactStatByLevel(slot, stat, level) {
  return artifactsData.getMainStatByLevel(slot, stat, level);
}

export function getSubstatValue(substatType, upgrades = 0, rollIndex = 0) {
  return artifactsData.calculateSubstatValue(substatType, upgrades, rollIndex);
}

export function getArtifactLevels() {
  return artifactsData.artifactLevels;
}

export function getMaxSubstats() {
  return artifactsData.maxSubstats;
}

