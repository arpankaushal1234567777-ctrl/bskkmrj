/* (() => {
  const form = document.getElementById("loginForm");
  const errorEl = document.getElementById("loginError");

  if (!form || !window.BSKKMRJ_ADMIN) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.hidden = true;
    errorEl.textContent = "";

    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();
    if (!email || !password) return;

    try {
      const res = await window.BSKKMRJ_ADMIN.api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (res && res.token) {
        window.BSKKMRJ_ADMIN.setToken(res.token);
        window.location.href = "./dashboard.html";
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (err) {
      errorEl.hidden = false;
      errorEl.textContent = err.message || "Login failed";
    }
  });
})(); */






/* (() => {
const form = document.getElementById("loginForm");
const errorEl = document.getElementById("loginError");

if (!form) return;

form.addEventListener("submit", async (e) => {
e.preventDefault();
errorEl.hidden = true;
errorEl.textContent = "";

const formData = new FormData(form);  
const email = String(formData.get("email") || "").trim();  
const password = String(formData.get("password") || "").trim();  

if (!email || !password) return;

try {  
  if (email === "admin@gmail.com" && password === "admin123") {  
    window.location.href = "./dashboard.html";  
  } else {  
    throw new Error("Invalid email or password");  
  }  
} catch (err) {  
  errorEl.hidden = false;  
  errorEl.textContent = err.message;  
}

});
})(); */






/* document.addEventListener("DOMContentLoaded", function () {

const form = document.getElementById("loginForm");
const errorEl = document.getElementById("loginError");

form.addEventListener("submit", function(e){

e.preventDefault();

const email = document.querySelector("input[name='email']").value;
const password = document.querySelector("input[name='password']").value; */

/* if(email === "admin@gmail.com" && password === "admin123"){
    alert("Login successful");
    window.location.href = "dashboard.html";
}else{
    errorEl.hidden = false;
    errorEl.textContent = "Invalid email or password";
} */

   /* if(email === "admin@gmail.com" && password === "admin123"){

    localStorage.setItem("adminLoggedIn", "true");

    window.location.href = "dashboard.html";

}else{
    errorEl.hidden = false;
    errorEl.textContent = "Invalid email or password";
}

});

}); */


document.addEventListener("DOMContentLoaded", function () {

const form = document.getElementById("loginForm");
const errorEl = document.getElementById("loginError");

if(!form) return;

form.addEventListener("submit", function(e){

e.preventDefault();

const email = document.querySelector("input[name='email']").value;
const password = document.querySelector("input[name='password']").value;

if(email === "admin@gmail.com" && password === "admin123"){

    // store fake admin token
    localStorage.setItem("bskkm_admin_token","demo-admin-token");

    window.location.href = "dashboard.html";

}else{

    errorEl.hidden = false;
    errorEl.textContent = "Invalid email or password";

}

});

});