import {fetchSlides} from "./slides.js";
import { collections, updateImages } from "../script.js";
import { galleryHidden, openGallery } from "./gallery.js";
export let collection;
export let currentCollection = 0;

export function changeCollection(change) {
    console.log('Change:', change);

	let oldCollection = currentCollection;

	if (!collections) {
		console.error('Collections not found');
	}
	console.log('Collections collections length:', collections.length);
	// if (change === 1 || change === 0 || change === -1) {
	// 	currentCollection -= change;
	// 	if (currentCollection < 0) {
	// 		currentCollection = collections.length - 1;
	// 	} else if (currentCollection >= collections.length) {
	// 		currentCollection = 0;
	// 	}
	// } else {
		console.log('Change:', change);
		currentCollection = collections.findIndex(item => item.name === change);
		console.log('Current collection:', currentCollection);
	// }
	if (currentCollection === -1)
	{
		currentCollection = collections.findIndex(item => item.collection === change);
	}
	collection = collections[currentCollection].name;
	// let header1Number = currentCollection - 1;
	// let header3Number = currentCollection + 1;
	// if (header1Number < 0) {
	// 	header1Number = collections.length - 1;
	// }
	// if (header3Number >= collections.length) {
	// 	header3Number = 0;
	// }
	updateImages(currentCollection);

	// const header1 = document.querySelector('.header-1');
	// const header1Image = header1.querySelector('img');
	// const header2 = document.querySelector('.header-2');
	// const header2Image = header2.querySelector('img');
	// const header3 = document.querySelector('.header-3');
	// const header3Image = header3.querySelector('img');
	// header1.innerHTML = `
	// <img src="headers/${collections[header1Number].name}.png" alt="1">
	// `;
	// header1Image.src = `headers/${collections[header1Number].name}.png`;
	// header2Image.src = `headers/${collection}.png`;
	// header3Image.src = `headers/${collections[header3Number].name}.png`;
	// <img src="headers/${collection}.png" alt="${collection} header">
	// `;
	// header3.innerHTML = `
	// <img src="headers/${collections[header3Number].name}.png" alt="3">
	// `;
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
	if (!galleryHidden) {
		openGallery();
		return ;
	}
	galleryButton.classList.remove('hidden');
	fetchSlides(collection);
	console.log(`THIS Changing collection to: ${collections[currentCollection].name}`);
    // updateImages();
}