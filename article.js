// views/article.js — Individual article page view

/**
 * Renders the full article page for the given slug.
 * Falls through to renderNotFound if the slug does not match any article.
 * @param {string} slug
 * @param {object[]} articleList — array of article objects from articles.js
 * @returns {string} HTML string
 */
function renderArticle(slug, articleList) {
  const article = (articleList || []).find(a => a.slug === slug);

  if (!article) {
    return renderNotFound();
  }

  return `
    <div class="article-page">
      <a href="/" onclick="navigate('/'); return false;">← Back to all articles</a>
      ${article.image ? `<img class="article-hero-image" src="${article.image}" alt="${article.imageAlt || article.title}">` : ''}
      <span class="category-badge">${article.category}</span>
      <h1>${article.title}</h1>
      <div class="article-meta">
        <span>${article.author}</span> · <span>${formatDate(article.publicationDate)}</span>
      </div>
      <div class="article-body">${article.body}</div>
    </div>
  `;
}
