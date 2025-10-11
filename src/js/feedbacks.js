import Swiper from 'swiper';
import { Navigation, Pagination, Keyboard, A11y } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export function initFeedbacksSlider() {
  const container = document.querySelector('.feedbacks-swiper');
  if (!container) return;

  const prevBtn = container.querySelector('.feedbacks-nav__btn--prev');
  const nextBtn = container.querySelector('.feedbacks-nav__btn--next');

  const swiper = new Swiper(container, {
    modules: [Navigation, Pagination, Keyboard, A11y],
    slidesPerView: 1,
    spaceBetween: 16,
    loop: false,

    navigation: {
      nextEl: nextBtn,
      prevEl: prevBtn,
    },

    pagination: {
      el: container.querySelector('.feedbacks-pagination'),
      clickable: true,
      dynamicBullets: true,
    },

    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },

    a11y: {
      enabled: true,
    },

    breakpoints: {
      768: { slidesPerView: 2, spaceBetween: 24 },
      1440: { slidesPerView: 3, spaceBetween: 24 },
    },
  });

  const syncAria = () => {
    if (prevBtn)
      prevBtn.setAttribute(
        'aria-disabled',
        prevBtn.classList.contains('swiper-button-disabled') ? 'true' : 'false'
      );
    if (nextBtn)
      nextBtn.setAttribute(
        'aria-disabled',
        nextBtn.classList.contains('swiper-button-disabled') ? 'true' : 'false'
      );
  };

  syncAria();
  swiper.on('afterInit', syncAria);
  swiper.on('slideChange', syncAria);
  swiper.on('reachBeginning', syncAria);
  swiper.on('reachEnd', syncAria);
  swiper.on('fromEdge', syncAria);
}
