// views/home.js — Home page view

/**
 * Formats an ISO date string (YYYY-MM-DD) as a readable string, e.g. "10 March 2025".
 * @param {string} isoDate
 * @returns {string}
 */
function formatDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/**
 * Renders a single article card HTML string.
 * @param {object} article
 * @returns {string}
 */
function renderArticleCard(article) {
  return `
    <div class="article-card" data-category="${article.category}" data-title="${article.title.toLowerCase()}" data-excerpt="${article.excerpt.toLowerCase()}">
      ${article.image ? `<img class="article-card-image" src="${article.image}" alt="${article.imageAlt || article.title}" loading="lazy">` : ''}
      <span class="category-badge">${article.category}</span>
      <h2>
        <a href="/articles/${article.slug}" onclick="navigate('/articles/${article.slug}'); return false;">${article.title}</a>
      </h2>
      <p class="article-date">${formatDate(article.publicationDate)}</p>
      <p class="article-excerpt">${article.excerpt}</p>
    </div>
  `;
}

/**
 * Renders the home page listing all published articles in reverse chronological order.
 * Includes search bar and category filter tags.
 * @param {object[]} articleList — array of article objects from articles.js
 * @returns {string} HTML string
 */
function renderHome(articleList) {
  const today = new Date().toISOString().slice(0, 10);

  const published = (articleList || [])
    .filter(article => article.publicationDate <= today)
    .sort((a, b) => b.publicationDate.localeCompare(a.publicationDate));

  // Collect unique categories from published articles
  const categories = [...new Set(published.map(a => a.category))];

  const categoryTags = [
    `<button class="filter-tag active" data-filter="all" onclick="filterArticles('all', this)">All</button>`,
    ...categories.map(cat =>
      `<button class="filter-tag" data-filter="${cat}" onclick="filterArticles('${cat}', this)">${cat}</button>`
    )
  ].join('');

  const articlesHTML = published.length === 0
    ? `<p class="empty-state">No articles published yet. Check back soon.</p>`
    : `<div class="article-grid" id="article-grid">
        ${published.map(renderArticleCard).join('')}
      </div>
      <p class="empty-state" id="no-results" style="display:none;">No articles match your search.</p>`;

  return `
    <header class="home-header">
      <div class="home-header-inner">
        <h1>The Loyalty Desk</h1>
        <p class="tagline">Insights on loyalty programmes, consumer behaviour, and merchant strategy across Malaysia and South East Asia.</p>
      </div>
    </header>

    <div class="search-bar-wrap">
      <div class="search-bar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="search"
          id="article-search"
          placeholder="Search articles…"
          aria-label="Search articles"
          oninput="filterArticles(window._activeFilter || 'all', null, this.value)"
        >
      </div>
    </div>

    <div class="category-filters" role="group" aria-label="Filter by category">
      ${categoryTags}
    </div>

    ${articlesHTML}
  `;
}

/**
 * Filters the article grid by category and/or search query.
 * Called from inline event handlers.
 * @param {string} category — category name or 'all'
 * @param {HTMLElement|null} btn — the clicked filter button (or null if called from search)
 * @param {string} [query] — optional search string
 */
function filterArticles(category, btn, query) {
  // Track active filter
  if (btn) {
    window._activeFilter = category;
    document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
  }

  const activeCategory = window._activeFilter || 'all';
  const searchQuery = (query !== undefined ? query : (document.getElementById('article-search') || {}).value || '').toLowerCase().trim();

  const cards = document.querySelectorAll('.article-card');
  let visibleCount = 0;

  cards.forEach(card => {
    const matchesCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
    const matchesSearch = !searchQuery ||
      card.dataset.title.includes(searchQuery) ||
      card.dataset.excerpt.includes(searchQuery) ||
      card.dataset.category.toLowerCase().includes(searchQuery);

    const visible = matchesCategory && matchesSearch;
    card.style.display = visible ? '' : 'none';
    if (visible) visibleCount++;
  });

  const noResults = document.getElementById('no-results');
  if (noResults) noResults.style.display = visibleCount === 0 ? '' : 'none';
}
