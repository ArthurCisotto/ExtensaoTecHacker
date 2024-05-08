let thirdPartyRequests = 0;
let cookiesUsed = 0;
let localStorageItems = 0;
let sessionStorageItems = 0;
let canvasFingerprintDetected = false;

function countCookies(details, tabHostname) {
    browser.cookies.getAll({url: details.url}).then(cookies => {
        cookies.forEach(cookie => {
            if (!cookie.domain.includes(tabHostname)) {
                cookiesUsed++;
            }
        });
    });
}

browser.webRequest.onCompleted.addListener(
    details => {
        browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
            if (tabs[0] && tabs[0].url) {
                const tabUrl = new URL(tabs[0].url);
                const tabHostname = tabUrl.hostname;
                if (!details.url.includes(tabHostname)) {
                    thirdPartyRequests++;
                }
                countCookies(details, tabHostname);
            }
        });
    },
    { urls: ["<all_urls>"] }
);

function injectScript() {
    browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
        if (tabs.length > 0 && tabs[0].id) {
            const code = `
                browser.runtime.sendMessage({
                    type: 'storageData',
                    localStorageCount: localStorage.length,
                    sessionStorageCount: sessionStorage.length,
                    canvasFingerprint: checkCanvasFingerprint()
                });

                function checkCanvasFingerprint() {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    ctx.textBaseline = 'top';
                    ctx.font = '14px Arial';
                    ctx.fillText('canvas fingerprinting', 10, 10);
                    return canvas.toDataURL() !== document.createElement('canvas').toDataURL();
                }
            `;
            browser.tabs.executeScript(tabs[0].id, {code: code});
        }
    });
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
        injectScript();
    }
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "storageData") {
        localStorageItems = message.localStorageCount;
        sessionStorageItems = message.sessionStorageCount;
        canvasFingerprintDetected = message.canvasFingerprint;
    }

    if (message.request === "getData") {
        sendResponse({
            thirdPartyRequests,
            cookiesUsed,
            localStorageItems,
            sessionStorageItems,
            canvasFingerprintDetected
        });
    }
});
