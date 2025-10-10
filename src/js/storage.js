// Функції для роботи з localStorage

const CART_STORAGE_KEY = 'shopping_cart';

/**
 * Adds a book to the shopping cart or increases its quantity if already exists
 * @param {string} bookID - Unique identifier of the book
 * @param {number} bookQuantity - Quantity of books to add (must be positive)
 * @returns {boolean} True if successfully added to cart, false otherwise
 * @example
 * // Add 2 copies of book with ID "xyz"
 * addToCart("xyz", 2);
 */
export function addToCart(bookID, bookQuantity) {
  if (!bookID || bookQuantity <= 0) {
    console.warn("Wrong parameters, can't add to cart");
    return false;
  }

  const cart = getFullCart();
  const currentQuantity = cart[bookID] || 0;

  cart[bookID] = Number(currentQuantity) + Number(bookQuantity);

  return saveCart(cart);
}

/**
 * Removes a specific book from the shopping cart completely
 * @param {string} bookID - Unique identifier of the book to remove
 * @returns {boolean} True if successfully removed, false if bookID is invalid or save failed
 * @example
 * // Remove book with ID "123" from cart
 * removeFromCart("123");
 */
export function removeFromCart(bookID) {
  if (!bookID) return false;

  const cart = getFullCart();
  delete cart[bookID];

  return saveCart(cart);
}

/**
 * Clears all items from the shopping cart
 * @returns {boolean} True if successfully cleared, false otherwise
 * @example
 * // Remove all items from cart
 * clearCart();
 */
export function clearCart() {
  return saveCart({});
}

/**
 * Gets the quantity of a specific book in the cart
 * @param {string} bookID - Unique identifier of the book
 * @returns {number} Quantity of the book in cart (0 if not found)
 * @example
 * // Get quantity of book with ID "123"
 * getFromCartByID("123");
 */
export function getFromCartByID(bookID) {
  if (!bookID) return 0;

  const cart = getFullCart();
  return Number(cart[bookID]) || 0;
}

/**
 * Retrieves the entire shopping cart from localStorage
 * @returns {Object} Cart object with bookID as keys and quantities as values
 * @example
 * // Returns object like: { "id123": 2, "id456": 1 }
 * const cart = getFullCart();
 */
export function getFullCart() {
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    return cartData ? JSON.parse(cartData) : {};
  } catch (error) {
    console.error('Cart data getting error:', error);
    return {};
  }
}

/**
 * Saves the entire cart object to localStorage
 * @param {Object} cart - Cart object with bookID as keys and quantities as values
 * @returns {boolean} True if successfully saved, false if error occurred
 * @private
 */
function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    return true;
  } catch (error) {
    console.error('Cart saving error:', error);
    return false;
  }
}
