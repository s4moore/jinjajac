document.addEventListener('DOMContentLoaded', () => {
    let backgroundSlides = [];
    let backgroundCurrentSlide = 0;
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
    const menuToggle = document.getElementById('menu-toggle');
    const items = document.querySelector('.menu-overlay');
    const menuItems = document.querySelector('.menu-items');
    console.log(menuItems);
    
    // const video = document.getElementById('background-video');
    // video.preload = 'auto';
    // video.playbackRate = 0.25;

    // const enableMenuAnchors = () => {
    //     const anchors = menuItems.querySelectorAll('a');
    //     console.log(anchors);
    //     anchors.forEach(anchor => {
    //         anchor.style.pointerEvents = 'auto';
    //     });
    // };

    // // Function to disable pointer events for anchors
    // const disableMenuAnchors = () => {
    //     const anchors = menuItems.querySelectorAll('a');
    //     anchors.forEach(anchor => {
    //         anchor.style.pointerEvents = 'none';
    //     });
    // };

    // disableMenuAnchors();
    
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
    
    menuToggle.addEventListener('click', () => {
        console.log('Menu toggle clicked');
        console.log(items.style.display);
        if (items.style.display === 'none') {
            items.style.display = 'flex';
            addMenuItems();
        } else {
            items.style.display = 'none';
            removeMenuItems();
        }
    });

    const landscapeVideo = "back/landscape.mp4";


    const portraitVideo = "back/1920x1080 low res portrait .mp4";



    // function createBackgroundSlides(images) {
    //     const carousel = document.querySelector('.background-slideshow');
    //     images.forEach((image, index) => {
    //         const slide = document.createElement('div');
    //         slide.classList.add('background-slide');
    //         slide.innerHTML = `
    //             <img src="back/${image}" alt="Image ${index + 1}">
    //         `;
    //         slide.style.display = 'none'; // Hide all slides initially
    //         carousel.appendChild(slide);
    //         backgroundSlides.push(slide);
    //         console.log(`Slide created for image: ${image}`);
    //     });
    // }

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


    // function fetchBackgroundImages() {
    //     fetch('background.json')
    //         .then(response => response.json())
    //         .then(data => {
    //             createBackgroundSlides(data);
    //             changeBackgroundImage();
    //             setInterval(changeBackgroundImage, 2000);
    //         })
    //         .catch(error => console.error('Error fetching images:', error));
    // }

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
    // fetchBackgroundImages(collection);

    changeCollection(currentCollection);

    function setBackgroundVideo() {
        const isLandscape = window.matchMedia("(orientation: landscape)").matches;
        const videoElement = document.createElement('video'); // Create a new video element
        videoElement.style.position = 'absolute';
        videoElement.style.top = '0';
        videoElement.style.left = '0';
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        videoElement.style.objectFit = 'cover';
        videoElement.preload = 'auto';
        videoElement.playbackRate = 2;
        videoElement.loop = true;
        videoElement.autoplay = true;
        videoElement.muted = true;
    
        // Create a source element
        const sourceElement = document.createElement('source');
        sourceElement.src = isLandscape ? "/back/landscape.mp4" : "/back/portrait.mp4";
        sourceElement.type = 'video/mp4';
    
        // Append the source element to the video element
        videoElement.appendChild(sourceElement);
    
        // Remove any existing video elements
        const existingVideo = document.querySelector('.background-video');
        if (existingVideo) {
            existingVideo.remove();
        }
    
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
    
    console.log('script starts');
    // if (!window.scriptExecuted) {
    //     window.scriptExecuted = true;
        console.log('Script loaded and executed')

        function handleStart(e) {
            if (!e.target.closest('.overlay .blurb')) {
                console.log('Event target is not within .overlay .blurb');
            e.preventDefault();
            }
            const target = e.target;
            if (target && target.classList.contains('close-button')) {
                handleClose();
                return ;
            }
            if (target && target.classList.contains('fullscreen-button')) {
                toggleFullscreen();
                return ;
            }
            const screenWidth = window.innerWidth;
            startX = e.touches ? e.touches[0].clientX : e.clientX;
            startY = e.touches ? e.touches[0].clientY : e.clientY;
            if (startX <= screenWidth * 0.1) {
                clearTimeout(touchTimer);
                prevSlide();
                return;
            } else if (startX >= screenWidth * 0.9 && (!target || target.id !== 'fullscreenOverlay')) {
                clearTimeout(touchTimer);
                getNextSlide();
                return;
            }
            if (!overlay || document.querySelector('.fullscreen')) {        
            touchTimer = setTimeout(async function() {            
                endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
                endY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
                const xMove = endX - startX;
                const yMove = endY - startY;
    
                slides[currentSlide].classList.add('hidden',);
                slides.forEach(slide => slide.classList.add('paused'));
                if (document.querySelector('.fullscreen') || Math.abs(xMove) > 10 || Math.abs(yMove) > 10) {
                    toggleFullscreen();
                    return ;
                }
                await showOverlay();
            }, 250);
        }
            slides[currentSlide].classList.remove('hidden');
        }
        
        function handleEnd(e) {
            if (e.target.classList.contains('fullscreen-button') || e.target.classList.contains('close-button')) {
                return ;
            }

            if (!e.target.closest('.overlay .blurb')) {
            e.preventDefault();
            clearTimeout(touchTimer);
            endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
            endY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
            const xMove = endX - startX;
            const yMove = endY - startY;

            if (!document.querySelector('.overlay')) {
                slides.forEach(slide => slide.classList.remove('paused'));
            }   
            if (Math.abs (xMove) > Math.abs(yMove)) {
                if (startX > endX + 10) {
                    prevSlide();
                } else if (startX < endX - 10) {
                    getNextSlide();
                }
            } else if (Math.abs(yMove) > 20) {
            if (Math.abs(startY - endY) > 10) {
                if (startY > endY + 10) {
                    console.log('Swiped up');
                    changeCollection(1);
                } else if (startY < endY - 10) {
                    console.log('Swiped down');
                    changeCollection(-1);
                }
            }
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
                if (document.querySelector('.overlay')) {
                    updateOverlayImage();
                } else {
                showSlide(currentSlide);
                }
            }

            
            function getNextSlide() {
                const activeSlides = document.querySelectorAll('.carousel-slide.active');
                activeSlides.forEach(activeSlide => {
                    if (activeSlide && !document.querySelector('.overlay')) {
                        activeSlide.classList.remove('active', 'disolve');
                        activeSlide.classList.add('hidden');
                    }
                });
                currentSlide = (currentSlide + 1) % slides.length;
                if (document.querySelector('.overlay')) {
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
                if (document.querySelector('.overlay')) {
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

        // Initial update of caption and blurb
        updateCaptionAndBlurb();
                }
            }

            function showOverlay() {
                return new Promise((resolve) => {
                    hideCaption();
                    const current = slides[currentSlide];
                    const imageUrl = current.querySelector('img').src;

                    
                    current.classList.add('hidden');
                    slides[currentSlide].classList.remove('active');
                    overlay = document.createElement('div');
                    overlay.classList.add('overlay');

                    overlay.innerHTML = `
                        <button id="fullscreenOverlay" class="fullscreen-button">&#x26F6;</button>
                        <button id="closeOverlay" class="close-button">&times;</button>
                        <div class="overlay-content">
                        <img src="${imageUrl}">
                        <div class="caption"></div>
                        <div class="blurb"></div>
                        </div>
                    `;
                    const overlayCaptionElement = overlay.querySelector('.caption');
                    const blurbElement = overlay.querySelector('.blurb');

                    
                    if (overlayCaptionElement) {
                        overlayCaptionElement.style.touchAction = 'auto';
                    }
                    
                    if (blurbElement) {
                        blurbElement.style.touchAction = 'auto';
                    }                    
                    // Access data attributes
                    overlayCaptionElement.innerText = current.getAttribute('data-caption');
                    blurbElement.innerText = current.getAttribute('data-blurb');
                   
                    document.body.appendChild(overlay);

                    document.getElementById('closeOverlay').addEventListener('click', () => {
                        handleClose();
                        resolve();
                    });
                    document.getElementById('fullscreenOverlay').addEventListener('click', () => {
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
                if (overlay) {
                    overlay.remove();
                    overlay = null; 
                }
                slides.forEach(slide => slide.classList.remove('paused'));
                showCaption();
                nextSlide();
                return ;
            }

            function toggleFullscreen() {
                overlay = document.querySelector('.overlay'); // Reassign the overlay variable                
                overlay.classList.toggle('fullscreen');
                const overlayCaptionElement = overlay.querySelector('.caption');

                // Get caption and blurb elements
                // const captionElement = overlay.querySelector('.caption');
                const blurbElement = overlay.querySelector('.blurb');
            
                // Check if fullscreen mode is active
                if (overlay.classList.contains('fullscreen')) {
                    // Hide caption and blurb
                    overlayCaptionElement.style.display = 'none';
                    blurbElement.style.display = 'none';
                } else {
                    // Show caption and blurb
                    overlayCaptionElement.style.display = 'block';
                    blurbElement.style.display = 'block';
                }
                }


    carouselContainer.addEventListener('touchstart', handleStart);
    carouselContainer.addEventListener('mousedown', handleStart);      
    carouselContainer.addEventListener('touchend', handleEnd);
    carouselContainer.addEventListener('mouseup', handleEnd);

});