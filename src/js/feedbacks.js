import Swiper from 'swiper';
import { Navigation, Pagination, Keyboard, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function initFeedbacksSlider() {
  const container = document.querySelector('.feedbacks-swiper');
  if (!container) return;

  const prevBtn = document.querySelector('.feedbacks-nav__btn--prev');
  const nextBtn = document.querySelector('.feedbacks-nav__btn--next');
  const paginationEl = document.querySelector('.feedbacks-pagination');

  const swiper = new Swiper(container, {
    modules: [Navigation, Pagination, Keyboard, A11y],
    slidesPerView: 1,
    spaceBetween: 16,
    watchOverflow: true,

    navigation: {
      nextEl: nextBtn,
      prevEl: prevBtn,
    },
    pagination: {
      el: paginationEl,
      clickable: true,
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

    on: {
      init: function () {
        this.pagination?.render();
        this.pagination?.update();
        updateNavButtons(this);
      },
      slideChange: function () {
        updateNavButtons(this);
      },
    },
  });

  function updateNavButtons(swiperInstance) {
    if (prevBtn && nextBtn) {
      prevBtn.disabled = swiperInstance.isBeginning;
      nextBtn.disabled = swiperInstance.isEnd;
    }
  }
}

document.addEventListener('DOMContentLoaded', initFeedbacksSlider);
