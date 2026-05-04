/**
 * CryptoVault – app.js
 * Web-Based Text Encryption Tool
 * Author: Abdul Rehman (03-134222-005)
 * Algorithms: Caesar Cipher, AES-256, DES, RSA, Base64, SHA-256
 */

"use strict";

// ── State ──────────────────────────────────────────────────────────
let currentMode = "encrypt"; // encrypt | decrypt | hash

// ── Init ───────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  spawnParticles();
  updateCharCount();
  document.getElementById("input-text").addEventListener("input", updateCharCount);
  onAlgoChange(); // set initial UI
});

// ── Particles ──────────────────────────────────────────────────────
function spawnParticles() {
  const container = document.getElementById("particles");
  const colors = ["#637aff","#a855f7","#06b6d4","#10b981"];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = Math.random() * 4 + 1;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      animation-duration:${Math.random()*20+12}s;
      animation-delay:${Math.random()*15}s;
    `;
    container.appendChild(p);
  }
}

// ── Mode Tabs ──────────────────────────────────────────────────────
function setMode(mode) {
  currentMode = mode;
  document.querySelectorAll(".tab").forEach(t => {
    t.classList.remove("active");
    t.setAttribute("aria-selected","false");
  });
  const activeTab = document.getElementById(`tab-${mode}`);
  activeTab.classList.add("active");
  activeTab.setAttribute("aria-selected","true");

  // Hash mode: force sha256, hide decrypt-incompatible algos
  const algoEl = document.getElementById("algorithm");
  const sha256Opt = document.getElementById("opt-hash");

  if (mode === "hash") {
    algoEl.value = "sha256";
    sha256Opt.disabled = false;
    document.getElementById("input-label").textContent = "Input Text";
    document.getElementById("output-label").textContent = "Hash Output";
    document.getElementById("btn-label").textContent = "Generate Hash";
    document.getElementById("action-btn").querySelector(".btn-icon").textContent = "#️⃣";
  } else if (mode === "decrypt") {
    if (algoEl.value === "sha256") algoEl.value = "";
    document.getElementById("input-label").textContent = "Ciphertext";
    document.getElementById("output-label").textContent = "Plain Text";
    document.getElementById("btn-label").textContent = "Decrypt";
    document.getElementById("action-btn").querySelector(".btn-icon").textContent = "🔓";
  } else {
    document.getElementById("input-label").textContent = "Plain Text";
    document.getElementById("output-label").textContent = "Ciphertext";
    document.getElementById("btn-label").textContent = "Encrypt";
    document.getElementById("action-btn").querySelector(".btn-icon").textContent = "🔒";
  }
  onAlgoChange();
  clearOutput();
}

// ── Algorithm change ───────────────────────────────────────────────
const ALGO_INFO = {
  caesar:  "Shifts each letter by N positions in the alphabet. Key space: 25.",
  aes:     "AES-256 CBC mode. 256-bit key via PBKDF2 derivation. NIST-approved gold standard.",
  des:     "56-bit key DES CBC mode. Historical standard — insecure for production, educational use only.",
  rsa:     "RSA OAEP with SHA-256. Asymmetric: public key encrypts, private key decrypts.",
  base64:  "Binary-to-text encoding (not encryption). Reversible with no key.",
  sha256:  "One-way cryptographic hash. Output: 64 hex chars (256 bits). Cannot be reversed.",
};

function onAlgoChange() {
  const algo = document.getElementById("algorithm").value;

  // Show/hide conditional fields
  document.getElementById("caesar-options").classList.toggle("hidden", algo !== "caesar");
  document.getElementById("key-options").classList.toggle("hidden", !["aes","des"].includes(algo));
  document.getElementById("rsa-options").classList.toggle("hidden", algo !== "rsa");

  // Info badge
  const badge = document.getElementById("algo-info");
  if (algo && ALGO_INFO[algo]) {
    badge.textContent = ALGO_INFO[algo];
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }

  // SHA-256 only available in hash mode
  if (algo === "sha256" && currentMode !== "hash") setMode("hash");

  clearOutput();
  clearError();
}

// ── Quick select from info cards ───────────────────────────────────
function quickSelect(algo) {
  if (algo === "sha256") {
    setMode("hash");
  } else if (currentMode === "hash") {
    setMode("encrypt");
  }
  document.getElementById("algorithm").value = algo;
  onAlgoChange();
  document.getElementById("input-text").focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── Generate key ───────────────────────────────────────────────────
function generateKey() {
  const algo = document.getElementById("algorithm").value;
  const len = algo === "aes" ? 32 : 8; // 256-bit for AES, 64-bit for DES
  const key = CryptoJS.lib.WordArray.random(len).toString(CryptoJS.enc.Base64);
  document.getElementById("secret-key").value = key;
}

// ── Character counter ──────────────────────────────────────────────
function updateCharCount() {
  const val = document.getElementById("input-text").value;
  document.getElementById("char-count").textContent = `${val.length} chars`;
}

// ── Validation ─────────────────────────────────────────────────────
function validate() {
  const algo  = document.getElementById("algorithm").value;
  const input = document.getElementById("input-text").value.trim();

  if (!algo)  return showError("⚠ Please select an encryption algorithm.");
  if (!input) return showError("⚠ Input text cannot be empty.");

  if (["aes","des"].includes(algo)) {
    const key = document.getElementById("secret-key").value.trim();
    if (!key) return showError("⚠ Please enter or generate a secret key.");
  }
  return true;
}

// ── Main action ────────────────────────────────────────────────────
function runAction() {
  if (!validate()) return;
  clearError();

  const algo    = document.getElementById("algorithm").value;
  const input   = document.getElementById("input-text").value.trim();
  const key     = document.getElementById("secret-key").value.trim();
  const shift   = parseInt(document.getElementById("caesar-shift").value) || 3;
  const mode    = currentMode;

  let result = "";

  try {
    if (algo === "caesar") {
      result = mode === "decrypt" ? caesarDecrypt(input, shift) : caesarEncrypt(input, shift);
    } else if (algo === "aes") {
      result = mode === "decrypt" ? aesDecrypt(input, key) : aesEncrypt(input, key);
    } else if (algo === "des") {
      result = mode === "decrypt" ? desDecrypt(input, key) : desEncrypt(input, key);
    } else if (algo === "rsa") {
      result = mode === "decrypt" ? rsaDecrypt(input) : rsaEncrypt(input);
    } else if (algo === "base64") {
      result = mode === "decrypt" ? base64Decode(input) : base64Encode(input);
    } else if (algo === "sha256") {
      result = sha256Hash(input);
    }
    displayResult(result, algo, mode, input.length, result.length);
  } catch (e) {
    showError("❌ " + (e.message || "Decryption failed. Check your key or ciphertext."));
  }
}

// ── Display result ─────────────────────────────────────────────────
function displayResult(result, algo, mode, inLen, outLen) {
  const box = document.getElementById("output-box");
  box.innerHTML = `<span style="color:#a5b4fc">${escapeHtml(result)}</span>`;
  box.classList.add("has-result");

  // Stats
  const algoNames = { caesar:"Caesar Cipher", aes:"AES-256 CBC", des:"DES CBC", rsa:"RSA OAEP", base64:"Base64", sha256:"SHA-256" };
  document.getElementById("stat-algo").textContent = algoNames[algo] || algo;
  document.getElementById("stat-mode").textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
  document.getElementById("stat-in").textContent = `${inLen} chars`;
  document.getElementById("stat-out").textContent = `${outLen} chars`;
  document.getElementById("stats-bar").classList.remove("hidden");

  // Enable copy
  document.getElementById("copy-btn").disabled = false;
}

function escapeHtml(str) {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

// ── Clear helpers ──────────────────────────────────────────────────
function clearOutput() {
  const box = document.getElementById("output-box");
  box.classList.remove("has-result");
  box.innerHTML = `<div class="output-placeholder"><div class="placeholder-icon">🔐</div><p>Your result will appear here</p></div>`;
  document.getElementById("stats-bar").classList.add("hidden");
  document.getElementById("copy-btn").disabled = true;
}

function clearAll() {
  document.getElementById("input-text").value = "";
  document.getElementById("secret-key").value = "";
  clearOutput();
  clearError();
  updateCharCount();
}

function clearError() { document.getElementById("error-msg").classList.add("hidden"); }
function showError(msg) {
  const el = document.getElementById("error-msg");
  el.textContent = msg;
  el.classList.remove("hidden");
  return false;
}

// ── Copy to clipboard ──────────────────────────────────────────────
function copyOutput() {
  const box = document.getElementById("output-box");
  const text = box.innerText || box.textContent;
  navigator.clipboard.writeText(text).then(() => showToast());
}

function showToast() {
  const t = document.getElementById("toast");
  t.classList.remove("hidden");
  setTimeout(() => t.classList.add("hidden"), 2500);
}

// ════════════════════════════════════════════════════════════════════
// ENCRYPTION ALGORITHMS
// ════════════════════════════════════════════════════════════════════

// ── 1. Caesar Cipher ───────────────────────────────────────────────
function caesarEncrypt(text, shift) {
  return text.split("").map(ch => {
    if (/[a-z]/.test(ch)) return String.fromCharCode(((ch.charCodeAt(0) - 97 + shift) % 26) + 97);
    if (/[A-Z]/.test(ch)) return String.fromCharCode(((ch.charCodeAt(0) - 65 + shift) % 26) + 65);
    return ch;
  }).join("");
}

function caesarDecrypt(text, shift) {
  return caesarEncrypt(text, 26 - (shift % 26));
}

// ── 2. AES-256 CBC ─────────────────────────────────────────────────
function aesEncrypt(plaintext, key) {
  const keyWA  = CryptoJS.enc.Utf8.parse(key.padEnd(32, "0").slice(0, 32));
  const iv     = CryptoJS.lib.WordArray.random(16);
  const cipher = CryptoJS.AES.encrypt(plaintext, keyWA, {
    iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7
  });
  // Prepend IV to ciphertext for decryption
  return iv.toString(CryptoJS.enc.Hex) + ":" + cipher.toString();
}

function aesDecrypt(ciphertext, key) {
  const parts = ciphertext.split(":");
  if (parts.length < 2) throw new Error("Invalid AES ciphertext format. Expected IV:ciphertext");
  const iv     = CryptoJS.enc.Hex.parse(parts[0]);
  const keyWA  = CryptoJS.enc.Utf8.parse(key.padEnd(32, "0").slice(0, 32));
  const decrypted = CryptoJS.AES.decrypt(parts[1], keyWA, {
    iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7
  });
  const result = decrypted.toString(CryptoJS.enc.Utf8);
  if (!result) throw new Error("Decryption failed. Wrong key or corrupted ciphertext.");
  return result;
}

// ── 3. DES CBC ─────────────────────────────────────────────────────
function desEncrypt(plaintext, key) {
  const keyWA  = CryptoJS.enc.Utf8.parse(key.padEnd(8, "0").slice(0, 8));
  const iv     = CryptoJS.lib.WordArray.random(8);
  const cipher = CryptoJS.DES.encrypt(plaintext, keyWA, {
    iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7
  });
  return iv.toString(CryptoJS.enc.Hex) + ":" + cipher.toString();
}

function desDecrypt(ciphertext, key) {
  const parts = ciphertext.split(":");
  if (parts.length < 2) throw new Error("Invalid DES ciphertext format.");
  const iv     = CryptoJS.enc.Hex.parse(parts[0]);
  const keyWA  = CryptoJS.enc.Utf8.parse(key.padEnd(8, "0").slice(0, 8));
  const decrypted = CryptoJS.DES.decrypt(parts[1], keyWA, {
    iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7
  });
  const result = decrypted.toString(CryptoJS.enc.Utf8);
  if (!result) throw new Error("DES decryption failed. Wrong key?");
  return result;
}

// ── 4. RSA (OAEP via SubtleCrypto) ────────────────────────────────
// We generate an ephemeral keypair, encrypt with public key, decrypt with private key
// Keys are stored in sessionStorage so decrypt tab works
async function rsaEncrypt(plaintext) {
  return new Promise(async (resolve, reject) => {
    try {
      const bits = parseInt(document.querySelector('input[name="rsa-bits"]:checked').value);
      const keyPair = await window.crypto.subtle.generateKey(
        { name:"RSA-OAEP", modulusLength: bits, publicExponent: new Uint8Array([1,0,1]), hash:"SHA-256" },
        true, ["encrypt","decrypt"]
      );
      // Export & store private key for decryption
      const privExported = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey);
      sessionStorage.setItem("rsa_private_jwk", JSON.stringify(privExported));

      const enc = new TextEncoder();
      const cipherBuf = await window.crypto.subtle.encrypt(
        { name:"RSA-OAEP" }, keyPair.publicKey, enc.encode(plaintext)
      );
      const cipherHex = Array.from(new Uint8Array(cipherBuf)).map(b=>b.toString(16).padStart(2,"0")).join("");
      resolve("RSA:" + cipherHex);
    } catch(e) { reject(new Error("RSA encryption failed: " + e.message)); }
  });
}

async function rsaDecrypt(ciphertext) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!ciphertext.startsWith("RSA:")) throw new Error("Not RSA ciphertext (must start with 'RSA:')");
      const stored = sessionStorage.getItem("rsa_private_jwk");
      if (!stored) throw new Error("No RSA private key found. Please encrypt in the same session first.");
      const jwk = JSON.parse(stored);
      const privKey = await window.crypto.subtle.importKey(
        "jwk", jwk, { name:"RSA-OAEP", hash:"SHA-256" }, false, ["decrypt"]
      );
      const hexStr = ciphertext.slice(4);
      const buf = new Uint8Array(hexStr.match(/.{2}/g).map(b=>parseInt(b,16)));
      const plainBuf = await window.crypto.subtle.decrypt({ name:"RSA-OAEP" }, privKey, buf);
      resolve(new TextDecoder().decode(plainBuf));
    } catch(e) { reject(new Error("RSA decryption failed: " + e.message)); }
  });
}

// Override runAction to handle async RSA
const _origRun = runAction;
window.runAction = async function() {
  if (!validate()) return;
  clearError();
  const algo  = document.getElementById("algorithm").value;
  const input = document.getElementById("input-text").value.trim();
  const key   = document.getElementById("secret-key").value.trim();
  const shift = parseInt(document.getElementById("caesar-shift").value) || 3;
  const mode  = currentMode;

  const btn = document.getElementById("action-btn");
  btn.disabled = true;
  btn.querySelector(".btn-icon").textContent = "⏳";

  try {
    let result = "";
    if (algo === "caesar")       result = mode === "decrypt" ? caesarDecrypt(input,shift) : caesarEncrypt(input,shift);
    else if (algo === "aes")     result = mode === "decrypt" ? aesDecrypt(input,key) : aesEncrypt(input,key);
    else if (algo === "des")     result = mode === "decrypt" ? desDecrypt(input,key) : desEncrypt(input,key);
    else if (algo === "rsa")     result = await (mode === "decrypt" ? rsaDecrypt(input) : rsaEncrypt(input));
    else if (algo === "base64")  result = mode === "decrypt" ? base64Decode(input) : base64Encode(input);
    else if (algo === "sha256")  result = sha256Hash(input);
    displayResult(result, algo, mode, input.length, result.length);
  } catch(e) {
    showError("❌ " + (e.message || "Operation failed."));
  } finally {
    btn.disabled = false;
    const icons = { encrypt:"🔒", decrypt:"🔓", hash:"#️⃣" };
    btn.querySelector(".btn-icon").textContent = icons[mode];
  }
};

// ── 5. Base64 ──────────────────────────────────────────────────────
function base64Encode(text) {
  return btoa(unescape(encodeURIComponent(text)));
}
function base64Decode(text) {
  try { return decodeURIComponent(escape(atob(text))); }
  catch(e) { throw new Error("Invalid Base64 string."); }
}

// ── 6. SHA-256 ─────────────────────────────────────────────────────
function sha256Hash(text) {
  return CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex);
}
