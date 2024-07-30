// script.js
fetch('images.json')
    .then(response => response.json())
    .then(images => {
        const carousel = document.querySelector('.carousel');
        images.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.classList.add('carousel-slide');
            if (index === 0) slide.classList.add('active');
            slide.innerHTML = `<img src="images/${image}" alt="Image ${index + 1}">`;
            carousel.appendChild(slide);
        });

        let currentSlide = -1;
        const slides = document.querySelectorAll('.carousel-slide');
        const totalSlides = slides.length;
        let disolveTimeout, nextSlideTimeout, startX, endX;
        let intervalStartTime, remainingTime = 4000;
        let disolveRemainingTime = 0, nextSlideRemainingTime = 0;
        let slideInterval = setInterval(nextSlide, 4000); // Automatically move to the next slide every 4000ms

        function showSlide(index) {
            console.log(`Showing slide ${index}`);
            slides.forEach((slide, i) => {

                if (i === index) {
                    slide.classList.add('active');
                    slide.classList.remove('hidden');
                    console.log(`Slide ${i} is now active`);
                    // Start disolve animation after expandAndMove finishes
                    nextSlideTimeout = setTimeout(() => {
                        if (!slide.classList.contains('hidden')) {
                            slide.classList.add('disolve');
                        }
                        disolveTimeout = setTimeout(() => {
                            console.log(`Slide ${i} prev class removed`);
                            // slide.classList.remove('disolve');
                            slide.classList.remove('disolve');
                            slide.classList.remove('active');
                        }, 2500);
                    }, 4000); // 4000ms is the duration of expandAndMove
                }   
            });
        }

        function nextSlide() {
            // clearTimeout(disolveTimeout);
            // clearTimeout(nextSlideTimeout);
            currentSlide = (currentSlide + 1) % totalSlides;
            // currentSlide.classList.remove('hidden');
            showSlide(currentSlide);
        }

        function getNextSlide() {
            const activeSlides = document.querySelectorAll('.active');
            activeSlides.forEach(activeSlide => {
                // Your logic for each active slide
                if (activeSlide) {
                    // Example: Remove 'active' class from each active slide
                    activeSlide.classList.remove('active', 'disolve');
                    activeSlide.classList.add('hiddne');
                }
            });
            clearTimeout(disolveTimeout);
            clearTimeout(nextSlideTimeout);
            currentSlide = (currentSlide + 1) % totalSlides;
            // currentSlide.classList.remove('hidden');

            showSlide(currentSlide);
        }

        function prevSlide() {
        const activeSlides = document.querySelectorAll('.active');
        activeSlides.forEach(activeSlide => {
            // Your logic for each active slide
            if (activeSlide) {
                // Example: Remove 'active' class from each active slide
                activeSlide.classList.remove('active', 'disolve');
                activeSlide.classList.add('hiddne');
            }
        });
            clearTimeout(disolveTimeout);
            clearTimeout(nextSlideTimeout);
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            // currentSlide.classList.remove('hidden');

            showSlide(currentSlide);
        }

        // Swipe detection

        
        const carouselContainer = document.querySelector('.carousel-container');
        
        function handleStart(e) {
            e.preventDefault();
            startX = e.touches ? e.touches[0].clientX : e.clientX;
            slides.forEach(slide => slide.classList.add('paused'));
            clearInterval(slideInterval);
            disolveRemainingTime = disolveTimeout ? disolveTimeout - Date.now() : 0;
            nextSlideRemainingTime = nextSlideTimeout ? nextSlideTimeout - Date.now() : 0;
            clearTimeout(disolveTimeout);
            clearTimeout(nextSlideTimeout);
            remainingTime -= Date.now() - intervalStartTime;
        }
        
        function handleEnd(e) {
            e.preventDefault();
            endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
            slides.forEach(slide => slide.classList.remove('paused'));
        
            if (Math.abs(startX - endX) > 10) {
                if (startX > endX + 10) {
                    intervalStartTime = Date.now();
                    prevSlide();
                } else if (startX < endX - 10) {
                    intervalStartTime = Date.now();
                    getNextSlide();
                }
                slideInterval = setTimeout(() => {
                    nextSlide();
                    slideInterval = setInterval(nextSlide, 4000);
                }, remainingTime);
            } else {
                // Restore the disolve and next slide timeouts if no swipe is detected
                disolveTimeout = setTimeout(() => {
                    // Your disolve function here
                }, disolveRemainingTime);
                nextSlideTimeout = setTimeout(() => {
                    nextSlide();
                }, nextSlideRemainingTime);
            }
        
            intervalStartTime = Date.now();
            remainingTime = 4000;
        }
        
        carouselContainer.addEventListener('touchstart', handleStart);
        carouselContainer.addEventListener('mousedown', handleStart);
        
        carouselContainer.addEventListener('touchend', handleEnd);
        carouselContainer.addEventListener('mouseup', handleEnd);
    })
    .catch(error => console.error('Error fetching images:', error));