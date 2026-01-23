// utils/material-utils.js
import { materialsInfo } from '../materialsData.js';

// Функция для получения информации о материале
export function getMaterialInfo(materialKey, character = null, lang = 'ru') {
    let materialInfo = null;
    let materialName = materialKey;
    let materialIcon = 'assets/unknown.png';
    
    const parts = materialKey.split('.');
    if (parts.length === 1) {
        // Простой ключ
        if (materialsInfo[materialKey]) {
            materialInfo = materialsInfo[materialKey];
            if (typeof materialInfo === 'object' && materialInfo.name) {
                materialName = materialInfo.name[lang] || materialInfo.name.ru || materialKey;
                materialIcon = materialInfo.icon || 'assets/unknown.png';
            }
        }
    } else if (parts.length === 2) {
        // Вложенный ключ
        const [category, subKey] = parts;
        if (materialsInfo[category] && materialsInfo[category][subKey]) {
            materialInfo = materialsInfo[category][subKey];
            if (typeof materialInfo === 'object' && materialInfo.name) {
                materialName = materialInfo.name[lang] || materialInfo.name.ru || materialKey;
                materialIcon = materialInfo.icon || 'assets/unknown.png';
            }
        }
    }
    
    return {
        name: materialName,
        icon: materialIcon
    };
}

// Функция для получения перевода ключа материала
export function getMaterialTranslation(key, lang = 'ru') {
    const parts = key.split('.');
    if (parts.length === 2) {
        const [category, subKey] = parts;
        if (materialsInfo[category] && materialsInfo[category][subKey]) {
            const material = materialsInfo[category][subKey];
            return material.name?.[lang] || material.name?.ru || key;
        }
    }
    return key;
}