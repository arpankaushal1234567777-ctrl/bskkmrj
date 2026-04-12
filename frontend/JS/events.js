(() => {
  async function loadEvents() {
    const container = document.getElementById("eventsList");
    if (!container || !window.BSKKMRJ_API) return;

    container.innerHTML = `<div class="loading"><span class="spinner"></span>Loading events...</div>`;

    try {
      const { events } = await window.BSKKMRJ_API.apiGetJson("/api/events");
      if (!events || !events.length) {
        container.innerHTML = `<div class="empty">No events found.</div>`;
        return;
      }
      container.innerHTML = events
        .map(
          (e) => `
            <article class="card">
              <h3>${e.title}</h3>
              <p class="muted">${e.date}</p>
              ${e.location ? `<p class="small muted">${e.location}</p>` : ""}
            </article>
          `
        )
        .join("");
    } catch (err) {
      container.innerHTML = `<div class="empty">Unable to load events.</div>`;
      console.warn(err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadEvents);
  } else {
    loadEvents();
  }
})();
