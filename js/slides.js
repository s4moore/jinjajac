import { overlay } from '../script.js';
import { collection } from './collection.js';
import {updateOverlayImage} from './overlay.js';
export let slides =[], images = [], currentSlide = 0;

const loadingOverlay = document.getElementById('loading-overlay');

export function createSlides(data) {
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
            <img src="../collections/${collection}/${image.src}" alt="Image ${index + 1}">
            `;
            slide.setAttribute('data-caption', image.caption || '');
            slide.setAttribute('data-blurb', image.blurb || '');
            slide.setAttribute('landscape', `../collections/${collection}/landscape/${image.src}`);
            console.log(`Slide created for image: ${slide.getAttribute('landscape')}`);
            carousel.appendChild(slide);
            slides.push(slide);
            console.log(`Slide created for image: ${image.src}`);
        });
    slides = document.querySelectorAll('.carousel-slide');
}

export function fetchSlides(collection) {
    images = [];
    fetch(`../collections/${collection}.json`)
    .then(response => response.json())
    .then(data => {
        images = data;
        loadingOverlay.style.display = 'none';
        createSlides(images);
        nextSlide();
    })
    .catch(error => {
        console.error('Error loading images:', error);
    });
}

export function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    slides.forEach((slide, i) => {
        if (index === i) {
            slide.classList.add('active');
            slide.classList.remove('hidden', 'disolve');
            slide.addEventListener('animationend', expandDone);
            // captionElement.textContent = `${edition} ${images[index].caption}`;
        }
    });
}

export function expandDone(event) {
    const slide = event.target;
    slide.removeEventListener('animationend', expandDone);
    slide.classList.add('disolve', 'active');
    nextSlide();
    slide.addEventListener('animationend', disolveDone);
}

export function disolveDone(event) {
    const slide = event.target;
    slide.removeEventListener('animationend', disolveDone);
    slide.classList.add('hidden');
    slide.classList.remove('disolve', 'active');
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
