
var dewDrop = {
  template: {}, //keep the template here
  user:{supports:[], supporters:[], personInQuestion:{}}, //whats the point of using loose type if I am doing it here ARGGG
  init: function(){
    //bind functions to keep proper context
    this.trustUser = _.bind(this.trustUser, this);
    this.distrustUser = _.bind(this.distrustUser, this);
    this.getUserDetails();
    this.createContexMenu();
    this.getTemplate();
    this.listenEvents();
    //this.modal();
  },
  listenEvents: function(){
    var that = this;
    //listen to future button clicks even though they haven't been inserted into the DOM yet
    $(document).on('click', '#unsupportUser', this, this.distrustUser);
    $(document).on('click', '#supportUser', this, this.trustUser);
    //unrender with modal is closed
    //$(document).on('click', '#closeModal', this, this.unrender);
    //listen for events from background.js
    chrome.runtime.onMessage.addListener(function(request, sender, sendReponse){
      if (request.event === "menuClicked"){
        //if the event triggered was the menu click, do the following
        that.render(request.context); //pass in context/info about the menu click
      }
    });
  },
  menuClicked: function(context){
    //once the menu is clicked...

    //render our interface to the user
    this.render();
  },
  render: function(context){
    //get the userid data
    this.getUserId(context);
    //get the name data
    this.getName(context);
    //add element that contains the information for our modal to the body
    $('body').append(this.template(this.user.personInQuestion));
    //if trust the user, remove the trust button, otherwise remove the other button
    if (this.checkTrust(this.user.personInQuestion.facebookId)){
      $('#dewDrop').find('#supportUser').hide();
      $('#dewDrop').find('#unsupportUser').show();
    } else {
      $('#dewDrop').find('#unsupportUser').hide();
      $('#dewDrop').find('#supportUser').show();
    }
    //go ahead and trigger the dialog
    $("#dewDrop").modal({

    });
    //add event handler
    $('#dewDrop').on('hidden.bs.modal', this.unrender);
  },
  unrender: function(){
    //call this when we are done with our modal
    $('#dewDrop').remove();
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
  getUserId: function(context){
    //function takes the clicked link and makes it into a facebook id
    this.user.personInQuestion.facebookId = $('a[href="' +context.linkUrl+'"]').attr('data-hovercard').match(new RegExp("\[0-9]+")).toString();
    return this.user.personInQuestion.facebookId;
  },
  getName: function(context){
    //function takes the context of the link the menu item was clicked on and returns name
    this.user.personInQuestion.name = context.selectionText;
    return context.selectionText;
  },
  getMyId: function(){
    //function gets the id of the logged in user
    return this.user.ownId;
  },
  trustUser: function(event){
    this.user.supports = _.union(this.user.supports, this.user.personInQuestion.facebookId);
    //save the id as trusted (testing)
    this.saveUserDetails();
  },
  distrustUser: function(event){
    this.user.supports = _.without(this.user.supports, this.user.personInQuestion.facebookId);
    this.saveUserDetails();
  },
  checkTrust: function(userId){
    //go through our list of users we support and see if there is a match
    return _.contains(this.user.supports, this.user.personInQuestion.facebookId);
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
    var jqxhr = $.getJSON("http://dewdrop.neyer.me/api/v1/statement/?format=json&author__name=21405334&author__network__name=facebook&content=trust&subject__network__name=facebook", function(){

    })
    .done(function(data){
      data.objects.forEach(function(object, index, objects){dewDrop.user.supports.push(object.subject.name)});
      dewDrop.user.supports = _.uniq(dewDrop.user.supports);

    });
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

