let collectionsHidden = true, menuHidden = false, menuFadeTimeOut = null, collectionsFadeTimeOut = null;
const menu = document.querySelector('.menu');

export function toggleMenu() {
    if (menuHidden) {
        // if (menuFadeTimeOut) {
        //     clearTimeout(menuFadeTimeOut);
        // }
        menu.style.opacity = '0.8';
        fadeIn(menu);
        menuHidden = false;
        menuFadeTimeOut = setTimeout(() => {
            fadeOut(menu);
            menuHidden = true;
            menuFadeTimeOut = null;
        }, 5000);

    } else {
        if (menuFadeTimeOut) {
            clearTimeout(menuFadeTimeOut);
            menuFadeTimeOut = null;
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
const header1 = document.querySelector('.header-1');
const header3 = document.querySelector('.header-3');
function onAnimationEnd() {
    header1.classList.add('hidden');
    header1.classList.remove('fadeCollections');
    header3.classList.add('hidden');
    header3.classList.remove('fadeCollections');
    collectionsHidden = true;
}

export function toggleCollections() {

    if (collectionsHidden)
    {
        header1.removeEventListener('animationend', onAnimationEnd);

        header1.classList.remove('hidden');
        header3.classList.remove('hidden');
        header1.classList.remove('fadeOut');
        header3.classList.remove('fadeOut');
        header1.style.opacity = '0';
        header3.style.opacity = '0';
        header1.classList.add('fadeCollections');
        header3.classList.add('fadeCollections');
        collectionsHidden = false;
        header1.addEventListener('animationend', onAnimationEnd);
    } else {
        header1.style.opacity = '1';
        header3.style.opacity = '1';
        header1.removeEventListener('animationend', onAnimationEnd);
        header1.classList.remove('fadeCollections');
        header3.classList.remove('fadeCollections');
        header1.classList.add('fadeOut');
        header3.classList.add('fadeOut');
        header1.addEventListener('animationend', onAnimationEnd);
    }
}
// export function toggleCollections() {
//     console.log('Toggling collections');
//     const header1 = document.querySelector('.header-1');
//     const header3 = document.querySelector('.header-3');
//     if (!collectionsHidden)
//     {
//         if (collectionsFadeTimeOut) {
//             clearTimeout(collectionsFadeTimeOut);
//         }
//         fadeOut(header1);
//         fadeOut(header3);
//         collectionsHidden = true;
//     } else {
//         if (collectionsFadeTimeOut) {
//             clearTimeout(collectionsFadeTimeOut);
//         }
//         fadeInHeader(header1);
//         fadeInHeader(header3);
//         collectionsFadeTimeOut = setTimeout(() => {
//             fadeOut(header1);
//             fadeOut(header3);
//             collectionsHidden = true;
//             collectionsFadeTimeOut = null;
//         }, 5000);
//         collectionsHidden = false;
//     }
//     console.log('Collections hidden:', collectionsHidden);
// }

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
