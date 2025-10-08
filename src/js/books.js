const API_BASE = 'https://books-backend.p.goit.global/books';
const listEl = document.getElementById('books-list');
const showMoreBtn = document.getElementById('show-more-btn');
const counterShown = document.getElementById('books-shown');
const counterTotal = document.getElementById('books-total');
const categorySelect = document.getElementById('books-category-select');

let allBooks = [];
let filteredBooks = [];
let loadedCount = 0;
const itemsPerPage = window.innerWidth >= 1440 ? 24 : 10;

// =====  INIT =====
async function initBooks() {
  await loadCategories();
  await loadTopBooks();
  renderBooks();
  showMoreBtn.addEventListener('click', loadMoreBooks);
  categorySelect.addEventListener('change', onCategoryChange);
}

// =====  API HELPERS =====
async function fetchData(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (error) {
    console.error('API fetch failed:', error);
    return null;
  }
}

// =====  LOAD CATEGORIES =====
async function loadCategories() {
  const data = await fetchData(`${API_BASE}/category-list`);
  if (!data) {
    console.warn('Using fallback categories');
    categorySelect.innerHTML = `<option value="all">All Categories</option>`;
    return;
  }

  categorySelect.innerHTML = `<option value="all">All Categories</option>`;
  data.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.list_name;
    option.textContent = cat.list_name;
    categorySelect.appendChild(option);
  });
}

// =====  LOAD TOP BOOKS =====
async function loadTopBooks() {
  const data = await fetchData(`${API_BASE}/top-books`);
  if (!data) {
    console.warn('Using fallback books');
    filteredBooks = [];
    updateCounters();
    return;
  }

  // API повертає масив категорій з їх книгами, треба розпакувати
  const books = data.flatMap(cat => cat.books);
  allBooks = books;
  filteredBooks = [...books];
  updateCounters();
}

// =====  LOAD BOOKS BY CATEGORY =====
async function loadBooksByCategory(category) {
  const data = await fetchData(`${API_BASE}/category?category=${encodeURIComponent(category)}`);
  if (!data) {
    console.warn('Fallback books for category');
    filteredBooks = [];
    updateCounters();
    renderBooks();
    return;
  }
  filteredBooks = data;
  updateCounters();
  renderBooks();
}

// =====  RENDER BOOKS =====
function renderBooks() {
  const booksToShow = filteredBooks.slice(0, loadedCount + itemsPerPage);
  loadedCount = booksToShow.length;
  listEl.innerHTML = booksToShow
    .map(
      book => `
      <li class="book-card" data-id="${book._id}">
        <picture>
          <source srcset="${book.book_image} 1x, ${book.book_image} 2x" />
          <img class="book-image" src="${book.book_image}" alt="${book.title}" loading="lazy" />
        </picture>
        <div class="book-info">
          <h4 class="book-title">${book.title}</h4>
          <p class="book-author">${book.author}</p>
          <button class="book-btn" data-id="${book._id}">Learn More</button>
        </div>
      </li>`
    )
    .join('');

  updateCounters();
  toggleShowMoreButton();

  listEl.querySelectorAll('.book-btn').forEach(btn =>
    btn.addEventListener('click', e => {
      const id = e.target.dataset.id;
      const book = filteredBooks.find(b => b._id === id);
      if (typeof openBookModal === 'function') {
        openBookModal(book);
      } else {
        console.log('Book modal not implemented yet:', book);
      }
    })
  );
}

function updateCounters() {
  counterShown.textContent = loadedCount;
  counterTotal.textContent = filteredBooks.length;
}

function toggleShowMoreButton() {
  if (loadedCount >= filteredBooks.length) {
    showMoreBtn.style.display = 'none';
  } else {
    showMoreBtn.style.display = 'block';
  }
}

// =====  EVENT HANDLERS =====
function loadMoreBooks() {
  renderBooks();
}

function onCategoryChange(e) {
  const selected = e.target.value;
  loadedCount = 0;
  if (selected === 'all') {
    filteredBooks = [...allBooks];
    renderBooks();
  } else {
    loadBooksByCategory(selected);
  }
}

// =====  START =====
initBooks();
