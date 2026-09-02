# G4mg - Adamz Pharmacy
## Project Handover & Architecture Document

This document outlines the core architectural upgrades, new features, and technical workflows implemented to transform the G4mg - Adamz Pharmacy platform into a modern, unified, and resilient Progressive Web App (PWA).

---

### 1. Unified Premium Architecture
The platform has been rebuilt from the ground up as a **Single Page Application (SPA)**. Instead of having separate, disjointed screens for different users, the entire application operates within a single seamless interface.
* **Role-Based Access Control (RBAC):** Features, buttons, and navigation menus are dynamically hidden or revealed based on the logged-in user's role (`admin`, `staff`, `wholesale`). 
* **Public Catalog First:** Unauthenticated users are no longer greeted by a blank login wall. They are immediately presented with a beautiful, public-facing product catalog and a premium hero background.

### 2. Authentication & User Workflows
* **Flexible Login:** Removed rigid authentication barriers. Users can browse products freely and are only prompted to authenticate when checking out or accessing internal tools.
* **Wholesale Fast-Track:** Introduced a password-less shortcut for wholesale clients (`wholesale@g4mg.com`). The system automatically detects this email, removes the password requirement, and logs them into the dashboard instantly.
* **Auto-Recovery:** If the database record for an Admin is accidentally deleted, the system will automatically recreate the Admin profile upon their next successful Firebase Authentication login, preventing permanent lockouts.

### 3. Dynamic Branding & Administrative Controls
The platform is no longer hardcoded. An intuitive **System Configuration Panel** was added to the Admin Settings section, allowing non-technical updates to the live site:
* **Dynamic Logo:** Admins can paste a Firebase Storage URL to instantly update the company logo across the navbar and login screens.
* **Hero Background:** The public landing page background (currently a premium pharmaceutical mockup) can be swapped out instantly via the Admin panel.
* **Contact & Passwords:** WhatsApp numbers, Logistics contact numbers, and role-based passwords can be managed directly from the UI.

### 4. Product & Inventory Synchronization
* **Data Separation:** The product database now clearly distinguishes between the `Description` (used for rich, detailed public catalog viewing) and the `Generic Name` (used for clean, tabular inventory tracking).
* **Inventory view:** The internal stock management table strictly displays the Generic Name, preventing massive descriptions from breaking the table layout.

### 5. Resilience, Caching, and PWA Features
To ensure the application is lightning-fast and never crashes due to network issues or adblockers:
* **Service Worker (sw.js):** Implemented a Progressive Web App service worker. It uses a "Network First, Fallback to Cache" strategy. This means the app will always try to fetch the freshest data, but will load instantly from memory if the user is offline.
* **Anti-Freeze Failsafe:** Added a strict 2-second timeout to the Firebase initialization sequence. If a user's corporate firewall, VPN, or strict Adblocker (e.g., uBlock Origin) blocks Google's Identity Toolkit scripts, the app will *forcefully* bypass the authentication sequence and display the public catalog. This guarantees the screen will never be completely blank.
* **Cache Busting:** The service worker cache is currently on version `v4`. Future developers must increment this version number in `sw.js` if they make critical layout changes to force all client devices to update.

### 6. Hosting & Deployment
* **Firebase Hosting:** The monolithic `index.html` is served via Firebase Hosting, connected directly to the custom domain `adamzpharmacy.com`.
* **Deployment Command:** Any future updates to the codebase must be pushed live using the terminal command: 
  `firebase deploy --only hosting`

---
*Document prepared for the G4mg - Adamz Pharmacy Management Team.*
