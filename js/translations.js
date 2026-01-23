// translations.js - обновленная версия с правильными ключами
export const translations = {
    'ru': {
        pages: {
            home: {
                title: 'Добро пожаловать в Lumos',
                welcome: 'Исследуйте мир технологий и игр'
            },
            characters: {
                title: 'Персонажи',
                description: 'Список персонажей Genshin Impact'
            },
            weapon: {
                title: 'Оружие',
                description: 'Каталог оружия',
                electronics: 'Электроника',
                clothing: 'Одежда',
                subcategories: {
                    electronics: {
                        title: 'Электроника',
                        description: 'Здесь вы найдете электронные товары'
                    },
                    clothing: {
                        title: 'Одежда',
                        description: 'Здесь вы найдете одежду'
                    }
                }
            },
            date: {
                title: 'Данные',
                fishing: 'Рыбалка'
            },
            profile: {
                title: 'Профиль',
                description: 'Ваши сохраненные материалы и настройки',
                savedMaterials: 'Сохраненные материалы',
                savedDescription: 'Здесь хранятся ваши сохраненные настройки материалов для персонажей'
            }
        },
        navigation: {
            home: 'Главная',
            characters: 'Персонажи',
            weapon: 'Оружие',
            date: 'Данные',
            profile: 'Профиль',
            'lang.ru': 'РУС',
            'lang.en': 'АНГ'
        },
        common: {
            backToCatalog: '← Назад в каталог',
            back: 'Назад',
            continue: 'Продолжить',
            cancel: 'Отмена',
            apply: 'Применить',
            reset: 'Сбросить',
            close: 'Закрыть',
            save: 'Сохранить',
            update: 'Обновить',
            delete: 'Удалить',
            reload: 'Обновить страницу',
            open: 'Открыть',
            refresh: 'Обновить список',
            yes: 'Да',
            no: 'Нет',
            on: 'Вкл',
            off: 'Выкл'
        },
        serverTimer: {
            title: 'Время сброса серверов Genshin Impact',
            showServerTime: 'Показать серверное время',
            resetTime: 'Сброс: {time}',
            timeLeft: 'Осталось: {hours}ч {minutes}м',
            soon: 'Скоро сброс!',
            serverAsia: 'Азиатский сервер',
            serverEurope: 'Европейский сервер',
            serverAmerica: 'Американский сервер',
            showLocalTime: 'Показать локальное время',
            soon: 'Скоро сброс!',
            yourTimezone: 'Ваш часовой пояс'
        },
        birthdays: {
            announcementFormat: 'Сегодня день рождения у {name}! 🎉',
            imageAlt: 'Аватар {name}',
            noBirthdayToday: 'Сегодня нет дней рождения персонажей'
        },
        buttons: {
            info: 'Информация',
            guide: 'Гайд',
            saveMaterials: 'Сохранить материалы',
            updateMaterials: 'Обновить материалы',
            overwriteMaterials: 'Перезаписать материалы',
            calculate: 'Рассчитать',
            resetInputs: 'Сбросить вводы',
            backToCharacters: 'Назад к персонажам',
            load: 'Загрузить',
            createNew: 'Создать новое',
            loadSaved: 'Загрузить сохраненное',
            overwrite: 'Перезаписать',
            save: 'Сохранить',
            update: 'Обновить',
            overwrite: 'Перезаписать'
        },
        character: {
            name: 'Персонаж',
            select: 'Выберите персонажа',
            development: 'Развитие персонажа',
            level: 'Уровень',
            attack: 'Базовая атака',
            skill: 'Элементальный навык',
            explosion: 'Взрыв стихии',
            allMaterials: 'Все материалы',
            info: 'Информация о персонаже',
            guide: 'Гайд по персонаже',
            element: 'Стихия',
            weapon: 'Оружие',
            rarity: 'Редкость',
            stats: 'Характеристики',
            basicStats: 'Базовые характеристики',
            defense: 'Защита',
            talents: 'Таланты',
            normalAttack: 'Обычная атака',
            elementalSkill: 'Элементальный навык',
            elementalBurst: 'Взрыв стихии',
            constellations: 'Созвездия',
            noConstellations: 'Информация о созвездиях отсутствует',
            decreaseLevel: 'Уменьшить уровень',
            increaseLevel: 'Увеличить уровень',
            levelSlider: 'Регулировка уровня персонажа',
            talentLevel: 'Регулировка уровня таланта',
            selectSection: 'Выберите раздел'
        },
        filter: {
            title: 'Фильтр персонажей',
            element: 'Стихия',
            weapon: 'Оружие',
            rarity: 'Редкость',
            all: 'Все',
            clear: 'Очистить фильтры',
            apply: 'Применить фильтры'
        },
        materials: {
            title: 'Материалы развития',
            development: 'Материалы развития',
            characterName: 'Персонаж: {name}',
            levelMaterials: 'Материалы для возвышения',
            talentMaterials: 'Материалы для талантов',
            required: 'Требуется',
            have: 'Имеется',
            remaining: 'Осталось',
            totalRequired: 'Всего требуется',
            missing: 'Не хватает',
            enough: 'Достаточно',
            insufficient: 'Недостаточно',
            totalSummary: 'Итоговый расчет',
            none: 'Нет материалов'
        },
        categories: {
            ascension: 'Возвышение',
            talents: 'Таланты',
            common: 'Обычные материалы',
            boss: 'Материалы боссов',
            local: 'Местные особенности',
            weekly: 'Материалы еженедельных боссов',
            experience: 'Опыт',
            mora: 'Мора'
        },
        sections: {
            ascension: 'Возвышение',
            normalAttack: 'Обычная атака',
            elementalSkill: 'Элементальный навык',
            elementalBurst: 'Взрыв стихии',
            combined: 'Все материалы вместе'
        },
        levelControls: {
            level: 'Уровень',
            increase: 'Увеличить',
            decrease: 'Уменьшить',
            slider: 'Регулировка уровня'
        },
        modal: {
            close: 'Закрыть',
            cancel: 'Отмена',
            confirm: 'Подтвердить',
            ok: 'OK',
            closeHint: 'Кликните вне окна для отмены'
        },
        misc: {
            close: 'Закрыть'
        },
        notifications: {
            saveSuccess: 'Материалы успешно сохранены!',
            updateSuccess: 'Сохранение успешно обновлено!',
            overwriteSuccess: 'Сохранение успешно перезаписано!',
            noData: 'Нет данных для сохранения',
            noCharacterData: 'Нет данных персонажа',
            saving: 'Сохранение...',
            loading: 'Загрузка...',
            calculating: 'Расчет...'
        },
        messages: {
            savedSuccessfully: 'Сохранено успешно!',
            updatedSuccessfully: 'Обновлено успешно!',
            overwrittenSuccessfully: 'Перезаписано успешно!',
            noChanges: 'Нет изменений для сохранения',
            confirmOverwrite: 'Вы уверены, что хотите перезаписать сохранение?'
        },
        errors: {
            saveFailed: 'Ошибка при сохранении',
            loadFailed: 'Ошибка при загрузке',
            noResults: 'Нет персонажей, соответствующих фильтрам',
            cantSave: 'Не удалось сохранить',
            cantLoad: 'Не удалось загрузить',
            invalidInput: 'Некорректный ввод',
            notEnoughMaterials: 'Недостаточно материалов',
            pageNotFound: 'Страница не найдена'
        },
        loading: {
            materials: 'Загрузка материалов...',
            character: 'Загрузка персонажа...'
        },
        default: {
            noDescription: 'Описание отсутствует',
            noBirthday: 'Сегодня нет дней рождения',
            unknownCharacter: 'Неизвестный персонаж',
            noDate: 'Дата не указана'
        },
        setup: {
            title: 'Настройка материалов',
            level: 'Уровень персонажа',
            talents: 'Уровни талантов',
            attack: 'Базовая атака',
            skill: 'Элементальный навык',
            explosion: 'Взрыв стихии',
            description: 'Описание'
        },
        notification: {
            success: 'Успешно',
            error: 'Ошибка',
            warning: 'Внимание',
            info: 'Информация'
        },
        input: {
            placeholder: 'Имеется',
            required: 'Обязательное поле',
            invalid: 'Недопустимое значение'
        },
        materialTypes: {
            characterExp: 'Опыт персонажа',
            ascensionGem: 'Самоцвет возвышения',
            ascensionMaterial: 'Материал возвышения',
            commonMaterial: 'Обычный материал',
            talentBook: 'Книга талантов',
            bossMaterial: 'Материал босса',
            crown: 'Венец мудрости',
            mora: 'Мора',
            sliver: 'Серебряный кусок',
            fragment: 'Фрагмент',
            chunk: 'Кусок',
            gemstone: 'Самоцвет',
            heroWit: 'Мудрость героя'
        },
        elements: {
            Electro: 'Электро',
            Dendro: 'Дендро',
            Anemo: 'Анемо',
            Geo: 'Гео',
            Cryo: 'Крио',
            Pyro: 'Пиро',
            Hydro: 'Гидро'
        },
        weapons: {
            Polearm: 'Копьё',
            Catalyst: 'Катализатор',
            Bow: 'Лук',
            Sword: 'Меч',
            Claymore: 'Двуручный меч'
        },
        modals: {
            overwrite: {
                title: 'Перезаписать сохранение?',
                description: 'Для {characterName} уже есть сохранение:',
                date: 'Дата:',
                level: 'Уровень:',
                talents: 'Таланты:',
                materialsCount: 'Материалы:',
                warning: 'Старое сохранение будет <strong>безвозвратно удалено</strong> и заменено новым.'
            },
            loadSave: {
                title: 'Загрузить сохраненные данные?',
                description: 'Для {characterName} найдено сохранение от {saveDate}',
                level: 'Уровень',
                attack: 'Атака',
                skill: 'Навык',
                explosion: 'Взрыв',
                materialsCount: 'Сохранено материалов',
                created: 'Создано',
                lastModified: 'Изменено',
                materials: 'Материалы',
                talents: 'Таланты'
            },
            loadChoice: {
                title: 'Найдено сохранение',
                description: 'Для {characterName} уже есть сохранение от {saveDate}. Что вы хотите сделать?',
                existingData: 'Сохраненные данные:',
                level: 'Уровень: {level}',
                attack: 'Атака: {attackLevel}',
                skill: 'Навык: {skillLevel}',
                explosion: 'Взрыв: {explosionLevel}',
                materials: 'Материалов: {count}',
                loadButton: 'Загрузить сохранение',
                newButton: 'Создать новое',
                cancelButton: 'Отмена'
            },
            talents: {
                title: 'Настройка уровней',
                characterLevel: 'Уровень персонажа',
                talents: 'Уровни талантов',
                attack: 'Базовая атака',
                skill: 'Элементальный навык',
                explosion: 'Взрыв стихии',
                currentLevel: 'Текущий уровень: {level}',
                description: 'Описание персонажа',
                backButton: 'Назад к выбору',
                continueButton: 'Продолжить'
            },
            loadSaveOption: {
                title: 'Загрузить существующее сохранение?',
                message: 'Для {characterName} уже есть сохранение. Хотите загрузить его или создать новое?',
                existingData: 'Текущие сохраненные данные:',
                loadExisting: 'Загрузить существующее',
                createNew: 'Создать новое',
                cancel: 'Отмена'
            }
        },
        hints: {
            clickOutside: 'Нажмите вне окна для закрытия',
            pressEscape: 'Нажмите ESC для отмены'
        },
        states: {
            loading: 'Загрузка...',
            saving: 'Сохранение...',
            updating: 'Обновление...',
            noData: 'Нет данных'
        },
        validation: {
            required: 'Это поле обязательно',
            number: 'Введите число',
            positive: 'Число должно быть положительным'
        },
        context: {
            load: 'Загрузить',
            edit: 'Редактировать',
            delete: 'Удалить',
            copy: 'Копировать',
            share: 'Поделиться'
        },
        pagination: {
            previous: 'Предыдущая',
            next: 'Следующая',
            page: 'Страница {page}',
            of: 'из {total}'
        },
        talentsModal: {
        title: 'Настройка уровней',
        characterLevel: 'Уровень персонажа'
        },
        format: {
            thousand: 'к',
            million: 'млн'
        },
        material: {
            remaining: 'Осталось',
            none: 'Нет материалов'
        },
        input: {
            placeholder: 'Имеется'
        },
        notifications: {
            saveSuccess: 'Материалы успешно сохранены!',
            updateSuccess: 'Сохранение успешно обновлено!',
            overwriteSuccess: 'Сохранение успешно перезаписано!'
        },
        buttons: {
            save: 'Сохранить',
            update: 'Обновить',
            overwrite: 'Перезаписать'
        },
        calculator: {
                title: 'Калькулятор характеристик'
            }
    },

    'en': {
        pages: {
            home: {
                title: 'Welcome to Lumos',
                welcome: 'Explore the world of technology and games'
            },
            characters: {
                title: 'Characters',
                description: 'List of Genshin Impact characters'
            },
            weapon: {
                title: 'Weapon',
                description: 'Weapon catalog',
                electronics: 'Electronics',
                clothing: 'Clothing',
                subcategories: {
                    electronics: {
                        title: 'Electronics',
                        description: 'Here you can find electronic goods'
                    },
                    clothing: {
                        title: 'Clothing',
                        description: 'Here you can find clothing'
                    }
                }
            },
            date: {
                title: 'Date',
                fishing: 'Fishing'
            },
            profile: {
                title: 'Profile',
                description: 'Your saved materials and settings',
    savedMaterials: 'Saved Materials',
    savedDescription: 'Your saved material settings for characters are stored here'
            }
        },
        navigation: {
            home: 'Home',
            characters: 'Characters',
            weapon: 'Weapon',
            date: 'Date',
            profile: 'Profile',
            'lang.ru': 'RUS',
            'lang.en': 'ENG'
        },
        common: {
            backToCatalog: '← Back to catalog',
            back: 'Back',
            continue: 'Continue',
            cancel: 'Cancel',
            apply: 'Apply',
            reset: 'Reset',
            close: 'Close',
            save: 'Save',
            update: 'Update',
            delete: 'Delete',
            reload: 'Reload page',
            open: 'Open',
            refresh: 'Refresh list',
            yes: 'Yes',
            no: 'No',
            on: 'On',
            off: 'Off'
        },
        serverTimer: {
            title: 'Genshin Impact Server Reset Times',
            showServerTime: 'Show server time',
            resetTime: 'Reset: {time}',
            timeLeft: 'Time left: {hours}h {minutes}m',
            soon: 'Reset soon!',
            serverAsia: 'Asia Server',
            serverEurope: 'Europe Server',
            serverAmerica: 'America Server',
            showLocalTime: 'Show local time',
            yourTimezone: 'Your timezone'
        },
        birthdays: {
            announcementFormat: 'Today is {name}\'s birthday! 🎉',
            imageAlt: '{name}\'s avatar',
            noBirthdayToday: 'No character birthdays today'
        },
        buttons: {
            info: 'Information',
            guide: 'Guide',
            saveMaterials: 'Save Materials',
            updateMaterials: 'Update Materials',
            overwriteMaterials: 'Overwrite Materials',
            calculate: 'Calculate',
            resetInputs: 'Reset Inputs',
            backToCharacters: 'Back to characters',
            load: 'Load',
            createNew: 'Create new',
            loadSaved: 'Load saved',
            save: 'Save',
            update: 'Update',  // ← Убедитесь, что этот ключ есть
            overwrite: 'Overwrite'
        },
        character: {
            name: 'Character',
            select: 'Select character',
            development: 'Character development',
            level: 'Level',
            attack: 'Basic Attack',
            skill: 'Elemental Skill',
            explosion: 'Elemental Burst',
            allMaterials: 'All Materials',
            info: 'Character Info',
            guide: 'Character Guide',
            element: 'Element',
            weapon: 'Weapon',
            rarity: 'Rarity',
            stats: 'Stats',
            basicStats: 'Basic Stats',
            defense: 'Defense',
            talents: 'Talents',
            normalAttack: 'Normal Attack',
            elementalSkill: 'Elemental Skill',
            elementalBurst: 'Elemental Burst',
            constellations: 'Constellations',
            noConstellations: 'No constellation information available',
            decreaseLevel: 'Decrease level',
            increaseLevel: 'Increase level',
            levelSlider: 'Character level slider',
            talentLevel: 'Talent level slider',
            selectSection: 'Select section'
        },
        filter: {
            title: 'Character Filter',
            element: 'Element',
            weapon: 'Weapon',
            rarity: 'Rarity',
            all: 'All',
            clear: 'Clear filters',
            apply: 'Apply filters'
        },
        materials: {
            title: 'Development Materials',
            development: 'Development Materials',
            characterName: 'Character: {name}',
            levelMaterials: 'Ascension Materials',
            talentMaterials: 'Talent Materials',
            required: 'Required',
            have: 'Have',
            remaining: 'Remaining',
            totalRequired: 'Total Required',
            missing: 'Missing',
            enough: 'Enough',
            insufficient: 'Insufficient',
            totalSummary: 'Total Summary',
            none: 'No materials'
        },
        categories: {
            ascension: 'Ascension',
            talents: 'Talents',
            common: 'Common Materials',
            boss: 'Boss Materials',
            local: 'Local Specialties',
            weekly: 'Weekly Boss Materials',
            experience: 'Experience',
            mora: 'Mora'
        },
        sections: {
            ascension: 'Ascension',
            normalAttack: 'Normal Attack',
            elementalSkill: 'Elemental Skill',
            elementalBurst: 'Elemental Burst',
            combined: 'All Materials Combined'
        },
        levelControls: {
            level: 'Level',
            increase: 'Increase',
            decrease: 'Decrease',
            slider: 'Level Slider'
        },
        modal: {
            close: 'Close',
            cancel: 'Cancel',
            confirm: 'Confirm',
            ok: 'OK',
            closeHint: 'Click outside to cancel'
        },
        misc: {
            close: 'Close'
        },
        notifications: {
            saveSuccess: 'Materials saved successfully!',
            updateSuccess: 'Save updated successfully!',
            overwriteSuccess: 'Save overwritten successfully!',
            noData: 'No data to save',
            noCharacterData: 'No character data',
            saving: 'Saving...',
            loading: 'Loading...',
            calculating: 'Calculating...'
        },
        messages: {
            savedSuccessfully: 'Saved successfully!',
            updatedSuccessfully: 'Updated successfully!',
            overwrittenSuccessfully: 'Overwritten successfully!',
            noChanges: 'No changes to save',
            confirmOverwrite: 'Are you sure you want to overwrite the save?'
        },
        errors: {
            saveFailed: 'Error saving data',
            loadFailed: 'Error loading data',
            noResults: 'No characters match the filters',
            cantSave: 'Failed to save',
            cantLoad: 'Failed to load',
            invalidInput: 'Invalid input',
            notEnoughMaterials: 'Insufficient materials',
            pageNotFound: 'Page not found'
        },
        loading: {
            materials: 'Loading materials...',
            character: 'Loading character...'
        },
        default: {
            noDescription: 'No description available',
            noBirthday: 'No birthdays today',
            unknownCharacter: 'Unknown character',
            noDate: 'Date not specified'
        },
        setup: {
            title: 'Materials Setup',
            level: 'Character Level',
            talents: 'Talent Levels',
            attack: 'Basic Attack',
            skill: 'Elemental Skill',
            explosion: 'Elemental Burst',
            description: 'Description'
        },
        notification: {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Information'
        },
        input: {
            placeholder: 'Have',
            required: 'Required field',
            invalid: 'Invalid value'
        },
        materialTypes: {
            characterExp: 'Character EXP',
            ascensionGem: 'Ascension Gem',
            ascensionMaterial: 'Ascension Material',
            commonMaterial: 'Common Material',
            talentBook: 'Talent Book',
            bossMaterial: 'Boss Material',
            crown: 'Crown of Insight',
            mora: 'Mora',
            sliver: 'Silver Sliver',
            fragment: 'Fragment',
            chunk: 'Chunk',
            gemstone: 'Gemstone',
            heroWit: 'Hero\'s Wit'
        },
        elements: {
            Electro: 'Electro',
            Dendro: 'Dendro',
            Anemo: 'Anemo',
            Geo: 'Geo',
            Cryo: 'Cryo',
            Pyro: 'Pyro',
            Hydro: 'Hydro'
        },
        weapons: {
            Polearm: 'Polearm',
            Catalyst: 'Catalyst',
            Bow: 'Bow',
            Sword: 'Sword',
            Claymore: 'Claymore'
        },
        modals: {
            overwrite: {
                title: 'Overwrite save?',
                description: 'There is already a save for {characterName}:',
                date: 'Date:',
                level: 'Level:',
                talents: 'Talents:',
                materialsCount: 'Materials:',
                warning: 'The old save will be <strong>permanently deleted</strong> and replaced with the new one.'
            },
            loadSave: {
                title: 'Load saved data?',
                description: 'Save found for {characterName} from {saveDate}',
                level: 'Level',
                attack: 'Attack',
                skill: 'Skill',
                explosion: 'Explosion',
                materialsCount: 'Saved materials',
                created: 'Created',
                lastModified: 'Last modified',
                materials: 'Materials',
                talents: 'Talents'
            },
            loadChoice: {
                title: 'Save Found',
                description: 'There is already a save for {characterName} from {saveDate}. What would you like to do?',
                existingData: 'Saved data:',
                level: 'Level: {level}',
                attack: 'Attack: {attackLevel}',
                skill: 'Skill: {skillLevel}',
                explosion: 'Explosion: {explosionLevel}',
                materials: 'Materials: {count}',
                loadButton: 'Load Save',
                newButton: 'Create New',
                cancelButton: 'Cancel'
            },
            talents: {
                title: 'Level Configuration',
                characterLevel: 'Character Level',
                talents: 'Talent Levels',
                attack: 'Basic Attack',
                skill: 'Elemental Skill',
                explosion: 'Elemental Burst',
                currentLevel: 'Current level: {level}',
                description: 'Character Description',
                backButton: 'Back to Selection',
                continueButton: 'Continue'
            },
            loadSaveOption: {
                title: 'Load Existing Save?',
                message: 'There is already a save for {characterName}. Do you want to load it or create new?',
                existingData: 'Current saved data:',
                loadExisting: 'Load Existing',
                createNew: 'Create New',
                cancel: 'Cancel'
            }
        },
        hints: {
            clickOutside: 'Click outside to close',
            pressEscape: 'Press ESC to cancel'
        },
        states: {
            loading: 'Loading...',
            saving: 'Saving...',
            updating: 'Updating...',
            noData: 'No data'
        },
        validation: {
            required: 'This field is required',
            number: 'Enter a number',
            positive: 'Number must be positive'
        },
        context: {
            load: 'Load',
            edit: 'Edit',
            delete: 'Delete',
            copy: 'Copy',
            share: 'Share'
        },
        pagination: {
            previous: 'Previous',
            next: 'Next',
            page: 'Page {page}',
            of: 'of {total}'
        },
        format: {
            thousand: 'K',
            million: 'M'
        },
        material: {
            remaining: 'Remaining',
            none: 'No materials'
        },
        input: {
            placeholder: 'Have'
        },
        notifications: {
            saveSuccess: 'Materials saved successfully!',
            updateSuccess: 'Save updated successfully!',
            overwriteSuccess: 'Save overwritten successfully!'
        },
        buttons: {
            save: 'Save',
            update: 'Update',
            overwrite: 'Overwrite'
        }
    }
};