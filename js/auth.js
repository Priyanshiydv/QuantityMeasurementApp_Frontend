// ─── Backend API URL ──────────────────────────────
const API_BASE = "http://localhost:5092/api/v1";

// ─── Toggle Password Visibility ───────────────────
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.type = input.type === "password" ? "text" : "password";
    btn.textContent = input.type === "password" ? "👁️" : "🙈";
}

// ─── Password Strength Checker ────────────────────
function checkStrength(value) {
    const bar = document.getElementById("strengthBar");
    if (!bar) return;

    let strength = 0;
    if (value.length >= 6)  strength++;
    if (value.length >= 10) strength++;
    if (/[A-Z]/.test(value)) strength++;
    if (/[0-9]/.test(value)) strength++;
    if (/[^A-Za-z0-9]/.test(value)) strength++;

    const colors = ["#f78166", "#f78166", "#f0a500", "#3fb950", "#3fb950"];
    const widths = ["20%", "40%", "60%", "80%", "100%"];

    bar.style.width      = widths[strength - 1] || "0%";
    bar.style.background = colors[strength - 1] || "transparent";
}

// ─── Show Message ─────────────────────────────────
function showMsg(type, text) {
    const errorMsg   = document.getElementById("errorMsg");
    const successMsg = document.getElementById("successMsg");
    const errorText  = document.getElementById("errorText");
    const successText = document.getElementById("successText");

    // Hide both first
    if (errorMsg)   errorMsg.style.display   = "none";
    if (successMsg) successMsg.style.display = "none";

    if (type === "error" && errorMsg) {
        errorText.textContent    = text;
        errorMsg.style.display   = "flex";
    } else if (type === "success" && successMsg) {
        successText.textContent  = text;
        successMsg.style.display = "flex";
    }
}

// ─── Set Loading State on Button ──────────────────
function setLoading(btnId, loading) {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    if (loading) {
        btn.disabled     = true;
        btn.innerHTML    = `<span class="spinner"></span> Please wait...`;
    } else {
        btn.disabled     = false;
        btn.innerHTML    = btnId === "loginBtn"
            ? "Sign In →"
            : "Create Account →";
    }
}

// ─── Save Auth Data to LocalStorage ───────────────
function saveAuth(data) {
    localStorage.setItem("accessToken",  data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("username",     data.username);
    localStorage.setItem("role",         data.role);
    localStorage.setItem("expiresAt",    data.expiresAt);
}

// ─── Check If Logged In ───────────────────────────
function isLoggedIn() {
    return !!localStorage.getItem("accessToken");
}

// ─── Redirect If Already Logged In ────────────────
if (isLoggedIn() &&
    !window.location.href.includes("dashboard")) {
    window.location.href = "dashboard.html";
}

// ══════════════════════════════════════════════════
// LOGIN FORM
// ══════════════════════════════════════════════════
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const username = document
            .getElementById("username").value.trim();
        const password = document
            .getElementById("password").value.trim();

        if (!username || !password) {
            showMsg("error", "Please fill in all fields.");
            return;
        }

        setLoading("loginBtn", true);

        try {
            const response = await fetch(
                `${API_BASE}/users/login`, {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Save token and user info
                saveAuth(data);
                showMsg("success",
                    `Welcome back, ${data.username}! Redirecting...`);

                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1200);
            } else {
                showMsg("error",
                    data.message || "Invalid username or password.");
            }

        } catch (error) {
            showMsg("error",
                "Cannot connect to server. " +
                "Make sure your API is running on port 5092.");
        } finally {
            setLoading("loginBtn", false);
        }
    });
}

// ══════════════════════════════════════════════════
// SIGNUP FORM
// ══════════════════════════════════════════════════
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const username = document
            .getElementById("username").value.trim();
        const email    = document
            .getElementById("email").value.trim();
        const password = document
            .getElementById("password").value.trim();

        if (!username || !email || !password) {
            showMsg("error", "Please fill in all fields.");
            return;
        }

        if (password.length < 6) {
            showMsg("error",
                "Password must be at least 6 characters.");
            return;
        }

        setLoading("signupBtn", true);

        try {
            const response = await fetch(
                `${API_BASE}/users/register`, {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok || response.status === 201) {
                // Auto login after signup
                saveAuth(data);
                showMsg("success",
                    `Account created! Welcome, ${data.username}!`);

                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1200);
            } else {
                showMsg("error",
                    data.message || "Registration failed.");
            }

        } catch (error) {
            showMsg("error",
                "Cannot connect to server. " +
                "Make sure your API is running on port 5092.");
        } finally {
            setLoading("signupBtn", false);
        }
    });
}