// router.js — History API router

/**
 * Inspects the given path and renders the appropriate view into #app.
 * Routes:
 *   /                      → renderHome
 *   /articles/{slug}       → renderArticle
 *   anything else          → renderNotFound
 * @param {string} path
 */
function route(path) {
  const app = document.getElementById('app');

  if (path === '/') {
    app.innerHTML = renderHome(articles);
  } else {
    const articleMatch = path.match(/^\/articles\/([^/]+)$/);
    if (articleMatch) {
      const slug = articleMatch[1];
      app.innerHTML = renderArticle(slug, articles);
    } else {
      app.innerHTML = renderNotFound();
    }
  }

  window.scrollTo(0, 0);
}

/**
 * Pushes a new entry onto the History API stack and calls route().
 * Falls back to location.href assignment if History API is unavailable.
 * @param {string} path
 */
function navigate(path) {
  if (window.history && window.history.pushState) {
    history.pushState(null, '', path);
    route(path);
  } else {
    window.location.href = path;
  }
}

// Handle browser back/forward navigation
window.addEventListener('popstate', function () {
  route(location.pathname);
});

// Initialise the app on page load
document.addEventListener('DOMContentLoaded', function () {
  route(location.pathname);
});
