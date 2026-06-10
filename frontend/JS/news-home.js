(() => {
  async function loadNewsHome() {
    const container = document.querySelector('section .cards');
    if (!container || !window.BSKKMRJ_API) return;

    try {
      const { news } = await window.BSKKMRJ_API.apiGetJson("/api/news");
      if (!news || !news.length) return;

      // Get only first 3 published news items
      const recentNews = news.filter(n => n.published !== false).slice(0, 3);
      
      if (!recentNews.length) return;

      // Build HTML for news cards
      const newsHTML = recentNews
        .map(
          (item) => {
            const imageHtml = item.imageUrl 
              ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.title)}" style="width:100%; height:200px; object-fit:cover; border-radius:var(--radius-sm); margin-bottom:16px;">`
              : '';
            const urlHtml = item.url
              ? `<a class="link" href="${escapeHtml(item.url)}" target="_blank">Read more</a>`
              : '';
            
            return `
              <article class="card">
                ${imageHtml}
                <h3>${escapeHtml(item.title)}</h3>
                ${item.excerpt ? `<p>${escapeHtml(item.excerpt).slice(0, 260)}...</p>` : ''}
                ${urlHtml}
              </article>
            `;
          }
        )
        .join("");

      // Find the div that needs to be replaced (inside the cards class)
      const cardsContainer = document.querySelector('section:has(.cards)');
      if (cardsContainer) {
        const existingCards = cardsContainer.querySelector('.cards');
        if (existingCards) {
          existingCards.innerHTML = newsHTML;
        }
      }
    } catch (err) {
      console.warn("Failed to load news for homepage", err);
    }
  }

  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return String(text || "").replace(/[&<>"']/g, m => map[m]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadNewsHome);
  } else {
    loadNewsHome();
  }
})();
