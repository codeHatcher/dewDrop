
var dewDrop = {
  template: {}, //keep the template here
  init: function(){
    this.createContexMenu();
    this.getTemplate();
    this.modal();
  },
  createContexMenu: function(){
    //send message to background page for menu creation.
    chrome.extension.sendMessage({"event": "createMenu"}, function(response){
      console.log("creating menu " + response);
    });
  },
  getTemplate: function(){
    //keep context
    var that = this;
    chrome.extension.sendMessage({"event": "getTemplateHTML"}, function(template){
      console.log("getting template from background page");
      //save the template in our dewDrop object for future use
      that.template = template;
    });
  },
  modal: function(){
    //keep context
    var that = this;
    //setup a listener on a hidden element
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
      if (request.event === "menuClicked"){
        //if we have a click from the context menu
        //go ahead and trigger the dialog
        $(document).avgrund({
          width: 380,
          height: 240,
          template: that.template,
          openOnEvent: false //this will trigger it as soon as it is built.
        });
      }
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
    dewDrop.init();

  }
  }, 10);
});

