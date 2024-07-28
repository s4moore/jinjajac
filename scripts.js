document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('carousel');
    let currentIndex = 0;
    let images = [];
    let isAnimating = false;
    let autoSlideInterval;
    let swipeDirection = 'left'; // Default swipe direction

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

    function updateCarousel() {
        const slides = document.querySelectorAll('.carousel-slide');
        let currentSlide = slides[currentIndex];
        let nextIndex = swipeDirection === 'left' ? (currentIndex + 1) % images.length : (currentIndex - 1 + images.length) % images.length;
        let nextSlide = slides[nextIndex];
        
        // Ensure both slides are visible and positioned correctly
        currentSlide.style.zIndex = '1'; // Ensure current slide is on top during transition
        nextSlide.style.zIndex = '2'; // Ensure next slide appears above the current slide
        
        // Prepare the new slide
        nextSlide.style.display = 'block'; // Ensure it's displayed
        nextSlide.style.opacity = '0'; // Start fully transparent
        nextSlide.style.transform = 'translate(-500%, -100%) scale(0.1)'; // Start position for swoosh
    
        // Reset display and opacity for the current slide
        currentSlide.style.display = 'block';
        currentSlide.style.opacity = '1'; // Make sure current slide is fully opaque
        currentSlide.style.transform = 'translate(0, 0) scale(1)'; // Reset transform
    
        showSlide(currentSlide); //HERE!!!!!!!!

        // Start fading out the current slide and animate the new slide
        fadeOutSlide(currentSlide);
        animateSlide(nextSlide, () => {
            currentSlide.style.display = 'none'; //!!!!!!!!!!!!!!!!
            isAnimating = false; // Animation finished
        });
    
        // Update the current index
        currentIndex = nextIndex;
    }
    
    function fadeOutSlide(slide) {
        slide.style.transition = 'opacity 0.5s ease-in-out'; // Smooth transition for opacity
        slide.style.opacity = '0';
    
        // Ensure that the fade-out is completed
        setTimeout(() => {
            slide.style.display = 'none';
        }, 500); // Match the transition duration
    }

    function showSlide(slide) {   ///THIS WHOLE FUNCTION !!!!!!!!!!!!!
        slide.style.display = 'block'; // Ensure the slide is visible
        slide.style.opacity = '1'; // Ensure it is fully opaque
        slide.style.transform = 'translate(0, 0) scale(1)'; // Reset transform
    }

    function animateSlide(slide, callback) {
        let start = null;
        const duration = 1500; // Animation duration in ms
        const startX = -500; // Start position (left side)
        const startY = -100; // Start position (top)
        const endX = 0; // End position (center)
        const endY = 0; // End position (center)
        const startScale = 0.1;
        const endScale = 1.0;
    
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
            const x = bezier(progress, startX, -70, -70, endX);
            const y = bezier(progress, startY, -100, -100, endY);
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


    function showPrevSlide() {
        // if (images.length > 0 && !isAnimating) {
            swipeDirection = 'right'; // Swipe right to show previous slide
            isAnimating = true;
            updateCarousel();
        // }
    }

    function showNextSlide() {
        // if (images.length > 0 && !isAnimating) {
            swipeDirection = 'left'; // Swipe left to show next slide
            isAnimating = true;
            updateCarousel();
        // }
    }

    function handleSwipe(direction) {
        // if (!isAnimating) {
            swipeDirection = direction;
            updateCarousel(); // Trigger the next slide based on the direction
        // }
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
        const swipeThreshold = 10;
        if (touchStartX - touchEndX > swipeThreshold) {
            handleSwipe('left'); // Swipe left
        } else if (touchEndX - touchStartX > swipeThreshold) {
            handleSwipe('right'); // Swipe right
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
        const dragThreshold = 50;
        if (Math.abs(deltaX) > dragThreshold) {
            if (deltaX > 0) {
                handleSwipe('left'); // Drag left
            } else {
                handleSwipe('right'); // Drag right
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
