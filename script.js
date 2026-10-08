"use strict";
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');
function closeMenu() { navigation.classList.remove('open'); menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Open navigation'); }
menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; navigation.classList.toggle('open',open); menuButton.setAttribute('aria-expanded',String(open)); menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation'); });
navigation.querySelectorAll('a').forEach(a => a.addEventListener('click',closeMenu));
document.addEventListener('keydown', e => {if(e.key==='Escape') closeMenu();});
window.matchMedia('(min-width: 761px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
document.querySelectorAll('.bibtex-toggle').forEach(button => { button.addEventListener('click',() => { const panel=document.getElementById(button.getAttribute('aria-controls')); const open=button.getAttribute('aria-expanded')!=='true'; button.setAttribute('aria-expanded',String(open)); panel.hidden=!open; button.querySelector('span').textContent=open?'−':'+'; }); });
let toastTimer;
function toast(message) { const element=document.querySelector('.toast'); element.textContent=message; element.classList.add('visible'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>element.classList.remove('visible'),2600); }
document.querySelectorAll('.copy-citation').forEach(button=>{button.addEventListener('click',async()=>{ const code=button.closest('.bibtex-panel').querySelector('code'); const text=code.textContent; const helper=document.createElement('textarea'); helper.value=text; helper.setAttribute('aria-hidden','true'); helper.style.cssText='position:fixed;top:-9999px;left:-9999px'; document.body.appendChild(helper); helper.select(); let copied=false; try{copied=document.execCommand('copy');}catch{} helper.remove(); button.focus(); if(!copied&&navigator.clipboard){try{await Promise.race([navigator.clipboard.writeText(text),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Clipboard unavailable')),1200))]);copied=true;}catch{}} if(copied){toast('Citation copied');}else{const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(code);selection.removeAllRanges();selection.addRange(range);toast('Citation selected — copy with Ctrl/Cmd+C');} });});
if('IntersectionObserver' in window) { const sectionLinks=[...navigation.querySelectorAll('a[href^="#"]')]; const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){sectionLinks.forEach(link=>{const active=link.getAttribute('href')==='#'+entry.target.id;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}});},{rootMargin:'-15% 0px -65% 0px',threshold:0}); ['about','research','publications','experience','contact'].forEach(id=>observer.observe(document.getElementById(id))); }

const figureDialog=document.querySelector('.figure-dialog');
const figureImage=document.querySelector('#figure-dialog-image');
const figureScale=document.querySelector('#figure-scale');
const paperFigures={
  'iot-framework':{title:'IoT-SkillsBench · Figure 1',caption:'Skills-based agentic framework and hardware-in-the-loop benchmark. Cropped directly from the supplied paper, page 1.',image:'assets/iot-framework.png'}
};
document.querySelectorAll('[data-figure]').forEach(button=>button.addEventListener('click',()=>{const figure=paperFigures[button.dataset.figure];document.querySelector('#figure-dialog-title').textContent=figure.title;document.querySelector('.figure-dialog-caption').textContent=figure.caption;figureImage.src=figure.image;figureImage.alt=button.querySelector('img').alt;figureScale.value='1';figureImage.style.width='100%';figureDialog.showModal();document.body.classList.add('modal-open');}));
document.querySelector('.figure-close').addEventListener('click',()=>figureDialog.close());
figureDialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));
figureDialog.addEventListener('click',e=>{if(e.target===figureDialog){const r=figureDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)figureDialog.close();}});
figureScale.addEventListener('input',()=>{figureImage.style.width=String(Number(figureScale.value)*100)+'%';});
