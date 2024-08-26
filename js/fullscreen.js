import {slides, nextSlide, currentSlide} from './slides.js';
import {handleStart, handleEnd} from './input.js';
import {updateViewport} from '../script.js';
import { fadeInButtons } from './utils.js';

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
