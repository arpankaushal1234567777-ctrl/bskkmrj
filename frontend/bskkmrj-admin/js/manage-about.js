(() => {
  if (!window.BSKKMRJ_ADMIN) return;

  const form = document.getElementById("aboutForm");
  const titleInput = document.getElementById("aboutTitle");
  const missionInput = document.getElementById("aboutMission");
  const visionInput = document.getElementById("aboutVision");
  const descInput = document.getElementById("aboutDescription");
  const historyInput = document.getElementById("aboutHistory");
  const saveBtn = document.getElementById("aboutSaveBtn");

  async function load() {
    await window.BSKKMRJ_ADMIN.requireAuthOrRedirect();
    window.BSKKMRJ_ADMIN.wireLogout();
    const data = await window.BSKKMRJ_ADMIN.api("/api/about");
    titleInput.value = data.title || "";
    missionInput.value = data.mission || "";
    visionInput.value = data.vision || "";
    descInput.value = data.description || data.text || "";
    historyInput.value = data.history || "";
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (saveBtn) saveBtn.disabled = true;
      try {
        await window.BSKKMRJ_ADMIN.api("/api/about", {
          method: "PUT",
          body: JSON.stringify({
            title: titleInput.value.trim(),
            mission: missionInput.value.trim(),
            vision: visionInput.value.trim(),
            description: descInput.value.trim(),
            history: historyInput.value.trim(),
          }),
        });
        window.BSKKMRJ_ADMIN.showToast("About page updated.", "success");
      } catch (err) {
        window.BSKKMRJ_ADMIN.showToast(err.message, "error");
      } finally {
        if (saveBtn) saveBtn.disabled = false;
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", load);
  } else {
    load();
  }
})();
