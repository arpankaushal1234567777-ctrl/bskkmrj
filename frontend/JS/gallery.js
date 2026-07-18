(() => {
  function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(text || "").replace(/[&<>"']/g, m => map[m]);
  }

  async function loadGallery() {
    const container = document.getElementById("galleryList");
    if (!container || !window.BSKKMRJ_API) return;

    container.innerHTML = `<div class="loading"><span class="spinner"></span>Loading gallery...</div>`;

    try {
      const { items } = await window.BSKKMRJ_API.apiGetJson("/api/gallery");
      if (!items || !items.length) {
        container.innerHTML = `<div class="empty">No gallery items yet.</div>`;
        return;
      }
      container.innerHTML = items
        .map(
          (i) => `
            <article class="card">
              ${i.imageUrl ? `<img src="${escapeHtml(i.imageUrl)}" alt="${escapeHtml(i.title)}" style="width:100%; height:200px; object-fit:cover; border-radius:var(--radius-sm); margin-bottom:16px;">` : ""}
              <h3>${escapeHtml(i.title)}</h3>
              <p class="muted">${escapeHtml(i.date)}</p>
              ${i.description ? `<p>${escapeHtml(i.description)}</p>` : ""}
              ${i.imageUrl ? `<a class="link" href="${escapeHtml(i.imageUrl)}" target="_blank">View Full Size</a>` : ""}
            </article>
          `
        )
        .join("");
    } catch (err) {
      container.innerHTML = `<div class="empty">Unable to load gallery.</div>`;
      console.warn(err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadGallery);
  } else {
    loadGallery();
  }
})();
