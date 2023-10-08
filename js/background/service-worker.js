'use strict';

import * as baseapi from '../lib/API/base.js';
import * as func from './functions.js';

// let API = initAPI();
let API = baseapi.initAPI(); //initAPI();

API.api.runtime.onInstalled.addListener(function () {
	let settings = API.Storage.get('settings');
	if (typeof settings === 'undefined') {
		let url = API.api.runtime.getURL("/html/browser_action/browser_action.html");
		API.api.tabs.create({url: url});
	}
});


console.log("AAPI:");
console.log(API);

API.api.runtime.onMessage.addListener((message, sender, sendResponse) => {
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
	// TODO
	// if (msg === 'credential_amount') {
	// port.postMessage('credential_amount:' + local_credentials.length);
	// }
});
