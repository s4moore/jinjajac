// script.js
fetch('images.json')
    .then(response => response.json())
    .then(images => {
        const carousel = document.querySelector('.carousel');
        images.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.classList.add('carousel-slide');
            if (index === 0) {
                slide.classList.add('active');
                slide.addEventListener('animationend', expandDone); // Add event listener to the first slide
            }
            slide.innerHTML = `<img src="images/${image}" alt="Image ${index + 1}">`;
            carousel.appendChild(slide);
        });

        let currentSlide = 0;
        const slides = document.querySelectorAll('.carousel-slide');
        const totalSlides = slides.length;
        let startX, endX;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                if (i === index) {
                    slide.classList.add('active');
                    slide.classList.remove('hidden');
                    slide.addEventListener('animationend', expandDone);
                } else {
                    slide.classList.remove('active', 'disolve');
                    slide.classList.add('hidden');
                }
            });
        }

        function expandDone(event) {
            const slide = event.target;
            slide.removeEventListener('animationend', expandDone);
            slide.classList.add('disolve');
            slide.addEventListener('animationend', disolveDone);
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }

        function disolveDone(event) {
            const slide = event.target;
            slide.removeEventListener('animationend', disolveDone);
            slide.classList.add('hidden');
            nextSlide();
        }

        function getNextSlide() {
            const activeSlides = document.querySelectorAll('.carousel-slide.active');
            activeSlides.forEach(activeSlide => {
                if (activeSlide) {
                    activeSlide.classList.remove('active', 'disolve');
                    activeSlide.classList.add('hidden');
                }
            });
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }

        function prevSlide() {
        const activeSlides = document.querySelectorAll('.carousel-slide.active');
        activeSlides.forEach(activeSlide => {
            if (activeSlide) {
                activeSlide.classList.remove('active', 'disolve');
                activeSlide.classList.add('hidden');
            }
        });
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
        }
  
        const carouselContainer = document.querySelector('.carousel-container');

        function handleStart(e) {
            e.preventDefault();
            startX = e.touches ? e.touches[0].clientX : e.clientX;
            slides.forEach(slide => slide.classList.add('paused'));
        }
        
        function handleEnd(e) {
            e.preventDefault();
            endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
            slides.forEach(slide => slide.classList.remove('paused'));
        
            if (Math.abs(startX - endX) > 10) {
                if (startX > endX + 10) {
                    prevSlide();
                } else if (startX < endX - 10) {
                    getNextSlide();
                }
            }
            showSlide(currentSlide);
        }
        carouselContainer.addEventListener('touchstart', handleStart);
        carouselContainer.addEventListener('mousedown', handleStart);
        
        carouselContainer.addEventListener('touchend', handleEnd);
        carouselContainer.addEventListener('mouseup', handleEnd);

    })
    .catch(error => console.error('Error fetching images:', error));