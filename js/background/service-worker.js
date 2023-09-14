'use strict';
import * as func from './functions.js';

chrome.runtime.onInstalled.addListener(function () {
	// chrome.storage.get('settings').error(function () {
		console.log(chrome.storage.local.get('settings'));
		var prot = (typeof browser !== 'undefined') ? 'moz-extension' : 'chrome-extension';
		var url = prot + '://' + chrome.runtime.id + '/html/browser_action/browser_action.html';
		chrome.tabs.create({url: url});
	// });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (!message || !message.hasOwnProperty('method')) {
		return;
	}

	var result = false;

	if (typeof func[message.method] === "function") {
		result = func[message.method](message.args);
	} else {
		console.warn('[NOT FOUND] Method call', message.method, 'args: ', message.args);
	}
	sendResponse(result);
});
