// telegram-webapp.js - новый файл для работы с Telegram API
export class TelegramWebAppHelper {
    constructor() {
        this.isTelegram = false;
        this.user = null;
        this.initParams = null;
        this.init();
    }

    init() {
        console.log('Инициализация Telegram WebApp Helper');
        
        // Способ 1: Через Telegram объект
        if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
            console.log('✅ Telegram WebApp найден (способ 1)');
            this.isTelegram = true;
            this.initTelegramWebApp();
            return;
        }
        
        // Способ 2: Через параметры в URL (для GitHub Pages)
        this.initFromURL();
        
        // Способ 3: Создать mock объект для отладки
        if (!this.isTelegram && this.isTestingMode()) {
            this.createMockTelegram();
        }
    }

    initTelegramWebApp() {
        try {
            const webApp = window.Telegram.WebApp;
            
            // Получаем данные пользователя
            if (webApp.initDataUnsafe) {
                this.initParams = webApp.initDataUnsafe;
                this.user = webApp.initDataUnsafe.user;
                console.log('Telegram пользователь:', this.user);
            }
            
            // Инициализируем WebApp
            webApp.ready();
            webApp.expand();
            
            // Настраиваем тему
            const theme = webApp.colorScheme;
            document.documentElement.setAttribute('data-theme', theme);
            console.log('Тема Telegram:', theme);
            
            console.log('✅ Telegram WebApp успешно инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации Telegram WebApp:', error);
            this.isTelegram = false;
        }
    }

    initFromURL() {
        console.log('Проверка параметров URL для Telegram...');
        
        // Проверяем параметры в query string
        const urlParams = new URLSearchParams(window.location.search);
        const tgWebAppData = urlParams.get('tgWebAppData');
        const tgWebAppVersion = urlParams.get('tgWebAppVersion');
        
        if (tgWebAppData || tgWebAppVersion) {
            console.log('✅ Telegram параметры найдены в URL');
            console.log('tgWebAppVersion:', tgWebAppVersion);
            
            // Парсим данные пользователя из tgWebAppData
            if (tgWebAppData) {
                try {
                    const decodedData = decodeURIComponent(tgWebAppData);
                    const searchParams = new URLSearchParams(decodedData);
                    
                    // Парсим данные пользователя
                    const userData = searchParams.get('user');
                    if (userData) {
                        this.user = JSON.parse(userData);
                        console.log('Пользователь из URL:', this.user);
                    }
                    
                    this.isTelegram = true;
                    
                    // Создаем mock Telegram объект
                    this.createMockTelegramFromURL(decodedData);
                    
                } catch (error) {
                    console.error('Ошибка парсинга Telegram данных:', error);
                }
            }
        }
        
        // Проверяем hash параметры
        const hash = window.location.hash;
        if (hash.includes('tgWebAppData=')) {
            console.log('✅ Telegram параметры найдены в hash');
            this.isTelegram = true;
        }
    }

    createMockTelegramFromURL(data) {
        // Создаем mock объект Telegram для GitHub Pages
        if (!window.Telegram) {
            window.Telegram = {};
        }
        
        if (!window.Telegram.WebApp) {
            window.Telegram.WebApp = {
                ready: function() {
                    console.log('Mock Telegram.WebApp ready()');
                },
                expand: function() {
                    console.log('Mock Telegram.WebApp expand()');
                },
                colorScheme: 'light',
                initDataUnsafe: {
                    user: this.user
                },
                CloudStorage: {
                    setItem: function(key, value, callback) {
                        console.log('Mock CloudStorage.setItem:', key);
                        localStorage.setItem('tg_' + key, value);
                        if (callback) callback(null);
                    },
                    getItem: function(key, callback) {
                        console.log('Mock CloudStorage.getItem:', key);
                        const data = localStorage.getItem('tg_' + key);
                        if (callback) callback(null, data);
                    },
                    removeItem: function(key, callback) {
                        console.log('Mock CloudStorage.removeItem:', key);
                        localStorage.removeItem('tg_' + key);
                        if (callback) callback(null);
                    }
                }
            };
            
            console.log('✅ Mock Telegram объект создан для GitHub Pages');
        }
    }

    isTestingMode() {
        // Проверяем, включен ли тестовый режим
        return localStorage.getItem('telegramTestMode') === 'true' ||
               window.location.href.includes('testTelegram=true');
    }

    createMockTelegram() {
        // Создаем полный mock для тестирования
        console.log('Создание mock Telegram для тестирования');
        
        window.Telegram = {
            WebApp: {
                ready: function() {
                    console.log('📱 Mock Telegram WebApp готов');
                },
                expand: function() {
                    console.log('📱 Mock Telegram WebApp расширен');
                },
                colorScheme: 'light',
                initDataUnsafe: {
                    user: {
                        id: 123456789,
                        first_name: 'Тестовый',
                        last_name: 'Пользователь',
                        username: 'testuser',
                        language_code: 'ru'
                    },
                    query_id: 'test_query_id'
                },
                platform: 'web',
                version: '7.0',
                CloudStorage: {
                    setItem: function(key, value, callback) {
                        console.log('📱 Mock CloudStorage.setItem:', key, value);
                        localStorage.setItem('tg_' + key, value);
                        if (callback) setTimeout(() => callback(null), 100);
                        return true;
                    },
                    getItem: function(key, callback) {
                        console.log('📱 Mock CloudStorage.getItem:', key);
                        const data = localStorage.getItem('tg_' + key);
                        if (callback) setTimeout(() => callback(null, data), 100);
                    },
                    removeItem: function(key, callback) {
                        console.log('📱 Mock CloudStorage.removeItem:', key);
                        localStorage.removeItem('tg_' + key);
                        if (callback) setTimeout(() => callback(null), 100);
                    },
                    getKeys: function(callback) {
                        console.log('📱 Mock CloudStorage.getKeys');
                        const keys = Object.keys(localStorage)
                            .filter(k => k.startsWith('tg_'))
                            .map(k => k.replace('tg_', ''));
                        if (callback) setTimeout(() => callback(null, keys), 100);
                    }
                },
                MainButton: {
                    show: function() { console.log('MainButton show'); },
                    hide: function() { console.log('MainButton hide'); }
                },
                BackButton: {
                    onClick: function(callback) { console.log('BackButton onClick установлен'); }
                }
            }
        };
        
        this.isTelegram = true;
        this.user = window.Telegram.WebApp.initDataUnsafe.user;
        
        console.log('✅ Mock Telegram создан для тестирования');
    }

    // Вспомогательные методы
    getUser() {
        return this.user;
    }

    getUserId() {
        return this.user ? this.user.id : null;
    }

    getUsername() {
        return this.user ? 
            (this.user.username ? `@${this.user.username}` : 
             `${this.user.first_name || ''} ${this.user.last_name || ''}`.trim()) : 
            'Пользователь';
    }

    isInTelegram() {
        return this.isTelegram;
    }

    // Метод для принудительного включения Telegram режима
    enableTelegramMode() {
        this.isTelegram = true;
        this.createMockTelegram();
        localStorage.setItem('forceTelegramMode', 'true');
        console.log('✅ Режим Telegram принудительно включен');
    }
}

// Создаем глобальный экземпляр
const telegramHelper = new TelegramWebAppHelper();
export default telegramHelper;