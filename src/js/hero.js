import { initSlider } from './helpers';

initSlider({
  containerSelector: '.swiper-hero',
  prevSelector: '.hero-swiper-btn-prev',
  nextSelector: '.hero-swiper-btn-next',
});

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.swiper-slide-hero');

  slides.forEach(slide => {
    const opacity = slide.dataset.overlay;

    if (opacity && Number(opacity) > 0) {
      const overlay = document.createElement('div');
      overlay.classList.add('hero-overlay');
      overlay.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
      slide.appendChild(overlay);
    }
  });
});

document.querySelectorAll('.slide-btn[href="#books"]').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector('#books')?.scrollIntoView();
  });
});
