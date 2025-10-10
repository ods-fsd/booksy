import axios from 'axios';

const BASE_URL = 'https://books-backend.p.goit.global/books';
const apiClient = axios.create({ baseURL: BASE_URL });

/**
 * Universal helper to make API requests.
 * Handles basic error logging and response extraction.
 * @param {string} url - The endpoint URL relative to BASE_URL.
 * @returns {Promise<Object|Array>} - Data returned from the API.
 */
async function fetchURL(url = '') {
  try {
    const { data } = await apiClient.get(url);
    return data;
  } catch (error) {
    console.error(`❌ Error fetching data from ${url}:`, error.message);
    throw new Error('Failed to fetch data from the Books API');
  }
}

/**
 * 🔹 Отримати перелік усіх категорій книг
 * @returns {Promise<Array<string>>} Масив назв категорій
 * Endpoint: /category-list
 */
export async function getCategoryList() {
  const list = await fetchURL('/category-list');
  return list.map(item => item.list_name);
}

/**
 * 🔹 Отримати популярні книги (топові з усіх категорій)
 * @returns {Promise<Array<Object>>} Масив об’єктів категорій із масивами книг
 * Endpoint: /top-books
 */
export async function getTopBooks() {
  const response = await fetchURL('/top-books');
  // Усуваємо дублікати книг із однаковими зображеннями
  return response.map(category => ({
    ...category,
    books: filterUniqueBooksByImage(category.books),
  }));
}

/**
 * 🔹 Отримати книги конкретної категорії
 * @param {string} category - Назва категорії
 * @returns {Promise<Array<Object>>} Масив книг цієї категорії
 * Endpoint: /category?category=selectedCategory
 */
export async function getBooksByCategory(category) {
  if (!category || typeof category !== 'string') {
    throw new Error('Valid category name must be provided.');
  }
  const response = await fetchURL(`/category?category=${encodeURIComponent(category)}`);
  return filterUniqueBooksByImage(response);
}

/**
 * 🔹 Отримати детальну інформацію про книгу за ID
 * @param {string} id - Унікальний ідентифікатор книги
 * @returns {Promise<Object>} Об’єкт із детальною інформацією про книгу
 * Endpoint: /bookId
 */
export async function getBookByID(id) {
  if (!id || typeof id !== 'string') {
    throw new Error('Valid book ID must be provided.');
  }
  return await fetchURL(`/${id}`);
}

/**
 * 🔸 Утиліта для фільтрації дублікатів книг за book_image
 * @param {Array<Object>} books - Масив книг
 * @returns {Array<Object>} Масив без дублікатів
 */
function filterUniqueBooksByImage(books) {
  const seen = new Set();
  return books.filter(book => {
    if (!book.book_image) return false;
    if (seen.has(book.book_image)) return false;
    seen.add(book.book_image);
    return true;
  });
}
