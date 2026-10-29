"use strict";
(() => {
  const video = document.querySelector('#intellicar-video');
  if (!video) return;
  const buttons = [...document.querySelectorAll('[data-clip]')];
  const videoLink = document.querySelector('#intellicar-video-link');
  const caption = document.querySelector('#intellicar-video-caption');
  const clips = {
    rover: {
      src: '../assets/intellicar-demo.mp4',
      poster: '../assets/intellicar-poster.webp',
      label: 'IntelliCar rover demonstration',
      caption: 'Voice commands, rover motion, and live execution logs. Play to hear audio.'
    },
    latency: {
      src: '../assets/intellicar-latency.mp4',
      poster: '../assets/intellicar-latency-poster.webp',
      label: 'IntelliCar pipeline animation',
      caption: 'An animation of the adaptive speech pipeline and its three recognition paths. This clip has no audio.'
    }
  };
  let activeClip = 'rover';
  function selectClip(key) {
    if (!clips[key] || key === activeClip) return;
    const clip = clips[key];
    video.pause();
    video.src = clip.src;
    video.poster = clip.poster;
    video.setAttribute('aria-label', clip.label);
    video.load();
    videoLink.href = clip.src;
    caption.textContent = clip.caption;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.clip === key)));
    activeClip = key;
  }
  buttons.forEach(button => button.addEventListener('click', () => selectClip(button.dataset.clip)));
  window.addEventListener('pagehide', () => video.pause());
  document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });
})();
