# Publishing to Microsoft Edge Add-ons

The submission package is built and ready:

- **Upload file:** `dist/auto-refresh-scroller-v1.0.0.zip`
- **Store logo (300×300):** `store-assets/store-logo-300.png`

Publishing must be done by you through Microsoft Partner Center (it requires a
verified developer account and manual review). Steps:

## 1. Register as an Edge developer (one-time, free)
1. Go to https://partner.microsoft.com/dashboard/microsoftedge/overview
2. Sign in with a Microsoft account and complete developer registration
   (Edge Add-ons registration has **no fee**).

## 2. Create a new submission
1. Dashboard → **Microsoft Edge** → **Create new extension**.
2. **Upload package:** select `dist/auto-refresh-scroller-v1.0.0.zip`.

## 3. Fill in the listing (copy/paste below)

- **Name:** Auto Refresh & Scroller
- **Short description:**
  Auto-refresh any page on a per-page interval and restore your saved scroll
  position, with a live countdown on the toolbar icon.
- **Long description:**
  > Auto Refresh & Scroller reloads pages automatically on a schedule you set per
  > page, and restores your scroll position after each refresh.
  >
  > • Per-page intervals — every URL keeps its own timer (15s, 30s, 1m, 5m, 10m, or custom).
  > • Per-page scroll restore — save a position and the page jumps back to it after each reload.
  > • "Track scroll" option re-captures your current position before each refresh (great for growing feeds/dashboards).
  > • Live countdown shown right on the toolbar icon — nothing covers the page.
  > • Pause while a tab is in the background, refresh now, or remove a page's settings from the popup.
  > • All settings are stored locally in your browser. No data is collected or sent anywhere.
- **Category:** Productivity
- **Store logo:** `store-assets/store-logo-300.png`
- **Screenshots:** capture 1–4 of the popup in action (PNG/JPG, 1280×800 or
  640×480). Open the popup on a real site and screenshot it.

## 4. Privacy / data
- **Does it collect personal data?** No.
- **Permissions justification:**
  - `storage` — saves per-page settings (interval, scroll position) locally.
  - `tabs` — reads the active tab's URL to know which page to configure and to reload it.
  - `host_permissions: <all_urls>` — required because the user can enable
    auto-refresh on any website they choose; the extension only acts on pages the
    user has explicitly configured.
- **Privacy policy:** not strictly required since nothing is collected, but if the
  form demands a URL, host a short page stating "All data is stored locally in the
  browser; nothing is transmitted or collected."

## 5. Submit
Click **Publish**. Review typically takes a few hours to a few business days.

## Re-packaging after changes
Bump `version` in `manifest.json`, then re-zip (PowerShell):

```powershell
Compress-Archive -Path manifest.json,background.js,icons,popup,src `
  -DestinationPath dist/auto-refresh-scroller-vX.Y.Z.zip -Force
```

Each store update must have a **higher** version number than the last.
