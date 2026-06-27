/* Auto Refresh & Scroller — content script
 * Runs on every page. Reads per-page settings, restores the saved scroll
 * position, runs a countdown, and reloads the page when it reaches zero.
 * The countdown is shown only on the toolbar icon (no on-page overlay).
 */
(() => {
  "use strict";

  // Per-page key: identical pages (same path + query) share settings, but
  // different pages on the same site are tracked independently. The #hash is
  // ignored so it doesn't fragment a page into many entries.
  const KEY = location.origin + location.pathname + location.search;
  const LABEL = location.hostname + (location.pathname === "/" ? "" : location.pathname);
  const STORAGE_KEY = "sites";

  let config = null;          // settings for this page (or null)
  let remaining = 0;          // seconds left until refresh
  let tickHandle = null;      // setInterval handle
  let paused = false;

  /* ---------- storage helpers ---------- */

  function loadAll() {
    return new Promise((resolve) => {
      chrome.storage.local.get(STORAGE_KEY, (data) => {
        resolve((data && data[STORAGE_KEY]) || {});
      });
    });
  }

  async function saveConfig(partial) {
    const all = await loadAll();
    config = Object.assign({}, all[KEY], partial, { updatedAt: Date.now() });
    all[KEY] = config;
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEY]: all }, resolve);
    });
  }

  /* ---------- scroll restore ---------- */

  function restoreScroll() {
    if (!config || !config.autoScroll) return;
    const targetY = Number(config.scrollY) || 0;
    const targetX = Number(config.scrollX) || 0;
    if (targetY === 0 && targetX === 0) return;

    // Pages often grow/reflow after load, which can reset scroll. Re-apply the
    // target position repeatedly for a short window until it sticks.
    const deadline = Date.now() + 3000;
    const apply = () => {
      window.scrollTo(targetX, targetY);
      if (Date.now() < deadline && Math.abs(window.scrollY - targetY) > 2) {
        requestAnimationFrame(apply);
      }
    };
    // Give layout a beat, then start applying.
    setTimeout(apply, 60);
  }

  /* ---------- countdown ---------- */

  function clearTimer() {
    if (tickHandle) {
      clearInterval(tickHandle);
      tickHandle = null;
    }
  }

  function startTimer() {
    clearTimer();
    if (!config || !config.enabled) {
      updateBadge(null);
      return;
    }
    remaining = Math.max(1, Number(config.interval) || 60);
    paused = false;
    updateBadge(remaining);

    tickHandle = setInterval(() => {
      if (paused || (document.hidden && config.pauseWhenHidden)) {
        return;
      }
      remaining -= 1;
      if (remaining <= 0) {
        doRefresh();
        return;
      }
      updateBadge(remaining);
    }, 1000);
  }

  async function doRefresh() {
    clearTimer();
    // Capture the latest scroll position before reloading, if requested.
    if (config && config.autoScroll && config.trackOnRefresh) {
      await saveConfig({ scrollX: window.scrollX, scrollY: window.scrollY });
    }
    location.reload();
  }

  /* ---------- badge (toolbar icon) ---------- */

  function updateBadge(secs) {
    try {
      chrome.runtime.sendMessage({ type: "badge", remaining: secs, paused });
    } catch (_) { /* service worker may be asleep; ignore */ }
  }

  /* ---------- messaging from popup ---------- */

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (!msg || !msg.type) return;
    if (msg.type === "getStatus") {
      sendResponse({
        key: KEY,
        label: LABEL,
        config,
        remaining: config && config.enabled ? Math.max(0, remaining) : null,
        paused,
        currentScrollY: window.scrollY,
        currentScrollX: window.scrollX,
      });
      return true;
    }
    if (msg.type === "saveScroll") {
      saveConfig({
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        autoScroll: true,
      }).then(() => sendResponse({ ok: true, scrollY: window.scrollY }));
      return true;
    }
    if (msg.type === "refreshNow") {
      doRefresh();
      sendResponse({ ok: true });
      return true;
    }
    if (msg.type === "togglePause") {
      paused = !paused;
      updateBadge(remaining);
      sendResponse({ ok: true, paused });
      return true;
    }
  });

  // React live to settings changed from the popup.
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes[STORAGE_KEY]) return;
    const all = changes[STORAGE_KEY].newValue || {};
    config = all[KEY] || null;
    startTimer();
  });

  /* ---------- init ---------- */

  (async function init() {
    const all = await loadAll();
    config = all[KEY] || null;
    restoreScroll();
    startTimer();
  })();
})();
