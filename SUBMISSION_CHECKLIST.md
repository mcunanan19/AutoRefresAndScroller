# Store Submission Checklist

Complete checklist for submitting **Auto Refresh & Scroller** to both **Chrome Web Store** and **Microsoft Edge Add-ons**.

---

## Pre-Submission (Do These First)

### 1. Set Up GitHub Repository _(optional but recommended)_
- [ ] Create a public GitHub repo: https://github.com/new
  - Name: `AutoRefresAndScroller`
  - Description: `Auto-refresh pages per-page with scroll position restore`
  - Public (so stores can verify your code)
- [ ] Push the code:
  ```bash
  cd c:\Users\MarvinCunanan\Documents\Codes\AutoRefresAndScroller
  git init
  git add .
  git commit -m "Initial commit: Auto Refresh & Scroller v1.0.0"
  git remote add origin https://github.com/YOUR_USERNAME/AutoRefresAndScroller.git
  git branch -M main
  git push -u origin main
  ```
- [ ] Copy the privacy policy URL for your store forms:
  ```
  https://github.com/YOUR_USERNAME/AutoRefresAndScroller/blob/main/PRIVACY.md
  ```

### 2. Take Store Screenshots
- [ ] Open Chrome/Edge
- [ ] Install the unpacked extension (see README.md)
- [ ] Open any website (e.g., Google, Wikipedia)
- [ ] Click the extension icon to open the popup
- [ ] Take 2–4 screenshots:
  - Screenshot 1: Popup with settings visible (1280×800 or 640×480)
  - Screenshot 2: Popup showing "Configured pages" list
  - Screenshot 3: Popup with a configured interval and scroll position saved
  - Save as PNG/JPG, 1280×800 or 640×480

---

## Chrome Web Store Submission

### 3. Register as a Chrome Developer
- [ ] Go to https://chrome.google.com/webstore/devconsole
- [ ] Sign in with your Google account
- [ ] Pay the **one-time $5 developer registration fee** (if this is your first submission)

### 4. Create a New App Item
- [ ] Click **Create an item** (or **New item**)
- [ ] Upload `dist/auto-refresh-scroller-v1.0.0.zip`
- [ ] Wait for the file to process (takes ~1 min)

### 5. Fill in Store Details

#### Listing Tab
- [ ] **Name:** `Auto Refresh & Scroller`
- [ ] **Short description:** 
  ```
  Auto-refresh any page on a schedule you set, 
  and restore your saved scroll position.
  ```
- [ ] **Detailed description:**
  ```
  Auto Refresh & Scroller reloads pages automatically 
  on a per-page interval and restores your scroll position 
  after each reload — with a live countdown on the toolbar icon.
  
  • Per-page intervals — each URL keeps its own timer 
    (15s, 30s, 1m, 5m, 10m, or custom)
  • Per-page scroll restore — save a position and jump back 
    to it after each reload
  • "Track scroll" option re-captures your scroll before 
    each refresh (great for feeds/dashboards)
  • Live countdown on toolbar icon — nothing covers the page
  • Pause while a tab is hidden, refresh now, or remove a 
    page's settings
  • All data stored locally in your browser. Nothing is 
    collected or shared.
  ```
- [ ] **Category:** `Productivity`
- [ ] **Language:** `English`

#### Graphics Tab
- [ ] **Icon (128×128):** Upload `icons/icon128.png`
- [ ] **Promotional large tile (920×680):** Use `store-assets/store-logo-300.png` 
  (stores will upscale if needed, or request you resize)
- [ ] **Screenshot 1–4:** Upload your 2–4 screenshots from step 2

#### Privacy Tab
- [ ] **Privacy policy URL:**
  ```
  https://github.com/YOUR_USERNAME/AutoRefresAndScroller/blob/main/PRIVACY.md
  ```
- [ ] **Does your extension require elevated permissions? → Yes**
  - Justify permissions (copy from `STORE_PRIVACY_DETAILS.md`, section 3):
    ```
    storage — saves your per-page refresh intervals 
    and scroll positions locally.
    
    tabs — reads the current page URL to know which 
    settings to apply.
    
    host_permissions — required to run on any site 
    you enable auto-refresh for.
    ```

#### Additional Settings Tab
- [ ] **Homepage URL** (optional): 
  ```
  https://github.com/YOUR_USERNAME/AutoRefresAndScroller
  ```
- [ ] **Support URL**: 
  ```
  https://github.com/YOUR_USERNAME/AutoRefresAndScroller/issues
  ```

### 6. Answer Compliance Questions
- [ ] "Does your extension collect personal information?" → **No**
- [ ] "Does your extension request broad permissions?" → **Yes** (explain in privacy section above)
- [ ] "Does your extension engage in deceptive practices?" → **No**
- [ ] "Does your extension comply with Chrome Web Store policies?" → **Yes**

