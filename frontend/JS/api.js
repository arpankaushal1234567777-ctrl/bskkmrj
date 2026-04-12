(() => {
  const API_BASE = "http://localhost:5001/api";

  function buildUrl(path) {
    const raw = String(path || "");
    if (raw.startsWith("http")) return raw;
    const trimmed = raw.startsWith("/api") ? raw.slice(4) : raw;
    return `${API_BASE}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
  }

  async function apiGetJson(path) {
    const url = buildUrl(path);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
  }

  window.BSKKMRJ_API = { apiGetJson };
})();
