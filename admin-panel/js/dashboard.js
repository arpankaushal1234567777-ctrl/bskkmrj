(() => {
  if (!window.BSKKMRJ_ADMIN) return;

  async function loadDashboard() {
    await window.BSKKMRJ_ADMIN.requireAuthOrRedirect();
    window.BSKKMRJ_ADMIN.wireLogout();

    const [news, events, gallery, national, state] = await Promise.all([
      window.BSKKMRJ_ADMIN.api("/api/news"),
      window.BSKKMRJ_ADMIN.api("/api/events"),
      window.BSKKMRJ_ADMIN.api("/api/gallery"),
      window.BSKKMRJ_ADMIN.api("/api/team/national"),
      window.BSKKMRJ_ADMIN.api("/api/team/state"),
    ]);

    document.getElementById("statNews").textContent = (news.news || []).length;
    document.getElementById("statEvents").textContent = (events.events || []).length;
    document.getElementById("statGallery").textContent = (gallery.items || []).length;
    document.getElementById("statTeam").textContent =
      (national.national || []).length + (state.state || []).length;

    const recentHost = document.getElementById("recentNews");
    if (recentHost) {
      const rows = (news.news || []).slice(0, 5);
      if (!rows.length) {
        recentHost.innerHTML = "<div class=\"table-empty\">No news yet.</div>";
      } else {
        recentHost.innerHTML = `
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
            ${rows
              .map(
                (n) => `
                <tr>
                  <td>${n.title}</td>
                  <td>${n.url ? `<a href="${n.url}" target="_blank">Open</a>` : ""}</td>
                </tr>
              `
              )
              .join("")}
            </tbody>
          </table>
        `;
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadDashboard);
  } else {
    loadDashboard();
  }
})();

