// There's TWO States :>

// STATE N1 : Popup already opened
// If Background Script Send Any Messages
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
   // if bg script ready 
    if (msg.ready) {

        // 1 - refresh pop
        location.reload();

        // 2 - then run the script
        runApp();
    }
    // if error occured 
    if (msg.error) {
        // the run error script for popup
       runErrorPU();
    }
});

// STATE N2 : Popup Opened Event
// 1 - Make Connection Channel And Name It
var port = chrome.runtime.connect({
    name: "popupState"
});
// 2 - If Background Script Send Any Messages
port.onMessage.addListener(function(msg) {
    // if bg script ready 
    if (msg.ready) {
        // then run the script
        runApp();
    }
    // if error occured 
    if (msg.error) {
        // the run error script for background
       runErrorBG();
    }
});
