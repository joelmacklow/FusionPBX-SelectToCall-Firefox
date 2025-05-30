// Default settings
var settings = {
  'domain': 'http://pbx',
  'username': '',
  'password': '',
  'dest_cid_name': '',
  'dest_cid_number': '',
  'src': '',
  'rec': 'false',
  'ringback': '',
  'auto_answer': 'false'
};

// Listen for messages from content script
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'create_menu') {
    // Remove any existing context menus first
    browser.contextMenus.removeAll().then(() => {
      // Create new context menu
      browser.contextMenus.create({
        id: "contextSelection",
        title: "Dial " + request.selection,
        contexts: ["selection"]
      });
    });
    
    // Send response back to content script
    sendResponse({
      'result': 'created', 
      'message': request.action, 
      'selection': request.selection
    });
  }
  
  if (request.action === 'remove_menu') {
    browser.contextMenus.removeAll();
    sendResponse({'result': 'removed'});
  }
});

// Handle context menu clicks
browser.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "contextSelection") {
    onClickHandler(info, tab);
  }
});

function onClickHandler(info, tab) {
  // Strip everything except numbers and plus sign
  var phoneNum = info.selectionText.replace(/[^+\d]+/g, '');
  
  // Get settings from storage
  browser.storage.local.get(settings).then(function(items) {
    // Check if we have valid settings
    if (!items.username || !items.password) {
      // Show notification instead of alert for better UX
      browser.notifications.create({
        type: 'basic',
        iconUrl: 'icon48.png',
        title: 'FusionPBX SelectToCall',
        message: 'Please configure extension options first.'
      });
      return;
    }
    
    // Create the FusionPBX URL
    var url = items.domain + "/app/click_to_call/click_to_call.php?src_cid_name=WebDialer" +
      '&auto_answer=' + (items.auto_answer || 'false') +
      '&src_cid_number=' + phoneNum +
      '&dest_cid_name=' + (items.dest_cid_name || '') +
      '&dest_cid_number=' + (items.dest_cid_number || '') +
      '&src=' + (items.src || '') +
      '&dest=' + phoneNum +
      '&rec=' + (items.rec || 'false') +
      '&ringback=' + (items.ringback || '');
    
    // Make HTTP request using fetch API (modern approach)
    var login = 'username=' + encodeURIComponent(items.username) + 
                '&password=' + encodeURIComponent(items.password);
    
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: login
    })
    .then(response => {
      if (response.ok) {
        // Show success notification
        browser.notifications.create({
          type: 'basic',
          iconUrl: 'icon48.png',
          title: 'FusionPBX SelectToCall',
          message: 'Dialing ' + phoneNum + '...'
        });
      } else {
        throw new Error('Network response was not ok');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      browser.notifications.create({
        type: 'basic',
        iconUrl: 'icon48.png',
        title: 'FusionPBX SelectToCall',
        message: 'Failed to dial number. Check your settings.'
      });
    });
  });
}