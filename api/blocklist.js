// api/blocklist.js
export default function handler(req, res) {
    res.status(200).json({
      updated: new Date().toISOString(),
      entries: [
        "http://testsafebrowsing.appspot.com/s/malware.html",
        "http://malicious.example.com/"
        // …your custom URLs…
      ]
    });
  }
  