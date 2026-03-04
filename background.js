/* ── Toolbar icon click: toggle or inject the floating widget ── */
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab?.id) return;
  const url = tab.url || '';
  if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('about:')) return;

  try {
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'toggle-snap-tools' });
    if (response?.ok) return;
  } catch (_) { /* content script not loaded yet */ }

  try {
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
  } catch (e) {
    console.warn('Snap Tools: cannot inject on this page —', e.message);
  }
});

/* ── Message router ── */
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'capture-visible-tab') {
    chrome.tabs.captureVisibleTab(null, { format: 'png' })
      .then(dataUrl => sendResponse({ dataUrl }))
      .catch(e => sendResponse({ error: e.message }));
    return true;
  }

  if (msg.action === 'start-recording') {
    chrome.desktopCapture.chooseDesktopMedia(
      ['screen', 'window', 'tab'],
      sender.tab,
      (streamId) => {
        if (streamId) sendResponse({ streamId });
        else sendResponse({ error: 'User cancelled' });
      }
    );
    return true;
  }

  if (msg.action === 'stop-recording') {
    sendResponse({ ok: true });
  }
});
