import {slides, nextSlide, currentSlide} from './slides.js';
import {handleStart, handleEnd} from './input.js';
import {updateViewport} from '../script.js';
import { fadeInButtons } from './utils.js';

export function fullScreen () {
    return new Promise((resolve) => {
        document.removeEventListener('touchstart', handleStart, { passive: false });
        document.removeEventListener('mousedown', handleStart, { passive: false });
        document.removeEventListener('touchend', handleEnd, { passive: false });
        document.removeEventListener('mouseup', handleEnd, { passive: false });
        // updateViewport('yes');
        const current = slides[currentSlide];
        const imageUrl = current.getAttribute('landscape');               

        const fullScreenOverlay = document.createElement('div');
        fullScreenOverlay.classList.add('fullscreen');
        fullScreenOverlay.innerHTML = `
        <div class="close-button-fullscreen fixed-top-left"><img src="icons/Less creative close icon .png"></div>
        <div class="fullscreen">
            <img class="fullscreen-img" src="${imageUrl}">
            </div>
        </div>


    `;

    document.body.appendChild(fullScreenOverlay);
    // document.querySelector('.close-button').classList.remove('hidden');
    // document.querySelector('.close-button').style.opacity = '1';
    const image = document.querySelector('.fullscreen-img');
    const screen = document.querySelector('.fullscreen');
    const closeButton = document.querySelector('.close-button-fullscreen img');

    if (fullScreenOverlay.requestFullscreen) {
        fullScreenOverlay.requestFullscreen();
    } else if (fullScreenOverlay.mozRequestFullScreen) { // Firefox
        fullScreenOverlay.mozRequestFullScreen();
    } else if (fullScreenOverlay.webkitRequestFullscreen) { // Chrome, Safari and Opera
        fullScreenOverlay.webkitRequestFullscreen();
    } else if (fullScreenOverlay.msRequestFullscreen) { // IE/Edge
        fullScreenOverlay.msRequestFullscreen();
    }

    closeButton.addEventListener('click', () => {
        console.log('Fullscreen button clicked');
        fullScreenOverlay.remove();
        updateViewport('no');
        document.addEventListener('touchstart', handleStart, { passive: false });
        document.addEventListener('mousedown', handleStart, { passive: false });      
        document.addEventListener('touchend', handleEnd, { passive: false });
        document.addEventListener('mouseup', handleEnd, { passive: false });
        fadeInButtons();
        resolve();
    }, {passive: false});


    screen.addEventListener('wheel', function(event) {
        if (event.ctrlKey) {
            event.preventDefault(); // Prevent the default zoom behavior

            // Get the current scale of the image
            let scale = parseFloat(image.style.transform.replace(/[^0-9.]/g, '')) || 1;
    
            // Adjust the scale based on the wheel direction
            if (event.deltaY < 0) {
                // Wheel up - scale up
                scale += 0.1;
            } else {
                // Wheel down - scale down
                scale -= 0.1;
            }
    
            // Set the new scale with a minimum limit to prevent negative or zero scale
            scale = Math.max(scale, 0.1);
            image.style.transform = `scale(${scale})`;
        }
    }, { passive: false });

    let isDragging = false;
    let initialX, initialY;
    
    image.addEventListener('mousedown', (event) => {
        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
        const transform = image.style.transform.match(/translate\(([^)]+)\)/);
        if (transform) {
            const [x, y] = transform[1].split(',').map(val => parseFloat(val));
            initialX = x;
            initialY = y;
        } else {
            initialX = 0;
            initialY = 0;
        }
        event.preventDefault();
    }, { passive: false });
    
    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const dx = event.clientX - startX;
            const dy = event.clientY - startY;
            image.style.transform = `translate(${initialX + dx}px, ${initialY + dy}px)`;
        }
    }, { passive: false });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    }, { passive: false });
x
// Function to calculate distance between two touch points
function getDistance(touches) {
    const [touch1, touch2] = touches;
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

// Function to handle pinch zoom
let initialDistance = null;
let initialScale = 1;
let initialTouches = null;
let initialTranslateX = 0;
let initialTranslateY = 0;

function getDistance(touches) {
    const [touch1, touch2] = touches;
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

function getMidpoint(touches) {
    const [touch1, touch2] = touches;
    return {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2
    };
}

let isMoving = false;
let startX = 0;
let startY = 0;

window.addEventListener('touchmove', function(event) {
    if (event.touches.length === 2) {
        event.preventDefault(); // Prevent the default pinch behavior

        const currentDistance = getDistance(event.touches);
        const midpoint = getMidpoint(event.touches);

        if (initialDistance === null) {
            initialDistance = currentDistance;
            initialScale = parseFloat(image.style.transform.replace(/[^0-9.]/g, '')) || 1;
            initialTouches = midpoint;
            const transform = image.style.transform.match(/translate\(([^)]+)\)/);
            if (transform) {
                const [x, y] = transform[1].split(',').map(parseFloat);
                initialTranslateX = x;
                initialTranslateY = y;
            }
        } else {
            const scale = initialScale * (currentDistance / initialDistance);
            const translateX = initialTranslateX + (midpoint.x - initialTouches.x);
            const translateY = initialTranslateY + (midpoint.y - initialTouches.y);
            image.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
        }
    // } else if (event.touches.length === 1) {
    //     if (!isMoving) {
    //         isMoving = true;
    //         startX = event.touches[0].clientX;
    //         startY = event.touches[0].clientY;
    //         const transform = image.style.transform.match(/translate\(([^)]+)\)/);
    //         if (transform) {
    //             const [x, y] = transform[1].split(',').map(parseFloat);
    //             initialTranslateX = x;
    //             initialTranslateY = y;
    //         }
    //     } else {
    //         const translateX = initialTranslateX + (event.touches[0].clientX - startX);
    //         const translateY = initialTranslateY + (event.touches[0].clientY - startY);
    //         image.style.transform = `translate(${translateX}px, ${translateY}px)`;
    //     }
    }
}, { passive: false });

window.addEventListener('touchend', function(event) {
    if (event.touches.length < 2) {
        initialDistance = null;
        initialTouches = null;
    }
});

    });
}
