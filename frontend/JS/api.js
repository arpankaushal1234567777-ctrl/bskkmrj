(() => {
  const API_BASE = "https://bskkmrj-api.onrender.com/api";

  function buildUrl(path) {
    const raw = String(path || "");
    if (raw.startsWith("http")) return raw;
    const trimmed = raw.startsWith("/api") ? raw.slice(4) : raw;
    return `${API_BASE}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
  }

  async function parseResponse(res) {
    const isJson = res.headers.get("content-type")?.includes("application/json");
    const body = isJson ? await res.json() : await res.text();
    if (!res.ok) {
      const message = body && body.error ? body.error : `Request failed: ${res.status}`;
      throw new Error(message);
    }
    return body;
  }

  async function apiGetJson(path) {
    const res = await fetch(buildUrl(path));
    return parseResponse(res);
  }

  async function apiPostJson(path, payload) {
    const res = await fetch(buildUrl(path), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return parseResponse(res);
  }

  window.BSKKMRJ_API = { apiGetJson, apiPostJson, buildUrl };
})();
