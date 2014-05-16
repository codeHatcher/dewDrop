
var dewDrop = {
  template: {}, //keep the template here
  user:{supports:[], supporters:[]},
  init: function(){
    //bind functions to keep proper context
    this.trustUser = _.bind(this.trustUser, this);
    this.distrustUser = _.bind(this.distrustUser, this);
    this.getUserDetails();
    this.createContexMenu();
    this.getTemplate();
    this.listenEvents();
    this.modal();
  },
  listenEvents: function(){
    //listen to future button clicks even though they haven't been inserted into the DOM yet
    $(document).on('click', '#unsupportUser', this, this.distrustUser);
    $(document).on('click', '#supportUser', this, this.trustUser);
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
      that.template = _.template(template);
    });
  },
  modal: function(){
    //keep context
    var that = this;
    //setup a listener on a hidden element
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
      if (request.event === "menuClicked"){
        //if we have a click from the context menu
        //get the associated facebook id of the clicked link
        that.getUserId(request.context);
        //add element that contains the information for our modal to the body
        $('body').append(that.template(that.user));
        //if trust the user, remove the trust button, otherwise remove the other button
        if (that.checkTrust(that.user.facebookId)){
          $('#dewDrop').find('#supportUser').remove();
        } else {
          $('#dewDrop').find('#unsupportUser').remove();
        }
        //go ahead and trigger the dialog
        $(document).avgrund({
          width: 380,
          height: 240,
          template: $('#dewDrop'),
          openOnEvent: false //this will trigger it as soon as it is built.
        });
      }
    });
  },
  getUserId: function(context){
    //function takes the clicked link and makes it into a facebook id
    this.user.facebookId = $('a[href="' +context.linkUrl+'"]').attr('data-hovercard').match(new RegExp("\[0-9]+")).toString();
    return this.user.facebookId;
  },
  getMyId: function(){
    //function gets the id of the logged in user
    return this.user.ownId;
  },
  trustUser: function(event){
    this.user.supports = _.union(this.user.supports, this.user.facebookId);
    //save the id as trusted (testing)
    this.saveUserDetails();
  },
  distrustUser: function(event){
    this.user.supports = _.without(this.user.supports, this.user.facebookId);
    this.saveUserDetails();
  },
  checkTrust: function(userId){
    //go through our list of users we support and see if there is a match
    return _.contains(this.user.supports, this.user.facebookId);
  },
  saveUserDetails: function(){
    //save the user details to the server
    //save the user details in local storage
    localStorage.user = JSON.stringify(this.user);
  },
  getUserDetails: function(){
    //get the user details from the server of everyone you trust from the server
    //mockup the data for now
    //try to get data from remote server
    //TODO, insert api hook here
    if (localStorage.user){
      this.user = JSON.parse(localStorage.user);
    }
    //if you get data from remote, go ahead and set that to our user variable
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

