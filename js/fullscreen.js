import {slides, nextSlide, currentSlide} from './slides.js';
import {handleStart, handleEnd} from './input.js';
import {updateViewport, stopZooming} from '../script.js';
import { fadeInButtons } from './utils.js';

export function fullScreen () {
        
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
        document.removeEventListener('wheel', stopZooming, { passive: false });
        document.removeEventListener('touchstart', handleStart, { passive: false });
        document.removeEventListener('mousedown', handleStart, { passive: false });
        document.removeEventListener('touchend', handleEnd, { passive: false });
        document.removeEventListener('mouseup', handleEnd, { passive: false });
        const current = slides[currentSlide];
        const imageUrl = current.getAttribute('landscape');               

        const fullScreenOverlay = document.createElement('div');
        fullScreenOverlay.classList.add('fullscreen');
        fullScreenOverlay.innerHTML = `
        <div class="close-button-fullscreen"><img class="close-button-fullscreen" src="icons/Less creative close icon .png"></div>
        <div class="fullscreen">
            <img class="fullscreen-img" src="${imageUrl}">
            </div>
        </div>
    `;
    document.body.appendChild(fullScreenOverlay);
    const image = document.querySelector('.fullscreen-img');
    image.style.transform = 'scale(1)';
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

    // closeButton.addEventListener('touch', () => {
    //     console.log('Fullscreen button clicked');
    //     fullScreenOverlay.remove();
    //     updateViewport('no');
    //     document.addEventListener('touchstart', handleStart, { passive: false });
    //     document.addEventListener('mousedown', handleStart, { passive: false });      
    //     document.addEventListener('touchend', handleEnd, { passive: false });
    //     document.addEventListener('mouseup', handleEnd, { passive: false });
    //     document.addEventListener('wheel', stopZooming, { passive: false });
    //     fadeInButtons();
    //     resolve();
    // }, {passive: false});

    document.addEventListener('wheel', function(event) {
        if (event.ctrlKey) {
            event.preventDefault(); 
    
            let currentScale = 1;
            let translateX = 0;
            let translateY = 0;
            const transform = image.style.transform;
            const scaleMatch = transform.match(/scale\(([^)]+)\)/);
            const translateMatch = transform.match(/translate\(([^)]+)px, ([^)]+)px\)/);
    
            if (scaleMatch) {
                currentScale = parseFloat(scaleMatch[1]);
            }
            if (translateMatch) {
                translateX = parseFloat(translateMatch[1]);
                translateY = parseFloat(translateMatch[2]);
            }
    
            if (event.deltaY < 0) {
                currentScale += 0.1;
            } else {
                currentScale -= 0.1;
            }
    
            currentScale = Math.max(currentScale, 0.1);
            scale = currentScale;
    
            image.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
        }
    }, { passive: false });

    
    let isDragging = false;
    let initialX, initialY, startX, startY;

	window.addEventListener('touchstart', (event) => {
		if (event.target.closest('.close-button-fullscreen')) {
        console.log('Fullscreen button clicked');
        fullScreenOverlay.remove();
        updateViewport('no');
        document.addEventListener('touchstart', handleStart, { passive: false });
        document.addEventListener('mousedown', handleStart, { passive: false });      
        document.addEventListener('touchend', handleEnd, { passive: false });
        document.addEventListener('mouseup', handleEnd, { passive: false });
        document.addEventListener('wheel', stopZooming, { passive: false });
        fadeInButtons();
		return;
		}
	});

	window.addEventListener('mousedown', (event) => {
		if (event.target.closest('.close-button-fullscreen')) {
        console.log('Fullscreen button clicked');
        fullScreenOverlay.remove();
        updateViewport('no');
        document.addEventListener('touchstart', handleStart, { passive: false });
        document.addEventListener('mousedown', handleStart, { passive: false });      
        document.addEventListener('touchend', handleEnd, { passive: false });
        document.addEventListener('mouseup', handleEnd, { passive: false });
        document.addEventListener('wheel', stopZooming, { passive: false });
        fadeInButtons();
		return;
		}
	});


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
    
    image.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const dx = event.clientX - startX;
            const dy = event.clientY - startY;
            const newX = initialX + dx;
            const newY = initialY + dy;
            const currentScale = parseFloat(image.style.transform.match(/scale\(([^)]+)\)/)?.[1] || 1);
            image.style.transform = `translate(${newX}px, ${newY}px) scale(${currentScale})`;
        }
    }, { passive: false });
    
    image.addEventListener('mouseup', () => {
        isDragging = false;
    }, { passive: false });

function getDistance(touches) {
    const [touch1, touch2] = touches;
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

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

window.addEventListener('touchmove', function(event) {
	console.log('mousemove event target:', event.target);

	if (event.target.closest('.close-button-fullscreen')) {
		return ;
	}
    if (event.touches.length === 2) {
        event.preventDefault(); 
        const currentDistance = getDistance(event.touches);
        const midpoint = getMidpoint(event.touches);

        if (initialDistance === null) {
            initialDistance = currentDistance;
            initialScale = scale || 1;
            initialTouches = midpoint;
            const transform = image.style.transform.match(/translate\(([^)]+)\)/);
            if (transform) {
                const [x, y] = transform[1].split(',').map(parseFloat);
                initialTranslateX = x;
                initialTranslateY = y;
            }
        } else {
            scale = initialScale * (currentDistance / initialDistance);
            translateX = initialTranslateX + (midpoint.x - initialTouches.x);
            translateY = initialTranslateY + (midpoint.y - initialTouches.y);
            image.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
        }
    }
}, { passive: false });

window.addEventListener('touchend', function(event) {
	if (event.target.closest('.close-button-fullscreen')) {
		return ;
	}
    if (event.touches.length < 2) {
        initialDistance = null;
        initialTouches = null;
    }
});

}
