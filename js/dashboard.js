// ─── API Base URL ─────────────────────────────────
const API_BASE = "http://localhost:5092/api/v1";

// ─── State ────────────────────────────────────────
let selectedType = "Length";
let selectedOp   = "convert";

// ─── Units Map ────────────────────────────────────
const unitsMap = {
    Length:      ["FEET", "INCHES", "YARDS", "CENTIMETERS"],
    Weight:      ["KILOGRAM", "GRAM", "POUND"],
    Volume:      ["LITRE", "MILLILITRE", "GALLON"],
    Temperature: ["CELSIUS", "FAHRENHEIT", "KELVIN"]
};

// ─── On Page Load ─────────────────────────────────
window.onload = function () {
    // Redirect if not logged in
    if (!localStorage.getItem("accessToken")) {
        window.location.href = "login.html";
        return;
    }

    // Set username in sidebar
    const username = localStorage.getItem("username") || "User";
    const userNameEl  = document.getElementById("userName");
    const userAvatar  = document.getElementById("userAvatar");

    if (userNameEl)  userNameEl.textContent  = username;
    if (userAvatar)  userAvatar.textContent  =
        username.charAt(0).toUpperCase();

    // Load default units
    loadUnits("Length");
};

// ─── Select Measurement Type ───────────────────────
function selectType(type, btn) {
    selectedType = type;

    // Update active tab
    document.querySelectorAll(".type-tab")
        .forEach(t => t.classList.remove("active"));
    btn.classList.add("active");

    // Load units for selected type
    loadUnits(type);

    // Clear result
    hideResult();
}

// ─── Load Units into Dropdowns ────────────────────
function loadUnits(type) {
    const units = unitsMap[type] || [];
    const unit1 = document.getElementById("unit1");
    const unit2 = document.getElementById("unit2");
    const target  = document.getElementById("targetUnit");

    unit1.innerHTML = "";
    unit2.innerHTML = "";
    target.innerHTML =
        "<option value=''>Same as Unit 1 (default)</option>";

    units.forEach(u => {
        unit1.innerHTML += `<option value="${u}">${u}</option>`;
        unit2.innerHTML += `<option value="${u}">${u}</option>`;
        target.innerHTML += `<option value="${u}">${u}</option>`;
    });

    // Set second unit different from first by default
    if (units.length > 1) unit2.selectedIndex = 1;
}

// ─── Select Operation ─────────────────────────────
function selectOp(op, btn) {
    selectedOp = op;

    document.querySelectorAll(".op-btn")
        .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    hideResult();
}

// ─── Swap Values ──────────────────────────────────
function swapValues() {
    const v1 = document.getElementById("value1");
    const v2 = document.getElementById("value2");
    const u1 = document.getElementById("unit1");
    const u2 = document.getElementById("unit2");

    [v1.value, v2.value] = [v2.value, v1.value];
    [u1.value, u2.value] = [u2.value, u1.value];
}

// ─── Get Auth Header ──────────────────────────────
function getHeaders() {
    const token = localStorage.getItem("accessToken");
    return {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${token}`
    };
}

// ─── Calculate ────────────────────────────────────
async function calculate() {
    const value1 = parseFloat(
        document.getElementById("value1").value);
    const value2 = parseFloat(
        document.getElementById("value2").value);
    const unit1  = document.getElementById("unit1").value;
    const unit2  = document.getElementById("unit2").value;

    if (isNaN(value1)) {
        alert("Please enter Value 1.");
        return;
    }

    // Build request body matching your backend DTO
    // Use selected target unit or default to unit1
    const targetUnit = document.getElementById("targetUnit").value
        || unit1;

    const body = {
        firstValue:            value1,
        firstUnit:             unit1,
        firstMeasurementType:  selectedType,
        secondValue:           value2,
        secondUnit:            unit2,
        secondMeasurementType: selectedType,
        targetUnit:            targetUnit
    };  

    const btn = document.querySelector(".btn-calculate");
    btn.innerHTML = `<span class="spinner"></span> Calculating...`;
    btn.disabled  = true;

    try {
        const response = await fetch(
            `${API_BASE}/quantities/${selectedOp}`, {
            method:  "POST",
            headers: getHeaders(),
            body:    JSON.stringify(body)
        });

        const data = await response.json();

        if (response.ok) {
            showResult(data);
        } else {
            alert(data.message || "Calculation failed.");
        }

    } catch (error) {
        alert("Cannot connect to server. " +
              "Make sure your API is running.");
    } finally {
        btn.innerHTML = "Calculate →";
        btn.disabled  = false;
    }
}

// ─── Show Result ──────────────────────────────────
function showResult(data) {
    const resultBox   = document.getElementById("resultBox");
    const resultValue = document.getElementById("resultValue");
    const metaOp      = document.getElementById("metaOperation");
    const metaIn1     = document.getElementById("metaInput1");
    const metaIn2     = document.getElementById("metaInput2");
    const metaType    = document.getElementById("metaType");

    // Format result
    let result = "";
    if (data.resultString && data.resultString !== "") {
        result = data.resultString;
    } else if (data.resultValue !== undefined &&
               data.resultValue !== null) {
        result = `${parseFloat(data.resultValue).toFixed(2)} ` +
                 `${data.resultUnit || ""}`;
    } else {
        result = "Done";
    }

    resultValue.textContent = result.toUpperCase();
    metaOp.textContent      = data.operation      || selectedOp.toUpperCase();
    metaIn1.textContent     = `${data.firstValue} ${data.firstUnit}`;
    metaIn2.textContent     = `${data.secondValue} ${data.secondUnit}`;
    metaType.textContent    = selectedType.toUpperCase();

    resultBox.style.display = "block";
    resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ─── Hide Result ──────────────────────────────────
function hideResult() {
    const resultBox = document.getElementById("resultBox");
    if (resultBox) resultBox.style.display = "none";
}

// ─── Sign Out ─────────────────────────────────────
function signOut() {
    localStorage.clear();
    window.location.href = "login.html";
}