### 7. Submit
- [ ] Click **Publish** or **Submit for review**
- [ ] Accept the Developer Agreement
- [ ] **Review time:** 1 hour to 3 days

---

## Microsoft Edge Add-ons Submission

### 8. Register as an Edge Developer
- [ ] Go to https://partner.microsoft.com/dashboard/microsoftedge/overview
- [ ] Sign in with your Microsoft account
- [ ] Complete developer registration (free, no fee for Edge)

### 9. Create a New Submission
- [ ] Click **Create new extension**
- [ ] Upload `dist/auto-refresh-scroller-v1.0.0.zip`

### 10. Fill in Store Details

#### Product Details Tab
- [ ] **Product name:** `Auto Refresh & Scroller`
- [ ] **Short description:**
  ```
  Auto-refresh any page on a schedule you set, 
  and restore your saved scroll position.
  ```
- [ ] **Long description:**
  ```
  Auto Refresh & Scroller reloads pages automatically 
  on a per-page interval and restores your scroll position 
  after each reload — with a live countdown on the toolbar icon.
  
  • Per-page intervals — each URL keeps its own timer 
    (15s, 30s, 1m, 5m, 10m, or custom)
  • Per-page scroll restore — save a position and jump back 
    to it after each reload
  • "Track scroll" option re-captures your scroll before 
    each refresh (great for feeds/dashboards)
  • Live countdown on toolbar icon — nothing covers the page
  • Pause while a tab is hidden, refresh now, or remove a 
    page's settings
  • All data stored locally in your browser. Nothing is 
    collected or shared.
  ```
- [ ] **Primary category:** `Productivity`
- [ ] **Logo:** Upload `store-assets/store-logo-300.png`

#### Screenshots Tab
- [ ] Upload your 2–4 screenshots from step 2

#### Availability Tab
- [ ] **Availability:** Select your target markets (at least USA/Canada/UK recommended)

#### Properties Tab
- [ ] **Author name:** Your name
- [ ] **Support email:** Your email
- [ ] **Support website:** 
  ```
  https://github.com/YOUR_USERNAME/AutoRefresAndScroller
  ```
- [ ] **Privacy policy URL:**
  ```
  https://github.com/YOUR_USERNAME/AutoRefresAndScroller/blob/main/PRIVACY.md
  ```

#### Privacy & Security Tab
- [ ] "Does your extension collect users' personal data?" → **No**
- [ ] "Does your extension comply with Microsoft Edge Add-ons policies?" → **Yes**
- [ ] "Certify that..." → Check the compliance box

#### Notes for Reviewers (Optional)
```
This extension stores all settings (refresh intervals and scroll positions) 
locally in the browser. No data is transmitted or shared. See PRIVACY.md for details.
```

### 11. Submit
- [ ] Click **Submit**
- [ ] Agree to the Edge Add-ons Agreement
- [ ] **Review time:** 2 hours to 3 days

---

## After Submission

- [ ] Check email for review status updates
- [ ] **If rejected:** Fix the issues and resubmit (you'll get detailed feedback)
- [ ] **If approved:** Extension goes live within hours
- [ ] Update your GitHub repo with a release tag:
  ```bash
  git tag v1.0.0
  git push origin v1.0.0
  ```

---

## Future Updates

For version bumps (v1.0.1, v1.1.0, etc.):
1. Edit `manifest.json` → bump `version`
2. Repackage: 
   ```powershell
   Compress-Archive -Path manifest.json,background.js,icons,popup,src `
     -DestinationPath dist/auto-refresh-scroller-vX.Y.Z.zip -Force
   ```
3. Upload the new `.zip` to both stores (follow steps 4–7 or 9–11)
4. Tag in GitHub: `git tag vX.Y.Z && git push origin vX.Y.Z`

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Manifest error" | Check `manifest.json` syntax (use `node -e "JSON.parse(require('fs').readFileSync('manifest.json'))"`) |
| "Logo too small" | Use 300×300 minimum (300×300 works; 128×128 is for the extension icon, not store logo) |
| "Permissions not justified" | Copy section 3 from `STORE_PRIVACY_DETAILS.md` into the Privacy section |
| "Rejected for broad permissions" | Clarify that `<all_urls>` is needed because users can enable the extension on any site they choose |
| "Screenshots unclear" | Make sure the popup is clearly visible and large (zoom in 125–150% before screenshotting) |

---

## Files You'll Use

| File | Purpose |
|------|---------|
| `dist/auto-refresh-scroller-v1.0.0.zip` | Main upload for both stores |
| `store-assets/store-logo-300.png` | Store logo (required) |
| `PRIVACY.md` | Privacy policy (link in store forms) |
| `STORE_PRIVACY_DETAILS.md` | Permissions & certification copy-paste |
| `icons/icon128.png` | Chrome Web Store icon upload |
| Screenshots (PNG/JPG) | Your captured popups (2–4 images) |

