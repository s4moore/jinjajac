import {slides, currentSlide, setCurrentSlide} from './slides.js';
import {handleStart, handleEnd} from './input.js';
import {stopZooming} from '../script.js';
import { fadeInButtons } from './utils.js';
import { showOverlay } from './overlay.js';

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
                setCurrentSlide(index);
                showOverlay();
                resolve();
            });
            galleryGrid.appendChild(img);
        });
    
        galleryPopup.classList.remove('hidden');
    });
}