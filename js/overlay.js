import {slides, nextSlide, currentSlide} from './slides.js';
import {handleStart, handleEnd} from './input.js';
import {updateViewport} from '../script.js';
import { fadeInButtons } from './utils.js';
import { fullScreen } from './fullscreen.js';

let overlay = null;

export function handleClose() {
    overlay = document.querySelector('.overlay');
    if (overlay){
        overlay.remove();
    }
    overlay = null; 
    slides[currentSlide].classList.add('hidden');
    slides.forEach( (slide) => {
        slide.classList.add('hidden');
        slide.classList.remove('paused');
    });
    nextSlide();
    return ;
}

export function showOverlay() {
    return new Promise((resolve) => {
        let buttonsShown = false;
        let overlay = document.querySelector('.overlay');

        const current = slides[currentSlide];
        console.log('Current slide:', current);
        let imageUrl;
        if (screen.width > screen.height) {
            imageUrl = current.getAttribute('landscape');
        } else {
            imageUrl = current.querySelector('img').src;
        }
        current.classList.add('hidden');
        // current.classList.add('overlay');
        slides[currentSlide].classList.remove('active');
        if (overlay) {
            buttonsShown = true;
            overlay.remove();
        }
        overlay = document.createElement('div');
        overlay.classList.add('overlay');
        overlay.innerHTML = `
            <div class="overlay-content">
                <img class="overlay-img" src="${imageUrl}"  id="dynamic-img">
                <div class="overlay-buttons">
                    <button class="close-button hidden" id="check-hidden-close"><img src="icons/Less creative close icon .png"></button>
                    <button class="info-button hidden"><img src="icons/Information .png"></button>
                    <button class="fullscreen-button hidden"><img src="icons/Less creative fullscreen icon .png"></button>
                </div>

                <div class="caption"></div>
            </div>

        `;

        document.body.appendChild(overlay);
        window.addEventListener('load', function() {
            const img = document.getElementById('dynamic-img');
            const overlay = document.querySelector('.overlay');
            const overlayContent = document.querySelector('.overlay-content');
            let aspectRatio, containerWidth, containerHeight;
    
            function adjustImageSize() {
                if (overlay.clientWidth < overlay.clientHeight) {
                 aspectRatio = img.naturalWidth / img.naturalHeight;
                 containerWidth = overlay.clientWidth * 0.95;
                 containerHeight = containerWidth / aspectRatio;
                } else {
                     aspectRatio = img.naturalWidth / img.naturalHeight;
                     if (screen.width > screen.height * 1.5) {
                     containerHeight = overlay.clientHeight * 0.9;
                     } else{
                        containerHeight = overlay.clientHeight * 0.7;
                     }
                     containerWidth = containerHeight * aspectRatio;
                }
                console.log('Container width:', containerWidth);
                console.log('Container height:', containerHeight);
                overlayContent.style.height = `${containerHeight}px`;
                overlayContent.style.width = `${containerWidth}px`;
    
            }
        
            // Adjust the image size when the image is loaded
            // if (img.complete) {
            //     adjustImageSize();
            // } else {
            //     img.onload = adjustImageSize;
            // }
        
            // Adjust the image size on window resize
            window.addEventListener('resize', adjustImageSize);
        });
    
        overlay.classList.add('blur');
            const img = document.getElementById('dynamic-img');
            const overlayContent = document.querySelector('.overlay-content');
            const caption = document.querySelector('.caption');
            let containerWidth, containerHeight;

            img.addEventListener('load', adjustImageSize);


            function adjustImageSize() {
                const aspectRatio = img.naturalWidth / img.naturalHeight;

                if (overlay.clientWidth < overlay.clientHeight) {
                    containerWidth = overlay.clientWidth * 0.95;
                    containerHeight = containerWidth / aspectRatio;
                } else {
                    if (screen.width > screen.height * 1.5) {
                        containerHeight = overlay.clientHeight * 0.9;
                    } else {
                        containerHeight = overlay.clientHeight * 0.7;
                    }
                    containerWidth = containerHeight * aspectRatio;
                }
                console.log('Aspect ratio: ', aspectRatio);
                console.log('Container width:', containerWidth);
                console.log('Container height:', containerHeight);
                overlayContent.style.height = `${containerHeight}px`;
                overlayContent.style.width = `${containerWidth}px`;
                caption.innerText = current.getAttribute('data-caption');
                caption.style.width = 'auto';
                caption.classList.add('fadeIn');
            }
    
            // Adjust the image size when the image is loaded
    
            // Adjust the image size on window resize
            window.addEventListener('resize', adjustImageSize);
            // Adjust the image size when the image source changes
    
            const closeButton = document.querySelector('.close-button');
            closeButton.addEventListener('click', () => {
                handleClose();
                resolve();
            });
            if (!buttonsShown) {
                fadeInButtons();
                buttonsShown = true;
            }
            // overlay.addEventListener('touchstart', handleStart);
            // overlay.addEventListener('mousedown', handleStart);
            // overlay.addEventListener('touchend', handleEnd);
            // overlay.addEventListener('mouseup', handleEnd);
        });
    }

export function updateOverlayImage() {
    overlay = document.querySelector('.overlay'); // Ensure overlay is reassigned
    // if (overlay) {
        const current = slides[currentSlide];
        const imageUrl = current.querySelector('img').src;
        const overlayImage = current.querySelector('img');
        if (overlayImage) {
            overlayImage.src = imageUrl;
        // }
        const captionElement = overlay.querySelector('.caption');
        // const blurbElement = document.querySelector('.blurb');
        function updateCaptionAndBlurb() {
            captionElement.innerText = slides[currentSlide].getAttribute('data-caption');
            // blurbElement.innerText = current.getAttribute('data-blurb');
        }
        
    updateCaptionAndBlurb();
    showOverlay();
    }
}
