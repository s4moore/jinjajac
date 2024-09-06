import {fetchSlides} from "./slides.js";
import { collections } from "../script.js";

export let collection;
export let currentCollection = 0;
// let collections = [];

export function changeCollection(change) {
    console.log('Change:', change);

	let oldCollection = currentCollection;

	if (!collections) {
		console.error('Collections not found');
	}
	console.log('Collections collections length:', collections.length);
	if (change === 1 || change === 0 || change === -1) {
		currentCollection -= change;
		if (currentCollection < 0) {
			currentCollection = collections.length - 1;
		} else if (currentCollection >= collections.length) {
			currentCollection = 0;
		}
	} else {
		console.log('Change:', change);
		currentCollection = collections.findIndex(item => item.collection === change);
		console.log('Current collection:', currentCollection);
	}
	collection = collections[currentCollection].name;
	let header1Number = currentCollection - 1;
	let header3Number = currentCollection + 1;
	if (header1Number < 0) {
		header1Number = collections.length - 1;
	}
	if (header3Number >= collections.length) {
		header3Number = 0;
	}

	const header1 = document.querySelector('.header-1');
	const header2 = document.querySelector('.header-2');
	const header3 = document.querySelector('.header-3');
	header1.innerHTML = `
	<img src="headers/${collections[header1Number].name}.png" alt="1">
	`;
	header2.innerHTML = `
	<img src="headers/${collection}.png" alt="${collection} header">
	`;
	header3.innerHTML = `
	<img src="headers/${collections[header3Number].name}.png" alt="3">
	`;
	// console.log(`Changing collection to: ${collection}`);
	console.log('collection: ', `${collections[currentCollection].collection}`);
	const galleryButton = document.querySelector(`${collections[currentCollection].collection}Button`);
	console.log('Gallery button:', galleryButton);
	console.log('Old collection:', oldCollection);
	if (oldCollection !== undefined) {
	const oldButton = document.querySelector(`${collections[oldCollection].collection}Button`);
	// galleryButton.innerHTML = `<img class="gallery-button" src="/headers/${collections[currentCollection].collection}.png">`;
	oldButton.classList.add('hidden');
	}
	galleryButton.classList.remove('hidden');
	fetchSlides(collection);
	console.log(`Changing collection to: ${collections[currentCollection].collection}`);
    
}