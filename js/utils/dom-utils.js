// dom-utils.js - утилиты для работы с DOM

// Создание элемента с атрибутами
export function createElement(tag, attributes = {}, innerHTML = '') {
    const element = document.createElement(tag);
    
    // Устанавливаем атрибуты
    for (const [key, value] of Object.entries(attributes)) {
        if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
        } else if (key === 'class' && Array.isArray(value)) {
            element.className = value.join(' ');
        } else {
            element.setAttribute(key, value);
        }
    }
    
    // Устанавливаем содержимое
    if (innerHTML) {
        element.innerHTML = innerHTML;
    }
    
    return element;
}

// Добавление элемента в контейнер
export function appendToContainer(container, ...elements) {
    elements.forEach(element => {
        if (element && container) {
            container.appendChild(element);
        }
    });
}

// Удаление всех дочерних элементов
export function clearContainer(container) {
    if (container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }
}

// Проверка существования элемента
export function elementExists(selector) {
    return document.querySelector(selector) !== null;
}

// Добавление обработчиков событий
export function addEventListeners(element, events) {
    if (!element) return;
    
    for (const [event, handler] of Object.entries(events)) {
        element.addEventListener(event, handler);
    }
}

// Создание кнопки с общими стилями
export function createButton(text, options = {}) {
    const {
        type = 'primary',
        size = 'medium',
        onClick = null,
        disabled = false,
        icon = null,
        additionalClasses = []
    } = options;
    
    const button = createElement('button', {
        class: ['btn', `btn-${type}`, `btn-${size}`, ...additionalClasses],
        disabled: disabled
    });
    
    let content = text;
    if (icon) {
        content = `${icon} ${text}`;
    }
    
    button.innerHTML = content;
    
    if (onClick) {
        button.addEventListener('click', onClick);
    }
    
    return button;
}

// Создание карточки
export function createCard(content, options = {}) {
    const {
        title = '',
        subtitle = '',
        image = null,
        actions = [],
        additionalClasses = []
    } = options;
    
    const card = createElement('div', {
        class: ['card', ...additionalClasses]
    });
    
    let cardContent = '';
    
    if (image) {
        cardContent += `<div class="card-image"><img src="${image}" alt="${title}"></div>`;
    }
    
    if (title) {
        cardContent += `<div class="card-title">${title}</div>`;
    }
    
    if (subtitle) {
        cardContent += `<div class="card-subtitle">${subtitle}</div>`;
    }
    
    cardContent += `<div class="card-content">${content}</div>`;
    
    if (actions.length > 0) {
        cardContent += `<div class="card-actions">${actions.join('')}</div>`;
    }
    
    card.innerHTML = cardContent;
    return card;
}

// Утилита для debounce
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Утилита для throttle
export function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}