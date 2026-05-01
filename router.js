// router.js — History API router

// Detect base path for GitHub Pages (e.g. /loyalty) or local (empty string)
var BASE_PATH = (function () {
  var scripts = document.querySelectorAll('script[src]');
  for (var i = 0; i < scripts.length; i++) {
    var src = scripts[i].getAttribute('src');
    if (src && src.indexOf('router.js') !== -1) {
      // src is like "/loyalty/router.js" or "router.js"
      return src.replace(/\/?router\.js$/, '').replace(/^\./, '') || '';
    }
  }
  return '';
}());

/**
 * Strips the base path prefix from a full pathname.
 * e.g. "/loyalty/articles/foo" → "/articles/foo"
 * @param {string} pathname
 * @returns {string}
 */
function stripBase(pathname) {
  if (BASE_PATH && pathname.indexOf(BASE_PATH) === 0) {
    var stripped = pathname.slice(BASE_PATH.length) || '/';
    return stripped.charAt(0) === '/' ? stripped : '/' + stripped;
  }
  return pathname;
}

/**
 * Inspects the given path and renders the appropriate view into #app.
 * Routes:
 *   /                      → renderHome
 *   /articles/{slug}       → renderArticle
 *   anything else          → renderNotFound
 * @param {string} path — already stripped of base path
 */
function route(path) {
  var app = document.getElementById('app');
  var cleanPath = stripBase(path);

  if (cleanPath === '/' || cleanPath === '') {
    app.innerHTML = renderHome(articles);
  } else {
    var articleMatch = cleanPath.match(/^\/articles\/([^/]+)$/);
    if (articleMatch) {
      var slug = articleMatch[1];
      app.innerHTML = renderArticle(slug, articles);
    } else {
      app.innerHTML = renderNotFound();
    }
  }

  window.scrollTo(0, 0);
}

/**
 * Pushes a new entry onto the History API stack and calls route().
 * @param {string} path — relative path like "/articles/foo" or "/"
 */
function navigate(path) {
  var fullPath = BASE_PATH + path;
  if (window.history && window.history.pushState) {
    history.pushState(null, '', fullPath);
    route(path);
  } else {
    window.location.href = fullPath;
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
