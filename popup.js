document.addEventListener('DOMContentLoaded', function() {
    browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
        const currentTab = tabs[0];
        // Envia uma solicitação ao background para obter os dados mais recentes
        browser.runtime.sendMessage({request: "getData", tabId: currentTab.id}).then(updatePopup);
    });

    function updatePopup(response) {
        document.getElementById('third-party-requests').textContent = `Third Party Requests: ${response.thirdPartyRequests}`;
        document.getElementById('first-party-cookies').textContent = `First Party Cookies: ${response.firstPartyCookies}`;
        document.getElementById('third-party-cookies').textContent = `Third Party Cookies: ${response.thirdPartyCookies}`;
        document.getElementById('local-storage-items').textContent = `Local Storage Items: ${response.localStorageItems}`;
        document.getElementById('session-storage-items').textContent = `Session Storage Items: ${response.sessionStorageItems}`;
        document.getElementById('canvas-fingerprint').textContent = `Canvas Fingerprint Detected: ${response.canvasFingerprintDetected ? 'Yes' : 'No'}`;
        document.getElementById('hijacking-risk').textContent = `Hijacking Risk: ${response.hijackingRisk ? 'Yes' : 'No'}`;
        document.getElementById('privacy-score').textContent = `Privacy Score: ${response.score}`;
    }
});
