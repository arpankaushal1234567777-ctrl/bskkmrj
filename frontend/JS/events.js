(() => {
  async function loadEvents() {
    const container = document.getElementById("eventsList");
    if (!container || !window.BSKKMRJ_API) return;

    try {
      const { events } = await window.BSKKMRJ_API.apiGetJson("/api/events");
      container.innerHTML = events
        .map(
          (e) => `
            <article class="card">
              <h3>${e.title}</h3>
              <p class="muted">${e.date}</p>
            </article>
          `
        )
        .join("");
    } catch (err) {
      console.warn(err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadEvents);
  } else {
    loadEvents();
  }
})();
