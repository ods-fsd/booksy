//Допоміжні функції
export function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

// Ініціалізація слайдера Swiper
// Імпортуємо Swiper та необхідні модулі
import Swiper from "swiper";
import {
  Navigation,
  Pagination,
  Parallax,
  Autoplay,
  Keyboard,
} from "swiper/modules";
import "swiper/css/bundle";

/**
 * Ініціалізує слайдер Swiper з підтримкою пагінації, навігації та брейкпоінтів.
 * @param {object} settings - Налаштування слайдера.
 * @returns {Swiper|null}
 */
export function initSlider({
  containerSelector,
  prevSelector,
  nextSelector,
  paginationSelector,
  customBullet,
  breakpoints,
  options = {}, // Додаткові опції для гнучкості
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

  // Функція для оновлення стану кнопок навігації
  function updateArrows(swiperInstance) {
    if (!prevBtn || !nextBtn) return;

    const isBeginning = swiperInstance.isBeginning;
    const isEnd = swiperInstance.isEnd;

    prevBtn.disabled = isBeginning;
    nextBtn.disabled = isEnd;
    prevBtn.classList.toggle("disabled", isBeginning);
    nextBtn.classList.toggle("disabled", isEnd);
  }

  // Збираємо налаштування для Swiper
  const swiperOptions = {
    modules: [Navigation, Pagination, Parallax, Autoplay, Keyboard],
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
    // Налаштування навігації (кнопки "вперед/назад")
    navigation:
      prevBtn && nextBtn
        ? {
            nextEl: nextBtn,
            prevEl: prevBtn,
          }
        : false, // Вимикаємо, якщо кнопок немає
    // Налаштування пагінації (точки)
    pagination: paginationEl
      ? {
          el: paginationEl,
          clickable: true,
          ...(typeof customBullet === "function" && {
            renderBullet: customBullet,
          }),
        }
      : false, // Вимикаємо, якщо пагінації немає
    breakpoints,
    on: {
      // Викликаємо функцію оновлення кнопок при ініціалізації та зміні слайда
      init: updateArrows,
      slideChange: updateArrows,
    },
    ...options, // Додаємо кастомні опції, щоб вони могли перезаписати дефолтні
  };

  const swiper = new Swiper(root, swiperOptions);

  // Додаємо обробники кліків для зняття фокусу з кнопок
  [prevBtn, nextBtn].forEach((btn) => {
    if (!btn) return;
    btn.addEventListener("click", () => {
      btn.blur(); // Прибирає синю рамку фокусу з кнопки після кліку
    });
  });

  return swiper;
}
