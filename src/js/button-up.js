// src/js/button-up.js

const buttonUp = document.querySelector(".btn-up");

// Функція, яка показує/ховає кнопку
function handleScroll() {
  // Висота, після якої кнопка з'явиться (наприклад, висота одного екрана)
  const showHeight = window.innerHeight;

  if (window.scrollY > showHeight) {
    buttonUp.classList.add("is-visible");
  } else {
    buttonUp.classList.remove("is-visible");
  }
}

// Функція плавної прокрутки до верху
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Додаємо слухачів подій
if (buttonUp) {
  window.addEventListener("scroll", handleScroll);
  buttonUp.addEventListener("click", scrollToTop);
}
