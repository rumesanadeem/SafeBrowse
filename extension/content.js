// Listen for all clicks on <a>
document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a || !a.href) return;
    // Send the URL to the background worker
    chrome.runtime.sendMessage({ type: 'CHECK_URL', url: a.href });
    // Optionally cancel the default navigation; background will reopen if safe
    e.preventDefault();
  });
  