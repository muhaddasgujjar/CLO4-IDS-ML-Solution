# CryptoVault – Web-Based Text Encryption Tool

**Assignment 2 | Information Security**  
**Author:** Abdul Rehman | **Roll#:** 03-134222-005

---

## Project Overview

CryptoVault is a single-page web application that allows users to encrypt, decrypt, and hash text using multiple cryptographic algorithms — entirely in the browser with no server communication.

## Supported Algorithms

| Algorithm | Type | Key Size | Notes |
|---|---|---|---|
| Caesar Cipher | Symmetric | Shift 1–25 | Historical substitution cipher |
| AES-256 CBC | Symmetric | 256-bit | NIST gold standard |
| DES CBC | Symmetric | 56-bit | Legacy, educational |
| RSA OAEP | Asymmetric | 512/1024-bit | Via Web Crypto API |
| Base64 | Encoding | N/A | Binary-to-text |
| SHA-256 | Hash (one-way) | N/A | Cannot be reversed |

## Features

- ✅ Encrypt / Decrypt / Hash modes
- ✅ Auto key generator for AES and DES
- ✅ Input validation (no empty text, must select algorithm)
- ✅ Copy to clipboard (bonus)
- ✅ Decryption support for all reversible algorithms (bonus)
- ✅ SHA-256 hashing (bonus)
- ✅ Live character counter
- ✅ Stats bar showing algorithm, mode, input/output lengths

## How to Run

No installation required. Just open the file in any modern browser:

```bash
# Option 1 – Open directly
xdg-open index.html   # Linux
open index.html        # macOS

# Option 2 – Local server
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Tech Stack

- **Frontend:** HTML5, CSS3 (Vanilla), JavaScript (ES2020)
- **Crypto Library:** [CryptoJS 4.2.0](https://cryptojs.gitbook.io/) (AES, DES, SHA-256)
- **RSA:** Web Crypto API (built into all modern browsers)
- **Fonts:** Google Fonts – Inter, JetBrains Mono

## Sample Screenshots

![CryptoVault App](screenshot_app.png)

## Project Structure

```
Assignment2/
├── index.html     # Main application page
├── style.css      # Dark theme UI styles
├── app.js         # All encryption logic
└── README.md      # This file
```

## Security Note

All cryptographic operations run **client-side**. No plaintext, keys, or ciphertext are ever transmitted over the network.
