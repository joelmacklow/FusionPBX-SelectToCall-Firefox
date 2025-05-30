// Content script for FusionPBX SelectToCall Firefox extension

// Listen for mousedown events to check for phone number selections
document.addEventListener("mousedown", function(event) {
  // Small delay to ensure selection is complete
  setTimeout(function() {
    var selection = window.getSelection().toString().trim();
    
    // Test #1: Did they actually select anything?
    if (selection) {
      var digits = selection.match(/\d/g); // Get only the digits
      
      // Test #2: Can it be a phone number?
      // Support formats like: 123.4567, 123.456.7890, 1.123.456.7890, 01.123.456.7890
      // Also support formats with dashes, spaces, parentheses, etc.
      if (digits && (digits.length === 7 || digits.length === 9 || digits.length >= 10 && digits.length <= 12)) {
        console.log("FusionPBX: Creating menu for " + selection);
        
        // Send message to background script to create context menu
        browser.runtime.sendMessage({
          'action': 'create_menu',
          'selection': selection
        }).then(function(response) {
          console.log("FusionPBX: " + response.result);
        }).catch(function(error) {
          console.error("FusionPBX: Error creating menu:", error);
        });
      } else {
        // If selection doesn't look like a phone number, remove any existing menu
        browser.runtime.sendMessage({
          'action': 'remove_menu'
        }).catch(function(error) {
          console.error("FusionPBX: Error removing menu:", error);
        });
      }
    } else {
      // If nothing is selected, remove any existing menu
      browser.runtime.sendMessage({
        'action': 'remove_menu'
      }).catch(function(error) {
        console.error("FusionPBX: Error removing menu:", error);
      });
    }
  }, 10); // Small delay to ensure selection is complete
});

// Also listen for selection changes
document.addEventListener("selectionchange", function(event) {
  var selection = window.getSelection().toString().trim();
  
  if (!selection) {
    // If selection is cleared, remove context menu
    browser.runtime.sendMessage({
      'action': 'remove_menu'
    }).catch(function(error) {
      console.error("FusionPBX: Error removing menu:", error);
    });
  }
});

console.log("FusionPBX SelectToCall content script loaded");