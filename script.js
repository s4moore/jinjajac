document.addEventListener('DOMContentLoaded', () => {
    let backgroundSlides = [];
    let backgroundCurrentSlide = 0;
    const loadingOverlay = document.getElementById('loading-overlay');
    // const video = document.getElementById('background-video');
    const captionElement = document.querySelector('.carousel-caption p');
    let images = [];
    // video.preload = 'auto';
    // video.playbackRate = 0.25;
    const carouselContainer = document.querySelector('.carousel-container');
    let slidesCreated = false;
    let overlay = null;
    let slides = [];
    let currentSlide = 0;


    function changeBackgroundImage() {
        backgroundSlides.forEach((slide, index) => {
            slide.style.display = index === backgroundCurrentSlide ? 'block' : 'none';
        });
        backgroundCurrentSlide = (backgroundCurrentSlide + 1) % backgroundSlides.length;
    }

    function createBackgroundSlides(images) {
        const carousel = document.querySelector('.background-slideshow');
        images.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.classList.add('background-slide');
            slide.innerHTML = `
                <img src="back/${image}" alt="Image ${index + 1}">
            `;
            slide.style.display = 'none'; // Hide all slides initially
            carousel.appendChild(slide);
            backgroundSlides.push(slide);
            console.log(`Slide created for image: ${image}`);
        });
    }

    function fetchImages() {
        fetch('background.json')
            .then(response => response.json())
            .then(data => {
                createBackgroundSlides(data);
                // Initial background image
                changeBackgroundImage();
                // Change background image every 5 seconds
                setInterval(changeBackgroundImage, 1000);
            })
            .catch(error => console.error('Error fetching images:', error));
    }

    fetchImages();



    console.log('script starts');
    // if (!window.scriptExecuted) {
    //     window.scriptExecuted = true;
        console.log('Script loaded and executed')

        function handleStart(e) {
            e.preventDefault();
            const target = e.target;
            if (target && target.id === 'closeOverlay') {
                handleClose();
                return ;
            }
            if (target && target.id === 'fullscreenOverlay') {
                toggleFullscreen();
                return ;
            }
            const screenWidth = window.innerWidth;
            startX = e.touches ? e.touches[0].clientX : e.clientX;
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
                slides[currentSlide].classList.add('hidden',);
                slides.forEach(slide => slide.classList.add('paused'));
                if (document.querySelector('.fullscreen')) {
                    toggleFullscreen();
                    return ;
                }
                await showOverlay();
            }, 250);
        }
            slides[currentSlide].classList.remove('hidden');
        }
        
        function handleEnd(e) {
            e.preventDefault();
            clearTimeout(touchTimer);
            endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
            if (!document.querySelector('.overlay')) {
                slides.forEach(slide => slide.classList.remove('paused'));
            }   
            if (Math.abs(startX - endX) > 10) {
                if (startX > endX + 10) {
                    prevSlide();
                } else if (startX < endX - 10) {
                    getNextSlide();
                }
            }
        }

        // let slides = [];
        // let currentSlide = 0;

        function createSlides(data) {
            if (!slides.length){
            const carousel = document.querySelector('.carousel');
            data.forEach((image, index) => {
                const slide = document.createElement('div');
                slide.classList.add('carousel-slide');
                slide.innerHTML = `
                <img src="Early24/${image.src}" alt="Image ${index + 1}">
            `;
                slide.setAttribute('data-caption', image.caption || '');
                slide.setAttribute('data-blurb', image.blurb || '');
                carousel.appendChild(slide);
                slides.push(slide);
                console.log(`Slide created for image: ${image.src}`);
            });
            slides = document.querySelectorAll('.carousel-slide');
        }
        }

        function showSlide(index) {
            const slides = document.querySelectorAll('.carousel-slide');
            slides.forEach((slide, i) => {
                if (index === i) {
                    slide.classList.add('active');
                    slide.classList.remove('hidden', 'disolve');
                    slide.addEventListener('animationend', expandDone); // Add event listener to the first slide
                    captionElement.textContent = images[index].caption;

                 }// else {
                //     slide.classList.remove('active');
                // }
            });
        }


            let startX, endX, touchTimer;

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
                return ;
            }

            function toggleFullscreen() {
                overlay = document.querySelector('.overlay'); // Reassign the overlay variable                
                overlay.classList.toggle('fullscreen');

                // Get caption and blurb elements
                // const captionElement = overlay.querySelector('.caption');
                const blurbElement = overlay.querySelector('.blurb');
            
                // Check if fullscreen mode is active
                if (overlay.classList.contains('fullscreen')) {
                    // Hide caption and blurb
                    captionElement.style.display = 'none';
                    blurbElement.style.display = 'none';
                } else {
                    // Show caption and blurb
                    captionElement.style.display = 'block';
                    blurbElement.style.display = 'block';
                }
                }
        
    // if (video.readyState >= 4) {
    //         loadingOverlay.style.display = 'none';
    //         fetch('images.json')
    //         .then(response => response.json())
    //         .then(data => {
    //             images = data;
    //             if (!slidesCreated) {
    //                 slidesCreated = true;
    //                 createSlides(images);
    //                 nextSlide(); // Show the first slide initially
    //             }
    //         })
    //         .catch(error => {
    //             console.error('Error loading images:', error);
    //         });
    //     } else {
    // video.addEventListener('canplaythrough', () => {
    //     if (loadingOverlay) {
    //     }
        fetch('Early24.json')
        .then(response => response.json())
        .then(data => {
            images = data;
            // if (!slidesCreated) {
                slidesCreated = true;
                loadingOverlay.style.display = 'none';

            createSlides(images);
            nextSlide(); // Show the first slide initially
            // }
        })
        .catch(error => {
            console.error('Error loading images:', error);
        });

    carouselContainer.addEventListener('touchstart', handleStart);
    carouselContainer.addEventListener('mousedown', handleStart);      
    carouselContainer.addEventListener('touchend', handleEnd);
    carouselContainer.addEventListener('mouseup', handleEnd);

});