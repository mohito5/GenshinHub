// characterData.js
export const charsData = {
  Flins: {
    //
    ru_name: "Флинс",
    en_name: "Flins",
    //
    date: '12-21',
    //
    avatar: "assets/avatar/flins.png",
    avatar_icon: "assets/avatar-icon/flins-icon.png",
    rarity: "five",
    element: "Electro",
    type: "Polearm",
    weapon: "Polearm",
    description: "Флинс — главный герой, смелый и умный.",
    attack: "Демоническое копьё",
    des_attack: "<span><b>Обычная атака:</b><br>До пяти последовательных ударов копьём.<br><br><b>fff</b></span>",
    stat_attack: {
      a1: {
        label: "Атака 1.",
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
        label: "Атака 2.",
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
      a3: ""
    },
    skill: "Древний обряд: Тайный свет",
    explosion: "Древний ритуал: Наступает ночь",
    boldIcon: "images/Flins.png",
    s1: "assets/flins_s1.png",
    s2: "assets/flins_s2.png",
    s3: "assets/flins_s3.png",
    icon: "assets/Element_Electro.webp",
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
    },
    hp: {
      lv10: "100",
      lv20: "200"
    },
    values3: {
      lv10: "100",
      lv20: "200"
    }
  },
  Lauma: {
    ru_name: "Лаума",
    en_name: "Lauma",
    rarity: "five",
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
    rarity: "five",
    element: "Anemo",
    weapon: "Bow",
  },
  Chiori:{
    ru_name: "Тиори",
    en_name: "Chiori",
    rarity: "five",
    element: "Geo",
    weapon: "Sword",
  },
  Eula:{
    ru_name: "Эола",
    en_name: "Eula",
    rarity: "five",
    element: "Cryo",
    weapon: "Claymore",
  },
  Mavuika:{
    ru_name: "Мавуика",
    en_name: "Mavuika",
    rarity: "five",
    element: "Pyro",
    weapon: "Claymore",
  },
  Ayato:{
    ru_name: "Камисато Аято",
    en_name: "Kamisato Ayato",
    rarity: "five",
    element: "Hydro",
    weapon: "Sword",
  }
};
