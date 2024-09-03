import {toggleMenu} from "./js/utils.js";
import {handleStart, handleEnd} from "./js/input.js";
import { setBackgroundVideo } from "./js/background.js";
import {changeCollection} from "./js/collection.js";
import { handleClose } from "./js/overlay.js";

export let overlay = null;

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

function setVar(variable, value) {
    document.documentElement.style.setProperty(variable, value);
}


// toggleMenu();
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.gallery-button').classList.remove('hidden');
    document.querySelector('.menu-toggle').classList.remove('hidden');
    document.querySelector('.header-2').classList.remove('hidden');

    const headerUpButton = document.querySelector('.header-1');
    const headerDownButton = document.querySelector('.header-3');
    const menuButton = document.querySelector('.menu-toggle');
    if (!menuButton) {
        console.error('menuButton element not found');
        return;
    }	
	menuButton.addEventListener('click', () => {
        console.log('menuButton clicked');
        toggleMenu();
    }, { passive: false });
    headerUpButton.classList.add('hidden');
    headerDownButton.classList.add('hidden');

    changeCollection(0);
    setBackgroundVideo();

    document.addEventListener('resize', setBackgroundVideo);
    document.addEventListener('wheel', stopZooming, { passive: false });
    document.addEventListener('touchmove', function(event) {
        event.preventDefault();
    }, { passive: false });

	document.addEventListener('touchstart', handleStart, { passive: false });
    document.addEventListener('mousedown', handleStart, { passive: false });      
    document.addEventListener('touchend', handleEnd, { passive: false });
    document.addEventListener('mouseup', handleEnd, { passive: false });
});