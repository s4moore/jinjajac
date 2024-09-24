import {slides, nextSlide, currentSlide} from './slides.js';
import {handleStart, handleEnd} from './input.js';
import {updateViewport, stopZooming} from '../script.js';
import { fadeInButtons } from './utils.js';

export function fullScreen () {
        
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    const current = slides[currentSlide];
    const imageUrl = current.getAttribute('Fullscreen');               
    const fullScreenOverlay = document.createElement('div');
    fullScreenOverlay.classList.add('fullscreen');
    
    fullScreenOverlay.innerHTML = `
    <div class="fullscreen">
    <div class="close-button-fullscreen"><img class="close-button-fullscreen" src="icons/Less creative close icon .png"></div>
        <img class="fullscreen-img" src="${imageUrl}">
        </div>
    </div>
    `;
    document.body.appendChild(fullScreenOverlay);
    const image = document.querySelector('.fullscreen-img');
    image.style.transform = 'scale(1)';
    const menu = document.querySelector('#change-menu-btn');
    const collectionHeader = document.querySelector('.collection-header');
    menu.classList.add('hidden');
    collectionHeader.classList.add('hidden');
    // if (fullScreenOverlay.requestFullscreen) {
    //     fullScreenOverlay.requestFullscreen();
    // } else if (fullScreenOverlay.mozRequestFullScreen) { // Firefox
    //     fullScreenOverlay.mozRequestFullScreen();
    // } else if (fullScreenOverlay.webkitRequestFullscreen) { // Chrome, Safari and Opera
    //     fullScreenOverlay.webkitRequestFullscreen();
    // } else if (fullScreenOverlay.msRequestFullscreen) { // IE/Edge
    //     fullScreenOverlay.msRequestFullscreen();
    // }
    // document.addEventListener('fullscreenchange', handleFullscreenChange);

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

	// window.addEventListener('touchstart', (event) => {
	// 	if (event.target.closest('.close-button-fullscreen')) {
    //     console.log('Fullscreen button clicked');
    //     fullScreenOverlay.remove();
    //     updateViewport('no');
    //     fadeInButtons();
	// 	// return;
	// 	}
	// });

	// window.addEventListener('mousedown', (event) => {
	// 	if (event.target.closest('.close-button-fullscreen')) {
    //     console.log('Fullscreen button clicked');
    //     fullScreenOverlay.remove();
    //     updateViewport('no');
    //     fadeInButtons();
	// 	// return;
	// 	}
	// });


    const closeButton = document.querySelector('.close-button-fullscreen');

    document.addEventListener('touchstart', handleStart);
    document.addEventListener('click', handleStart);

    function handleStart(event) {
        if (event.target.closest('.close-button-fullscreen')) {
            console.log('Fullscreen button clicked');
            handleExit();
            return;
        }
    }
    function handleExit () {
        if (!document.fullscreenElement) {
            menu.classList.remove('hidden');
            collectionHeader.classList.remove('hidden');
            translateX = 0;
            translateY = 0;
            scale = 1;
            image.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
            console.log('Exited fullscreen mode');
            fullScreenOverlay.remove();
            // updateViewport('no');
            fadeInButtons();
            return ;
        }
    }
    let initialTouch = null;
    let initialTouches = null;
    let initialTranslateX = 0;
    let initialTranslateY = 0;
    let initialDistance = null;
    let initialScale = 1;
    let isMouseDown = false;
    
    function handleMove(event) {
        // if (event.target.closest('.close-button-fullscreen')) {
        //     translateX = 0;
        //     translateY = 0;
        //     scale = 1;
        //     image.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        //     return;
        // }
    
        let clientX, clientY;
    
        if (event.type === 'touchmove') {
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
                return;
            } else {
                const touch = event.touches[0];
                clientX = touch.clientX;
                clientY = touch.clientY;
            }
        } else if (event.type === 'mousemove' && isMouseDown) {
            clientX = event.clientX;
            clientY = event.clientY;
        } else {
            return;
        }
    
        if (initialTouch === null) {
            initialTouch = { x: clientX, y: clientY };
            const transform = image.style.transform.match(/translate\(([^)]+)\)/);
            if (transform) {
                const [x, y] = transform[1].split(',').map(parseFloat);
                initialTranslateX = x;
                initialTranslateY = y;
            }
        } else {
            translateX = initialTranslateX + (clientX - initialTouch.x);
            translateY = initialTranslateY + (clientY - initialTouch.y);
            image.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        }
    }
    
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('mousemove', handleMove);
    
    window.addEventListener('mousedown', function(event) {
        // if (event.target.closest('.close-button-fullscreen')) {
        //     return;
        // }
        isMouseDown = true;
        initialTouch = { x: event.clientX, y: event.clientY };
        const transform = image.style.transform.match(/translate\(([^)]+)\)/);
        if (transform) {
            const [x, y] = transform[1].split(',').map(parseFloat);
            initialTranslateX = x;
            initialTranslateY = y;
        }
    });
    
    window.addEventListener('mouseup', function() {
        isMouseDown = false;
        initialTouch = null;
    });
    
    window.addEventListener('touchend', function(event) {
        if (event.touches.length < 2) {
            initialDistance = null;
            initialTouch = null;
        }
    });
    
    function getDistance(touches) {
        const [touch1, touch2] = touches;
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    function getMidpoint(touches) {
        const [touch1, touch2] = touches;
        return {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2
        };
    }
}