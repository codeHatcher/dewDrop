
var dewDrop = {
  createContexMenu: function(){
    //send message to background page for menu creation.
    chrome.extension.sendMessage({"event": "createMenu"}, function(response){
      console.log("creating menu " + response);
    });
  },
  template: function(cb){
    chrome.extension.sendMessage({"event": "getTemplateHTML"}, function(template){
      console.log("getting template from background page");
      //once the template has loaded go ahead and run the callback with the template as the first arg
      return cb(template);
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
    dewDrop.template(function(template){
      $('body').append(template);
      $('#dewDrop').avgrund();
    });

  }
  }, 10);
});

