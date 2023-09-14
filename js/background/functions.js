'use strict';

export function resetSettings(args) {
	chrome.storage.local.set({ 'settings': '{}' });
}