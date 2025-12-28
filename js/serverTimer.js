// serverTimer.js
export class ServerTimer {
  constructor({ containerId, switchId, translations, currentLang }) {
    this.container = document.getElementById(containerId);
    this.switchEl = document.getElementById(switchId);
    this.translations = translations;
    this.currentLang = currentLang;
    this.intervalId = null;
    this.handleSwitchChange = this.handleSwitchChange.bind(this);

    // Данные серверов Genshin Impact
    this.servers = this.initializeServers();
  }

  //Инициализирует данные серверов
  initializeServers() {
    return [
      {
        key: 'asia',
        name: 'Asia',
        serverTimezone: 'Asia/Shanghai',
        resetHour: 4, // 04:00 серверного времени
        offset: '+08:00',
        color: 'var(--pyro)',
        region: 'asia',
        gmtOffset: 8 // GMT+8
      },
      {
        key: 'europe',
        name: 'Europe Server',
        serverTimezone: 'Europe/Berlin',
        resetHour: 4, // 04:00 серверного времени
        offset: '+01:00',
        color: 'var(--dendro)',
        region: 'europe',
        gmtOffset: 1 // GMT+1
      },
      {
        key: 'america',
        name: 'America Server',
        serverTimezone: 'America/New_York',
        resetHour: 4, // 04:00 серверного времени
        offset: '-05:00',
        color: 'var(--electro)',
        region: 'america',
        gmtOffset: -5 // GMT-5
      }
    ];
  }

  //Обновляет переводы при смене языка
  updateLanguage(lang) {
    this.currentLang = lang;
    
    // Обновляем названия серверов на выбранном языке
    this.servers.forEach(server => {
      const translationKey = `serverTimer.server${server.key.charAt(0).toUpperCase() + server.key.slice(1)}`;
      if (this.translations[lang] && this.translations[lang][translationKey]) {
        server.name = this.translations[lang][translationKey];
      }
    });
    
    this.render();
  }

  /**
   * Правильный расчет времени сброса в UTC
   */
  calculateResetUTC(server) {
    const now = new Date();
    const nowUTC = now.getTime();
    
      // ПРОСТОЙ И ПРАВИЛЬНЫЙ РАСЧЕТ:
      // Для GMT+8 (Азия): 04:00 GMT+8 = 20:00 UTC предыдущего дня (4 - 8 = -4 → 20:00)
      // Для GMT+1 (Европа): 04:00 GMT+1 = 03:00 UTC (4 - 1 = 3)
      // Для GMT-5 (Америка): 04:00 GMT-5 = 09:00 UTC (4 - (-5) = 9)
  
    // Вычисляем час сброса в UTC
    const resetHourUTC = 4 - server.gmtOffset; // gmtOffset: +8, +1, -5
  
    // Получаем текущую дату в UTC
    const todayUTC = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      resetHourUTC,
      0, 0, 0
    ));
  
    // Если время уже прошло, добавляем 1 день
    if (todayUTC.getTime() <= nowUTC) {
      todayUTC.setUTCDate(todayUTC.getUTCDate() + 1);
    }
  
    return todayUTC;
  }

  /**
   * Получает смещение часового пояса в миллисекундах
   */
  getTimezoneOffsetMs(timezone) {
    // Создаем дату в середине дня для избежания проблем с DST
    const testDate = new Date();
    testDate.setHours(12, 0, 0, 0); // 12:00
    
    // Форматируем дату в указанном часовом поясе
    const dateInTz = new Date(testDate.toLocaleString('en-US', { timeZone: timezone }));
    
    // Форматируем такую же дату в UTC
    const dateInUTC = new Date(testDate.toISOString());
    
    // Разница в миллисекундах
    return dateInTz.getTime() - dateInUTC.getTime();
  }

  /**
   * Конвертирует UTC время в локальное время пользователя
   */
  convertUTCToLocal(utcDate) {
    const userOffsetMs = new Date().getTimezoneOffset() * 60000;
    return new Date(utcDate.getTime() + userOffsetMs);
  }

  /**
 * Вычисляет оставшееся время до сброса
 */
