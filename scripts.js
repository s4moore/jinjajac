document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('carousel');
    let currentIndex = 0;
    let images = [];
    let isAnimating = false;
    let autoSlideInterval;

    function preloadImages(imageUrls, callback) {
        let loadedImages = 0;
        const totalImages = imageUrls.length;
        const imageElements = [];

        imageUrls.forEach((url, index) => {
            const img = new Image();
            img.src = `images/${url}`;
            img.onload = () => {
                loadedImages++;
                imageElements[index] = img;
                if (loadedImages === totalImages) {
                    callback(imageElements);
                }
            };
            img.onerror = () => {
                console.error(`Failed to load image: ${url}`);
                loadedImages++;
                if (loadedImages === totalImages) {
                    callback(imageElements);
                }
            };
        });
    }

    function animateSlide(slide, callback) {
        let start = null;
        const duration = 1500; // Animation duration in ms
        const startX = -500; // Start outside the upper left quadrant
        const startY = -90; // Start outside the upper left quadrant
        const midX = -70; // Midpoint for x
        const midY = -100; // Midpoint for y
        const endX = -50; // End at center
        const endY = -50; // End at center
        const startScale = 0.2;
        const endScale = 1.2;

        function bezier(t, p0, p1, p2, p3) {
            return (1 - t) * (1 - t) * (1 - t) * p0 + 
                   3 * (1 - t) * (1 - t) * t * p1 + 
                   3 * (1 - t) * t * t * p2 + 
                   t * t * t * p3;
        }

        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);

            // Calculate current position and scale using a cubic Bezier curve
            const x = bezier(progress, startX, midX, midX, endX);
            const y = bezier(progress, startY, midY, midY, endY);
            const scale = startScale + (endScale - startScale) * progress;

            slide.style.transform = `translate(${x}%, ${y}%) scale(${scale})`;
            slide.style.opacity = progress;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                if (callback) callback();
            }
        }

        requestAnimationFrame(step);
    }

    function fadeOutSlide(slide, callback) {
        slide.style.transition = 'opacity 0.5s'; // Adjusted to match animation duration
        slide.style.opacity = '0';

        setTimeout(() => {
            slide.style.display = 'none';
            if (callback) callback();
        }, 500); // Match the transition duration
    }

    function updateCarousel() {
        const slides = document.querySelectorAll('.carousel-slide');
        let currentSlide = slides[currentIndex];
        let nextIndex = (currentIndex + 1) % images.length;
        let nextSlide = slides[nextIndex];
        
        nextSlide.style.display = 'block';
        nextSlide.style.opacity = '0';
        nextSlide.style.transform = 'translate(-500%, -100%) scale(0.01)';

        // Ensure current slide is visible and has full opacity before starting animation
        currentSlide.style.display = 'block';
        currentSlide.style.opacity = '1';

        // Start the swoosh animation for the next slide
        animateSlide(nextSlide, () => {
            fadeOutSlide(currentSlide, () => {
                isAnimating = false; // Animation finished
            });
        });
    }

    function showPrevSlide() {
        if (images.length > 0 && !isAnimating) {
            isAnimating = true;
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateCarousel();
        }
    }

    function showNextSlide() {
        if (images.length > 0 && !isAnimating) {
            isAnimating = true;
            currentIndex = (currentIndex + 1) % images.length;
            updateCarousel();
        }
    }

    function handleSwipe() {
        if (isAnimating) {
            isAnimating = false; // Stop the current animation
        }
        showNextSlide(); // Trigger the next slide
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            if (!isAnimating) {
                showNextSlide();
            }
        }, 2000); // Change slide every 2 seconds
    }

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
                // Preload images
                preloadImages(images, (preloadedImages) => {
                    // Create slides after images are preloaded
                    preloadedImages.forEach(img => {
                        const slide = document.createElement('div');
                        slide.className = 'carousel-slide';
                        const imgElement = document.createElement('img');
                        imgElement.src = img.src; // Set source to preloaded image
                        imgElement.alt = img.src.split('/').pop(); // Extract filename
                        slide.appendChild(imgElement);
                        carousel.appendChild(slide);
                    });
                    updateCarousel();
                    startAutoSlide(); // Start automatic transitions
                });
            } else {
                console.log('No images found in images.json');
            }
        })
        .catch(error => console.error('Error loading images:', error));

    // Swipe functionality for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    function handleTouchStart(event) {
        touchStartX = event.changedTouches[0].screenX;
    }

    function handleTouchEnd(event) {
        touchEndX = event.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
            handleSwipe(); // Swipe left
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
                handleSwipe(); // Drag left
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
