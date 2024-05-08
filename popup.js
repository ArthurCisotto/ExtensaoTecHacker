document.addEventListener('DOMContentLoaded', function() {
    browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
        const currentTab = tabs[0];
        browser.runtime.sendMessage({ request: "getData", tabId: currentTab.id }).then(response => {
            document.getElementById('third-party-requests').textContent = `Third Party Requests: ${response.thirdPartyRequests}`;
            document.getElementById('cookies-used').textContent = `Cookies Used: ${response.cookiesUsed}`;
            document.getElementById('local-storage-items').textContent = `Local Storage Items: ${response.localStorageItems}`;
            document.getElementById('session-storage-items').textContent = `Session Storage Items: ${response.sessionStorageItems}`;
            document.getElementById('canvas-fingerprint').textContent = `Canvas Fingerprint Detected: ${response.canvasFingerprintDetected ? 'Yes' : 'No'}`;
            document.getElementById('privacy-score').textContent = `Privacy Score: ${response.score}`;
        });
    });
});
