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
    const newScale = scale / 2.5;
    setVar('--img-scale', newScale); 

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
        videoElement.play().catch(error => {
            console.error('Error attempting to play the video:', error);
        });
    });
    videoElement.addEventListener('stalled', setBackgroundVideo, {passive: false});
    videoElement.addEventListener('paused', setBackgroundVideo, {passive: false});
    videoElement.addEventListener('ended', setBackgroundVideo, {passive: false});
}
