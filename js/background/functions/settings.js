'use strict';

import { initAPI } from '../../lib/API/base.js';
import { initPAPI } from '../../lib/API/base.js';

let API = initAPI();
// let PAPI = initPAPI(API);

var encryptedFieldSettings = ['accounts'];
var master_password = null;
var testMasterPasswordAgainst;
var _self;

export function getSettings() {

	storage.get('settings').then(function (_settings) {
		if ((!_settings || Object.keys(_settings).length === 0 || !_settings.hasOwnProperty('accounts')) && !master_password) {
			return;
		}

		testMasterPasswordAgainst = _settings.accounts;

		if (!master_password && _settings.hasOwnProperty('accounts') && _settings.accounts.length > 0) {
			_self.settings.isInstalled = 1;
			return;
		}

		for (var i = 0; i < encryptedFieldSettings.length; i++) {
			var field = encryptedFieldSettings[i];
			_settings[field] = JSON.parse(PAPI.decryptString(_settings[field], master_password));
		}

		_self.settings = _settings;

		if (!_self.settings.hasOwnProperty('ignored_sites')) {
			_self.settings.ignored_sites = [];
		}

		if (!_self.settings.hasOwnProperty('no_results_found_tab')) {
			_self.settings.no_results_found_tab = 'list';
		}

		if (!_self.settings.hasOwnProperty('enablePasswordPicker')) {
			_self.settings.enablePasswordPicker = !_self.settings.disablePasswordPicker;
		}

		if (!_self.settings.hasOwnProperty('enableAutoFill')) {
			_self.settings.enableAutoFill = !_self.settings.disableAutoFill;
		}

		if (!_self.settings.hasOwnProperty('enableUpdateUrl')) {
			_self.settings.enableUpdateUrl = true;
		}
		if (!_self.settings.hasOwnProperty('passwordPickerGotoList')) {
			_self.settings.passwordPickerGotoList = false;
		}

		getCredentials();

		if (_self.running) {
			clearInterval(_self.ticker);
		}
		_self.running = true;
		_self.ticker = setInterval(function () {

		}, _self.settings.refreshTime * 1000);

	});
}

export function saveSettings(settings, cb) {
	for (var i = 0; i < encryptedFieldSettings.length; i++) {
		var field = encryptedFieldSettings[i];
		settings[field] = PAPI.encryptString(JSON.stringify(settings[field]), master_password);
	}

	if (!settings.hasOwnProperty('ignored_sites')) {
		settings.ignored_sites = [];
	}

	if (!_self.settings.hasOwnProperty('password_picker_first_tab')) {
		_self.settings.disable_browser_autofill = 'list';
	}

	//window.settings contains the run-time settings
	_self.settings = settings;


	storage.set('settings', settings).then(function () {
		getSettings();
	});

}

// export function saveSettings(settings, cb) {
// 	for (var i = 0; i < encryptedFieldSettings.length; i++) {
// 		var field = encryptedFieldSettings[i];
// 		settings[field] = PAPI.encryptString(JSON.stringify(settings[field]), master_password);
// 	}

// 	if (!settings.hasOwnProperty('ignored_sites')) {
// 		settings.ignored_sites = [];
// 	}

// 	if (!_self.settings.hasOwnProperty('password_picker_first_tab')) {
// 		_self.settings.disable_browser_autofill = 'list';
// 	}

// 	//window.settings contains the run-time settings
// 	_self.settings = settings;


// 	storage.set('settings', settings).then(function () {
// 		getSettings();
// 	});

// }

export function resetSettings() {
    API.Storage.set('settings', {});
	return;
}

export function importSettings() {
    API.Storage.set('settings', {});
	return;
}
