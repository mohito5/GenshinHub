window.charsData = {
  Flins: {
    ru_name:"Флинс",
    en_name:"Flins",
    date: '12-31',
    // аватар ,элемент тип оружия
    avatar:"assets/avatar/flins.png",
    rarity: "five",
    element: "Electro",
    type: "Pole",
    // описание
    description: "Флинс - главный герой, смелый и умный.",
    // обычная атака
    attack: "Демоническое копье",
    des_attack: "<span><b>Обычная атака:</b><br>До пяти последовательных ударов копьем.<br><br><b>fff</b></span>",
    stat_attack:{
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
      a3: "",
    },
    // элементальный навык
    skill: "Древний обряд: Тайный свет",
    explosion: "Древний ритуал: Наступает ночь",
      // иконки для кнопок
    boldIcon: "images/Flins.png", //для страницы настройки талантов
    s1: "assets/flins_s1.png",
    s2: "assets/flins_s2.png",
    s3: "assets/flins_s3.png",
    icon: "assets/Element_Electro.webp", //нужно добавить avataricon для в карточке выбора перса и поменять в js
      
    ascensionMaterials: {
      sliver: ["Electro"],
      fragment: ["Electro"],
      chunk: ["Electro"],
      gemstone: ["Electro"],
      bossMaterial: ["kuuvyaka"], // ключи из materialsInfo.bossMaterial
      localSpecialty: ["frostlampFlower"],  // ключи из materialsInfo.localMaterial
      EnemyDropsSt1:["Shaft"],
      EnemyDropsSt2:["Shaft"],
      EnemyDropsSt3:["Shaft"],
      teachings:["vagrancy"],
      guide:["vagrancy"],
      philosophies:["vagrancy"]
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
  
    Lauma:{ 
      description: "Лаума - главный герой, смелый и умный.",
      atack: "Демоническое копье",
      skill: "Древний обряд: Тайный свет",
      explosion: "Древний ритуал: Наступает ночь",
      icon: "images/Lauma.png",
      s1: "assets/lauma_s1.png",
      s2: "assets/lauma_s2.png",
      s3: "assets/lauma_s3.png",
      ascensionMaterials: {
    
    },
    }
  };
