import {slides, nextSlide, currentSlide} from './slides.js';
import {handleStart, handleEnd} from './input.js';
import {updateViewport, stopZooming} from '../script.js';
import { setMenuHidden, toggleMenu } from './utils.js';

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
		toggleMenu();
		document.querySelector('.gallery-button').classList.add('hidden');
        // document.querySelector('.menu').classList.remove('menu-fade');
		// document.querySelector('.menu').classList.add('fadeOut');
		void document.querySelector('.menu').offsetWidth;
		// document.querySelector('.menu').addEventListener('transitionend', () => {
			
			// document.querySelector('.menu').classList.remove('fadeOut');
			// document.querySelector('.menu').classList.add('hidden');
			document.querySelector('.menu-toggle').classList.add('hidden');

		// });

		document.querySelector('.header-2').classList.add('hidden');
        setMenuHidden();

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

            document.querySelector('.header-2').classList.remove('hidden');

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
			document.querySelector('.menu-toggle').classList.remove('hidden');
			document.querySelector('.gallery-button').classList.remove('hidden');
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
}
