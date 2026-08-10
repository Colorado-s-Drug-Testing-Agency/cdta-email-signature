# ✉️ CDTA Email Signature Generator

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)

Welcome to the **Colorado's Drug Testing Agency (CDTA)** Email Signature Generator! This repository powers the static site hosted at `signature.coloradosdrugtestingagency.com` via Cloudflare Pages.

It allows CDTA staff to instantly generate, customize, and copy perfectly formatted, highly-compatible HTML email signatures that render beautifully across all major email clients (Gmail, Outlook, Apple Mail).

## ✨ Features

- **No-Code UI**: Simply click to copy the visual signature or the raw HTML code.
- **Toggle Customization**: Dynamically toggle phone numbers (Cell, Line 1, Fax, etc.) with live preview.
- **Universal Compatibility**: Structured specifically with tables and inline CSS to guarantee perfect rendering in enterprise email clients.
- **Multi-Brand Support**: Seamlessly generates multiple signatures (e.g., Terry Montoya, Ramon Rios).

## 🚀 How It Works

The signature logic is built using a lightweight Node.js script.

1. **`config.json`**: Contains all the data for each signature profile (Names, titles, phone numbers, logos).
2. **`signature.template.html`**: The UI wrapper and layout for the signature dashboard.
3. **`build_signature.js`**: A Node script that reads the `config.json`, injects it into the template, and outputs a ready-to-deploy `index.html`.

### Running Locally

If you need to make changes to the signatures:

1. Edit the data in `config.json` or the styles in `signature.template.html`.
2. Run the build script to update `index.html`:
   ```bash
   node build_signature.js
   ```
3. Open `index.html` in your browser to verify changes!

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <i>Developed and engineered by <a href="https://RamonRios.NET">RamonRios.net</a></i><br>
  <b>Systems Architect & Technologist</b>
</p>
