import {toggleMenu} from "./js/utils.js";
import {handleStart, handleEnd} from "./js/input.js";
import { setBackgroundVideo } from "./js/background.js";
import {changeCollection} from "./js/collection.js";
import { handleClose } from "./js/overlay.js";
import {currentCollection} from "./js/collection.js";

export let overlay = null, collections = [];

export function stopZooming(event) {
    if (event.ctrlKey) {
        event.preventDefault();
    }
}

export function updateViewport(userScalable) {
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
        viewportMeta.setAttribute('content', `width=device-width, initial-scale=1.0, user-scalable=${userScalable}`);
    }
}

function setVar(variable, value) {
    document.documentElement.style.setProperty(variable, value);
}

async function fetchCollections() {
    try {
        const response = await fetch('collections.json');
        const data = await response.json();
        collections = data; // Store the fetched data in the collections variable
        console.log('Collections data:', collections); // Optional: Log the data to verify
        changeCollection('Early 24');
        setBackgroundVideo();
    } catch (error) {
        console.error('Error fetching collections:', error); // Handle any errors
    }
}

// toggleMenu();
document.addEventListener('DOMContentLoaded', async () => {
    document.querySelector('.gallery-button').classList.remove('hidden');
    document.querySelector('.menu-toggle').classList.remove('hidden');



    const menuButton = document.querySelector('.menu-toggle');
    if (!menuButton) {
        console.error('menuButton element not found');
        return;
    }	
	// menuButton.addEventListener('click', () => {
    //     console.log('menuButton clicked');
	// 	document.getElementById('change-menu-btn').classList.add('highlight2');
    //     toggleMenu();
    // }, { passive: false });
    // headerUpButton.classList.add('hidden');
    // headerDownButton.classList.add('hidden');

	await fetchCollections();

    const headerContainer = document.querySelector('.collection-header');
    headerContainer.innerHTML = ''; // Clear any existing content
    const collectionLabel = document.createElement('div');
    collectionLabel.classList.add('collection-label');
    const collectionText = document.createElement('img');
    collectionText.src = '/headers/Collection.png';
    collectionLabel.appendChild(collectionText);
    headerContainer.appendChild(collectionLabel);
    // Create and insert image elements based on the collections data
    collections.forEach((collection, index) => {
        const headerDiv = document.createElement('div');
        headerDiv.classList.add('scroll-header');
        if (index === 1) {
            headerDiv.classList.add('header-2');
        }

        const img = document.createElement('img');
        img.src = `/headers/${collection.name}.png`;
        headerDiv.appendChild(img);

        headerContainer.appendChild(headerDiv);
    });

    const headers = document.querySelectorAll('.scroll-header');
    let startY = 0;
    let currentIndex = 0;
    let isScrolling = false;

    headerContainer.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
    });

    headerContainer.addEventListener('touchmove', (e) => {
        if (isScrolling) return;

        const moveY = e.touches[0].clientY;
        const diffY = startY - moveY;

        if (diffY < -50) { // Swipe up
            currentIndex = (currentIndex + 1) % headers.length;
            console.log('collections: ', collections);
            console.log('Changing to collection:', collections[currentIndex].name);

            changeCollection(collections[currentIndex].name);

            updateImages();
            startY = moveY; // Reset startY to avoid multiple swipes in one move
            isScrolling = true;
            setTimeout(() => isScrolling = false, 300); // Debounce for 300ms
        } else if (diffY > 50) { // Swipe down
            currentIndex = (currentIndex - 1 + headers.length) % headers.length;
            console.log('Changing to collection:', collections[currentIndex].name);
            console.log('collections: ', collections);

            changeCollection(collections[currentIndex].name);
            updateImages();
            startY = moveY; // Reset startY to avoid multiple swipes in one move
            isScrolling = true;
            setTimeout(() => isScrolling = false, 300); // Debounce for 300ms
        }
    });

    let fadeTimers = {};
    function updateImages() {
        const angle = 180 / headers.length;
        const radius = window.innerWidth / 10; 

        Object.values(fadeTimers).forEach(timer => clearTimeout(timer));
        fadeTimers = {};

        headers.forEach((header, index) => {

            let offset = (index - currentIndex) * angle;
            header.style.visibility = 'visible';
            header.style.opacity = 0.7;
            if (offset > 90) {
                offset -= 180;
                // header.style.visibility = 'hidden';
                header.style.opacity = '0.1';
            } else if (offset < -90) {
                offset += 180;
                // header.style.visibility = 'hidden';
                header.style.opacity = '0.1';

            }
            header.style.transform = `rotateX(${offset}deg) translateZ(${radius}px)`;
            // header.style.visibility = 'visible';
            

            let opacity;
            if (index === currentIndex) {
                opacity = 1; 
            } else if (index === (currentIndex + 1) % headers.length || index === (currentIndex - 1 + headers.length) % headers.length ||
            index === (currentIndex + 2) % headers.length || index === (currentIndex - 2 + headers.length) % headers.length) {
                opacity = 0.5; 
                fadeOpacity(header, index);
            } else {
                opacity = 0; 
            }
            header.style.opacity = opacity;
        });
    }

    function handleTransitionEnd(event) {
        const header = event.target;
        header.style.visibility = 'visible';
        header.style.opacity = 0.7;
    }

    function fadeOpacity(header, index) {
        let opacity = 0.7;
        const fadeStep = 0.1; // Adjust the step size for fading
        const fadeInterval = 300; // Adjust the interval for fading
    
        function step() {
            opacity -= fadeStep;
            if (opacity <= 0) {
                opacity = 0;
                clearTimeout(fadeTimers[index]);
            }
            header.style.opacity = opacity;
            if (opacity > 0) {
                fadeTimers[index] = setTimeout(step, fadeInterval);
            }
        }
    
        fadeTimers[index] = setTimeout(step, fadeInterval);
    }
    // Initial update
    updateImages();

    document.addEventListener('resize', setBackgroundVideo);
    document.addEventListener('wheel', stopZooming, { passive: false });
    // document.addEventListener('touchmove', function(event) {
        // event.preventDefault();
    // }, { passive: false });

	document.addEventListener('touchstart', handleStart, { passive: false });
    document.addEventListener('mousedown', handleStart, { passive: false });      
    document.addEventListener('touchend', handleEnd, { passive: false });
    document.addEventListener('mouseup', handleEnd, { passive: false });
});