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
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');

    if (href.startsWith('#')) {
      e.preventDefault();

      const target = document.querySelector(href);

      if (target) {
        menu.classList.remove('is-open');
        body.classList.remove('body--no-scroll');
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    } else {
      body.classList.remove('body--no-scroll');
    }
  });
});
