import { overlay } from '../script.js';
import { collection } from './collection.js';
import {updateOverlayImage} from './overlay.js';
import { galleryHidden } from './gallery.js';
export let slides =[];
export var currentSlide = 0;

export function setCurrentSlide(index) {
    currentSlide = index;
}

export function pauseSlides() {
	slides.forEach(slide => {
		slide.classList.add('paused');
		slide.classList.add('hidden');
	});
}

export function unPauseSlides() {
	slides.forEach( (slide) => {
		slide.classList.remove('paused');
	});
}

const loadingOverlay = document.getElementById('loading-overlay');

export async function createSlides(data) {
    const carousel = document.querySelector('.carousel');
        if (carousel.firstChild){
        while (carousel.firstChild) {
            carousel.removeChild(carousel.firstChild);
        }}
        slides = []; 
        data.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.classList.add('carousel-slide');
            slide.classList.add('hidden');
            slide.innerHTML = `
            <img src="../collections/${collection}/Swish/${image.src}" alt="Image ${index + 1}">
            `;
            slide.setAttribute('data-caption', image.caption || '');
            slide.setAttribute('data-blurb', image.blurb || '');
            slide.setAttribute('Popup', `../collections/${collection}/Pop up/${image.src}`);
            slide.setAttribute('Fullscreen', `../collections/${collection}/Fullscreen/${image.src}`);
            carousel.appendChild(slide);
            slides.push(slide);
        });
    slides = document.querySelectorAll('.carousel-slide');
}

export async function fetchSlides(collection) {
	console.log('Fetching slides for collection:', collection);
	try {
	const response = await fetch(`../collections/${collection}.json`)
	const data = await response.json();
    await createSlides(data);
	loadingOverlay.classList.add('hidden');
	} catch (error) {
		console.error('Error fetching slides:', error);
	}
}

export function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    slides.forEach((slide, i) => {
        if (index === i) {
            slide.classList.add('active');
            slide.classList.remove('hidden', 'disolve', 'paused');
            slide.addEventListener('animationend', expandDone);
            // captionElement.textContent = `${edition} ${images[index].caption}`;
        }
    });
}

function expandDone(event) {
    const slide = event.target;
    slide.removeEventListener('animationend', expandDone);
    slide.classList.remove('active');
    slide.classList.add('disolve');
    slide.addEventListener('animationend', disolveDone);
    nextSlide();
}

function disolveDone(event) {
    const slide = event.target;
    slide.removeEventListener('animationend', disolveDone);
    slide.classList.add('hidden');
    slide.classList.remove('disolve');
}

function adjustCarouselSize() {
    const carousel = document.querySelector('.carousel');
    const activeSlide = document.querySelector('.carousel-slide:not(.hidden) img');
    if (activeSlide) {
        activeSlide.onload = () => {
            carousel.style.width = `${activeSlide.naturalWidth}px`;
            carousel.style.height = `${activeSlide.naturalHeight}px`;
        };
    }
}

export function nextSlide() {
    const activeSlides = document.querySelectorAll('.carousel-slide.active');
    activeSlides.forEach(activeSlide => {
        if (activeSlide && !document.querySelector('.overlay')) {
            activeSlide.classList.remove('active', 'disolve');
            activeSlide.classList.add('hidden');
        }
    });
    currentSlide = (currentSlide + 1) % slides.length;
	adjustCarouselSize();
	slides[currentSlide].classList.remove('hidden');
    if (document.querySelector('.overlay')) {
        updateOverlayImage();
    } else {
    showSlide(currentSlide);
    }
}


export function getNextSlide() {
    const activeSlides = document.querySelectorAll('.carousel-slide.active');
    activeSlides.forEach(activeSlide => {
        if (activeSlide) {
            activeSlide.classList.remove('active', 'disolve');
            activeSlide.classList.add('hidden');
        }
    });
    currentSlide = (currentSlide + 1) % slides.length;
    if (document.querySelector('.overlay')) {
        updateOverlayImage();
    } else {
    showSlide(currentSlide);
    }
}

export function prevSlide() {
    const activeSlides = document.querySelectorAll('.carousel-slide.active');
    activeSlides.forEach(activeSlide => {
        if (activeSlide) {
            activeSlide.classList.remove('active', 'disolve');
            activeSlide.classList.add('hidden');
        }
    });
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    if (document.querySelector('.overlay')) {
        updateOverlayImage();
    } else {
    showSlide(currentSlide);
    }
}
