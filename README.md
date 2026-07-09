# 🐱 Catify Web - Dynamic Feline Swapping Engine (Chrome Extension)

An ultra-polished, modern, lightweight Google Chrome Extension that instantly replaces webpage clutter and clickbait with random cute cat photos dynamically fetched via a high-performance public API. 

This project was built as a high-fidelity entry for developer showcases and hackathons, complete with an **Interactive Sandbox Simulator**, a **Guided Step-by-Step Video Walkthrough**, and a **Dynamic Zip Compiler & Exporter**!

---

## 🚀 The Hackathon Submission Metadata

### 📝 Description of Your Implementation
> *Ready-to-use copy-paste description for your hackathon submission:*

Catify Web is an elegant, low-latency Google Chrome Extension engineered on the modern **Manifest V3** standard. The extension injects a non-blocking content script (`content.js`) that queries, intercept, and swaps `HTMLImageElement` sources on any webpage with beautiful cat photographs fetched on-the-fly from **The Cat API** (coupled with high-res failure-tolerant Unsplash fallbacks). 

To ensure compatibility with modern single-page apps (SPAs) and infinite scrolling feeds (e.g., Google Images, Pinterest, news feeds), a resilient `MutationObserver` is registered to dynamically intercept and catify newly appended DOM elements instantly. It features a cute floating Action Popup dashboard (`popup.html`/`popup.js`) containing a session-persistent toggle switch and a real-time statistic panel tracking total loaded cats via standard asynchronous `chrome.storage` synchronization.

To make the developer journey flawless, we built an immersive **Interactive React Playground** which features:
1. **Real-time Simulator**: A virtual browser environment mimicking a travel blog to test the extension's script injection, toggling logic, and API calls instantly in-browser.
2. **Interactive Video Demo**: A fully controlled slide-based guide demonstrating the installation steps from directory setup to active surfing.
3. **Dynamic PNG Exporter**: An automated canvas drawing pipeline that dynamically renders pixel-perfect high-definition cat icons (`16px`, `48px`, and `128px`) on-the-fly as binary Blobs, bundling them seamlessly inside a downloadable packed `.zip` archive alongside the extension's core files.

---

### 🛠️ Technologies Used (Comma separated)
> *Ready-to-use comma-separated list of technologies used:*

Chrome Extensions API (Manifest V3), JavaScript (ES6+), React 19, TypeScript, Tailwind CSS 4.0, Motion, JSZip, Canvas API (Binary Icon Drawing), HTML5/CSS3, Fetch API, The Cat API

---

## 🌟 Key Features

*   **Manifest V3 Standard Approved**: Fully compliant with the latest security declarations, permission isolated scopes, and lightweight background runtime constraints.
*   **Persistent Live Counter**: Tracks and maintains total catified images globally across active browser tabs using asynchronous state variables stored in `chrome.storage.local`.
*   **Dynamic DOM Observation Loop**: Employs a robust, memory-safe `MutationObserver` targeting asynchronous content insertions, infinite-scrolling pages, and lazy-loaded nodes.
*   **Automatic Vector Icon Rendering**: Generates cross-platform application launchers on-the-fly via HTML5 Canvas vector-to-binary streams—avoiding bulky pre-packaged graphic bloat.
*   **Interactive Simulation Console**: An immersive full-stack presentation sandbox built with Tailwind CSS, React, and Motion, allowing web-visitors to preview the extension in action.

---

## 📁 Extension Repository Structure

To load the extension into Chrome, look for the `/extension/` folder in the root directory. It is organized as follows:

```bash
/extension/
├── manifest.json   # Extension configuration, permissions, content-script mapping, and action entry
├── content.js      # Core DOM manipulator & background observer matching all URLs
├── popup.html      # Visual dashboard layout displayed when clicking the browser extension icon
└── popup.js        # Controller tracking state switches and syncing counter values to local storage
```

*Note: For the icons, the dynamic zip generator inside the sandbox compile and write the physical launcher icons (`cat_16.png`, `cat_48.png`, `cat_128.png`) on-the-fly. They are completely loaded and mapped inside the extension's folder structures.*

---

## 🛠️ Step-by-Step Installation Guide (Developer Mode)

Follow these simple steps to load the extension into your browser:

1. **Download the Source**:
   * Open the React Web application preview.
   * Click the **Source Code & ZIP** tab.
   * Click the **Download unpacked extension (.zip)** button. This will download a pre-packaged folder named `catify-extension.zip` containing all manifest config files and pre-compiled asset icons.
   * Extract the ZIP file into a convenient directory on your computer (e.g., your Desktop).

2. **Navigate to Chrome Extensions**:
   * Open a new browser tab in Google Chrome.
   * Type `chrome://extensions` in the address bar and press **Enter**.
   * Alternatively, click the Chrome Menu (three dots in top right) > **Extensions** > **Manage Extensions**.

3. **Enable Developer Mode**:
   * Look for the **Developer mode** toggle switch in the top-right corner of the Extensions dashboard.
   * Switch the toggle to **ON**. A new sub-header with options like *"Load unpacked"*, *"Pack extension"*, and *"Update"* will appear on the upper left.

4. **Load the Unpacked Folder**:
   * Click the **Load unpacked** button in the upper-left corner.
   * A file browser dialog will appear. Select the extracted `catify-extension` folder (the root folder containing `manifest.json`).
   * Click **Open** or **Select Folder**.

5. **Pin & Catify!**:
   * Click the **puzzle piece** (Extensions) icon in Chrome's toolbar (next to your profile picture).
   * Find **Catify Web** and click the **pin icon** next to it.
   * Navigate to any website containing images (e.g., Google Images, Wikipedia, news sites) and watch the images automatically transform into adorable cats! 🐾
