document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('carousel');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    let images = [];
    let currentIndex = 1; // Start at the first actual slide

    function updateCarousel() {
        const offset = currentIndex * 100;
        carousel.style.transition = 'transform 0.5s ease-in-out';
        carousel.style.transform = `translateX(-${offset}%)`;
        
        // Handle wrap-around
        if (currentIndex === 0) {
            setTimeout(() => {
                carousel.style.transition = 'none';
                currentIndex = images.length; // Show the actual last slide
                carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            }, 500); // Match the transition duration
        } else if (currentIndex === images.length + 1) {
            setTimeout(() => {
                carousel.style.transition = 'none';
                currentIndex = 1; // Show the actual first slide
                carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            }, 500); // Match the transition duration
        }
    }

    function showPrevSlide() {
        if (images.length > 0) {
            currentIndex--;
            updateCarousel();
        }
    }

    function showNextSlide() {
        if (images.length > 0) {
            currentIndex++;
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
            if (images.length > 0) {
                // Add cloned slides
                const slides = [
                    images[images.length - 1], // Clone of the last slide
                    ...images,
                    images[0] // Clone of the first slide
                ];

                slides.forEach(image => {
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
