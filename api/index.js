// blocklist-service/index.js
const express = require('express');
const app     = express();
const port    = process.env.PORT || 3000;

// Replace these with real entries or load from a DB/file
const blocklist = [
  "http://testsafebrowsing.appspot.com/s/malware.html",
  "http://malicious.example.com/",
  // …add more URLs or patterns…
];

app.get('/blocklist', (req, res) => {
  res.json({
    updated: new Date().toISOString(),
    entries: blocklist
  });
});

app.listen(port, () => {
  console.log(`🗄️  Blocklist service running on port ${port}`);
});
