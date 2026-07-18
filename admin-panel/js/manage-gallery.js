(() => {
  if (!window.BSKKMRJ_ADMIN) return;

  const form = document.getElementById("galleryForm");
  const idInput = document.getElementById("galleryId");
  const titleInput = document.getElementById("galleryTitle");
  const dateInput = document.getElementById("galleryDate");
  const descInput = document.getElementById("galleryDescription");
  const imageUrlInput = document.getElementById("galleryImageUrl");
  const imageFileInput = document.getElementById("galleryImage");
  const previewEl = document.getElementById("galleryPreview");
  const msgEl = document.getElementById("galleryFormMsg");
  const tableHost = document.getElementById("galleryTable");
  const resetBtn = document.getElementById("galleryResetBtn");
  const saveBtn = document.getElementById("gallerySaveBtn");

  let rows = [];
  let originalRows = [];

  if (window.BSKKMRJ_ADMIN_UTILS) {
    window.BSKKMRJ_ADMIN_UTILS.wireImagePreview(imageFileInput, previewEl);
  }

  async function refresh() {
    await window.BSKKMRJ_ADMIN.requireAuthOrRedirect();
    window.BSKKMRJ_ADMIN.wireLogout();
    const data = await window.BSKKMRJ_ADMIN.api("/api/gallery");
    rows = data.items || [];
    originalRows = [...rows];
    renderTable();
  }

  function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(text || "").replace(/[&<>"']/g, m => map[m]);
  }

  function renderTable() {
    if (!tableHost) return;
    if (!rows.length) {
      tableHost.innerHTML = '<div class="table-empty">No gallery items yet.</div>';
      return;
    }
    const body = rows
      .map(
        (g) => `
        <tr data-id="${g._id || ""}">
          <td>${escapeHtml(g.title)}</td>
          <td>${escapeHtml(g.date)}</td>
          <td>${escapeHtml((g.description || "").slice(0, 60))}</td>
          <td>${g.imageUrl ? `<a href="${escapeHtml(g.imageUrl)}" target="_blank">View</a>` : ""}</td>
          <td>
            <div class="table-actions">
              <button type="button" class="btn btn-secondary btn-sm" data-action="edit">Edit</button>
              <button type="button" class="btn btn-danger btn-sm" data-action="delete">Delete</button>
            </div>
          </td>
        </tr>
      `
      )
      .join("");
    tableHost.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Description</th>
            <th>Image</th>
            <th></th>
          </tr>
        </thead>
        <tbody>${body}</tbody>
      </table>
    `;

    tableHost.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const tr = btn.closest("tr");
        const id = tr?.getAttribute("data-id");
        if (!id) return;
        const row = originalRows.find((r) => r._id === id);
        if (btn.dataset.action === "edit" && row) {
          idInput.value = row._id || "";
          titleInput.value = row.title || "";
          dateInput.value = row.date || "";
          descInput.value = row.description || "";
          imageUrlInput.value = row.imageUrl?.startsWith("data:") ? "" : row.imageUrl || "";
          if (previewEl && row.imageUrl) {
            previewEl.src = row.imageUrl;
            previewEl.hidden = false;
          }
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (btn.dataset.action === "delete") {
          if (!window.confirm("Delete this gallery item?")) return;
          try {
            await window.BSKKMRJ_ADMIN.api(`/api/gallery/${id}`, { method: "DELETE" });
            window.BSKKMRJ_ADMIN.showToast("Gallery item deleted.", "success");
            await refresh();
          } catch (err) {
            window.BSKKMRJ_ADMIN.showToast(err.message, "error");
          }
        }
      });
    });
  }

  function resetForm() {
    idInput.value = "";
    titleInput.value = "";
    dateInput.value = "";
    descInput.value = "";
    imageUrlInput.value = "";
    if (imageFileInput) imageFileInput.value = "";
    if (previewEl) {
      previewEl.src = "";
      previewEl.hidden = true;
    }
    msgEl.hidden = true;
    msgEl.textContent = "";
  }

  if (resetBtn) resetBtn.addEventListener("click", resetForm);

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      msgEl.hidden = true;
      if (saveBtn) saveBtn.disabled = true;

      const payload = {
        title: titleInput.value.trim(),
        date: dateInput.value.trim(),
        description: descInput.value.trim(),
        imageUrl: imageUrlInput.value.trim(),
      };
      const fileData = await window.BSKKMRJ_ADMIN_UTILS?.readFileAsDataUrl(imageFileInput);
      if (fileData) payload.imageBase64 = fileData;
      const id = idInput.value.trim();

      try {
        if (id) {
          await window.BSKKMRJ_ADMIN.api(`/api/gallery/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
          });
          window.BSKKMRJ_ADMIN.showToast("Gallery item updated.", "success");
        } else {
          await window.BSKKMRJ_ADMIN.api("/api/gallery", {
            method: "POST",
            body: JSON.stringify(payload),
          });
          window.BSKKMRJ_ADMIN.showToast("Gallery item created.", "success");
        }
        await refresh();
        resetForm();
      } catch (err) {
        msgEl.textContent = err.message || "Error saving gallery item";
        msgEl.hidden = false;
        window.BSKKMRJ_ADMIN.showToast(msgEl.textContent, "error");
      } finally {
        if (saveBtn) saveBtn.disabled = false;
      }
    });
  }

  const searchBox = document.getElementById("searchBox");
  if (searchBox) {
    searchBox.placeholder = "Search gallery...";
    searchBox.addEventListener("input", () => {
      const value = searchBox.value.toLowerCase();
      rows = originalRows.filter(
        (g) =>
          (g.title || "").toLowerCase().includes(value) ||
          (g.description || "").toLowerCase().includes(value)
      );
      renderTable();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", refresh);
  } else {
    refresh();
  }
})();
