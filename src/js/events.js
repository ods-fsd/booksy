import Swiper from 'swiper';
import { Navigation, Pagination, Keyboard } from 'swiper/modules'; // Додано Keyboard

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const swiper = new Swiper('.ev-swiper', {
  modules: [Navigation, Pagination, Keyboard], // Додано Keyboard

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
    bulletClass: 'ev-dot',
    bulletActiveClass: 'ev-dot--active',
  },

  navigation: {
    prevEl: '.ev-swipe-btn-prev',
    nextEl: '.ev-swipe-btn-next',
  },

  // Додано опцію для керування з клавіатури
  keyboard: {
    enabled: true,
    onlyInViewport: true,
  },

  watchOverflow: true,
});

const prevBtn = document.querySelector('.ev-swipe-btn-prev');
const nextBtn = document.querySelector('.ev-swipe-btn-next');

// Ця функція коректно обробляє стан кнопок
function syncDisabled() {
  if (!prevBtn || !nextBtn) return;

  const atStart = swiper.isBeginning;
  const atEnd = swiper.isEnd;

  prevBtn.toggleAttribute('disabled', atStart);
  nextBtn.toggleAttribute('disabled', atEnd);
}

swiper.on('afterInit', syncDisabled);
swiper.on('slideChange', syncDisabled);
swiper.on('update', syncDisabled);
syncDisabled();

// Обробник для модального вікна залишається без змін
document.querySelector('.events-section')?.addEventListener('click', e => {
  const btn = e.target.closest('.js-register');
  if (!btn) return;

  const payload = {
    title: btn.dataset.title || 'Register',
    date: btn.dataset.date || '',
    format: btn.dataset.format || '',
  };

  window.dispatchEvent(
    new CustomEvent('open-contacts-modal', { detail: payload })
  );
});
