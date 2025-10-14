import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form-footer');
const emailInput = document.querySelector('.email-input');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const email = emailInput.value.trim();


  if (!validateEmail(email)) {
    iziToast.error({
      theme: 'light',
      title: 'Error',
      message: 'Please enter a valid email address.',
      position: 'topCenter',
      timeout: 3000,
    });
    return;
  }


  fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: email }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {

      iziToast.success({
        theme: 'light',
        title: 'Success',
        message: 'Thank you for subscribing!',
        position: 'topCenter',
        timeout: 3000,
        class: 'footer-subscribe-toast',
      });
      emailInput.value = '';
    })
    .catch(error => {

      iziToast.error({
        theme: 'light',
        title: 'Error',
        message: 'There was an error processing your request. Please try again later.',
        position: 'topCenter',
        timeout: 3000,
      });
    });
});

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
