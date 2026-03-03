(() => {
  if (!window.BSKKMRJ_ADMIN) return;

  const form = document.getElementById("teamForm");
  const idInput = document.getElementById("teamId");
  const scopeSelect = document.getElementById("teamScope");
  const nameInput = document.getElementById("teamName");
  const roleInput = document.getElementById("teamRole");
  const msgEl = document.getElementById("teamFormMsg");
  const nationalHost = document.getElementById("nationalTeamTable");
  const stateHost = document.getElementById("stateTeamTable");
  const resetBtn = document.getElementById("teamResetBtn");

  let national = [];
  let state = [];

  async function refresh() {
    await window.BSKKMRJ_ADMIN.requireAuthOrRedirect();
    window.BSKKMRJ_ADMIN.wireLogout();

    const [nat, st] = await Promise.all([
      window.BSKKMRJ_ADMIN.api("/api/team/national"),
      window.BSKKMRJ_ADMIN.api("/api/team/state"),
    ]);
    national = nat.national || [];
    state = st.state || [];
    render();
  }

  function renderTable(host, rows, scope) {
    if (!host) return;
    if (!rows.length) {
      host.innerHTML = `<div class="table-empty">No ${scope} team members yet.</div>`;
      return;
    }
    host.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (m) => `
              <tr data-id="${m._id || ""}" data-scope="${scope}">
                <td>${m.name}</td>
                <td>${m.role}</td>
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
  }

  function render() {
    renderTable(nationalHost, national, "national");
    renderTable(stateHost, state, "state");

    [nationalHost, stateHost].forEach((host) => {
      if (!host) return;
      host.querySelectorAll("[data-action]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const tr = btn.closest("tr");
          const id = tr?.getAttribute("data-id");
          const scope = tr?.getAttribute("data-scope");
          if (!id || !scope) return;

          const rows = scope === "national" ? national : state;
          const row = rows.find((r) => r._id === id);

          if (btn.dataset.action === "edit" && row) {
            idInput.value = row._id || "";
            scopeSelect.value = scope;
            nameInput.value = row.name || "";
            roleInput.value = row.role || "";
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else if (btn.dataset.action === "delete") {
            if (!window.confirm("Delete this member?")) return;
            await window.BSKKMRJ_ADMIN.api(`/api/team/${scope}/${id}`, { method: "DELETE" });
            await refresh();
          }
        });
      });
    });
  }

  function resetForm() {
    idInput.value = "";
    nameInput.value = "";
    roleInput.value = "";
    scopeSelect.value = "national";
    msgEl.hidden = true;
    msgEl.textContent = "";
  }

  if (resetBtn) resetBtn.addEventListener("click", resetForm);

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      msgEl.hidden = true;
      msgEl.textContent = "";

      const scope = scopeSelect.value === "state" ? "state" : "national";
      const payload = {
        name: nameInput.value.trim(),
        role: roleInput.value.trim(),
      };
      const id = idInput.value.trim();

      try {
        if (id) {
          await window.BSKKMRJ_ADMIN.api(`/api/team/${scope}/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
          });
          msgEl.textContent = "Member updated.";
        } else {
          await window.BSKKMRJ_ADMIN.api(`/api/team/${scope}`, {
            method: "POST",
            body: JSON.stringify(payload),
          });
          msgEl.textContent = "Member created.";
        }
        msgEl.hidden = false;
        await refresh();
        resetForm();
      } catch (err) {
        msgEl.textContent = err.message || "Error saving member";
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

