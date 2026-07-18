(() => {
  if (!window.BSKKMRJ_ADMIN) return;

  const tbody = document.getElementById("requestsTableBody");
  const selectAllCheckbox = document.getElementById("selectAllCheckbox");
  const bulkDeleteBtn = document.getElementById("bulkDeleteBtn");
  const selectedCount = document.getElementById("selectedCount");

  function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(text || "").replace(/[&<>"']/g, m => map[m]);
  }

  function updateSelectionState() {
    const checkboxes = Array.from(tbody.querySelectorAll(".row-checkbox"));
    const selected = checkboxes.filter(cb => cb.checked);
    if (selectedCount) selectedCount.textContent = selected.length;
    if (bulkDeleteBtn) bulkDeleteBtn.style.display = selected.length > 0 ? "inline-block" : "none";
    if (selectAllCheckbox) selectAllCheckbox.checked = checkboxes.length > 0 && selected.length === checkboxes.length;
  }

  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      tbody.querySelectorAll(".row-checkbox").forEach(cb => cb.checked = isChecked);
      updateSelectionState();
    });
  }

  if (bulkDeleteBtn) {
    bulkDeleteBtn.addEventListener("click", async () => {
      const selected = Array.from(tbody.querySelectorAll(".row-checkbox:checked")).map(cb => cb.dataset.id);
      if (!selected.length) return;
      if (!confirm(`Are you sure you want to delete ${selected.length} request(s)? This action cannot be undone.`)) return;

      try {
        bulkDeleteBtn.disabled = true;
        const result = await window.BSKKMRJ_ADMIN.api("/api/join/bulk-delete", {
          method: "POST",
          body: JSON.stringify({ ids: selected }),
        });
        window.BSKKMRJ_ADMIN.showToast(`Deleted ${result.deletedCount || selected.length} requests successfully.`, "success");
        await refresh();
      } catch (err) {
        window.BSKKMRJ_ADMIN.showToast(err.message, "error");
      } finally {
        bulkDeleteBtn.disabled = false;
        updateSelectionState();
      }
    });
  }

  async function refresh() {
    await window.BSKKMRJ_ADMIN.requireAuthOrRedirect();
    window.BSKKMRJ_ADMIN.wireLogout();
    const data = await window.BSKKMRJ_ADMIN.api("/api/join");
    const requests = data.requests || [];
    if (!requests.length) {
      tbody.innerHTML =
        '<tr><td colspan="11" style="text-align:center;">No join requests found.</td></tr>';
      updateSelectionState();
      return;
    }
    tbody.innerHTML = requests
      .map(
        (r) => `
        <tr data-id="${r._id}">
          <td><input type="checkbox" class="row-checkbox" data-id="${r._id}" /></td>
          <td>${escapeHtml(r.name)}</td>
          <td>${escapeHtml(r.email)}</td>
          <td>${escapeHtml(r.phone)}</td>
          <td>${escapeHtml(r.address || "—")}</td>
          <td>${escapeHtml(r.occupation || "—")}</td>
          <td>${escapeHtml((r.message || "").slice(0, 40))}</td>
          <td>${escapeHtml(r.aadhaar_number || "—")}</td>
          <td><button type="button" class="btn btn-secondary btn-sm" data-action="view-photo" data-id="${r._id}">View Photo</button></td>
          <td><span class="badge">${escapeHtml(r.status)}</span></td>
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

    tbody.querySelectorAll('[data-action="view-photo"]').forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        if (!id) return;
        try {
          btn.disabled = true;
          btn.textContent = "Loading...";
          const res = await window.BSKKMRJ_ADMIN.api(`/api/join/${id}/photo`);
          const photoUrl = res?.aadhaar_photo || "";
          if (!photoUrl) {
            window.BSKKMRJ_ADMIN.showToast("No photo available", "error");
            return;
          }
          const w = window.open("");
          if (w) {
            w.document.write(`<html><body style="margin:0; display:flex; justify-content:center; align-items:center; background:#222; min-height:100vh;"><img src="${photoUrl}" style="max-width:100%; max-height:100vh;" /></body></html>`);
            w.document.close();
          } else {
            window.BSKKMRJ_ADMIN.showToast("Popup blocked. Please allow popups to view the image.", "error");
          }
        } catch (err) {
          window.BSKKMRJ_ADMIN.showToast(err.message, "error");
        } finally {
          btn.disabled = false;
          btn.textContent = "View Photo";
        }
      });
    });

    tbody.querySelectorAll(".row-checkbox").forEach(cb => {
      cb.addEventListener("change", updateSelectionState);
    });
    
    updateSelectionState();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", refresh);
  } else {
    refresh();
  }
})();
