/* Auto Refresh & Scroller — service worker
 * Draws the live countdown onto the toolbar icon badge for the tab that
 * sent the update, so you can see at a glance which tab is on a timer.
 */

function badgeText(secs) {
  if (secs == null) return "";
  if (secs >= 60) {
    const m = Math.round(secs / 60);
    return m + "m";
  }
  return String(secs);
}

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (!msg || msg.type !== "badge") return;
  const tabId = sender.tab && sender.tab.id;
  if (tabId == null) return;

  const text = msg.paused ? "❚❚" : badgeText(msg.remaining);
  const color = msg.paused ? "#b8860b" : (msg.remaining != null ? "#2563eb" : "#888");

  chrome.action.setBadgeText({ tabId, text });
  chrome.action.setBadgeBackgroundColor({ tabId, color });
});

// Clear the badge when a tab navigates away or closes (best-effort).
chrome.tabs.onRemoved.addListener(() => { /* per-tab badge is auto-dropped */ });
