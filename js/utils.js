import { collections } from '../script.js';
import { currentCollection } from './collection.js';

let menuHidden = true, menuFading = false;
let connectHidden = true;
const menu = document.querySelector('.menu');
const root = document.documentElement;

export function setVar(variableName, value) {
    root.style.setProperty(variableName, value);
}

function menuFin() {
    menu.classList.remove('menu-fade');
	menu.classList.remove('fadeOut');
	menu.classList.remove('setOpacity');
	console.log('-----------------------------Menu transition end');
    menu.classList.add('hidden');
	void menu.offsetWidth;
    menuHidden = true;
	menuFading = false;
	document.getElementById('change-menu-btn').style.pointerEvents = 'auto';
	menu.removeEventListener('animationend', menuFin);
	menu.removeEventListener('transitionend', menuFin);
}

function removeHighlight() {
	const button = document.getElementById('change-menu-btn');
	button.classList.remove('highlight2');
	button.removeEventListener('animationend', removeHighlight);
}

export function toggleMenu() {
	const button = document.getElementById('change-menu-btn');
	button.addEventListener('animationend', removeHighlight);
	button.classList.add('highlight2');
	if (menuHidden) {

		menuHidden = false;
		menuFading = false;
		menu.classList.remove('hidden');
		menu.classList.remove('fadeOut');
		menu.classList.remove('setOpacity');
		menu.addEventListener('animationend', menuFin);
        menu.classList.add('menu-fade');
		void menu.offsetWidth;
	} else if (!menuFading) {
		menuFading = true;
		menuHidden = false;
		console.log('Menu hidden:', menuHidden);
		document.getElementById('change-menu-btn').style.pointerEvents = 'none';
		menu.removeEventListener('animationend', menuFin);
		// menu.removeEventListener('transitionend', menuFin);
		// menu.classList.remove('menu-fade');
		// menu.classList.remove('fadeOut');
		// menu.classList.remove('setOpacity');
		void menu.offsetWidth;
		menu.classList.add('setOpacity');
		void menu.offsetWidth;
		menu.addEventListener('transitionend', menuFin);
		menu.classList.add('fadeOut');
		void menu.offsetWidth;
		} else {
			menu.classList.remove('menu-fade');
			menu.classList.remove('fadeOut');
			menu.classList.remove('setOpacity');
			console.log('-----------------------------Menu transition end');
			menu.classList.add('hidden');
			void menu.offsetWidth;
			menuHidden = true;
			menuFading = false;
			document.getElementById('change-menu-btn').style.pointerEvents = 'auto';
			menu.removeEventListener('animationend', menuFin);
			menu.removeEventListener('transitionend', menuFin);
		}
}

function connectFin() {
	const connect = document.querySelector('.Contact-area');

	connect.classList.remove('connect-fade');
	connect.classList.add('hidden');
	connectHidden = true;
	connect.removeEventListener('animationend', connectFin);
	// menu.classList.remove('paused');
	// menu.classList.remove('menu-fade');
	menu.style.opacity = '1';
	// fadeOut(menu);
}

export function toggleConnect() {
	if (connectHidden) {
		connectHidden = false;
		const connect = document.querySelector('.Contact-area');
		connect.removeEventListener('animationend', connectFin);

		connect.classList.remove('hidden');
		connect.classList.add('connect-fade');
		// menu.classList.add('paused');

		
		connect.addEventListener('animationend', connectFin);
    }
}



export function fadeInButtons() {
    const buttons = document.querySelector('.overlay-buttons');
    // buttons.forEach(button => {
        buttons.classList.remove('hidden');
        buttons.classList.add('button-fade');
		buttons.addEventListener('animationend', function buttonFader() {
			buttons.classList.remove('button-fade');
			buttons.classList.add('hidden');
			buttons.style.opacity = '0';
			buttons.removeEventListener('animationend', buttonFader);
		});

    //     button.addEventListener('animationend', () => button.classList.add('hidden'));
    // });
}

export function toggleAbout() {
	const about = document.querySelector('.more-about');
	about.classList.remove('hidden');
}

export function galleryTransitionEnd() {
	console.log('asdfsdafasdfasdfsdasfdGallery menu transition end', galleryMenu);
	galleryMenu.classList.remove('gallery-fade');
	galleryMenu.classList.remove('fadeOut');
	galleryMenu.classList.remove('highlight2');
	galleryMenu.classList.add('hidden');
	lowerButton.classList.add('hidden');
	upperButton.classList.add('hidden');
	galleryHidden = true;
	galleryMenu.removeEventListener('transitionend', galleryTransitionEnd);
	galleryMenu.removeEventListener('animationend', galleryTransitionEnd);
	document.querySelector('.gallery-change').style.pointerEvents = 'auto';
}

let galleryHidden = true;
const lowerButton = document.querySelector('.lower-button');
const upperButton = document.querySelector('.upper-button');
let galleryMenu = null;
let oldGalleryMenu = null;

export function openGalleryMenu() {
	let currName = collections[currentCollection].collection.slice(1);
	galleryMenu = document.querySelector(`.${currName}Menu`);

	console.log('Current collection inside openGalleryMenu:', currName);
	if (galleryHidden) {
		galleryHidden = false;
		oldGalleryMenu = galleryMenu;
		galleryMenu.removeEventListener('animationend', galleryTransitionEnd);
		galleryMenu.removeEventListener('transitionend', galleryTransitionEnd);
		lowerButton.classList.remove('hidden');
		upperButton.classList.remove('hidden');
		const collectionMenu = document.querySelector(`${collections[currentCollection].collection}Button`);
		console.log('Gallery menu:', `${currName}Menu`);
		console.log('........Collection menu:', `${collections[currentCollection].collection}`);
		// collectionMenu.classList.add('hidden');
		galleryMenu.classList.remove('hidden');
		galleryMenu.classList.add('gallery-fade');
		galleryMenu.addEventListener('animationend', galleryTransitionEnd);
	} else {
        console.log('Gallery menu:', `${currName}Menu`);
        console.log('Gallery menu:', galleryMenu);	
        oldGalleryMenu.removeEventListener('animationend', galleryTransitionEnd);
        oldGalleryMenu.removeEventListener('transitionend', galleryTransitionEnd);
		document.querySelector('.gallery-change').style.pointerEvents = 'none';
        console.log('Gallery menu:', `${collections[currentCollection].collection}Menu`);
        oldGalleryMenu.classList.remove('gallery-fade');
		void oldGalleryMenu.offsetWidth;
        oldGalleryMenu.classList.add('fadeOut');
        oldGalleryMenu.addEventListener('transitionend', galleryTransitionEnd); 

	}
}