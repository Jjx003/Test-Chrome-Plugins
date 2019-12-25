console.log("injected??");
var url = chrome.runtime.getURL();
chrome.runtime.sendMessage({ current_url: url }, function (response) {
    console.log("Got!");
});