getTimeLeft(resetTime) {
  const now = new Date();
  const diff = resetTime - now;

  if (diff <= 0) {
    return { hours: 0, minutes: 0, totalMinutes: 0, seconds: 0 };
  }

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  const totalMinutes = hours * 60 + minutes;

  return { hours, minutes, seconds, totalMinutes };
}

  /**
   * Форматирует время для локального отображения
   */
  formatLocalTime(date) {
    return date.toLocaleTimeString(this.currentLang, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  /**
   * Получает информацию о часовом поясе пользователя
   */
  getUserTimezoneInfo() {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = new Date();
    
    // Получаем смещение в часах
    const offsetMinutes = now.getTimezoneOffset();
    const offsetHours = -offsetMinutes / 60;
    
    // Форматируем смещение как GMT
    const sign = offsetHours >= 0 ? '+' : '';
    const hours = Math.abs(Math.floor(offsetHours));
    const minutes = Math.abs(offsetMinutes % 60);
    const gmtString = `GMT${sign}${hours}${minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : ''}`;
    
    return {
      name: userTimezone,
      offset: offsetHours,
      gmt: gmtString,
      offsetMinutes: offsetMinutes
    };
  }

  /**
   * Простой и понятный расчет для отладки
   */
  debugTimeCalculation(server) {
    console.log(`=== Расчет для ${server.name} (GMT${server.offset}) ===`);
    
    // Ваш часовой пояс
    const userOffset = -new Date().getTimezoneOffset() / 60;
    console.log('Ваш GMT:', `GMT${userOffset >= 0 ? '+' : ''}${userOffset}`);
    
    // Разница между вашим и серверным часовым поясом
    const serverOffset = server.gmtOffset;
    const diffHours = userOffset - serverOffset;
    console.log('Разница:', diffHours, 'часов');
    
    // Время сброса в вашем поясе
    const localResetHour = (4 + diffHours + 24) % 24;
    console.log('Сброс у вас:', localResetHour.toString().padStart(2, '0') + ':00');
    
    // Москва GMT+3, Европа GMT+1: 4 + (3 - 1) = 6:00 ✓
    // Москва GMT+3, Азия GMT+8: 4 + (3 - 8) = -1 → 23:00 ✓
    // Москва GMT+3, Америка GMT-5: 4 + (3 - (-5)) = 12:00 ✓
  }

  /**
 * Генерирует HTML для сервера
 */
/**
 * Генерирует HTML для сервера
 */
generateServerHTML(server, showServerTime) {
  const resetUTC = this.calculateResetUTC(server);
  const { hours, minutes, totalMinutes, seconds } = this.getTimeLeft(resetUTC);
  
  const userTimezone = this.getUserTimezoneInfo();
  
  let resetTimeStr;
  let timezoneInfo = '';
  
  if (showServerTime) {
    // Показываем только время сброса (без GMT)
    resetTimeStr = '04:00'; // Просто время сброса
  } else {
    // Показываем локальное время
    const formattedTime = resetUTC.toLocaleTimeString(this.currentLang, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
    resetTimeStr = formattedTime;
    
    // Отладочная информация (можно убрать если не нужно)
    const serverOffset = server.gmtOffset;
    const diffHours = userTimezone.offset - serverOffset;
    const calculatedHour = (4 + diffHours + 24) % 24;
    
    timezoneInfo = `
      <div class="timezone-calculation">
        <small>
          04:00 GMT${server.offset} → ${formattedTime} ${userTimezone.gmt}
          <br>
          Разница: ${diffHours} ч (${calculatedHour.toString().padStart(2, '0')}:00)
        </small>
      </div>
    `;
  }

  // Определяем стиль в зависимости от оставшегося времени
  let timeClass = 'time-left';
  let statusText = '';
  let progressClass = 'normal'; 
  
  if (totalMinutes < 60) {
    timeClass = 'time-left warning';
    progressClass = 'warning';
  }
  if (totalMinutes < 30) {
    timeClass = 'time-left urgent';
    progressClass = 'urgent';
    statusText = `<div class="status-soon">${this.translations[this.currentLang]?.serverTimer?.soon || 'Скоро сброс!'}</div>`;
  }

  // Получаем переводы
  const resetTimeText = this.translations[this.currentLang]?.serverTimer?.resetTime || '{time}';
  const timeLeftText = this.translations[this.currentLang]?.serverTimer?.timeLeft || 'Осталось: {hours}ч {minutes}м';

  // ПРАВИЛЬНО РАССЧИТЫВАЕМ ПРОЦЕНТ
  // Используем оставшееся время в минутах и общее время между сбросами (24 часа = 1440 минут)
  const totalCycleMinutes = 24 * 60; // Полный цикл между сбросами
  const percentage = ((totalCycleMinutes - totalMinutes - (seconds / 60)) / totalCycleMinutes) * 100;
  const percentageRounded = Math.min(100, Math.max(0, Math.round(percentage * 10) / 10)); // Округляем до 1 знака после запятой

  return `
    <div class="server-item">
      <div class="server" style="background-color: ${server.color}"></div>
      <div class="server-info">
      <div class="server-header">
        <div class="server-name">${server.name}</div>
        <div class="server-timezone">GMT${server.offset}</div>
      </div>
      
      <div class="server-reset">
        <h1>
          ${resetTimeText.replace('{time}', resetTimeStr)}
        </h1>
        ${timezoneInfo}
      </div>
      
      <div class="${timeClass}">
        ${timeLeftText
          .replace('{hours}', hours.toString().padStart(2, '0'))
          .replace('{minutes}', minutes.toString().padStart(2, '0'))}
      </div>
      
      ${statusText}
      
      <div class="server-progress">
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill ${progressClass}" style="width: ${percentage}%">
              
            </div>
          </div>
          <div class="progress-percentage ${progressClass}">
            ${percentageRounded}%
          </div>
        </div>
        
      </div>
      </div>
    </div>
  `;
}

  /**
   * Обработчик изменения чекбокса
   */
  handleSwitchChange() {
    this.render();
  }

  /**
 * Рендерит таймер
 */
/**
 * Рендерит таймер
 */
/**
 * Рендерит таймер
 */
render() {
  if (!this.container) {
    console.warn('Контейнер для таймера серверов не найден');
    return;
  }

  const showServerTime = this.switchEl?.checked || false;
  const userTimezone = this.getUserTimezoneInfo();
  
  // Обновляем информацию о часовом поясе
  const timezoneDisplay = document.querySelector('.user-timezone-display');
  if (timezoneDisplay) {
    timezoneDisplay.textContent = `Ваш часовой пояс: ${userTimezone.name} (${userTimezone.gmt})`;
  }
  
  // Обновляем текст чекбокса
  const switchTextEl = this.switchEl ? this.switchEl.nextElementSibling : null;
  if (switchTextEl) {
    switchTextEl.textContent = showServerTime 
      ? (this.translations[this.currentLang]?.serverTimer?.showLocalTime || 'Показать локальное время') 
      : (this.translations[this.currentLang]?.serverTimer?.showServerTime || 'Показать серверное время');
  }

  // Генерируем HTML для серверов
  let html = '';
  this.servers.forEach(server => {
    html += this.generateServerHTML(server, showServerTime);
  });

  this.container.innerHTML = html;
}

  /**
   * Запускает автообновление таймера
   */
  startAutoUpdate() {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      this.render();
    }, 60000); // Каждую минуту
  }

  /**
   * Останавливает автообновление
   */
  stopAutoUpdate() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Инициализирует модуль
   */
  init() {
    if (!this.container) {
      console.error('Контейнер для серверного таймера не найден');
      return;
    }

    this.render();
    this.startAutoUpdate();

    // Обработчик переключения режима отображения времени
    if (this.switchEl) {
      this.switchEl.addEventListener('change', this.handleSwitchChange);
    }

    // Оптимизация: останавливаем таймер когда страница не видна
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopAutoUpdate();
      } else {
        this.render();
        this.startAutoUpdate();
      }
    });
  }

  /**
   * Очищает ресурсы
   */
  /**
 * Очищает ресурсы
 */
destroy() {
  this.stopAutoUpdate();
  
  // Удаляем все обработчики из контейнера
  if (this.container) {
    const switchEl = this.container.querySelector(`#${this.switchEl.id}`);
    if (switchEl) {
      switchEl.removeEventListener('change', this.handleSwitchChange);
    }
    this.container.innerHTML = '';
  }
  
  console.log('ServerTimer уничтожен');
}
}