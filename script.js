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

        function showSlide(index) {
            console.log(`Showing slide ${index}`);
            slides.forEach((slide, i) => {
                slide.classList.remove('active', 'expandAndMove', 'dissolve');
                if (i === index) {
                    slide.classList.add('active', 'expandAndMove');
                    // Start dissolve animation after expandAndMove finishes
                    setTimeout(() => {
                        console.log(`Starting dissolve animation for slide ${index}`);
                        slide.classList.add('disolve');
                        // Delay moving to the next slide until dissolve completes
                        setTimeout(() => {
                        }, 1000); // 2000ms is the duration of the dissolve effect
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
        let startX = 0;
        let endX = 0;

        document.querySelector('.carousel-container').addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        document.querySelector('.carousel-container').addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            if (startX > endX + 5) {
                nextSlide();
            } else if (startX < endX - 5) {
                prevSlide();
            }
        });

        // Change slide every 3 seconds (overlapping animations)
        setInterval(nextSlide, 4000);
    })
    .catch(error => console.error('Error fetching images:', error));