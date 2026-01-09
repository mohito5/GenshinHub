// weaponData.js - данные об оружии
export const weaponsData = {
  // Одружащие (пример)
  'aquila-favonia': {
    key: 'aquila-favonia',
    en_name: 'Aquila Favonia',
    ru_name: 'Небесное крыло',
    weaponType: 'sword',
    rarity: 5,
    mainStatType: 'physical',
    avatar: '/images/weapons/aquila-favonia.png',
    icon: '/images/weapons/aquila-favonia-icon.png',
    description: {
      ru: 'Меч Фавония, древнего рыцарского ордена Мондштадта. Он может призывать ветры защиты.',
      en: 'The sword of the Knights of Favonius. It can summon the winds of protection.'
    },
    ascensionMaterials: {
      sliver: 'weapon.sliver',
      fragment: 'weapon.fragment',
      chunk: 'weapon.chunk',
      gemstone: 'weapon.gemstone',
      common: 'weapon.common',
      elite: 'weapon.elite',
      boss: 'weapon.boss',
      mora: 'weapon.mora'
    },
    refinementMaterials: {
      duplicate: 'weapon.duplicate',
      special: 'weapon.special'
    },
    stats: {
      baseAttack: {
        1: 48,
        20: 133,
        40: 261,
        50: 341,
        60: 423,
        70: 506,
        80: 590,
        90: 674
      },
      secondaryStat: {
        type: 'physical',
        values: {
          1: 9.0,
          20: 25.0,
          40: 49.0,
          50: 64.0,
          60: 79.0,
          70: 94.0,
          80: 110.0,
          90: 125.0
        }
      }
    },
    passiveAbility: {
      name: {
        ru: 'Возвращение на крыльях Фавония',
        en: 'Falcon\'s Return'
      },
      description: {
        ru: 'Увеличивает силу атаки на 20%. При получении урона: душа Фавония пробуждается, призывая знамя сопротивления, восстанавливает HP, равное 100% от силы атаки, и наносит урон, равный 200% от силы атаки, окружающим врагам. Может возникнуть раз в 15 секунд.',
        en: 'ATK is increased by 20%. Triggers on taking DMG: the soul of the Falcon of the West awakens, holding the banner of the resistance aloft, regenerating HP equal to 100% of ATK and dealing 200% of ATK as DMG to surrounding opponents. This effect can only occur once every 15s.'
      },
      refinements: [
        'ATK +20%/HP恢复100%/DMG 200%',
        'ATK +25%/HP恢复115%/DMG 230%',
        'ATK +30%/HP恢复130%/DMG 260%',
        'ATK +35%/HP恢复145%/DMG 290%',
        'ATK +40%/HP恢复160%/DMG 320%'
      ]
    }
  },

  'wolfs-gravestone': {
    key: 'wolfs-gravestone',
    en_name: 'Wolf\'s Gravestone',
    ru_name: 'Волчья погибель',
    weaponType: 'claymore',
    rarity: 5,
    mainStatType: 'attack',
    avatar: '/images/weapons/wolfs-gravestone.png',
    icon: '/images/weapons/wolfs-gravestone-icon.png',
    description: {
      ru: 'Двуручный меч, который использовал рыцарь волка. Изначально это была просто тяжелая железная плита, которую дал кузнец, но в руках героя она обрела силу сокрушать волков.',
      en: 'A longsword used by the Wolf Knight. Originally just a heavy sheet of iron given to the knight by a blacksmith from the city, it became endowed with legendary power owing to his friendship with the wolves.'
    },
    ascensionMaterials: {
      sliver: 'weapon.sliver',
      fragment: 'weapon.fragment',
      chunk: 'weapon.chunk',
      gemstone: 'weapon.gemstone',
      common: 'weapon.common',
      elite: 'weapon.elite',
      boss: 'weapon.boss',
      mora: 'weapon.mora'
    },
    refinementMaterials: {
      duplicate: 'weapon.duplicate',
      special: 'weapon.special'
    },
    stats: {
      baseAttack: {
        1: 46,
        20: 122,
        40: 235,
        50: 308,
        60: 382,
        70: 457,
        80: 532,
        90: 608
      },
      secondaryStat: {
        type: 'attack',
        values: {
          1: 10.8,
          20: 30.0,
          40: 58.0,
          50: 76.0,
          60: 94.0,
          70: 112.0,
          80: 130.0,
          90: 149.0
        }
      }
    },
    passiveAbility: {
      name: {
        ru: 'Волк-странник',
        en: 'Wolfish Tracker'
      },
      description: {
        ru: 'Увеличивает силу атаки на 20%. При попадании по врагу с HP ниже 30% увеличивает силу атаки всех членов отряда на 40% в течение 12 сек. Может возникнуть раз в 30 сек.',
        en: 'Increases ATK by 20%. On hit, attacks against opponents with less than 30% HP increase all party members\' ATK by 40% for 12s. Can only occur once every 30s.'
      },
      refinements: [
        'ATK +20%/Party ATK +40%',
        'ATK +25%/Party ATK +50%',
        'ATK +30%/Party ATK +60%',
        'ATK +35%/Party ATK +70%',
        'ATK +40%/Party ATK +80%'
      ]
    }
  },

  'skyward-harp': {
    key: 'skyward-harp',
    en_name: 'Skyward Harp',
    ru_name: 'Небесное крыло',
    weaponType: 'bow',
    rarity: 5,
    mainStatType: 'crit',
    avatar: '/images/weapons/skyward-harp.png',
    icon: '/images/weapons/skyward-harp-icon.png',
    description: {
      ru: 'Большой лук, символ дружбы ветра Двалина и барда. Звуки его струн — это голос небесных ветров.',
      en: 'A greatbow that symbolizes Dvalin\'s affiliation with the Anemo Archon. The sound of the bow firing is music to the Anemo Archon\'s ears. It contains the power of the sky and wind within.'
    },
    ascensionMaterials: {
      sliver: 'weapon.sliver',
      fragment: 'weapon.fragment',
      chunk: 'weapon.chunk',
      gemstone: 'weapon.gemstone',
      common: 'weapon.common',
      elite: 'weapon.elite',
      boss: 'weapon.boss',
      mora: 'weapon.mora'
    },
    stats: {
      baseAttack: {
        1: 48,
        20: 133,
        40: 261,
        50: 341,
        60: 423,
        70: 506,
        80: 590,
        90: 674
      },
      secondaryStat: {
        type: 'crit',
        values: {
          1: 4.8,
          20: 13.3,
          40: 26.1,
          50: 34.1,
          60: 42.3,
          70: 50.6,
          80: 59.0,
          90: 67.4
        }
      }
    }
  },

  // Добавьте больше оружия по аналогии...

  'prototype-rancour': {
    key: 'prototype-rancour',
    en_name: 'Prototype Rancour',
    ru_name: 'Прототип: злоба',
    weaponType: 'sword',
    rarity: 4,
    mainStatType: 'physical',
    avatar: '/images/weapons/prototype-rancour.png',
    icon: '/images/weapons/prototype-rancour-icon.png',
    description: {
      ru: 'Древний меч, обнаруженный в Черногорье. Он может прорубать даже горные породы.',
      en: 'An ancient longsword discovered in the Blackcliff Forge. It can cut through rock like a hot knife through butter.'
    }
  },

  'favonius-warbow': {
    key: 'favonius-warbow',
    en_name: 'Favonius Warbow',
    ru_name: 'Охотничий лук Фавония',
    weaponType: 'bow',
    rarity: 4,
    mainStatType: 'energy',
    avatar: '/images/weapons/favonius-warbow.png',
    icon: '/images/weapons/favonius-warbow-icon.png',
    description: {
      ru: 'Стандартный лук Ордо Фавониус. Только лучшие лучники могут использовать его в полную силу.',
      en: 'A standard-issue recurve bow of the Knights of Favonius. Only the best archers can unleash its full potential.'
    }
  }
};

// Дополнительные данные для фильтров и категорий
export const weaponTypes = [
  'sword',
  'claymore', 
  'polearm',
  'bow',
  'catalyst'
];

export const mainStatTypes = [
  'attack',
  'physical',
  'elemental',
  'energy',
  'crit',
  'defense',
  'hp'
];

// Функция для получения всех оружий по типу
export function getWeaponsByType(type) {
  return Object.values(weaponsData).filter(weapon => weapon.weaponType === type);
}

// Функция для получения всех оружий по редкости
export function getWeaponsByRarity(rarity) {
  return Object.values(weaponsData).filter(weapon => weapon.rarity === rarity);
}