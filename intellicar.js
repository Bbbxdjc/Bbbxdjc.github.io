"use strict";
(() => {
  const materials = document.querySelector('#intellicar-materials');
  if (!materials) return;
  const tabs = [...materials.querySelectorAll('[role="tab"]')];
  const video = materials.querySelector('video');
  const clipSelect = materials.querySelector('#intellicar-clip');
  const slideSelect = materials.querySelector('#intellicar-slide-select');
  const slideImage = materials.querySelector('#intellicar-slide-image');
  const previous = materials.querySelector('#intellicar-slide-prev');
  const next = materials.querySelector('#intellicar-slide-next');
  const slideVideo = materials.querySelector('#intellicar-slide-video');
  const clips = {
    rover: {src: '../assets/intellicar-demo.mp4', poster: '../assets/intellicar-poster.webp', caption: 'The original course-project demonstration, with rover motion, voice commands, and live execution logs. Press play to hear the audio.'},
    latency: {src: '../assets/intellicar-latency.mp4', poster: '../assets/intellicar-latency-poster.webp', caption: 'The original pipeline and latency animation embedded in presentation slide 15, illustrating the reported three-path results. This clip has no audio.'}
  };
  let activeClip = 'rover';
  let slide = 1;
  for (let n = 1; n <= 19; n++) {
    const option = document.createElement('option');
    option.value = n;
    option.textContent = `${String(n).padStart(2, '0')} / 19`;
    slideSelect.append(option);
  }
  function selectClip(key) {
    if (activeClip === key) return;
    video.pause();
    const clip = clips[key];
    video.src = clip.src;
    video.poster = clip.poster;
    video.load();
    clipSelect.value = key;
    activeClip = key;
    materials.querySelector('#intellicar-video-link').href = clip.src;
    materials.querySelector('#intellicar-video-caption').textContent = clip.caption;
  }
  function selectPanel(key, focus = false) {
    if (key !== 'demo') video.pause();
    tabs.forEach(tab => {
      const selected = tab.dataset.panel === key;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected;
      if (selected && focus) tab.focus();
    });
    if (key === 'demo') selectClip(clipSelect.value);
  }
  function showSlide(number) {
    slide = Math.max(1, Math.min(19, number));
    slideImage.src = `../assets/intellicar-slides/slide-${String(slide).padStart(2, '0')}.webp`;
    slideImage.alt = `IntelliCar presentation, slide ${slide} of 19`;
    slideSelect.value = slide;
    previous.disabled = slide === 1;
    next.disabled = slide === 19;
    slideVideo.hidden = slide !== 14 && slide !== 15;
  }
  function panelFromHash() {
    const key = window.location.hash.slice(1);
    return tabs.some(tab => tab.dataset.panel === key) ? key : 'demo';
  }
  function navigateToPanel(key, focus = false) {
    if (window.location.hash !== `#${key}`) {
      window.history.pushState(null, '', `#${key}`);
    }
    selectPanel(key, focus);
  }
  window.addEventListener('hashchange', () => selectPanel(panelFromHash()));
  window.addEventListener('popstate', () => selectPanel(panelFromHash()));
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => navigateToPanel(tab.dataset.panel));
    tab.addEventListener('keydown', e => {
      let target;
      if (e.key === 'ArrowRight') target = (index + 1) % tabs.length;
      if (e.key === 'ArrowLeft') target = (index + tabs.length - 1) % tabs.length;
      if (e.key === 'Home') target = 0;
      if (e.key === 'End') target = tabs.length - 1;
      if (target !== undefined) {e.preventDefault(); navigateToPanel(tabs[target].dataset.panel, true);}
    });
  });
  clipSelect.addEventListener('change', () => selectClip(clipSelect.value));
  previous.addEventListener('click', () => showSlide(slide - 1));
  next.addEventListener('click', () => showSlide(slide + 1));
  slideSelect.addEventListener('change', () => showSlide(Number(slideSelect.value)));
  slideVideo.addEventListener('click', () => {selectClip(slide === 15 ? 'latency' : 'rover'); navigateToPanel('demo', true);});
  const slidePane = document.querySelector('#intellicar-pane-slides');
  slidePane.addEventListener('keydown', e => {
    if (e.target !== slidePane) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {e.preventDefault(); showSlide(slide + (e.key === 'ArrowLeft' ? -1 : 1));}
  });
  showSlide(1);
  selectPanel(panelFromHash());
  window.addEventListener('pagehide', () => video.pause());
  document.addEventListener('visibilitychange', () => {if (document.hidden) video.pause();});
})();
