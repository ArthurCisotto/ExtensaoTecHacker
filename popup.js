document.addEventListener('DOMContentLoaded', function() {
    // Query for the active tab in the current window
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // tabs[0] is the active tab in the current window
        var currentTab = tabs[0];
        // Set the text content with the URL of the current tab
        document.getElementById('url-text').textContent += currentTab.url;
    });
});
