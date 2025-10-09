(() => {
  const API_BASE = 'https://books-backend.p.goit.global/books';

  const refs = {
    filters: document.getElementById('books-filters'),
    list: document.getElementById('books-list'),
    showMore: document.getElementById('show-more-btn'),
    shownCount: document.getElementById('books-shown'),
    totalCount: document.getElementById('books-total'),
  };

  // ---------- Mock Data ----------
  const mockCategories = [
    { list_name: 'Fiction' },
    { list_name: 'Non-fiction' },
    { list_name: 'Science' },
    { list_name: 'Fantasy' },
    { list_name: 'History' },
  ];

  const mockBooks = [
    {
      title: 'The Great Adventure',
      author: 'John Doe',
      book_image: 'https://placehold.co/240x320?text=Book+1',
      price: 12.99,
      category: 'Fiction',
    },
    {
      title: 'Hidden Truths',
      author: 'Jane Smith',
      book_image: 'https://placehold.co/240x320?text=Book+2',
      price: 10.5,
      category: 'Fiction',
    },
    {
      title: 'The World of Science',
      author: 'Albert Newton',
      book_image: 'https://placehold.co/240x320?text=Book+3',
      price: 15.0,
      category: 'Science',
    },
    {
      title: 'Legends of Old',
      author: 'Clara Myth',
      book_image: 'https://placehold.co/240x320?text=Book+4',
      price: 11.25,
      category: 'Fantasy',
    },
    {
      title: 'Past and Present',
      author: 'George History',
      book_image: 'https://placehold.co/240x320?text=Book+5',
      price: 13.99,
      category: 'History',
    },
  ];

  // ---------- State ----------
  let books = [];
  let visibleCount = 0;
  const PAGE_SIZE = 8;
  let selectedCategory = 'top-books';
  let offlineMode = false;

  // ---------- Fetch helpers ----------
  async function fetchWithFallback(url, fallbackData) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Network response was not ok');
      return await res.json();
    } catch (err) {
      console.warn('⚠️ Using mock data due to fetch error:', err.message);
      offlineMode = true;
      return fallbackData;
    }
  }

  async function fetchCategories() {
    return await fetchWithFallback(`${API_BASE}/category-list`, mockCategories);
  }

  async function fetchTopBooks() {
    const top = await fetchWithFallback(`${API_BASE}/top-books`, [
      { books: mockBooks },
    ]);
    return top.flatMap(c => c.books);
  }

  async function fetchBooksByCategory(category) {
    if (offlineMode) {
      return mockBooks.filter(b => b.category === category);
    }
    return await fetchWithFallback(
      `${API_BASE}/category?category=${encodeURIComponent(category)}`,
      mockBooks.filter(b => b.category === category)
    );
  }

  // ---------- Renderers ----------
  function renderCategories(categories) {
    const buttons = [
      '<button class="active" data-category="top-books">All categories</button>',
      ...categories.map(
        cat => `<button data-category="${cat.list_name}">${cat.list_name}</button>`
      ),
    ];
    refs.filters.innerHTML = buttons.join('');

    refs.filters.addEventListener('click', async e => {
      if (e.target.tagName !== 'BUTTON') return;
      document
        .querySelectorAll('.books-filters button')
        .forEach(btn => btn.classList.remove('active'));
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

  // ---------- Loaders ----------
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

  // ---------- Init ----------
  async function init() {
    try {
      const categories = await fetchCategories();
      renderCategories(categories);
      await loadBooks();
    } catch (err) {
      console.error('Error initializing Books section:', err);
      offlineMode = true;
      renderCategories(mockCategories);
      books = mockBooks;
      visibleCount = Math.min(PAGE_SIZE, books.length);
      renderBooks(books.slice(0, visibleCount));
      updateCounter();
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
