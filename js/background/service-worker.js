'use strict';

import * as browserapi from '../lib/API/base.js';
// import * as papi from '../lib/api.js';
import * as func from './functions.js';

let API = browserapi.initAPI();
// let PAPI = papi.initPAPI();

API.api.runtime.onInstalled.addListener(function () {
	let settings = API.Storage.get('settings');

	if (typeof settings === 'undefined') {
		let url = API.api.runtime.getURL("/html/browser_action/browser_action.html");
		API.api.tabs.create({url: url});
	}

});

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
