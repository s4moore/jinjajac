document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('carousel');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    let currentIndex = 0;
    let images = [];

    function updateCarousel() {
        const offset = currentIndex * 100;
        carousel.style.transform = `translateX(-${offset}%)`;
    }

    function showPrevSlide() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateCarousel();
    }

    function showNextSlide() {
        currentIndex = (currentIndex + 1) % images.length;
        updateCarousel();
    }

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

    let touchStartX = 0;
    let touchEndX = 0;

    function handleTouchStart(event) {
        touchStartX = event.changedTouches[0].screenX;
    }

    function handleTouchEnd(event) {
        touchEndX = event.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
            showNextSlide();
        } else if (touchEndX - touchStartX > 50) {
            showPrevSlide();
        }
    }

    carousel.addEventListener('touchstart', handleTouchStart);
    carousel.addEventListener('touchend', handleTouchEnd);

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
                showNextSlide();
            } else {
                showPrevSlide();
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
