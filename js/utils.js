let collectionsHidden = false, menuHidden = false, menuFadeTimeOut = null, collectionsFadeTimeOut = null;
const menu = document.querySelector('.menu');

export function toggleMenu() {
    if (menuHidden) {
        if (menuFadeTimeOut) {
            clearTimeout(menuFadeTimeOut);
        }
        fadeIn(menu);
        menuFadeTimeOut = setTimeout(() => {
            fadeOut(menu);
            menuHidden = true;
        }, 10000);
        menuHidden = false;
    } else {
        if (menuFadeTimeOut) {
            clearTimeout(menuFadeTimeOut);
        }
        fadeOut(menu);
        menuHidden = true;
    }
}

export function fadeInHeader(item) {
    item.classList.remove('hidden');         
    item.classList.add('fadeInHeader');
    item.addEventListener('animationend', () => {
        item.style.opacity = '0.4';
        item.classList.remove('hidden');         
        item.classList.remove('fadeInHeader');
    });
}

export function fadeOut(item) {
    item.classList.add('fadeOut');
    item.addEventListener('animationend', () => {
        item.classList.add('hidden');
        item.style.opacity = '0';
        item.classList.remove('fadeOut');
    });
}

export function fadeIn(item) {
    item.classList.remove('hidden');         
    item.classList.add('fadeIn');
    item.addEventListener('animationend', () => {
        item.style.opacity = '0.8';
        item.classList.remove('hidden');         
        item.classList.remove('fadeIn');
    });
}

export function toggleCollections() {
    console.log('Toggling collections');
    const header1 = document.querySelector('.header-1');
    const header3 = document.querySelector('.header-3');
    if (!collectionsHidden)
    {
        if (collectionsFadeTimeOut) {
            clearTimeout(collectionsFadeTimeOut);
        }
        fadeOut(header1);
        fadeOut(header3);
        collectionsHidden = true;
    } else {
        if (collectionsFadeTimeOut) {
            clearTimeout(collectionsFadeTimeOut);
        }
        fadeInHeader(header1);
        fadeInHeader(header3);
        collectionsFadeTimeOut = setTimeout(() => {
            fadeOut(header1);
            fadeOut(header3);
            collectionsHidden = true;
        }, 5000);
        collectionsHidden = false;
    }
    console.log('Collections hidden:', collectionsHidden);
}

let fading = null;
let hiding = null;

export function fadeInButtons() {
    const buttons = document.querySelectorAll('.overlay button');
    buttons.forEach(button => {
        button.classList.remove('hidden');
        button.classList.add('button-fade');
        button.addEventListener('animationend', () => button.classList.add('hidden'));
    });
}
