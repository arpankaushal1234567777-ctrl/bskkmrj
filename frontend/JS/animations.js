(() => {
  function revealOnScroll() {
    const items = document.querySelectorAll(".card, .section-title, .hero-content");
    if (!("IntersectionObserver" in window) || items.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    items.forEach((el) => io.observe(el));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", revealOnScroll);
  } else {
    revealOnScroll();
  }
})();
