const burgerBtn = document.querySelector('.burger-icon');
const menu = document.querySelector('.modal');
const closeBtn = document.querySelector('.modal-nav-close');

burgerBtn.addEventListener('click', () => {
  menu.classList.add('is-open');
});

closeBtn.addEventListener('click', () => {
  menu.classList.remove('is-open');
});
const menuLinks = menu.querySelectorAll('a');
menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('is-open');
  });
});
