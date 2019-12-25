chrome.tabs.query({active : true, currentWindow : true}, function( tabs ) {
  var tab = tabs[0]
  if (typeof (tab) != 'undefined' && typeof (tab.url) != 'undefined') {
    document.getElementById('title').innerHTML = tab.url;
  }
})


/*
changeColor.onclick = function(element) {
    let color = element.target.value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
          tabs[0].id,
          {code: 'document.body.style.backgroundColor = "' + color + '";'});
    });
  }

chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.indexOf("current_url") != -1) {
      sendResponse({wack:""})
    }
  });
  */