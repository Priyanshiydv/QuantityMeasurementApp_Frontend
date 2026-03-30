// ─── API Base URL ─────────────────────────────────
const API_BASE = "http://localhost:5092/api/v1";

// ─── History Mode ─────────────────────────────────
let historyMode = "my"; // "my" or "all"

// ─── Filter Options Map ───────────────────────────
const filterOptions = {
    operation:   ["COMPARE", "CONVERT", "ADD", "SUBTRACT", "DIVIDE"],
    measurement: ["Length", "Weight", "Volume", "Temperature"]
};

// ─── On Page Load ─────────────────────────────────
window.onload = function () {
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

    // Load MY history on start
    switchHistoryMode("my");
};

// ─── Update Filter Options ────────────────────────
function updateFilterOptions() {
    const filterBy    = document.getElementById("filterBy").value;
    const filterValue = document.getElementById("filterValue");
    const valueGroup  = document.getElementById("valueGroup");

    filterValue.innerHTML = "<option value=''>Select...</option>";

    if (filterBy === "all") {
        valueGroup.style.display = "none";
        return;
    }

    valueGroup.style.display = "flex";

    const options = filterOptions[filterBy] || [];
    options.forEach(opt => {
        filterValue.innerHTML +=
            `<option value="${opt}">${opt}</option>`;
    });
}

// ─── Get Auth Header ──────────────────────────────
function getHeaders() {
    const token = localStorage.getItem("accessToken");
    return {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${token}`
    };
}

// ─── Switch History Mode ──────────────────────────
function switchHistoryMode(mode) {
    historyMode = mode;

    const myBtn  = document.getElementById("myHistoryBtn");
    const allBtn = document.getElementById("allHistoryBtn");

    if (mode === "my") {
        myBtn.className  = "btn-fetch";
        allBtn.className = "btn-count";
    } else {
        myBtn.className  = "btn-count";
        allBtn.className = "btn-fetch";
    }

    fetchHistory();
}

// ─── Fetch History ────────────────────────────────
async function fetchHistory() {
    const filterBy    = document.getElementById("filterBy").value;
    const filterValue = document.getElementById("filterValue").value;
    const historyList = document.getElementById("historyList");

    historyList.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">
                <span class="spinner"
                      style="width:32px;height:32px;
                             border-width:3px;">
                </span>
            </div>
            <p>Loading...</p>
        </div>`;

    try {
        let url = "";

        if (historyMode === "my") {
            // Show only logged in user's history
            if (filterBy === "operation" && filterValue) {
                url = `${API_BASE}/quantities/history/operation/${filterValue}`;
            } else if (filterBy === "measurement" && filterValue) {
                url = `${API_BASE}/quantities/history/measurement/${filterValue}`;
            } else {
                url = `${API_BASE}/quantities/history/my`;
            }
        } else {
            // Show all users history
            if (filterBy === "operation" && filterValue) {
                url = `${API_BASE}/quantities/history/operation/${filterValue}`;
            } else if (filterBy === "measurement" && filterValue) {
                url = `${API_BASE}/quantities/history/measurement/${filterValue}`;
            } else {
                url = `${API_BASE}/quantities/history`;
            }
        }

        const response = await fetch(url, {
            headers: getHeaders()
        });

        const data = await response.json();

        if (response.ok) {
            renderHistory(data);
        } else {
            showEmpty("Failed to load history.");
        }

    } catch (error) {
        showEmpty("Cannot connect to server. " +
                  "Make sure your API is running.");
    }
}

// ─── Render History Items ─────────────────────────
function renderHistory(items) {
    const historyList = document.getElementById("historyList");

    if (!items || items.length === 0) {
        showEmpty("No history found.");
        return;
    }

    historyList.innerHTML = "";

    items.forEach(item => {
        const div = document.createElement("div");
        div.className = "history-item";

        const op     = (item.operation           || "").toUpperCase();
        const input1 = item.firstUnit            || "";
        const input2 = item.secondUnit           || "";
        const result = item.resultString         || "—";
        const type   = item.firstMeasurementType || "";

        // Format detail line
        let detail = "";
        if (input1 && input2) {
            detail = `${input1} ↔ ${input2} → ${result}`;
        } else if (input1) {
            detail = `${input1} → ${result}`;
        } else {
            detail = `Result: ${result}`;
        }

        const badgeColors = {
            COMPARE:  "rgba(79,142,247,0.15)",
            CONVERT:  "rgba(124,92,191,0.15)",
            ADD:      "rgba(63,185,80,0.15)",
            SUBTRACT: "rgba(247,129,102,0.15)",
            DIVIDE:   "rgba(240,165,0,0.15)"
        };

        const textColors = {
            COMPARE:  "#4f8ef7",
            CONVERT:  "#7c5cbf",
            ADD:      "#3fb950",
            SUBTRACT: "#f78166",
            DIVIDE:   "#f0a500"
        };

        const bgCol = badgeColors[op] || "rgba(79,142,247,0.15)";
        const txCol = textColors[op]  || "#4f8ef7";

        div.innerHTML = `
            <div class="op-badge" style="
                background: ${bgCol};
                color: ${txCol};
                border: 1px solid ${txCol};">
                ${op}
            </div>
            <div class="history-detail">
                <strong style="color:${txCol}">${detail}</strong>
                ${type
                    ? `· <span style="color:var(--text-secondary)">
                       ${type}</span>`
                    : ""}
                ${item.hasError
                    ? `<span style="color:#f78166">
                       ⚠️ ${item.errorMessage || ""}</span>`
                    : ""}
            </div>
        `;

        historyList.appendChild(div);
    });
}
// ─── Get Count ────────────────────────────────────
async function getCount() {
    const filterBy    = document.getElementById("filterBy").value;
    const filterValue = document.getElementById("filterValue").value;
    const countBadge  = document.getElementById("countBadge");

    try {
        let url = `${API_BASE}/quantities/count`;

        if (filterBy === "operation" && filterValue) {
            url = `${API_BASE}/quantities/count/${filterValue}`;
        }

        const response = await fetch(url, {
            headers: getHeaders()
        });

        const data = await response.json();

        if (response.ok) {
            const count = data.count
                ?? data.totalCount
                ?? data.Count
                ?? data.TotalCount
                ?? 0;

            countBadge.style.display = "block";
            countBadge.textContent   =
                `Total: ${count} record(s)`;
        }

    } catch (error) {
        alert("Cannot connect to server.");
    }
}

// ─── Show Empty State ─────────────────────────────
function showEmpty(msg) {
    document.getElementById("historyList").innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">📭</div>
            <p>${msg}</p>
        </div>`;
}

// ─── Sign Out ─────────────────────────────────────
function signOut() {
    localStorage.clear();
    window.location.href = "login.html";
}