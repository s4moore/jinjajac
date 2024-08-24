import {slides, nextSlide, currentSlide} from './slides.js';
import {handleStart, handleEnd} from './input.js';
import {updateViewport} from '../script.js';
import { fadeInButtons } from './utils.js';
let overlay = null;

export function handleClose() {
    overlay = document.querySelector('.overlay');
    overlay.remove();
    overlay = null; 
    slides[currentSlide].classList.add('hidden');
    slides.forEach( (slide) => {
        slide.classList.add('hidden');
        slide.classList.remove('paused');
    });
    nextSlide();
    return ;
}

export function fullScreen () {
    return new Promise((resolve) => {
        updateViewport('yes');
        const current = slides[currentSlide];
        const imageUrl = current.getAttribute('landscape');               

        const fullScreenOverlay = document.createElement('div');
        fullScreenOverlay.classList.add('fullscreen');
        fullScreenOverlay.innerHTML = `
                            <div class="overlay-buttons-fullscreen">
                    <button class="close-button fixed-top-left"><img src="icons/Less creative close icon .png"></button>
        <div class="fullscreen">
            <img class="fullscreen-img" src="${imageUrl}">
            </div>
        </div>


    `;

    document.body.appendChild(fullScreenOverlay);
    document.querySelector('.close-button').classList.remove('hidden');
    document.querySelector('.close-button').style.opacity = '1';
    const image = document.querySelector('.fullscreen-img');
    const screen = document.querySelector('.fullscreen');
    document.addEventListener('click', function(event) {
        // Get the coordinates of the tap
        const x = event.clientX;
        const y = event.clientY;
    
        // Create a new button element
        const button = document.createElement('button');
        button.textContent = 'Click Me';
        button.style.position = 'absolute';
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;
        button.style.transform = 'translate(-50%, -50%)'; // Center the button at the tap location
    
        // Append the button to the document body
        document.body.appendChild(button);
    });
    // screen.addEventListener('wheel', function(event) {
    //     if (event.ctrlKey) {
    //         event.preventDefault(); // Prevent the default zoom behavior

    //         // Get the current scale of the image
    //         let scale = parseFloat(image.style.transform.replace(/[^0-9.]/g, '')) || 1;
    
    //         // Adjust the scale based on the wheel direction
    //         if (event.deltaY < 0) {
    //             // Wheel up - scale up
    //             scale += 0.1;
    //         } else {
    //             // Wheel down - scale down
    //             scale -= 0.1;
    //         }
    
    //         // Set the new scale with a minimum limit to prevent negative or zero scale
    //         scale = Math.max(scale, 0.1);
    //         image.style.transform = `scale(${scale})`;
    //     }
    // }, { passive: false });

    let initialDistance = null;
let initialScale = 1;

// Function to calculate distance between two touch points
function getDistance(touches) {
    const [touch1, touch2] = touches;
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

// // Function to handle pinch zoom
// screen.addEventListener('touchmove', function(event) {
//     if (event.touches.length === 2) {
//         event.preventDefault(); // Prevent the default pinch behavior

//         const currentDistance = getDistance(event.touches);

//         if (initialDistance === null) {
//             initialDistance = currentDistance;
//             initialScale = parseFloat(image.style.transform.replace(/[^0-9.]/g, '')) || 1;
//         } else {
//             const scale = initialScale * (currentDistance / initialDistance);
//             image.style.transform = `scale(${scale})`;
//         }
//     }
// }, { passive: false });

// Reset initial distance on touch end
screen.addEventListener('touchend', function(event) {
    if (event.touches.length < 2) {
        initialDistance = null;
    }
});

    const closeButton = document.querySelector('.fullscreen .close-button');

    closeButton.addEventListener('click', () => {
        console.log('Fullscreen button clicked');
        fullScreenOverlay.remove();
        updateViewport('no');
        resolve();
    });
    });
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
            overlay.addEventListener('touchstart', handleStart);
            overlay.addEventListener('mousedown', handleStart);
            overlay.addEventListener('touchend', handleEnd);
            overlay.addEventListener('mouseup', handleEnd);
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
