document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('carousel');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    let currentIndex = 0;
    let images = [];

    function updateCarousel() {
        const offset = currentIndex * 100;
        console.log(`Updating carousel to index ${currentIndex}, translateX(-${offset}%)`); // Debug log
        carousel.style.transform = `translateX(-${offset}%)`;
    }

    function showPrevSlide() {
        if (images.length > 0) {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateCarousel();
        }
    }

    function showNextSlide() {
        if (images.length > 0) {
            currentIndex = (currentIndex + 1) % images.length;
            updateCarousel();
        }
    }

    // Fetch image filenames from JSON file
    fetch('images.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            images = data;
            console.log('Images loaded:', images); // Debug log
            if (images.length > 0) {
                images.forEach(image => {
                    const slide = document.createElement('div');
                    slide.className = 'carousel-slide';
                    const img = document.createElement('img');
                    img.src = `images/${image}`;
                    img.alt = image;
                    img.onload = () => console.log(`Loaded image: images/${image}`); // Log successful loading
                    img.onerror = () => console.error(`Failed to load image: images/${image}`); // Log failed loading
                    slide.appendChild(img);
                    carousel.appendChild(slide);
                });
                updateCarousel();
            } else {
                console.log('No images found in images.json');
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
