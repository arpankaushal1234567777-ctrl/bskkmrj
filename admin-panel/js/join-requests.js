(() => {
  if (!window.BSKKMRJ_ADMIN) return;

  const tbody = document.getElementById("requestsTableBody");

  async function refresh() {
    await window.BSKKMRJ_ADMIN.requireAuthOrRedirect();
    window.BSKKMRJ_ADMIN.wireLogout();
    const data = await window.BSKKMRJ_ADMIN.api("/api/join");
    const requests = data.requests || [];
    if (!requests.length) {
      tbody.innerHTML =
        '<tr><td colspan="10" style="text-align:center;">No join requests found.</td></tr>';
      return;
    }
    tbody.innerHTML = requests
      .map(
        (r) => `
        <tr data-id="${r._id}">
          <td>${r.name}</td>
          <td>${r.email}</td>
          <td>${r.phone}</td>
          <td>${r.address || "—"}</td>
          <td>${r.occupation || "—"}</td>
          <td>${(r.message || "").slice(0, 40)}</td>
          <td>${r.aadhaar_number || "—"}</td>
          <td>${r.aadhaar_photo ? '<a href="' + r.aadhaar_photo + '" target="_blank">View</a>' : "—"}</td>
          <td><span class="badge">${r.status}</span></td>
          <td>
            <div class="table-actions">
              <button type="button" class="btn btn-secondary btn-sm" data-status="approved">Approve</button>
              <button type="button" class="btn btn-danger btn-sm" data-status="rejected">Reject</button>
            </div>
          </td>
        </tr>`
      )
      .join("");

    tbody.querySelectorAll("[data-status]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const tr = btn.closest("tr");
        const id = tr?.getAttribute("data-id");
        if (!id) return;
        try {
          await window.BSKKMRJ_ADMIN.api(`/api/join/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ status: btn.dataset.status }),
          });
          window.BSKKMRJ_ADMIN.showToast(`Request marked ${btn.dataset.status}.`, "success");
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
