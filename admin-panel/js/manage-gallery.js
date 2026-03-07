(() => {
  if (!window.BSKKMRJ_ADMIN) return;

  const form = document.getElementById("galleryForm");
  const idInput = document.getElementById("galleryId");
  const titleInput = document.getElementById("galleryTitle");
  const dateInput = document.getElementById("galleryDate");
  const imageUrlInput = document.getElementById("galleryImageUrl");
  const msgEl = document.getElementById("galleryFormMsg");
  const tableHost = document.getElementById("galleryTable");
  const resetBtn = document.getElementById("galleryResetBtn");

  let rows = [];

  async function refresh() {
    await window.BSKKMRJ_ADMIN.requireAuthOrRedirect();
    window.BSKKMRJ_ADMIN.wireLogout();
    const data = await window.BSKKMRJ_ADMIN.api("/api/gallery");
    rows = data.items || [];
    renderTable();
  }

  function renderTable() {
    if (!tableHost) return;
    if (!rows.length) {
      tableHost.innerHTML = "<div class=\"table-empty\">No gallery items yet.</div>";
      return;
    }
    tableHost.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Image URL</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (g) => `
              <tr data-id="${g._id || ""}">
                <td>${g.title}</td>
                <td>${g.date}</td>
                <td>${g.imageUrl ? `<a href="${g.imageUrl}" target="_blank">Open</a>` : ""}</td>
                <td>
                  <div class="table-actions">
                    <button type="button" class="btn btn-secondary btn-sm" data-action="edit">Edit</button>
                    <button type="button" class="btn btn-danger btn-sm" data-action="delete">Delete</button>
                  </div>
                </td>
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>
    `;

    tableHost.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const tr = btn.closest("tr");
        const id = tr?.getAttribute("data-id");
        if (!id) return;
        const row = rows.find((r) => r._id === id);
        if (btn.dataset.action === "edit" && row) {
          idInput.value = row._id || "";
          titleInput.value = row.title || "";
          dateInput.value = row.date || "";
          imageUrlInput.value = row.imageUrl || "";
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (btn.dataset.action === "delete") {
          if (!window.confirm("Delete this gallery item?")) return;
          await window.BSKKMRJ_ADMIN.api(`/api/gallery/${id}`, { method: "DELETE" });
          await refresh();
        }
      });
    });
  }

  function resetForm() {
    idInput.value = "";
    titleInput.value = "";
    dateInput.value = "";
    imageUrlInput.value = "";
    msgEl.hidden = true;
    msgEl.textContent = "";
  }

  if (resetBtn) resetBtn.addEventListener("click", resetForm);

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      msgEl.hidden = true;
      msgEl.textContent = "";

      const payload = {
        title: titleInput.value.trim(),
        date: dateInput.value.trim(),
        imageUrl: imageUrlInput.value.trim(),
      };
      const id = idInput.value.trim();

      try {
        if (id) {
          await window.BSKKMRJ_ADMIN.api(`/api/gallery/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
          });
          msgEl.textContent = "Gallery item updated.";
        } else {
          await window.BSKKMRJ_ADMIN.api("/api/gallery", {
            method: "POST",
            body: JSON.stringify(payload),
          });
          msgEl.textContent = "Gallery item created.";
        }
        msgEl.hidden = false;
        await refresh();
        resetForm();
      } catch (err) {
        msgEl.textContent = err.message || "Error saving gallery item";
        msgEl.hidden = false;
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", refresh);
  } else {
    refresh();
  }

  // GALLERY SEARCH
const searchBox = document.getElementById("searchBox");

if(searchBox){

searchBox.addEventListener("input", function(){

const value = this.value.toLowerCase();

const filtered = rows.filter(g =>
(g.title || "").toLowerCase().includes(value)
);

rows = filtered;

renderTable();

});

}
})();

