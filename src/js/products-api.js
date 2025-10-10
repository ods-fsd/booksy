import axios from 'axios';

const BASE_URL = 'https://books-backend.p.goit.global/books';
const apiClient = axios.create({ baseURL: BASE_URL });

/**
 * Helper function to make API requests to the base URL.
 * Handles basic error logging.
 * @param {string} url - The endpoint URL relative to BASE_URL.
 * @returns {Promise<Object|Array>} - The data returned from the API.
 */
async function fetchURL(url = '') {
  try {
    const { data } = await apiClient.get(url);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }
}

/**
 * Fetches the list of book categories from the API
 * @returns {Promise<Array>} Array of category names (list_name property from each category object)
 */
export async function getCategoryList() {
  const list = await fetchURL('/category-list');
  return list.map(e => e.list_name);
}

/**
 * Fetches the list of top 5 books in each categorie from the API
 * @returns {Promise<Object>} Object of book categories, each containing details about the 5 books within that category
 */
export async function getTopBooks() {
  const response = await fetchURL(`/top-books`);
  const uniqueBooks = response.map(list => ({
    ...list,
    books: filterUniqueBooksByImage(list.books),
  }));
  return uniqueBooks;
}

/**
 * Fetches the list books in certain categorie from the API
 * @param {string} category - The name of the category to fetch books for.
 * @returns {Promise<Object>} Object of books in that category
 */
export async function getBooksByCategory(category) {
  if (!category) {
    const error = new Error('Valid category must be provided.');
    console.error(error);
    throw error;
  }
  const response = await fetchURL(`/category?category=${category}`);
  const uniqueBooks = filterUniqueBooksByImage(response);
  return uniqueBooks;
}

/**
 * Filters an array of books to keep only those with unique book_image URLs
 * @param {Array<Object>} books - Array of book objects
 * @returns {Array<Object>} Filtered array of books with unique book_image
 */
// function filterUniqueBooksByImage(books) {
//   return books.filter(
//     (book, index, self) =>
//       index === self.findIndex(b => b.book_image === book.book_image)
//   );
// }
function filterUniqueBooksByImage(books) {
  const seen = new Set();
  return books.filter(book => {
    if (seen.has(book.book_image)) return false;
    seen.add(book.book_image);
    return true;
  });
}

/**
 * Fetches the list of book details by ID from the API
 * @param {string} id - The unique ID of the book.
 * @returns {Promise<Object>} An object containing the book's details.
 */
export async function getBookByID(id) {
  if (!id) {
    const error = new Error('Valid book ID must be provided.');
    console.error(error);
    throw error;
  }
  return await fetchURL(`/${id}`);
}
