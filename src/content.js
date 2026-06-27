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

  // The scroll target we still owe the page, if any. Re-applied on
  // visibilitychange because the auto-refresh typically fires while the tab
  // is in the background, where requestAnimationFrame-based polling never
  // runs at all (the browser doesn't repaint hidden tabs).
  let pendingScroll = null;

  // Resolves once the page has fully finished loading (all resources —
  // images, stylesheets, iframes — not just the DOM). Scrolling before this
  // can be clamped to a too-small page height and silently fail.
  function whenFullyLoaded() {
    return new Promise((resolve) => {
      if (document.readyState === "complete") {
        resolve();
      } else {
        window.addEventListener("load", () => resolve(), { once: true });
      }
    });
  }

  // Resolves once the document height stops growing for `quietMs`, or
  // `maxWaitMs` elapses — whichever comes first. Catches layout caused by
  // late images/fonts/lazy content that finishes after the `load` event.
  // Uses setTimeout (not requestAnimationFrame) so it still progresses when
  // the tab is backgrounded — rAF callbacks are suspended entirely then.
  function whenHeightSettles(quietMs = 400, maxWaitMs = 4000) {
    return new Promise((resolve) => {
      const start = Date.now();
      let lastHeight = document.documentElement.scrollHeight;
      let lastChange = Date.now();
      const check = () => {
        const h = document.documentElement.scrollHeight;
        const now = Date.now();
        if (h !== lastHeight) {
          lastHeight = h;
          lastChange = now;
        }
        if (now - lastChange >= quietMs || now - start >= maxWaitMs) {
          resolve();
          return;
        }
        setTimeout(check, 100);
      };
      setTimeout(check, 100);
    });
  }

  async function restoreScroll() {
    if (!config || !config.autoScroll) return;
    const targetY = Number(config.scrollY) || 0;
    const targetX = Number(config.scrollX) || 0;
    if (targetY === 0 && targetX === 0) return;

    pendingScroll = { x: targetX, y: targetY };

    await whenFullyLoaded();
    await whenHeightSettles();

    // Pages can still reflow a little after this (web fonts swapping in,
    // late images). Re-apply the target position for a short window until
    // it sticks, so the final position wins. setTimeout (not rAF) keeps this
    // running even while the tab is hidden.
    const deadline = Date.now() + 3000;
    const apply = () => {
      window.scrollTo(targetX, targetY);
      if (Math.abs(window.scrollY - targetY) <= 2) {
        pendingScroll = null;
        return;
      }
      if (Date.now() < deadline) {
        setTimeout(apply, 100);
      }
    };
    apply();
  }

  // Safety net: if the tab was hidden while we were trying to restore (rAF
  // and even some timers can stall on a backgrounded tab), re-apply as soon
  // as it becomes visible again.
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && pendingScroll) {
      window.scrollTo(pendingScroll.x, pendingScroll.y);
    }
  });

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
    // Start the countdown immediately — it doesn't depend on page load —
    // but let scroll restoration wait for the page to fully settle.
    startTimer();
    restoreScroll();
  })();
})();
