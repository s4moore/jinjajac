import { handleClose } from './overlay.js';
import {slides, nextSlide, currentSlide, pauseSlides, unPauseSlides} from './slides.js';
import {toggleMenu, menuFading, menuHidden } from './utils.js';
import { handleStart, handleEnd } from './input.js';

export function moreAbout () {
		console.log('More clicked');
		// document.removeEventListener('resize', setBackgroundVideo);
		// document.removeEventListener('wheel', stopZooming, { passive: false });
		document.removeEventListener('touchstart', handleStart, { passive: false });
		document.removeEventListener('mousedown', handleStart, { passive: false });      
		document.removeEventListener('touchend', handleEnd, { passive: false });
		document.removeEventListener('mouseup', handleEnd, { passive: false });
		document.querySelector('.menu').classList.add('hidden');
		document.querySelector('.close-button-fullscreen').classList.remove('hidden');
		document.querySelector('.gallery-button').classList.add('hidden');
		void document.querySelector('.menu').offsetWidth;
		document.querySelector('.menu-toggle').classList.add('hidden');
		document.querySelector('.collection-header').classList.add('hidden');
		document.querySelectorAll('.active').forEach(element => {
            element.classList.add('hidden');
			element.classList.remove('active');
        });
		pauseSlides();
		document.querySelector('.more-about').classList.remove('hidden');
		document.querySelector('.close-button-fullscreen').classList.remove('hidden');

	    document.querySelector('.close-button-fullscreen').addEventListener('click', () => {
			console.log('Fullscreen button clicked');
			document.querySelector('.close-button-fullscreen').classList.add('hidden');

			document.querySelector('.more-about').classList.add('hidden');
            document.querySelector('.collection-header').classList.remove('hidden');

			slides[currentSlide].classList.add('hidden');
			handleClose();
			unPauseSlides();
			document.querySelector('.menu-toggle').classList.remove('hidden');
			console.log('unhide gallery button');
			document.querySelector('.gallery-button').classList.remove('hidden');
			nextSlide();
			// document.addEventListener('resize', setBackgroundVideo);
			// document.addEventListener('wheel', stopZooming, { passive: false });
			document.addEventListener('touchstart', handleStart, { passive: false });
			document.addEventListener('mousedown', handleStart, { passive: false });      
			document.addEventListener('touchend', handleEnd, { passive: false });
			document.addEventListener('mouseup', handleEnd, { passive: false });
			return ;
		});
}
