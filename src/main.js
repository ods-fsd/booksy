import headerHtml from './partials/header.html?raw';
import heroHtml from './partials/hero.html?raw';
import booksHtml from './partials/books.html?raw';
import bookModalHtml from './partials/book-modal.html?raw';
import feedbacksHtml from './partials/feedback.html?raw';
import eventsHtml from './partials/events.html?raw';
import registerModalHtml from './partials/register-modal.html?raw';
import articleHtml from './partials/article.html?raw';
import locationHtml from './partials/location.html?raw';
import footerHtml from './partials/footer.html?raw';

console.log('[main] loaded');

const PARTIALS = {
  './partials/header.html': headerHtml,
  './partials/hero.html': heroHtml,
  './partials/books.html': booksHtml,
  './partials/book-modal.html': bookModalHtml,
  './partials/feedbacks.html': feedbacksHtml,
  './partials/events.html': eventsHtml,
  './partials/register-modal.html': registerModalHtml,
  './partials/article.html': articleHtml,
  './partials/location.html': locationHtml,
  './partials/footer.html': footerHtml,
};

function loadPartialsFromImports() {
  const nodes = Array.from(document.querySelectorAll('load[src]'));
  console.log('[partials] found', nodes.length);

  for (const node of nodes) {
    const src = node.getAttribute('src');
    const html = PARTIALS[src];

    if (!html) {
      console.warn('[partials] no entry for', src);
      continue;
    }
    node.insertAdjacentHTML('beforebegin', html);
    node.remove();
  }
  console.log('[partials] done');
}

document.addEventListener('DOMContentLoaded', () => {
  loadPartialsFromImports();
  // Тут пізніше ініціалізуємо Swiper для .feedbacks-swiper
  // initFeedbacksSlider();
});
