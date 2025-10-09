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

/* ---------------- MOCK DATA (fallback) ---------------- */
const mockCategories = [
  { list_name: 'Combined Print and E-book Fiction' },
  { list_name: 'Combined Print and E-book Nonfiction' },
  { list_name: 'Hardcover fiction' },
  { list_name: 'Paperback trade fiction' },
  { list_name: 'Paperback nonfiction' },
  { list_name: 'Advice, how-to & Miscellaneous' },
  { list_name: "Children’s middle grade hardcover" },
];

const mockBooks = [
  {
    title: 'I Will Find You',
    author: 'Harlan Coben',
    price: 15,
    book_image:
      'https://images-na.ssl-images-amazon.com/images/I/91+V7QmNxtL._AC_UL600_SR600,400_.jpg',
  },
  {
    title: 'Hello Beautiful',
    author: 'Ann Napolitano',
    price: 12,
    book_image:
      'https://images-na.ssl-images-amazon.com/images/I/81kLwR4IuVL._AC_UL600_SR600,400_.jpg',
  },
  {
    title: 'It Starts With Us',
    author: 'Colleen Hoover',
    price: 10,
    book_image:
      'https://images-na.ssl-images-amazon.com/images/I/81sX+U4t1DL._AC_UL600_SR600,400_.jpg',
  },
  {
    title: 'Daisy Jones & The Six',
    author: 'Taylor Jenkins Reid',
    price: 14,
    book_image:
      'https://images-na.ssl-images-amazon.com/images/I/91kUqT3gr6L._AC_UL600_SR600,400_.jpg',
  },
  {
    title: 'Saved',
    author: 'Benjamin Hall',
    price: 11,
    book_image:
      'https://images-na.ssl-images-amazon.com/images/I/71e2vG0fDVL._AC_UL600_SR600,400_.jpg',
  },
  {
    title: 'Spare',
    author: 'Prince Harry',
    price: 13,
    book_image:
      'https://images-na.ssl-images-amazon.com/images/I/71+U6OcYpAL._AC_UL600_SR600,400_.jpg',
  },
  {
    title: 'Paris The Memoir',
    author: 'Paris Hilton',
    price: 15,
    book_image:
      'https://images-na.ssl-images-amazon.com/images/I/81kEQtiRffL._AC_UL600_SR600,400_.jpg',
  },
  {
    title: 'The Courage to Be Free',
    author: 'Ron DeSantis',
    price: 17,
    book_image:
      'https://images-na.ssl-images-amazon.com/images/I/81+2eWnX3bL._AC_UL600_SR600,400_.jpg',
  },
];

/* ---------------- FETCH HELPERS ---------------- */
async function safeFetch(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch {
    return null; // якщо API не відповідає
  }
}

async function fetchCategories() {
  return (await safeFetch(`${API_BASE}/category-list`)) || mockCategories;
}

async function fetchTopBooks() {
  const data = await safeFetch(`${API_BASE}/top-books`);
  if (data) return data.flatMap(c => c.books);
  return mockBooks;
}

async function fetchBooksByCategory(category) {
  const data = await safeFetch(`${API_BASE}/category?category=${encodeURIComponent(category)}`);
  return data || mockBooks;
}

/* ---------------- RENDER ---------------- */
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

/* ---------------- LOADERS ---------------- */
async function loadBooks() {
  let data;
  if (selectedCategory === 'top-books') {
    data = await fetchTopBooks();
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

/* ---------------- INIT ---------------- */
async function init() {
  try {
    const categories = await fetchCategories();
    renderCategories(categories);
    await loadBooks();
  } catch (err) {
    console.error('Error loading books section:', err);
    renderCategories(mockCategories);
    books = mockBooks;
    renderBooks(books.slice(0, PAGE_SIZE));
    updateCounter();
  }
}

init();
