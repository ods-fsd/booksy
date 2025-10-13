import Swiper from 'swiper';
import { Navigation, Pagination, Keyboard, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export function initFeedbacksSlider() {
  const container = document.querySelector('.feedbacks-swiper');
  if (!container) return;

  // Контролли ЗОВНІ — шукаємо в document, а не всередині swiper
  const prevBtn = document.querySelector('.feedbacks-nav__btn--prev');
  const nextBtn = document.querySelector('.feedbacks-nav__btn--next');
  const paginationEl = document.querySelector('.feedbacks-pagination');

  // src/js/feedbacks.js
  const swiper = new Swiper(container, {
    modules: [Navigation, Pagination, Keyboard, A11y],
    slidesPerView: 1,
    spaceBetween: 16,

    // 1) Прибрати це:
    // rewind: true,

    // 2) (опційно, але рекомендовано)
    watchOverflow: true,

    navigation: { nextEl: nextBtn, prevEl: prevBtn },
    pagination: { el: paginationEl, clickable: true },

    keyboard: { enabled: true, onlyInViewport: true },
    a11y: { enabled: true },

    breakpoints: {
      768: { slidesPerView: 2, spaceBetween: 24 },
      1440: { slidesPerView: 3, spaceBetween: 24 },
    },
  });

  // 3) Залишити примусове оновлення пагінації
  swiper.on('afterInit', () => {
    swiper.pagination?.render?.();
    swiper.pagination?.update?.();
  });
}

document.addEventListener('DOMContentLoaded', initFeedbacksSlider);
