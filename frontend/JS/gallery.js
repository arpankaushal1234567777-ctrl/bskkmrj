(() => {
  async function loadGallery() {
    const container = document.getElementById("galleryList");
    if (!container || !window.BSKKMRJ_API) return;

    try {
      const { items } = await window.BSKKMRJ_API.apiGetJson("/api/gallery");
      container.innerHTML = items
        .map(
          (i) => `
            <article class="card">
              <h3>${i.title}</h3>
              <p class="muted">${i.date}</p>
            </article>
          `
        )
        .join("");
    } catch (err) {
      console.warn(err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadGallery);
  } else {
    loadGallery();
  }
})();
