import {toggleCollections, toggleMenu} from "./js/utils.js";
import {handleStart, handleEnd} from "./js/input.js";
export let overlay = null;
import { setBackgroundVideo } from "./js/background.js";
import {changeCollection} from "./js/collection.js";
import { getNextSlide } from "./js/slides.js";

export function stopZooming(event) {
    if (event.ctrlKey) {
        event.preventDefault();
}
}

export function updateViewport(userScalable) {
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
        viewportMeta.setAttribute('content', `width=device-width, initial-scale=1.0, user-scalable=${userScalable}`);
    }
}

toggleMenu();
document.addEventListener('DOMContentLoaded', () => {

    const carouselContainer = document.querySelector('.carousel');
    const menuItems = document.querySelector('.menu-item');
    const menuToggle = document.getElementById('change-menu-btn');
    console.log(menuItems);
    const headerUpButton = document.querySelector('.header-1');
    const headerDownButton = document.querySelector('.header-3');
    const menuArea = document.querySelector('.menu-area');
    const menu = document.querySelector('.menu');

    headerUpButton.classList.add('hidden');
    headerDownButton.classList.add('hidden');
    // toggleCollections();

    // document.querySelector('.menu').classList.add('hidden');
    changeCollection(0);
    setBackgroundVideo();
    window.addEventListener('resize', setBackgroundVideo);


    // document.addEventListener('touchmove', function(event) {
    //     if (event.scale !== 1) {
    //         event.preventDefault();
    //     }
    // }, { passive: false });


    window.addEventListener('wheel', stopZooming, { passive: false });

    document.addEventListener('touchmove', function(event) {
        event.preventDefault();
        if (event.touches.length === 2) {
            // Handle two-finger swipe
            // console.log('Two-finger swipe detected');
            // Add your custom logic here
        }
    }, { passive: false });

    // document.addEventListener('pointermove', function(event) {
    //     event.preventDefault();
    //     // if (event.pointerType === 'touch') {
    //         // Handle two-finger swipe
    //         console.log('Two-finger swipe detected');
    //         // Add your custom logic here
    //         getNextSlide();
    //     // }
    // }, { passive: false });

    document.addEventListener('touchstart', handleStart, { passive: false });
    document.addEventListener('mousedown', handleStart, { passive: false });      
    document.addEventListener('touchend', handleEnd, { passive: false });
    document.addEventListener('mouseup', handleEnd, { passive: false });
});