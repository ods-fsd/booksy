const API_BASE = 'https://books-backend.p.goit.global/books';

const refs = {
  filters: document.getElementById('books-filters'),
  list: document.getElementById('books-list'),
  showMore: document.getElementById('show-more-btn'),
  shownCount: document.getElementById('books-shown'),
  totalCount: document.getElementById('books-total'),
};

let books = [];
let visibleCount = 0;
const PAGE_SIZE = 8;
let selectedCategory = 'top-books';

// ----------- Fetch helpers -----------
async function fetchCategories() {
  const res = await fetch(`${API_BASE}/category-list`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return await res.json();
}

async function fetchTopBooks() {
  const res = await fetch(`${API_BASE}/top-books`);
  if (!res.ok) throw new Error('Failed to fetch top books');
  return await res.json();
}

async function fetchBooksByCategory(category) {
  const res = await fetch(`${API_BASE}/category?category=${encodeURIComponent(category)}`);
  if (!res.ok) throw new Error('Failed to fetch books by category');
  return await res.json();
}

// ----------- Renderers -----------
function renderCategories(categories) {
  const buttons = [
    '<button class="active" data-category="top-books">All categories</button>',
    ...categories.map(cat => `<button data-category="${cat.list_name}">${cat.list_name}</button>`),
  ];
  refs.filters.innerHTML = buttons.join('');

  refs.filters.addEventListener('click', async e => {
    if (e.target.tagName !== 'BUTTON') return;
    document.querySelectorAll('.books-filters button').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    selectedCategory = e.target.dataset.category;
    books = [];
    visibleCount = 0;
    refs.list.innerHTML = '';
    await loadBooks();
  });
}

function renderBooks(booksToRender) {
  const markup = booksToRender
    .map(
      ({ title, author, book_image, price }) => `
    <li class="books-item">
      <div class="books-cover">
        <img src="${book_image}" alt="${title}" loading="lazy" />
      </div>
      <div class="books-info">
        <h4>${title}</h4>
        <p>${author}</p>
        <p class="books-price">$${price ?? 10}</p>
        <button class="books-learn-more">Learn More</button>
      </div>
    </li>
  `
    )
    .join('');
  refs.list.insertAdjacentHTML('beforeend', markup);
}

function updateCounter() {
  refs.shownCount.textContent = visibleCount;
  refs.totalCount.textContent = books.length;
}

// ----------- Loaders -----------
async function loadBooks() {
  let data;
  if (selectedCategory === 'top-books') {
    const top = await fetchTopBooks();
    data = top.flatMap(c => c.books);
  } else {
    data = await fetchBooksByCategory(selectedCategory);
  }

  books = data;
  visibleCount = Math.min(PAGE_SIZE, books.length);
  renderBooks(books.slice(0, visibleCount));
  updateCounter();

  refs.showMore.style.display = books.length > visibleCount ? 'block' : 'none';
}

refs.showMore.addEventListener('click', () => {
  const nextCount = visibleCount + PAGE_SIZE;
  renderBooks(books.slice(visibleCount, nextCount));
  visibleCount = Math.min(nextCount, books.length);
  updateCounter();

  if (visibleCount >= books.length) refs.showMore.style.display = 'none';
});

// ----------- Init -----------
async function init() {
  try {
    const categories = await fetchCategories();
    renderCategories(categories);
    await loadBooks();
  } catch (err) {
    console.error('Error loading books section:', err);
  }
}

init();
