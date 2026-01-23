// utils/number-utils.js
import { translations } from '../translations.js';

// Функция для форматирования чисел с локализацией
export function formatNumber(number, lang = 'ru') {
    if (typeof number !== 'number') {
        number = parseInt(number) || 0;
    }
    
    const translationsObj = translations[lang] || translations['ru'];
    
    if (number >= 1000000) {
        const formatted = (number / 1000000).toFixed(1).replace('.0', '');
        return translationsObj.format?.million 
            ? `${formatted}${translationsObj.format.million}`
            : (lang === 'ru' ? `${formatted}млн` : `${formatted}M`);
    } else if (number >= 1000) {
        const formatted = (number / 1000).toFixed(1).replace('.0', '');
        return translationsObj.format?.thousand 
            ? `${formatted}${translationsObj.format.thousand}`
            : (lang === 'ru' ? `${formatted}к` : `${formatted}K`);
    }
    
    return number.toLocaleString(lang);
}

// Функция для парсинга форматированных чисел
export function parseFormattedNumber(formattedString, lang = 'ru') {
    if (!formattedString) return 0;
    
    const translationsObj = translations[lang] || translations['ru'];
    const millionSuffix = translationsObj.format?.million || (lang === 'ru' ? 'млн' : 'M');
    const thousandSuffix = translationsObj.format?.thousand || (lang === 'ru' ? 'к' : 'K');
    
    let str = formattedString.toString().trim().toLowerCase();
    
    // Удаляем пробелы
    str = str.replace(/\s/g, '');
    
    // Обработка миллионов
    if (str.includes(millionSuffix.toLowerCase()) || str.includes('m') || str.includes('млн')) {
        const num = parseFloat(str.replace(new RegExp(`[^0-9.]`, 'g'), ''));
        return Math.round(num * 1000000);
    }
    
    // Обработка тысяч
    if (str.includes(thousandSuffix.toLowerCase()) || str.includes('k') || str.includes('к')) {
        const num = parseFloat(str.replace(new RegExp(`[^0-9.]`, 'g'), ''));
        return Math.round(num * 1000);
    }
    
    // Обычное число
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
}