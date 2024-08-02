    const loadingOverlay = document.getElementById('loading-overlay');
    const video = document.getElementById('background-video');
    const carouselContainer = document.querySelector('.carousel-container');
    let slidesCreated = false; 
    console.log('script starts');
    if (!window.scriptExecuted) {
        window.scriptExecuted = true;
        console.log('Script loaded and executed')
    
    video.preload = 'auto';
    video.playbackRate = 0.25;


        let slides = [];
        let currentSlide = 0;

        function createSlides(images) {
            if (!slides.length){
            const carousel = document.querySelector('.carousel');
            images.forEach((image, index) => {
                const slide = document.createElement('div');
                slide.classList.add('carousel-slide');
                slide.innerHTML = `<img src="images/${image}" alt="Image ${index + 1}">`;
                carousel.appendChild(slide);
            });
            slides = document.querySelectorAll('.carousel-slide');
        }
        }

        const totalSlides = slides.length;
        function showSlide(index) {
            slides.forEach((slide, i) => {
                if (index === i) {
                    slide.classList.add('active');
                    slide.classList.remove('hidden', 'disolve');
                    slide.addEventListener('animationend', expandDone); // Add event listener to the first slide
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
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            }

            function prevSlide() {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                showSlide(currentSlide);
            }
    
            function showOverlay() {
                return new Promise((resolve) => {
                    const current = slides[currentSlide];
                    const imageUrl = current.querySelector('img').src;
                    current.classList.add('hidden');
                    slides[currentSlide].classList.remove('active');
                    const overlay = document.createElement('div');
                    overlay.classList.add('overlay');
                    overlay.innerHTML = `
                        <img src="${imageUrl}";">
                        <button id="closeOverlay" class="close-button">&times;</button>
                    `;
                    document.body.appendChild(overlay);

                    document.getElementById('closeOverlay').addEventListener('click', () => {
                        handleClose(currentSlide);
                        resolve();
                    });
                });
            }     

            function handleClose() {
                const overlay = document.querySelector('.overlay');
                if (overlay) {
                    overlay.remove();
                }
                slides.forEach(slide => slide.classList.remove('paused'));
                nextSlide();
            }

            function handleStart(e) {
                e.preventDefault();
                startX = e.touches ? e.touches[0].clientX : e.clientX;
                slides.forEach(slide => slide.classList.add('paused'));
            
                touchTimer = setTimeout(async function() {
                    slides[currentSlide].classList.add('hidden',);
                    await showOverlay();
                }, 2500);
                slides[currentSlide].classList.remove('hidden');
                startX = e.touches ? e.touches[0].clientX : e.clientX;
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
                        const activeSlides = document.querySelectorAll('.carousel-slide.active');
                        activeSlides.forEach(activeSlide => {
                            if (activeSlide) {
                                activeSlide.classList.remove('active', 'disolve');
                                activeSlide.classList.add('hidden');
                            }
                        });
                        prevSlide();
                    } else if (startX < endX - 10) {
                        const activeSlides = document.querySelectorAll('.carousel-slide.active');
                        activeSlides.forEach(activeSlide => {
                            if (activeSlide) {
                                activeSlide.classList.remove('active', 'disolve');
                                activeSlide.classList.add('hidden');
                            }
                        });
                        nextSlide();
                    }
                }
            }


    // })
    // .catch(error => console.error('Error fetching images:', error));
    if (video.readyState >= 4) {
            loadingOverlay.style.display = 'none';
            fetch('images.json')
            .then(response => response.json())
            .then(images => {
                if (!slidesCreated) {
                    slidesCreated = true;
                createSlides(images);
                showSlide(0); // Show the first slide initially
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
        .then(images => {
            if (!slidesCreated) {
                slidesCreated = true;
            createSlides(images);
            showSlide(0); // Show the first slide initially
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