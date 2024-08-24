import {slides, nextSlide, currentSlide} from './slides.js';
import {handleStart, handleEnd} from './input.js';
import {updateViewport} from '../script.js';
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
        <div class="fullscreen">
            <img class="fullscreen-img" src="${imageUrl}">
            <div class="overlay-buttons-fullscreen">
                    <button class="close-button fixed-top-left"><img src="icons/Less creative close icon .png"></button>
            </div>
        </div>
    `;
    document.body.appendChild(fullScreenOverlay);
    const image = document.querySelector('.fullscreen-img');
    const screen = document.querySelector('.fullscreen');
    screen.addEventListener('wheel', function(event) {
        if (event.ctrlKey) {
            event.preventDefault(); // Prevent the default zoom behavior

            // Get the current scale of the image
            let scale = parseFloat(image.style.transform.replace(/[^0-9.]/g, '')) || 1;
    
            // Adjust the scale based on the wheel direction
            if (event.deltaY < 0) {
                // Wheel up - scale up
                scale += 0.1;
            } else {
                // Wheel down - scale down
                scale -= 0.1;
            }
    
            // Set the new scale with a minimum limit to prevent negative or zero scale
            scale = Math.max(scale, 0.1);
            image.style.transform = `scale(${scale})`;
        }
    }, { passive: false });

    let initialDistance = null;
let initialScale = 1;

// Function to calculate distance between two touch points
function getDistance(touches) {
    const [touch1, touch2] = touches;
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

function getMovementVector(touch1, touch2) {
    return {
        dx: touch2.clientX - touch1.clientX,
        dy: touch2.clientY - touch1.clientY
    };
}

function dotProduct(vector1, vector2) {
    return vector1.dx * vector2.dx + vector1.dy * vector2.dy;
}

function areTouchesMovingInSameDirection(touch1Start, touch1End, touch2Start, touch2End) {
    const vector1 = getMovementVector(touch1Start, touch1End);
    const vector2 = getMovementVector(touch2Start, touch2End);
    const dot = dotProduct(vector1, vector2);
    return dot > 0;
}

let initialTouches = null;
let initialTranslate = { x: 0, y: 0 };

screen.addEventListener('touchmove', function(event) {
    if (event.touches.length === 1 || event.touches.length === 2) {
        event.preventDefault(); // Prevent the default behavior

        const touch1 = event.touches[0];
        const touch2 = event.touches.length === 2 ? event.touches[1] : null;

        if (!initialTouches) {
            initialTouches = [
                { clientX: touch1.clientX, clientY: touch1.clientY },
                touch2 ? { clientX: touch2.clientX, clientY: touch2.clientY } : null
            ];
            initialTranslate = {
                x: parseFloat(image.style.left) || 0,
                y: parseFloat(image.style.top) || 0
            };
        } else {
            const touch1Start = initialTouches[0];
            const touch1End = { clientX: touch1.clientX, clientY: touch1.clientY };

            if (touch2) {
                const touch2Start = initialTouches[1];
                const touch2End = { clientX: touch2.clientX, clientY: touch2.clientY };

                const sameDirection = areTouchesMovingInSameDirection(touch1Start, touch1End, touch2Start, touch2End);

                if (sameDirection) {
                    // Handle translation
                    const movementVector1 = getMovementVector(touch1Start, touch1End);
                    const movementVector2 = getMovementVector(touch2Start, touch2End);

                    const avgMovementVector = {
                        dx: (movementVector1.dx + movementVector2.dx) / 2,
                        dy: (movementVector1.dy + movementVector2.dy) / 2
                    };

                    const translateX = initialTranslate.x + avgMovementVector.dx;
                    const translateY = initialTranslate.y + avgMovementVector.dy;

                    image.style.left = `${translateX}px`;
                    image.style.top = `${translateY}px`;
                } else {
                    // Handle pinch zoom
                    const currentDistance = getDistance(event.touches);
                    const initialDistance = getDistance(initialTouches);
                    const initialScale = parseFloat(image.style.transform.replace(/[^0-9.]/g, '')) || 1;
                    const scale = initialScale * (currentDistance / initialDistance);
                    image.style.transform = `scale(${scale})`;
                }
            } else {
                // Handle translation for single touch
                const movementVector = getMovementVector(touch1Start, touch1End);

                const translateX = initialTranslate.x + movementVector.dx;
                const translateY = initialTranslate.y + movementVector.dy;

                image.style.left = `${translateX}px`;
                image.style.top = `${translateY}px`;
            }

            // Update initial touches for the next move event
            initialTouches = [
                { clientX: touch1.clientX, clientY: touch1.clientY },
                touch2 ? { clientX: touch2.clientX, clientY: touch2.clientY } : null
            ];
        }
    }
}, { passive: false });

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
            overlay.remove();
        }
        overlay = document.createElement('div');
        overlay.classList.add('overlay');
        overlay.innerHTML = `
            <div class="overlay-content">
                <img class="overlay-img" src="${imageUrl}"  id="dynamic-img">
                <div class="overlay-buttons">
                    <button class="close-button"><img src="icons/Less creative close icon .png"></button>
                    <button class="fullscreen-button"><img src="icons/Less creative fullscreen icon .png"></button>
                </div>

                <div class="caption"></div>
                <div class="info-button"><img src="icons/Information .png"></div>
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
    
            const fullscreenButton = document.querySelector('.fullscreen-button');
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
