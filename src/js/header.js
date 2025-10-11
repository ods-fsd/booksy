const burgerBtn = document.querySelector('.burger-icon');
const menu = document.querySelector('.header-modal');
const closeBtn = document.querySelector('.header-modal-nav-close');
const body = document.body;

burgerBtn.addEventListener('click', () => {
  menu.classList.add('is-open');
  body.classList.add('body--no-scroll');
});

closeBtn.addEventListener('click', () => {
  menu.classList.remove('is-open');
  body.classList.remove('body--no-scroll');
});
const menuLinks = menu.querySelectorAll('a');
menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('is-open');
    body.classList.remove('body--no-scroll');
  });
});
