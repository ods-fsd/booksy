import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const swiper = new Swiper('.ev-swiper', {
  modules: [Navigation, Pagination],

  wrapperClass: 'ev-list',
  slideClass: 'ev-item',

  slidesPerView: 1,
  spaceBetween: 24,

  breakpoints: {
    768: { slidesPerView: 2, spaceBetween: 24 },
    1440: { slidesPerView: 3, spaceBetween: 24 },
  },

  pagination: {
    el: '.ev-pagination',
    clickable: true,
    bulletElement: 'li',
    bulletClass: 'ev-dot',
    bulletActiveClass: 'ev-dot--active',
    renderBullet: (index, className) =>
      `<li class="${className}" aria-label="Go to slide ${index + 1}" tabindex="0"></li>`,
  },

  navigation: {
    prevEl: '.ev-swipe-btn-prev',
    nextEl: '.ev-swipe-btn-next',
  },

  watchOverflow: true,
});

const prevBtn = document.querySelector('.ev-swipe-btn-prev');
const nextBtn = document.querySelector('.ev-swipe-btn-next');

function syncDisabled() {
  const atStart = swiper.isBeginning;
  const atEnd = swiper.isEnd;

  prevBtn.toggleAttribute('disabled', atStart);
  nextBtn.toggleAttribute('disabled', atEnd);

  prevBtn.setAttribute('aria-disabled', String(atStart));
  nextBtn.setAttribute('aria-disabled', String(atEnd));
}

swiper.on('afterInit', syncDisabled);
swiper.on('slideChange', syncDisabled);
swiper.on('update', syncDisabled);
syncDisabled();

// modalka
document.querySelector('.events-section')?.addEventListener('click', e => {
  const btn = e.target.closest('.js-register');
  if (!btn) return;

  const payload = {
    title: btn.dataset.title || 'Register',
    date: btn.dataset.date || '',
    format: btn.dataset.format || '',
  };

  window.dispatchEvent(new CustomEvent('open-contacts-modal', { detail: payload }));
});