(() => {
  if (!window.BSKKMRJ_ADMIN) return;

  const form = document.getElementById("docForm");
  const idInput = document.getElementById("docId");
  const titleInput = document.getElementById("docTitle");
  const descInput = document.getElementById("docDescription");
  const fileUrlInput = document.getElementById("docFileUrl");
  const fileInput = document.getElementById("docFile");
  const publishedInput = document.getElementById("docPublished");
  const msgEl = document.getElementById("docFormMsg");
  const tableHost = document.getElementById("docTable");
  const resetBtn = document.getElementById("docResetBtn");
  const saveBtn = document.getElementById("docSaveBtn");

  let rows = [];
  let originalRows = [];

  async function refresh() {
    await window.BSKKMRJ_ADMIN.requireAuthOrRedirect();
    window.BSKKMRJ_ADMIN.wireLogout();
    const data = await window.BSKKMRJ_ADMIN.api("/api/documents");
    rows = data.documents || [];
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
      tableHost.innerHTML = '<div class="table-empty">No documents yet.</div>';
      return;
    }
    tableHost.innerHTML = `
      <table>
        <thead><tr><th>Title</th><th>Status</th><th>File</th><th></th></tr></thead>
        <tbody>
          ${rows
            .map(
              (d) => `
              <tr data-id="${d._id || ""}">
                <td>${escapeHtml(d.title || "")}</td>
                <td>${d.published === false ? "Unpublished" : "Published"}</td>
                <td>${d.fileUrl ? `<a href="${escapeHtml(d.fileUrl)}" target="_blank">Open</a>` : "—"}</td>
                <td>
                  <div class="table-actions">
                    <button type="button" class="btn btn-secondary btn-sm" data-action="edit">Edit</button>
                    <button type="button" class="btn btn-danger btn-sm" data-action="delete">Delete</button>
                  </div>
                </td>
              </tr>`
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
        const row = originalRows.find((r) => r._id === id);
        if (btn.dataset.action === "edit" && row) {
          idInput.value = row._id || "";
          titleInput.value = row.title || "";
          descInput.value = row.description || "";
          fileUrlInput.value = row.fileUrl?.startsWith("data:") ? "" : row.fileUrl || "";
          if (publishedInput) publishedInput.checked = row.published !== false;
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (btn.dataset.action === "delete") {
          if (!window.confirm("Delete this document?")) return;
          try {
            await window.BSKKMRJ_ADMIN.api(`/api/documents/${id}`, { method: "DELETE" });
            window.BSKKMRJ_ADMIN.showToast("Document deleted.", "success");
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
    descInput.value = "";
    fileUrlInput.value = "";
    if (fileInput) fileInput.value = "";
    if (publishedInput) publishedInput.checked = true;
    if (msgEl) msgEl.hidden = true;
  }

  if (resetBtn) resetBtn.addEventListener("click", resetForm);

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (saveBtn) saveBtn.disabled = true;

      const payload = {
        title: titleInput.value.trim(),
        description: descInput.value.trim(),
        fileUrl: fileUrlInput.value.trim(),
        published: publishedInput ? Boolean(publishedInput.checked) : true,
      };

      const fileData = await window.BSKKMRJ_ADMIN_UTILS?.readFileAsDataUrl(fileInput);
      if (fileData) payload.fileUrl = fileData;

      const id = idInput.value.trim();
      try {
        if (id) {
          await window.BSKKMRJ_ADMIN.api(`/api/documents/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
          });
          window.BSKKMRJ_ADMIN.showToast("Document updated.", "success");
        } else {
          await window.BSKKMRJ_ADMIN.api("/api/documents", {
            method: "POST",
            body: JSON.stringify(payload),
          });
          window.BSKKMRJ_ADMIN.showToast("Document created.", "success");
        }
        await refresh();
        resetForm();
      } catch (err) {
        window.BSKKMRJ_ADMIN.showToast(err.message, "error");
      } finally {
        if (saveBtn) saveBtn.disabled = false;
      }
    });
  }

  const searchBox = document.getElementById("searchBox");
  if (searchBox) {
    searchBox.addEventListener("input", () => {
      const value = searchBox.value.toLowerCase();
      rows = originalRows.filter((d) => (d.title || "").toLowerCase().includes(value));
      renderTable();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", refresh);
  } else {
    refresh();
  }
})();

