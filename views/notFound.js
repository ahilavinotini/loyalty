// views/notFound.js — 404 Not Found view

/**
 * Renders a descriptive not-found message with a link back to the home page.
 * @returns {string} HTML string
 */
function renderNotFound() {
  return `
    <div class="not-found">
      <h1>Page not found</h1>
      <p>We couldn't find the page you were looking for.</p>
      <a href="/">Back to home</a>
    </div>
  `;
}
