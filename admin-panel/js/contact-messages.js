(() => {
  if (!window.BSKKMRJ_ADMIN) return;

  const tbody = document.getElementById("messagesTableBody");

  async function refresh() {
    await window.BSKKMRJ_ADMIN.requireAuthOrRedirect();
    window.BSKKMRJ_ADMIN.wireLogout();
    const data = await window.BSKKMRJ_ADMIN.api("/api/contact");
    const messages = data.messages || [];
    if (!messages.length) {
      tbody.innerHTML =
        '<tr><td colspan="8" style="text-align:center;">No messages yet.</td></tr>';
      return;
    }
    tbody.innerHTML = messages
      .map(
        (m) => `
        <tr data-id="${m._id}" class="${m.read ? "" : "row-unread"}">
          <td>${m.name}</td>
          <td>${m.email}</td>
          <td>${m.phone || "—"}</td>
          <td>${m.subject || "—"}</td>
          <td>${(m.message || "").slice(0, 50)}</td>
          <td>${m.read ? "Read" : "Unread"}</td>
          <td>${new Date(m.createdAt).toLocaleString()}</td>
          <td>
            <div class="table-actions">
              ${m.read ? "" : '<button type="button" class="btn btn-secondary btn-sm" data-action="read">Mark read</button>'}
              <button type="button" class="btn btn-danger btn-sm" data-action="delete">Delete</button>
            </div>
          </td>
        </tr>`
      )
      .join("");

    tbody.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const tr = btn.closest("tr");
        const id = tr?.getAttribute("data-id");
        if (!id) return;
        try {
          if (btn.dataset.action === "read") {
            await window.BSKKMRJ_ADMIN.api(`/api/contact/${id}/read`, { method: "PATCH" });
            window.BSKKMRJ_ADMIN.showToast("Marked as read.", "success");
          } else {
            if (!window.confirm("Delete this message?")) return;
            await window.BSKKMRJ_ADMIN.api(`/api/contact/${id}`, { method: "DELETE" });
            window.BSKKMRJ_ADMIN.showToast("Message deleted.", "success");
          }
          await refresh();
        } catch (err) {
          window.BSKKMRJ_ADMIN.showToast(err.message, "error");
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", refresh);
  } else {
    refresh();
  }
})();
