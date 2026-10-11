"use strict";
(() => {
  const dialog = document.querySelector('#intellicar-dialog');
  const tabs = [...dialog.querySelectorAll('[role="tab"]')];
  const video = dialog.querySelector('video');
  const clipSelect = dialog.querySelector('#intellicar-clip');
  const slideSelect = dialog.querySelector('#intellicar-slide-select');
  const slideImage = dialog.querySelector('#intellicar-slide-image');
  const previous = dialog.querySelector('#intellicar-slide-prev');
  const next = dialog.querySelector('#intellicar-slide-next');
  const slideVideo = dialog.querySelector('#intellicar-slide-video');
  const clips = {
    rover: {src: 'assets/intellicar-demo.mp4', poster: 'assets/intellicar-poster.webp', caption: 'The original course-project demonstration, with rover motion, voice commands, and live execution logs. Press play to hear the audio.'},
    latency: {src: 'assets/intellicar-latency.mp4', poster: 'assets/intellicar-latency-poster.webp', caption: 'The original pipeline and latency animation embedded in presentation slide 15, illustrating the reported three-path results. This clip has no audio.'}
  };
  let activeClip;
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
    dialog.querySelector('#intellicar-video-link').href = clip.src;
    dialog.querySelector('#intellicar-video-caption').textContent = clip.caption;
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
    slideImage.src = `assets/intellicar-slides/slide-${String(slide).padStart(2, '0')}.webp`;
    slideImage.alt = `IntelliCar presentation, slide ${slide} of 19`;
    slideSelect.value = slide;
    previous.disabled = slide === 1;
    next.disabled = slide === 19;
    slideVideo.hidden = slide !== 14 && slide !== 15;
  }
  document.querySelector('.intellicar-open').addEventListener('click', () => {
    selectPanel('demo');
    dialog.showModal();
    document.body.classList.add('modal-open');
  });
  dialog.querySelector('.project-dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    video.pause();
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('modal-open');
  });
  dialog.addEventListener('click', e => {
    if (e.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
  });
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectPanel(tab.dataset.panel));
    tab.addEventListener('keydown', e => {
      let target;
      if (e.key === 'ArrowRight') target = (index + 1) % tabs.length;
      if (e.key === 'ArrowLeft') target = (index + tabs.length - 1) % tabs.length;
      if (e.key === 'Home') target = 0;
      if (e.key === 'End') target = tabs.length - 1;
      if (target !== undefined) {e.preventDefault(); selectPanel(tabs[target].dataset.panel, true);}
    });
  });
  clipSelect.addEventListener('change', () => selectClip(clipSelect.value));
  previous.addEventListener('click', () => showSlide(slide - 1));
  next.addEventListener('click', () => showSlide(slide + 1));
  slideSelect.addEventListener('change', () => showSlide(Number(slideSelect.value)));
  slideVideo.addEventListener('click', () => {selectClip(slide === 15 ? 'latency' : 'rover'); selectPanel('demo', true);});
  const slidePane = document.querySelector('#intellicar-pane-slides');
  slidePane.addEventListener('keydown', e => {
    if (e.target !== slidePane) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {e.preventDefault(); showSlide(slide + (e.key === 'ArrowLeft' ? -1 : 1));}
  });
  document.addEventListener('visibilitychange', () => {if (document.hidden) video.pause();});
})();
