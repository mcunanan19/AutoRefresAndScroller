# Auto Refresh & Scroller

A lightweight Chrome / Edge (Manifest V3) extension that auto-refreshes pages on a
**per-page** interval and restores your **saved scroll position** after each reload —
with a live countdown shown on the toolbar icon.

## Features

- ⏱ **Per-page auto refresh** — every page (URL) has its own interval and timer
  (15s, 30s, 60s, 5m, 10m, or custom).
- 📌 **Per-page scroll restore** — each page remembers its own saved position and jumps
  back to it after every refresh.
- 🔁 **Track scroll** — optionally re-capture your current scroll right before each refresh
  (handy for feeds/dashboards that grow).
- 🧭 **Knows the page** — settings are keyed by full URL (path + query); the `#hash` is ignored.
- ⏳ **Toolbar countdown** — the seconds/minutes remaining are drawn on the extension icon,
  so nothing covers the page.
- ⏸ **Controls** — refresh now and remove-page from the popup; pause while the tab is hidden.
- 🌙 Clean dark popup UI; settings auto-save.

## Install (Developer / unpacked)

Works identically in **Google Chrome** and **Microsoft Edge**.

1. Open the extensions page:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
2. Turn on **Developer mode** (toggle, top-right in Chrome / left sidebar in Edge).
3. Click **Load unpacked** and select this folder
   (`AutoRefresAndScroller`, the one containing `manifest.json`).
4. Pin the extension and open any site to configure it.

## Usage

1. Navigate to a site you want to auto-refresh.
2. Click the toolbar icon to open the popup.
3. Toggle **Auto-refresh this site** and pick an interval (or a quick preset).
4. Scroll to the position you want, then click **Save current scroll position**
   and enable **Restore scroll position**.
5. The countdown appears on the toolbar icon badge. When it hits zero the page reloads
   and jumps back to your saved spot.

Use **Refresh now** in the popup to reload immediately, or **Remove page** to clear that
page's settings.

## How settings are stored

All config lives in `chrome.storage.local` under the key `sites`, keyed by the full
page URL (origin + path + query):

```json
{
  "sites": {
    "https://example.com/dashboard": {
      "enabled": true,
      "interval": 60,
      "autoScroll": true,
      "trackOnRefresh": false,
      "scrollX": 0,
      "scrollY": 1240,
      "pauseWhenHidden": false
    },
    "https://example.com/reports": {
      "enabled": true,
      "interval": 300,
      "autoScroll": false
    }
  }
}
```

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | MV3 manifest |
| `src/content.js` | Per-page timer, scroll restore, sends countdown to the icon badge |
| `src/content.css` | Badge styling |
| `background.js` | Draws the countdown onto the toolbar icon badge |
| `popup/` | Popup UI (settings + live countdown + site list) |
| `icons/` | Toolbar icons |

## Notes

- The interval timer starts on each page load, so the countdown reflects time until the
  next reload from when the page last loaded.
- The extension can't run on restricted pages (e.g. `chrome://`, the web store), so
  configuration is disabled there.
