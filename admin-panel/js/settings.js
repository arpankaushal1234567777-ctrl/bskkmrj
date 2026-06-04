(() => {
  if (!window.BSKKMRJ_ADMIN) return;

  const form = document.getElementById("settingsForm");
  const msgEl = document.getElementById("settingsMsg");

  const els = {
    siteTitle: document.getElementById("settingsSiteTitle"),
    seoDescription: document.getElementById("settingsSeoDescription"),
    seoKeywords: document.getElementById("settingsSeoKeywords"),
    phone: document.getElementById("settingsPhone"),
    email: document.getElementById("settingsEmail"),
    address: document.getElementById("settingsAddress"),
    facebook: document.getElementById("settingsFacebook"),
    instagram: document.getElementById("settingsInstagram"),
    twitter: document.getElementById("settingsTwitter"),
    youtube: document.getElementById("settingsYoutube"),
    whatsapp: document.getElementById("settingsWhatsapp"),
    footerText: document.getElementById("settingsFooterText"),
  };

  function setMsg(text, type = "success") {
    if (!msgEl) return;
    msgEl.hidden = false;
    msgEl.textContent = text;
    msgEl.style.color = type === "error" ? "#E13833" : "#2C363C";
  }

  async function load() {
    await window.BSKKMRJ_ADMIN.requireAuthOrRedirect();
    window.BSKKMRJ_ADMIN.wireLogout();
    const data = await window.BSKKMRJ_ADMIN.api("/api/settings");

    if (els.siteTitle) els.siteTitle.value = data.siteTitle || "";
    if (els.seoDescription) els.seoDescription.value = data.seoDescription || "";
    if (els.seoKeywords) els.seoKeywords.value = data.seoKeywords || "";

    if (els.phone) els.phone.value = data.contact?.phone || "";
    if (els.email) els.email.value = data.contact?.email || "";
    if (els.address) els.address.value = data.contact?.address || "";

    if (els.facebook) els.facebook.value = data.socialLinks?.facebook || "";
    if (els.instagram) els.instagram.value = data.socialLinks?.instagram || "";
    if (els.twitter) els.twitter.value = data.socialLinks?.twitter || "";
    if (els.youtube) els.youtube.value = data.socialLinks?.youtube || "";
    if (els.whatsapp) els.whatsapp.value = data.socialLinks?.whatsapp || "";

    if (els.footerText) els.footerText.value = data.footerText || "";
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        await window.BSKKMRJ_ADMIN.api("/api/settings", {
          method: "PUT",
          body: JSON.stringify({
            siteTitle: els.siteTitle?.value?.trim() || "",
            seoDescription: els.seoDescription?.value?.trim() || "",
            seoKeywords: els.seoKeywords?.value?.trim() || "",
            footerText: els.footerText?.value?.trim() || "",
            contact: {
              phone: els.phone?.value?.trim() || "",
              email: els.email?.value?.trim() || "",
              address: els.address?.value?.trim() || "",
            },
            socialLinks: {
              facebook: els.facebook?.value?.trim() || "",
              instagram: els.instagram?.value?.trim() || "",
              twitter: els.twitter?.value?.trim() || "",
              youtube: els.youtube?.value?.trim() || "",
              whatsapp: els.whatsapp?.value?.trim() || "",
            },
          }),
        });
        window.BSKKMRJ_ADMIN.showToast("Settings saved.", "success");
        setMsg("Saved.", "success");
      } catch (err) {
        window.BSKKMRJ_ADMIN.showToast(err.message, "error");
        setMsg(err.message || "Failed to save.", "error");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", load);
  } else {
    load();
  }
})();

