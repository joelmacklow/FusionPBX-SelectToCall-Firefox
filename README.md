# FusionPBX SelectToCall - Firefox Extension

A Firefox extension that allows you to easily dial phone numbers through FusionPBX by simply selecting them on any webpage and using the right-click context menu.

## Features

- Select any phone number on a webpage
- Right-click to see "Dial [phone number]" option in context menu
- Automatically validates phone number format (7, 10, 11, or 12 digits)
- Supports various phone number formats (dots, dashes, spaces, parentheses)
- Configurable auto-answer and call recording options
- Visual notifications for call status
- Secure credential storage

## Installation

### Method 1: Load Temporary Extension (Development/Testing)

1. Download all the extension files to a folder on your computer
2. Open Firefox and go to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on..."
5. Navigate to your extension folder and select the `manifest.json` file
6. The extension will be loaded temporarily (until Firefox is restarted)

### Method 2: Create Signed Extension Package

1. Package all files into a ZIP file
2. Submit to Mozilla Add-ons for review and signing
3. Install the signed .xpi file

## Configuration

1. After installation, right-click on the extension icon and select "Options" (or go to about:addons, find the extension, and click "Options")
2. Configure the following settings:

### Required Settings:
- **Domain/Server URL**: Your FusionPBX server URL (e.g., `http://pbx.example.com`)
- **Username**: Your FusionPBX login username
- **Password**: Your FusionPBX login password
- **Source Extension**: Your extension number that will be called first

### Optional Settings:
- **Destination Caller ID Name**: Name to show on outbound calls
- **Destination Caller ID Number**: Number to show on outbound calls  
- **Ringback**: Custom ringback tone
- **Auto Answer**: Automatically answer your extension when calls are placed
- **Record Calls**: Enable call recording for outbound calls

## Usage

1. Browse to any webpage containing phone numbers
2. Select/highlight a phone number with your mouse
3. Right-click to open the context menu
4. Click "Dial [phone number]" to initiate the call
5. Your extension will ring first - answer to be connected to the dialed number

## License

This extension maintains the same BSD-style license as the original Chrome extension.
