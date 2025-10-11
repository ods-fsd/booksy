
//Допоміжні функції

export function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

// Ініціалізація слайдера Swiper
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

/**
 * Ініціалізує слайдер Swiper з підтримкою пагінації, навігації та брейкпоінтів.
 * @param {Object} options - Налаштування слайдера.
 * @param {string} options.containerSelector - CSS-селектор контейнера слайдера.
 * @param {string} [options.prevSelector] - CSS-селектор кнопки "Попередній".
 * @param {string} [options.nextSelector] - CSS-селектор кнопки "Наступний".
 * @param {string} [options.paginationSelector] - CSS-селектор контейнера пагінації.
 * @param {Function} [options.customBullet] - Функція кастомного bullet-рендера.
 * @param {Object} [options.breakpoints] - Налаштування брейкпоінтів.
 * @param {Object} [options.options] - Додаткові налаштування Swiper.
 * @returns {Swiper|null}
 */
export function initSlider({
  containerSelector,
  prevSelector,
  nextSelector,
  paginationSelector,
  customBullet,
  breakpoints,
  options = {},
}) {
  const root = document.querySelector(containerSelector);
  if (!root) {
    console.warn(`Swiper контейнер ${containerSelector} не знайдено`);
    return null;
  }

  const prevBtn = prevSelector ? document.querySelector(prevSelector) : null;
  const nextBtn = nextSelector ? document.querySelector(nextSelector) : null;
  const paginationEl = paginationSelector
    ? document.querySelector(paginationSelector)
    : null;


  let pagination;
  if (paginationEl) {
    pagination = {
      el: paginationEl,
      clickable: true,
    };

    if (typeof customBullet === 'function') {
      pagination.renderBullet = customBullet;
    }
  }

  const swiper = new Swiper(root, {
    loop: false,
    slidesPerView: 1,
    slidesPerGroup: 1,
    parallax: true,
    autoplay: {
      delay: 10000,
      disableOnInteraction: true,
      pauseOnMouseEnter: true,
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    navigation:
      prevBtn && nextBtn
        ? {
            nextEl: nextBtn,
            prevEl: prevBtn,
          }
        : undefined,
    ...(paginationEl && {
      pagination: {
        el: paginationEl,
        clickable: true,
        ...(typeof customBullet === 'function' && {
          renderBullet: customBullet,
        }),
      },
    }),
    breakpoints,
    on: {
      init(sw) {
        updateArrows(sw);
      },
      slideChange(sw) {
        updateArrows(sw);
      },
    },
    ...options,
  });

  function updateArrows(sw) {
    if (!prevBtn || !nextBtn) return;
    prevBtn.disabled = sw.isBeginning;
    nextBtn.disabled = sw.isEnd;
    prevBtn.classList.toggle('disabled', sw.isBeginning);
    nextBtn.classList.toggle('disabled', sw.isEnd);
  }

  [prevBtn, nextBtn].forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      btn.blur();
    });
  });

  return swiper;
}
