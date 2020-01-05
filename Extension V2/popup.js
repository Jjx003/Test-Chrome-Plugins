let currentTab = undefined;
let port = undefined;
let localStorage = chrome.storage.local

function appendToHTML(str) {
  var p = document.createElement("p")
  var text = document.createTextNode(str)
  p.appendChild(text)

  var body = document.getElementsByTagName("BODY")[0]
  body.appendChild(p)
}

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  var tab = tabs[0]
  currentTab = tab

  if (typeof (tab) != 'undefined' && typeof (tab.url) != 'undefined') {
    document.getElementById('title').innerHTML = tab.url;
  }

  port = chrome.extension.connect({
    name: String(currentTab.id)
  })
  
  port.onMessage.addListener(function (msg) {
    var test = JSON.parse(msg)
    if (test && test.command) {
      var cmd = test.command
      if (cmd == "u") {
        test.payload.forEach(element => appendToHTML(element))
      } else {
        appendToHTML(test.payload)
      }
    }
  });

  let selectionForm = document.getElementById("user_agent")

  localStorage.get("selectionIndex", function(result) {
    if (result != undefined && result.selectionIndex != undefined) {
      selectionForm.selectedIndex = result.selectionIndex
    }
  })

  function selectionChanged() {
    if (port != undefined && currentTab != undefined) {
      let ua = selectionForm.options[selectionForm.selectedIndex].value
      let index = selectionForm.selectedIndex
      localStorage.set({"selectionIndex" : index}, ()=>{})
      port.postMessage("|"+ua)
    } 
  }
  selectionForm.onchange = selectionChanged
})



