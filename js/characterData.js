// characterData.js - обновленная структура с массивами
export const charsData = {
  Varka: {
    key: "Varka",
    ru_name: "Варка",
    en_name: "Varka",
    avatar: "assets/avatar/varka.png",
    avatar_icon: "assets/avatar-icon/varka.webp",
    rarity: "5",
    element: "Anemo",
    weapon: "Claymore",

    // Материалы для возвышения
    ascensionMaterials: {
      sliver: ["Anemo"],
      fragment: ["Anemo"],
      chunk: ["Anemo"],
      gemstone: ["Anemo"],
      bossMaterial: ["kuuvyaka"],
      localSpecialty: ["Wolfhook"],
      EnemyDropsSt1: ["Shaft"],
      EnemyDropsSt2: ["Shaft"],
      EnemyDropsSt3: ["Shaft"],
      teachings: ["Freedom"],
      guide: ["Freedom"],
      philosophies: ["Freedom"]
    }
  },
  Flins: {
    key: "Flins",
    ru_name: "Флинс",
    en_name: "Flins",
    date: '12-21',
    avatar: "assets/avatar/flins.png",
    avatar_icon: "assets/avatar-icon/flins-icon.png",
    rarity: "5",
    element: "Electro",
    weapon: "Polearm",
    region: "Snezhnaya",
    description: {
      ru: "Флинс — главный герой, смелый и умный воин, обладающий силой Электро.",
      en: "Flins is the main hero, a brave and smart warrior wielding Electro power."
    },
    bio: {
      ru: "Флинс — опытный воин из Снежной, специализирующийся на владении копьём и контроле над Электро энергией.",
      en: "Flins is an experienced warrior from Snezhnaya, specializing in spear mastery and Electro energy control."
    },
    
    // Характеристики по уровням как массивы
    // Индексы: 0=1, 1=20, 2=40, 3=50, 4=60, 5=70, 6=80, 7=90
    hp: [1020, 2642, 5128, 6635, 8389, 10245, 12347, 14695],
    atk: [27, 70, 136, 176, 223, 272, 328, 391],
    def: [62, 160, 310, 402, 508, 621, 749, 892],
    
    // Таланты
    // Таланты с локализацией
    attack: {
      ru: "Демоническое копьё",
      en: "Demonic Spear"
    },
    skill: {
      ru: "Древний обряд: Тайный свет",
      en: "Ancient Ritual: Secret Light"
    },
    explosion: {
      ru: "Древний ритуал: Наступает ночь",
      en: "Ancient Ritual: Night Falls"
    },
    
    // Описания талантов
    des_attack: {
      ru: "<span><b>Обычная атака:</b><br>До пяти последовательных ударов копьём.<br><br><b>Заряженная атака:</b><br>Совершает рывок вперёд, нанося урон всем противникам на пути.</span>",
      en: "<span><b>Normal Attack:</b><br>Performs up to five consecutive spear strikes.<br><br><b>Charged Attack:</b><br>Dashes forward, damaging all enemies in the path.</span>"
    },
    des_skill: {
      ru: "Призывает древнюю силу Электро, нанося урон области и накладывая статус «Освещение» на врагов.",
      en: "Summons ancient Electro power, dealing area damage and applying the 'Illumination' status to enemies."
    },
    des_burst: {
      ru: "Вызывает мощную грозу, которая наносит массовый урон Электро и повышает скорость атаки персонажа.",
      en: "Summons a powerful thunderstorm that deals massive Electro damage and increases the character's attack speed."
    },
    
    // Статистика атаки по уровням как массивы
    // Каждый массив содержит значения для уровней 1-10
    stat_attack: {
      a1: {
        label: {
          ru: "Удар 1",
          en: "Strike 1"
        },
        value: "множитель урона",
        levels: ["45.6%", "49.0%", "52.4%", "57.4%", "60.8%", "64.2%", "69.2%", "74.2%", "79.2%", "84.2%"]
      },
      a2: {
        label: {
          ru: "Удар 2",
          en: "Strike 2"
        },
        value: "множитель урона",
        levels: ["46.3%", "49.8%", "53.3%", "58.4%", "61.9%", "65.4%", "70.5%", "75.6%", "80.7%", "85.8%"]
      },
      a3: {
        label: {
          ru: "Удар 3",
          en: "Strike 3"
        },
        value: "множитель урона",
        levels: ["56.1%", "60.3%", "64.5%", "70.7%", "74.9%", "79.1%", "85.3%", "91.5%", "97.7%", "103.9%"]
      },
      a4: {
        label: {
          ru: "Удар 4",
          en: "Strike 4"
        },
        value: "множитель урона",
        levels: ["59.8%", "64.3%", "68.8%", "75.4%", "79.9%", "84.4%", "91.0%", "97.6%", "104.2%", "110.8%"]
      },
      a5: {
        label: {
          ru: "Удар 5",
          en: "Strike 5"
        },
        value: "множитель урона",
        levels: ["71.9%", "77.3%", "82.7%", "90.6%", "96.0%", "101.4%", "109.3%", "117.2%", "125.1%", "133.0%"]
      },
      charged: {
        label: "Заряженная атака",
        value: "множитель урона",
        levels: ["121%", "130%", "139%", "152%", "161%", "170%", "183%", "196%", "209%", "222%"]
      }
    },
    
    // Иконки
    s1: "assets/char-talent-icon/flins/flins_s1.png",
    s2: "assets/char-talent-icon/flins/flins_s2.png",
    s3: "assets/char-talent-icon/flins/flins_s3.png",
    
    // Созвездия
    constellations: {
      c1: {
        name: {
          ru: "Пронзающая молния",
          en: "Piercing Lightning"
        },
        description: {
          ru: "Увеличивает длительность эффекта «Освещение» на 3 секунды.",
          en: "Increases the duration of the 'Illumination' effect by 3 seconds."
        },
        icon: "assets/constellations/flins_c1.png"
      },
      c2: {
        name: {
          ru: "Грозовой рывок",
          en: "Thunder Dash"
        },
        description: {
          ru: "Уменьшает перезарядку заряженной атаки на 20%.",
          en: "Reduces charged attack cooldown by 20%."
        },
        icon: "assets/constellations/flins_c2.png"
      },
      c3: {
        name: {
          ru: "Древняя мудрость",
          en: "Ancient Wisdom"
        },
        description: {
          ru: "Увеличивает уровень навыка «Древний обряд: Тайный свет» на 3.",
          en: "Increases the level of 'Ancient Ritual: Secret Light' by 3."
        },
        icon: "assets/constellations/flins_c3.png"
      },
      c4: {
        name: {
          ru: "Электро буря",
          en: "Electro Storm"
        },
        description: {
          ru: "При активации взрыва стихии восстанавливает 15 энергии всем членам отряда.",
          en: "When Elemental Burst is activated, restores 15 Energy to all party members."
        },
        icon: "assets/constellations/flins_c4.png"
      },
      c5: {
        name: {
          ru: "Вечное сияние",
          en: "Eternal Radiance"
        },
        description: {
          ru: "Увеличивает уровень взрыва стихии «Древний ритуал: Наступает ночь» на 3.",
          en: "Increases the level of 'Ancient Ritual: Night Falls' by 3."
        },
        icon: "assets/constellations/flins_c5.png"
      },
      c6: {
        name: {
          ru: "Повелитель молний",
          en: "Lightning Lord"
        },
        description: {
          ru: "Критические попадания взрывом стихии накладывают на врагов статус «Гроза», увеличивая получаемый ими урон Электро на 30%.",
          en: "Critical hits with Elemental Burst apply 'Thunderstorm' to enemies, increasing Electro DMG taken by 30%."
        },
        icon: "assets/constellations/flins_c6.png"
      }
    },
    
    // Материалы для возвышения
    ascensionMaterials: {
      sliver: ["Electro"],
      fragment: ["Electro"],
      chunk: ["Electro"],
      gemstone: ["Electro"],
      bossMaterial: ["kuuvyaka"],
      localSpecialty: ["frostlampFlower"],
      EnemyDropsSt1: ["Shaft"],
      EnemyDropsSt2: ["Shaft"],
      EnemyDropsSt3: ["Shaft"],
      teachings: ["vagrancy"],
      guide: ["vagrancy"],
      philosophies: ["vagrancy"]
    }
  },
  Lauma: {
    key: "Lauma",
    ru_name: "Лаума",
    en_name: "Lauma",
    rarity: "4",
    avatar: "assets/avatar/lauma.png",
    avatar_icon: "assets/avatar-icon/lauma_icon.png",
    element: "Dendro",
    weapon: "Catalyst",
    description: "Лаума — главный герой, смелый и умный.",
    
    // Характеристики как массивы
    hp: [850, 2200, 4300, 5600, 7100, 8700, 10500, 12500],
    atk: [22, 58, 114, 148, 187, 228, 275, 327],
    def: [52, 134, 260, 337, 426, 521, 628, 748],
    
    attack: "Демоническое копьё",
    skill: "Древний обряд: Тайный свет",
    explosion: "Древний ритуал: Наступает ночь",
    s1: "assets/lauma_s1.png",
    s2: "assets/lauma_s2.png",
    s3: "assets/lauma_s3.png",
    
    // Статистика атаки как массивы
    stat_attack: {
      a1: {
        label: "Удар 1",
        levels: ["38.2%", "41.0%", "43.9%", "48.1%", "51.0%", "53.9%", "58.1%", "62.3%", "66.5%", "70.7%"]
      },
      a2: {
        label: "Удар 2",
        levels: ["38.8%", "41.7%", "44.6%", "48.9%", "51.8%", "54.8%", "59.0%", "63.3%", "67.6%", "71.9%"]
      },
      a3: {
        label: "Удар 3",
        levels: ["47.0%", "50.5%", "54.0%", "59.2%", "62.7%", "66.2%", "71.4%", "76.6%", "81.8%", "87.0%"]
      }
    },
    
    ascensionMaterials: {}
  },
  Chasca: {
    key: "Chasca",
    ru_name: "Часка",
    en_name: "Chasca",
    avatar: "assets/avatar/chasca.png",
    avatar_icon: "assets/avatar-icon/chasca_icon.png",
    rarity: "5",
    element: "Anemo",
    weapon: "Bow",
    description: "Часка — мастер анемо стихии.",
    
    // Характеристики как массивы
    hp: [980, 2540, 4920, 6370, 8060, 9850, 11870, 14120],
    atk: [26, 68, 131, 170, 215, 263, 317, 377],
    def: [59, 153, 297, 385, 487, 595, 717, 854]
  },
  Chiori: {
    key: "Chiori",
    ru_name: "Тиори",
    en_name: "Chiori",
    avatar: "assets/avatar/chiori.png",
    avatar_icon: "assets/avatar-icon/chiori_icon.png",
    rarity: "5",
    element: "Geo",
    weapon: "Sword",
    description: "Тиори — искусный мастер гео.",
    
    // Характеристики как массивы
    hp: [1050, 2720, 5280, 6840, 8650, 10580, 12760, 15190],
    atk: [28, 73, 141, 183, 231, 283, 341, 406],
    def: [65, 168, 326, 422, 534, 653, 787, 937]
  },
  Eula: {
    key: "Eula",
    ru_name: "Эола",
    en_name: "Eula",
    avatar: "assets/avatar/eula.png",
    avatar_icon: "assets/avatar-icon/eula_icon.png",
    rarity: "5",
    element: "Cryo",
    weapon: "Claymore",
    description: "Эола — рыцарь крио стихии.",
    
    // Характеристики как массивы
    hp: [1030, 2670, 5180, 6710, 8490, 10380, 12520, 14900],
    atk: [27, 71, 138, 179, 226, 276, 333, 396],
    def: [58, 150, 292, 378, 478, 585, 705, 840]
  },
  Mavuika: {
    key: "Mavuika",
    ru_name: "Мавуика",
    en_name: "Mavuika",
    avatar: "assets/avatar/mavuika.png",
    avatar_icon: "assets/avatar-icon/mavuika_icon.png",
    rarity: "5",
    element: "Pyro",
    weapon: "Claymore",
    description: "Мавуика — воительница пиро.",
    
    // Характеристики как массивы
    hp: [1080, 2800, 5430, 7030, 8900, 10880, 13120, 15620],
    atk: [29, 75, 145, 188, 238, 291, 351, 418],
    def: [54, 140, 272, 352, 445, 545, 657, 782]
  },
  Ayato: {
    key: "Ayato",
    ru_name: "Камисато Аято",
    en_name: "Kamisato Ayato",
    avatar: "assets/avatar/ayato.png",
    avatar_icon: "assets/avatar-icon/ayato-icon.png",
    rarity: "5",
    element: "Hydro",
    weapon: "Sword",
    description: "Аято — мастер гидро клинка.",
    
    // Характеристики как массивы
    hp: [1060, 2750, 5330, 6900, 8730, 10670, 12870, 15320],
    atk: [30, 78, 151, 196, 248, 303, 365, 435],
    def: [61, 158, 307, 397, 502, 614, 741, 882]
  }
};