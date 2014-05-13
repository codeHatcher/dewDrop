
//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.eventt){
      return sendResponse("we did it!");
    } else {
      chrome.pageAction.show(sender.tab.id);
      sendResponse();
    }

  });


//add context menus
chrome.contextMenus.create({
  "title": "Buzz This",
  "contexts": ["page", "selection", "image", "link"],
  "onclick" : function(){console.log('context menu clicked')}
});

var dewDrop = {
  createMenu: function(){
    chrome.contextMenus,create({
      "title": "dewDrop",
      "contexts": ["link"],
      "onclick": clickHandler
    });
  }
};

