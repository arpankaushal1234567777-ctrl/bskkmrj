(() => {
  function ensureLangScript() {
    if (window.BSK_LANG) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `${getRootPrefix()}JS/lang.js`;
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function ensureLangToggle() {
    if (document.getElementById("langToggle")) return;
    const btn = document.createElement("button");
    btn.id = "langToggle";
    btn.type = "button";
    btn.className = "lang-toggle";
    btn.textContent = "English";
    btn.setAttribute("aria-label", "Switch language");
    document.body.appendChild(btn);
    if (window.BSK_LANG?.applyCurrent) {
      window.BSK_LANG.applyCurrent();
    }
  }

  const NAVBAR_FALLBACK_HTML = `
    <header class="navbar">
      <div class="container nav-container">
        <a class="logo" data-nav="home" href="#">
          <img src="../assets/images/LOGO.jpeg" alt="BSKKMRJ Logo">
          <div class="logo-text">
            <span class="logo-mark">BSKKMRJ</span>
            <span class="logo-sub">भारतीय श्रमिक कामगार कर्मचारी महासंघ राजस्थान</span>
          </div>
        </a>
        <button class="menu-toggle" id="menuToggle" type="button" aria-label="Toggle menu" aria-expanded="false">☰</button>
        <nav class="nav" aria-label="Primary">
          <ul class="nav-links" id="navLinks">
            <li><a data-nav="home" href="#" data-i18n="navHome">Home</a></li>
            <li><a data-nav="about" href="#" data-i18n="navAbout">About Us</a></li>
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" aria-haspopup="true" aria-expanded="false" data-i18n="navMedia">Media Resources</a>
              <ul class="dropdown-menu">
                <li><a data-nav="gallery" href="#" data-i18n="navGallery">Photo Gallery</a></li>
                <li><a data-nav="events" href="#" data-i18n="navEvents">Event</a></li>
              </ul>
            </li>
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" aria-haspopup="true" aria-expanded="false" data-i18n="navTeam">Our Team Member</a>
              <ul class="dropdown-menu">
                <li><a data-nav="stateTeam" href="#" data-i18n="navStateTeam">State Team</a></li>
                <li><a data-nav="nationalTeam" href="#" data-i18n="navNationalTeam">National Team</a></li>
              </ul>
            </li>
            <li><a data-nav="news" href="#" data-i18n="navNews">News</a></li>
            <li><a data-nav="join" href="#" data-i18n="navJoin">Join Us</a></li>
            <li><a data-nav="contact" href="#" data-i18n="navContact">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  `;

  const FOOTER_FALLBACK_HTML = `
    <footer class="footer">
      <div class="footer-top">
        <div class="container">
          <p class="quote">"भारतीय श्रमिक संघ: विकास की गाड़ी की एक महत्वपूर्ण धारा!"</p>
        </div>
      </div>
      <div class="container footer-grid">
        <div>
          <h3 data-i18n="footerJoin">Join the Bskkmrj</h3>
          <p class="muted" data-i18n="footerBlurb">Together we the people achieve more than any single person could ever do alone.</p>
          <div class="footer-contact">
            <div><strong data-i18n="footerPhoneLabel">Phone:</strong> 01147095426</div>
            <div><strong data-i18n="footerAddressLabel">Address:</strong> <a class="link" href="https://maps.app.goo.gl/yRtRmDRg8NuPodGg7">84, North Ave, North Avenue Road Area, Raisina Hills, New Delhi, Delhi 110001</a></div>
          </div>
        </div>
        <div>
          <h4 data-i18n="footerLinks">Links</h4>
          <ul class="footer-links">
            <li><a data-nav="about" href="#" data-i18n="navAbout">About Us</a></li>
            <li><a data-nav="join" href="#" data-i18n="navJoin">Join BSKKMRJ</a></li>
            <li><a data-nav="gallery" href="#" data-i18n="navGallery">Gallery</a></li>
          </ul>
        </div>
        <div>
          <h4 data-i18n="footerHeadlines">Headlines</h4>
          <ul class="footer-links">
            <li><span data-i18n="footerHeadline1">यूपी के लोहिया हॉस्पिटल में खाली पड़े है बेड, जानें</span></li>
            <li><span data-i18n="footerHeadline2">देश के किसी भी श्रमिक के साथ नही होगा शोषणः</span></li>
            <li><span data-i18n="footerHeadline3">सभी मजदूरों का होगा पंजीकरण: सर्वेश पाठक</span></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container footer-bottom-inner">
          <p class="muted" data-i18n="footerTagline">भारतीय श्रमिक कामगार कर्मचारी महासंघ राजस्थान</p>
          <p><a class="link" data-nav="contact" href="#" data-i18n="footerContactLink">Get in touch</a></p>
        </div>
      </div>
    </footer>
  `;

  function normalizePathname(pathname) {
    return String(pathname || "").replace(/\\/g, "/");
  }

  function isInPages() {
    const pathname = normalizePathname(window.location.pathname);
    return pathname.includes("/pages/");
  }

  /** Relative prefix from current page to frontend root (./ or ../). */
  function getRootPrefix() {
    return isInPages() ? "../" : "./";
  }

  function getLinkMap() {
    if (isInPages()) {
      return {
        home: "../index.html",
        about: "./about.html",
        events: "./events.html",
        gallery: "./gallery.html",
        news: "./news.html",
        contact: "./contact.html",
        join: "./join.html",
        nationalTeam: "./national-team.html",
        stateTeam: "./state-team.html",
      };
    }

    return {
      home: "./index.html",
      about: "./pages/about.html",
      events: "./pages/events.html",
      gallery: "./pages/gallery.html",
      news: "./pages/news.html",
      contact: "./pages/contact.html",
      join: "./pages/join.html",
      nationalTeam: "./pages/national-team.html",
      stateTeam: "./pages/state-team.html",
    };
  }

  async function injectHtml(selector, url, fallbackHtml = "") {
    const host = document.querySelector(selector);
    if (!host) return;

    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
      host.innerHTML = await res.text();
    } catch (e) {
      host.innerHTML = fallbackHtml;
      console.warn(e);
    }

    if (window.BSK_LANG?.applyCurrent) {
      window.BSK_LANG.applyCurrent();
    }
  }

  /** Navbar/footer fragments use ../assets; fix after inject when served from site root. */
  function fixComponentAssetPaths(root) {
    if (!root) return;
    const assetPrefix = `${getRootPrefix()}assets/`;
    root.querySelectorAll("[src]").forEach((el) => {
      const src = el.getAttribute("src");
      if (src && (src.startsWith("../assets/") || src.startsWith("./assets/"))) {
        const path = src.replace(/^(\.\.\/|\.\/)?assets\//, "");
        el.setAttribute("src", assetPrefix + path);
      }
    });
  }

  function wireNavLinks(root = document) {
    const map = getLinkMap();
    root.querySelectorAll("[data-nav]").forEach((a) => {
      const key = a.getAttribute("data-nav");
      if (key && map[key]) a.setAttribute("href", map[key]);
    });
  }

  function wireNavbarInteractions() {
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {
      // Create a real overlay div instead of body::before pseudo-element.
      // The pseudo-element approach causes z-index stacking issues on mobile
      // browsers where it paints over the drawer and eats all touch events.
      let overlay = document.getElementById("menuOverlay");
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "menuOverlay";
        overlay.style.cssText = [
          "display:none",
          "position:fixed",
          "inset:0",
          "background:rgba(0,0,0,0.5)",
          "z-index:199",   // below drawer (200) but above page content
          "transition:opacity 0.3s",
          "opacity:0",
        ].join(";");
        document.body.appendChild(overlay);
      }

      const openMenu = () => {
        navLinks.classList.add("open");
        menuToggle.setAttribute("aria-expanded", "true");
        document.body.classList.add("menu-open");
        overlay.style.display = "block";
        // Trigger transition on next frame
        requestAnimationFrame(() => { overlay.style.opacity = "1"; });
      };

      const closeMenu = () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
        overlay.style.opacity = "0";
        setTimeout(() => { overlay.style.display = "none"; }, 300);
      };

      menuToggle.addEventListener("click", () => {
        if (navLinks.classList.contains("open")) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      // Tap the overlay to close
      overlay.addEventListener("click", closeMenu);

      // Close on any nav link tap (navigates away or same-page)
      navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          // For dropdown toggles, don't close — let dropdown logic handle it
          if (!link.classList.contains("dropdown-toggle")) {
            closeMenu();
          }
        });
      });
    }

    document.querySelectorAll(".dropdown-toggle").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const li = btn.closest(".dropdown");
        if (!li) return;

        // Close other dropdowns
        document.querySelectorAll(".dropdown").forEach((otherLi) => {
          if (otherLi !== li) {
            otherLi.classList.remove("open");
            const otherBtn = otherLi.querySelector(".dropdown-toggle");
            if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
          }
        });

        li.classList.toggle("open");
        btn.setAttribute("aria-expanded", li.classList.contains("open") ? "true" : "false");
      });
    });
  }

  async function init() {
    await ensureLangScript();
    const componentPrefix = `${getRootPrefix()}component/`;
    const navbarUrl = `${componentPrefix}navbar.html`;
    const footerUrl = `${componentPrefix}footer.html`;

    await Promise.all([
      injectHtml("#navbar-root", navbarUrl, NAVBAR_FALLBACK_HTML),
      injectHtml("#footer-root", footerUrl, FOOTER_FALLBACK_HTML),
    ]);

    fixComponentAssetPaths(document.getElementById("navbar-root"));
    fixComponentAssetPaths(document.getElementById("footer-root"));
    wireNavLinks(document);
    wireNavbarInteractions();
    ensureLangToggle();
    if (window.BSK_LANG?.applyCurrent) {
      window.BSK_LANG.applyCurrent();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();