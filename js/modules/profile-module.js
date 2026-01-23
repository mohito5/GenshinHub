// profile-module.js - полностью исправленная версия
import { translations } from '../translations.js';
import { formatNumber } from '../utils/number-utils.js';
import { loadCalculatorSaveById } from './calculator-module.js';
import { charsData } from '../characterData.js';

// В начале файла добавьте этот код для экспорта charsData в window
if (typeof window !== 'undefined') {
  window.charsData = charsData;
  console.log('charsData добавлен в window:', Object.keys(charsData).length, 'персонажей');
}
// Инициализация модуля профиля
// Инициализация модуля профиля
export function initProfileModule() {
  console.log('Инициализация модуля профиля');
  
  // Устанавливаем идентификатор пользователя
  setupUserIdentifier();
  
  // Инициализируем профиль пользователя
  initUserProfile();
  
  // Загружаем данные из Telegram если доступно
  if (checkTelegramEnvironment()) {
    loadFromTelegramStorage();
  }
  
  // Рендерим сохраненные материалы
  renderSavedMaterials();
  
  // Добавляем обработчики событий
  setupProfileEventListeners();
  
  // Настраиваем автосохранение
  setupAutoSave();
  
  // Локализация
  setTimeout(() => {
    localizeProfilePage();
  }, 100);
  
  // Предзагрузка аватаров в фоне
  setTimeout(() => {
    preloadAvatarsInBackground();
  }, 500);
}

// Новая функция для фоновой предзагрузки аватаров
// Обновленная функция preloadAvatarsInBackground
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
        console.log('Добавлен аватар персонажа:', character.ru_name || character.en_name, character.avatar_icon);
      }
    });
  } else {
    console.log('Импортированный charsData не доступен');
  }
  
  // Добавляем общие аватары
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
    console.log('Добавлен общий аватар:', url);
  });
  
  console.log('Всего URL для предзагрузки:', avatarUrls.size);
  
  // Предзагружаем каждое изображение
  avatarUrls.forEach(url => {
    const img = new Image();
    
    img.onload = function() {
      console.log('Аватар успешно предзагружен:', url);
      // Сохраняем в кэше
      window.avatarImageCache.set(url, img);
    };
    
    img.onerror = function() {
      console.log('Не удалось предзагрузить аватар:', url);
    };
    
    img.src = url;
  });
  
  console.log('Предзагрузка аватаров завершена');
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
function checkTelegramEnvironment() {
  if (typeof window.Telegram !== 'undefined' && 
      typeof window.Telegram.WebApp !== 'undefined') {
    console.log('Обнаружен Telegram WebApp');
    return true;
  }
  
  // Проверка по user agent
  const userAgent = navigator.userAgent.toLowerCase();
  const isTelegramWebView = userAgent.includes('telegram') || 
                           userAgent.includes('webview');
  
  console.log('Telegram окружение:', isTelegramWebView);
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
      
      document.getElementById('username-input').value = username;
      
      // Если есть фото, используем его
      if (user.photo_url) {
        document.getElementById('user-avatar').src = user.photo_url;
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

// Инициализация профиля для браузера
function initBrowserProfile() {
  console.log('Инициализация профиля для браузера');
  loadUserSettings();
}

// Загрузка настроек пользователя
function loadUserSettings() {
  const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  
  if (savedProfile.username) {
    document.getElementById('username-input').value = savedProfile.username;
  }
  
  if (savedProfile.avatar) {
    document.getElementById('user-avatar').src = savedProfile.avatar;
  }
  
  console.log('Настройки пользователя загружены:', savedProfile);
}

// Сохранение настроек пользователя
function saveUserSettings() {
  const username = document.getElementById('username-input').value.trim();
  const avatar = document.getElementById('user-avatar').src;
  
  const userProfile = {
    username: username || 'Пользователь',
    avatar: avatar,
    lastUpdated: Date.now()
  };
  
  localStorage.setItem('userProfile', JSON.stringify(userProfile));
  
  // Показываем уведомление о сохранении
  showSaveNotification('Настройки профиля сохранены', 'success');
  
  console.log('Настройки пользователя сохранены:', userProfile);
}
// Настройка обработчиков событий профиля
function setupProfileEventListeners() {
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
}

// Открытие селектора аватаров
// Обновленная функция openAvatarSelector
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
// profile-module.js - обновленная функция loadAvatarOptions
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
    console.log('Найдено персонажей в charsData:', Object.keys(charsData).length);
    
    Object.values(charsData).forEach(character => {
      if (character && character.avatar_icon) {
        avatars.push({
          src: character.avatar_icon,
          name: character.ru_name || character.en_name || 'Персонаж',
          type: 'character'
        });
        console.log('Добавлен аватар персонажа:', character.ru_name, character.avatar_icon);
      }
    });
  } else {
    console.log('charsData не доступен');
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
      console.log('Добавлен общий аватар:', avatar.name);
    }
  });
  
  console.log('Всего доступных аватаров:', avatars.length);
  
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
    console.log('Используем предзагруженное изображение:', avatar.src);
  } else {
    // Загружаем изображение
    console.log('Начинаем загрузку изображения:', avatar.src);
  }
  
  // Обработчик загрузки
  img.onload = function() {
    this.style.opacity = '1';
    console.log('Изображение загружено:', avatar.src);
  };
  
  // Обработчик ошибок с защитой от бесконечных попыток
  let errorAttempts = 0;
  const maxErrorAttempts = 1;
  
  img.onerror = function() {
    errorAttempts++;
    if (errorAttempts <= maxErrorAttempts) {
      console.log(`Ошибка загрузки: ${avatar.src}, попытка ${errorAttempts}`);
      // Пробуем загрузить fallback изображение
      this.src = 'assets/avatar-icon/default-user.png';
    } else {
      console.log(`Превышено количество попыток загрузки: ${avatar.src}`);
      this.style.opacity = '0';
      // Показываем иконку вместо изображения
      const fallbackIcon = document.createElement('div');
      fallbackIcon.textContent = '👤';
      fallbackIcon.style.cssText = `
        font-size: 24px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #999;
      `;
      imageContainer.appendChild(fallbackIcon);
    }
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
    document.getElementById('user-avatar').src = avatar.src;
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

// Загрузка данных из Telegram Cloud Storage
function loadFromTelegramStorage() {
  if (!checkTelegramEnvironment()) return;
  
  try {
    const webApp = window.Telegram.WebApp;
    const cloudStorage = webApp.CloudStorage;
    
    if (cloudStorage) {
      // Загружаем профиль
      cloudStorage.getItem('userProfile', (error, profileData) => {
        if (!error && profileData) {
          try {
            const profile = JSON.parse(profileData);
            localStorage.setItem('userProfile', JSON.stringify(profile));
            
            // Применяем загруженные настройки
            if (profile.username) {
              document.getElementById('username-input').value = profile.username;
            }
            if (profile.avatar) {
              document.getElementById('user-avatar').src = profile.avatar;
            }
            
            console.log('Профиль загружен из Telegram Cloud Storage');
          } catch (e) {
            console.error('Ошибка парсинга профиля из Telegram:', e);
          }
        }
      });
      
      // Загружаем сохранения
      cloudStorage.getItem('savedMaterials', (error, materialsData) => {
        if (!error && materialsData) {
          try {
            const materials = JSON.parse(materialsData);
            localStorage.setItem('savedMaterials', JSON.stringify(materials));
            
            // Обновляем отображение
            renderSavedMaterials();
            
            console.log('Сохранения загружены из Telegram Cloud Storage');
          } catch (e) {
            console.error('Ошибка парсинга сохранений из Telegram:', e);
          }
        }
      });
    }
  } catch (error) {
    console.error('Ошибка загрузки из Telegram Cloud Storage:', error);
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
    if (checkTelegramEnvironment()) {
      syncWithTelegramStorage();
    }
  });
}

