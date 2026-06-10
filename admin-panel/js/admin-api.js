(() => {
  const PROD_API_BASE = "https://bskkmrj-api.onrender.com/api";

  function detectApiBase() {
    const configured =
      window.BSKKMRJ_API_BASE ||
      window.localStorage.getItem("bskkm_api_base") ||
      document.querySelector('meta[name="bskkmrj-api-base"]')?.content;

    if (configured) return configured.replace(/\/+$/, "");

    const host = window.location.hostname;
    const isLocalHost =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "::1" ||
      host.endsWith(".local");

    if (isLocalHost) {
      return `${window.location.origin}/api`;
    }

    return PROD_API_BASE;
  }

  const API_BASE =
    detectApiBase();

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
      {},
      options.headers || {},
      token ? { Authorization: `Bearer ${token}` } : {}
    );
    const requestBody = options.body;

    if (!(requestBody instanceof FormData) && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(url, { ...options, headers });
    if (res.status === 204) return null;

    const isJson = res.headers.get("content-type")?.includes("application/json");
    const responseBody = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      const message =
        responseBody && responseBody.error ? responseBody.error : `Request failed: ${res.status}`;
      console.error("Admin API request failed", {
        url,
        method: options.method || "GET",
        status: res.status,
        response: responseBody,
      });
      throw new Error(message);
    }

    return responseBody;
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

  if (!window.__BSKKMRJ_ADMIN_ERROR_HANDLERS__) {
    window.__BSKKMRJ_ADMIN_ERROR_HANDLERS__ = true;

    window.addEventListener("unhandledrejection", (event) => {
      const reason = event.reason;
      const message = reason && reason.message ? reason.message : "Unexpected error";
      console.error("Unhandled admin promise rejection", reason);
      showToast(message, "error");
    });

    window.addEventListener("error", (event) => {
      const error = event.error || event.message;
      console.error("Unhandled admin error", error);
    });
  }

  window.BSKKMRJ_ADMIN = {
    api,
    buildUrl,
    getToken,
    setToken,
    requireAuthOrRedirect,
    logout,
    wireLogout,
    showToast,
  };
})();
