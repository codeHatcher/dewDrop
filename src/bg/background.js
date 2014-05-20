//object to help us do things in the background page
var dewDropBg = {
  createMenu: function(options){
    console.log('creating context menu');
    chrome.contextMenus.create({
      "title": "dewDrop",
      "contexts": ["link"],
      "onclick": function(context, tab){
        console.log('context menu clicked' + context + tab);
        //send message back to the context script to let it know the context menu has been clicked
        chrome.tabs.sendMessage(tab.id, {"event": "menuClicked", "context": context}, function(response){
          //once the message is sent, we really don't need to do anything
        });
      }
    });
  },
  templateHTML: function(){
    //get the template from the html page
    return $('#popupTmpl').html();
  },
  listenContextMenu: function(request, sender, sendResponse){
    if (request.event === "createMenu"){
      dewDropBg.createMenu({});
      //remove the listener because we only want one context menu
      chrome.extension.onMessage.removeListener(dewDropBg.listenContextMenu);
      return;
    }
  }
};
//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
   if ( request.event === "getTemplateHTML"){
      dewDropBg.templateHTML();
      sendResponse(dewDropBg.templateHTML());
      return;
    } else {
      chrome.pageAction.show(sender.tab.id);
      sendResponse();
    }
  });
//separate event listener for context menu creation so that we can remove the listener later
chrome.extension.onMessage.addListener(dewDropBg.listenContextMenu);

