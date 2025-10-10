//Функцію для створення, рендеру або видалення розмітки
import refs from './refs';

//#region Book Modal Render
// Select elements within the existing modal
Object.assign(refs, {
  bookModal_img: document.querySelector('.modal-books_img'),
  bookModal_title: document.querySelector('.modal-books_title'),
  bookModal_author: document.querySelector('.modal-books_author'),
  bookModal_price: document.querySelector('.modal-books_price'),
  bookModal_details: document.querySelector('[data-ac="details"]'),
  bookModal_returns: document.querySelector('[data-ac="returns"]'),
  bookModal_shipping: document.querySelector('[data-ac="shipping"]'),
  bookModal_data: document.querySelector('.modal-books_data'),
  bookModal_quantity: document.querySelector('#bookQuantity'),
});

export function renderBookModal(dataObj) {
  refs.bookModal_data.dataset.bookId = dataObj.bookId;
  refs.bookModal_img.src = dataObj.bookPicture;
  refs.bookModal_img.alt = dataObj.bookTitle;
  refs.bookModal_title.textContent = dataObj.bookTitle;
  refs.bookModal_quantity.value = dataObj.bookQuantity;
  refs.bookModal_author.textContent = dataObj.bookAuthor;
  refs.bookModal_price.textContent = '$' + dataObj.bookPrice;
  refs.bookModal_details.textContent = dataObj.details;
  refs.bookModal_shipping.textContent = dataObj.shipping;
  refs.bookModal_returns.textContent = dataObj.returns;
}
//#endregion Book Modal Render
