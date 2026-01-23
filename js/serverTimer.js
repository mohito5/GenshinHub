// serverTimer.js - с динамической локализацией под вашу разметку
export class ServerTimer {
  constructor({ containerId, switchId, translations, currentLang }) {
    this.container = document.getElementById(containerId);
    this.switchEl = document.getElementById(switchId);
    this.translations = translations;
    this.currentLang = currentLang || 'ru';
    this.intervalId = null;
    this.handleSwitchChange = this.handleSwitchChange.bind(this);

    // Данные серверов Genshin Impact
    this.servers = this.initializeServers();
  }

  // Инициализирует данные серверов
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

  // Обновляет переводы при смене языка
  updateLanguage(lang) {
    this.currentLang = lang;
    console.log('ServerTimer: обновление языка на', lang);
    
    // Обновляем названия серверов на выбранном языке
    this.servers.forEach(server => {
      const translationKey = `serverTimer.server${server.key.charAt(0).toUpperCase() + server.key.slice(1)}`;
      const translationsObj = this.translations[lang] || this.translations['ru'];
      
      if (translationsObj && translationsObj[translationKey]) {
        server.name = translationsObj[translationKey];
      } else {
        // Запасные варианты
        const defaultNames = {
          'asia': lang === 'ru' ? 'Азиатский сервер' : 'Asia Server',
          'europe': lang === 'ru' ? 'Европейский сервер' : 'Europe Server',
          'america': lang === 'ru' ? 'Американский сервер' : 'America Server'
        };
        server.name = defaultNames[server.key] || server.key;
      }
    });
    
    this.render();
  }

  // ПРАВИЛЬНЫЙ расчет времени сброса
  calculateNextReset(server) {
    const now = new Date();
    
    // Получаем GMT пользователя
    const userOffset = -now.getTimezoneOffset() / 60;
    
    // Разница между часовым поясом пользователя и сервера
    const timezoneDiff = userOffset - server.gmtOffset;
    
    // Время сброса в поясе пользователя: 04:00 + разница
    let userResetHour = 4 + timezoneDiff;
    
    // Нормализуем время (0-23)
    if (userResetHour < 0) {
      userResetHour += 24;
    } else if (userResetHour >= 24) {
      userResetHour -= 24;
    }
    
    // Создаем объект Date для следующего сброса
    const nextReset = new Date();
    nextReset.setHours(userResetHour, 0, 0, 0);
    
    // Если время сброса уже прошло сегодня, добавляем 1 день
    if (nextReset.getTime() <= now.getTime()) {
      nextReset.setDate(nextReset.getDate() + 1);
    }
    
    return nextReset;
  }

  // Вычисляет оставшееся время до сброса
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

  // Получает информацию о часовом поясе пользователя
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

  // Генерирует HTML для сервера с динамической локализацией
  generateServerHTML(server, showServerTime) {
    const nextReset = this.calculateNextReset(server);
    const { hours, minutes, totalMinutes, seconds } = this.getTimeLeft(nextReset);
    
    const userTimezone = this.getUserTimezoneInfo();
    
    // Получаем переводы для текущего языка
    const t = this.translations[this.currentLang] || this.translations['ru'];
    
    let resetTimeStr;
    let timezoneInfo = '';
    
    if (showServerTime) {
      // Показываем только время сброса (без GMT)
      resetTimeStr = '04:00'; // Просто время сброса
    } else {
      // Показываем локальное время
      const formattedTime = nextReset.toLocaleTimeString(this.currentLang, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      resetTimeStr = formattedTime;
      
      // Отладочная информация
      const serverOffset = server.gmtOffset;
      const diffHours = userTimezone.offset - serverOffset;
      const calculatedHour = (4 + diffHours + 24) % 24;
      
      timezoneInfo = `
        <div class="timezone-calculation">
          <small>
            04:00 GMT${server.offset} → ${formattedTime} ${userTimezone.gmt}
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
      const soonText = t.serverTimer?.soon || 'Скоро сброс!';
      statusText = `<p class="status-soon">${soonText}</p>`;
    }

    // Получаем перевод для "Осталось"
    const timeLeftText = t.serverTimer?.timeLeft || 'Осталось: {hours}ч {minutes}м';

    // ПРАВИЛЬНО РАССЧИТЫВАЕМ ПРОЦЕНТ
    const totalCycleMinutes = 24 * 60; // Полный цикл между сбросами
    const percentage = ((totalCycleMinutes - totalMinutes - (seconds / 60)) / totalCycleMinutes) * 100;
    const percentageRounded = Math.min(100, Math.max(0, Math.round(percentage * 10) / 10));

    // ВАША ОРИГИНАЛЬНАЯ РАЗМЕТКА с динамическими переводами
    return `
      <div class="server-item pad-3 br-r4">
        <div class="server" style="background-color: ${server.color}"></div>
        <div class="server-info">
          <div class="server-header">
            <div class="server-name"><h4>${server.name}</h4></div>
            <div class="server-timezone"><p>GMT${server.offset}</p></div>
          </div>
          
          <div class="server-reset">
            <h1>${resetTimeStr}</h1>
            ${timezoneInfo}
          </div>
          
          <div class="${timeClass}">
            <h4>
              ${timeLeftText
                .replace('{hours}', hours.toString().padStart(2, '0'))
                .replace('{minutes}', minutes.toString().padStart(2, '0'))}
            </h4>
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

  // Обработчик изменения чекбокса
  handleSwitchChange() {
    this.render();
  }

  // Рендерит таймер с динамической локализацией
  render() {
    if (!this.container) {
      console.warn('Контейнер для таймера серверов не найден');
      return;
    }

    const showServerTime = this.switchEl?.checked || false;
    const userTimezone = this.getUserTimezoneInfo();
    
    // Обновляем информацию о часовом поясе с локализацией
    const timezoneDisplay = document.querySelector('.user-timezone-display');
    if (timezoneDisplay) {
      const t = this.translations[this.currentLang] || this.translations['ru'];
      const timezoneText = t.serverTimer?.yourTimezone || 'Ваш часовой пояс';
      timezoneDisplay.textContent = `${timezoneText}: ${userTimezone.name} (${userTimezone.gmt})`;
    }
    
    // Обновляем текст чекбокса с динамической локализацией
    const switchTextEl = this.switchEl ? this.switchEl.nextElementSibling : null;
    if (switchTextEl) {
      const t = this.translations[this.currentLang] || this.translations['ru'];
      switchTextEl.textContent = showServerTime 
        ? (t.serverTimer?.showLocalTime || 'Показать локальное время') 
        : (t.serverTimer?.showServerTime || 'Показать серверное время');
    }

    // Генерируем HTML для серверов
    let html = '';
    this.servers.forEach(server => {
      html += this.generateServerHTML(server, showServerTime);
    });

    this.container.innerHTML = html;
  }

  // Запускает автообновление таймера
  startAutoUpdate() {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      this.render();
    }, 1000); // Обновляем каждую секунду
  }

  // Останавливает автообновление
  stopAutoUpdate() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Инициализирует модуль
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

    // Добавляем слушатель события смены языка
    document.addEventListener('languageChanged', (e) => {
      const newLang = e.detail.lang;
      this.updateLanguage(newLang);
    });
  }

  // Очищает ресурсы
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
    
    // Удаляем слушатель события смены языка
    document.removeEventListener('languageChanged', this.updateLanguage);
    
    console.log('ServerTimer уничтожен');
  }
}