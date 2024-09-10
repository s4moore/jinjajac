import {fetchSlides, nextSlide} from "./slides.js";
import { collections, updateImages } from "../script.js";
import { closeGallery, galleryHidden, openGallery, updateGallery } from "./gallery.js";
import { updateOverlayImage } from "./overlay.js";
export let collection;
export let currentCollection = 0;

export async function changeCollection(change) {
    console.log('Change:', change);
	let	galleryButton = document.querySelector(`${collections[currentCollection].collection}Button`);
	galleryButton.classList.add('hidden');
	if (!collections) {
		console.error('Collections not found');
	}
	currentCollection = collections.findIndex(item => item.name === change);
	if (currentCollection === -1)
	{
		currentCollection = collections.findIndex(item => item.collection === change);
	}
	collection = collections[currentCollection].name;
	await fetchSlides(collection);
	updateImages(currentCollection);
	galleryButton = document.querySelector(`${collections[currentCollection].collection}Button`);
	if (!galleryHidden) {
		updateGallery();
		return ;
	}
	if (document.querySelector('.overlay')) {
		updateOverlayImage();
	}
	galleryButton.classList.remove('hidden');
	nextSlide();
}