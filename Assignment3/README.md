# DefendX – Network Security Scanner & Firewall Visualizer

**Assignment 3 | Information Security (CLO 4)**  
**Author:** Abdul Rehman | **Roll Number:** 03-134222-005

---

## Overview

DefendX is a single-page interactive utility built in Python Flask that scans a target IP/hostname to identify active ports, services, and security profiles. It includes a built-in interactive firewall simulator where users can test complex priority rules on real/simulated traffic.

## Features

- ✅ **Network Port Scanner**: Tests standard TCP and UDP ports on custom IP addresses or `127.0.0.1`
- ✅ **Firewall Policy Tester**: Chain multiple rules sequentially to see traffic allowed vs blocked
- ✅ **Traffic Flow Diagram**: Visualization of connections showing packets permitted or blocked
- ✅ **Full Validation**: Rejects malformed input, prevents empty requests
- ✅ **Zero Config**: Python Flask backend with complete in-browser scanning logic

## Technical Architecture

- **Backend:** Python 3 + Flask
- **Frontend:** HTML5, modern Glassmorphism Vanilla CSS, JavaScript ES6
- **Dependencies:** Built-in `socket` library

## Setup & How to Run

1. Navigate to the `Assignment3` folder:
```bash
cd "Assignment3"
```

2. Run the application using the Python interpreter:
```bash
python3 app.py
```

3. Access the web dashboard in any browser:
👉 **`http://localhost:9011`**
