'use strict';

import * as browserapi from '../lib/API/base.js';
import * as setup from './functions/setup.js';
import * as settings from './functions/settings.js';

let importedFunctions = [setup, settings];

let API = browserapi.initAPI();
// let PAPI = papi.initPAPI();

API.api.runtime.onInstalled.addListener(function () {
	let settings = API.Storage.get('settings');

	if (typeof settings === 'undefined') {
		let url = API.api.runtime.getURL("/html/browser_action/browser_action.html");
		API.api.tabs.create({url: url});
	}

});

API.api.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
	if (!message || !message.hasOwnProperty('method')) {
		return;
	}

	var result = false;

	// Anstatt alle background/functions/bla.js importieren zu müssen, will ich hier eine "caller funktuon" in der main.js aufrufen, welche das überminnt.
	for (const element of importedFunctions) {
		if (typeof element[message.method] === "function") {
			if (element[message.method].constructor.name === "AsyncFunction") {
				result = await element[message.method](message.args);
			} else {
				result = element[message.method](message.args);
			}
			break;
		}
	}

	if (result !== false) {
		return Promise.resolve(result);
	} else {
		console.warn('[NOT FOUND] Method call', message.method, 'args: ', message.args);
	}

});
