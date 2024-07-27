// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('carousel');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    let currentIndex = 0;
    let images = [];

    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function showPrevSlide() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateCarousel();
    }

    function showNextSlide() {
        currentIndex = (currentIndex + 1) % images.length;
        updateCarousel();
    }

    // Fetch image filenames from a JSON file or API
    fetch('images.json')
        .then(response => response.json())
        .then(data => {
            images = data;
            if (images.length > 0) {
                images.forEach(image => {
                    const slide = document.createElement('div');
                    slide.className = 'carousel-slide';
                    const img = document.createElement('img');
                    img.src = `images/${image}`;
                    img.alt = image;
                    slide.appendChild(img);
                    carousel.appendChild(slide);
                });
                updateCarousel();
            }
        })
        .catch(error => console.error('Error loading images:', error));

    prevButton.addEventListener('click', showPrevSlide);
    nextButton.addEventListener('click', showNextSlide);

    // Swipe functionality for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    function handleTouchStart(event) {
        touchStartX = event.changedTouches[0].screenX;
    }

    function handleTouchEnd(event) {
        touchEndX = event.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
            showNextSlide(); // Swipe left
        } else if (touchEndX - touchStartX > 50) {
            showPrevSlide(); // Swipe right
        }
    }

    carousel.addEventListener('touchstart', handleTouchStart);
    carousel.addEventListener('touchend', handleTouchEnd);

    // Mouse drag functionality for desktop
    let isDragging = false;
    let startX = 0;

    function handleMouseDown(event) {
        isDragging = true;
        startX = event.clientX;
    }

    function handleMouseMove(event) {
        if (!isDragging) return;
        const deltaX = startX - event.clientX;
        if (Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                showNextSlide(); // Drag left
            } else {
                showPrevSlide(); // Drag right
            }
            isDragging = false;
        }
    }

    function handleMouseUp() {
        isDragging = false;
    }

    carousel.addEventListener('mousedown', handleMouseDown);
    carousel.addEventListener('mousemove', handleMouseMove);
    carousel.addEventListener('mouseup', handleMouseUp);
});
