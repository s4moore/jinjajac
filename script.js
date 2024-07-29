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

        let currentSlide = 0;
        const slides = document.querySelectorAll('.carousel-slide');
        const totalSlides = slides.length;
        let disolveTimeout, nextSlideTimeout, slideInterval, startX, endX;
        let intervalStartTime, remainingTime = 4000;
        let disolveRemainingTime, nextSlideRemainingTime;

        function showSlide(index) {
            console.log(`Showing slide ${index}`);
            slides.forEach((slide, i) => {
                slide.classList.remove('active', 'expandAndMove', 'disolve');
                if (i === index) {
                    slide.classList.add('active', 'expandAndMove');
                    // Start disolve animation after expandAndMove finishes
                    nextSlideTimeout = setTimeout(() => {
                        console.log(`Starting disolve animation for slide ${index}`);
                        slide.classList.add('disolve');
                        // Delay moving to the next slide until disolve completes
                        disolveTimeout = setTimeout(() => {
                        }, 1000); // 2000ms is the duration of the disolve effect
                        slide.classList.remove('active');
                    }, 4000); // 5000ms is the duration of expandAndMove
                }
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
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
                    nextSlide();
                } else if (startX < endX - 10) {
                    intervalStartTime = Date.now();
                    prevSlide();
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