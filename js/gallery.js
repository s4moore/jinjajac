import {slides, currentSlide, setCurrentSlide} from './slides.js';
import {handleStart, handleEnd} from './input.js';
import {stopZooming} from '../script.js';
import { fadeInButtons } from './utils.js';
import { showOverlay } from './overlay.js';
let startX, startY, endX, endY;
export function openGallery () {
    return new Promise((resolve) => {
        document.removeEventListener('touchstart', handleStart, { passive: false });
        document.removeEventListener('mousedown', handleStart, { passive: false });
        document.removeEventListener('touchend', handleEnd, { passive: false });
        document.removeEventListener('mouseup', handleEnd, { passive: false });
        const galleryPopup = document.getElementById('gallery-popup');
        const galleryGrid = galleryPopup.querySelector('.gallery');
        galleryGrid.innerHTML = ''; // Clear previous content
    
        slides.forEach(slide => {
            const img = slide.querySelector('img').cloneNode();
            let index = Array.from(slides).indexOf(slide);
            img.addEventListener('click', () => {
                console.log('Clicked on image:', index);
                galleryPopup.classList.add('hidden');
                document.addEventListener('touchstart', handleStart, { passive: false });
                document.addEventListener('mousedown', handleStart, { passive: false });      
                document.addEventListener('touchend', handleEnd, { passive: false });
                document.addEventListener('mouseup', handleEnd, { passive: false });
                galleryPopup.removeEventListener('touchstart', handleTouchStart, { passive: true });
                galleryPopup.removeEventListener('touchmove', handleTouchMove, { passive: true });
                galleryPopup.removeEventListener('touchend', handleTouchEnd, { passive: true });
                setCurrentSlide(index);
                showOverlay();
                resolve();
            });
            galleryGrid.appendChild(img);
        });
        galleryPopup.addEventListener('touchstart', handleTouchStart, { passive: true });
        galleryPopup.addEventListener('touchmove', handleTouchMove, { passive: true });
        galleryPopup.addEventListener('touchend', handleTouchEnd, { passive: true });
        galleryPopup.classList.remove('hidden');
    });
}

function handleTouchStart(event) {
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
}

function handleTouchMove(event) {
    const touch = event.touches[0];
    endX = touch.clientX;
    endY = touch.clientY;
}

function handleTouchEnd() {
    const deltaX = endX - startX;
    const deltaY = endY - startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
            // Swipe right
            console.log('Swiped right');
            // Implement logic to show the previous slide
        } else {
            // Swipe left
            console.log('Swiped left');
            // Implement logic to show the next slide
        }
    } else {
        // Vertical swipe (optional, if needed)
        if (deltaY > 0) {
            console.log('Swiped down');
        } else {
            console.log('Swiped up');
        }
    }
}