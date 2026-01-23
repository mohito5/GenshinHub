// utils/character-localization.js
export function getLocalizedCharacterString(data, lang) {
  if (!data) return '';
  
  // Если данные - это строка (старый формат)
  if (typeof data === 'string') return data;
  
  // Если данные - это объект с локализацией
  if (typeof data === 'object') {
    if (data[lang]) return data[lang];
    // Если нет для текущего языка, пробуем русский, затем английский
    if (data.ru) return data.ru;
    if (data.en) return data.en;
  }
  
  // Если ничего не найдено
  return '';
}

// Функция для получения локализованного элемента
export function getLocalizedElement(elementKey, lang) {
  const elements = {
    'Electro': { ru: 'Электро', en: 'Electro' },
    'Dendro': { ru: 'Дендро', en: 'Dendro' },
    'Anemo': { ru: 'Анемо', en: 'Anemo' },
    'Geo': { ru: 'Гео', en: 'Geo' },
    'Pyro': { ru: 'Пиро', en: 'Pyro' },
    'Hydro': { ru: 'Гидро', en: 'Hydro' },
    'Cryo': { ru: 'Крио', en: 'Cryo' }
  };
  
  return elements[elementKey]?.[lang] || elementKey;
}

// Функция для получения локализованного оружия
export function getLocalizedWeapon(weaponKey, lang) {
  const weapons = {
    'Polearm': { ru: 'Копьё', en: 'Polearm' },
    'Catalyst': { ru: 'Катализатор', en: 'Catalyst' },
    'Bow': { ru: 'Лук', en: 'Bow' },
    'Sword': { ru: 'Меч', en: 'Sword' },
    'Claymore': { ru: 'Двуручный меч', en: 'Claymore' }
  };
  
  return weapons[weaponKey]?.[lang] || weaponKey;
}