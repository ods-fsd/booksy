//swiper від Ярослава Білика
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

/**
 *
 * @param {Object} options
 * @param {string} options.containerSelector
 * @param {string} options.prevSelector
 * @param {string} options.nextSelector
 */
export function initSlider({ containerSelector, prevSelector, nextSelector }) {
  const container = document.querySelector(containerSelector);
  const prevBtn = document.querySelector(prevSelector);
  const nextBtn = document.querySelector(nextSelector);

  if (!container || !prevBtn || !nextBtn) return;

  const swiper = new Swiper(container, {
    modules: [Navigation],
    slidesPerView: 1,
    spaceBetween: 16,
    loop: false,
    allowTouchMove: true,
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    on: {
      init() {
        updateButtons();
      },
      slideChange() {
        updateButtons();
      },
    },
  });

  function updateButtons() {
    if (swiper.isBeginning) {
      prevBtn.disabled = true;
      prevBtn.classList.add('disabled');
    } else {
      prevBtn.disabled = false;
      prevBtn.classList.remove('disabled');
    }

    if (swiper.isEnd) {
      nextBtn.disabled = true;
      nextBtn.classList.add('disabled');
    } else {
      nextBtn.disabled = false;
      nextBtn.classList.remove('disabled');
    }
  }
}
//Обʼєкт з посиланнями на ДОМ елементи

const refs = {
  mobMenu: document.querySelector('.mobile-menu'), // мобільне меню в хедері
  body: document.body, // тіло документа
};

export default refs;
