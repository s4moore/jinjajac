document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = document.getElementById('loading-overlay');
    // const captionElement = document.querySelector('.carousel-caption p');
    let images = [];
    const carouselContainer = document.querySelector('.carousel-container');
    let overlay = null;
    let slides = [];
    let currentSlide = 0;
    let collections = [];
    let currentCollection = 1;
    let collection;
    const changeArea = document.querySelector('.change-area');
    const items = document.querySelector('.menu-overlay');
    const menuItems = document.querySelector('.menu-item');
    const menuToggle = document.querySelector('.menu-toggle');
    console.log(menuItems);
    const menu = document.querySelector('.menu');
    let startX, endX, startY, endY, touchTimer;

    function toggleMenu() {
        if (menu.classList.contains('hidden')) {
            menuToggle.style.opacity = '0';
            menu.classList.remove('hidden');
        } else {
            menu.classList.add('hidden');
            menuToggle.style.opacity = '1';

        }
    }


    function createSlides(data) {
        const carousel = document.querySelector('.carousel');
            if (carousel.firstChild){
            while (carousel.firstChild) {
                carousel.removeChild(carousel.firstChild);
            }}
            slides = []; 
            data.forEach((image, index) => {
                const slide = document.createElement('div');
                slide.classList.add('carousel-slide');
                console.log(`Creating slide for image: ${image.src}`);
                slide.innerHTML = `
                <img src="collections/${collection}/${image.src}" alt="Image ${index + 1}">
                `;
                slide.setAttribute('data-caption', image.caption || '');
                slide.setAttribute('data-blurb', image.blurb || '');
                carousel.appendChild(slide);
                slides.push(slide);
                console.log(`Slide created for image: ${image.src}`);
            });
        slides = document.querySelectorAll('.carousel-slide');
    }

    function fetchSlides(collection) {
        images = [];
        fetch(`collections/${collection}.json`)
        .then(response => response.json())
        .then(data => {
            images = data;
            loadingOverlay.style.display = 'none';
            createSlides(images);
            nextSlide();
        })
        .catch(error => {
            console.error('Error loading images:', error);
        });
    }

    function changeCollection(change) {
        currentCollection += change;
        if (currentCollection < 0) {
            currentCollection = collections.length - 1;
        } else if (currentCollection >= collections.length) {
            currentCollection = 0;
        }
        console.log(`Changing collection to: ${currentCollection}`);
        fetch('collections.json')
        .then(response => response.json())
        .then(data => {
            collections = data;
            collection = data[currentCollection].name;
            const collectionHeader = document.querySelector('.collection-header');
            collectionHeader.innerHTML = `
            <img src="headers/${collection}.png" alt="${collection} header">
            `;
            console.log(`Changing collection to: ${collection}`);
            fetchSlides(collection);
        });
    }

    changeCollection(currentCollection);

    function setBackgroundVideo() {
        const existingVideo = document.querySelector('.background-video');
        if (existingVideo) {
            existingVideo.remove();
        }
        const isLandscape = window.matchMedia("(orientation: landscape)").matches;
        const videoElement = document.createElement('video'); // Create a new video element
        videoElement.preload = 'auto';
        videoElement.playbackRate = 0.5;
        videoElement.loop = true;
        videoElement.controls = false;
        videoElement.volume = null;
        videoElement.playsInline = true;
        videoElement.autoplay = true;
        videoElement.muted = true;
        videoElement.style.objectFit = 'fill';
    
        const sourceElement = document.createElement('source');
        sourceElement.src = isLandscape ? "/back/landscape.mp4" : "/back/portrait.mp4";
        sourceElement.type = 'video/mp4';
    
        videoElement.appendChild(sourceElement);

        videoElement.classList.add('background-video');
        document.body.appendChild(videoElement);
    
        videoElement.addEventListener('canplaythrough', () => {
            console.log('Video can play through without stopping for buffering.');
            videoElement.play().catch(error => {
                console.error('Error attempting to play the video:', error);
            });
        });
    }

    setBackgroundVideo();

    window.addEventListener('resize', setBackgroundVideo);
    
    function handleStart(e) {
        if (e.target.tagName === 'A') {
            return;
        }
        if (!e.target.closest('.blurb')) {
            console.log('Event target is not within .overlay .blurb');
            e.preventDefault();
            startX = e.touches ? e.touches[0].clientX : e.clientX;
            startY = e.touches ? e.touches[0].clientY : e.clientY;
            // slides[currentSlide].classList.remove('hidden');
        }
    }


    
    function handleEnd(e) {
        if (e.target.tagName === 'A') {
            return;
        }
        if (!e.target.closest('.blurb')) {
            e.preventDefault();
        const menu = document.querySelector('.menu');
        const screenWidth = window.innerWidth;
        const target = e.target;
        
        if (target && target.closest('.change-area')) {
            toggleMenu();
            return ;
        }
        if (!menu.classList.contains('hidden') && !target.closest('.menu-overlay')) {
            toggleMenu();
            return ;
        }
        if (target && target.closest('.close-button')) {
            console.log('Close button clicked');
            slides[currentSlide].classList.add('hidden');
            let overlay = document.querySelector('.overlay');
            // overlay.classList.add('hidden');
            handleClose();
            nextSlide();
            return ;
        }
        if (target && target.closest('.fullscreen-button')) {
            fullScreen();
            return ;
        }
        if (startX <= screenWidth * 0.2) {
            prevSlide();
            return;
        } else if (startX >= screenWidth * 0.8 )  {
            getNextSlide();
            return;
        }

        endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        endY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
        const xMove = endX - startX;
        const yMove = endY - startY;

        if (Math.abs (xMove) > Math.abs(yMove)) {
            if (startX > endX + 10) {
                prevSlide();
            } else if (startX < endX - 10) {
                getNextSlide();
            }
        } else if (Math.abs(yMove) > 20) {
            if (!document.querySelector('.overlay') && Math.abs(yMove) > 10) {
                if (startY > endY + 10) {
                    console.log('Swiped up');
                    changeCollection(1);
                } else if (startY < endY - 10) {
                    console.log('Swiped down');
                    changeCollection(-1);
                }
            }
        } else if (!overlay) {
            document.querySelectorAll('.active').forEach(element => {
                element.classList.add('hidden');
            });
            console.log('going to overlay mode');
            overlay = document.querySelector('.overlay');
            slides.forEach (slide => slide.classList.add('paused'));
            showOverlay();
            return ;
        }
    }
}

    function showSlide(index) {
        const slides = document.querySelectorAll('.carousel-slide');
        slides.forEach((slide, i) => {
            if (index === i) {
                slide.classList.add('active');
                slide.classList.remove('hidden', 'disolve');
                slide.addEventListener('animationend', expandDone);
                // captionElement.textContent = `${edition} ${images[index].caption}`;
            }
        });
    }

    function expandDone(event) {
        const slide = event.target;
        slide.removeEventListener('animationend', expandDone);
        slide.classList.add('disolve', 'active');
        nextSlide();
        slide.addEventListener('animationend', disolveDone);
    }

    function disolveDone(event) {
        const slide = event.target;
        slide.removeEventListener('animationend', disolveDone);
        slide.classList.add('hidden');
        slide.classList.remove('disolve', 'active');
    }

    function nextSlide() {
        const activeSlides = document.querySelectorAll('.carousel-slide.active');
        activeSlides.forEach(activeSlide => {
            if (activeSlide && !document.querySelector('.overlay')) {
                // activeSlide.classList.remove('active', 'disolve');
                // activeSlide.classList.add('hidden');
            }
        });
        currentSlide = (currentSlide + 1) % slides.length;
        if (overlay) {
            updateOverlayImage();
        } else {
        showSlide(currentSlide);
        }
    }


    function getNextSlide() {
        const activeSlides = document.querySelectorAll('.carousel-slide.active');
        activeSlides.forEach(activeSlide => {
            if (activeSlide) {
                activeSlide.classList.remove('active', 'disolve');
                activeSlide.classList.add('hidden');
            }
        });
        currentSlide = (currentSlide + 1) % slides.length;
        if (overlay) {
            updateOverlayImage();
        } else {
        showSlide(currentSlide);
        }
    }

    function prevSlide() {
        const activeSlides = document.querySelectorAll('.carousel-slide.active');
        activeSlides.forEach(activeSlide => {
            if (activeSlide) {
                activeSlide.classList.remove('active', 'disolve');
                activeSlide.classList.add('hidden');
            }
        });
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        if (overlay) {
            updateOverlayImage();
        } else {
        showSlide(currentSlide);
        }
    }

    function updateOverlayImage() {
        overlay = document.querySelector('.overlay'); // Ensure overlay is reassigned
        // if (overlay) {
            const current = slides[currentSlide];
            const imageUrl = current.querySelector('img').src;
            const overlayImage = current.querySelector('img');
            if (overlayImage) {
                overlayImage.src = imageUrl;
            // }
            // const captionElement = overlay.querySelector('.caption');
            const blurbElement = document.querySelector('.blurb');
            function updateCaptionAndBlurb() {
                // captionElement.innerText = slides[currentSlide].getAttribute('data-caption');
                blurbElement.innerText = current.getAttribute('data-blurb');
            }
        updateCaptionAndBlurb();
        showOverlay();
        }
    }

    function updateViewport(userScalable) {
        let viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
            viewportMeta.setAttribute('content', `width=device-width, initial-scale=1.0, user-scalable=${userScalable}`);
        }
    }

    function fullScreen () {
        return new Promise((resolve) => {
            updateViewport('yes');
            const current = slides[currentSlide];
            const imageUrl = current.querySelector('img').src;                  

            const fullScreenOverlay = document.createElement('div');
            fullScreenOverlay.classList.add('fullscreen');
            fullScreenOverlay.innerHTML = `
            <div class="fullscreen">
                <img class="fullscreen-img" src="${imageUrl}">
                <div class="overlay-buttons-fullscreen">
                        <button class="close-button"><img src="icons/Less creative close icon .png"></button>
                </div
            </div>
        `;
        document.body.appendChild(fullScreenOverlay);
        const closeButton = document.querySelector('.fullscreen .close-button');

        closeButton.addEventListener('click', () => {
            console.log('Fullscreen button clicked');
            console.log('Fullscreen button clicked');
            fullScreenOverlay.remove();
            updateViewport('no');
            resolve();
        });
        });
    }

    function showOverlay() {
        return new Promise((resolve) => {
            // hideCaption();
            const current = slides[currentSlide];
            const imageUrl = current.querySelector('img').src;                  
            current.classList.add('hidden');
            // current.classList.add('overlay');
            slides[currentSlide].classList.remove('active');
            if (overlay) {
                overlay.remove();
            }
            overlay = document.createElement('div');
            overlay.classList.add('overlay');
            overlay.innerHTML = `

                <div class="overlay-content">
                    <img class="overlay-img" src="${imageUrl}">

                    <div class="overlay-buttons">
                        <button class="close-button"><img src="icons/Less creative close icon .png"></button>
                        <button class="fullscreen-button"><img src="icons/Less creative fullscreen icon .png"></button>
                    </div>
                </div>

                <div class="caption"></div>
                <div class="blurb"></div>
            `;
            document.body.appendChild(overlay);
            const overlayCaptionElement = document.querySelector('.caption');
            const blurbElement = document.querySelector('.blurb');
            overlayCaptionElement.innerText = current.getAttribute('data-caption');
            blurbElement.innerText = current.getAttribute('data-blurb');
            const menuImg = document.querySelector('.menu img');
            if (menuImg) {
                menuImg.style.right = 'auto';
                menuImg.style.left = '0';
            }
            overlayCaptionElement.style.touchAction = 'auto';   
            blurbElement.style.touchAction = 'auto';
            overlay.addEventListener('touchstart', handleStart);
            overlay.addEventListener('mousedown', handleStart);
            overlay.addEventListener('touchend', handleEnd);
            overlay.addEventListener('mouseup', handleEnd);
        });
    }     

    function handleClose() {
        overlay = document.querySelector('.overlay');
            // overlay.classList.add('hidden');
            overlay.remove();
            overlay = null; 
        slides[currentSlide].classList.add('hidden');
        slides.forEach( (slide) => {
            slide.classList.add('hidden');
            slide.classList.remove('paused');
        });
        nextSlide();
        return ;
    }

    // menuToggle.addEventListener('touchstart', handleStart);
    // menuToggle.addEventListener('mousedown', handleStart);      
    // menuToggle.addEventListener('touchend', handleEnd);
    // menuToggle.addEventListener('mouseup', handleEnd);
    menuToggle.addEventListener('click', toggleMenu);
    menuToggle.addEventListener('clcik', toggleMenu);      
    // menuToggle.addEventListener('touchend', handleEnd);
    // menuToggle.addEventListener('mouseup', handleEnd);

    carouselContainer.addEventListener('touchstart', handleStart);
    carouselContainer.addEventListener('mousedown', handleStart);      
    carouselContainer.addEventListener('touchend', handleEnd);
    carouselContainer.addEventListener('mouseup', handleEnd);
});