(() => {
  if (!window.BSKKMRJ_ADMIN) return;

  const form = document.getElementById("newsForm");
  const idInput = document.getElementById("newsId");
  const titleInput = document.getElementById("newsTitle");
  const dateInput = document.getElementById("newsDate");
  const excerptInput = document.getElementById("newsExcerpt");
  const contentInput = document.getElementById("newsContent");
  const urlInput = document.getElementById("newsUrl");
  const imageUrlInput = document.getElementById("newsImageUrl");
  const imageFileInput = document.getElementById("newsImage");
  const previewEl = document.getElementById("newsPreview");
  const publishedInput = document.getElementById("newsPublished");
  const msgEl = document.getElementById("newsFormMsg");
  const tableHost = document.getElementById("newsTable");
  const resetBtn = document.getElementById("newsResetBtn");
  const saveBtn = document.getElementById("newsSaveBtn");

  let rows = [];
  let originalRows = [];

  if (window.BSKKMRJ_ADMIN_UTILS) {
    window.BSKKMRJ_ADMIN_UTILS.wireImagePreview(imageFileInput, previewEl);
  }

  async function refresh() {
    if (tableHost) {
      tableHost.innerHTML = '<div class="loading"><span class="spinner"></span>Loading news...</div>';
    }
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
      tableHost.innerHTML = '<div class="table-empty">No news posts yet.</div>';
      return;
    }
    tableHost.innerHTML = `
      <table>
        <thead><tr><th>Title</th><th>Date</th><th>Status</th><th>Link</th><th></th></tr></thead>
        <tbody>
          ${rows
            .map(
              (n) => `
              <tr data-id="${n._id || ""}">
                <td>${n.title}</td>
                <td>${n.date || ""}</td>
                <td>${n.published === false ? "Unpublished" : "Published"}</td>
                <td>${n.url ? `<a href="${n.url}" target="_blank">Open</a>` : "—"}</td>
                <td>
                  <div class="table-actions">
                    <button type="button" class="btn btn-secondary btn-sm" data-action="edit">Edit</button>
                    <button type="button" class="btn btn-secondary btn-sm" data-action="toggle">
                      ${n.published === false ? "Publish" : "Unpublish"}
                    </button>
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
          dateInput.value = row.date || "";
          excerptInput.value = row.excerpt || "";
          contentInput.value = row.content || "";
          urlInput.value = row.url || "";
          imageUrlInput.value = row.imageUrl?.startsWith("data:") ? "" : row.imageUrl || "";
          if (publishedInput) publishedInput.checked = row.published !== false;
          if (previewEl && row.imageUrl) {
            previewEl.src = row.imageUrl;
            previewEl.hidden = false;
          }
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (btn.dataset.action === "toggle" && row) {
          try {
            await window.BSKKMRJ_ADMIN.api(`/api/news/${id}`, {
              method: "PUT",
              body: JSON.stringify({ published: row.published === false }),
            });
            window.BSKKMRJ_ADMIN.showToast("News status updated.", "success");
            await refresh();
          } catch (err) {
            window.BSKKMRJ_ADMIN.showToast(err.message, "error");
          }
        } else if (btn.dataset.action === "delete") {
          if (!window.confirm("Delete this news item?")) return;
          try {
            await window.BSKKMRJ_ADMIN.api(`/api/news/${id}`, { method: "DELETE" });
            window.BSKKMRJ_ADMIN.showToast("News deleted.", "success");
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
    excerptInput.value = "";
    contentInput.value = "";
    urlInput.value = "";
    imageUrlInput.value = "";
    if (publishedInput) publishedInput.checked = true;
    if (imageFileInput) imageFileInput.value = "";
    if (previewEl) {
      previewEl.src = "";
      previewEl.hidden = true;
    }
    msgEl.hidden = true;
  }

  if (resetBtn) resetBtn.addEventListener("click", resetForm);

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (saveBtn) saveBtn.disabled = true;
      const payload = {
        title: titleInput.value.trim(),
        date: dateInput.value.trim(),
        excerpt: excerptInput.value.trim(),
        content: contentInput.value.trim(),
        url: urlInput.value.trim(),
        imageUrl: imageUrlInput.value.trim(),
        published: publishedInput ? Boolean(publishedInput.checked) : true,
      };
      const fileData = await window.BSKKMRJ_ADMIN_UTILS?.readFileAsDataUrl(imageFileInput);
      if (fileData) payload.imageBase64 = fileData;
      const id = idInput.value.trim();
      try {
        if (id) {
          await window.BSKKMRJ_ADMIN.api(`/api/news/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
          });
          window.BSKKMRJ_ADMIN.showToast("News updated.", "success");
        } else {
          await window.BSKKMRJ_ADMIN.api("/api/news", {
            method: "POST",
            body: JSON.stringify(payload),
          });
          window.BSKKMRJ_ADMIN.showToast("News created.", "success");
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
      rows = originalRows.filter((n) => (n.title || "").toLowerCase().includes(value));
      renderTable();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", refresh);
  } else {
    refresh();
  }
})();
