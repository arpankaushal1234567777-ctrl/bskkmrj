(() => {
  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderEmpty(container, message) {
    if (!container) return;
    container.innerHTML = `<div class="empty">${escapeHtml(message)}</div>`;
  }

  function renderError(container, message) {
    if (!container) return;
    container.innerHTML = `<div class="empty">${escapeHtml(message)}</div>`;
  }

  async function loadAboutPage() {
    const root = document.getElementById("aboutContent");
    if (!root || !window.BSKKMRJ_API) return;

    root.innerHTML = `<div class="loading"><span class="spinner"></span>Loading about content...</div>`;

    try {
      const data = await window.BSKKMRJ_API.apiGetJson("/api/about");
      root.innerHTML = `
        <div class="card prose">
          <img src="../assets/images/WhatsApp Image 2026-03-03 at 10.49.50 PM.jpeg" alt="About us" style="width:100%; height:300px; object-fit:cover; border-radius:var(--radius-sm); margin-bottom:16px;">
          <h3>${escapeHtml(data.title || "About Us")}</h3>
          <p>${escapeHtml(data.description || data.text || "No description available.")}</p>
          ${data.history ? `<h3>History</h3><p>${escapeHtml(data.history)}</p>` : ""}
          ${data.mission ? `<h3>Mission</h3><p>${escapeHtml(data.mission)}</p>` : ""}
          ${data.vision ? `<h3>Vision</h3><p>${escapeHtml(data.vision)}</p>` : ""}
        </div>
      `;
    } catch (err) {
      console.warn("Failed to load about content", err);
      renderError(root, "Unable to load about content right now.");
    }
  }

  async function loadNewsPage() {
    const container = document.getElementById("newsList");
    if (!container || !window.BSKKMRJ_API) return;

    container.innerHTML = `<div class="loading"><span class="spinner"></span>Loading news...</div>`;

    try {
      const { news } = await window.BSKKMRJ_API.apiGetJson("/api/news");
      if (!news || !news.length) {
        renderEmpty(container, "No news found.");
        return;
      }

      container.innerHTML = news
        .map(
          (item) => `
            <article class="card">
              ${item.imageUrl ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.title)}" style="width:100%; height:200px; object-fit:cover; border-radius:var(--radius-sm); margin-bottom:16px;">` : ""}
              <h3>${escapeHtml(item.title)}</h3>
              ${item.date ? `<p class="muted">${escapeHtml(item.date)}</p>` : ""}
              ${item.excerpt || item.content ? `<p>${escapeHtml(item.excerpt || item.content).slice(0, 260)}</p>` : ""}
              ${item.url ? `<a class="link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">Continue</a>` : ""}
            </article>
          `
        )
        .join("");
    } catch (err) {
      console.warn("Failed to load news", err);
      renderError(container, "Unable to load news right now.");
    }
  }

  async function loadTeamPage(scope) {
    const container = document.getElementById(`${scope}TeamList`);
    if (!container || !window.BSKKMRJ_API) return;

    container.innerHTML = `<div class="loading"><span class="spinner"></span>Loading team...</div>`;

    try {
      const data = await window.BSKKMRJ_API.apiGetJson(`/api/team/${scope}`);
      const members = data[scope] || [];
      if (!members.length) {
        renderEmpty(container, `No ${scope} team members found.`);
        return;
      }

      container.innerHTML = members
        .map(
          (member) => `
            <div class="card">
              ${member.photo ? `<img src="${escapeHtml(member.photo)}" alt="${escapeHtml(member.name)}" style="width:100px; height:100px; object-fit:cover; border-radius:50%; margin:0 auto 16px; border:3px solid var(--brand);">` : ""}
              <h3 style="text-align:center;">${escapeHtml(member.name)}</h3>
              <p class="muted" style="text-align:center;">${escapeHtml(member.role || "")}</p>
              ${member.phone ? `<p class="muted" style="text-align:center;">${escapeHtml(member.phone)}</p>` : ""}
            </div>
          `
        )
        .join("");
    } catch (err) {
      console.warn(`Failed to load ${scope} team`, err);
      renderError(container, `Unable to load ${scope} team right now.`);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      loadAboutPage();
      loadNewsPage();
      loadTeamPage("national");
      loadTeamPage("state");
    });
  } else {
    loadAboutPage();
    loadNewsPage();
    loadTeamPage("national");
    loadTeamPage("state");
  }
})();
