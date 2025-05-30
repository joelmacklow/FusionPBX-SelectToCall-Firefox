// Options script for FusionPBX SelectToCall Firefox extension

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

// Load saved options when page loads
document.addEventListener('DOMContentLoaded', function() {
  loadOptions();
});

// Save options when form is submitted
document.getElementById('options-form').addEventListener('submit', function(e) {
  e.preventDefault();
  saveOptions();
});

function loadOptions() {
  browser.storage.local.get(settings).then(function(items) {
    // Populate form fields with stored/default values
    document.getElementById('domain').value = items.domain || 'http://pbx';
    document.getElementById('username').value = items.username || '';
    document.getElementById('password').value = items.password || '';
    document.getElementById('dest_cid_name').value = items.dest_cid_name || '';
    document.getElementById('dest_cid_number').value = items.dest_cid_number || '';
    document.getElementById('src').value = items.src || '';
    document.getElementById('ringback').value = items.ringback || '';
    document.getElementById('auto_answer').checked = items.auto_answer === 'true';
    document.getElementById('rec').checked = items.rec === 'true';
  }).catch(function(error) {
    console.error('Error loading options:', error);
    showStatus('Error loading saved options.', 'error');
  });
}

function saveOptions() {
  // Get values from form
  var data = {
    'domain': document.getElementById('domain').value.trim(),
    'username': document.getElementById('username').value.trim(),
    'password': document.getElementById('password').value,
    'dest_cid_name': document.getElementById('dest_cid_name').value.trim(),
    'dest_cid_number': document.getElementById('dest_cid_number').value.trim(),
    'src': document.getElementById('src').value.trim(),
    'ringback': document.getElementById('ringback').value.trim(),
    'auto_answer': document.getElementById('auto_answer').checked ? 'true' : 'false',
    'rec': document.getElementById('rec').checked ? 'true' : 'false'
  };
  
  // Basic validation
  if (!data.domain) {
    showStatus('Please enter a domain/server URL.', 'error');
    return;
  }
  
  if (!data.username) {
    showStatus('Please enter a username.', 'error');
    return;
  }
  
  if (!data.password) {
    showStatus('Please enter a password.', 'error');
    return;
  }
  
  // Ensure domain starts with http:// or https://
  if (!data.domain.startsWith('http://') && !data.domain.startsWith('https://')) {
    data.domain = 'http://' + data.domain;
  }
  
  // Remove trailing slash from domain if present
  data.domain = data.domain.replace(/\/$/, '');
  
  // Save to storage
  browser.storage.local.set(data).then(function() {
    showStatus('Options saved successfully!', 'success');
    console.log('Options saved:', data);
  }).catch(function(error) {
    console.error('Error saving options:', error);
    showStatus('Error saving options. Please try again.', 'error');
  });
}

function showStatus(message, type) {
  var status = document.getElementById('status');
  status.textContent = message;
  status.className = 'status ' + type;
  status.style.display = 'block';
  
  // Hide status message after 3 seconds
  setTimeout(function() {
    status.style.display = 'none';
  }, 3000);
}