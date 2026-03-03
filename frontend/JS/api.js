(() => {
  async function apiGetJson(path) {
    const base = "http://localhost:5000";
    const url = String(path || "").startsWith("http") ? path : `${base}${path}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
  }

  window.BSKKMRJ_API = { apiGetJson };
})();
