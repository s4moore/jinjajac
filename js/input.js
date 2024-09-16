import { showOverlay, handleClose} from './overlay.js';
import { changeCollection, currentCollection } from './collection.js';
import { prevSlide, nextSlide, getNextSlide, slides, currentSlide } from './slides.js';
import { toggleMenu, openGalleryMenu } from './utils.js';
import { fadeInButtons, toggleConnect, galleryTransitionEnd } from './utils.js';
import { fullScreen } from './fullscreen.js';
import { openGallery, closeGallery, galleryHidden } from './gallery.js';
import { collections, overlay, updateImages, currentIndex, swipeDown, swipeUp } from '../script.js';
import { moreAbout } from './about.js';

let startX, endX, startY, endY;

function checkGalleryButtons(target) {
    if (target.closest('.lower-button')) {
		const openMenu = document.querySelector('.galleriesMenu:not(.hidden)');
		openMenu.removeEventListener('transitionend', galleryTransitionEnd);
		openMenu.removeEventListener('animationend', galleryTransitionEnd);
		openMenu.classList.add('highlight2');
		openMenu.classList.remove('gallery-fade');
		openMenu.addEventListener('animationend', () => {
			openMenu.classList.remove('highlight2');
			openMenu.classList.add('fadeOut');
			openMenu.addEventListener('transitionend', galleryTransitionEnd); 
		});
		const current = collections[currentCollection].collection;
		console.log('Current collection:', current);
		switch (current) {
			case '.Concrete':
				changeCollection('.Lighting');
				break;
			case '.Lighting':
				changeCollection('.Concrete');
				break;
			case '.Digital':
				changeCollection('.Concrete');
				break;
			default:
				break;
		}
		return (true);
	}
	if (target.closest('.upper-button')) {
		const current = collections[currentCollection].collection;
		console.log('Current collection:', current);
		const openMenu = document.querySelector('.galleriesMenu:not(.hidden)');
		openMenu.removeEventListener('transitionend', galleryTransitionEnd);
		openMenu.removeEventListener('animationend', galleryTransitionEnd);
		openMenu.classList.add('highlight2');
		openMenu.classList.remove('gallery-fade');
		openMenu.addEventListener('animationend', () => {
			openMenu.classList.remove('highlight2');
			openMenu.classList.add('fadeOut');
			openMenu.addEventListener('transitionend', galleryTransitionEnd); 
		});
		switch (current) {
			case '.Concrete':
				changeCollection('.Digital');
				break;
			case '.Lighting':
				changeCollection('.Digital');
				break;
			case '.Digital':
				changeCollection('.Lighting');
				break;
			default:
				break;
		}
		return (true);
	}
    return (false);
}

function checkMenuButtons(target)
{
    if (target.closest('.Gallery')) {
        const overlay = document.querySelector('.overlay');
		toggleMenu();
        if (overlay){
            overlay.remove();
            openGallery();
        }   else {
            openGallery();
        }
        return (true);
    }
	if (target.closest('.Connect')) {
		toggleConnect();
		return (true);
	}
	if (target.closest('.EmailLink')) {
		const emailLink = document.getElementById('emailLink');
		const emailAddress = 'info@jinjajac.com';
		const subject = '';
		const body = '';
	
		emailLink.href = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
		emailLink.click();
        return (true);
	}
	if (target.closest('.More')) {
		if (!galleryHidden) {
			closeGallery();
		}
		if (document.querySelector('.overlay')) {
			handleClose();
		}
        toggleMenu();
		moreAbout();
		return (true);
	}
	if (target.closest('.Instagram')) {
		const instagramLink = document.getElementById('instagramLink');
		const instagramURL = 'https://www.instagram.com/jinjajac';

		instagramLink.href = instagramURL;
		instagramLink.click();
		return;
	}
	if (target.closest('.Whatsapp')) {
		const whatsappLink = document.getElementById('whatsappLink');
		const phoneNumber = '027782940371'; 
		const message = 'You\'re ugly and your mother dresses you funny';

		whatsappLink.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
		whatsappLink.click();
		return;
	}
	if (target.closest('.gallery-change')) {
		console.log('Gallery button clicked');
		document.querySelector('.galleriesButton:not(.hidden)').classList.add('highlight2');
		document.querySelector('.galleriesButton:not(.hidden)').addEventListener('animationend', () => {
			document.querySelector('.galleriesButton:not(.hidden)').classList.remove('highlight2');
		});
		openGalleryMenu();
		return (true);
	}
    if (target.closest('.Concrete')) {
		closeGallery();
		toggleMenu();
        changeCollection('.Concrete');
		handleClose ();
        return (true);
    }
	if (target.closest('.Lighting')) {
		closeGallery();

		toggleMenu();
        changeCollection('.Lighting');
		handleClose ();
        return (true);
    }
    if (target.closest('.Digital')) {
		closeGallery();

		toggleMenu();
        changeCollection('.Digital');
		handleClose ();
        return (true);
    }
    if (target.closest('#change-menu-btn')) {
        console.log('Menu button clicked');
        toggleMenu();
        return (true);
    }
    return (false);
}

