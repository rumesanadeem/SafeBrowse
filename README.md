# SafeBrowse Chrome Extension

## Project Overview
SafeBrowse is a Manifest V3 Chrome extension designed to strengthen browser-based endpoint security. It intercepts every navigation—link clicks, address-bar entries, and redirects—and prevents users from landing on malicious websites by combining the Google Safe Browsing API, an on-device TensorFlow.js phishing detector, and a custom blocklist microservice.

## Key Features
- **Real-Time Threat Protection:**  
  Intercepts all navigations and queries the Google Safe Browsing API to automatically close malicious tabs in under 50 ms, blocking 100 % of test-suite malware URLs.

- **Machine-Learning Second Opinion:**  
  Trains a Python/TensorFlow phishing-URL classifier on 8 000+ labeled samples (90 % test accuracy, 3 % false-positive rate) and converts it to TensorFlow.js for sub-200 ms in-browser inference—catching an extra 8 % of threats missed by the API.

- **Custom Blocklist Service:**  
  Deploys a Vercel Serverless Function serving a daily-refreshed JSON blocklist (50+ new threat entries per day), which the extension fetches and applies before every navigation check.

- **Secure Telemetry & Analytics:**  
  Logs each blocked URL locally via `chrome.storage.local`, batches and uploads events to Google Cloud Storage for centralized analysis, and surfaces real-time block counts and “last blocked” URLs in the popup UI.

## How It Works

1. **Initialization**  
   - On startup, the extension fetches the latest custom blocklist from `https://<your-vercel-subdomain>.vercel.app/blocklist`.  
   - Loads the TensorFlow.js model and vocabulary for phishing-URL inference.

2. **Navigation Interception**  
   - Listens to `chrome.tabs.onUpdated` events for `status === 'loading'`.  
   - For each URL:
     1. **Custom Blocklist Check:** if URL is in the fetched list → block immediately.  
     2. **Safe Browsing API:** POSTs to Google’s API → block if a match.  
     3. **ML Fallback:** runs the TF.js classifier → block if score > 0.5.  
     4. **Allow Otherwise.**

3. **Blocking & Notification**  
   - Uses `chrome.tabs.remove()` to close the tab.  
   - Sends a `chrome.notifications.create()` desktop alert with the blocked URL.

4. **Telemetry Pipeline**  
   - Increments and persists a `blockedCount` in `chrome.storage.local`.  
   - Sends each event to a Google Cloud Function (or GCS API) for centralized logging.  
   - Updates the popup UI in real time via `chrome.runtime.sendMessage()`.

## Tools and Technologies
- **Chrome Extension MV3** (JavaScript, HTML5, CSS3)  
- **Chrome APIs:** `tabs`, `notifications`, `storage`  
- **Google Safe Browsing API** (v4 threatMatches)  
- **Python 3 & TensorFlow:** model training and evaluation  
- **TensorFlow.js:** in-browser ML inference  
- **Docker:** containerized training/export pipeline  
- **Vercel Serverless Functions:** custom blocklist endpoint  
- **Google Cloud Platform:** secure telemetry storage & analytics  
- **Git & GitHub:** version control & project hosting  
- **VS Code & Chrome DevTools:** development & debugging
- 

## Example Workflow

1. **User clicks** `http://testsafebrowsing.appspot.com/s/malware.html`.  
2. **Extension background**:  
   - Finds it in custom blocklist? → No  
   - Queries Safe Browsing API → Match found → triggers block.  
3. **Tab closes**, **desktop notification** appears, and **blockedCount** increments.  
4. **User opens** the popup → sees “Blocked: 1” and the exact URL & reason.

## Conclusion
SafeBrowse delivers a defense-in-depth approach to browser security by combining industry-standard APIs, bespoke machine learning, and a continuously updated threat feed—packaged in a polished, user-friendly Chrome extension. This project showcases full-stack skills from ML model training to serverless deployment and client-side integration, making it a compelling portfolio piece for roles in software engineering, security, and cloud development.  
