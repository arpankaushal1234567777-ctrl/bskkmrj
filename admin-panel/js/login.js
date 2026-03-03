(() => {
  const form = document.getElementById("loginForm");
  const errorEl = document.getElementById("loginError");

  if (!form || !window.BSKKMRJ_ADMIN) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.hidden = true;
    errorEl.textContent = "";

    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();
    if (!email || !password) return;

    try {
      const res = await window.BSKKMRJ_ADMIN.api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (res && res.token) {
        window.BSKKMRJ_ADMIN.setToken(res.token);
        window.location.href = "./dashboard.html";
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (err) {
      errorEl.hidden = false;
      errorEl.textContent = err.message || "Login failed";
    }
  });
})();

