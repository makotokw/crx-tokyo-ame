'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create(
    'popup.html',
    {
      frame: 'none',
      resizable: false,
      innerBounds: {
        'left': 50,
        'top': 50,
        'width': 790,
        'height': 584
      }
    }
  );
});