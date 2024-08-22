let collectionsHidden = true, menuHidden = true;

const menu = document.querySelector('.menu');

export function toggleMenu() {
    if (menuHidden) {
        fadeIn(menu);
    } else {
        fadeOut(menu);
    }
    menuHidden = !menuHidden;
}

export function fadeOut(item) {
    item.classList.remove('fadeIn');
    item.classList.add('fadeOut');
    item.addEventListener('animationend', () => {
        item.style.display = 'none';
        item.classList.remove('fadeOut');
    });
}

export function fadeIn(item) {
    item.classList.remove('fadeOut');
    // item.style.opacity = '0';
    item.style.display = 'block';            
    item.classList.add('fadeIn');
    item.addEventListener('animationend', () => {
        item.classList.remove('fadeIn');
        item.style.display = 'block';
    });
}

export function toggleCollections() {
    console.log('Toggling collections');
    const header1 = document.querySelector('.header-1');
    const header3 = document.querySelector('.header-3');
    if (!collectionsHidden)
    {
        fadeOut(header1);
        fadeOut(header3);
    } else {
        fadeIn(header1);
        fadeIn(header3);
    }
    collectionsHidden = !collectionsHidden;
    console.log('Collections hidden:', collectionsHidden);
}
