
var dewDrop = {
  template: {}, //keep the template here
  init: function(){
    this.createContexMenu();
  },
  createContexMenu: function(){
    //send message to background page for menu creation.
    chrome.extension.sendMessage({"event": "createMenu"}, function(response){
      console.log("creating menu " + response);
    });
  },
  getTemplate: function(cb){
    chrome.extension.sendMessage({"event": "getTemplateHTML"}, function(template){
      console.log("getting template from background page");
      //once the template has loaded go ahead and run the callback with the template as the first arg

      $('body').append(template);
      return cb(template);
    });
  },
  modal: function(){
    //setup a listener on a hidden element
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
      if (request.event === "menuClicked"){
        //if we have a click from the context menu
        //go ahead and setup the dialog
        $('#dewDrop').avgrund({
          width: 380,
          height: 240,
          template: "Test Template"
        });
        //then go ahead and trigger the dialog that we have setup
        $('#dewDrop').trigger("click");
      }
    });
    //setup modal
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
    dewDrop.init();
    dewDrop.getTemplate(function(template){
      dewDrop.modal();
    });

  }
  }, 10);
});

