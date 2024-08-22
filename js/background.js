export function setBackgroundVideo() {
    const existingVideo = document.querySelector('.background-video');
    if (existingVideo) {
        existingVideo.remove();
    }
    const headers = document.querySelector('.collection-header');
    headers.style.height = `${screen.height}px`;
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    const videoElement = document.createElement('video'); // Create a new video element
    videoElement.preload = 'auto';
    videoElement.playbackRate = 0.5;
    videoElement.loop = true;
    videoElement.controls = false;
    videoElement.volume = null;
    videoElement.playsInline = true;
    videoElement.autoplay = true;
    videoElement.muted = true;
    videoElement.style.objectFit = 'cover';

    const sourceElement = document.createElement('source');
    sourceElement.src = isLandscape ? "/back/landscape.mp4" : "/back/portrait.mp4";
    sourceElement.type = 'video/mp4';

    videoElement.appendChild(sourceElement);

    videoElement.classList.add('background-video');
    document.body.appendChild(videoElement);

    videoElement.addEventListener('canplaythrough', () => {
        console.log('Video can play through without stopping for buffering.');
        videoElement.play().catch(error => {
            console.error('Error attempting to play the video:', error);
        });
    });
}
