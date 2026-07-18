(() => {
  if (!window.BSKKMRJ_ADMIN) return;

  const form = document.getElementById("teamForm");
  const idInput = document.getElementById("teamId");
  const scopeSelect = document.getElementById("teamScope");
  const nameInput = document.getElementById("teamName");
  const roleInput = document.getElementById("teamRole");
  const phoneInput = document.getElementById("teamPhone");
  const photoUrlInput = document.getElementById("teamPhotoUrl");
  const photoFileInput = document.getElementById("teamPhoto");
  const previewEl = document.getElementById("teamPreview");
  const msgEl = document.getElementById("teamFormMsg");
  const nationalHost = document.getElementById("nationalTeamTable");
  const stateHost = document.getElementById("stateTeamTable");
  const resetBtn = document.getElementById("teamResetBtn");
  const saveBtn = document.getElementById("teamSaveBtn");

  let national = [];
  let state = [];
  let nationalOriginal = [];
  let stateOriginal = [];

  if (window.BSKKMRJ_ADMIN_UTILS) {
    window.BSKKMRJ_ADMIN_UTILS.wireImagePreview(photoFileInput, previewEl);
  }

  async function refresh() {
    await window.BSKKMRJ_ADMIN.requireAuthOrRedirect();
    window.BSKKMRJ_ADMIN.wireLogout();
    const [nat, st] = await Promise.all([
      window.BSKKMRJ_ADMIN.api("/api/team/national"),
      window.BSKKMRJ_ADMIN.api("/api/team/state"),
    ]);
    national = nat.national || [];
    state = st.state || [];
    nationalOriginal = [...national];
    stateOriginal = [...state];
    render();
  }

  function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(text || "").replace(/[&<>"']/g, m => map[m]);
  }

  function renderTable(host, rows, scope, original) {
    if (!host) return;
    if (!rows.length) {
      host.innerHTML = `<div class="table-empty">No ${scope} team members yet.</div>`;
      return;
    }
    host.innerHTML = `
      <table>
        <thead><tr><th>Name</th><th>Position</th><th>Phone</th><th></th></tr></thead>
        <tbody>
          ${rows
            .map(
              (m) => `
              <tr data-id="${m._id || ""}" data-scope="${scope}">
                <td>${escapeHtml(m.name)}</td>
                <td>${escapeHtml(m.role)}</td>
                <td>${escapeHtml(m.phone || "")}</td>
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

    host.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const tr = btn.closest("tr");
        const id = tr?.getAttribute("data-id");
        const rowScope = tr?.getAttribute("data-scope");
        if (!id || !rowScope) return;
        const list = rowScope === "national" ? original : stateOriginal;
        const row = list.find((r) => r._id === id);
        if (btn.dataset.action === "edit" && row) {
          idInput.value = row._id || "";
          scopeSelect.value = rowScope;
          nameInput.value = row.name || "";
          roleInput.value = row.role || "";
          phoneInput.value = row.phone || "";
          photoUrlInput.value = row.photo?.startsWith("data:") ? "" : row.photo || "";
          if (previewEl && row.photo) {
            previewEl.src = row.photo;
            previewEl.hidden = false;
          }
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (btn.dataset.action === "delete") {
          if (!window.confirm("Delete this member?")) return;
          try {
            await window.BSKKMRJ_ADMIN.api(`/api/team/${rowScope}/${id}`, { method: "DELETE" });
            window.BSKKMRJ_ADMIN.showToast("Member deleted.", "success");
            await refresh();
          } catch (err) {
            window.BSKKMRJ_ADMIN.showToast(err.message, "error");
          }
        }
      });
    });
  }

  function render() {
    renderTable(nationalHost, national, "national", nationalOriginal);
    renderTable(stateHost, state, "state", stateOriginal);
  }

  function resetForm() {
    idInput.value = "";
    nameInput.value = "";
    roleInput.value = "";
    phoneInput.value = "";
    photoUrlInput.value = "";
    scopeSelect.value = "national";
    if (photoFileInput) photoFileInput.value = "";
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
      const scope = scopeSelect.value === "state" ? "state" : "national";
      const payload = {
        name: nameInput.value.trim(),
        role: roleInput.value.trim(),
        position: roleInput.value.trim(),
        phone: phoneInput.value.trim(),
        photo: photoUrlInput.value.trim(),
      };
      const fileData = await window.BSKKMRJ_ADMIN_UTILS?.readFileAsDataUrl(photoFileInput);
      if (fileData) payload.imageBase64 = fileData;
      const id = idInput.value.trim();
      try {
        if (id) {
          await window.BSKKMRJ_ADMIN.api(`/api/team/${scope}/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
          });
          window.BSKKMRJ_ADMIN.showToast("Member updated.", "success");
        } else {
          await window.BSKKMRJ_ADMIN.api(`/api/team/${scope}`, {
            method: "POST",
            body: JSON.stringify(payload),
          });
          window.BSKKMRJ_ADMIN.showToast("Member created.", "success");
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

  const nationalSearch = document.getElementById("searchNational");
  if (nationalSearch) {
    nationalSearch.addEventListener("input", () => {
      const value = nationalSearch.value.toLowerCase();
      national = nationalOriginal.filter((m) => (m.name || "").toLowerCase().includes(value));
      renderTable(nationalHost, national, "national", nationalOriginal);
    });
  }

  const stateSearch = document.getElementById("searchState");
  if (stateSearch) {
    stateSearch.addEventListener("input", () => {
      const value = stateSearch.value.toLowerCase();
      state = stateOriginal.filter((m) => (m.name || "").toLowerCase().includes(value));
      renderTable(stateHost, state, "state", stateOriginal);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", refresh);
  } else {
    refresh();
  }
})();
