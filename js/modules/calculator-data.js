// calculator-data.js
export const calculatorArtifactsData = {
  // Пример наборов артефактов с бонусами
  sets: {
    'gladiator_finale': {
      name: { ru: 'Финал гладиатора', en: 'Gladiator\'s Finale' },
      rarity: '★★★★★',
      '2-piece': {
        ru: 'Увеличивает силу атаки на 18%',
        en: 'ATK +18%'
      },
      '4-piece': {
        ru: 'Если владелец использует одноручное, двуручное или древковое оружие, увеличивает урон обычной атаки на 35%',
        en: 'If the wielder uses a Sword, Claymore or Polearm, increases their Normal Attack DMG by 35%'
      },
      type: 'atk'
    },
    'wanderer_troupe': {
      name: { ru: 'Странствующий ансамбль', en: 'Wanderer\'s Troupe' },
      rarity: '★★★★★',
      '2-piece': {
        ru: 'Увеличивает мастерство стихий на 80',
        en: 'Increases Elemental Mastery by 80'
      },
      '4-piece': {
        ru: 'Увеличивает урон заряженной атаки на 35%, если персонаж использует катализатор или лук',
        en: 'Increases Charged Attack DMG by 35% if the character uses a Catalyst or a Bow'
      },
      type: 'em'
    },
    'noblesse_oblige': {
      name: { ru: 'Церемония древней знати', en: 'Noblesse Oblige' },
      rarity: '★★★★★',
      '2-piece': {
        ru: 'Увеличивает урон взрыва стихии на 20%',
        en: 'Elemental Burst DMG +20%'
      },
      '4-piece': {
        ru: 'Использование взрыва стихии увеличивает силу атаки всех членов отряда на 20% в течение 12 сек.',
        en: 'Using an Elemental Burst increases all party members\' ATK by 20% for 12s.'
      },
      type: 'burst'
    },
    'viridescent_venerer': {
      name: { ru: 'Изумрудная тень', en: 'Viridescent Venerer' },
      rarity: '★★★★★',
      '2-piece': {
        ru: 'Получает 15% бонус Анемо урона',
        en: 'Anemo DMG Bonus +15%'
      },
      '4-piece': {
        ru: 'Увеличивает урон Рассеивания на 60%. Уменьшает сопротивление врага к элементу, входящему в Рассеивание, на 40% в течение 10 сек.',
        en: 'Increases Swirl DMG by 60%. Decreases opponent\'s Elemental RES to the element infused in the Swirl by 40% for 10s.'
      },
      type: 'elemental'
    },
    'crimson_witch_of_flames': {
      name: { ru: 'Пылающая алая ведьма', en: 'Crimson Witch of Flames' },
      rarity: '★★★★★',
      '2-piece': {
        ru: 'Получает 15% бонус Пиро урона',
        en: 'Pyro DMG Bonus +15%'
      },
      '4-piece': {
        ru: 'Увеличивает урон реакций Перегрузка, Горение и Пар на 40%, а реакций Пар, Таяние и Пылающие на 15%. Использование элементального навыка увеличивает бонус Пиро урона 2-х предметного сета на 50% на 10 сек. Может складываться до 3 раз.',
        en: 'Increases Overloaded, Burning, and Burgeon DMG by 40%. Increases Vaporize, Melt, and Bloom DMG by 15%. Using an Elemental Skill increases the 2-Piece Set Bonus by 50% for 10s. Max 3 stacks.'
      },
      type: 'pyro'
    },
    'blizzard_strayer': {
      name: { ru: 'Заблудший в метели', en: 'Blizzard Strayer' },
      rarity: '★★★★★',
      '2-piece': {
        ru: 'Получает 15% бонус Крио урона',
        en: 'Cryo DMG Bonus +15%'
      },
      '4-piece': {
        ru: 'Если враг заморожен, крит. шанс увеличивается на 20%. Если враг находится под действием Крио, но не заморожен, крит. шанс увеличивается на 20%.',
        en: 'When a character attacks an opponent affected by Cryo, their CRIT Rate is increased by 20%. If the opponent is Frozen, CRIT Rate is increased by an additional 20%.'
      },
      type: 'cryo'
    }
  },

  // Возможные главные статы для каждого слота
  mainStats: {
    flower: {
      type: 'hp',
      values: [717, 920, 1123, 1326, 1530, 1733, 1936, 2140, 2343, 2547]
    },
    plume: {
      type: 'atk',
      values: [47, 60, 73, 86, 100, 113, 126, 140, 153, 166]
    },
    sands: {
      type: 'percentage',
      options: [
        { stat: 'hp%', values: [7.0, 9.0, 11.0, 13.0, 15.0, 17.0, 19.0, 21.0, 23.0, 25.0] },
        { stat: 'atk%', values: [7.0, 9.0, 11.0, 13.0, 15.0, 17.0, 19.0, 21.0, 23.0, 25.0] },
        { stat: 'def%', values: [8.7, 11.2, 13.7, 16.2, 18.7, 21.2, 23.7, 26.2, 28.7, 31.2] },
        { stat: 'em', values: [28, 36, 44, 52, 60, 68, 76, 84, 92, 100] },
        { stat: 'er%', values: [7.8, 10.0, 12.2, 14.4, 16.6, 18.8, 21.0, 23.2, 25.4, 27.6] }
      ]
    },
    goblet: {
      type: 'percentage',
      options: [
        { stat: 'hp%', values: [7.0, 9.0, 11.0, 13.0, 15.0, 17.0, 19.0, 21.0, 23.0, 25.0] },
        { stat: 'atk%', values: [7.0, 9.0, 11.0, 13.0, 15.0, 17.0, 19.0, 21.0, 23.0, 25.0] },
        { stat: 'def%', values: [8.7, 11.2, 13.7, 16.2, 18.7, 21.2, 23.7, 26.2, 28.7, 31.2] },
        { stat: 'pyro%', values: [7.0, 9.0, 11.0, 13.0, 15.0, 17.0, 19.0, 21.0, 23.0, 25.0] },
        { stat: 'hydro%', values: [7.0, 9.0, 11.0, 13.0, 15.0, 17.0, 19.0, 21.0, 23.0, 25.0] },
        { stat: 'electro%', values: [7.0, 9.0, 11.0, 13.0, 15.0, 17.0, 19.0, 21.0, 23.0, 25.0] },
        { stat: 'cryo%', values: [7.0, 9.0, 11.0, 13.0, 15.0, 17.0, 19.0, 21.0, 23.0, 25.0] },
        { stat: 'anemo%', values: [7.0, 9.0, 11.0, 13.0, 15.0, 17.0, 19.0, 21.0, 23.0, 25.0] },
        { stat: 'geo%', values: [7.0, 9.0, 11.0, 13.0, 15.0, 17.0, 19.0, 21.0, 23.0, 25.0] },
        { stat: 'dendro%', values: [7.0, 9.0, 11.0, 13.0, 15.0, 17.0, 19.0, 21.0, 23.0, 25.0] },
        { stat: 'em', values: [28, 36, 44, 52, 60, 68, 76, 84, 92, 100] }
      ]
    },
    circlet: {
      type: 'percentage',
      options: [
        { stat: 'hp%', values: [7.0, 9.0, 11.0, 13.0, 15.0, 17.0, 19.0, 21.0, 23.0, 25.0] },
        { stat: 'atk%', values: [7.0, 9.0, 11.0, 13.0, 15.0, 17.0, 19.0, 21.0, 23.0, 25.0] },
        { stat: 'def%', values: [8.7, 11.2, 13.7, 16.2, 18.7, 21.2, 23.7, 26.2, 28.7, 31.2] },
        { stat: 'critRate%', values: [4.7, 6.0, 7.3, 8.6, 9.9, 11.2, 12.5, 13.8, 15.1, 16.4] },
        { stat: 'critDmg%', values: [9.3, 12.0, 14.7, 17.4, 20.1, 22.8, 25.5, 28.2, 30.9, 33.6] },
        { stat: 'healing%', values: [5.4, 7.0, 8.6, 10.2, 11.8, 13.4, 15.0, 16.6, 18.2, 19.8] },
        { stat: 'em', values: [28, 36, 44, 52, 60, 68, 76, 84, 92, 100] }
      ]
    }
  },

  // Возможные второстепенные статы
  substats: {
    flat: {
      hp: [209, 239, 269, 299],
      atk: [14, 16, 18, 20],
      def: [16, 19, 21, 23]
    },
    percentage: {
      'hp%': [4.1, 4.7, 5.3, 5.8],
      'atk%': [4.1, 4.7, 5.3, 5.8],
      'def%': [5.1, 5.8, 6.6, 7.3],
      'er%': [4.5, 5.2, 5.8, 6.5],
      'em': [16, 19, 21, 23],
      'critRate%': [2.7, 3.1, 3.5, 3.9],
      'critDmg%': [5.4, 6.2, 7.0, 7.8]
    }
  },

  // Уровни артефактов
  levels: [0, 4, 8, 12, 16, 20]
};