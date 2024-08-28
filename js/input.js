import { showOverlay, handleClose} from './overlay.js';
import { changeCollection, currentCollection } from './collection.js';
import { prevSlide, nextSlide, getNextSlide, slides, currentSlide } from './slides.js';
import { toggleMenu, toggleCollections } from './utils.js';
import { fadeInButtons } from './utils.js';
import { fullScreen } from './fullscreen.js';


let startX, endX, startY, endY;

export function handleStart(e) {
    e.preventDefault();
    console.log('Start event target:', e.target);
    if (!e.target.closest('.overlay') && !e.target.closest('.overlay-img')
        && !e.target.closest('.carousel-slide')) {
        if (e.target.closest('#change-menu-btn') || e.target.closest('.links')) {
            e.target.classList.add('highlight2');
            e.target.addEventListener('animationend', () => {
                e.target.classList.remove('highlight2');
            });
        } else {
        e.target.classList.add('highlight');
        e.target.addEventListener('animationend', () => {
            e.target.classList.remove('highlight');
        });
    }
    }
    if (e.target.tagName.toLowerCase() === 'a' || e.target.closest('a')) {
        return;
    }
        startX = e.touches ? e.touches[0].clientX : e.clientX;
        startY = e.touches ? e.touches[0].clientY : e.clientY;
}
let collectionsHidden = true;


export function handleEnd(e) {
    const target = e.target;
    e.preventDefault();

    console.log('End event target:', target);
    // if (e.target.closest('.menu')) {
    //     return;
    // }
    if (!document.querySelector('.menu').classList.contains('hidden')
        && !document.querySelector('.menu').classList.contains('fadeOut')) {
        toggleMenu();
    }
    if (target.tagName.toLowerCase() === 'a') {
        return;
    }
    // if (target && target.closest('.overlay-buttons')) {
    //     fadeInButtons();
    //     return ;
    // }
    if (target && target.closest('.header-2')) {
        if (currentCollection !== 20) {
            console.log('Current collection:', currentCollection);
        toggleCollections();
        collectionsHidden = !collectionsHidden;
        }
        return ;
    }
    if (target && target.closest('.Concrete')) {
        changeCollection(20);
        return ;
    }
    if (target && target.closest('.Digital')) {
        changeCollection(currentCollection);
        return ;
    }
    if (target && target.closest('.header-1')) {
        // if (!collectionsHidden) {
        changeCollection(1);
        return ;
        // }
    }
    if (target && target.closest('.header-3')) {
        // if (!collectionsHidden) {
        changeCollection(-1);
        return ;
        // }
    }
    if (document.querySelector('.overlay') && document.getElementById('check-hidden-close').classList.contains('hidden')) {
        fadeInButtons();
    }


    const screenWidth = window.innerWidth;


    if (target.closest('.menu')) {
        return ;
    }
    const menu = document.querySelector('.menu');
    if (menu.style.display === 'flex' && !target.closest('.menu')) {
        toggleMenu();
        return ;
    }
    if (target && target.closest('#change-menu-btn')) {
        // if (menuToggleTimer) {
        //     clearTimeout(menuToggleTimer);
        // }
        // document.getElementById('change-menu-btn').classList.add('highlight');
        // menuToggleTimer = setTimeout(() => {
        //     document.getElementById('change-menu-btn').classList.remove('highlight');
        // }, 1000);
        console.log('Menu button clicked');
        toggleMenu();
        return ;
    }
    if (target && target.closest('.close-button')) {

            console.log('Close button clicked');
            slides[currentSlide].classList.add('hidden');
            handleClose();
            nextSlide();
            return ;
    }
    if (target && target.closest('.fullscreen-button')) {
        fullScreen();
        return ;
    }
    if (startX <= screenWidth * 0.2) {
        prevSlide();
        return;
    } else if (startX >= screenWidth * 0.8 )  {
        getNextSlide();
        return;
    }

    endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    endY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
    const xMove = endX - startX;
    const yMove = endY - startY;

    if (Math.abs(xMove) > 10 || Math.abs(yMove) > 10) {
        if (Math.abs (xMove) > Math.abs(yMove)) {
            if (startX > endX + 10) {
                prevSlide();
                return ;
            } else if (startX < endX - 10) {
                getNextSlide();
                return ;
            }
        } else if (Math.abs(yMove) > 10) {
            if (!document.querySelector('.overlay') && Math.abs(yMove) > 10) {
                if (startY > endY + 10) {
                    console.log('Swiped up');
                    changeCollection(1);
                    return ;
                } else if (startY < endY - 10) {
                    console.log('Swiped down');
                    changeCollection(-1);
                    return ;
                }
            }
        } 
    } else if (!document.querySelector('.overlay')) {
        document.querySelectorAll('.active').forEach(element => {
            element.classList.add('hidden');
            // showOverlay();
            console.log('going to overlay mode');
            const overlay = document.querySelector('.overlay');
            slides.forEach (slide => slide.classList.add('paused'));
            showOverlay();
            return ;
        });
    } 

        console.log('No action taken');



}