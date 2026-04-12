(() => {
  const API_BASE = "http://localhost:5001/api";

  function getToken() {
    return window.localStorage.getItem("bskkm_admin_token") || "";
  }

  function setToken(token) {
    if (token) {
      window.localStorage.setItem("bskkm_admin_token", token);
    } else {
      window.localStorage.removeItem("bskkm_admin_token");
    }
  }

  function buildUrl(path) {
    const raw = String(path || "");
    if (raw.startsWith("http")) return raw;
    const trimmed = raw.startsWith("/api") ? raw.slice(4) : raw;
    return `${API_BASE}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
  }

  async function api(path, options = {}) {
    const url = buildUrl(path);
    const token = getToken();
    const headers = Object.assign(
      { "Content-Type": "application/json" },
      options.headers || {},
      token ? { Authorization: `Bearer ${token}` } : {}
    );

    const res = await fetch(url, { ...options, headers });
    const isJson = res.headers.get("content-type")?.includes("application/json");
    const body = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      const message = body && body.error ? body.error : `Request failed: ${res.status}`;
      throw new Error(message);
    }
    return body;
  }

 /* async function requireAuthOrRedirect() {
    const token = getToken();
    if (!token) {
      window.location.href = "./index.html";
      return;
    }
    try {
      await api("/api/health");
    } catch (_e) {
      setToken("");
      window.location.href = "./index.html";
    }
  } */

    async function requireAuthOrRedirect() {

  const token = getToken();

  if (!token) {
    window.location.href = "./index.html";
    return;
  }

}

  function logout() {
    setToken("");
    window.location.href = "./index.html";
  }

  function wireLogout(btnId = "logoutBtn") {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener("click", logout);
  }

  window.BSKKMRJ_ADMIN = {
    api,
    getToken,
    setToken,
    requireAuthOrRedirect,
    logout,
    wireLogout,
  };
})();
