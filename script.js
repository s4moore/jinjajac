    const loadingOverlay = document.getElementById('loading-overlay');
    const video = document.getElementById('background-video');
    const captionElement = document.querySelector('.carousel-caption');
    let images = [];
    video.preload = 'auto';
    video.playbackRate = 0.25;
    const carouselContainer = document.querySelector('.carousel-container');
    let slidesCreated = false;
    let overlay = null;

    console.log('script starts');
    if (!window.scriptExecuted) {
        window.scriptExecuted = true;
        console.log('Script loaded and executed')

        function handleStart(e) {
            e.preventDefault();
            const target = e.target;
            if (target && target.id === 'closeOverlay') {
                handleClose();
                return;
            }
            const screenWidth = window.innerWidth;
            startX = e.touches ? e.touches[0].clientX : e.clientX;
            if (startX <= screenWidth * 0.1) {
                clearTimeout(touchTimer);
                prevSlide();
                return;
            } else if (startX >= screenWidth * 0.9) {
                clearTimeout(touchTimer);
                nextSlide();
                return;
            }          
            touchTimer = setTimeout(async function() {
                slides[currentSlide].classList.add('hidden',);
                slides.forEach(slide => slide.classList.add('paused'));
                await showOverlay();
            }, 250);
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
                    nextSlide();
                }
            }
        }

        let slides = [];
        let currentSlide = 0;

        function createSlides(images) {
            if (!slides.length){
            const carousel = document.querySelector('.carousel');
            images.forEach((image, index) => {
                const slide = document.createElement('div');
                slide.classList.add('carousel-slide');
                slide.innerHTML = `
                <img src="images/${image.src}" alt="Image ${index + 1}">
            `;
                carousel.appendChild(slide);
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

                } else {
                    // slide.classList.remove('active');
                }
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
                    if (activeSlide) {
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
                const newImageUrl = slides[currentSlide].querySelector('img').src;
                overlay.querySelector('img').src = newImageUrl;
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
                        <img src="${imageUrl}">
                        <button id="closeOverlay" class="close-button">&times;</button>
                    `;
                    document.body.appendChild(overlay);

                    document.getElementById('closeOverlay').addEventListener('click', () => {
                        handleClose();
                        resolve();
                    });
                    overlay.addEventListener('touchstart', handleStart);
                    overlay.addEventListener('mousedown', handleStart);
                    overlay.addEventListener('touchend', handleEnd);
                    overlay.addEventListener('mouseup', handleEnd);
                });
            }     

            function hideCaption() {
                const caption = document.querySelector('.carousel-caption');
                if (caption){
                    caption.classList.add('hidden');
                }
            }

            function showCaption() {
                const caption = document.querySelector('.carousel-caption');
                if (caption){
                    caption.classList.remove('hidden');
                }
            }

            function handleClose() {
                // if (overlay) {
                    overlay.remove();
                    overlay = null; 
                // }
                slides.forEach(slide => slide.classList.remove('paused'));
                showCaption();
            }

    if (video.readyState >= 4) {
            loadingOverlay.style.display = 'none';
            fetch('images.json')
            .then(response => response.json())
            .then(data => {
                images = data;
                if (!slidesCreated) {
                    slidesCreated = true;
                    createSlides(images);
                    nextSlide(); // Show the first slide initially
                }
            })
            .catch(error => {
                console.error('Error loading images:', error);
            });
        } else {
    video.addEventListener('canplaythrough', () => {
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
        fetch('images.json')
        .then(response => response.json())
        .then(data => {
            images = data;
            if (!slidesCreated) {
                slidesCreated = true;
            createSlides(images);
            nextSlide(); // Show the first slide initially
            }
        })
        .catch(error => {
            console.error('Error loading images:', error);
        });
        });
    }

    carouselContainer.addEventListener('touchstart', handleStart);
    carouselContainer.addEventListener('mousedown', handleStart);      
    carouselContainer.addEventListener('touchend', handleEnd);
    carouselContainer.addEventListener('mouseup', handleEnd);
    }