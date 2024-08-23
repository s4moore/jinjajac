import {toggleCollections, toggleMenu} from "./js/utils.js";
import {handleStart, handleEnd} from "./js/input.js";
export let overlay = null;
import { setBackgroundVideo } from "./js/background.js";
import {changeCollection} from "./js/collection.js";

export function updateViewport(userScalable) {
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
        viewportMeta.setAttribute('content', `width=device-width, initial-scale=1.0, user-scalable=${userScalable}`);
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const carouselContainer = document.querySelector('.carousel');
    const menuItems = document.querySelector('.menu-item');
    const menuToggle = document.getElementById('change-menu-btn');
    console.log(menuItems);
    const headerUpButton = document.querySelector('.header-1');
    const headerDownButton = document.querySelector('.header-3');
    const toggleCollection = document.querySelector('.header-2-button');
    const menuArea = document.querySelector('.menu-area');
    const menu = document.querySelector('.menu');
    let collectionsHidden = true;

    toggleCollections();
    // toggleMenu();
    document.querySelector('.menu').classList.add('hidden');
    changeCollection(0);
    setBackgroundVideo();
    window.addEventListener('resize', setBackgroundVideo);

    window.addEventListener('load', function() {
        const img = document.getElementById('dynamic-img');
        const overlay = document.querySelector('.overlay');
        const overlayContent = document.querySelector('.overlay-content');
        let aspectRatio, containerWidth, containerHeight;

        function adjustImageSize() {
            if (overlay.clientWidth < overlay.clientHeight) {
             aspectRatio = img.naturalWidth / img.naturalHeight;
             containerWidth = overlay.clientWidth * 0.95;
             containerHeight = containerWidth / aspectRatio;
            } else {
                 aspectRatio = img.naturalWidth / img.naturalHeight;
                 if (screen.width > screen.height * 1.5) {
                 containerHeight = overlay.clientHeight * 0.9;
                 } else{
                    containerHeight = overlay.clientHeight * 0.7;
                 }
                 containerWidth = containerHeight * aspectRatio;
            }
            console.log('Container width:', containerWidth);
            console.log('Container height:', containerHeight);
            overlayContent.style.height = `${containerHeight}px`;
            overlayContent.style.width = `${containerWidth}px`;

        }
    
        // Adjust the image size when the image is loaded
        if (img.complete) {
            adjustImageSize();
        } else {
            img.onload = adjustImageSize;
        }
    
        // Adjust the image size on window resize
        window.addEventListener('resize', adjustImageSize);
    });

    // document.addEventListener('touchmove', function(event) {
    //     if (event.scale !== 1) {
    //         event.preventDefault();
    //     }
    // }, { passive: false });
    window.addEventListener('wheel', function(event) {
        if (event.ctrlKey) {
            event.preventDefault();
        }
    }, { passive: false });

    toggleCollection.addEventListener('click', () => {
        toggleCollections();
        collectionsHidden = !collectionsHidden;
    });

    // menuToggle.addEventListener('click', () => {
    //     console.log('Menu toggle clicked');
    //     toggleMenu();
    //     menuHidden = !menuHidden;
    // }, { passive: false });

    // menu.addEventListener('click',() => {
    //     if (menuHidden) {
    //         return ;
    //     } else {
    //         handleEnd();
    //         // menuHidden = !menuHidden;
    //     }
    // });
    headerUpButton.addEventListener('click', () => 
        {
            if (collectionsHidden) {
                handleEnd();
            } else {
            changeCollection(-1);
            }
        });
    headerDownButton.addEventListener('click', () => 
    {
        if (collectionsHidden) {
            handleEnd();
        } else {
        changeCollection(1);
        }
    });
    carouselContainer.addEventListener('touchstart', handleStart);
    carouselContainer.addEventListener('mousedown', handleStart);      
    carouselContainer.addEventListener('touchend', handleEnd);
    carouselContainer.addEventListener('mouseup', handleEnd);
    menuArea.addEventListener('touchstart', handleStart);
    menuArea.addEventListener('mousedown', handleStart);      
    menuArea.addEventListener('touchend', handleEnd);
    menuArea.addEventListener('mouseup', handleEnd);
    menu.addEventListener('touchstart', handleStart);
    menu.addEventListener('mousedown', handleStart);      
    menu.addEventListener('touchend', handleEnd);
    menu.addEventListener('mouseup', handleEnd);
});