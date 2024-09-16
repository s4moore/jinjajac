import {slides, nextSlide, currentSlide, pauseSlides, unPauseSlides} from './slides.js';
import {toggleMenu } from './utils.js';

export function moreAbout () {
		console.log('More clicked');
		toggleMenu();
		document.querySelector('.gallery-button').classList.add('hidden');
		void document.querySelector('.menu').offsetWidth;
		document.querySelector('.menu-toggle').classList.add('hidden');
		document.querySelector('.collection-header').classList.add('hidden');
		document.querySelectorAll('.active').forEach(element => {
            element.classList.add('hidden');
        });
		pauseSlides();
		document.querySelector('.more-about').classList.remove('hidden');
		document.querySelector('.close-button-fullscreen').classList.remove('hidden');

	    document.querySelector('.close-button-fullscreen').addEventListener('click', () => {
			console.log('Fullscreen button clicked');
			document.querySelector('.more-about').classList.add('hidden');
			document.querySelector('.more-about-fullscreen-button').classList.add('hidden');
            document.querySelector('.collection-header').classList.remove('hidden');

			slides[currentSlide].classList.add('hidden');
			unPauseSlides();
			document.querySelector('.menu-toggle').classList.remove('hidden');
			console.log('unhide gallery button');
			document.querySelector('.gallery-button').classList.remove('hidden');
			nextSlide();
			return ;
		});
}
