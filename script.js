document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = document.getElementById('loading-overlay');
    const captionElement = document.querySelector('.carousel-caption p');
    let images = [];
    const carouselContainer = document.querySelector('.carousel-container');
    let overlay = null;
    let slides = [];
    let currentSlide = 0;
    let collections = [];
    let currentCollection = 1;
    let collection;
    const edition = 6;
    // const menuToggle = document.getElementById('menu-toggle');
    const items = document.querySelector('.menu-overlay');
    const menuItems = document.querySelector('.menu-items');
    console.log(menuItems);
    const menu = document.querySelector('.menu');
    
    const addMenuItems = () => {
        const menuContent = `
            <div id="menu-items" class="menu-items">    
            <a class="menu-item" href="#"><img src="graphs/More about.png"></a>
            <a class="menu-item" href="#"><img src="graphs/Digital.png"></a>
            <a class="menu-item" href="#"><img src="graphs/Concrete .png"></a>
            <a class="menu-item" href="#"><img src="graphs/Lightings .png"></a>
            <a class="menu-item" href="#"><img src="graphs/Shop.png"></a>
            <a class="menu-item" href="#"><img src="graphs/Connect.png"></a>
            </div>
        `;
        items.innerHTML = menuContent;
    };

    const removeMenuItems = () => {
        items.innerHTML = '';
    };
    
    // menuToggle.addEventListener('click', () => {
    //     console.log('Menu toggle clicked');
    //     console.log(items.style.display);
    //     if (items.style.display === 'none') {
    //         items.style.display = 'flex';
    //         addMenuItems();
    //     } else {
    //         items.style.display = 'none';
    //         removeMenuItems();
    //     }
    // });

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
            slide.innerHTML = `
            <img src="${collection}/${image.src}" alt="Image ${index + 1}">
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
        fetch(`${collection}.json`)
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
        videoElement.autoplay = true;
        videoElement.muted = true;
        videoElement.style.objectFit = 'scale-down';
    
        // Create a source element
        const sourceElement = document.createElement('source');
        sourceElement.src = isLandscape ? "/back/landscape.mp4" : "/back/portrait.mp4";
        sourceElement.type = 'video/mp4';
    
        // Append the source element to the video element
        videoElement.appendChild(sourceElement);
    
        // Remove any existing video elementstoggle
    
        // Add the new video element
        videoElement.classList.add('background-video');
        document.body.appendChild(videoElement);
    
        // Ensure the video plays
        videoElement.play().catch(error => {
            console.error('Error attempting to play the video:', error);
        });
    }

    // Set the initial background video
    setBackgroundVideo();

    window.addEventListener('resize', setBackgroundVideo);
    
        console.log('Script loaded and executed')

        function handleStart(e) {
            if (e.target !== '.blurb') {
                console.log('Event target is not within .overlay .blurb');
                e.preventDefault();
                startX = e.touches ? e.touches[0].clientX : e.clientX;
                startY = e.touches ? e.touches[0].clientY : e.clientY;
                // slides[currentSlide].classList.remove('hidden');
            }
        }
        
        function handleEnd(e) {
            e.preventDefault();
            const screenWidth = window.innerWidth;

            const target = e.target;
            if (target && target.closest('.close-button')) {
                console.log('Close button clicked');
                handleClose();
                return ;
            }
            if (target && target.closest('.fullscreen-button')) {
                toggleFullscreen();
                return ;
            }
            if (startX <= screenWidth * 0.1) {
                prevSlide();
                return;
            } else if (startX >= screenWidth * 0.9 )  {
                getNextSlide();
                return;
            }

            if (!e.target.closest('.overlay .blurb')) {
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
            slides.forEach (slide => slide.classList.add('paused'));
            showOverlay();
        }
        }
    }

        // let slides = [];
        // let currentSlide = 0;


        function showSlide(index) {
            const slides = document.querySelectorAll('.carousel-slide');
            slides.forEach((slide, i) => {
                if (index === i) {
                    slide.classList.add('active');
                    slide.classList.remove('hidden', 'disolve');
                    slide.addEventListener('animationend', expandDone); // Add event listener to the first slide
                    captionElement.textContent = `${edition} ${images[index].caption}`;

                 }// else {
                //     slide.classList.remove('active');
                // }
            });
        }


            let startX, endX, startY, endY, touchTimer;

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
                if (overlay) {
                    const current = slides[currentSlide];
                    const imageUrl = current.querySelector('img').src;
                    const overlayImage = overlay.querySelector('img');
                    if (overlayImage) {
                        overlayImage.src = imageUrl;
                    }
                    const captionElement = overlay.querySelector('.caption');
                    const blurbElement = overlay.querySelector('.blurb');
        
                            // Function to update caption and blurb
                    function updateCaptionAndBlurb() {
                        captionElement.innerText = slides[currentSlide].getAttribute('data-caption');
                        blurbElement.innerText = slides[currentSlide].getAttribute('data-blurb');
                    }

                updateCaptionAndBlurb();
                showOverlay();
                }
            }

            function showOverlay() {
                return new Promise((resolve) => {
                    hideCaption();
                    const current = slides[currentSlide];
                    const imageUrl = current.querySelector('img').src;

                    
                    current.classList.add('hidden');
                    slides[currentSlide].classList.remove('active');
                    if (overlay) {
                        overlay.remove();
                    }
                    overlay = document.createElement('div');
                    overlay.classList.add('overlay');

                    overlay.innerHTML = `
                        <button id="fullscreenOverlay" class="fullscreen-button"><img height="20px" src="graphs/Fullscreen .png"></button>
                        <button id="closeOverlay" class="close-button"><img height="20px" src="graphs/Close.png"></button>
                        <div class="overlay-content">
                        <img src="${imageUrl}">
                        <div class="caption"></div>
                        <div class="blurb"></div>
                        </div>
                    `;
                    const overlayCaptionElement = overlay.querySelector('.caption');
                    const blurbElement = overlay.querySelector('.blurb');

                    const menuImg = document.querySelector('.menu img');
                    if (menuImg) {
                        menuImg.style.right = 'auto';
                        menuImg.style.left = '0';
                    }

                    if (overlayCaptionElement) {
                        overlayCaptionElement.style.touchAction = 'auto';
                    }
                    
                    if (blurbElement) {
                        blurbElement.style.touchAction = 'auto';
                    }                    
                    // Access data attributes
                    overlayCaptionElement.innerText = current.getAttribute('data-caption');
                    blurbElement.innerText = current.getAttribute('data-blurb');
                    if (document.querySelector('.overlay')) {
                    document.body.replaceChild(overlay);
                    } else {
                        document.body.appendChild(overlay);
                    }

                    document.querySelector('.close-button').addEventListener('click', () => {
                        handleClose();
                        resolve();
                    });
                    document.querySelector('.fullscreen-button').addEventListener('click', () => {
                        overlayCaptionElement.style.display = 'none';
                        blurbElement.style.display = 'none';
                        toggleFullscreen();
                    });
                    overlay.addEventListener('touchstart', handleStart);
                    overlay.addEventListener('mousedown', handleStart);
                    overlay.addEventListener('touchend', handleEnd);
                    overlay.addEventListener('mouseup', handleEnd);
                });
            }     

            function hideCaption() {
                const caption = document.querySelector('.carousel-caption p');
                if (caption){
                    caption.classList.add('hidden');
                }
            }

            function showCaption() {
                const caption = document.querySelector('.carousel-caption p');
                if (caption){
                    caption.classList.remove('hidden');
                }
            }

            function handleClose() {
                if (document.querySelector('.fullscreen')) {                
                        toggleFullscreen();
                    }
                // if (overlay) {
                    overlay.classList.add('hidden');
                    overlay.remove();
                    overlay = null; 
                // }
                slides.forEach(slide => slide.classList.remove('paused'));
                const menuImg = document.querySelector('.menu img');
                if (menuImg) {
                    menuImg.style.right = '0';
                    menuImg.style.left = 'auto';
                }
                showCaption();
                nextSlide();
                return ;
            }

            function toggleFullscreen() {
                // overlay = document.querySelector('.overlay'); // Reassign the overlay variable                
                // overlay.classList.toggle('fullscreen');
                const overlayCaptionElement = overlay.querySelector('.caption');

                // Get caption and blurb elements
                // const captionElement = overlay.querySelector('.caption');
                const blurbElement = overlay.querySelector('.blurb');
            
                // Check if fullscreen mode is active
                if (overlay.classList.contains('fullscreen')) {
                    // Hide caption and blurb
                    overlayCaptionElement.style.display = 'block';
                    blurbElement.style.display = 'block';
                    overlay.classList.remove('fullscreen');
                    overlay.classList.remove('.fullscreen img');
                    overlay.classList.add('.overlay img');
                } else {
                    // Show caption and blurb
                    overlayCaptionElement.style.display = 'none';
                    blurbElement.style.display = 'none';
                    overlay.classList.remove('.overlay img');

                    overlay.classList.add('fullscreen', '.fullscreen img');
                }
                // updateOverlayImage();
                }

    menu.addEventListener('touchstart', handleStart);
    menu.addEventListener('mousedown', handleStart);      
    menu.addEventListener('touchend', handleEnd);
    menu.addEventListener('mouseup', handleEnd);


    carouselContainer.addEventListener('touchstart', handleStart);
    carouselContainer.addEventListener('mousedown', handleStart);      
    carouselContainer.addEventListener('touchend', handleEnd);
    carouselContainer.addEventListener('mouseup', handleEnd);

});