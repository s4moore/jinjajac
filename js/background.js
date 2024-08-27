import { setVar } from './utils.js';

export function setBackgroundVideo() {
    const existingVideo = document.querySelector('.background-video');
    if (existingVideo) {
        existingVideo.remove();
    }

    let scale = Math.min(window.innerWidth, window.innerHeight) / 500;
    if (Math.min(window.innerWidth, window.innerHeight) > 768) {
        scale *= 0.75;
    }
    console.log('Scale:', scale);
    console.log('Window width:', window.innerWidth);
    console.log('Window height:', window.innerHeight);
    const newScale = scale / 2.5; // Calculate the new width
    setVar('--img-scale', newScale); // Set the new width

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

    // const playVideo = () => {
    //     videoElement.play().catch(error => {
    //         console.error('Error attempting to play the video:', error);
    //     });
    // };

    // Add event listeners for user interaction to start video playback
    // document.addEventListener('click', playVideo, { once: true });
    // document.addEventListener('touchstart', playVideo, { once: true });

    videoElement.addEventListener('canplaythrough', () => {
        // console.log('Video can play through without stopping for buffering.');
        videoElement.play().catch(error => {
            console.error('Error attempting to play the video:', error);
        });
    });
}
