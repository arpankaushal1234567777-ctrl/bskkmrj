(() => {
  const form = document.getElementById("loginForm");
  const errorEl = document.getElementById("loginError");
  const credentialsFields = document.getElementById("credentialsFields");
  const otpFields = document.getElementById("otpFields");
  const otpCodeInput = document.getElementById("otpCode");
  const otpVerifyBtn = document.getElementById("otpVerifyBtn");

  if (!form || !window.BSKKMRJ_ADMIN) return;

  let currentTempToken = "";
  let currentRememberMe = false;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (errorEl) {
      errorEl.hidden = true;
      errorEl.textContent = "";
    }

    const formData = new FormData(form);
    const identifier = String(formData.get("identifier") || "").trim();
    const password = String(formData.get("password") || "").trim();
    const rememberMe = Boolean(formData.get("rememberMe"));
    if (!identifier || !password) {
      if (errorEl) {
        errorEl.hidden = false;
        errorEl.textContent = "Username/email and password are required";
      }
      return;
    }

    try {
      const res = await window.BSKKMRJ_ADMIN.api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: identifier, username: identifier, password, rememberMe }),
      });
      
      if (res && res.status === "otp_sent") {
        currentTempToken = res.tempToken;
        currentRememberMe = res.rememberMe;
        
        // Hide credentials input and show OTP input
        if (credentialsFields) credentialsFields.hidden = true;
        if (otpFields) otpFields.hidden = false;
        
        // Remove HTML5 validations from hidden credentials
        const credInputs = credentialsFields.querySelectorAll("input");
        credInputs.forEach(input => input.removeAttribute("required"));
        
        if (otpCodeInput) {
          otpCodeInput.setAttribute("required", "true");
          otpCodeInput.focus();
        }
      } else if (res && res.token) {
        // Fallback for direct logins
        window.BSKKMRJ_ADMIN.setToken(res.token);
        window.location.href = "./dashboard.html";
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (err) {
      if (errorEl) {
        errorEl.hidden = false;
        errorEl.textContent = err.message || "Login failed";
      }
    }
  });

  if (otpVerifyBtn) {
    otpVerifyBtn.addEventListener("click", async () => {
      if (errorEl) {
        errorEl.hidden = true;
        errorEl.textContent = "";
      }
      
      const otpCode = String(otpCodeInput?.value || "").trim();
      if (!otpCode || otpCode.length !== 6 || !/^\d+$/.test(otpCode)) {
        if (errorEl) {
          errorEl.hidden = false;
          errorEl.textContent = "Please enter a valid 6-digit OTP code";
        }
        return;
      }

      try {
        otpVerifyBtn.disabled = true;
        otpVerifyBtn.textContent = "Verifying...";
        
        const res = await window.BSKKMRJ_ADMIN.api("/auth/verify-otp", {
          method: "POST",
          body: JSON.stringify({
            tempToken: currentTempToken,
            code: otpCode,
            rememberMe: currentRememberMe
          }),
        });

        if (res && res.token) {
          window.BSKKMRJ_ADMIN.setToken(res.token);
          window.location.href = "./dashboard.html";
        } else {
          throw new Error("Unexpected verification response.");
        }
      } catch (err) {
        if (errorEl) {
          errorEl.hidden = false;
          errorEl.textContent = err.message || "OTP verification failed";
        }
      } finally {
        if (otpVerifyBtn) {
          otpVerifyBtn.disabled = false;
          otpVerifyBtn.textContent = "Confirm Code";
        }
      }
    });
  }
})();
