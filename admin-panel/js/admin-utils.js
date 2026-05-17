(() => {
  function readFileAsDataUrl(fileInput) {
    const file = fileInput?.files?.[0];
    if (!file) return Promise.resolve("");
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function wireImagePreview(fileInput, previewEl) {
    if (!fileInput || !previewEl) return;
    fileInput.addEventListener("change", async () => {
      const dataUrl = await readFileAsDataUrl(fileInput);
      previewEl.src = dataUrl || "";
      previewEl.hidden = !dataUrl;
    });
  }

  window.BSKKMRJ_ADMIN_UTILS = {
    readFileAsDataUrl,
    wireImagePreview,
  };
})();