// Рендеринг сохраненных материалов - ИСПРАВЛЕННАЯ ФУНКЦИЯ
// profile-module.js - обновленная функция renderSavedMaterials
function renderSavedMaterials() {
  console.log('=== RENDER SAVED MATERIALS START ===');
  const container = document.getElementById('saved-materials-container');
  
  if (!container) {
    console.error('❌ Контейнер saved-materials-container не найден!');
    return;
  }
  
  // ВАЖНО: Получаем ВСЕ сохранения из общего массива
  const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  
  console.log('Все сохранения из savedMaterials:', savedMaterials);
  
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
  }
  
  // Удаляем старые обработчики и добавляем новые
  setTimeout(() => {
    setupSaveCardEventListeners();
  }, 100);
}

// profile-module.js - обновленная функция setupSaveCardEventListeners
// profile-module.js - добавьте эти функции
// Обновите функцию setupSaveCardEventListeners
function setupSaveCardEventListeners() {
  console.log('Настройка обработчиков для карточек сохранений');
  
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
  
  // Фильтруем только персонажей (не калькулятор и не оружие)
  const characterSaves = saves.filter(save => 
    save && 
    typeof save === 'object' && 
    (!save.type || save.type === 'character') &&
    save.charKey // У персонажей есть charKey
  );
  
  // Сортируем по дате
  characterSaves.sort((a, b) => {
    const dateA = a.lastModified || a.date || 0;
    const dateB = b.lastModified || b.date || 0;
    return new Date(dateB) - new Date(dateA);
  });
  
  return characterSaves.map((save, index) => 
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
  if (!saves || saves.length === 0) return '';

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

// Рендеринг одной карточки сохранения - ИСПРАВЛЕННАЯ
// profile-module.js - обновленная функция renderSaveCard
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
// Загрузка сохраненных материалов из профиля
// profile-module.js - обновленные функции загрузки и удаления

// Загрузка сохраненных материалов из профиля по ID
// profile-module.js - исправленная функция loadSavedMaterials
// profile-module.js - исправленная функция loadSavedMaterials
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
  
  console.log('Загруженные материалы из сохранения:', {
    levelMats, attackMats, skillMats, burstMats
  });
  
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
  console.log('Материалы уровня:', levelMats);
  console.log('Материалы атаки:', attackMats);
  console.log('Материалы навыка:', skillMats);
  console.log('Материалы взрыва:', burstMats);
  
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
    renderSavedMaterials();
    showSaveNotification(translationsObj.notifications?.deleteSuccess || 'Сохранение оружия удалено!', 'success');
  } else {
    showSaveNotification('Сохранение оружия не найдено', 'error');
  }
}

