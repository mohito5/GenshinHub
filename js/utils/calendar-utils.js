// utils/calendar-utils.js
import { charsData } from '../characterData.js';

export function renderMiniCalendar(container, date, currentLang, showMonth = date.getMonth(), showYear = date.getFullYear()) {
    console.log('renderMiniCalendar вызвана с параметрами:', {
        container: !!container,
        date,
        currentLang,
        showMonth,
        showYear
    });
    
    if (!container) {
        console.error('Контейнер календаря не найден!');
        return;
    }

    const months = {
        ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    };

    const weekdays = {
        ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
    };

    const currentDay = date.getDate();
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();

    const daysInMonth = new Date(showYear, showMonth + 1, 0).getDate();
    const firstDayWeekday = new Date(showYear, showMonth, 1).getDay();
    const offset = (firstDayWeekday === 0) ? 6 : firstDayWeekday - 1;

    const birthdaysThisMonth = {};
    if (charsData) {
        Object.keys(charsData).forEach(key => {
            const char = charsData[key];
            if (char.date) {
                const [m, d] = char.date.split('-').map(Number);
                if (m - 1 === showMonth) {
                    birthdaysThisMonth[d] = char[`${currentLang}_name`] || char.en_name;
                }
            }
        });
    }

    let html = `
        <div class="mini-calendar">
            <div class="mini-calendar-nav">
                <button class="nav-btn prev" data-action="prev">&lt;</button>
                <div class="mini-calendar-month">${months[currentLang]?.[showMonth] || months['ru'][showMonth]} ${showYear}</div>
                <button class="nav-btn next" data-action="next">&gt;</button>
            </div>
            <div class="mini-calendar-weekdays">`;

    const weekdaysArr = weekdays[currentLang] || weekdays['ru'];
    weekdaysArr.forEach(day => {
        html += `<div class="weekday">${day}</div>`;
    });

    html += `</div><div class="mini-calendar-days">`;

    for (let i = 0; i < offset; i++) {
        html += '<div class="day empty"></div>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = (day === currentDay && showMonth === currentMonth && showYear === currentYear);
        const hasBirthday = birthdaysThisMonth[day];

        html += `
            <div class="day ${isToday ? 'today' : ''} ${hasBirthday ? 'has-birthday' : ''}"
                 title="${hasBirthday ? `ДР: ${birthdaysThisMonth[day]}` : ''}">
                ${day}
                ${hasBirthday ? '<span class="birthday-icon">🎂</span>' : ''}
            </div>`;
    }

    html += '</div></div>';

    container.innerHTML = html;

    // Добавляем обработчики событий
    setTimeout(() => {
        const prevBtn = container.querySelector('.prev');
        const nextBtn = container.querySelector('.next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                renderMiniCalendar(container, new Date(showYear, showMonth - 1, 1), currentLang);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                renderMiniCalendar(container, new Date(showYear, showMonth + 1, 1), currentLang);
            });
        }
        
        console.log('Календарь отрендерен успешно');
    }, 10);
}
