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

export function handleStart(e) {
	// if (e.target.closest('.menu-toggle')) {
	// 	return ;
	// }
	if (e.target.closest('.gallery-img')) {
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
    // if (e.target.tagName.toLowerCase() === 'a' || e.target.closest('a')) {
    //     return;
    // }
        startX = e.touches ? e.touches[0].clientX : e.clientX;
        startY = e.touches ? e.touches[0].clientY : e.clientY;
}
let collectionsHidden = true;

const galleryOverlay = document.querySelector('.gallery');

export function handleEnd(e) {
    const target = e.target;
	if (target.closest('.Connect') || target.closest('.gallery-img')) {
		return ;
	}
	e.preventDefault();
    console.log('End event target:', target);
    if (target.closest('.Gallery')) {
            const overlay = document.querySelector('.overlay');
        if (overlay){
            overlay.remove();
            openGallery();
        }   else {
            openGallery();
        }
		return ;
    }
	// if (target.closest('.scroll-header')) {
	// 	updateImages(currentIndex);
	// }
	if (target.closest('.lower-button')) {
		// openGalleryMenu();
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
		return ;
	}
	if (target.closest('.upper-button')) {
		// openGalleryMenu();
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
		return ;
	}

	if (target.closest('.Connect')) {
		toggleConnect();
		return ;
	}
	if (target.closest('.EmailLink')) {
		const emailLink = document.getElementById('emailLink');
		const emailAddress = 'info@jinjajac.com';
		const subject = '';
		const body = '';
	
		emailLink.href = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
		emailLink.click();
	}
	if (target.closest('.More')) {
		// toggleAbout();
		if (!galleryHidden) {
			closeGallery();
		}
		if (document.querySelector('.overlay')) {
			handleClose();
		}
		moreAbout();
		return ;
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
		return ;
	}
    if (target.closest('.Concrete')) {
		closeGallery();
		toggleMenu();
        changeCollection('.Concrete');
		handleClose ();
		// getNextSlide();

        return ;
    }
	if (target.closest('.Lighting')) {
		closeGallery();

		toggleMenu();
        changeCollection('.Lighting');
		handleClose ();
		// getNextSlide();
        return ;
    }
    if (target.closest('.Digital')) {
		closeGallery();

		toggleMenu();
        changeCollection('.Digital');
		handleClose ();

		// getNextSlide();
        return ;
    }


    const screenWidth = window.innerWidth;


    const menu = document.querySelector('.menu');


    if (target.closest('#change-menu-btn')) {
        console.log('Menu button clicked');
        toggleMenu();
        return ;
    }
    if (target.closest('#close-overlay-button')) {
		slides[currentSlide].classList.add('hidden');

		handleClose();
		nextSlide();
		// resolve();
		return ;
    }
	endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    endY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
    const xMove = endX - startX;
    const yMove = endY - startY;
	if (target.closest('.scroll-header')) {
		updateImages();
		// updateImages(currentIndex);
		if (Math.abs(yMove) > 10) {
            if (Math.abs(yMove) > 10) {
				
                if (startY > endY + 10) {
					swipeDown();
                    return ;
                } else if (startY < endY - 10) {
                    console.log('Swiped down');
					swipeUp();
                    return ;
                }
            }
		}
	}
    if (target.closest('.fullscreen-button')) {
        fullScreen();
        return ;
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