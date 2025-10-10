import {
  getTopBooks,
  getBooksByCategory,
  getCategoryList,
} from './products-api';
import { openBooksModal } from './modal';

const gallery = document.querySelector('.gallery');
const select = document.querySelector('#category-select');
const showMore = document.querySelector('.btn-show-more');
const visibleCounter = document.querySelector('.visible-books');
const totalCounter = document.querySelector('.total-books');
const list = document.querySelector('.categories-list');
const arrow = document.querySelector('.categories-arrow');

const loader = document.querySelector('.loader');

let allBooks = [];
let visibleCount = 0;

function showLoader() {
  loader.classList.remove('hidden');
}
function hideLoader() {
  loader.classList.add('hidden');
}

let currentBreakpoint = window.innerWidth < 768 ? 'mobile' : 'desktop';

// Завантаження категорій
showLoader();
const categoryList = await getCategoryList();
renderCategoriesList(categoryList);

// Завантаження топ-книг
const topBooksData = await getTopBooks();
allBooks = topBooksData.flatMap(({ books }) => books);
renderBooks();
hideLoader();

function renderCategoriesList(categories) {
  select.innerHTML =
    '<option selected value="All categories">All categories</option>';
  list.innerHTML =
    '<li><button class="category-btn active-category" value="All categories">All categories</button></li>';

  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);

    const item = document.createElement('li');
    item.classList.add('category-item');
    const button = document.createElement('button');
    button.value = cat;
    button.textContent = cat;
    button.classList.add('category-btn');
    item.appendChild(button);
    list.appendChild(item);
  });
}

async function selectCategory(category) {
  showLoader(); // 
  select.value = category;

  list
    .querySelectorAll('.category-btn')
    .forEach(btn =>
      btn.classList.toggle('active-category', btn.value === category)
    );

  try {
    if (category === 'All categories') {
      const topBooksData = await getTopBooks();
      allBooks = topBooksData.flatMap(({ books }) => books);
    } else {
      allBooks = await getBooksByCategory(category);
    }

    visibleCount = getInitialCount();
    renderBooks();
  } catch (error) {
    console.error('Помилка при завантаженні книг:', error);
    gallery.innerHTML = '<li class="no-books">Failed to load books</li>';
  } finally {
    hideLoader(); 
  }
}

select.addEventListener('change', e => {
  const category = e.target.value;
  selectCategory(category);
});

list.addEventListener('click', e => {
  e.preventDefault();
  const btn = e.target.closest('.category-btn');
  if (!btn) return;

  // оновлення aria-pressed
  list.querySelectorAll('.category-btn').forEach(b => {
    b.classList.remove('active-category');
    b.setAttribute('aria-pressed', 'false');
  });

  btn.classList.add('active-category');
  btn.setAttribute('aria-pressed', 'true');

  const category = btn.value;
  selectCategory(category);
});

showMore.addEventListener('click', () => {
  visibleCount += 4;
  updateBooksList();
  showMore.blur();
});

function renderBooks() {
  visibleCount = getInitialCount();
  updateBooksList();
  totalCounter.textContent = allBooks.length;

  if (visibleCount >= allBooks.length) {
    showMore.classList.add('btn-show-more-hidden');
  }

  if (visibleCount < allBooks.length) {
    showMore.classList.remove('btn-show-more-hidden');
  }
}

function updateBooksList() {
  const currentSlice = allBooks.slice(0, visibleCount);
  showLoader();

 
  requestAnimationFrame(() => {
    setTimeout(() => {
      if (currentSlice.length === 0) {
        gallery.innerHTML = '<li class="no-books">No books found</li>';
        visibleCounter.textContent = 0;
        showMore.classList.add('btn-show-more-hidden');
        hideLoader();
        return;
      }

      gallery.innerHTML = createMarkup(currentSlice);
      visibleCounter.textContent = Math.min(visibleCount, allBooks.length);
      showMore.disabled = false;

      if (visibleCount >= allBooks.length) {
        showMore.classList.add('btn-show-more-hidden');
      } else {
        showMore.classList.remove('btn-show-more-hidden');
      }

      hideLoader();
    }, 100); 
  });
}

function getInitialCount() {
  return window.innerWidth < 768 ? 10 : 24;
}

window.addEventListener(
  'resize',
  debounce(() => {
    const newBreakpoint = window.innerWidth < 768 ? 'mobile' : 'desktop';
    if (newBreakpoint !== currentBreakpoint) {
      currentBreakpoint = newBreakpoint;
      renderBooks();
    }
  }, 300)
);

function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

gallery.addEventListener('click', event => {
  const btn = event.target.closest('.btn-book');
  if (!btn) return;
  const bookId = btn.dataset.id;
  openBooksModal(bookId);
});

let selectIsOpen = false;

select.addEventListener('mousedown', () => {
  // Меню щойно відкривається
  arrow.style.transform = 'translateY(-50%) rotate(180deg)';
  selectIsOpen = true;
});

// При зміні — закривається
select.addEventListener('change', () => {
  if (selectIsOpen) {
    arrow.style.transform = 'translateY(-50%)';
    selectIsOpen = false;
  }
});

// На всякий випадок, коли клацнули поза select
document.addEventListener('click', e => {
  if (selectIsOpen && !select.contains(e.target)) {
    arrow.style.transform = 'translateY(-50%)';
    selectIsOpen = false;
  }
});

// function createMarkup(data) {
//   return data
//     .map(({ title, author, book_image, price, _id }) => {
//       let displayPrice;

//       if (typeof price === 'string' && price.trim() !== '0.00') {
//         displayPrice = price.trim();
//       } else if (typeof price === 'number') {
//         displayPrice = price.toFixed(2);
//       } else {
//         displayPrice = '9.99';
//       }

//       return `<li class="book-card">
//       <img  loading="lazy" class="book-cover" src="${book_image}" alt="${title}" width="150" />
//       <div class="book-card-info">
//         <div class="book-card-descriptions">
//           <h3 class="book-card-title">${title.toLowerCase()}</h3>
//           <h4 class="book-card-author">${author}</h4>
//         </div>
//         <p class="book-price">$${displayPrice}</p>
//       </div>
//       <button type="button" class="btn-secondary btn-book" data-id="${_id}">Learn more</button>
//     </li>`;
//     })
//     .join('');
// }
function createMarkup(data) {
  return data
    .map(({ title, author, book_image, price, _id }, index) => {
      const displayPrice =
        typeof price === 'number'
          ? price.toFixed(2)
          : typeof price === 'string' && price.trim() !== '0.00'
          ? price.trim()
          : '9.99';

      const safeTitle = escapeHtml(title);
      const safeAuthor = escapeHtml(author);
      const loadingAttribute = index < 3 ? 'eager' : 'lazy';

      return `
        <li class="book-card">
          <img
           loading="${loadingAttribute}"
            class="book-cover"
            src="${book_image}"
            alt="Book cover: ${safeTitle} by ${safeAuthor}"
            width="150"
            height="auto"
          />
          <div class="book-card-info">
            <div class="book-card-descriptions">
              <h3 class="book-card-title">${safeTitle.toLowerCase()}</h3>
              <h4 class="book-card-author">${safeAuthor}</h4>
            </div>
            <p class="book-price">$${displayPrice}</p>
          </div>
          <button
            type="button"
            class="btn-secondary btn-book"
            data-id="${_id}"
            aria-label="Learn more about ${safeTitle} by ${safeAuthor}"
          >
            Learn more
          </button>
        </li>`;
    })
    .join('');
}
function escapeHtml(text = '') {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}