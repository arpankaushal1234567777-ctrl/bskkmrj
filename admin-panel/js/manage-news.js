(() => {
  if (!window.BSKKMRJ_ADMIN) return;

  const form = document.getElementById("newsForm");
  const idInput = document.getElementById("newsId");
  const titleInput = document.getElementById("newsTitle");
  const excerptInput = document.getElementById("newsExcerpt");
  const urlInput = document.getElementById("newsUrl");
  const msgEl = document.getElementById("newsFormMsg");
  const tableHost = document.getElementById("newsTable");
  const resetBtn = document.getElementById("newsResetBtn");

  let rows = [];
  
  let originalRows = [];

  async function refresh() {
    await window.BSKKMRJ_ADMIN.requireAuthOrRedirect();
    window.BSKKMRJ_ADMIN.wireLogout();
    const data = await window.BSKKMRJ_ADMIN.api("/api/news");
    rows = data.news || [];
    originalRows = [...rows];

    renderTable();
  }

  function renderTable() {
    if (!tableHost) return;
    if (!rows.length) {
      tableHost.innerHTML = "<div class=\"table-empty\">No news posts yet.</div>";
      return;
    }
    tableHost.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>URL</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (n) => `
              <tr data-id="${n._id || ""}">
                <td>${n.title}</td>
                <td>${n.url ? `<a href="${n.url}" target="_blank">Open</a>` : ""}</td>
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
          excerptInput.value = row.excerpt || "";
          urlInput.value = row.url || "";
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (btn.dataset.action === "delete") {
          if (!window.confirm("Delete this news item?")) return;
          await window.BSKKMRJ_ADMIN.api(`/api/news/${id}`, { method: "DELETE" });
          await refresh();
        }
      });
    });
  }

  // NEWS SEARCH FILTER
const searchBox = document.getElementById("searchBox");

if(searchBox){

searchBox.addEventListener("input", function(){

const value = this.value.toLowerCase();

rows = originalRows.filter(n =>
(n.title || "").toLowerCase().includes(value)
);



renderTable();

});

}

  function resetForm() {
    idInput.value = "";
    titleInput.value = "";
    excerptInput.value = "";
    urlInput.value = "";
    msgEl.hidden = true;
    msgEl.textContent = "";
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetForm);
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      msgEl.hidden = true;
      msgEl.textContent = "";

      const payload = {
        title: titleInput.value.trim(),
        excerpt: excerptInput.value.trim(),
        url: urlInput.value.trim(),
      };
      const id = idInput.value.trim();

      try {
        if (id) {
          await window.BSKKMRJ_ADMIN.api(`/api/news/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
          });
          msgEl.textContent = "News updated.";
        } else {
          await window.BSKKMRJ_ADMIN.api("/api/news", {
            method: "POST",
            body: JSON.stringify(payload),
          });
          msgEl.textContent = "News created.";
        }
        msgEl.hidden = false;
        await refresh();
        resetForm();
      } catch (err) {
        msgEl.textContent = err.message || "Error saving news";
        msgEl.hidden = false;
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", refresh);
  } else {
    refresh();
  }
})();

