/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global API */

API.browserAction = {
    setTitle: API.api.action.setTitle,
    getTitle: function(details) {
        if (API.promise) {
            return API.api.action.getTitle(details);
        }
        else {
            return new C_Promise(function() {
                API.api.action.getTitle(details, (function(title) {
                    this.call_then(title);
                }).bind(this));
            });
        }
    },
    setIcon: function(details) {
        if (API.promise) {
            return API.api.action.setIcon(details);
        }
        else {
            return new API.api.action.setIcon(details, (function(){
                this.call_then();
            }).bind(this));
        }
    },
    setPopup: API.api.action.setPopup,
    getPopup: function(details) {
        if (API.promise) {
            return API.api.action.getPopup(details);
        }
        else {
            return new C_Promise(function() {
                API.api.action.getPopup(details, (function(url) {
                    this.call_then(url);
                }).bind(this));
            });
        }
    },
    setBadgeText: API.api.action.setBadgeText,
    getBadgeText: function(details) {
        if (API.promise) {
            return API.api.action.getBadgeText(details);
        }
        else {
            return new C_Promise(function() {
                API.api.action.getBadgeText(details, (function(text) {
                    this.call_then(text);
                }).bind(this));
            });
        }
    },
    setBadgeBackgroundColor: API.api.action.setBadgeBackgroundColor,
    getBadgeBackgroundColor: function(details) {
        if (API.promise) {
            return API.api.action.getBadgeBackgroundColor(details);
        }
        else {
            return new C_Promise(function() {
                API.api.action.getBadgeBackgroundColor(details, (function(colour) {
                    this.call_then(colour);
                }).bind(this));
            });
        }
    },
    enable: API.api.action.enable,
    disable: API.api.action.disable,
    
    /**
     * Events from now on
     */
    onClicked: API.api.action.onClicked
};
