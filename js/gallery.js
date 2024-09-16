import {slides, fetchSlides, setCurrentSlide, pauseSlides} from './slides.js';
import { showOverlay } from './overlay.js';
import { changeCollection, currentCollection } from './collection.js';
import { handleClose } from './overlay.js';

export let galleryHidden = true;

const menu = document.querySelector('.menu');
const galleryPopup = document.getElementById('gallery-popup');

export function closeGallery (index) {
	console.log('Clicked on image:', index);
	galleryPopup.querySelector('.gallery').classList.add('hidden');
    galleryPopup.classList.add('hidden');
	// document.addEventListener('touchstart', handleStart, { passive: false });
	// document.addEventListener('mousedown', handleStart, { passive: false });      
	// document.addEventListener('touchend', handleEnd, { passive: false });
	// document.addEventListener('mouseup', handleEnd, { passive: false });
	// galleryPopup.removeEventListener('touchstart', handleTouchStart, { passive: true });
	// galleryPopup.removeEventListener('touchmove', handleTouchMove, { passive: true });
	// galleryPopup.removeEventListener('touchend', handleTouchEnd, { passive: true });

	galleryHidden = true;
	document.querySelector('.collection-header').classList.remove('top-left');
	document.querySelector('.gallery-button').classList.remove('hidden');
	console.log('Index:', index);
	if (index !== undefined)
	{
		setCurrentSlide(index);
		showOverlay();
	}
	return ;
}

export async function updateGallery () {
	console.log('Updating gallery');
	const galleryGrid = galleryPopup.querySelector('.gallery');
	galleryGrid.addEventListener('click', (event) => {
		if (event.target.matches('.gallery-img')) {
			const img = event.target;
			const index = Array.from(document.querySelectorAll('.gallery-img')).indexOf(img);
			console.log('Clicked on image:', index);
			closeGallery(index);
		}
	}, { passive: false });
	galleryGrid.innerHTML = ''; // Clear previous content
	await fetchSlides(currentCollection);
	console.log('Updating gallery 2');
	slides.forEach(slide => {
		const img = slide.querySelector('img').cloneNode();
		let index = Array.from(slides).indexOf(slide);
		img.addEventListener('click', (event) => {
			console.log('Clicked on image:', index);
			console.log('Clicked on image:', index);
			closeGallery(index);
		}, { passive: false });
		img.classList.add('gallery-img');
		galleryGrid.appendChild(img);
	});
}

export function openGallery () {
        // document.removeEventListener('touchstart', handleStart, { passive: false });
        // document.removeEventListener('mousedown', handleStart, { passive: false });
        // document.removeEventListener('touchend', handleEnd, { passive: false });
        // document.removeEventListener('mouseup', handleEnd, { passive: false });
		// document.querySelectorAll('.active').forEach(element => {
        //     element.classList.add('hidden');
        //     console.log('going to overlay mode');
        //     slides.forEach (slide => slide.classList.add('paused'));
		// });
		console.log('Opening gallery');
		pauseSlides();
		galleryHidden = false;
        const galleryGrid = galleryPopup.querySelector('.gallery');
		galleryGrid.addEventListener('click', (event) => {
			if (event.target.matches('.gallery-img')) {
				const img = event.target;
				const index = Array.from(document.querySelectorAll('.gallery-img')).indexOf(img);
				console.log('Clicked on image:', index);
				closeGallery(index);
			}
		}, { passive: false });
		document.querySelector('.gallery-button').classList.add('hidden');
        galleryGrid.innerHTML = ''; // Clear previous content
		document.querySelector('.collection-header').classList.add('top-left');
        slides.forEach(slide => {
            const img = slide.querySelector('img').cloneNode();
            let index = Array.from(slides).indexOf(slide);
			img.addEventListener('click', (event) => {
				console.log('Clicked on image:', index);
				closeGallery(index);
			}, { passive: false });
			img.classList.add('gallery-img');
            galleryGrid.appendChild(img);
        });
		document.querySelector('.gallery-popup-content').addEventListener('click', (event) => {
			const img = event.target.closest('img');
			if (img && img.parentElement.classList.contains('slide')) {
				const index = Array.from(slides).indexOf(img.parentElement);
				console.log('Clicked on image:', index);
				closeGallery(index);
			}
		});
        galleryPopup.querySelector('.gallery').classList.remove('hidden');
        galleryPopup.classList.remove('hidden');
        // galleryPopup.addEventListener('touchstart', handleTouchStart, { passive: true });
        // galleryPopup.addEventListener('touchmove', handleTouchMove, { passive: true });
        // galleryPopup.addEventListener('touchend', handleTouchEnd, { passive: true });
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
        // document.addEventListener('touchstart', handleStart, { passive: false });
        // document.addEventListener('mousedown', handleStart, { passive: false });      
        // document.addEventListener('touchend', handleEnd, { passive: false });
        // document.addEventListener('mouseup', handleEnd, { passive: false });
        // galleryPopup.removeEventListener('touchstart', handleTouchStart, { passive: true });
        // galleryPopup.removeEventListener('touchmove', handleTouchMove, { passive: true });
        // galleryPopup.removeEventListener('touchend', handleTouchEnd, { passive: true });
        return ;
    }
    if (target.closest('.Digital')) {
        changeCollection(0);
        handleClose ();
        galleryPopup.classList.add('hidden');
        // document.addEventListener('touchstart', handleStart, { passive: false });
        // document.addEventListener('mousedown', handleStart, { passive: false });      
        // document.addEventListener('touchend', handleEnd, { passive: false });
        // document.addEventListener('mouseup', handleEnd, { passive: false });
        // galleryPopup.removeEventListener('touchstart', handleTouchStart, { passive: true });
        // galleryPopup.removeEventListener('touchmove', handleTouchMove, { passive: true });
        // galleryPopup.removeEventListener('touchend', handleTouchEnd, { passive: true });
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

// function handleTouchMove(event) {
//     const touch = event.touches[0];
//     const galleryPopup = document.getElementById('gallery-popup');
//     const galleryGrid = galleryPopup.querySelector('.gallery');
    
//     const deltaY = touch.clientY - currentY;
//     currentY = touch.clientY;

//     galleryGrid.scrollTop -= deltaY;

//     // Calculate velocity
//     velocityY = currentY - lastY;
//     lastY = currentY;

//     // Ensure we don't scroll beyond the end of the slides
//     if (galleryGrid.scrollTop < 0) {
//         galleryGrid.scrollTop = 0;
//     }
//     if (galleryGrid.scrollTop > galleryGrid.scrollHeight - galleryGrid.clientHeight) {
//         galleryGrid.scrollTop = galleryGrid.scrollHeight - galleryGrid.clientHeight;
//     }
// }

// function handleTouchEnd() {
//     const galleryPopup = document.getElementById('gallery-popup');
//     const galleryGrid = galleryPopup.querySelector('.gallery');

//     function decelerate() {
//         galleryGrid.scrollTop -= velocityY;
//         velocityY *= 0.95; // Apply friction

//         // Ensure we don't scroll beyond the end of the slides
//         if (galleryGrid.scrollTop < 0) {
//             galleryGrid.scrollTop = 0;
//             velocityY = 0;
//         }
//         if (galleryGrid.scrollTop > galleryGrid.scrollHeight - galleryGrid.clientHeight) {
//             galleryGrid.scrollTop = galleryGrid.scrollHeight - galleryGrid.clientHeight;
//             velocityY = 0;
//         }

//         if (Math.abs(velocityY) > 0.5) {
//             animationFrameId = requestAnimationFrame(decelerate);
//         }
//     }

//     decelerate();
// }