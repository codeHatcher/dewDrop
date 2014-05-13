
var dewDrop = {
  createMenu: function(){
    //send message to background page for menu creation.
  }
}


chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
  if (document.readyState === "complete") {
    clearInterval(readyStateCheckInterval);

    // ----------------------------------------------------------
    // This part of the script triggers when page is done loading
    console.log("Hello. This message was sent from scripts/inject.js");
    // ----------------------------------------------------------
chrome.extension.sendMessage({"event": "createMenu"}, function(response){
  console.log("callback says " + response);
})


  }
  }, 10);
});