// Загрузка сборки калькулятора по индексу
function loadCalculatorSaveByIndex(index) {
  const calculatorSaves = JSON.parse(localStorage.getItem('calculatorSaves') || '[]');
  const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  
  let save = null;
  
  if (index >= 0 && index < calculatorSaves.length) {
    save = calculatorSaves[index];
  } else if (index >= 0) {
    // Ищем в общих сохранениях
    const calcSaves = savedMaterials.filter(s => s && s.type === 'calculator');
    if (index < calcSaves.length) {
      save = calcSaves[index];
    }
  }
  
  if (!save || typeof save !== 'object') {
    console.error('Сохранение калькулятора не найдено');
    showSaveNotification('Ошибка загрузки сборки калькулятора', 'error');
    return;
  }
  
  console.log('Загрузка сохранения калькулятора:', save);
  
  // Используем глобальную функцию из web.js
  if (typeof window.loadCalculatorSaveById === 'function') {
    window.loadCalculatorSaveById(save.id);
  } else if (typeof loadCalculatorSaveById === 'function') {
    loadCalculatorSaveById(save.id);
  } else {
    console.error('Функция loadCalculatorSaveById не найдена');
    showSaveNotification('Ошибка загрузки калькулятора', 'error');
  }
}



// profile-module.js - добавьте эти функции

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



// Удаление сборки калькулятора по индексу
function deleteCalculatorSaveByIndex(index) {
  const lang = window.currentLang || 'ru';
  const translationsObj = translations[lang] || translations['ru'];
  
  if (!confirm(translationsObj.modals?.delete?.confirmCalculator || 'Удалить сборку калькулятора?')) return;
  
  const calculatorSaves = JSON.parse(localStorage.getItem('calculatorSaves') || '[]');
  const savedMaterials = JSON.parse(localStorage.getItem('savedMaterials') || '[]');
  
  let saveToDelete = null;
  
  if (index >= 0 && index < calculatorSaves.length) {
    saveToDelete = calculatorSaves[index];
    
    // Удаляем из массива калькулятора
    calculatorSaves.splice(index, 1);
    localStorage.setItem('calculatorSaves', JSON.stringify(calculatorSaves));
    
    // Удаляем из общего массива
    const updatedMaterials = savedMaterials.filter(save => 
      !(save && save.id === saveToDelete.id && save.type === 'calculator')
    );
    localStorage.setItem('savedMaterials', JSON.stringify(updatedMaterials));
  } else {
    // Ищем в общих сохранениях
    const calcSaves = savedMaterials.filter(s => s && s.type === 'calculator');
    if (index >= 0 && index < calcSaves.length) {
      saveToDelete = calcSaves[index];
      
      // Удаляем из общего массива
      const updatedMaterials = savedMaterials.filter(save => 
        !(save && save.id === saveToDelete.id && save.type === 'calculator')
      );
      localStorage.setItem('savedMaterials', JSON.stringify(updatedMaterials));
      
      // Удаляем из массива калькулятора
      const updatedCalcSaves = calculatorSaves.filter(save => 
        !(save && save.id === saveToDelete.id)
      );
      localStorage.setItem('calculatorSaves', JSON.stringify(updatedCalcSaves));
    }
  }
  
  if (saveToDelete) {
    renderSavedMaterials();
    showSaveNotification(translationsObj.notifications?.deleteSuccess || 'Сборка калькулятора удалена!', 'success');
  }
}

// Добавление кнопки обновления
function addRefreshButton() {
  const container = document.getElementById('saved-materials-container');
  if (!container || !container.parentNode) return;
  
  const lang = window.currentLang || 'ru';
  const translationsObj = translations[lang] || translations['ru'];
  
  // Удаляем старую кнопку если есть
  const oldBtn = container.parentNode.querySelector('.refresh-profile-btn');
  if (oldBtn) oldBtn.remove();
  
  const refreshBtn = document.createElement('button');
  refreshBtn.className = 'refresh-profile-btn';
  refreshBtn.textContent = translationsObj.common?.refresh || 'Обновить список';
  refreshBtn.style.cssText = `
    background: #2196F3;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 20px auto;
    display: block;
    transition: background 0.3s;
  `;
  refreshBtn.onmouseover = () => refreshBtn.style.background = '#1976D2';
  refreshBtn.onmouseout = () => refreshBtn.style.background = '#2196F3';
  refreshBtn.onclick = () => {
    console.log('Ручное обновление списка сохранений');
    renderSavedMaterials();
  };
  
  container.parentNode.insertBefore(refreshBtn, container.nextSibling);
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