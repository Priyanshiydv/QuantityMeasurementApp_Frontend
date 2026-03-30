// ─── API Base URL ─────────────────────────────────
const API_BASE = "http://localhost:5092/api/v1";

// ─── On Page Load ─────────────────────────────────
window.onload = async function () {
    if (!localStorage.getItem("accessToken")) {
        window.location.href = "login.html";
        return;
    }

    const username = localStorage.getItem("username") || "User";
    const userNameEl = document.getElementById("userName");
    const userAvatar = document.getElementById("userAvatar");

    if (userNameEl) userNameEl.textContent = username;
    if (userAvatar) userAvatar.textContent =
        username.charAt(0).toUpperCase();

    // Load profile from backend
    await loadProfile();
};

// ─── Load Profile ─────────────────────────────────
async function loadProfile() {
    try {
        const token = localStorage.getItem("accessToken");

        const response = await fetch(
            `${API_BASE}/users/profile`, {
            headers: {
                "Content-Type":  "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            // Fill profile fields
            const username = data.username || data.Username || "—";
            const email    = data.email    || data.Email    || "—";
            const role     = data.role     || data.Role     || "User";

            document.getElementById("profileUsername")
                .textContent = username;
            document.getElementById("profileEmail")
                .textContent = email;
            document.getElementById("profileRole")
                .textContent = role;
            document.getElementById("profileAvatar")
                .textContent = username.charAt(0).toUpperCase();
            document.getElementById("profileJoined")
                .textContent = new Date().toLocaleDateString();

        } else {
            // Token expired — redirect to login
            localStorage.clear();
            window.location.href = "login.html";
        }

    } catch (error) {
        document.getElementById("profileUsername")
            .textContent = localStorage.getItem("username") || "—";
        document.getElementById("profileEmail")
            .textContent = "Could not load profile.";
    }
}

// ─── Sign Out ─────────────────────────────────────
function signOut() {
    localStorage.clear();
    window.location.href = "login.html";
}