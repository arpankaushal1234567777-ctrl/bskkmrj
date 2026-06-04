(() => {
  const API_BASE = "https://bskkmrj-api.onrender.com/api";

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

  function decodeJwtPayload(token) {
    try {
      const parts = String(token || "").split(".");
      if (parts.length < 2) return null;
      const json = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
      return JSON.parse(json);
    } catch (_e) {
      return null;
    }
  }

  function isTokenExpired(token) {
    const payload = decodeJwtPayload(token);
    const exp = payload?.exp ? Number(payload.exp) : 0;
    if (!exp) return false;
    return Date.now() >= exp * 1000;
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

  async function requireAuthOrRedirect() {
    const token = getToken();
    if (!token || isTokenExpired(token)) {
      setToken("");
      window.location.href = "./index.html";
      return;
    }
    try {
      await api("/auth/me");
    } catch (_e) {
      setToken("");
      window.location.href = "./index.html";
    }
  }

  async function logout() {
    try {
      await api("/auth/logout", { method: "POST" });
    } catch (_e) {
      // ignore
    }
    setToken("");
    window.location.href = "./index.html";
  }

  function wireLogout(btnId = "logoutBtn") {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener("click", () => logout());
  }

  function showToast(message, type = "success") {
    let host = document.getElementById("adminToast");
    if (!host) {
      host = document.createElement("div");
      host.id = "adminToast";
      host.className = "admin-toast";
      document.body.appendChild(host);
    }
    host.className = `admin-toast admin-toast--${type}`;
    host.textContent = message;
    host.hidden = false;
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      host.hidden = true;
    }, 3500);
  }

  window.BSKKMRJ_ADMIN = {
    api,
    getToken,
    setToken,
    requireAuthOrRedirect,
    logout,
    wireLogout,
    showToast,
  };
})();
