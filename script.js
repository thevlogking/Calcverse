// ===================== TAB SWITCHING =====================
const tabs = document.querySelectorAll(".tab");
const panels = {
  basic: document.getElementById("basicKeys"),
  scientific: document.getElementById("scientificPanel"),
  programmer: document.getElementById("programmerPanel"),
  cstools: document.getElementById("cstoolsPanel"),
};
const display = document.getElementById("display");

let currentInput = "";
let operator = "";
let operand = null;

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    Object.keys(panels).forEach(key => {
      panels[key].classList.toggle("active", key === tab.dataset.tab);
      panels[key].style.display =
        key === "basic" && key === tab.dataset.tab
          ? "grid"
          : key === "basic"
          ? "none"
          : "";
    });
    currentInput = "";
    operator = "";
    operand = null;
    display.textContent = "0";
  });
});
tabs[0].click();

// ===================== BASIC CALCULATOR =====================
const basicKeys = document.querySelectorAll("#basicKeys .key");
let basicInput = "";

basicKeys.forEach(key => {
  key.addEventListener("click", () => {
    const value = key.textContent;

    if ((value >= "0" && value <= "9") || value === ".") {
      if (value === "." && basicInput.includes(".")) return;
      basicInput += value;
      display.innerHTML = basicInput;
    } else if (value === "AC") {
      basicInput = "";
      display.innerHTML = "0";
    } else if (value === "←") {
      basicInput = basicInput.slice(0, -1);
      display.innerHTML = basicInput || "0";
    } else if (value === "+/-") {
      if (basicInput) {
        basicInput = (parseFloat(basicInput) * -1).toString();
        display.innerHTML = basicInput;
      }
    } else if (value === "%") {
      if (basicInput) {
        basicInput = (parseFloat(basicInput) / 100).toString();
        display.innerHTML = basicInput;
      }
    } else if (["+", "−", "×", "÷"].includes(value)) {
      basicInput += value;
      display.innerHTML = basicInput;
    } else if (value === "=") {
      try {
        let expr = basicInput
          .replace(/÷/g, "/")
          .replace(/×/g, "*")
          .replace(/−/g, "-");
        display.innerHTML = eval(expr);
        basicInput = display.innerHTML;
      } catch {
        display.innerHTML = "Error";
        basicInput = "";
      }
    }
  });
});

// ===================== SCIENTIFIC CALCULATOR =====================
const scientificKeys = document.querySelectorAll("#scientificKeys .key");
let sciInput = "";

scientificKeys.forEach(key => {
  key.addEventListener("click", () => {
    const value = key.textContent;

    if ((value >= "0" && value <= "9") || value === "." || value === "(" || value === ")") {
      sciInput += value;
      display.innerHTML = sciInput;
    } else if (["+", "−", "×", "÷", "%"].includes(value)) {
      sciInput += value;
      display.innerHTML = sciInput;
    } else if (value === "AC") {
      sciInput = "";
      display.innerHTML = "0";
    } else if (value === "←") {
      sciInput = sciInput.slice(0, -1);
      display.innerHTML = sciInput || "0";
    } else if (value === "=") {
      try {
        // Replace calculator symbols with JS operators
        let expr = sciInput.replace(/÷/g, "/").replace(/×/g, "*").replace(/−/g, "-").replace(/%/g, "/100");
        display.innerHTML = eval(expr);
        sciInput = display.innerHTML;
      } catch {
        display.innerHTML = "Error";
        sciInput = "";
      }
    } else {
      // Handle functions
      let num = parseFloat(sciInput) || 0;
      switch (value) {
        case "sin": display.innerHTML = Math.sin(num); break;
        case "cos": display.innerHTML = Math.cos(num); break;
        case "tan": display.innerHTML = Math.tan(num); break;
        case "ln": display.innerHTML = Math.log(num); break;
        case "log": display.innerHTML = Math.log10(num); break;
        case "√": display.innerHTML = Math.sqrt(num); break;
        case "x²": display.innerHTML = (num ** 2); break;
        case "xʸ":
          sciInput += "**";
          display.innerHTML = sciInput;
          break;
        case "!":
          display.innerHTML = factorial(num);
          sciInput = display.innerHTML;
          break;
        case "π": sciInput += Math.PI; display.innerHTML = sciInput; break;
        case "e": sciInput += Math.E; display.innerHTML = sciInput; break;
      }
    }
  });
});

function factorial(n) {
  if (n < 0) return "Error";
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}


// ===================== PROGRAMMER MODE =====================
const progInput = document.getElementById("progInput");
const progBase = document.getElementById("progBase");
const progOutputUnit = document.getElementById("progOutputUnit");

function convertProgrammer() {
  const num = progInput.value.trim();
  const base = parseInt(progBase.value);
  const outputUnit = progOutputUnit.value;

  if (!num) {
    display.innerHTML = "0";
    return;
  }

  let dec = parseInt(num, base);
  if (isNaN(dec)) {
    display.innerHTML = "⚠️ Invalid number";
    return;
  }

  let result = "";
  switch (outputUnit) {
    case "BIN": result = dec.toString(2); break;
    case "OCT": result = dec.toString(8); break;
    case "DEC": result = dec.toString(10); break;
    case "HEX": result = dec.toString(16).toUpperCase(); break;
  }

  display.innerHTML = `<strong>${outputUnit}:</strong> ${result}`;
}

// Auto-convert on input or selection change
progInput.addEventListener("input", convertProgrammer);
progBase.addEventListener("change", convertProgrammer);
progOutputUnit.addEventListener("change", convertProgrammer);

// ===================== CS TOOLS =====================

// ===== ASCII Converter =====
document.getElementById("asciiConvert").addEventListener("click", () => {
  const text = document.getElementById("asciiInput").value.trim();

  if (!text) {
    display.textContent = "⚠️ Enter text to convert";
    return;
  }

  const asciiValues = text.split("").map(c => c.charCodeAt(0)).join(" ");
  display.innerHTML = `<strong>ASCII Value:</strong> ${asciiValues}`;
});

// ===== FILE SIZE CONVERTER =====
document.getElementById("fileConvert").addEventListener("click", () => {
  const size = parseFloat(document.getElementById("fileInput").value);
  const inputUnit = document.getElementById("fileInputUnit").value;
  const outputUnit = document.getElementById("fileOutputUnit").value;
  const base = 1024;

  if (isNaN(size) || size < 0) {
    display.textContent = "⚠️ Please enter a valid number.";
    return;
  }

  // ✅ Convert input to bytes
  let bytes = size;
  switch (inputUnit) {
    case "KB": bytes *= base; break;
    case "MB": bytes *= base ** 2; break;
    case "GB": bytes *= base ** 3; break;
  }

  // ✅ Convert bytes to requested output
  let result = bytes;
  switch (outputUnit) {
    case "KB": result = bytes / base; break;
    case "MB": result = bytes / base ** 2; break;
    case "GB": result = bytes / base ** 3; break;
  }

  display.innerHTML = `${result.toFixed(4)} ${outputUnit}`;
});

// ✅ Enter key support
document.getElementById("fileInput").addEventListener("keypress", e => {
  if (e.key === "Enter") document.getElementById("fileConvert").click();
});
document.getElementById("asciiInput").addEventListener("keypress", e => {
  if (e.key === "Enter") document.getElementById("asciiConvert").click();
});
