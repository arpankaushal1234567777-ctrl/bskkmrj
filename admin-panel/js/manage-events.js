(() => {
  if (!window.BSKKMRJ_ADMIN) return;

  const form = document.getElementById("eventForm");
  const idInput = document.getElementById("eventId");
  const titleInput = document.getElementById("eventTitle");
  const dateInput = document.getElementById("eventDate");
  const locationInput = document.getElementById("eventLocation");
  const msgEl = document.getElementById("eventFormMsg");
  const tableHost = document.getElementById("eventTable");
  const resetBtn = document.getElementById("eventResetBtn");

  let rows = [];

  async function refresh() {
    await window.BSKKMRJ_ADMIN.requireAuthOrRedirect();
    window.BSKKMRJ_ADMIN.wireLogout();
    const data = await window.BSKKMRJ_ADMIN.api("/api/events");
    rows = data.events || [];
    renderTable();
  }

  function renderTable() {
    if (!tableHost) return;
    if (!rows.length) {
      tableHost.innerHTML = "<div class=\"table-empty\">No events yet.</div>";
      return;
    }
    tableHost.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Location</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (e) => `
              <tr data-id="${e._id || ""}">
                <td>${e.title}</td>
                <td>${e.date}</td>
                <td>${e.location || ""}</td>
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
          locationInput.value = row.location || "";
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (btn.dataset.action === "delete") {
          if (!window.confirm("Delete this event?")) return;
          await window.BSKKMRJ_ADMIN.api(`/api/events/${id}`, { method: "DELETE" });
          await refresh();
        }
      });
    });
  }

  function resetForm() {
    idInput.value = "";
    titleInput.value = "";
    dateInput.value = "";
    locationInput.value = "";
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
        location: locationInput.value.trim(),
      };
      const id = idInput.value.trim();

      try {
        if (id) {
          await window.BSKKMRJ_ADMIN.api(`/api/events/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
          });
          msgEl.textContent = "Event updated.";
        } else {
          await window.BSKKMRJ_ADMIN.api("/api/events", {
            method: "POST",
            body: JSON.stringify(payload),
          });
          msgEl.textContent = "Event created.";
        }
        msgEl.hidden = false;
        await refresh();
        resetForm();
      } catch (err) {
        msgEl.textContent = err.message || "Error saving event";
        msgEl.hidden = false;
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", refresh);
  } else {
    refresh();
  }

  // EVENTS SEARCH
const searchBox = document.getElementById("searchBox");

if(searchBox){

searchBox.addEventListener("input", function(){

const value = this.value.toLowerCase();

const filtered = rows.filter(e =>
(e.title || "").toLowerCase().includes(value)
);

rows = filtered;

renderTable();

});

}
})();

