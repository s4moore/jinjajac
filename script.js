import {handleStart, handleEnd} from "./js/input.js";
import { setBackgroundVideo } from "./js/background.js";
import {changeCollection} from "./js/collection.js";

export let overlay = null, collections = [];

let firstGo = true;

let fadeTimers = {};
export let headers = null;
export let currentIndex = 0;
let firstCollectionPrinted = false;

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
        collections = data;
        setBackgroundVideo();
    } catch (error) {
        console.error('Error fetching collections:', error);
    }
}

const headerContainer = document.querySelector('.collection-header');

export function swipeUp() {
		currentIndex = (currentIndex + 1) % headers.length;
		console.log('collections: ', collections);
		console.log('Changing to collection:', collections[currentIndex].name);

		changeCollection(collections[currentIndex].name);

		// updateImages(currentIndex);
		// startY = moveY; // Reset startY to avoid multiple swipes in one move
		// isScrolling = true;
		// setTimeout(() => isScrolling = false, 300); // Debounce for 300ms

}

export function swipeDown() {
		currentIndex = (currentIndex - 1 + headers.length) % headers.length;
		console.log('Changing to collection:', collections[currentIndex].name);
		console.log('collections: ', collections);

		changeCollection(collections[currentIndex].name);
		// updateImages(currentIndex);
		// startY = moveY; // Reset startY to avoid multiple swipes in one move
		// isScrolling = true;
		// setTimeout(() => isScrolling = false, 300); // Debounce for 300ms

}
// headerContainer.addEventListener('touchmove', (e) => {
// 	if (isScrolling) return;
// 	updateImages(currentIndex);

// 	const moveY = e.touches[0].clientY;
// 	const diffY = startY - moveY;

// 	if (diffY < -5) { // Swipe up
// 		currentIndex = (currentIndex + 1) % headers.length;
// 		// console.log('collections: ', collections);
// 		// console.log('Changing to collection:', collections[currentIndex].name);

// 		changeCollection(collections[currentIndex].name);

// 		updateImages();
// 		startY = moveY; // Reset startY to avoid multiple swipes in one move
// 		isScrolling = true;
// 		setTimeout(() => isScrolling = false, 300); // Debounce for 300ms

// 		if (!galleryHidden) {
// 			openGallery();
// 			return;
// 		}
// 	} else if (diffY > 5) { // Swipe down
// 		currentIndex = (currentIndex - 1 + headers.length) % headers.length;
// 		// console.log('Changing to collection:', collections[currentIndex].name);
// 		// console.log('collections: ', collections);

// 		changeCollection(collections[currentIndex].name);
// 		updateImages();
// 		startY = moveY; // Reset startY to avoid multiple swipes in one move
// 		isScrolling = true;
// 		setTimeout(() => isScrolling = false, 300); // Debounce for 300ms

// 		if (!galleryHidden) {
// 			openGallery();
// 			return;
// 		}
// 	}
// });



// headerContainer.addEventListener('touchstart', (e) => {
// 	startY = e.touches[0].clientY;
// });




function handleTransitionEnd(event) {
	const header = event.target;
	header.style.visibility = 'visible';
	header.style.opacity = 0.7;
}

function fadeOpacity(header, index) {
	let opacity = 0.7;
	let fadeStep = 0.1; // Adjust the step size for fading
	let fadeInterval = 300; // Adjust the interval for fading
	// if (!firstCollectionPrinted) {
	// 	fadeInterval = 2000;
    //     fadeStep = 0.3;
	// }
	function step() {
		opacity -= fadeStep;
		if (opacity <= 0) {
			opacity = 0;
			clearTimeout(fadeTimers[index]);
		}
		header.style.opacity = opacity;
		if (opacity > 0) {
			fadeTimers[index] = setTimeout(step, fadeInterval);
		} else {
			fadeTimers[index] = null;
		}
	}

	fadeTimers[index] = setTimeout(step, fadeInterval);
}

export function updateImages(targetIndex) {
	const angle = 360 / headers.length;
	const radius = window.innerHeight / 20; 

	Object.values(fadeTimers).forEach(timer => clearTimeout(timer));
	fadeTimers = {};
	if (targetIndex !== undefined) {
		currentIndex = targetIndex;
	}
	headers.forEach((header, index) => {
		console.log('index: ', index);
		console.log('currentIndex: ', currentIndex);
		let offset = (index - currentIndex) * angle;
		header.style.visibility = 'visible';
		header.style.opacity = 0.8;
		if (offset > 180) {
			offset -= 360;
			// header.style.visibility = 'hidden';
			header.style.opacity = '0.1';
		} else if (offset < -180) {
			offset += 360;
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
			opacity = 0.7; 
			fadeOpacity(header, index);
		} else {
			opacity = 0; 
		}
		header.style.opacity = opacity;
	});
	firstCollectionPrinted = true;
}

document.addEventListener('DOMContentLoaded', async () => {
    document.querySelector('.gallery-button').classList.remove('hidden');
    document.querySelector('.menu-toggle').classList.remove('hidden');
	document.querySelector('.collection-header').classList.remove('hidden');
	document.getElementById('change-menu-btn').classList.remove('hidden');

	let scale = Math.min(window.innerWidth, window.innerHeight) / 470;
	const menu = document.querySelector('.menu');
	if (Math.min(window.innerWidth, window.innerHeight) > 768) {
		scale *= 0.75;
	}
	// menu.removeEventListener('transitionend', menuFin);
	// menu.removeEventListener('animationend', menuFin);

	console.log('Scale:', scale);   
	setVar('--menu-scale', scale);

    const menuButton = document.querySelector('.menu-toggle');
    if (!menuButton) {
        console.error('menuButton element not found');
        return;
    }	
	await fetchCollections();

    // const headerContainer = document.querySelector('.collection-header');
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
	headers = document.querySelectorAll('.scroll-header');
	
	// Use the function to wait for the hidden class and then execute your code
	if (firstGo) {
		firstGo = false;

	// document.querySelector('.background-video').addEventListener('playing', async () => {
		await changeCollection('Late 24');
		updateImages(currentIndex);
	
		// Wait for the first changeCollection to complete before proceeding
		await changeCollection('Mid 23');
		updateImages(currentIndex);

		await changeCollection('Late 24');
		updateImages(currentIndex);
	// });
}

    document.addEventListener('resize', setBackgroundVideo);
    document.addEventListener('wheel', stopZooming, { passive: false });
	document.addEventListener('touchstart', handleStart, { passive: false });
    document.addEventListener('mousedown', handleStart, { passive: false });      
    document.addEventListener('touchend', handleEnd, { passive: false });
    document.addEventListener('mouseup', handleEnd, { passive: false });
});