let isHandlingStart = false;

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

export function handleStart(e) {
	if (isHandlingStart) return;
    isHandlingStart = true;
    setTimeout(() => isHandlingStart = false, 100);

    if (e.target.closest('.gallery-img')) {
		return ;
	}
	if (checkMenuButtons(e.target)) {
        return ;
    }
    if (checkGalleryButtons(e.target)) {
        return ;
    }


	if (e.target.closest('.Connect')) {
		toggleConnect();
		return;
	}
    e.preventDefault();
	if (document.querySelector('.overlay')) {
        fadeInButtons();
    }
    console.log('Start event target:', e.target);
    if (!e.target.closest('.overlay') && !e.target.closest('.overlay-img')
        && !e.target.closest('.carousel-slide') && !e.target.closest('.scroll-header')) {
	if (e.target === '.gallery-button'){
		e.target = document.querySelector('.gallery-menu');
	}
        if (e.target.closest('#change-menu-btn') || e.target.closest('.links')) {
            e.target.classList.add('highlight2');
            e.target.addEventListener('animationend', () => {
                e.target.classList.remove('highlight2');
            });
        } else {
        e.target.classList.add('highlight');
        e.target.addEventListener('animationend', () => {
            e.target.classList.remove('highlight');
        });
    }
    }
        startX = e.touches ? e.touches[0].clientX : e.clientX;
        startY = e.touches ? e.touches[0].clientY : e.clientY;
}
let collectionsHidden = true;

const galleryOverlay = document.querySelector('.gallery');

export function handleEnd(e) {
    const target = e.target;
	if (target.closest('.Connect, .gallery-img, .lower-button, .upper-button, .Gallery, .EmailLink, .More, .Instagram, .Whatsapp, .gallery-change, .Concrete, .Lighting, .Digital, #change-menu-btn, .Shop')) {
		return ;
	}
	e.preventDefault();
    console.log('End event target:', target);
    const screenWidth = window.innerWidth;
    if (target.closest('#close-overlay-button')) {
		slides[currentSlide].classList.add('hidden');
		handleClose();
		nextSlide();
		return ;
    }
    if (target.closest('.fullscreen-button')) {
        fullScreen();
        return ;
    }
	endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    endY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
    const xMove = endX - startX;
    const yMove = endY - startY;
	if (target.closest('.scroll-header')) {
		updateImages();
		if (Math.abs(yMove) > 1) {
            if (Math.abs(yMove) > 1) {
                if (startY > endY + 1) {
					swipeDown();
                    return ;
                } else if (startY < endY - 1) {
                    console.log('Swiped down');
					swipeUp();
                    return ;
                }
            }
		}
	}
    if (galleryHidden && startX <= screenWidth * 0.2) {
        prevSlide();
        return;
    } else if (galleryHidden && startX >= screenWidth * 0.8 )  {
        getNextSlide();
        return;
    }
	if (Math.abs(xMove) > 10 || Math.abs(yMove) > 10) {
        if (Math.abs (xMove) > Math.abs(yMove)) {
            if (startX > endX + 10) {
                getNextSlide();
                return ;
            } else if (startX < endX - 10) {
                prevSlide();
                return ;
            }
	}
    } else if (!document.querySelector('.overlay')) {
        document.querySelectorAll('.active').forEach(element => {
            element.classList.add('hidden');
            // showOverlay();
            console.log('going to overlay mode');
            const overlay = document.querySelector('.overlay');
            slides.forEach (slide => slide.classList.add('paused'));
            showOverlay();
            return ;
        });
    } 
        console.log('No action taken');
}