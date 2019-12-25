// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

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

/*
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {  
//chrome.tabs.onActivated.addListener(function(tabInfo) {
  if (changeInfo.status == 'complete') {
    //chrome.tabs.query({active:true, currentWindow: true }, function (tabs) {
      //var tab = tabs[0];
      console.log("some update")
      //var tab = chrome.tabs.get(tabInfo.tabId, function(tab){
        if (typeof (tab) != 'undefined' && typeof (tab.url) != 'undefined') {
          console.log("there is tab!")
          console.log(tab)
          chrome.pageAction.show(tabId);

          setTimeout(function() {
            var popup = chrome.extension.getViews({
              type: "popup",
              //windowId: tab.windowId
            })
            console.log(popup)
            for (var i = 0; i < popup.length; ++i) {
              console.log('ree');
              popup[i].document.getElementById('x').innerHTML = "helloo";
            }
          console.log("should be enabled")
          }, 3000)

        } else {
          console.log('hack')
        }
      //})
  

        
    //});
  }
})
*/