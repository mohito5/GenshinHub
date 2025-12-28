const pages = {
    home: `
        <h1>Welcome</h1>
    
    
    
    `,
    characters: `<h1>character</h1>`
};

// Отображение страницы
function showPage(pageName) {
    const content = document.getElementById('content');
    content.innerHTML = pages[pageName] || '<h1>Error</h1>';

    //
    const pageElement = content.querySelector('.page');
    if (pageElement) {
        pageElement.classList.add('active');
    }
}

//
function handleNavigation(event) {
    if (event.target.tagName === 'A' && event.target.hasAttribute('data-page')) {
        const pageName = event.target.getAttribute('data-page');
        showPage(pageName);
        history.pushState({}, '', `#/${pageName}`);
        event.preventDefault();
    }
}

//
document.addEventListener('DOMContentLoaded', () => {
    //
    document.querySelector('nav').addEventListener('click', handleNavigation);

    //
    window.addEventListener('popstate', () => {
        const page = window.location.hash.slice(2) || 'home';
        showPage(page);
    });

    //
    const initialPage = window.location.hash.slice(2) || 'home';
    showPage(initialPage);
});