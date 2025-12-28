// Запускаем после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.cards-container');
  if (!window.charsData || !container) return;

  // Перебираем всех персонажей
  Object.entries(window.charsData).forEach(([name, data]) => {
    const article = document.createElement('article');

    // Добавляем основные классы
    article.classList.add('cardAvatar');

    // Добавляем классы по фильтрам
    if (data.element) {
      article.classList.add(`element-${data.element.toLowerCase()}`); // например, element-electro
    }
    if (data.type) {
      article.classList.add(`type-${data.type.toLowerCase()}`); // например, type-pole
    }
    if (data.rarity) {
      article.classList.add(`rarity-${data.rarity}`); // например, rarity-five
    }

    // Можно добавить еще дополнительные фильтры по нужно
    // например, по классу all
    article.classList.add('all');

    // Создаем содержимое
    // 1. Свойство data-name для фильтрации
    article.setAttribute('data-name', name);

    // 2. Создаем ссылку
    const a = document.createElement('a');
    a.href = `flins.html?name=${encodeURIComponent(name)}`;
    a.className = 'link-to-char';

    
    // 3. DIV с аватаром
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'avatar';

    const img = document.createElement('img');
    img.src = data.avatar; // или другой путь
    img.alt = name;

    avatarDiv.appendChild(img);
    a.appendChild(avatarDiv);

    // 4. Название
    const spanName = document.createElement('span');
    spanName.className = 'name';

    const pName = document.createElement('p');
    pName.textContent = name;

    spanName.appendChild(pName);
    a.appendChild(spanName);

    // Добавляем ссылку в статью
    article.appendChild(a);

    // Добавляем карточку в контейнер
    container.appendChild(article);

    
  });
});