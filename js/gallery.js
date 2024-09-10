import {slides, currentSlide, setCurrentSlide} from './slides.js';
import {handleStart, handleEnd} from './input.js';
import {stopZooming} from '../script.js';
import { fadeInButtons, toggleMenu } from './utils.js';
import { showOverlay } from './overlay.js';
import { changeCollection } from './collection.js';
import { handleClose } from './overlay.js';
export let galleryHidden = true;

const menu = document.querySelector('.menu');
const galleryPopup = document.getElementById('gallery-popup');

export function closeGallery (index) {
	console.log('Clicked on image:', index);
	galleryPopup.querySelector('.gallery').classList.add('hidden');
    galleryPopup.classList.add('hidden');
	document.addEventListener('touchstart', handleStart, { passive: false });
	document.addEventListener('mousedown', handleStart, { passive: false });      
	document.addEventListener('touchend', handleEnd, { passive: false });
	document.addEventListener('mouseup', handleEnd, { passive: false });
	galleryPopup.removeEventListener('touchstart', handleTouchStart, { passive: true });
	galleryPopup.removeEventListener('touchmove', handleTouchMove, { passive: true });
	galleryPopup.removeEventListener('touchend', handleTouchEnd, { passive: true });

	galleryHidden = true;
	document.querySelector('.gallery-button').classList.remove('hidden');
    setCurrentSlide(index);
	showOverlay();
	return ;
}

export function openGallery () {
        document.removeEventListener('touchstart', handleStart, { passive: false });
        document.removeEventListener('mousedown', handleStart, { passive: false });
        document.removeEventListener('touchend', handleEnd, { passive: false });
        document.removeEventListener('mouseup', handleEnd, { passive: false });
		galleryHidden = false;
        const galleryGrid = galleryPopup.querySelector('.gallery');
		document.querySelector('.gallery-button').classList.add('hidden');
        galleryGrid.innerHTML = ''; // Clear previous content
    
        slides.forEach(slide => {
            const img = slide.querySelector('img').cloneNode();
            let index = Array.from(slides).indexOf(slide);
            img.addEventListener('click', function () {
				closeGallery(index);
			});
            galleryGrid.appendChild(img);
        });
        galleryPopup.querySelector('.gallery').classList.remove('hidden');
        galleryPopup.classList.remove('hidden');
        galleryPopup.addEventListener('touchstart', handleTouchStart, { passive: true });
        galleryPopup.addEventListener('touchmove', handleTouchMove, { passive: true });
        galleryPopup.addEventListener('touchend', handleTouchEnd, { passive: true });
        galleryPopup.classList.remove('hidden');
}

menu.addEventListener('click', handleTouchStart);
let startX, startY, currentY, lastY, velocityY, animationFrameId;

function handleTouchStart(event) {
    const target = event.target;
    if (target.closest('.Concrete')) {
        handleClose ();
        changeCollection('.Concrete');
        galleryPopup.classList.add('hidden');
        document.addEventListener('touchstart', handleStart, { passive: false });
        document.addEventListener('mousedown', handleStart, { passive: false });      
        document.addEventListener('touchend', handleEnd, { passive: false });
        document.addEventListener('mouseup', handleEnd, { passive: false });
        galleryPopup.removeEventListener('touchstart', handleTouchStart, { passive: true });
        galleryPopup.removeEventListener('touchmove', handleTouchMove, { passive: true });
        galleryPopup.removeEventListener('touchend', handleTouchEnd, { passive: true });
        return ;
    }
    if (target.closest('.Digital')) {
        changeCollection(0);
        handleClose ();
        galleryPopup.classList.add('hidden');
        document.addEventListener('touchstart', handleStart, { passive: false });
        document.addEventListener('mousedown', handleStart, { passive: false });      
        document.addEventListener('touchend', handleEnd, { passive: false });
        document.addEventListener('mouseup', handleEnd, { passive: false });
        galleryPopup.removeEventListener('touchstart', handleTouchStart, { passive: true });
        galleryPopup.removeEventListener('touchmove', handleTouchMove, { passive: true });
        galleryPopup.removeEventListener('touchend', handleTouchEnd, { passive: true });
        return ;
    }
    const touch = event;
    startX = touch.clientX;
    startY = touch.clientY;
    currentY = startY;
    lastY = startY;
    velocityY = 0;
    cancelAnimationFrame(animationFrameId); // Cancel any ongoing animation

}

function handleTouchMove(event) {
    const touch = event.touches[0];
    const galleryPopup = document.getElementById('gallery-popup');
    const galleryGrid = galleryPopup.querySelector('.gallery');
    
    const deltaY = touch.clientY - currentY;
    currentY = touch.clientY;

    galleryGrid.scrollTop -= deltaY;

    // Calculate velocity
    velocityY = currentY - lastY;
    lastY = currentY;

    // Ensure we don't scroll beyond the end of the slides
    if (galleryGrid.scrollTop < 0) {
        galleryGrid.scrollTop = 0;
    }
    if (galleryGrid.scrollTop > galleryGrid.scrollHeight - galleryGrid.clientHeight) {
        galleryGrid.scrollTop = galleryGrid.scrollHeight - galleryGrid.clientHeight;
    }
}

function handleTouchEnd() {
    const galleryPopup = document.getElementById('gallery-popup');
    const galleryGrid = galleryPopup.querySelector('.gallery');

    function decelerate() {
        galleryGrid.scrollTop -= velocityY;
        velocityY *= 0.95; // Apply friction

        // Ensure we don't scroll beyond the end of the slides
        if (galleryGrid.scrollTop < 0) {
            galleryGrid.scrollTop = 0;
            velocityY = 0;
        }
        if (galleryGrid.scrollTop > galleryGrid.scrollHeight - galleryGrid.clientHeight) {
            galleryGrid.scrollTop = galleryGrid.scrollHeight - galleryGrid.clientHeight;
            velocityY = 0;
        }

        if (Math.abs(velocityY) > 0.5) {
            animationFrameId = requestAnimationFrame(decelerate);
        }
    }

    decelerate();
}