/* Auto Refresh & Scroller — popup */
"use strict";

const STORAGE_KEY = "sites";

const DEFAULTS = {
  enabled: false,
  interval: 60,
  autoScroll: false,
  trackOnRefresh: false,
  pauseWhenHidden: false,
  scrollX: 0,
  scrollY: null,
};

const $ = (id) => document.getElementById(id);

let currentTab = null;
let pageKey = null;      // full page URL (origin + path + query), used as storage key
let contentAvailable = false;
let pollHandle = null;

// Build the per-page key from a URL (drops the #hash so it matches content.js).
function keyFromUrl(url) {
  const u = new URL(url);
  return u.origin + u.pathname + u.search;
}

// Friendly short label for display (hostname + path).
function labelFor(key) {
  try {
    const u = new URL(key);
    const path = u.pathname === "/" ? "" : u.pathname;
    return u.hostname + path + u.search;
  } catch (_) {
    return key;
  }
}

/* ---------- storage ---------- */

function getSites() {
  return new Promise((res) =>
    chrome.storage.local.get(STORAGE_KEY, (d) => res((d && d[STORAGE_KEY]) || {}))
  );
}
function setSites(sites) {
  return new Promise((res) => chrome.storage.local.set({ [STORAGE_KEY]: sites }, res));
}

async function getConfig() {
  const sites = await getSites();
  return Object.assign({}, DEFAULTS, sites[pageKey] || {});
}

async function patchConfig(partial) {
  if (!pageKey) return;
  const sites = await getSites();
  sites[pageKey] = Object.assign({}, DEFAULTS, sites[pageKey], partial, { updatedAt: Date.now() });
  await setSites(sites);
}

async function removeSite(h) {
  const sites = await getSites();
  delete sites[h];
  await setSites(sites);
}

/* ---------- messaging ---------- */

function sendToTab(type) {
  return new Promise((resolve) => {
    if (!currentTab) return resolve(null);
    chrome.tabs.sendMessage(currentTab.id, { type }, (resp) => {
      if (chrome.runtime.lastError) return resolve(null);
      resolve(resp);
    });
  });
}

/* ---------- rendering ---------- */

function fmt(secs) {
  if (secs == null) return "—";
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function fillForm(cfg) {
  $("enabled").checked = !!cfg.enabled;
  // interval shown in the most natural unit
  if (cfg.interval % 60 === 0 && cfg.interval >= 60) {
    $("unit").value = "60";
    $("interval").value = cfg.interval / 60;
  } else {
    $("unit").value = "1";
    $("interval").value = cfg.interval;
  }
  $("autoScroll").checked = !!cfg.autoScroll;
  $("trackOnRefresh").checked = !!cfg.trackOnRefresh;
  $("pauseWhenHidden").checked = !!cfg.pauseWhenHidden;
  $("savedPos").textContent =
    cfg.scrollY == null ? "none" : `${Math.round(cfg.scrollX || 0)}, ${Math.round(cfg.scrollY)} px`;
}

function readInterval() {
  const n = Math.max(1, parseInt($("interval").value, 10) || 1);
  const unit = parseInt($("unit").value, 10) || 1;
  return n * unit;
}

async function renderSiteList() {
  const sites = await getSites();
  const keys = Object.keys(sites).sort();
  $("siteCount").textContent = keys.length;
  const ul = $("siteList");
  ul.innerHTML = "";
  for (const h of keys) {
    const c = sites[h];
    const li = document.createElement("li");
    if (h === pageKey) li.classList.add("active");
    const meta = c.enabled ? `${fmt(c.interval)}` : "off";
    const display = labelFor(h);
    li.innerHTML = `
      <span class="s-host" title="${h}">${display}</span>
      <span class="s-meta">${meta}</span>
      <span class="s-go" data-key="${encodeURIComponent(h)}" title="Remove">✕</span>`;
    li.querySelector(".s-go").addEventListener("click", async (e) => {
      e.stopPropagation();
      const k = decodeURIComponent(e.target.dataset.key);
      await removeSite(k);
      await renderSiteList();
      if (k === pageKey) refresh();
    });
    ul.appendChild(li);
  }
}

/* ---------- live countdown ---------- */

async function pollStatus() {
  const status = await sendToTab("getStatus");
  if (!status) {
    $("cdTime").textContent = "—";
    $("cdState").textContent = contentAvailable ? "" : "Not active on this page";
    return;
  }
  const cfg = Object.assign({}, DEFAULTS, status.config || {});
  if (!cfg.enabled) {
    $("cdTime").textContent = "—";
    $("cdState").textContent = "Auto-refresh is off";
  } else if (status.paused) {
    $("cdTime").textContent = fmt(status.remaining);
    $("cdState").textContent = "Paused";
  } else {
    $("cdTime").textContent = fmt(status.remaining);
    $("cdState").textContent = `every ${fmt(cfg.interval)}`;
  }
}

/* ---------- init / refresh ---------- */

async function refresh() {
  const cfg = await getConfig();
  fillForm(cfg);
  await renderSiteList();
  await pollStatus();
}

function bindAutosave() {
  const save = async () => {
    await patchConfig({
      enabled: $("enabled").checked,
      interval: readInterval(),
      autoScroll: $("autoScroll").checked,
      trackOnRefresh: $("trackOnRefresh").checked,
      pauseWhenHidden: $("pauseWhenHidden").checked,
    });
    await renderSiteList();
    setTimeout(pollStatus, 80);
  };

  ["enabled", "autoScroll", "trackOnRefresh", "pauseWhenHidden", "unit"].forEach(
    (id) => $(id).addEventListener("change", save)
  );
  $("interval").addEventListener("input", save);

  $("quick").addEventListener("click", (e) => {
    const secs = e.target?.dataset?.secs;
    if (!secs) return;
    const s = parseInt(secs, 10);
    if (s % 60 === 0) { $("unit").value = "60"; $("interval").value = s / 60; }
    else { $("unit").value = "1"; $("interval").value = s; }
    $("enabled").checked = true;
    save();
  });

  $("saveScroll").addEventListener("click", async () => {
    const resp = await sendToTab("saveScroll");
    if (resp && resp.ok) {
      $("autoScroll").checked = true;
      await refresh();
      $("cdState").textContent = `Saved scroll at ${Math.round(resp.scrollY)} px`;
    } else {
      $("cdState").textContent = "Can't read scroll on this page";
    }
  });

  $("refreshNow").addEventListener("click", async () => {
    const resp = await sendToTab("refreshNow");
    if (!resp) {
      // Fallback: reload via tabs API for pages without the content script.
      if (currentTab) chrome.tabs.reload(currentTab.id);
    }
    setTimeout(() => window.close(), 150);
  });

  $("clearSite").addEventListener("click", async () => {
    if (!pageKey) return;
    await removeSite(pageKey);
    await refresh();
  });
}

(async function init() {
  const [tab] = await new Promise((res) =>
    chrome.tabs.query({ active: true, currentWindow: true }, res)
  );
  currentTab = tab;
  try {
    pageKey = tab && tab.url ? keyFromUrl(tab.url) : null;
  } catch (_) {
    pageKey = null;
  }
  $("site").textContent = pageKey ? labelFor(pageKey) : "This page can’t be configured";

  if (!pageKey) {
    document.querySelectorAll("input,button,select").forEach((el) => (el.disabled = true));
    return;
  }

  const status = await sendToTab("getStatus");
  contentAvailable = !!status;

  bindAutosave();
  await refresh();

  pollHandle = setInterval(pollStatus, 1000);
  window.addEventListener("unload", () => clearInterval(pollHandle));
})();
