import {slides, nextSlide, currentSlide, pauseSlides, unPauseSlides} from './slides.js';
import {handleStart, handleEnd} from './input.js';
import {stopZooming} from '../script.js';
import {toggleMenu } from './utils.js';

export function moreAbout () {
		console.log('More clicked');
		toggleMenu();
		document.querySelector('.gallery-button').classList.add('hidden');
		void document.querySelector('.menu').offsetWidth;
		document.querySelector('.menu-toggle').classList.add('hidden');
		document.querySelector('.header-2').classList.add('hidden');
		document.querySelectorAll('.active').forEach(element => {
            element.classList.add('hidden');
        });
		pauseSlides();
		document.querySelector('.more-about').classList.remove('hidden');
		document.querySelector('.more-about-fullscreen-button').classList.remove('hidden');

	    document.querySelector('.more-about-fullscreen-button').addEventListener('click', () => {
			console.log('Fullscreen button clicked');
			document.querySelector('.more-about').classList.add('hidden');
			document.querySelector('.more-about-fullscreen-button').classList.add('hidden');
            document.querySelector('.header-2').classList.remove('hidden');

			slides[currentSlide].classList.add('hidden');
			unPauseSlides();
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
        document.removeEventListener('wheel', stopZooming, { passive: false });
        document.removeEventListener('touchstart', handleStart, { passive: false });
        document.removeEventListener('mousedown', handleStart, { passive: false });
        document.removeEventListener('touchend', handleEnd, { passive: false });
        document.removeEventListener('mouseup', handleEnd, { passive: false });
}
