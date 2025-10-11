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
let currentBreakpoint = window.innerWidth < 768 ? 'mobile' : 'desktop';

function showLoader() {
  loader?.classList.remove('hidden');
}
function hideLoader() {
  loader?.classList.add('hidden');
}

// --- ІНІЦІАЛІЗАЦІЯ ---
async function initializeBooks() {
  showLoader();
  try {
    // 1️⃣ Отримуємо список категорій
    const categoryList = await getCategoryList();
    renderCategoriesList(categoryList);

    // 2️⃣ Отримуємо топові книги для стартового показу
    const topBooksData = await getTopBooks();
    allBooks = topBooksData.flatMap(({ books }) => books);
    renderBooks();
  } catch (error) {
    console.error('❌ Помилка завантаження даних:', error);
    gallery.innerHTML = '<li class="no-books">Не вдалося завантажити книги. Спробуйте пізніше.</li>';
  } finally {
    hideLoader();
  }
}
initializeBooks();

// --- РЕНДЕР КАТЕГОРІЙ ---
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

// --- ОБРОБКА ВИБОРУ КАТЕГОРІЇ ---
async function selectCategory(category) {
  showLoader();

  select.value = category;
  list.querySelectorAll('.category-btn').forEach(btn =>
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
    console.error('❌ Помилка при завантаженні книг:', error);
    gallery.innerHTML = '<li class="no-books">Не вдалося завантажити книги цієї категорії</li>';
  } finally {
    hideLoader();
  }
}

select.addEventListener('change', e => {
  selectCategory(e.target.value);
});

list.addEventListener('click', e => {
  e.preventDefault();
  const btn = e.target.closest('.category-btn');
  if (!btn) return;
  selectCategory(btn.value);
});

// --- ПОКАЗ ЩЕ ---
showMore.addEventListener('click', () => {
  visibleCount += 4;
  updateBooksList();
  showMore.blur();
});

// --- РЕНДЕР КНИГ ---
function renderBooks() {
  visibleCount = getInitialCount();
  updateBooksList();
  totalCounter.textContent = allBooks.length;

  toggleShowMoreVisibility();
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
      toggleShowMoreVisibility();
      hideLoader();
    }, 100);
  });
}

function toggleShowMoreVisibility() {
  if (visibleCount >= allBooks.length) {
    showMore.classList.add('btn-show-more-hidden');
  } else {
    showMore.classList.remove('btn-show-more-hidden');
  }
}

function getInitialCount() {
  return window.innerWidth < 768 ? 10 : 24;
}

// --- АДАПТИВНИЙ РЕРЕНДЕР ---
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

// --- ДОДАТКОВІ ХЕЛПЕРИ ---
function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// --- МОДАЛКА ---
gallery.addEventListener('click', event => {
  const btn = event.target.closest('.btn-book');
  if (!btn) return;
  openBooksModal(btn.dataset.id);
});

// --- UI: стрілка селекта ---
let selectIsOpen = false;
select.addEventListener('mousedown', () => {
  arrow.style.transform = 'translateY(-50%) rotate(180deg)';
  selectIsOpen = true;
});
select.addEventListener('change', () => {
  if (selectIsOpen) {
    arrow.style.transform = 'translateY(-50%)';
    selectIsOpen = false;
  }
});
document.addEventListener('click', e => {
  if (selectIsOpen && !select.contains(e.target)) {
    arrow.style.transform = 'translateY(-50%)';
    selectIsOpen = false;
  }
});

// --- HTML РЕНДЕРИНГ ---
function createMarkup(data) {
  return data
    .map(({ title, author, book_image, price, _id }, index) => {
      const displayPrice =
        typeof price === 'number'
          ? price.toFixed(2)
          : price && price.trim() !== '0.00'
          ? price.trim()
          : '9.99';

      const safeTitle = escapeHtml(title);
      const safeAuthor = escapeHtml(author);
      const loadingAttr = index < 3 ? 'eager' : 'lazy';

      return `
        <li class="book-card">
          <img
            loading="${loadingAttr}"
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
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}
