document.addEventListener('DOMContentLoaded', function() {
    var reportDiv = document.createElement('div');
    reportDiv.id = 'report';
    document.body.appendChild(reportDiv); // Certifique-se que a div existe no DOM

    function updateReport(response) {
        console.log("Recebeu resposta: ", response);
        if (response) {
            reportDiv.innerHTML = `
                <p>Third-Party Connections: ${response.thirdPartyConnections}</p>
                <p>Hijacks Detected: ${response.hijacks}</p>
                <p>Local Storage Items: ${response.storageItems}</p>
                <p>Cookies Set: ${response.cookieCount}</p>
                <p>Canvas Fingerprint Attempts: ${response.canvasFingerprintAttempts}</p>
            `;
        } else {
            reportDiv.textContent = 'No response from background script.';
        }
    }

    browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs.length > 0) {
            console.log("Enviando mensagem para background.js");
            browser.runtime.sendMessage({request: "getScore"}, updateReport);
        } else {
            reportDiv.textContent = 'No active tab detected.';
        }
    });
});
