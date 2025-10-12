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
const loader = document.querySelector('.loader');

// Кастомний dropdown
const selectBtn = document.querySelector('.category-select-btn');
const selectText = document.querySelector('.category-select-text');
const dropdown = document.querySelector('.category-dropdown');

let allBooks = [];
let visibleCount = 0;
let currentBreakpoint = window.innerWidth < 768 ? 'mobile' : 'desktop';
let isDropdownOpen = false;

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
    const categoryList = await getCategoryList();
    renderCategoriesList(categoryList);

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
  // Старий select (прихований)
  select.innerHTML =
    '<option selected value="All categories">All categories</option>';
  
  // Desktop список кнопок
  list.innerHTML =
    '<li><button type="button" class="category-btn active-category" value="All categories">All categories</button></li>';

  // Mobile/Tablet dropdown
  dropdown.innerHTML = `
    <li class="category-dropdown-item">
      <button type="button" class="category-dropdown-btn active" data-value="All categories">
        All categories
      </button>
    </li>
  `;

  categories.forEach(cat => {
    // Старий select
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);

    // Desktop список
    const item = document.createElement('li');
    item.classList.add('category-item');
    const button = document.createElement('button');
    button.type = 'button';
    button.value = cat;
    button.textContent = cat;
    button.classList.add('category-btn');
    item.appendChild(button);
    list.appendChild(item);

    // Mobile dropdown
    const dropdownItem = document.createElement('li');
    dropdownItem.classList.add('category-dropdown-item');
    const dropdownBtn = document.createElement('button');
    dropdownBtn.type = 'button';
    dropdownBtn.classList.add('category-dropdown-btn');
    dropdownBtn.dataset.value = cat;
    dropdownBtn.textContent = cat;
    dropdownItem.appendChild(dropdownBtn);
    dropdown.appendChild(dropdownItem);
  });
}

// --- КАСТОМНИЙ DROPDOWN ---
function toggleDropdown() {
  isDropdownOpen = !isDropdownOpen;
  dropdown?.classList.toggle('hidden', !isDropdownOpen);
  selectBtn?.classList.toggle('open', isDropdownOpen);
}

function selectCategoryFromDropdown(category) {
  // Оновлюємо текст кнопки
  if (selectText) {
    selectText.textContent = category === 'All categories' ? 'Categories' : category;
  }
  
  // Оновлюємо активний стан у dropdown
  dropdown?.querySelectorAll('.category-dropdown-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.value === category);
  });
  
  // Закриваємо dropdown
  toggleDropdown();
  
  // Завантажуємо книги
  selectCategory(category);
}

// Event listeners для dropdown
selectBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleDropdown();
});

dropdown?.addEventListener('click', (e) => {
  const btn = e.target.closest('.category-dropdown-btn');
  if (!btn) return;
  selectCategoryFromDropdown(btn.dataset.value);
});

// Закриття при кліку поза dropdown
document.addEventListener('click', (e) => {
  if (isDropdownOpen && !selectBtn?.contains(e.target) && !dropdown?.contains(e.target)) {
    toggleDropdown();
  }
});

// Закриття при ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isDropdownOpen) {
    toggleDropdown();
  }
});

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

// Desktop категорії (клік на список)
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