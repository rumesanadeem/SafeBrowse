// Replace with your real API key later
const SAFE_BROWSING_KEY = 'AIzaSyDDICQ14b9GBbJPwFBzWE4o0liRdulAkIw';  

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Only fire when a navigation is starting
    if (changeInfo.status !== 'loading' || !tab.url.startsWith('http')) return;
    console.log('[Background] Tab loading, checking URL:', tab.url);
    checkAndMaybeBlock(tabId, tab.url);
  });
  
  async function checkAndMaybeBlock(tabId, url) {
    // 1) Query Safe Browsing
    const apiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${SAFE_BROWSING_KEY}`;
    const body = {
      client: { clientId: "safe-browse-ext", clientVersion: "0.1.0" },
      threatInfo: {
        threatTypes: ["MALWARE","SOCIAL_ENGINEERING","UNWANTED_SOFTWARE"],
        platformTypes: ["ANY_PLATFORM"],
        threatEntryTypes: ["URL"],
        threatEntries: [{ url }]
      }
    };
  
    let data;
    try {
      const res  = await fetch(apiUrl, { method: 'POST', body: JSON.stringify(body) });
      data = await res.json();
      console.log('[Background] Safe Browsing response:', data);
    } catch (err) {
      console.error('[Background] API error:', err);
      return; // on error, just let it load
    }
  
    // 2) If malicious, block and notify
    if (data.matches?.length) {
      console.log('[Background] MALICIOUS! blocking tab:', tabId);
  
      // a) Kill the tab
      chrome.tabs.remove(tabId);
  
      // b) Desktop notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon48.png',
        title: 'SafeBrowse',
        message: `Blocked malicious URL:\n${url}`
      });
  
      // c) Persist & increment the block counter
      chrome.storage.local.get({ blockedCount: 0 }, ({ blockedCount }) => {
        const newCount = blockedCount + 1;
        chrome.storage.local.set({ blockedCount: newCount }, () => {
          console.log('[Background] New blockedCount:', newCount);
          // d) Tell the popup (if it’s open right now)
          chrome.runtime.sendMessage({
            type: 'BLOCKED',
            url,
            newCount
          });
        });
      });
    }
  }