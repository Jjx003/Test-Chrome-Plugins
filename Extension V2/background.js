// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let domains = new Map()
let localStorage = chrome.storage.local
let re = /([a-zA-Z0-9]+\.[a-zA-Z.]*\/?)/
let httpsRe = /^https/
let portOpen = false
let currentPort = undefined
let currentUA = undefined

function checkHTTPS(str) {
  return httpsRe.test(str)
}

function getDomain(str) {
  var matched = str.match(re)[0]
  var prepend = checkHTTPS(str) ? '🔒' : '❌'
  return prepend + matched
}

function tryUpdate(tab, value) {
  tab = String(tab)
  let getResult = domains.get(tab)
  if (getResult == undefined) {
    let newArr = []
    newArr.push(value)
    domains.set(tab, newArr)
  } else {
    getResult.push(value)
  }
}

chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostContains: '.'},
      })
      ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

chrome.extension.onConnect.addListener(function(port) {
  if (!portOpen) {
    let domainSearch = domains.get(port.name)
    if (domainSearch != undefined) {
      portOpen = true

      let messageObject = {}
      messageObject.command = "u"
      messageObject.payload = domainSearch 

      let encoded = JSON.stringify(messageObject)
      port.postMessage(encoded)
      currentPort = port

      currentPort.onDisconnect.addListener(function(yeet) {
        currentPort = undefined
        portOpen = false
      })
    }
  }

  port.onMessage.addListener(function(msg) {
       if (msg.charAt(0) == '|') {
         let ua = msg.substring(1, msg.length)
         if (ua != "_default") {
          localStorage.set({'currentUA':ua}, ()=>{})
          currentUA = ua
         } else {
          localStorage.remove('currentUA',()=>{})
          currentUA = undefined
         }
       }
  });
})

chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    let uaString = currentUA
    let domainName = getDomain(details.url)
    if (portOpen) {
      let messageObject = {}
      messageObject.command = "a"
      messageObject.payload = domainName
      let encoded = JSON.stringify(messageObject)
      tryUpdate(details.tabId, domainName) 
      currentPort.postMessage(encoded)
    } else {
      tryUpdate(details.tabId, domainName) 
    }
    if (uaString != undefined) {
      for (var i = 0; i < details.requestHeaders.length; ++i) {
        if (details.requestHeaders[i].name == 'User-Agent') {
          details.requestHeaders[i].value = uaString
        }
      }
      return {requestHeaders:details.requestHeaders}
    }
  },
  {urls: ['<all_urls>'] },
  ['blocking', 'requestHeaders']
)

chrome.tabs.onRemoved.addListener(function(tabId, info) {
  if (domains.get(tabId) != undefined) {
    domains.delete(tabId)
  }
  if (uaMaps.get(tabId) != undefined) {
    domains.delete(tabId)
  }
})

/*
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
})
*/
