(() => {
  function markActiveNav() {
    const path = String(window.location.pathname || "").replace(/\\/g, "/");
    const file = path.split("/").pop() || "";

    const rules = [
      { key: "home", match: ["index.html", ""] },
      { key: "about", match: ["about.html"] },
      { key: "events", match: ["events.html", "events-details.html"] },
      { key: "gallery", match: ["gallery.html"] },
      { key: "news", match: ["news.html"] },
      { key: "contact", match: ["contact.html"] },
      { key: "join", match: ["join.html", "login.html"] },
      { key: "donate", match: ["donate.html"] },
      { key: "nationalTeam", match: ["national-team.html"] },
      { key: "stateTeam", match: ["state-team.html"] },
    ];

    const activeRule = rules.find((r) => r.match.includes(file));
    if (!activeRule) return;

    document.querySelectorAll(`[data-nav="${activeRule.key}"]`).forEach((el) => {
      el.classList.add("active");
      el.setAttribute("aria-current", "page");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", markActiveNav);
  } else {
    markActiveNav();
  }
})();
