// profile-module.js - полностью исправленная версия
import { translations } from '../translations.js';
import { formatNumber } from '../utils/number-utils.js';
import { loadCalculatorSaveById } from './calculator-module.js';
import { charsData } from '../characterData.js';
import telegramStorage from '../telegram-storage.js';
import telegramHelper from './telegram-webapp.js';

// В начале файла добавьте этот код для экспорта charsData в window
if (typeof window !== 'undefined') {
  window.charsData = charsData;
  console.log('charsData добавлен в window:', Object.keys(charsData).length, 'персонажей');
}

// Инициализация модуля профиля
// Обновленная функция initProfileModule для немедленного отображения сохранений
// Обновленная функция initProfileModule
export function initProfileModule() {
  console.log('=== ИНИЦИАЛИЗАЦИЯ МОДУЛЯ ПРОФИЛЯ ===');



  // ДОБАВЬТЕ ЭТУ ПРОВЕРКУ ПЕРВЫМ ДЕЛОМ:
  console.log('Проверка окружения Telegram...');
  console.log('Telegram в window:', typeof window.Telegram !== 'undefined');
  console.log('Telegram.WebApp:', typeof window.Telegram !== 'undefined' ? window.Telegram.WebApp : 'нет');
  console.log('telegramStorage:', window.telegramStorage ? window.telegramStorage.isTelegram : 'нет');
  console.log('User Agent:', navigator.userAgent);
  console.log('URL:', window.location.href);
  
  // 1. Сначала рендерим сохранения из локального хранилища НЕМЕДЛЕННО
  console.log('Немедленный рендеринг локальных сохранений...');
  renderSavedMaterials();
  
  // 2. Устанавливаем идентификатор пользователя
  setupUserIdentifier();
  
  // 3. Инициализируем профиль пользователя
  initUserProfile();
  
  // 4. Загружаем данные из Telegram Cloud в фоне
  setTimeout(async () => {
    if (window.telegramStorage) {
      try {
        console.log('Фоновая загрузка данных из Telegram Cloud...');
        const cloudData = await window.telegramStorage.loadUserData();
        if (cloudData) {
          console.log('Данные из облака загружены, обновляем отображение...');
          // Обновляем сохранения с облачными данными
          renderSavedMaterials();
        }
      } catch (error) {
        console.error('Ошибка фоновой загрузки из облака:', error);
      }
    }
  }, 500);
  
  // 5. Добавляем обработчики событий
  setupProfileEventListeners();
  
  // 6. Настраиваем автосохранение
  setupAutoSave();
  
  // 7. Локализация
  setTimeout(() => {
    localizeProfilePage();
  }, 100);
  
  // 8. Предзагрузка аватаров в фоне
  setTimeout(() => {
    preloadAvatarsInBackground();
  }, 500);
  
  // 9. Добавляем кнопку синхронизации СРАЗУ
  

  // Добавьте вызов отладочной функции
  setTimeout(() => {
    addDebugButton();
  }, 1000);

  // Добавляем тестовую кнопку СРАЗУ
  addTestTelegramButton();
  
  // Добавляем кнопку синхронизации СРАЗУ
  addSyncButton();
  
  console.log('Модуль профиля инициализирован');
}
// Добавление тестовой кнопки Telegram
function addTestTelegramButton() {
  console.log('Добавление тестовой кнопки Telegram...');
  
  // Удаляем старую кнопку если есть
  const oldBtn = document.getElementById('test-telegram-btn');
  if (oldBtn) oldBtn.remove();
  
  // Создаем контейнер
  const testContainer = document.createElement('div');
  testContainer.className = 'test-telegram-container';
  testContainer.style.cssText = `
    margin: 20px 0;
    display: flex;
    justify-content: center;
  `;
  
  const testBtn = document.createElement('button');
  testBtn.id = 'test-telegram-btn';
  testBtn.className = 'test-telegram-button';
  testBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
    <span>Тест Telegram WebApp</span>
  `;
  
  testBtn.style.cssText = `
    background: #9C27B0;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: bold;
    font-size: 14px;
    transition: all 0.3s;
    box-shadow: 0 2px 8px rgba(156, 39, 176, 0.2);
  `;
  
  testBtn.onmouseover = () => {
    testBtn.style.background = '#7B1FA2';
  };
  
  testBtn.onmouseout = () => {
    testBtn.style.background = '#9C27B0';
  };
  
  testBtn.onclick = function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('=== ТЕСТ TELEGRAM WEBBAPP ===');
    
    // Проверяем различные методы
    const checks = {
      'window.Telegram': typeof window.Telegram !== 'undefined',
      'Telegram.WebApp': typeof window.Telegram !== 'undefined' && window.Telegram.WebApp,
      'CloudStorage': typeof window.Telegram !== 'undefined' && window.Telegram.WebApp && window.Telegram.WebApp.CloudStorage,
      'URL параметры': new URLSearchParams(window.location.search).get('tgWebAppVersion'),
      'LocalStorage флаг': localStorage.getItem('isTelegramMiniApp')
    };
    
    console.table(checks);
    
    // Показываем результат
    const isTelegram = checks['window.Telegram'] || checks['URL параметры'];
    
    let message = isTelegram ? 
      '✅ Telegram Mini App обнаружен!\n\n' : 
      '❌ Telegram Mini App не обнаружен.\n\n';
    
    Object.entries(checks).forEach(([key, value]) => {
      message += `${key}: ${value ? '✅ Да' : '❌ Нет'}\n`;
    });
    
    alert(message);
    
    // Если Telegram обнаружен, показываем дополнительные возможности
    if (isTelegram && window.Telegram && window.Telegram.WebApp) {
      const syncTestBtn = document.createElement('button');
      syncTestBtn.textContent = 'Тест Cloud Storage';
      syncTestBtn.style.cssText = `
        background: #2196F3;
        color: white;
        padding: 10px 15px;
        margin: 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      `;
      
      syncTestBtn.onclick = async function() {
        try {
          // Пробуем сохранить тестовые данные
          const testData = {
            test: 'Hello from Telegram Mini App!',
            timestamp: new Date().toISOString()
          };
          
          if (window.Telegram.WebApp.CloudStorage) {
            window.Telegram.WebApp.CloudStorage.setItem('test_data', JSON.stringify(testData), (error) => {
              if (error) {
                alert('❌ Ошибка сохранения: ' + error.message);
              } else {
                alert('✅ Данные сохранены в Cloud Storage!\n\nПроверьте с другого устройства.');
              }
            });
          } else {
            alert('❌ Cloud Storage недоступен');
          }
        } catch (error) {
          alert('❌ Ошибка: ' + error.message);
        }
      };
      
      // Добавляем кнопку в модальное окно или на страницу
      const existingSyncBtn = document.getElementById('sync-test-btn');
      if (!existingSyncBtn) {
        testBtn.parentNode.appendChild(syncTestBtn);
        syncTestBtn.id = 'sync-test-btn';
      }
    }
  };
  
  testContainer.appendChild(testBtn);
  
  // Вставляем в начало секции профиля
  const profileSection = document.querySelector('.profile-user-section');
  if (profileSection) {
    profileSection.parentNode.insertBefore(testContainer, profileSection);
  } else {
    // Или в контейнер сохранений
    const container = document.getElementById('saved-materials-container');
    if (container) {
      container.parentNode.insertBefore(testContainer, container);
    }
  }
  
  console.log('Тестовая кнопка Telegram добавлена');
}
// Новая функция для фоновой предзагрузки аватаров
function preloadAvatarsInBackground() {
  console.log('Фоновая предзагрузка аватаров...');
  
  // Создаем глобальный кэш изображений
  window.avatarImageCache = window.avatarImageCache || new Map();
  
  // Собираем все уникальные URL аватаров
  const avatarUrls = new Set();
  
  // Из charsData
  if (charsData && typeof charsData === 'object') {
    console.log('Найдено персонажей в импортированном charsData:', Object.keys(charsData).length);
    
    Object.values(charsData).forEach(character => {
      if (character && character.avatar_icon) {
        avatarUrls.add(character.avatar_icon);
      }
    });
  }
  
  // Общие аватары (элементы и дефолтный)
  const commonUrls = [
    'assets/avatar-icon/default-user.png',
    'assets/avatar-icon/anemo.png',
    'assets/avatar-icon/electro.png',
    'assets/avatar-icon/pyro.png',
    'assets/avatar-icon/hydro.png',
    'assets/avatar-icon/cryo.png',
    'assets/avatar-icon/geo.png',
    'assets/avatar-icon/dendro.png'
  ];
  
  commonUrls.forEach(url => {
    avatarUrls.add(url);
  });
  
  // Предзагружаем каждое изображение
  avatarUrls.forEach(url => {
    const img = new Image();
    
    img.onload = function() {
      // Сохраняем в кэше
      window.avatarImageCache.set(url, img);
    };
    
    img.onerror = function() {
      console.log('Не удалось предзагрузить аватар:', url);
    };
    
    img.src = url;
  });
}

// Локализация страницы профиля
function localizeProfilePage() {
  const lang = window.currentLang || 'ru';
  const translationsObj = translations[lang] || translations['ru'];
  
  // Обновляем тексты
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translatedText = getTranslation(key, lang);
    
    if (translatedText && translatedText !== key) {
      element.textContent = translatedText;
    }
  });
  
  // Обновляем плейсхолдеры
  const usernameInput = document.getElementById('username-input');
  if (usernameInput) {
    usernameInput.placeholder = translationsObj.profile?.usernamePlaceholder || 'Введите ваше имя';
  }
  
  // Обновляем кнопки
  const saveUsernameBtn = document.getElementById('save-username-btn');
  if (saveUsernameBtn) {
    saveUsernameBtn.textContent = translationsObj.buttons?.save || 'Сохранить';
  }
  
  const refreshBtn = document.getElementById('refresh-saves-btn');
  if (refreshBtn) {
    refreshBtn.textContent = translationsObj.profile?.refreshSaves || 'Обновить список сохранений';
  }
  
  // Обновляем описания
  const descriptionElements = document.querySelectorAll('.profile-description p, .saved-content-header p');
  descriptionElements.forEach(element => {
    if (element.textContent.includes('Это ваш персональный профиль')) {
      element.textContent = translationsObj.profile?.description || 
                           'Это ваш персональный профиль. Здесь вы можете сохранять настройки персонажей, оружия и сборки калькулятора.';
    }
    
    if (element.textContent.includes('Все ваши сохраненные настройки')) {
      element.textContent = translationsObj.profile?.savedDescription || 
                           'Все ваши сохраненные настройки персонажей, оружия и калькулятора';
    }
  });
}

// Инициализация профиля пользователя
function initUserProfile() {
  console.log('Инициализация профиля пользователя');
  
  // Проверяем, в Telegram Mini App или в браузере
  const isTelegram = checkTelegramEnvironment();
  
  if (isTelegram) {
    initTelegramProfile();
  } else {
    initBrowserProfile();
  }
}

// Проверка окружения Telegram
// Исправленная функция проверки Telegram в profile-module.js
function checkTelegramEnvironment() {
  // Вариант 1: Проверяем глобальный объект Telegram
  if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
    console.log('Telegram WebApp обнаружен через глобальный объект');
    return true;
  }
  
  // Вариант 2: Проверяем через telegramStorage
  if (window.telegramStorage && window.telegramStorage.isTelegram) {
    console.log('Telegram WebApp обнаружен через telegramStorage');
    return true;
  }
  
  // Вариант 3: Проверяем по user agent (для тестирования в браузере)
  const userAgent = navigator.userAgent.toLowerCase();
  const isTelegramWebView = userAgent.includes('telegram') || 
                           userAgent.includes('webview');
  
  console.log('Проверка Telegram:', {
    hasTelegram: typeof window.Telegram !== 'undefined',
    hasWebApp: typeof window.Telegram !== 'undefined' && window.Telegram.WebApp,
    telegramStorage: window.telegramStorage ? window.telegramStorage.isTelegram : 'нет',
    userAgent: navigator.userAgent
  });
  
  return isTelegramWebView;
}

// Инициализация профиля для Telegram
function initTelegramProfile() {
  try {
    const webApp = window.Telegram.WebApp;
    
    // Получаем данные пользователя из Telegram
    const user = webApp.initDataUnsafe.user;
    
    if (user) {
      // Устанавливаем имя пользователя из Telegram
      const username = user.username 
        ? `@${user.username}` 
        : `${user.first_name || ''} ${user.last_name || ''}`.trim();
      
      const usernameInput = document.getElementById('username-input');
      if (usernameInput) {
        usernameInput.value = username;
      }
      
      // Если есть фото, используем его
      if (user.photo_url) {
        const userAvatar = document.getElementById('user-avatar');
        if (userAvatar) {
          userAvatar.src = user.photo_url;
        }
      }
      
      // Сохраняем Telegram ID для привязки данных
      localStorage.setItem('telegramUserId', user.id.toString());
      
      console.log('Данные Telegram пользователя загружены:', {
        username, id: user.id
      });
    }
    
    // Загружаем дополнительные настройки из localStorage
    loadUserSettings();
    
  } catch (error) {
    console.error('Ошибка инициализации Telegram профиля:', error);
    initBrowserProfile(); // Резервный вариант
  }
}
// Добавьте эту функцию в profile-module.js для тестирования
function addDebugButton() {
  const debugBtn = document.createElement('button');
  debugBtn.textContent = 'Отладка Telegram';
  debugBtn.style.cssText = `
    background: #9C27B0;
    color: white;
    padding: 10px 15px;
    margin: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  `;
  
  debugBtn.onclick = function() {
    console.log('=== ОТЛАДКА TELEGRAM ===');
    console.log('1. Telegram объект:', typeof window.Telegram !== 'undefined' ? window.Telegram : 'не найден');
    console.log('2. Telegram.WebApp:', typeof window.Telegram !== 'undefined' ? window.Telegram.WebApp : 'не найден');
    console.log('3. telegramStorage:', window.telegramStorage);
    console.log('4. telegramStorage.isTelegram:', window.telegramStorage ? window.telegramStorage.isTelegram : 'нет');
    console.log('5. URL:', window.location.href);
    console.log('6. User Agent:', navigator.userAgent);
    
    if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
      console.log('7. Telegram.WebApp готов?');
      try {
        Telegram.WebApp.ready();
        console.log('✅ Telegram.WebApp готов!');
      } catch (e) {
        console.log('❌ Ошибка Telegram.WebApp.ready():', e);
      }
    }
    
    // Показываем сообщение
    alert(`Отладка Telegram:\nTelegram объект: ${typeof window.Telegram !== 'undefined' ? 'Да' : 'Нет'}\nURL: ${window.location.href}`);
  };
  
  document.querySelector('.profile-user-section')?.appendChild(debugBtn);
}
// Инициализация профиля для браузера
function initBrowserProfile() {
  console.log('Инициализация профиля для браузера');
  loadUserSettings();
}

// Загрузка настроек пользователя
function loadUserSettings() {
  const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  
  const usernameInput = document.getElementById('username-input');
  if (usernameInput && savedProfile.username) {
    usernameInput.value = savedProfile.username;
  }
  
  const userAvatar = document.getElementById('user-avatar');
  if (userAvatar && savedProfile.avatar) {
    userAvatar.src = savedProfile.avatar;
  }
  
  console.log('Настройки пользователя загружены:', savedProfile);
}

// Сохранение настроек пользователя
function saveUserSettings() {
  const usernameInput = document.getElementById('username-input');
  const userAvatar = document.getElementById('user-avatar');
  
  if (!usernameInput || !userAvatar) {
    console.error('Элементы профиля не найдены');
    return;
  }
  
  const username = usernameInput.value.trim();
  const avatar = userAvatar.src;
  
  const userProfile = {
    username: username || 'Пользователь',
    avatar: avatar,
    lastUpdated: Date.now()
  };
  
  localStorage.setItem('userProfile', JSON.stringify(userProfile));
  
  // Сохраняем в Telegram Cloud
  if (window.telegramStorage) {
    window.telegramStorage.setItem('userProfile', userProfile);
  }
  
  // Синхронизируем все данные
  if (window.telegramStorage) {
    setTimeout(async () => {
      try {
        await window.telegramStorage.syncAllUserData();
      } catch (error) {
        console.error('Ошибка синхронизации:', error);
      }
    }, 100);
  }
  
  // Показываем уведомление о сохранении
  showSaveNotification('Настройки профиля сохранены', 'success');
  
  console.log('Настройки пользователя сохранены:', userProfile);
}

// ПОЛНЫЙ КОД ФУНКЦИИ setupProfileEventListeners:
// Инициализация обработчиков событий профиля - ПОЛНАЯ ИСПРАВЛЕННАЯ ВЕРСИЯ
// Инициализация обработчиков событий профиля - ОБНОВЛЕННАЯ
function setupProfileEventListeners() {
  console.log('Настройка обработчиков событий профиля');
  
  // Кнопка сохранения имени
  const saveUsernameBtn = document.getElementById('save-username-btn');
  if (saveUsernameBtn) {
    saveUsernameBtn.addEventListener('click', saveUserSettings);
  }
  
  // Кнопка смены аватара
  const changeAvatarBtn = document.getElementById('change-avatar-btn');
  if (changeAvatarBtn) {
    changeAvatarBtn.addEventListener('click', openAvatarSelector);
  }
  
  // Закрытие селектора аватаров
  const closeAvatarBtn = document.getElementById('close-avatar-selector');
  if (closeAvatarBtn) {
    closeAvatarBtn.addEventListener('click', closeAvatarSelector);
  }
  
  // Сохранение по Enter в поле имени
  const usernameInput = document.getElementById('username-input');
  if (usernameInput) {
    usernameInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        saveUserSettings();
      }
    });
  }
  
  // Кнопка обновления списка сохранений
  const refreshBtn = document.getElementById('refresh-saves-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function() {
      console.log('Обновление списка сохранений');
      renderSavedMaterials();
    });
  }
  
  // Автоматическое сохранение при изменении аватара
  const userAvatar = document.getElementById('user-avatar');
  if (userAvatar) {
    userAvatar.addEventListener('load', function() {
      // Автосохранение с задержкой
      setTimeout(() => {
        saveUserSettings();
      }, 1000);
    });
  }

  // Кнопка синхронизации уже добавлена в initProfileModule
  const syncBtn = document.getElementById('sync-profile-btn');
  if (syncBtn) {
    // Убедимся, что обработчик добавляется только один раз
    syncBtn.removeEventListener('click', syncProfile);
    syncBtn.addEventListener('click', syncProfile);
  }
  
  // Добавляем обработчик для синхронизации при загрузке страницы
  setTimeout(() => {
    setupAutoSync();
  }, 1000);
}

// Функция для обновления состояния кнопки синхронизации
function updateSyncButtonState() {
  const syncBtn = document.getElementById('sync-profile-btn');
  if (!syncBtn) return;
  
  const isTelegram = typeof Telegram !== 'undefined' && Telegram.WebApp;
  
  if (isTelegram) {
    // В Telegram Mini App
    syncBtn.disabled = false;
    syncBtn.style.background = '#2196F3';
    syncBtn.style.cursor = 'pointer';
    syncBtn.style.opacity = '1';
    
    // Обновляем текст
    syncBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 6V3L8 7l4 4V8c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 14c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 004 14c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
      </svg>
      Синхронизировать с Telegram Cloud
    `;
    
    // Добавляем обработчики
    syncBtn.onmouseover = () => {
      if (!syncBtn.disabled) {
        syncBtn.style.background = '#1976D2';
      }
    };
    
    syncBtn.onmouseout = () => {
      if (!syncBtn.disabled) {
        syncBtn.style.background = '#2196F3';
      }
    };
    
    syncBtn.onclick = syncProfile;
  } else {
    // Не в Telegram
    syncBtn.disabled = true;
    syncBtn.style.background = '#9e9e9e';
    syncBtn.style.cursor = 'not-allowed';
    syncBtn.style.opacity = '0.7';
    
    syncBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
      Синхронизация доступна только в Telegram
    `;
  }
}

// Добавляем функцию настройки автосинхронизации
function setupAutoSync() {
  console.log('Настройка автосинхронизации');
  
  // Синхронизируем при видимости страницы
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden && window.telegramStorage && window.telegramStorage.isTelegram) {
      console.log('Страница стала видимой, синхронизируем...');
      setTimeout(() => {
        window.telegramStorage.syncAllUserData().then(success => {
          if (success) {
            console.log('Автосинхронизация завершена');
          }
        });
      }, 2000);
    }
  });
  
  // Синхронизируем при фокусе на окне
  window.addEventListener('focus', function() {
    if (window.telegramStorage && window.telegramStorage.isTelegram) {
      console.log('Окно в фокусе, проверяем синхронизацию...');
      setTimeout(() => {
        window.telegramStorage.loadUserData().then(data => {
          if (data) {
            console.log('Данные загружены при фокусе');
            renderSavedMaterials();
          }
        });
      }, 1000);
    }
  });
}


// Функция добавления кнопки синхронизации
// Функция добавления кнопки синхронизации - ИСПРАВЛЕННАЯ
// Функция добавления кнопки синхронизации - ИСПРАВЛЕННАЯ
// Исправленная функция добавления кнопки синхронизации
function addSyncButton() {
  console.log('Добавление кнопки синхронизации...');
  
  // Используем telegramHelper
  const isTelegram = telegramHelper.isInTelegram();
  
  console.log('Telegram статус через helper:', isTelegram);
  console.log('Telegram URL:', window.location.href);
  
  // Удаляем старую кнопку если есть
  const oldBtn = document.getElementById('sync-profile-btn');
  if (oldBtn) oldBtn.remove();
  
  
  // 1. Проверяем прямой доступ к Telegram WebApp
  if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
    isTelegram = true;
    console.log('✅ Telegram WebApp доступен напрямую');
  } 
  // 2. Проверяем через telegramStorage
  else if (window.telegramStorage && window.telegramStorage.isTelegram) {
    isTelegram = true;
    console.log('✅ Telegram WebApp доступен через telegramStorage');
  }
  // 3. Проверяем по URL (для отладки)
  else if (window.location.href.includes('t.me') || window.location.href.includes('telegram')) {
    isTelegram = true;
    console.log('✅ Telegram WebApp обнаружен по URL');
  }
  // 4. Проверяем по user agent
  else {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('telegram') || userAgent.includes('webview')) {
      isTelegram = true;
      console.log('✅ Telegram WebApp обнаружен по User-Agent');
    }
  }
  
  console.log('Окончательный статус Telegram:', isTelegram);
  
  // Ищем контейнер для кнопки
  const profileSection = document.querySelector('.profile-user-section');
  if (!profileSection) {
    console.error('Секция профиля не найдена');
    return;
  }
  
  // Создаем контейнер для кнопки
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'sync-button-container';
  buttonContainer.style.cssText = `
    margin: 20px 0;
    display: flex;
    justify-content: center;
  `;
  
  const syncBtn = document.createElement('button');
  syncBtn.id = 'sync-profile-btn';
  syncBtn.className = 'sync-profile-button';
  syncBtn.title = isTelegram ? 'Синхронизировать с Telegram Cloud' : 'Синхронизация доступна только в Telegram';
  
  if (isTelegram) {
    // В Telegram Mini App - кнопка активна
    syncBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 6V3L8 7l4 4V8c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 14c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 004 14c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
      </svg>
      <span>Синхронизировать с Telegram Cloud</span>
    `;
    syncBtn.disabled = false;
    syncBtn.style.cssText = `
      background: #2196F3;
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: bold;
      font-size: 14px;
      transition: all 0.3s;
      box-shadow: 0 2px 8px rgba(33, 150, 243, 0.2);
    `;
    
    // Добавляем обработчики hover
    syncBtn.onmouseover = () => {
      if (!syncBtn.disabled) {
        syncBtn.style.background = '#1976D2';
      }
    };
    
    syncBtn.onmouseout = () => {
      if (!syncBtn.disabled) {
        syncBtn.style.background = '#2196F3';
      }
    };
    
    // Добавляем обработчик клика
    syncBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      syncProfile();
    };
    
  } else {
    // Не в Telegram - кнопка неактивна
    syncBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
      <span>Синхронизация доступна только в Telegram</span>
    `;
    syncBtn.disabled = true;
    syncBtn.style.cssText = `
      background: #9e9e9e;
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      cursor: not-allowed;
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: bold;
      font-size: 14px;
      opacity: 0.7;
    `;
  }
  
  buttonContainer.appendChild(syncBtn);
  
  // Вставляем кнопку после секции профиля
  profileSection.parentNode.insertBefore(buttonContainer, profileSection.nextSibling);
  
  console.log('Кнопка синхронизации добавлена, статус:', isTelegram ? 'АКТИВНА' : 'НЕАКТИВНА');
  
  return isTelegram;
}

// Функция синхронизации профиля
// Функция синхронизации профиля - ИСПРАВЛЕННАЯ
// Функция синхронизации профиля - ОКОНЧАТЕЛЬНАЯ ИСПРАВЛЕННАЯ ВЕРСИЯ
// Функция синхронизации профиля - ОКОНЧАТЕЛЬНАЯ ИСПРАВЛЕННАЯ ВЕРСИЯ
async function syncProfile() {
  console.log('=== СИНХРОНИЗАЦИЯ ПРОФИЛЯ ===');
  
  // Проверяем через telegramHelper
  if (!telegramHelper.isInTelegram()) {
    showSaveNotification('Синхронизация доступна только в Telegram Mini App', 'warning');
    console.log('❌ Telegram не обнаружен через helper');
    return;
  }
  
  const syncBtn = document.getElementById('sync-profile-btn');
  if (!syncBtn) {
    console.error('Кнопка синхронизации не найдена');
    showSaveNotification('Ошибка: кнопка синхронизации не найдена', 'error');
    return;
  }
  
  const originalHTML = syncBtn.innerHTML;
  const originalBackground = syncBtn.style.background;
  
  if (syncBtn.disabled) {
    console.log('Кнопка уже синхронизируется, игнорируем повторный клик');
    return;
  }
  
  // Блокируем кнопку на время синхронизации
  syncBtn.disabled = true;
  syncBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 4V2L8 6l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zM4 12c0-1.01.25-1.97.7-2.8L3.24 7.74A7.93 7.93 0 002 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3c-3.31 0-6-2.69-6-6z"/>
    </svg>
    Синхронизация...
  `;
  syncBtn.style.background = '#FF9800';
  syncBtn.style.opacity = '0.7';
  syncBtn.style.cursor = 'wait';
  
  try {
    if (window.telegramStorage && window.telegramStorage.isTelegram) {
      console.log('Проверка статуса Telegram WebApp...');
      
      // Показываем уведомление о начале синхронизации
      showSaveNotification('Начинаю синхронизацию с Telegram Cloud...', 'info');
      
      // 1. Сначала пробуем загрузить данные из облака
      console.log('📥 Загрузка данных из Telegram Cloud...');
      const cloudData = await window.telegramStorage.loadUserData();
      
      if (cloudData) {
        console.log('✅ Данные из облака загружены:', {
          userId: cloudData.userId,
          lastSynced: new Date(cloudData.lastSynced).toLocaleString(),
          keys: Object.keys(cloudData.data || {})
        });
        
        // Обновляем отображение профиля
        renderSavedMaterials();
        
        showSaveNotification('Данные из облака загружены!', 'success');
      } else {
        console.log('⚠️ Данных в облаке нет или они устарели');
        showSaveNotification('Данных в облаке не найдено', 'info');
      }
      
      // 2. Затем синхронизируем текущие данные в облако
      console.log('📤 Синхронизация текущих данных с Telegram Cloud...');
      const syncResult = await window.telegramStorage.syncAllUserData();
      
      console.log('Результат синхронизации syncAllUserData():', syncResult);
      
      // ИСПРАВЛЕННЫЙ БЛОК ПРОВЕРКИ РЕЗУЛЬТАТА
      if (syncResult === true) {
        // Данные УСПЕШНО сохранены в Telegram Cloud Storage
        console.log('✅ Данные фактически сохранены в Cloud Storage');
        
        // Обновляем статус
        localStorage.setItem('lastSyncTime', Date.now().toString());
        localStorage.setItem('lastSyncStatus', 'success');
        
        // Показываем успешное уведомление
        const syncTime = new Date().toLocaleString();
        showSaveNotification(`✅ Данные синхронизированы! (${syncTime})`, 'success');
        
        // Обновляем кнопку
        syncBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          Синхронизировано
        `;
        syncBtn.style.background = '#4CAF50';
        
        // Обновляем список сохранений
        setTimeout(() => {
          renderSavedMaterials();
        }, 500);
      } else if (syncResult === false) {
        // Данные НЕ сохранились в Cloud Storage, только локально
        console.log('⚠️ Данные сохранены только локально');
        localStorage.setItem('lastSyncStatus', 'partial');
        
        syncBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          Только локально
        `;
        syncBtn.style.background = '#FF9800';
        
        showSaveNotification('⚠️ Данные сохранены локально (не удалось синхронизировать с облаком)', 'warning');
      } else {
        // Неожиданный результат
        console.error('Ошибка синхронизации: syncResult =', syncResult);
        
        syncBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          Ошибка синхронизации
        `;
        syncBtn.style.background = '#f44336';
        
        showSaveNotification('❌ Не удалось сохранить в облако', 'error');
      }
    } else {
      // Не в Telegram
      showSaveNotification('Синхронизация доступна только в Telegram Mini App', 'warning');
      console.log('⚠️ Синхронизация недоступна (не в Telegram Mini App)');
      
      syncBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        Только в Telegram
      `;
      syncBtn.style.background = '#9e9e9e';
    }
  } catch (error) {
    console.error('❌ Критическая ошибка синхронизации:', error);
    showSaveNotification(`Ошибка синхронизации: ${error.message}`, 'error');
    
    syncBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
      Ошибка
    `;
    syncBtn.style.background = '#f44336';
  } finally {
    // Разблокируем кнопку через 2 секунды и восстанавливаем исходное состояние
    setTimeout(() => {
      syncBtn.disabled = false;
      syncBtn.innerHTML = originalHTML;
      syncBtn.style.opacity = '1';
      syncBtn.style.cursor = 'pointer';
      syncBtn.style.background = originalBackground || '#2196F3';
    }, 2000);
  }
}

// Открытие селектора аватаров
function openAvatarSelector() {
  const selector = document.getElementById('avatar-selector');
  if (!selector) return;
  
  // Позиционируем селектор рядом с кнопкой
  const changeBtn = document.getElementById('change-avatar-btn');
  if (changeBtn) {
    const rect = changeBtn.getBoundingClientRect();
    selector.style.position = 'absolute';
    selector.style.top = `${rect.bottom + window.scrollY + 5}px`;
    selector.style.left = `${rect.left + window.scrollX}px`;
  }
  
  // Загружаем аватары если еще не загружены
  if (selector.dataset.loaded !== 'true') {
    loadAvatarOptions();
  }
  
  selector.style.display = 'block';
}

// Закрытие селектора аватаров
function closeAvatarSelector() {
  const selector = document.getElementById('avatar-selector');
  if (selector) {
    selector.style.display = 'none';
  }
}

// Загрузка опций аватаров
function loadAvatarOptions() {
  const avatarGrid = document.querySelector('.avatar-grid');
  if (!avatarGrid) {
    console.error('Сетка аватаров не найдена');
    return;
  }
  
  // Проверяем, загружались ли уже аватары
  if (avatarGrid.dataset.loaded === 'true') {
    console.log('Аватары уже загружены, пропускаем повторную загрузку');
    return;
  }
  
  console.log('Загрузка опций аватаров...');
  
  // Инициализируем кэш изображений
  const imageCache = window.avatarImageCache || new Map();
  
  // Список доступных аватаров
  const avatars = [];
  
  // Используем импортированный charsData
  if (charsData && typeof charsData === 'object') {
    Object.values(charsData).forEach(character => {
      if (character && character.avatar_icon) {
        avatars.push({
          src: character.avatar_icon,
          name: character.ru_name || character.en_name || 'Персонаж',
          type: 'character'
        });
      }
    });
  }
  
  // Общие аватары (элементы и дефолтный)
  const commonAvatars = [
    { src: 'assets/avatar-icon/default-user.png', name: 'По умолчанию', type: 'common' },
    { src: 'assets/avatar-icon/anemo.png', name: 'Анемо', type: 'element' },
    { src: 'assets/avatar-icon/electro.png', name: 'Электро', type: 'element' },
    { src: 'assets/avatar-icon/pyro.png', name: 'Пиро', type: 'element' },
    { src: 'assets/avatar-icon/hydro.png', name: 'Гидро', type: 'element' },
    { src: 'assets/avatar-icon/cryo.png', name: 'Крио', type: 'element' },
    { src: 'assets/avatar-icon/geo.png', name: 'Гео', type: 'element' },
    { src: 'assets/avatar-icon/dendro.png', name: 'Дендро', type: 'element' }
  ];
  
  // Добавляем общие аватары
  commonAvatars.forEach(avatar => {
    if (!avatars.some(a => a.src === avatar.src)) {
      avatars.push(avatar);
    }
  });
  
  // Очищаем и заполняем сетку
  avatarGrid.innerHTML = '';
  
  // Если нет аватаров вообще
  if (avatars.length === 0) {
    avatarGrid.innerHTML = `
      <div style="text-align: center; padding: 20px; color: #666; grid-column: 1 / -1;">
        <div style="font-size: 32px; margin-bottom: 10px;">📷</div>
        <p>Нет доступных аватаров</p>
      </div>
    `;
    avatarGrid.dataset.loaded = 'true';
    return;
  }
  
  // Создаем элементы для каждого аватара
  avatars.forEach((avatar, index) => {
    setTimeout(() => {
      createAvatarElement(avatar, avatarGrid, imageCache);
    }, index * 10);
  });
  
  // Помечаем как загруженное
  avatarGrid.dataset.loaded = 'true';
  
  console.log('Загрузка аватаров завершена');
}

// Вынесенная функция создания элемента аватара
function createAvatarElement(avatar, avatarGrid, imageCache) {
  const avatarItem = document.createElement('div');
  avatarItem.className = 'avatar-item';
  avatarItem.dataset.avatarSrc = avatar.src;
  avatarItem.dataset.avatarName = avatar.name;
  avatarItem.dataset.avatarType = avatar.type;
  
  avatarItem.style.cssText = `
    width: 60px;
    height: 60px;
    cursor: pointer;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative;
    background: #f5f5f5;
  `;
  
  // Создаем контейнер для изображения
  const imageContainer = document.createElement('div');
  imageContainer.style.cssText = `
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  `;
  
  // Создаем изображение
  const img = document.createElement('img');
  img.style.cssText = `
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.3s;
  `;
  
  // Устанавливаем атрибуты
  img.src = avatar.src;
  img.alt = avatar.name;
  
  // Проверяем, загружено ли изображение в кэше
  const preloadedImage = imageCache.get(avatar.src);
  
  if (preloadedImage && preloadedImage.complete) {
    // Изображение уже загружено - сразу показываем
    img.style.opacity = '1';
  }
  
  // Обработчик загрузки
  img.onload = function() {
    this.style.opacity = '1';
  };
  
  // Обработчик ошибок
  img.onerror = function() {
    this.src = 'assets/avatar-icon/default-user.png';
  };
  
  // Создаем overlay с названием
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 10px;
    padding: 2px;
    text-align: center;
    opacity: 0;
    transition: opacity 0.2s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `;
  overlay.textContent = avatar.name.length > 8 ? avatar.name.substring(0, 8) + '...' : avatar.name;
  
  imageContainer.appendChild(img);
  imageContainer.appendChild(overlay);
  avatarItem.appendChild(imageContainer);
  
  // Обработчики событий
  avatarItem.addEventListener('click', () => {
    console.log('Выбран аватар:', avatar.name, avatar.src);
    const userAvatar = document.getElementById('user-avatar');
    if (userAvatar) {
      userAvatar.src = avatar.src;
    }
    closeAvatarSelector();
  });
  
  avatarItem.addEventListener('mouseover', () => {
    avatarItem.style.transform = 'scale(1.1)';
    avatarItem.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    overlay.style.opacity = '1';
  });
  
  avatarItem.addEventListener('mouseout', () => {
    avatarItem.style.transform = 'scale(1)';
    avatarItem.style.boxShadow = 'none';
    overlay.style.opacity = '0';
  });
  
  avatarGrid.appendChild(avatarItem);
}

// Синхронизация данных с Telegram Cloud Storage
function syncWithTelegramStorage() {
  if (!checkTelegramEnvironment()) return;
  
  try {
    const webApp = window.Telegram.WebApp;
    const cloudStorage = webApp.CloudStorage;
    
    if (cloudStorage) {
      // Сохраняем профиль в облачное хранилище Telegram
      const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
      
      // Сохраняем данные
      cloudStorage.setItem('userProfile', JSON.stringify(userProfile));
      cloudStorage.setItem('savedMaterials', JSON.stringify(savedMaterials));
      
      console.log('Данные синхронизированы с Telegram Cloud Storage');
    }
  } catch (error) {
    console.error('Ошибка синхронизации с Telegram Cloud Storage:', error);
  }
}

// Проверка и установка уникального идентификатора пользователя
function setupUserIdentifier() {
  let userId = localStorage.getItem('userId');
  
  if (!userId) {
    // Генерируем уникальный ID
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
  }
  
  // Если в Telegram, используем Telegram ID
  if (checkTelegramEnvironment()) {
    try {
      const webApp = window.Telegram.WebApp;
      const user = webApp.initDataUnsafe.user;
      
      if (user && user.id) {
        userId = `tg_${user.id}`;
        localStorage.setItem('userId', userId);
        localStorage.setItem('telegramUserId', user.id.toString());
      }
    } catch (error) {
      console.error('Ошибка получения Telegram ID:', error);
    }
  }
  
  console.log('Идентификатор пользователя:', userId);
  return userId;
}

// Автоматическое сохранение при разгрузке страницы
function setupAutoSave() {
  window.addEventListener('beforeunload', function() {
    saveUserSettings();
    
    // Синхронизация с Telegram если доступно
    if (checkTelegramEnvironment() && window.telegramStorage) {
      window.telegramStorage.syncOnUnload();
    }
  });
}

// Рендеринг сохраненных материалов - ИСПРАВЛЕННАЯ ФУНКЦИЯ
function renderSavedMaterials() {
  console.log('=== RENDER SAVED MATERIALS START ===');

  const container = document.getElementById('saved-materials-container');
  
  if (!container) {
    console.error('❌ Контейнер saved-materials-container не найден!');
    return;
  }
  
  // Получаем ВСЕ сохранения из localStorage
  const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  
  console.log('Все сохранения из savedMaterials:', savedMaterials.length, 'записей');
  console.log('Содержимое сохранений:', savedMaterials);
  
  // Фильтруем по типам
  const characterSaves = savedMaterials.filter(save => 
    save && 
    typeof save === 'object' && 
    (!save.type || save.type === 'character') &&
    save.charKey // У персонажей есть charKey
  );
  
  const weaponSaves = savedMaterials.filter(save => 
    save && 
    typeof save === 'object' && 
    save.type === 'weapon'
  );
  
  const calculatorSaves = savedMaterials.filter(save => 
    save && 
    typeof save === 'object' && 
    save.type === 'calculator'
  );
  
  console.log('Отфильтровано:', {
    персонажи: characterSaves.length,
    оружие: weaponSaves.length,
    калькулятор: calculatorSaves.length
  });
  
  // Очищаем контейнер
  container.innerHTML = '';
  
  // Если нет сохранений вообще
  if (savedMaterials.length === 0) {
    const lang = window.currentLang || 'ru';
    const translationsObj = translations[lang] || translations['ru'];
    
    container.innerHTML = `
      <div class="no-saves-message" style="text-align: center; padding: 50px 20px;">
        <div style="font-size: 64px; color: #ccc; margin-bottom: 20px;">📂</div>
        <h3 style="color: #666; margin-bottom: 15px;">${translationsObj.profile?.noSaves || 'Нет сохраненных настроек'}</h3>
        <p style="color: #888; max-width: 500px; margin: 0 auto 25px;">
          ${translationsObj.profile?.noSavesDescription || 'Сохраните настройки персонажей, оружия или калькулятора, чтобы они появились здесь.'}
        </p>
        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
          <button onclick="window.location.hash = '#/characters'" style="
            background: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
          ">
            👤 ${translationsObj.common?.characters || 'Персонажи'}
          </button>
          <button onclick="window.location.hash = '#/weapon'" style="
            background: #FF9800;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
          ">
            ⚔️ ${translationsObj.common?.weapons || 'Оружие'}
          </button>
          <button onclick="window.location.hash = '#/profile/calculator'" style="
            background: #2196F3;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
          ">
            🧮 ${translationsObj.calculator?.title || 'Калькулятор'}
          </button>
        </div>
      </div>
    `;
    
    // Устанавливаем обработчики для новых кнопок
    setTimeout(() => {
      setupSaveCardEventListeners();
    }, 100);
    
    console.log('=== RENDER SAVED MATERIALS END (нет сохранений) ===');
    return;
  }
  
  // СОЗДАЕМ РАЗДЕЛЫ ДЛЯ КАЖДОГО ТИПА
  
  // 1. СОХРАНЕНИЯ ПЕРСОНАЖЕЙ
  if (characterSaves.length > 0) {
    const characterSection = document.createElement('div');
    characterSection.className = 'saves-section';
    characterSection.innerHTML = `
      <h3 style="color: #333; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #4CAF50;">
        ${translations[window.currentLang]?.profile?.characters || 'Персонажи'} (${characterSaves.length})
      </h3>
      <div class="characters-saves-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(32vw, 1fr)); gap: 15px;">
        ${renderCharacterSavesList(characterSaves)}
      </div>
    `;
    container.appendChild(characterSection);
  }
  
  // 2. СОХРАНЕНИЯ ОРУЖИЯ
  if (weaponSaves.length > 0) {
    const weaponSection = document.createElement('div');
    weaponSection.className = 'saves-section';
    weaponSection.style.marginTop = '30px';
    weaponSection.innerHTML = `
      <h3 style="color: #333; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #FF9800;">
        ⚔️ ${translations[window.currentLang]?.profile?.weapons || 'Оружие'} (${weaponSaves.length})
      </h3>
      <div class="weapons-saves-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(24vw, 1fr)); gap: 15px;">
        ${renderWeaponSavesList(weaponSaves)}
      </div>
    `;
    container.appendChild(weaponSection);
  }
  
  // 3. СОХРАНЕНИЯ КАЛЬКУЛЯТОРА
  if (calculatorSaves.length > 0) {
    const calculatorSection = document.createElement('div');
    calculatorSection.className = 'saves-section';
    calculatorSection.style.marginTop = '30px';
    
    calculatorSection.innerHTML = `
      <h3 style="color: #333; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #2196F3;">
        ${translations[window.currentLang]?.profile?.calculator || 'Калькулятор характеристик'} (${calculatorSaves.length})
      </h3>
      <div class="calculator-saves-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(36vw, 1fr)); gap: 20px;">
        ${renderCalculatorSavesList(calculatorSaves)}
      </div>
    `;
    container.appendChild(calculatorSection);
  }
  
  // Удаляем старые обработчики и добавляем новые
  setTimeout(() => {
    setupSaveCardEventListeners();
  }, 100);
  
  console.log('=== RENDER SAVED MATERIALS END (отображено сохранений) ===');
}

// Настройка обработчиков для карточек сохранений
function setupSaveCardEventListeners() {
  console.log('Настройка обработчиков для карточек сохранений');
  
  // Удаляем старые обработчики
  document.querySelectorAll('.load-save-btn').forEach(btn => {
    btn.replaceWith(btn.cloneNode(true));
  });
  
  document.querySelectorAll('.delete-save-btn').forEach(btn => {
    btn.replaceWith(btn.cloneNode(true));
  });
  
  // Обработчик для кнопок "Перейти"
  document.addEventListener('click', function(e) {
    const loadBtn = e.target.closest('.load-save-btn');
    if (loadBtn) {
      e.preventDefault();
      e.stopPropagation();
      
      const saveId = loadBtn.dataset.id;
      const type = loadBtn.dataset.type;
      
      console.log('Клик по кнопке "Перейти":', { saveId, type });
      
      switch(type) {
        case 'weapon':
          loadSavedWeapon(saveId);
          break;
        case 'calculator':
          loadCalculatorSaveByID(saveId);
          break;
        case 'character':
        default:
          loadSavedMaterials(saveId);
          break;
      }
    }
    
    // Обработчик для кнопок "Удалить"
    const deleteBtn = e.target.closest('.delete-save-btn');
    if (deleteBtn) {
      e.preventDefault();
      e.stopPropagation();
      
      const saveId = deleteBtn.dataset.id;
      const type = deleteBtn.dataset.type;
      const saveName = deleteBtn.closest('.saved-material-card')?.querySelector('h4')?.textContent || 'Сохранение';
      
      // Получаем дополнительные данные о сохранении
      const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
      const saveData = savedMaterials.find(s => 
        (s.id && s.id.toString() === saveId.toString()) || 
        (s.charKey && s.charKey === saveId) ||
        (s.weaponKey && s.weaponKey === saveId)
      );
      
      console.log('Клик по кнопке "Удалить":', { saveId, type, saveName });
      
      // Показываем модальное окно подтверждения
      showDeleteConfirmationModal(saveId, type, saveName, saveData);
    }
  });
}

// Рендеринг сохранений персонажей
function renderCharacterSavesList(saves) {
  if (!saves || saves.length === 0) {
    const lang = window.currentLang || 'ru';
    const translationsObj = translations[lang] || translations['ru'];
    return `
      <div class="no-saves-message">
        <div style="font-size: 48px; color: #ccc; margin-bottom: 20px;">👤</div>
        <h3>${translationsObj.profile?.noCharacterSaves || 'Нет сохраненных персонажей'}</h3>
      </div>
    `;
  }
  
  // Сортируем по дате
  saves.sort((a, b) => {
    const dateA = a.lastModified || a.date || 0;
    const dateB = b.lastModified || b.date || 0;
    return new Date(dateB) - new Date(dateA);
  });
  
  return saves.map((save, index) => 
    renderSaveCard(save, 'character', index)
  ).join('');
}

// Рендеринг сохранений оружия
function renderWeaponSavesList(saves) {
  if (!saves || saves.length === 0) {
    const lang = window.currentLang || 'ru';
    const translationsObj = translations[lang] || translations['ru'];
    return `
      <div class="no-saves-message">
        <div style="font-size: 48px; color: #ccc; margin-bottom: 20px;">⚔️</div>
        <h3>${translationsObj.profile?.noWeaponSaves || 'Нет сохраненного оружия'}</h3>
      </div>
    `;
  }
  
  // Сортируем по дате
  saves.sort((a, b) => {
    const dateA = a.lastModified || a.date || 0;
    const dateB = b.lastModified || b.date || 0;
    return new Date(dateB) - new Date(dateA);
  });

  return saves.map((save, index) => 
    renderSaveCard(save, 'weapon', index)
  ).join('');
}

// Рендеринг сохранений калькулятора
function renderCalculatorSavesList(saves) {
  if (!saves || saves.length === 0) {
    const lang = window.currentLang || 'ru';
    const translationsObj = translations[lang] || translations['ru'];
    return `
      <div class="no-saves-message">
        <div style="font-size: 48px; color: #ccc; margin-bottom: 20px;">🧮</div>
        <h3>${translationsObj.profile?.noCalculatorSaves || 'Нет сохраненных сборок калькулятора'}</h3>
      </div>
    `;
  }

  // Сортируем по дате
  saves.sort((a, b) => {
    const dateA = a.lastModified || a.date || 0;
    const dateB = b.lastModified || b.date || 0;
    return new Date(dateB) - new Date(dateA);
  });
  
  return saves.map((save, index) => 
    renderSaveCard(save, 'calculator', index)
  ).join('');
}

// Рендеринг одной карточки сохранения
function renderSaveCard(save, type) {
  const lang = window.currentLang || 'ru';
  const translationsObj = translations[lang] || translations['ru'];
  
  let icon = '📦';
  let title = 'Неизвестно';
  let imageSrc = 'assets/default-avatar.png';
  let statsText = '';
  let dateText = '';
  let saveId = save.id || save.charKey || save.weaponKey || Date.now().toString();
  
  console.log(`Рендерим карточку ${type}:`, { id: saveId, name: title });
  
  switch(type) {
    case 'weapon':
      icon = '⚔️';
      title = save.weaponName || save.name || 'Неизвестное оружие';
      imageSrc = save.weaponAvatar || save.avatar || 'assets/default-weapon.png';
      statsText = `
        <div style="font-size: 12px; color: #666; margin-top: 5px;">
          Уровень: ${save.level || 1} | Пробуждение: ${save.refinementLevel || 1}
        </div>
      `;
      break;
      
    case 'calculator':
      icon = '🧮';
      title = save.name || `${translationsObj.calculator?.build || 'Сборка'} калькулятора`;
      imageSrc = save.characterAvatar || save.character?.avatar || 'assets/calculator-icon.png';
      
      // Информация о персонаже и оружии
      const charName = save.characterName || 'Неизвестный';
      const weaponName = save.weaponName || 'Не выбрано';
      
      statsText = `
        <div style="font-size: 12px; color: #666; margin-top: 5px;">
          <div>${charName}</div>
          <div>${weaponName}</div>
        </div>
      `;
      break;
      
    case 'character':
    default:
      title = save.characterName || save.name || 'Неизвестный персонаж';
      imageSrc = save.characterAvatar || save.avatar_icon || 'assets/default-avatar.png';
      statsText = `
        <div style="font-size: 12px; color: #666; margin-top: 5px;">
          Уровень: ${save.level || 1} | Таланты: ${save.attackLevel || 1}/${save.skillLevel || 1}/${save.explosionLevel || 1}
        </div>
      `;
      break;
  }
  
  dateText = save.date || new Date(save.timestamp || Date.now()).toLocaleDateString(lang);
  
  return `
    <div class="saved-material-card br-r4 pad-2 br-drk bg-lt" data-type="${type}" data-id="${saveId}">
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <img src="${imageSrc}" 
             alt="${title}" 
             style="
               width: 50px;
               height: 50px;
               border-radius: 8px;
               object-fit: cover;
               margin-right: 15px;
             "
             onerror="this.src='${type === 'weapon' ? 'assets/default-weapon.png' : 'assets/default-avatar.png'}'">
        <div style="flex: 1;">
          <h4 style="margin: 0 0 5px 0; color: #333;">${title}</h4>
          <div style="font-size: 12px; color: #888;">${dateText}</div>
          ${statsText}
        </div>
      </div>
      
      <div style="display: flex; gap: 10px; margin-top: 15px;">
        <button class="load-save-btn br-r4" 
                data-type="${type}" 
                data-id="${saveId}"
                style="
                  flex: 1;
                  background: #4CAF50;
                  color: white;
                  padding: 8px 0;
                  border: none;
                  border-radius: 5px;
                  cursor: pointer;
                  font-weight: bold;
                  transition: background 0.3s;
                "
                onmouseover="this.style.background='#388E3C';"
                onmouseout="this.style.background='#4CAF50';">
          📂 ${translationsObj.common?.open || 'Открыть'}
        </button>
        <button class="delete-save-btn" 
                data-type="${type}" 
                data-id="${saveId}"
                style="
                  background: #f44336;
                  color: white;
                  padding: 8px 15px;
                  border: none;
                  border-radius: 5px;
                  cursor: pointer;
                  transition: background 0.3s;
                "
                onmouseover="this.style.background='#D32F2F';"
                onmouseout="this.style.background='#f44336';">
          🗑️
        </button>
      </div>
    </div>
  `;
}

// Загрузка сохраненных материалов из профиля по ID
function loadSavedMaterials(saveId) {
  const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  const save = savedMaterials.find(s => 
    (s.id && s.id.toString() === saveId.toString()) || 
    (s.charKey && s.charKey === saveId)
  );
  
  if (!save || typeof save !== 'object') {
    console.error('Сохранение персонажа не найдено:', saveId);
    showSaveNotification('Ошибка загрузки персонажа', 'error');
    return;
  }
  
  console.log('Загрузка сохранения из профиля по ID:', saveId, save);
  
  // ВАЖНО: Проверяем различные места где могут быть материалы
  const levelMats = save.levelMaterials || save.characterData?.levelMaterials || {};
  const attackMats = save.attackMaterials || save.characterData?.attackMaterials || {};
  const skillMats = save.skillMaterials || save.characterData?.skillMaterials || {};
  const burstMats = save.burstMaterials || save.characterData?.burstMaterials || {};
  
  const saveDataToLoad = {
    charName: save.characterName || save.name,
    charKey: save.charKey || save.key,
    rangeVal: save.characterData?.rangeVal || save.rangeVal || 0,
    level: save.level || 1,
    attackLevel: save.attackLevel || 1,
    skillLevel: save.skillLevel || 1,
    explosionLevel: save.explosionLevel || 1,
    userInputs: save.userInputs || {},
    characterAvatar: save.characterAvatar || save.avatar,
    timestamp: Date.now(),
    characterData: save.characterData?.fullCharacterData || save.characterData || save,
    // ВАЖНО: Сохраняем данные материалов
    levelMaterials: levelMats,
    attackMaterials: attackMats,
    skillMaterials: skillMats,
    burstMaterials: burstMats,
    // Флаги загрузки
    isFromLoad: true,
    isFromSave: true,
    isFromProfile: true,
    loadedFromSave: true,
    saveId: save.id || save.charKey || save.key,
    lastModified: save.lastModified || Date.now()
  };
  
  // Сохраняем персонажа
  localStorage.setItem('selectedCharacter', JSON.stringify({
    key: save.charKey || save.characterData?.key || save.key || 'Flins',
    data: save.characterData?.fullCharacterData || save.characterData || save,
    lang: window.currentLang
  }));
  
  localStorage.setItem('characterLevelData', JSON.stringify(saveDataToLoad));
  localStorage.setItem('characterData', JSON.stringify(saveDataToLoad));
  
  console.log('Данные загружены из профиля по ID:', saveId);
  
  // Переходим на страницу материалов персонажа
  window.location.hash = '#/characters/mat';
  
  showSaveNotification('Персонаж загружен!', 'success');
}

// Удаление сохранения персонажа по ID
function deleteSavedMaterials(saveId) {
  const lang = window.currentLang || 'ru';
  const translationsObj = translations[lang] || translations['ru'];
  
  if (!confirm(translationsObj.modals?.delete?.confirmCharacter || 'Удалить сохранение персонажа?')) return;
  
  const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  const originalLength = savedMaterials.length;
  
  // Удаляем по ID или charKey
  const updatedMaterials = savedMaterials.filter(save => {
    if (save.id && save.id.toString() === saveId.toString()) {
      return false; // Удаляем
    }
    if (save.charKey && save.charKey === saveId) {
      return false; // Удаляем
    }
    return true; // Оставляем
  });
  
  if (updatedMaterials.length < originalLength) {
    localStorage.setItem('savedMaterials', JSON.stringify(updatedMaterials));
    
    // Синхронизируем с облаком
    if (window.telegramStorage) {
      window.telegramStorage.setItem('savedMaterials', updatedMaterials);
    }
    
    renderSavedMaterials();
    showSaveNotification(translationsObj.notifications?.deleteSuccess || 'Сохранение удалено!', 'success');
  } else {
    showSaveNotification('Сохранение не найдено', 'error');
  }
}

// Загрузка сборки калькулятора по ID
function loadCalculatorSaveByID(saveId) {
  const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  const save = savedMaterials.find(s => 
    s && 
    s.type === 'calculator' && 
    s.id && 
    s.id.toString() === saveId.toString()
  );
  
  if (!save || typeof save !== 'object') {
    console.error('Сохранение калькулятора не найдено:', saveId);
    showSaveNotification('Ошибка загрузки сборки калькулятора', 'error');
    return;
  }
  
  console.log('Загрузка сохранения калькулятора по ID:', saveId, save);
  
  // Сохраняем ID для загрузки на странице калькулятора
  localStorage.setItem('loadCalculatorSaveId', saveId.toString());
  
  // Переходим на страницу калькулятора
  window.location.hash = '#/profile/calculator';
  
  showSaveNotification('Сборка калькулятора загружена!', 'success');
}

// Удаление сборки калькулятора по ID
function deleteCalculatorSaveByID(saveId) {
  const lang = window.currentLang || 'ru';
  const translationsObj = translations[lang] || translations['ru'];
  
  if (!confirm(translationsObj.modals?.delete?.confirmCalculator || 'Удалить сборку калькулятора?')) return;
  
  const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  const originalLength = savedMaterials.length;
  
  // Удаляем калькулятор по ID
  const updatedMaterials = savedMaterials.filter(save => {
    if (save && save.type === 'calculator' && save.id && save.id.toString() === saveId.toString()) {
      return false; // Удаляем
    }
    return true; // Оставляем
  });
  
  if (updatedMaterials.length < originalLength) {
    localStorage.setItem('savedMaterials', JSON.stringify(updatedMaterials));
    
    // Синхронизируем с облаком
    if (window.telegramStorage) {
      window.telegramStorage.setItem('savedMaterials', updatedMaterials);
    }
    
    renderSavedMaterials();
    showSaveNotification(translationsObj.notifications?.deleteSuccess || 'Сборка калькулятора удалена!', 'success');
  } else {
    showSaveNotification('Сборка калькулятора не найдена', 'error');
  }
}

// Загрузка сохраненного оружия по ID
function loadSavedWeapon(saveId) {
  const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  const save = savedMaterials.find(s => 
    s && 
    s.type === 'weapon' && 
    s.id && 
    s.id.toString() === saveId.toString()
  );
  
  if (!save || typeof save !== 'object') {
    console.error('Сохранение оружия не найдено:', saveId);
    showSaveNotification('Ошибка загрузки оружия', 'error');
    return;
  }
  
  console.log('Загрузка сохранения оружия по ID:', saveId, save);
  
  // Сохраняем выбранное оружие
  localStorage.setItem('selectedWeapon', JSON.stringify({
    key: save.weaponKey || save.key,
    data: save.weaponData || save,
    lang: window.currentLang
  }));
  
  // Сохраняем данные уровня оружия
  const saveDataToLoad = {
    weaponName: save.weaponName || save.name,
    weaponKey: save.weaponKey || save.key,
    level: save.level || 1,
    refinementLevel: save.refinementLevel || 1,
    timestamp: Date.now(),
    weaponData: save.weaponData || save,
    isFromLoad: true,
    isFromProfile: true,
    loadedFromSave: true
  };
  
  localStorage.setItem('weaponLevelData', JSON.stringify(saveDataToLoad));
  
  // Переходим на страницу материалов оружия
  window.location.hash = '#/weapon/mat';
  
  showSaveNotification('Оружие загружено!', 'success');
}

// Удаление сохраненного оружия по ID
function deleteSavedWeapon(saveId) {
  const lang = window.currentLang || 'ru';
  const translationsObj = translations[lang] || translations['ru'];
  
  if (!confirm(translationsObj.modals?.delete?.confirmWeapon || 'Удалить сохранение оружия?')) return;
  
  const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  const originalLength = savedMaterials.length;
  
  // Удаляем оружие по ID
  const updatedMaterials = savedMaterials.filter(save => {
    if (save && save.type === 'weapon' && save.id && save.id.toString() === saveId.toString()) {
      return false; // Удаляем
    }
    return true; // Оставляем
  });
  
  if (updatedMaterials.length < originalLength) {
    localStorage.setItem('savedMaterials', JSON.stringify(updatedMaterials));
    
    // Синхронизируем с облаком
    if (window.telegramStorage) {
      window.telegramStorage.setItem('savedMaterials', updatedMaterials);
    }
    
    renderSavedMaterials();
    showSaveNotification(translationsObj.notifications?.deleteSuccess || 'Сохранение оружия удалено!', 'success');
  } else {
    showSaveNotification('Сохранение оружия не найдено', 'error');
  }
}

// Функция для показа модального окна подтверждения удаления
function showDeleteConfirmationModal(saveId, type, saveName, saveData) {
    const lang = window.currentLang || 'ru';
    const translationsObj = translations[lang] || translations['ru'];
    
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'delete-confirm-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;
    
    const modalContent = document.createElement('div');
    modalContent.className = 'delete-modal-content';
    modalContent.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 25px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        animation: modalSlideIn 0.3s ease;
    `;
    
    // Определяем иконку и цвет в зависимости от типа
    let icon = '🗑️';
    let color = '#f44336';
    let typeText = '';
    
    switch(type) {
        case 'weapon':
            icon = '⚔️';
            color = '#FF9800';
            typeText = translationsObj.common?.weapons || 'Оружие';
            break;
        case 'calculator':
            icon = '🧮';
            color = '#2196F3';
            typeText = translationsObj.calculator?.title || 'Калькулятор';
            break;
        case 'character':
        default:
            icon = '👤';
            color = '#4CAF50';
            typeText = translationsObj.common?.characters || 'Персонаж';
            break;
    }
    
    // Формируем информацию о сохранении
    let saveInfo = '';
    if (saveData) {
        if (type === 'character') {
            saveInfo = `
                <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <img src="${saveData.characterAvatar || saveData.avatar || 'assets/default-avatar.png'}" 
                             alt="${saveName}" 
                             style="width: 40px; height: 40px; border-radius: 8px; margin-right: 10px;">
                        <div>
                            <strong>${saveName}</strong>
                            <div style="font-size: 12px; color: #666;">
                                ${translationsObj.character?.level || 'Уровень'}: ${saveData.level || 1}
                            </div>
                        </div>
                    </div>
                    <div style="font-size: 13px; color: #666;">
                        ${translationsObj.character?.talents || 'Таланты'}: 
                        ${saveData.attackLevel || 1}/${saveData.skillLevel || 1}/${saveData.explosionLevel || 1}
                    </div>
                </div>
            `;
        } else if (type === 'weapon') {
            saveInfo = `
                <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <div style="display: flex; align-items: center;">
                        <img src="${saveData.weaponAvatar || saveData.avatar || 'assets/default-weapon.png'}" 
                             alt="${saveName}" 
                             style="width: 40px; height: 40px; border-radius: 8px; margin-right: 10px;">
                        <div>
                            <strong>${saveName}</strong>
                            <div style="font-size: 12px; color: #666;">
                                ${translationsObj.character?.level || 'Уровень'}: ${saveData.level || 1}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (type === 'calculator') {
            saveInfo = `
                <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <div style="font-size: 14px;">
                        <strong>${saveName}</strong>
                        <div style="margin-top: 5px; font-size: 13px; color: #666;">
                            ${saveData.characterName ? `${translationsObj.calculator?.character || 'Персонаж'}: ${saveData.characterName}` : ''}
                            ${saveData.weaponName ? `<br>${translationsObj.calculator?.weapon || 'Оружие'}: ${saveData.weaponName}` : ''}
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    modalContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 48px; color: ${color}; margin-bottom: 10px;">${icon}</div>
            <h3 style="margin: 0 0 10px 0; color: #333;">
                ${translationsObj.modals?.delete?.title || 'Удаление сохранения'}
            </h3>
            <p style="color: #666; margin: 0;">
                ${translationsObj.modals?.delete?.message || 'Вы уверены, что хотите удалить это сохранение?'}
            </p>
        </div>
        
        ${saveInfo}
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0; color: #856404;">
            <strong>⚠️ ${translationsObj.notification?.warning || 'Внимание'}:</strong> 
            ${translationsObj.modals?.delete?.warning || 'Это действие нельзя отменить. Все данные будут удалены навсегда.'}
        </div>
        
        <div style="display: flex; gap: 15px; margin-top: 25px;">
            <button id="delete-cancel" class="delete-action-btn cancel" style="
                flex: 1;
                padding: 12px 0;
                background: #6c757d;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: background 0.3s;
            ">
                ${translationsObj.common?.cancel || 'Отмена'}
            </button>
            <button id="delete-confirm" class="delete-action-btn confirm" style="
                flex: 1;
                padding: 12px 0;
                background: ${color};
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: background 0.3s;
            ">
                ${translationsObj.buttons?.delete || 'Удалить'}
            </button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Регистрируем модальное окно в modalManager
    if (window.modalManager) {
        window.modalManager.registerModal(modal, 'delete-confirm');
    }
    
    // Добавляем функцию перевода
    modal.translate = function(newLang) {
        const newTranslationsObj = translations[newLang] || translations['ru'];
        
        modalContent.querySelector('h3').textContent = newTranslationsObj.modals?.delete?.title || 'Удаление сохранения';
        modalContent.querySelector('p').textContent = newTranslationsObj.modals?.delete?.message || 'Вы уверены, что хотите удалить это сохранение?';
        
        const warningDiv = modalContent.querySelector('div[style*="background: #fff3cd"]');
        if (warningDiv) {
            const strong = warningDiv.querySelector('strong');
            const text = warningDiv.querySelector('span') || warningDiv.lastChild;
            if (strong) {
                strong.textContent = `⚠️ ${newTranslationsObj.notification?.warning || 'Внимание'}:`;
            }
            if (text && text.nodeType === 3) {
                text.textContent = newTranslationsObj.modals?.delete?.warning || 'Это действие нельзя отменить. Все данные будут удалены навсегда.';
            }
        }
        
        modalContent.querySelector('#delete-cancel').textContent = newTranslationsObj.common?.cancel || 'Отмена';
        modalContent.querySelector('#delete-confirm').textContent = newTranslationsObj.buttons?.delete || 'Удалить';
    };
    
    // Обработчики событий
    const cancelBtn = modalContent.querySelector('#delete-cancel');
    const confirmBtn = modalContent.querySelector('#delete-confirm');
    
    const closeModal = () => {
        if (window.modalManager) {
            window.modalManager.unregisterModal(modal);
        }
        modal.remove();
    };
    
    cancelBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('mouseover', () => cancelBtn.style.background = '#5a6268');
    cancelBtn.addEventListener('mouseout', () => cancelBtn.style.background = '#6c757d');
    
    confirmBtn.addEventListener('click', () => {
        closeModal();
        
        // Вызываем соответствующую функцию удаления
        switch(type) {
            case 'weapon':
                deleteSavedWeapon(saveId);
                break;
            case 'calculator':
                deleteCalculatorSaveByID(saveId);
                break;
            case 'character':
            default:
                deleteSavedMaterials(saveId);
                break;
        }
    });
    
    confirmBtn.addEventListener('mouseover', () => confirmBtn.style.background = type === 'weapon' ? '#f57c00' : 
                                                                                type === 'calculator' ? '#1976d2' : 
                                                                                '#388e3c');
    confirmBtn.addEventListener('mouseout', () => confirmBtn.style.background = color);
    
    // Закрытие при клике вне окна
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Закрытие по клавише Esc
    document.addEventListener('keydown', function closeOnEsc(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', closeOnEsc);
        }
    });
    
    // Фокус на кнопке отмены для доступности
    setTimeout(() => {
        cancelBtn.focus();
    }, 100);
}

// Показать уведомление
function showSaveNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `save-notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  
  if (type === 'success') {
    notification.style.background = '#4CAF50';
  } else if (type === 'error') {
    notification.style.background = '#f44336';
  } else {
    notification.style.background = '#2196F3';
  }
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Функция для принудительного обновления профиля
export function forceRefreshProfile() {
  console.log('Принудительное обновление профиля...');
  setTimeout(() => {
    renderSavedMaterials();
  }, 100);
}

// Экспортируем функцию renderSavedMaterials для использования в других модулях
export { renderSavedMaterials };