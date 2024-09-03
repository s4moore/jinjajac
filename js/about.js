import {slides, nextSlide, currentSlide} from './slides.js';
import {handleStart, handleEnd} from './input.js';
import {updateViewport, stopZooming} from '../script.js';
import { fadeInButtons } from './utils.js';

function aboutZoom(event) {
	if (event.ctrlKey) {
    event.preventDefault(); // Prevent the default scroll behavior

    const content = document.querySelector('.more-about-content');
    let width = content.clientWidth;

    // Adjust the width based on the wheel direction
    if (event.deltaY < 0) {
        // Wheel scrolled up, increase width
        width += 10; // Adjust the increment value as needed
    } else {
        // Wheel scrolled down, decrease width
        width -= 10; // Adjust the decrement value as needed
    }

    // Set the new width, ensuring it doesn't go below a minimum value
    content.style.width = `${Math.max(width, 100)}px`; // Minimum width of 100px
}
}

export function moreAbout () {
		// updateViewport('yes');
		console.log('More clicked');
		document.querySelectorAll('.active').forEach(element => {
            element.classList.add('hidden');
            // showOverlay();
            console.log('going to overlay mode');
            const overlay = document.querySelector('.overlay');
            slides.forEach (slide => slide.classList.add('paused'));
            // showOverlay();
            // return ;
        });
		document.querySelector('.more-about').classList.remove('hidden');
		document.querySelector('.more-about-fullscreen-button').classList.remove('hidden');

	    document.querySelector('.more-about-fullscreen-button').addEventListener('click', () => {
			console.log('Fullscreen button clicked');
			document.querySelector('.more-about').classList.add('hidden');
			document.querySelector('.more-about-fullscreen-button').classList.add('hidden');
			slides[currentSlide].classList.add('hidden');
			slides.forEach( (slide) => {
				slide.classList.add('hidden');
				slide.classList.remove('paused');
			});
			document.addEventListener('wheel', stopZooming, { passive: false });
			document.addEventListener('touchstart', handleStart, { passive: false });
			document.addEventListener('mousedown', handleStart, { passive: false });
			document.addEventListener('touchend', handleEnd, { passive: false });
			document.addEventListener('mouseup', handleEnd, { passive: false });
			nextSlide();
			return ;
		});
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
        document.removeEventListener('wheel', stopZooming, { passive: false });
        document.removeEventListener('touchstart', handleStart, { passive: false });
        document.removeEventListener('mousedown', handleStart, { passive: false });
        document.removeEventListener('touchend', handleEnd, { passive: false });
        document.removeEventListener('mouseup', handleEnd, { passive: false });
		// document.addEventListener('wheel', aboutZoom, { passive: false });
    // const image = document.querySelector('.fullscreen-img');
    // image.style.transform = 'scale(1)';
    // const screen = document.querySelector('.fullscreen');
    // const closeButton = document.querySelector('.close-button-fullscreen img');


    // closeButton.addEventListener('click', () => {
    //     console.log('Fullscreen button clicked');
    //     fullScreenOverlay.remove();
    //     updateViewport('no');
    //     document.addEventListener('touchstart', handleStart, { passive: false });
    //     document.addEventListener('mousedown', handleStart, { passive: false });      
    //     document.addEventListener('touchend', handleEnd, { passive: false });
    //     document.addEventListener('mouseup', handleEnd, { passive: false });
    //     // document.addEventListener('wheel', stopZooming, { passive: false });
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
            const newX = initialX + dx;
            const newY = initialY + dy;
            const currentScale = parseFloat(image.style.transform.match(/scale\(([^)]+)\)/)?.[1] || 1);
            image.style.transform = `translate(${newX}px, ${newY}px) scale(${currentScale})`;
        }
    }, { passive: false });
    
    document.addEventListener('mouseup', () => {
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

document.addEventListener('touchmove', function(event) {
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

document.addEventListener('touchend', function(event) {
    if (event.touches.length < 2) {
        initialDistance = null;
        initialTouches = null;
    }
});

}
