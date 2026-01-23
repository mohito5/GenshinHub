// components/filter-manager.js - исправленная версия
export const filterManager = {
    characterFilters: {
        element: null,
        weapon: null,
        rarity: null
    },
    weaponFilters: {
        weaponType: null,
        rarity: null,
        stats: null
    },
    dateFilters: {
        fish: {
            region: null,
            rarity: null,
            difficulty: null
        },
        creatures: {
            type: null,
            element: null,
            region: null
        },
        artifacts: {
            rarity: null,
            setType: null,
            obtainMethod: null
        }
    },

    // Сброс фильтров при смене страницы
    resetFiltersOnPageChange: function(pageId) {
        console.log('Сброс фильтров при переходе на страницу:', pageId);
        
        // Сбрасываем фильтры персонажей, если не на странице персонажей
        if (pageId !== 'characters' && !pageId.startsWith('characters/')) {
            this.characterFilters = {
                element: null,
                weapon: null,
                rarity: null
            };
            console.log('Фильтры персонажей сброшены');
        }
        
        // Сбрасываем фильтры оружия, если не на странице оружия
        if (pageId !== 'weapon' && !pageId.startsWith('weapon/')) {
            this.weaponFilters = {
                weaponType: null,
                rarity: null,
                stats: null
            };
            console.log('Фильтры оружия сброшены');
        }
        
        // Сбрасываем фильтры даты, если не на странице даты
        if (pageId !== 'date' && !pageId.startsWith('date/')) {
            this.dateFilters = {
                fish: { region: null, rarity: null, difficulty: null },
                creatures: { type: null, element: null, region: null },
                artifacts: { rarity: null, setType: null, obtainMethod: null }
            };
            console.log('Фильтры даты сброшены');
        }
    },

    // Сброс фильтров персонажей
    resetCharacterFilters: function(currentLang) {
        this.characterFilters = {
            element: null,
            weapon: null,
            rarity: null
        };
        
        console.log('Сброс фильтров персонажей');
        
        if (typeof window.renderCharacterCards === 'function') {
            window.renderCharacterCards(currentLang);
        }
        if (typeof window.updateFilterButton === 'function') {
            window.updateFilterButton(currentLang);
        }
    },

    // Сброс фильтров оружия
    resetWeaponFilters: function(currentLang) {
        this.weaponFilters = {
            weaponType: null,
            rarity: null,
            stats: null
        };
        
        console.log('Сброс фильтров оружия');
        
        if (typeof window.renderWeaponCards === 'function') {
            window.renderWeaponCards(currentLang);
        }
        if (typeof window.updateWeaponFilterButton === 'function') {
            window.updateWeaponFilterButton(currentLang);
        }
    },

    // Применение фильтров
    applyFilters: function(type, filters) {
        if (type === 'character') {
            this.characterFilters = { ...filters };
            console.log('Применены фильтры персонажей:', filters);
            
            if (typeof window.renderCharacterCards === 'function') {
                window.renderCharacterCards(window.currentLang, filters);
            }
        } else if (type === 'weapon') {
            this.weaponFilters = { ...filters };
            console.log('Применены фильтры оружия:', filters);
            
            if (typeof window.renderWeaponCards === 'function') {
                window.renderWeaponCards(window.currentLang, filters);
            }
        } else if (type === 'date') {
            console.log('Применены фильтры для date:', filters);
        }
    }
};

// Инициализация менеджера фильтров
export function initFilterManager() {
    window.filterManager = filterManager;
    window.characterFilters = filterManager.characterFilters;
    window.weaponFilters = filterManager.weaponFilters;
    window.dateFilters = filterManager.dateFilters;
    console.log('Менеджер фильтров инициализирован');
}