// characterData.js
export const charsData = {
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
    description: "Флинс — главный герой, смелый и умный воин, обладающий силой Электро.",
    bio: {
      ru: "Флинс — опытный воин из Снежной, специализирующийся на владении копьём и контроле над Электро энергией.",
      en: "Flins is an experienced warrior from Snezhnaya, specializing in spear mastery and Electro energy control."
    },
    
    // Характеристики по уровням
    hp: {
      lv1: "1020",
      lv20: "2642",
      lv40: "5128",
      lv50: "6635",
      lv60: "8389",
      lv70: "10245",
      lv80: "12347",
      lv90: "14695"
    },
    
    atk: {
      lv1: "27",
      lv20: "70",
      lv40: "136",
      lv50: "176",
      lv60: "223",
      lv70: "272",
      lv80: "328",
      lv90: "391"
    },
    
    def: {
      lv1: "62",
      lv20: "160",
      lv40: "310",
      lv50: "402",
      lv60: "508",
      lv70: "621",
      lv80: "749",
      lv90: "892"
    },
    
    // Таланты
    attack: "Демоническое копьё",
    skill: "Древний обряд: Тайный свет",
    explosion: "Древний ритуал: Наступает ночь",
    
    // Описания талантов
    des_attack: "<span><b>Обычная атака:</b><br>До пяти последовательных ударов копьём.<br><br><b>Заряженная атака:</b><br>Совершает рывок вперёд, нанося урон всем противникам на пути.</span>",
    des_skill: "Призывает древнюю силу Электро, нанося урон области и накладывая статус «Освещение» на врагов.",
    des_burst: "Вызывает мощную грозу, которая наносит массовый урон Электро и повышает скорость атаки персонажа.",
    
    // Статистика атаки по уровням
    stat_attack: {
      a1: {
        label: "Удар 1",
        value: "множитель урона",
        levels: {
          1: "45.6%",
          2: "49.0%",
          3: "52.4%",
          4: "57.4%",
          5: "60.8%",
          6: "64.2%",
          7: "69.2%",
          8: "74.2%",
          9: "79.2%",
          10: "84.2%"
        }
      },
      a2: {
        label: "Удар 2",
        value: "множитель урона",
        levels: {
          1: "46.3%",
          2: "49.8%",
          3: "53.3%",
          4: "58.4%",
          5: "61.9%",
          6: "65.4%",
          7: "70.5%",
          8: "75.6%",
          9: "80.7%",
          10: "85.8%"
        }
      },
      a3: {
        label: "Удар 3",
        value: "множитель урона",
        levels: {
          1: "56.1%",
          2: "60.3%",
          3: "64.5%",
          4: "70.7%",
          5: "74.9%",
          6: "79.1%",
          7: "85.3%",
          8: "91.5%",
          9: "97.7%",
          10: "103.9%"
        }
      },
      a4: {
        label: "Удар 4",
        value: "множитель урона",
        levels: {
          1: "59.8%",
          2: "64.3%",
          3: "68.8%",
          4: "75.4%",
          5: "79.9%",
          6: "84.4%",
          7: "91.0%",
          8: "97.6%",
          9: "104.2%",
          10: "110.8%"
        }
      },
      a5: {
        label: "Удар 5",
        value: "множитель урона",
        levels: {
          1: "71.9%",
          2: "77.3%",
          3: "82.7%",
          4: "90.6%",
          5: "96.0%",
          6: "101.4%",
          7: "109.3%",
          8: "117.2%",
          9: "125.1%",
          10: "133.0%"
        }
      },
      charged: {
        label: "Заряженная атака",
        value: "множитель урона",
        levels: {
          1: "121%",
          2: "130%",
          3: "139%",
          4: "152%",
          5: "161%",
          6: "170%",
          7: "183%",
          8: "196%",
          9: "209%",
          10: "222%"
        }
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
    ru_name: "Лаума",
    en_name: "Lauma",
    rarity: "4",
    avatar_icon: "assets/avatar-icon/lauma_icon.png",
    element: "Dendro",
    weapon: "Catalyst",
    description: "Лаума — главный герой, смелый и умный.",
    atack: "Демоническое копьё",
    skill: "Древний обряд: Тайный свет",
    explosion: "Древний ритуал: Наступает ночь",
    icon: "images/Lauma.png",
    s1: "assets/lauma_s1.png",
    s2: "assets/lauma_s2.png",
    s3: "assets/lauma_s3.png",
    ascensionMaterials: {}
  },
  Chasca: {
    ru_name: "Часка",
    en_name: "Chasca",
    avatar_icon: "assets/avatar-icon/chasca_icon.png",
    rarity: "5",
    element: "Anemo",
    weapon: "Bow",
  },
  Chiori:{
    ru_name: "Тиори",
    en_name: "Chiori",
    avatar_icon: "assets/avatar-icon/chiori_icon.png",
    rarity: "5",
    element: "Geo",
    weapon: "Sword",
  },
  Eula:{
    ru_name: "Эола",
    en_name: "Eula",
    avatar_icon: "assets/avatar-icon/eula_icon.png",
    rarity: "5",
    element: "Cryo",
    weapon: "Claymore",
  },
  Mavuika:{
    ru_name: "Мавуика",
    en_name: "Mavuika",
    avatar_icon: "assets/avatar-icon/mavuika_icon.png",
    rarity: "5",
    element: "Pyro",
    weapon: "Claymore",
  },
  Ayato:{
    ru_name: "Камисато Аято",
    en_name: "Kamisato Ayato",
    avatar_icon: "assets/avatar-icon/ayato-icon.png",
    rarity: "5",
    element: "Hydro",
    weapon: "Sword",
  }
};
