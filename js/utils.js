let collectionsHidden = true, menuHidden = true, menuFadeTimeOut = null, collectionsFadeTimeOut = null;
let connectHidden = true, connectFadeTimeOut = null;
const menu = document.querySelector('.menu');
const root = document.documentElement;
let menuFading = null, connectFading = null;

function getVar(variableName) {
    return getComputedStyle(root).getPropertyValue(variableName).trim();
}

export function setMenuHidden() {
    menuHidden = true;
    menu.removeEventListener('animationend', menuFin);

}
export function setVar(variableName, value) {
    root.style.setProperty(variableName, value);
}

function menuFin() {
    menu.classList.remove('menu-fade');
    menu.classList.add('hidden');
    menu.classList.remove('paused');
    menu.classList.remove('hidden');
    menu.classList.add('hidden');
    menuHidden = true;
    forceEndAnimation();}

function forceEndAnimation() {
    const animationEndEvent = new Event('animationend');
    menu.dispatchEvent(animationEndEvent);
}

function resetAnimation(element, animationClass) {
    element.classList.remove(animationClass);
    void element.offsetWidth; // Trigger a reflow
    element.classList.add('no-animation'); // Add a temporary class to reset the state
    requestAnimationFrame(() => {
        element.classList.remove('no-animation'); // Remove the temporary class
        element.classList.add(animationClass); // Re-add the original animation class
    });
}

export function toggleMenu() {

	if (menuHidden) {
                let scale = Math.min(window.innerWidth, window.innerHeight) / 470;
        if (Math.min(window.innerWidth, window.innerHeight) > 768) {
            scale *= 0.75;
        }
        forceEndAnimation();
        console.log('Scale:', scale);   
        setVar('--menu-scale', scale);
        menu.style.opacity = '0.1';
		menuHidden = false;
		
		menu.classList.remove('hidden');
        menu.classList.remove('menu-fade');
        void menu.offsetWidth; 
        // menu.classList.add('menu-fade');
        resetAnimation(menu, 'menu-fade'); 
		
		menu.addEventListener('animationend', menuFin);
	}
    //     if (menuFadeTimeOut) {
    //         clearTimeout(menuFadeTimeOut);
    //     }
    //     let scale = Math.min(window.innerWidth, window.innerHeight) / 470;
    //     if (Math.min(window.innerWidth, window.innerHeight) > 768) {
    //         scale *= 0.75;
    //     }
    //     console.log('Scale:', scale);   
    //     setVar('--menu-scale', scale);
    //     menu.style.opacity = '0.1';
	// 	menuHidden = false;
    //     fadeIn(menu);
    //     menuFadeTimeOut = setTimeout(() => {
	// 		menu.classList.add('fadeOut');
	// 		menu.addEventListener('animationend', function fadeOutListener() {
	// 			menuHidden = true;
	// 			menuFadeTimeOut = null;
	// 			menu.classList.add('hidden');
	// 			menu.classList.remove('fadeOut');
	// 			menu.removeEventListener('animationend', fadeOutListener);
	// 		});
    //     }, 9000);

    // } else {
    //     if (menuFadeTimeOut) {
    //         clearTimeout(menuFadeTimeOut);
    //         menuFadeTimeOut = null;
    //     }
	// 	menu.classList.add('fadeOut');
	// 	menu.addEventListener('animationend', function fadeOutListener() {
	// 		menuHidden = true;
	// 		menu.classList.add('hidden');
	// 		menu.style.opacity = '0';
	// 		menu.classList.remove('fadeOut');
	// 		menu.removeEventListener('animationend', fadeOutListener);
	// 	});
    
}

export function toggleConnect() {
	if (connectHidden) {
		connectHidden = false;
		const connect = document.querySelector('.Contact-area');
		connect.classList.remove('hidden');
		connect.classList.add('connect-fade');
		menu.classList.add('paused');
		function connectFin() {
			connect.classList.remove('connect-fade');
			connect.classList.add('hidden');
			connectHidden = true;
			connect.removeEventListener('animationend', connectFin);
			menu.classList.remove('paused');
			menu.classList.remove('menu-fade');
			menu.style.opacity = '1';
			fadeOut(menu);
		}
		
		connect.addEventListener('animationend', connectFin);
	// 	connectHidden = false;
	// 	const contact = document.querySelector('.Contact-area');
    //     fadeIn(contact);
    //     connectFadeTimeOut = setTimeout(() => {
	// 		contact.classList.add('fadeOut');
	// 		contact.addEventListener('animationend', function fadeOutListener() {
	// 			connectHidden = true;
	// 			connectFadeTimeOut = null;
	// 			contact.classList.add('hidden');
	// 			contact.classList.remove('fadeOut');
	// 			contact.removeEventListener('animationend', fadeOutListener);
	// 			document.querySelector('.menu').classList.remove('paused');

	// 		});
    //     }, 9000);

    // } else {
    //     if (connectFadeTimeOut) {
    //         clearTimeout(connectFadeTimeOut);
    //         connectFadeTimeOut = null;
    //     }
	// 	menu.classList.add('fadeOut');
	// 	menu.addEventListener('animationend', function fadeOutListener() {
	// 		connectHidden = true;
	// 		menu.classList.add('hidden');
	// 		menu.style.opacity = '0';
	// 		menu.classList.remove('fadeOut');
	// 		menu.removeEventListener('animationend', fadeOutListener);
	// 		document.querySelector('.menu').classList.remove('paused');

	// 	});
    }
}

export function fadeInHeader(item) {
    item.classList.remove('hidden');         
    item.classList.add('fadeInHeader');
    item.addEventListener('animationend', () => {
        item.style.opacity = '0.4';
        item.classList.remove('hidden');         
        item.classList.remove('fadeInHeader');
    });
}

export function fadeOut(item) {
    item.classList.add('fadeOut');
    item.addEventListener('animationend', () => {
        item.classList.add('hidden');
        item.style.opacity = '0';
        item.classList.remove('fadeOut');
    });
}

export function fadeIn(item) {
    item.classList.remove('hidden');      
	item.classList.remove('fadeOut');            
    item.classList.add('fadeIn');
    item.style.opacity = '0';

    item.addEventListener('animationend', () => {
        item.style.opacity = '1';
        item.classList.remove('hidden');         
        item.classList.remove('fadeIn');
    });
}
const header1 = document.querySelector('.header-1');
const header3 = document.querySelector('.header-3');
function onAnimationEnd() {
    header1.classList.add('hidden');
    header1.classList.remove('fadeCollections');
    header3.classList.add('hidden');
    header3.classList.remove('fadeCollections');
    collectionsHidden = true;
	header1.removeEventListener('animationend', onAnimationEnd);
}

export function toggleCollections() {

    if (collectionsHidden)
    {
        header1.removeEventListener('animationend', onAnimationEnd);

        header1.classList.remove('hidden');
        header3.classList.remove('hidden');
        header1.classList.remove('fadeOut');
        header3.classList.remove('fadeOut');
        header1.style.opacity = '0';
        header3.style.opacity = '0';
        header1.classList.add('fadeCollections');
        header3.classList.add('fadeCollections');
        collectionsHidden = false;
        header1.addEventListener('animationend', onAnimationEnd);
    } else {
        header1.style.opacity = '1';
        header3.style.opacity = '1';
        header1.removeEventListener('animationend', onAnimationEnd);
        header1.classList.remove('fadeCollections');
        header3.classList.remove('fadeCollections');
        header1.classList.add('fadeOut');
        header3.classList.add('fadeOut');
        header1.addEventListener('animationend', onAnimationEnd);
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