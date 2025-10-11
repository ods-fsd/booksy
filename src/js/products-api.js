import axios from 'axios';

const BASE_URL = 'https://books-backend.p.goit.global/books';
const apiClient = axios.create({ baseURL: BASE_URL });

// ---------------- MOCK DATA ----------------
const MOCK_CATEGORIES = [
  'Fiction',
  'Science',
  'Romance',
  'History',
  'Fantasy',
  'Business',
];

const MOCK_BOOKS = [
  {
    _id: 'm1',
    title: 'Mockingbird Dreams',
    author: 'Harper Green',
    book_image: 'https://placehold.co/227x322/EEE/333?text=Mock+1',
    price: 12.99,
  },
  {
    _id: 'm2',
    title: 'The Silent Ocean',
    author: 'Liam Stone',
    book_image: 'https://placehold.co/227x322/DDD/111?text=Mock+2',
    price: 9.99,
  },
  {
    _id: 'm3',
    title: 'Echoes of Tomorrow',
    author: 'Aria Vale',
    book_image: 'https://placehold.co/227x322/CCC/000?text=Mock+3',
    price: 14.99,
  },
  {
    _id: 'm4',
    title: 'The Quantum Garden',
    author: 'Soren Blake',
    book_image: 'https://placehold.co/227x322/BBB/000?text=Mock+4',
    price: 10.99,
  },
  {
    _id: 'm5',
    title: 'City of Secrets',
    author: 'Nora Kade',
    book_image: 'https://placehold.co/227x322/AAA/000?text=Mock+5',
    price: 11.49,
  },
  {
    _id: 'm6',
    title: 'Journey to Orion',
    author: 'Kai Mercer',
    book_image: 'https://placehold.co/227x322/999/fff?text=Mock+6',
    price: 13.99,
  },
];

// ---------------- UNIVERSAL FETCH HELPER ----------------
async function fetchURL(url = '') {
  try {
    const { data } = await apiClient.get(url);
    return data;
  } catch (error) {
    console.warn(`⚠️ API unavailable (${url}). Using mock data instead.`);
    return null; // повертаємо null, щоб виклик нижче підставив моки
  }
}

// ---------------- API-LIKE EXPORTS ----------------

export async function getCategoryList() {
  const list = await fetchURL('/category-list');
  if (!list) return MOCK_CATEGORIES; // fallback
  return list.map(item => item.list_name);
}

export async function getTopBooks() {
  const response = await fetchURL('/top-books');
  if (!response) {
    // fallback: одна категорія з моками
    return [
      {
        list_name: 'Mock Category',
        books: MOCK_BOOKS,
      },
    ];
  }

  return response.map(category => ({
    ...category,
    books: filterUniqueBooksByImage(category.books),
  }));
}

export async function getBooksByCategory(category) {
  const response = await fetchURL(`/category?category=${encodeURIComponent(category)}`);
  if (!response) return MOCK_BOOKS; // fallback
  return filterUniqueBooksByImage(response);
}

export async function getBookByID(id) {
  const response = await fetchURL(`/${id}`);
  if (!response) {
    return MOCK_BOOKS.find(b => b._id === id) || MOCK_BOOKS[0];
  }
  return response;
}

// ---------------- HELPERS ----------------
function filterUniqueBooksByImage(books) {
  const seen = new Set();
  return books.filter(book => {
    if (!book.book_image) return false;
    if (seen.has(book.book_image)) return false;
    seen.add(book.book_image);
    return true;
  });
}
