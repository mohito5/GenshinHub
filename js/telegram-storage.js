// telegram-storage.js - API для работы с Telegram Data Storage
export class TelegramStorage {
    constructor() {
        this.isTelegram = false;
        this.init();
    }

    init() {
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            this.isTelegram = true;
            console.log('Telegram WebApp обнаружен');
        }
    }

    // Сохранение данных
    async setItem(key, value) {
        if (this.isTelegram) {
            return new Promise((resolve, reject) => {
                try {
                    Telegram.WebApp.CloudStorage.setItem(key, JSON.stringify(value), (error) => {
                        if (error) {
                            console.error('Ошибка сохранения в Telegram Cloud:', error);
                            // Резервный вариант в localStorage
                            localStorage.setItem(key, JSON.stringify(value));
                            resolve(false);
                        } else {
                            console.log(`Данные сохранены в Telegram Cloud: ${key}`);
                            resolve(true);
                        }
                    });
                } catch (e) {
                    console.error('Ошибка Telegram API:', e);
                    localStorage.setItem(key, JSON.stringify(value));
                    resolve(false);
                }
            });
        } else {
            localStorage.setItem(key, JSON.stringify(value));
            return Promise.resolve(false);
        }
    }

    // Получение данных
    async getItem(key, defaultValue = null) {
        if (this.isTelegram) {
            return new Promise((resolve) => {
                try {
                    Telegram.WebApp.CloudStorage.getItem(key, (error, data) => {
                        if (error || !data) {
                            console.log(`Данные ${key} не найдены в Telegram Cloud`);
                            // Пробуем получить из localStorage
                            const localData = localStorage.getItem(key);
                            if (localData) {
                                resolve(JSON.parse(localData));
                            } else {
                                resolve(defaultValue);
                            }
                        } else {
                            try {
                                resolve(JSON.parse(data));
                            } catch (e) {
                                console.error('Ошибка парсинга данных из Telegram:', e);
                                resolve(defaultValue);
                            }
                        }
                    });
                } catch (e) {
                    console.error('Ошибка Telegram API:', e);
                    const localData = localStorage.getItem(key);
                    resolve(localData ? JSON.parse(localData) : defaultValue);
                }
            });
        } else {
            const data = localStorage.getItem(key);
            return Promise.resolve(data ? JSON.parse(data) : defaultValue);
        }
    }

    // Удаление данных
    async removeItem(key) {
        if (this.isTelegram) {
            return new Promise((resolve) => {
                try {
                    Telegram.WebApp.CloudStorage.removeItem(key, (error) => {
                        if (error) {
                            console.error('Ошибка удаления из Telegram Cloud:', error);
                        }
                        localStorage.removeItem(key);
                        resolve();
                    });
                } catch (e) {
                    console.error('Ошибка Telegram API:', e);
                    localStorage.removeItem(key);
                    resolve();
                }
            });
        } else {
            localStorage.removeItem(key);
            return Promise.resolve();
        }
    }

    // Получение всех ключей
    async getKeys() {
        if (this.isTelegram) {
            return new Promise((resolve) => {
                try {
                    Telegram.WebApp.CloudStorage.getKeys((error, keys) => {
                        if (error || !keys) {
                            console.log('Не удалось получить ключи из Telegram Cloud');
                            // Берем из localStorage
                            resolve(Object.keys(localStorage));
                        } else {
                            resolve(keys);
                        }
                    });
                } catch (e) {
                    console.error('Ошибка Telegram API:', e);
                    resolve(Object.keys(localStorage));
                }
            });
        } else {
            return Promise.resolve(Object.keys(localStorage));
        }
    }

    // Полная синхронизация всех данных профиля
    async syncProfile() {
        if (!this.isTelegram) return;

        console.log('Начало синхронизации профиля с Telegram Cloud...');

        try {
            // Ключи, которые нужно синхронизировать
            const syncKeys = [
                'userProfile',
                'savedMaterials',
                'calculatorSaves',
                'userSettings',
                'telegramUserId'
            ];

            for (const key of syncKeys) {
                const data = localStorage.getItem(key);
                if (data) {
                    await this.setItem(key, JSON.parse(data));
                    console.log(`Синхронизировано: ${key}`);
                }
            }

            // Синхронизация идентификатора пользователя
            await this.syncUserIdentifier();
            
            console.log('Синхронизация профиля завершена');
        } catch (error) {
            console.error('Ошибка синхронизации профиля:', error);
        }
    }

    // Синхронизация идентификатора пользователя
    async syncUserIdentifier() {
        if (!this.isTelegram) return;

        try {
            const user = Telegram.WebApp.initDataUnsafe?.user;
            if (user && user.id) {
                const userId = `tg_${user.id}`;
                localStorage.setItem('telegramUserId', userId);
                await this.setItem('telegramUserId', userId);
                console.log('Идентификатор пользователя синхронизирован:', userId);
                return userId;
            }
        } catch (error) {
            console.error('Ошибка синхронизации идентификатора:', error);
        }
        return null;
    }

    // Загрузка всех данных из Telegram Cloud
    async loadFromCloud() {
        if (!this.isTelegram) return;

        console.log('Загрузка данных из Telegram Cloud...');

        try {
            // Получаем все ключи из облака
            const cloudKeys = await this.getKeys();
            console.log('Ключи в облаке:', cloudKeys);

            // Загружаем каждый ключ
            for (const key of cloudKeys) {
                const data = await this.getItem(key);
                if (data) {
                    localStorage.setItem(key, JSON.stringify(data));
                    console.log(`Загружено: ${key}`);
                }
            }

            console.log('Загрузка данных завершена');
        } catch (error) {
            console.error('Ошибка загрузки из облака:', error);
        }
    }

    // Проверка и синхронизация сохранений
    async syncSavedMaterials() {
        const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
        await this.setItem('savedMaterials', savedMaterials);
        console.log('Сохранения синхронизированы:', savedMaterials.length, 'записей');
    }

    // Обновление конкретного сохранения
    async updateSave(saveData) {
        const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
        const index = savedMaterials.findIndex(save => 
            (save.id && save.id === saveData.id) || 
            (save.charKey && save.charKey === saveData.charKey)
        );

        if (index !== -1) {
            savedMaterials[index] = {
                ...savedMaterials[index],
                ...saveData,
                lastModified: Date.now()
            };
        } else {
            savedMaterials.push({
                ...saveData,
                id: Date.now().toString(),
                lastModified: Date.now()
            });
        }

        localStorage.setItem('savedMaterials', JSON.stringify(savedMaterials));
        await this.setItem('savedMaterials', savedMaterials);
        
        return savedMaterials;
    }

    // Удаление сохранения
    async deleteSave(saveId, type = 'character') {
        const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
        const updatedMaterials = savedMaterials.filter(save => {
            if (save.id && save.id.toString() === saveId.toString()) return false;
            if (type === 'character' && save.charKey && save.charKey === saveId) return false;
            if (type === 'weapon' && save.weaponKey && save.weaponKey === saveId) return false;
            return true;
        });

        localStorage.setItem('savedMaterials', JSON.stringify(updatedMaterials));
        await this.setItem('savedMaterials', updatedMaterials);
        
        return updatedMaterials;
    }
}

// Создаем глобальный экземпляр
const telegramStorage = new TelegramStorage();

// Экспортируем для использования
export default telegramStorage;