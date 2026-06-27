# Store Privacy & Permissions Details

Use these answers for the **Chrome Web Store** and **Microsoft Edge Add-ons** store submission forms.

---

## 1. Single Purpose Description
*(Required by Chrome Web Store)*

**Auto-refresh web pages automatically on a schedule you set, and restore your saved scroll position after each reload.**

---

## 2. Privacy Policy URL
*(Optional for Edge, required for Chrome if you store personal data)*

Since this extension stores **only local settings** (no personal data, no cloud sync), you have two options:

**Option A (Recommended):** Create a simple privacy policy on GitHub Pages or your website:

```markdown
# Privacy Policy — Auto Refresh & Scroller

**Data Collection:** This extension collects no data. All settings are stored 
locally in your browser using `chrome.storage.local`.

**What is stored locally:**
- Per-page auto-refresh intervals (seconds)
- Per-page scroll positions (pixel coordinates)
- Whether each page has auto-refresh enabled or disabled

**Data sharing:** None. Your settings never leave your browser.

**Data retention:** Settings persist until you clear browser storage or 
uninstall the extension.

**Third parties:** This extension does not communicate with any external 
servers or third parties.

**Changes to this policy:** Updates will be reflected in the extension 
store listing.
```

Host this on GitHub Pages (free) or your own domain.

**Option B:** If the store allows, you can skip the URL and state in the 
"Data Usage" field: "All data is stored locally; see permissions justification below."

---

## 3. Permissions Justification
*(Required by both stores)*

Copy this for your submission form:

### Permission: `storage`
- **Why needed:** To save your per-page settings (auto-refresh interval, saved scroll position, enabled/disabled state) locally in your browser.
- **Data collected:** Only what you explicitly configure in the popup (intervals in seconds, pixel coordinates of scroll positions).
- **How used:** Settings are read on each page load to apply your preferences.
- **Shared with third parties:** No. All data stays in your browser.

### Permission: `tabs`
- **Why needed:** To read the active tab's URL so the extension knows which page to configure and to reload it when the countdown reaches zero.
- **Data collected:** The URL of the page you're on (used to create a storage key).
- **How used:** The URL is used as a unique identifier to match settings to pages. The extension reloads the current tab when you click "Refresh now" or when the timer expires.
- **Shared with third parties:** No. URLs are stored only as local storage keys.

### Permission: `host_permissions: <all_urls>`
- **Why needed:** The user can enable auto-refresh on any website they choose. This permission is required because we don't know in advance which sites the user will configure.
- **Data collected:** None—the extension only injects a content script on pages the user has explicitly enabled auto-refresh for.
- **How used:** The content script reads the saved settings for that page, starts a countdown, and reloads the page when the timer expires.
- **Shared with third parties:** No. The extension never sends page URLs, settings, or any data to external servers.

---

## 4. Data Handling Certification Statements
*(Required by both stores)*

Use these checkbox statements (customize the X's based on your answers):

### Chrome Web Store Certification

- ☑ **I acknowledge that I must provide an accurate and complete Privacy Policy**
- ☑ **I certify that this extension does not collect, request, or transmit users' personal information except as necessary to provide and improve the service**
- ☑ **I will notify users of any changes to the Privacy Policy**
- ☑ **All data is stored locally in the browser; no data is transmitted to external servers**

### Microsoft Edge Add-ons Certification

- ☑ **I confirm that this extension complies with Microsoft Edge Add-ons policies**
- ☑ **I confirm that this extension does not collect, use, or transmit personal information**
- ☑ **I confirm that all data usage is disclosed to users**
- ☑ **I comply with all applicable laws and regulations**

---

## 5. Additional Store Fields

### Category
- **Productivity** (both stores)

### Developer / Author Name
- Use your name or company name as registered with the store

### Support Email
- Your email address (e.g., mcunanan19@gmail.com)

### Website / Support URL
- Optional; you can link to a GitHub repo or your personal site
- **Suggested:** https://github.com/[your-username]/AutoRefresAndScroller

### Support Email / Contact
- The email address support requests should go to

---

## 6. Deceptive Practices Attestation

**For both stores, you'll see a question like:**

> "Does your extension engage in deceptive practices? Does it impersonate another product or service? Does it trick users into installing it?"

**Answer:** ☑ **No** — the extension is straightforward, does exactly what it claims, and asks for permission before running on any page.

---

## 7. Restricted Content Warning

**Questions like:** "Does your extension contain or distribute adult content, malware, or illegal content?"

**Answer:** ☑ **No**

---

## Quick Copy-Paste Blocks

### For "Why does your extension need these permissions?" (short form)

```
storage — saves your per-page refresh intervals and scroll positions locally.
tabs — reads the current page URL to know which settings to apply.
host_permissions — required to run on any site you enable auto-refresh for.
```

### For "Does your extension collect personal data?"

```
No. The extension stores only local settings (refresh intervals and scroll 
positions) in your browser. Nothing is transmitted to external servers.
```

### For "Privacy Policy URL" (if required)

```
https://github.com/[your-username]/AutoRefresAndScroller/blob/main/PRIVACY.md
```
(You'll create this file in your GitHub repo.)

---

## Next Steps

1. **Create a GitHub repo** and push your extension code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Auto Refresh & Scroller v1.0.0"
   git remote add origin https://github.com/[your-username]/AutoRefresAndScroller.git
   git push -u origin main
   ```

2. **Create `PRIVACY.md`** in the repo root (copy the privacy policy from Option A above).

3. **Fill the store forms:**
   - **Chrome Web Store:** https://chrome.google.com/webstore/devconsole
   - **Microsoft Edge Add-ons:** https://partner.microsoft.com/dashboard/microsoftedge

4. **Paste the sections above** into the respective form fields.
