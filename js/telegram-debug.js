// telegram-debug.js - простой скрипт для отладки Telegram
export function initTelegramDebug() {
  console.log('=== TELEGRAM DEBUG MODULE ===');
  
  // Проверяем все доступные способы определения Telegram
  const checks = {
    'window.Telegram': typeof window.Telegram !== 'undefined',
    'Telegram.WebApp': typeof window.Telegram !== 'undefined' && window.Telegram.WebApp,
    'URL tgWebAppVersion': new URLSearchParams(window.location.search).get('tgWebAppVersion'),
    'URL tgWebAppData': new URLSearchParams(window.location.search).has('tgWebAppData'),
    'Hash tgWebAppData': window.location.hash.includes('tgWebAppData'),
    'LocalStorage flag': localStorage.getItem('isTelegramMiniApp') === 'true'
  };
  
  console.table(checks);
  
  // Показываем уведомление в зависимости от окружения
  setTimeout(() => {
    const isTelegram = Object.values(checks).some(v => v === true);
    
    if (isTelegram) {
      console.log('✅ Приложение запущено в Telegram Mini App');
      
      // Добавляем отладочную информацию на страницу
      addDebugInfoToPage({
        platform: window.Telegram?.WebApp?.platform || 'unknown',
        version: window.Telegram?.WebApp?.version || 'unknown',
        theme: window.Telegram?.WebApp?.colorScheme || 'light',
        isTelegram: true
      });
    } else {
      console.log('🌐 Приложение запущено в браузере');
      
      addDebugInfoToPage({
        platform: 'browser',
        version: 'n/a',
        theme: 'light',
        isTelegram: false
      });
    }
  }, 1000);
  
  return checks;
}

function addDebugInfoToPage(info) {
  // Создаем небольшой информационный блок
  const debugDiv = document.createElement('div');
  debugDiv.id = 'telegram-debug-info';
  debugDiv.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: ${info.isTelegram ? '#4CAF50' : '#2196F3'};
    color: white;
    padding: 8px 12px;
    border-radius: 5px;
    font-size: 12px;
    z-index: 9999;
    opacity: 0.9;
    display: none; /* По умолчанию скрыто */
  `;
  
  debugDiv.innerHTML = `
    <strong>${info.isTelegram ? '📱 Telegram Mini App' : '🌐 Браузер'}</strong><br>
    Platform: ${info.platform}<br>
    Version: ${info.version}
  `;
  
  document.body.appendChild(debugDiv);
  
  // Добавляем кнопку для переключения видимости отладки
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'toggle-debug-btn';
  toggleBtn.textContent = '👁️';
  toggleBtn.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 70px;
    background: #333;
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
    z-index: 10000;
    opacity: 0.7;
  `;
  
  toggleBtn.onclick = function() {
    const debugDiv = document.getElementById('telegram-debug-info');
    if (debugDiv) {
      debugDiv.style.display = debugDiv.style.display === 'none' ? 'block' : 'none';
    }
  };
  
  document.body.appendChild(toggleBtn);
}

// Функция для принудительной проверки Telegram
export function forceTelegramCheck() {
  console.log('=== MANUAL TELEGRAM CHECK ===');
  
  // Проверяем все возможные методы
  const methods = [
    () => typeof window.Telegram !== 'undefined',
    () => typeof window.Telegram !== 'undefined' && window.Telegram.WebApp,
    () => new URLSearchParams(window.location.search).get('tgWebAppVersion'),
    () => new URLSearchParams(window.location.search).has('tgWebAppData'),
    () => window.location.hash.includes('tgWebAppData'),
    () => localStorage.getItem('isTelegramMiniApp') === 'true'
  ];
  
  const results = methods.map((method, i) => {
    try {
      return method();
    } catch (e) {
      return false;
    }
  });
  
  const isTelegram = results.some(r => Boolean(r));
  
  if (isTelegram) {
    alert(`✅ Telegram Mini App обнаружен!\n\nРезультаты проверки:\n1. window.Telegram: ${results[0]}\n2. Telegram.WebApp: ${results[1]}\n3. URL параметр версии: ${results[2]}\n4. URL параметр данных: ${results[3]}\n5. Hash параметры: ${results[4]}\n6. LocalStorage флаг: ${results[5]}`);
    
    // Сохраняем флаг для других скриптов
    localStorage.setItem('isTelegramMiniApp', 'true');
    
    // Если нет объекта Telegram, создаем его
    if (!window.Telegram) {
      window.Telegram = {
        WebApp: {
          ready: () => console.log('Telegram WebApp ready (forced)'),
          expand: () => console.log('Telegram WebApp expand (forced)'),
          colorScheme: 'light',
          initDataUnsafe: {},
          platform: 'web',
          version: results[2] || '7.0',
          CloudStorage: {
            setItem: (key, value, callback) => {
              console.log('Forced CloudStorage.setItem:', key);
              localStorage.setItem('tg_' + key, value);
              if (callback) setTimeout(() => callback(null), 100);
            },
            getItem: (key, callback) => {
              console.log('Forced CloudStorage.getItem:', key);
              const data = localStorage.getItem('tg_' + key);
              if (callback) setTimeout(() => callback(null, data), 100);
            }
          }
        }
      };
    }
    
    return true;
  } else {
    alert('❌ Telegram Mini App не обнаружен.\n\nПриложение работает в браузере.');
    return false;
  }
}

// Экспортируем глобально для доступа из консоли
window.forceTelegramCheck = forceTelegramCheck;
window.initTelegramDebug = initTelegramDebug;