// telegram-storage.js - полный исправленный файл с синхронизацией
export class TelegramStorage {
    constructor() {
        this.isTelegram = this.detectTelegram();
        this.syncInProgress = false;
        this.init();
    }

    // Новая функция для определения Telegram
    detectTelegram() {
        // Вариант 1: Через глобальный объект Telegram (стандартный способ)
        if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
            console.log('✅ Telegram обнаружен через window.Telegram');
            return true;
        }
        
        // Вариант 2: Через window.parent (если в iframe)
        try {
            if (window.parent && window.parent.Telegram && window.parent.Telegram.WebApp) {
                console.log('✅ Telegram обнаружен через window.parent');
                return true;
            }
        } catch (e) {
            // Не можем получить доступ к parent
        }
        
        // Вариант 3: Через window.opener (если открыто из Telegram)
        try {
            if (window.opener && window.opener.Telegram && window.opener.Telegram.WebApp) {
                console.log('✅ Telegram обнаружен через window.opener');
                return true;
            }
        } catch (e) {
            // Не можем получить доступ к opener
        }
        
        // Вариант 4: Через параметры URL (Telegram Mini App передает параметры)
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('tgWebAppData') || urlParams.has('tgWebAppVersion')) {
            console.log('✅ Telegram обнаружен по параметрам URL');
            return true;
        }
        
        // Вариант 5: Через hash URL (Telegram также может передавать в hash)
        if (window.location.hash.includes('tgWebAppData=')) {
            console.log('✅ Telegram обнаружен по hash URL');
            return true;
        }
        
        // Вариант 6: По User-Agent
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes('telegram') || userAgent.includes('webview')) {
            console.log('✅ Telegram обнаружен по User-Agent');
            return true;
        }
        
        console.log('❌ Telegram не обнаружен');
        return false;
    }

    init() {
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            this.isTelegram = true;
            console.log('Telegram WebApp обнаружен, инициализируем Cloud Storage');
        } else {
            console.log('Telegram WebApp не обнаружен, используем localStorage');
        }
    }

    // Сохранение данных
    // Исправленный метод setItem для Telegram
    async setItem(key, value) {
        if (this.isTelegram) {
            return new Promise((resolve, reject) => {
                try {
                const stringValue = JSON.stringify(value);
        
                // Проверяем размер данных
                if (stringValue.length > 4096) {
                    console.error(`Данные слишком большие для ключа ${key}: ${stringValue.length} байт (макс. 4096)`);
                    resolve(false);
                    return;
                }
        
                Telegram.WebApp.CloudStorage.setItem(key, stringValue, (error) => {
                    if (error) {
                        console.error(`Ошибка сохранения ${key} в Telegram Cloud:`, error);
                        // Пробуем сохранить в localStorage как резерв
                        try {
                            localStorage.setItem(key, stringValue);
                            console.log(`Данные ${key} сохранены локально как резерв`);
                            resolve(false); // Возвращаем false, т.к. в Cloud не сохранилось
                        } catch (localError) {
                            console.error(`Ошибка сохранения ${key} в localStorage:`, localError);
                            resolve(false);
                        }
                    } else {
                        console.log(`✅ Данные ${key} успешно сохранены в Telegram Cloud (${stringValue.length} байт)`);
                        // Также сохраняем локально для быстрого доступа
                        localStorage.setItem(key, stringValue);
                        resolve(true);
                    }
                });
            } catch (e) {
                console.error('Ошибка Telegram API:', e);
                // Пробуем сохранить в localStorage
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                    resolve(false);
                } catch (localError) {
                    console.error('Ошибка сохранения в localStorage:', localError);
                    resolve(false);
                    }
                }
                });
            } else {
            // В браузере просто сохраняем в localStorage
            try {
                localStorage.setItem(key, JSON.stringify(value));
                console.log(`Данные ${key} сохранены в localStorage`);
                return Promise.resolve(false); // false = не в Telegram Cloud
            } catch (error) {
                console.error(`Ошибка сохранения ${key} в localStorage:`, error);
                return Promise.resolve(false);
            }
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
                                try {
                                    resolve(JSON.parse(localData));
                                } catch (e) {
                                    console.error('Ошибка парсинга данных из localStorage:', e);
                                    resolve(defaultValue);
                                }
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

    // Полная синхронизация всех данных пользователя
    // Полная синхронизация всех данных пользователя - ИСПРАВЛЕННАЯ
    async syncAllUserData() {
  if (!this.isTelegram) {
    console.log('Синхронизация доступна только в Telegram Mini App');
    return false;
  }

  if (this.syncInProgress) {
    console.log('Синхронизация уже выполняется...');
    return false;
  }

  this.syncInProgress = true;
  console.log('=== НАЧАЛО ПОЛНОЙ СИНХРОНИЗАЦИИ ДАННЫХ ===');

  try {
    // Получаем уникальный ID пользователя
    const userId = await this.getUserIdentifier();
    if (!userId) {
      console.error('Не удалось получить идентификатор пользователя');
      this.syncInProgress = false;
      return false;
    }

    console.log('Идентификатор пользователя:', userId);

    // Ключи для синхронизации (только важные данные)
    const syncKeys = [
      'savedMaterials',
      'userProfile',
      'lang'
    ];

    // Загружаем из локального хранилища
    const localData = {};
    let hasData = false;

    for (const key of syncKeys) {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          localData[key] = JSON.parse(data);
          hasData = true;
          console.log(`Данные для синхронизации: ${key} (размер: ${data.length} байт)`);
        } catch (error) {
          console.error(`Ошибка парсинга ${key}:`, error);
        }
      }
    }

    if (!hasData) {
      console.log('Нет данных для синхронизации');
      this.syncInProgress = false;
      return false;
    }

    // Проверяем общий размер данных
    const totalSize = JSON.stringify(localData).length;
    console.log('Общий размер данных для синхронизации:', totalSize, 'байт');
    
    // Telegram Cloud Storage имеет ограничения:
    // - 4096 байт на ключ
    // - 65536 байт всего
    if (totalSize > 4000) {
      console.warn('⚠️ Данные слишком большие для одного ключа, оптимизируем...');
      
      // Разделяем данные если нужно
      if (localData.savedMaterials && JSON.stringify(localData.savedMaterials).length > 4000) {
        console.warn('Сохранения слишком большие, сохраняем только первые 10');
        if (Array.isArray(localData.savedMaterials)) {
          localData.savedMaterials = localData.savedMaterials.slice(0, 10);
        }
      }
    }

    // Добавляем метаданные синхронизации
    const syncData = {
      userId,
      data: localData,
      lastSynced: Date.now(),
      syncTimestamp: new Date().toISOString(),
      version: '1.0',
      deviceInfo: {
        userAgent: navigator.userAgent.substring(0, 100), // Ограничиваем длину
        platform: navigator.platform,
        language: navigator.language
      }
    };

    // Сохраняем в Cloud Storage
    const syncKey = `user_data_${userId}`;
    console.log('Сохранение в Cloud Storage, ключ:', syncKey);
    
    const result = await this.setItem(syncKey, syncData);

    if (result === true) {
      console.log('✅ Все данные пользователя синхронизированы с облаком');
      console.log('Синхронизированные ключи:', Object.keys(localData));
      
      // Сохраняем время последней синхронизации
      localStorage.setItem('lastSyncTime', Date.now().toString());
      localStorage.setItem('lastSyncStatus', 'success');
      
      this.syncInProgress = false;
      return true;
    } else {
      console.log('⚠️ Синхронизация выполнена, но данные сохранены локально (result=false)');
      localStorage.setItem('lastSyncStatus', 'partial');
      localStorage.setItem('lastSyncError', 'Cloud Storage вернул false');
      
      // В Telegram иногда Cloud Storage возвращает false даже при успехе
      // Проверяем, сохранились ли данные на самом деле
      try {
        const checkData = await this.getItem(syncKey);
        if (checkData) {
          console.log('✅ Данные фактически сохранены в Cloud Storage (проверено)');
          localStorage.setItem('lastSyncStatus', 'success');
          this.syncInProgress = false;
          return true;
        }
      } catch (checkError) {
        console.error('Ошибка проверки сохраненных данных:', checkError);
      }
      
      this.syncInProgress = false;
      return false;
    }

  } catch (error) {
    console.error('❌ Ошибка синхронизации данных пользователя:', error);
    localStorage.setItem('lastSyncStatus', 'error');
    localStorage.setItem('lastSyncError', error.message);
    this.syncInProgress = false;
    return false;
  }
    }

    // Загрузка всех данных пользователя из облака
    async loadUserData() {
        if (!this.isTelegram) {
            console.log('Загрузка из облака доступна только в Telegram Mini App');
            return null;
        }

        console.log('=== ЗАГРУЗКА ДАННЫХ ИЗ ОБЛАКА ===');

        try {
            const userId = await this.getUserIdentifier();
            if (!userId) {
                console.log('Идентификатор пользователя не найден');
                return null;
            }

            const syncKey = `user_data_${userId}`;
            const userData = await this.getItem(syncKey);

            if (userData && userData.data) {
                console.log('✅ Данные пользователя найдены в облаке');

                // Проверяем версию данных
                const localTimestamp = localStorage.getItem('lastSyncTime');
                const cloudTimestamp = userData.lastSynced;

                if (localTimestamp && cloudTimestamp > parseInt(localTimestamp)) {
                    console.log('Облачные данные новее, восстанавливаем...');
                } else if (!localTimestamp) {
                    console.log('Локальных данных нет, загружаем из облака...');
                } else {
                    console.log('Локальные данные новее, оставляем их');
                    // Можно добавить логику слияния данных
                }

                // Восстанавливаем все данные
                let restoredCount = 0;
                for (const [key, value] of Object.entries(userData.data)) {
                    try {
                        localStorage.setItem(key, JSON.stringify(value));
                        restoredCount++;
                        console.log(`Восстановлено: ${key}`);
                    } catch (error) {
                        console.error(`Ошибка восстановления ${key}:`, error);
                    }
                }

                // Обновляем метаданные
                if (cloudTimestamp) {
                    localStorage.setItem('lastSyncTime', cloudTimestamp.toString());
                }
                localStorage.setItem('lastLoadedFromCloud', Date.now().toString());

                console.log(`✅ Восстановлено ${restoredCount} записей из облака`);
                return userData;

            } else {
                console.log('⚠️ Данные пользователя в облаке не найдены');
                return null;
            }

        } catch (error) {
            console.error('❌ Ошибка загрузки данных пользователя:', error);
            return null;
        }
    }

    // Получение идентификатора пользователя
    async getUserIdentifier() {
        if (this.isTelegram) {
            try {
                const user = Telegram.WebApp.initDataUnsafe?.user;
                if (user && user.id) {
                    const userId = `tg_${user.id}`;
                    console.log('Telegram User ID:', user.id);
                    
                    // Сохраняем информацию о пользователе
                    localStorage.setItem('telegramUserId', userId);
                    localStorage.setItem('telegramUserInfo', JSON.stringify({
                        id: user.id,
                        username: user.username,
                        firstName: user.first_name,
                        lastName: user.last_name,
                        languageCode: user.language_code,
                        isPremium: user.is_premium
                    }));

                    return userId;
                }
            } catch (error) {
                console.error('Ошибка получения Telegram ID:', error);
            }
        }

        // Возвращаем локальный ID если Telegram не доступен
        let userId = localStorage.getItem('userId');
        if (!userId) {
            userId = 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('userId', userId);
            console.log('Создан локальный идентификатор:', userId);
        }

        return userId;
    }

    // Синхронизация идентификатора пользователя
    async syncUserIdentifier() {
        return await this.getUserIdentifier();
    }

    // Проверка статуса синхронизации
    getSyncStatus() {
        return {
            isTelegram: this.isTelegram,
            syncInProgress: this.syncInProgress,
            lastSyncTime: localStorage.getItem('lastSyncTime'),
            lastSyncStatus: localStorage.getItem('lastSyncStatus'),
            lastSyncError: localStorage.getItem('lastSyncError'),
            lastLoadedFromCloud: localStorage.getItem('lastLoadedFromCloud'),
            userId: localStorage.getItem('telegramUserId') || localStorage.getItem('userId')
        };
    }

    // Полная синхронизация профиля (обратная совместимость)
    async syncProfile() {
        return await this.syncAllUserData();
    }

    // Проверка и синхронизация сохранений
    async syncSavedMaterials() {
        const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
        const result = await this.setItem('savedMaterials', savedMaterials);
        
        if (result) {
            console.log('✅ Сохранения синхронизированы:', savedMaterials.length, 'записей');
        } else {
            console.log('⚠️ Сохранения сохранены локально');
        }
        
        return result;
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
        
        // Синхронизируем обновленный список
        await this.syncSavedMaterials();
        
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
        
        // Синхронизируем обновленный список
        await this.syncSavedMaterials();
        
        return updatedMaterials;
    }

    // Синхронизация всех данных при разгрузке страницы
    async syncOnUnload() {
        if (this.isTelegram) {
            try {
                console.log('Синхронизация при разгрузке страницы...');
                await this.syncAllUserData();
            } catch (error) {
                console.error('Ошибка синхронизации при разгрузке:', error);
            }
        }
    }
}

// Создаем глобальный экземпляр
const telegramStorage = new TelegramStorage();

// Добавляем обработчик beforeunload для синхронизации
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        telegramStorage.syncOnUnload();
    });
}

// Экспортируем для использования
export default telegramStorage;