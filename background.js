const tabData = {};

// Listener para conexões a domínios de terceira parte
browser.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (!tabData[details.tabId]) {
            tabData[details.tabId] = {
                thirdPartyConnections: new Set(),
                hijacks: 0,
                storageItems: 0,
                cookieCount: 0,
                canvasFingerprintAttempts: 0
            };
        }
        let url = new URL(details.url);
        const domainData = tabData[details.tabId];
        if (!domainData.thirdPartyConnections.has(url.hostname)) {
            domainData.thirdPartyConnections.add(url.hostname);
            console.log("Third-party connection detected in tab " + details.tabId + " to:", url.hostname);
        }
    },
    {urls: ["<all_urls>"]},
    ["requestBody"]
);

// Listener para mudanças nos cookies
browser.cookies.onChanged.addListener(changeInfo => {
    if (changeInfo.cause === "explicit" && changeInfo.cookie && changeInfo.cookie.tabId) {
        const tabId = changeInfo.cookie.tabId;
        if (!tabData[tabId]) {
            tabData[tabId] = {
                thirdPartyConnections: new Set(),
                hijacks: 0,
                storageItems: 0,
                cookieCount: 0,
                canvasFingerprintAttempts: 0
            };
        }
        tabData[tabId].cookieCount++;
    }
});

// Monitoramento de armazenamento local e detecção de Canvas Fingerprinting
browser.webNavigation.onCompleted.addListener(function(details) {
    const script = `
    var originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        console.log('Local storage modification:', key, value);
        originalSetItem.apply(this, arguments);
        browser.runtime.sendMessage({type: "storage", tabId: ${details.tabId}, key: key, value: value});
    };
    var canvasProto = HTMLCanvasElement.prototype;
    var toDataURL = canvasProto.toDataURL;
    var getContext = canvasProto.getContext;
    canvasProto.toDataURL = function() {
        console.warn("Canvas fingerprint attempt detected");
        browser.runtime.sendMessage({type: "canvas", tabId: ${details.tabId}});
        return toDataURL.apply(this, arguments);
    };
    canvasProto.getContext = function(type) {
        var ctx = getContext.apply(this, arguments);
        if (ctx) {
            var getImageData = ctx.getImageData;
            ctx.getImageData = function(x, y, w, h) {
                console.warn("Canvas getImageData used for potential fingerprinting");
                browser.runtime.sendMessage({type: "canvas", tabId: ${details.tabId}});
                return getImageData.apply(this, arguments);
            };
        }
        return ctx;
    };`;
    browser.tabs.executeScript(details.tabId, { code: script });
});

// Limpar dados quando a aba é fechada
browser.tabs.onRemoved.addListener(function(tabId) {
    delete tabData[tabId];
});

// Receber mensagens do conteúdo do script e atualizar dados
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "storage" || message.type === "canvas") {
        const tabId = message.tabId;
        const data = tabData[tabId];
        if (data) {
            if (message.type === "storage") data.storageItems++;
            if (message.type === "canvas") data.canvasFingerprintAttempts++;
        }
    } else if (message.request === "getScore") {
        const tabId = sender.tab ? sender.tab.id : null;
        const responseData = tabData[tabId] || {
            thirdPartyConnections: new Set(),
            hijacks: 0,
            storageItems: 0,
            cookieCount: 0,
            canvasFingerprintAttempts: 0
        };
        sendResponse({
            thirdPartyConnections: responseData.thirdPartyConnections.size,
            hijacks: responseData.hijacks,
            storageItems: responseData.storageItems,
            cookieCount: responseData.cookieCount,
            canvasFingerprintAttempts: responseData.canvasFingerprintAttempts
        });
        return true;
    }
});
