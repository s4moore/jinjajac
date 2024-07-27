document.addEventListener('DOMContentLoaded', () => {
    const galleryImage = document.getElementById('galleryImage');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    let currentIndex = 0;
    let images = [];

    fetch('images.json')
        .then(response => response.json())
        .then(data => {
            images = data;
            if (images.length > 0) {
                galleryImage.src = `images/${images[0]}`;
                galleryImage.alt = images[0];
            }
        })
        .catch(error => console.error('Error loading images:', error));

    prevButton.addEventListener('click', () => {
        if (images.length > 0) {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            galleryImage.src = `images/${images[currentIndex]}`;
            galleryImage.alt = images[currentIndex];
        }
    });

    nextButton.addEventListener('click', () => {
        if (images.length > 0) {
            currentIndex = (currentIndex + 1) % images.length;
            galleryImage.src = `images/${images[currentIndex]}`;
            galleryImage.alt = images[currentIndex];
        }
    });
});
