'use strict';

import { initAPI } from '../../lib/API/base.js';
import { initPAPI } from '../../lib/API/base.js';
import { getSettings } from '../functions.js';

let API = initAPI();

export function initNextcloudConnection(args) {
    let PAPI = initPAPI(API, args.host, args.username, args.password);
    API.PAPI = PAPI;

	return 1;
}

export async function getVaults(args) {
    let vaults = await (new Promise (function (resolve, reject) {
        API.PAPI.getVaults(resolve);
    }));

    return vaults;
}

export function decryptString(args) {
    return API.PAPI.decryptString(args.challenge_password, args.vault_password);;
}

export function setMasterPassword(args) {

    if (args.hasOwnProperty('savePassword') && args.savePassword === true) {
        // Save the password in plain text on user request.
        // No secure local storage is available :/
        // storage.set('master_password', args.password);
        API.Storage.set('master_password', args.password);
    } else {
        // storage.set('master_password', null);
        API.Storage.set('master_password', null);
    }

    if (args.password) {
        getSettings();
    } else {
        // displayLogoutIcons();
    }

}

// function displayLogoutIcons() {
//     if (_self.settings) {
//         API.tabs.query({}).then(function (tabs) {
//             for (var t = 0; t < tabs.length; t++) {
//                 var tab = tabs[t];
//                 API.browserAction.setBadgeText({
//                     text: '🔑',
//                     tabId: tab.id
//                 });
//                 API.browserAction.setBadgeBackgroundColor({
//                     color: '#ff0000',
//                     tabId: tab.id
//                 });
//                 API.browserAction.setTitle({
//                     title: API.i18n.getMessage('browser_action_title_locked'),
//                     tabId: tab.id
//                 });
//             }
//         });
//     }
// }

// export function callFunction(method, args) {
// // Hier will ich irgendwie mit den codezeile von unten die fuktion innerhalb der settings.js aufrufen können.
// }


// if (typeof func[message.method] === "function") {
//     result = func[message.method](message.args);
// } else {
//     console.warn('[NOT FOUND] Method call', message.method, 'args: ', message.args);
// }

