(() => {
  if (!window.BSKKMRJ_ADMIN) return;

  const form = document.getElementById("eventForm");
  const idInput = document.getElementById("eventId");
  const titleInput = document.getElementById("eventTitle");
  const dateInput = document.getElementById("eventDate");
  const locationInput = document.getElementById("eventLocation");
  const descInput = document.getElementById("eventDescription");
  const imageUrlInput = document.getElementById("eventImageUrl");
  const imageFileInput = document.getElementById("eventImage");
  const previewEl = document.getElementById("eventPreview");
  const msgEl = document.getElementById("eventFormMsg");
  const tableHost = document.getElementById("eventTable");
  const resetBtn = document.getElementById("eventResetBtn");
  const saveBtn = document.getElementById("eventSaveBtn");

  let rows = [];
  let originalRows = [];

  if (window.BSKKMRJ_ADMIN_UTILS) {
    window.BSKKMRJ_ADMIN_UTILS.wireImagePreview(imageFileInput, previewEl);
  }

  async function refresh() {
    await window.BSKKMRJ_ADMIN.requireAuthOrRedirect();
    window.BSKKMRJ_ADMIN.wireLogout();
    const data = await window.BSKKMRJ_ADMIN.api("/api/events");
    rows = data.events || [];
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
      tableHost.innerHTML = '<div class="table-empty">No events yet.</div>';
      return;
    }
    tableHost.innerHTML = `
      <table>
        <thead>
          <tr><th>Title</th><th>Date</th><th>Location</th><th></th></tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (e) => `
              <tr data-id="${e._id || ""}">
                <td>${escapeHtml(e.title)}</td>
                <td>${escapeHtml(e.date)}</td>
                <td>${escapeHtml(e.location || "")}</td>
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
          dateInput.value = row.date || "";
          locationInput.value = row.location || "";
          descInput.value = row.description || "";
          imageUrlInput.value = row.imageUrl?.startsWith("data:") ? "" : row.imageUrl || "";
          if (previewEl && row.imageUrl) {
            previewEl.src = row.imageUrl;
            previewEl.hidden = false;
          }
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (btn.dataset.action === "delete") {
          if (!window.confirm("Delete this event?")) return;
          try {
            await window.BSKKMRJ_ADMIN.api(`/api/events/${id}`, { method: "DELETE" });
            window.BSKKMRJ_ADMIN.showToast("Event deleted.", "success");
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
    locationInput.value = "";
    descInput.value = "";
    imageUrlInput.value = "";
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
        location: locationInput.value.trim(),
        description: descInput.value.trim(),
        imageUrl: imageUrlInput.value.trim(),
      };
      const fileData = await window.BSKKMRJ_ADMIN_UTILS?.readFileAsDataUrl(imageFileInput);
      if (fileData) payload.imageBase64 = fileData;
      const id = idInput.value.trim();
      try {
        if (id) {
          await window.BSKKMRJ_ADMIN.api(`/api/events/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
          });
          window.BSKKMRJ_ADMIN.showToast("Event updated.", "success");
        } else {
          await window.BSKKMRJ_ADMIN.api("/api/events", {
            method: "POST",
            body: JSON.stringify(payload),
          });
          window.BSKKMRJ_ADMIN.showToast("Event created.", "success");
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
    searchBox.placeholder = "Search events...";
    searchBox.addEventListener("input", () => {
      const value = searchBox.value.toLowerCase();
      rows = originalRows.filter((e) => (e.title || "").toLowerCase().includes(value));
      renderTable();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", refresh);
  } else {
    refresh();
  }
})();
