
var dewDrop = {
  createContexMenu: function(){
    //send message to background page for menu creation.
    chrome.extension.sendMessage({"event": "createMenu"}, function(response){
      console.log("creating menu " + response);
    });
  },
  template: function(){
    chrome.extension.sendMessage({"event": "getTemplate"}, function(template){
      console.log("getting template from background page");
      return template;
    });
  }
};


chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
  if (document.readyState === "complete") {
    clearInterval(readyStateCheckInterval);

    // ----------------------------------------------------------
    // This part of the script triggers when page is done loading
    console.log("Hello. This message was sent from scripts/inject.js");
    // ----------------------------------------------------------
    dewDrop.createContexMenu();
    dewDrop.template();
    $('body').append("TEST");
  }
  }, 10);
});

