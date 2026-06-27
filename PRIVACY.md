# Privacy Policy — Auto Refresh & Scroller

**Last updated:** June 27, 2026

## Overview

Auto Refresh & Scroller is a browser extension that automatically reloads web pages on a schedule you set and restores your saved scroll position. **We collect no data.** All settings are stored entirely on your device.

## What Data We Collect

**None.** This extension does not collect, transmit, or store any personal information on remote servers.

## What Data is Stored Locally

The extension stores only the following on your device (in `chrome.storage.local`):

- **Auto-refresh intervals** — the number of seconds between reloads for each page you configure (e.g., 60 seconds, 300 seconds, etc.)
- **Saved scroll positions** — the pixel coordinates (X, Y) of where you scrolled to on each page
- **Per-page settings** — whether auto-refresh is enabled or disabled for each page URL
- **Preferences** — whether to pause auto-refresh when the tab is in the background

All data is keyed by the full page URL (`origin + path + query`). The `#hash` is ignored.

## How Data is Used

Your settings are read from local storage each time you visit a configured page. The extension uses them to:

1. Start a countdown timer matching your interval
2. Reload the page when the timer reaches zero
3. Restore your scroll position after the page reloads

## Data Sharing

**Your data is never shared.** The extension does not communicate with any external servers, analytics services, advertising networks, or third parties.

## Data Retention

Settings persist on your device until you:
- Manually remove a page's settings (via the "Remove page" button in the popup)
- Clear your browser's storage / cache
- Uninstall the extension

## Permissions We Request

### `storage`
Saves your local settings (intervals, scroll positions, preferences) so they persist across browser sessions.

### `tabs`
Reads the active tab's URL to know which page you're on and to reload it when you click "Refresh now" or the timer expires.

### `host_permissions: <all_urls>`
Allows the extension to run on any website you choose to enable auto-refresh for. The extension only injects its script on pages you have explicitly configured.

## No Tracking, No Ads

- We do not track your browsing
- We do not display ads
- We do not use analytics or telemetry
- We do not build profiles of your activity

## Changes to This Policy

If this extension is updated in the future and the privacy practices change, this policy will be updated and the version in the browser extension store will reflect the latest version. Your use of the extension after a change indicates your acceptance of the new terms.

## Questions?

If you have questions about this privacy policy or the extension's data handling, you can:
- Check the source code: https://github.com/mcunanan19/AutoRefresAndScroller
- Open an issue on GitHub with your question

---

**Your data is yours, and it stays on your device. That's our commitment.**
