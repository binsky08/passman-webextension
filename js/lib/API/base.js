/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use strict';

function onGot(item) {
    // console.log(item);
    // console.log("hehehe");
    return item;
}

function onError(error) {
    console.log('Error: '+error);
    return {};
}

export function initStorage(API) {
    
    var localStorage = API.api.storage.local;

    return {
        /**
         * Retrieves an item from the local storage
         * @param string|array key The key or an array of keys to retrieve
         * @returns angular_promise
         */
        // get: function(key) {
        //     return new Promise(function() {
        //         // if (API.promise) {
        //             localStorage.get(key).then((function(item){
        //                 /* jshint ignore:start */
        //                 if (typeof key === "[object Array]") {
        //                     this.call_then(item);
        //                 }

        //                 else {
        //                     if (item[key] === undefined) {
        //                         this.call_error("Data not found");
        //                     }
        //                     else {
        //                         this.call_then(item[key]);
        //                     }
        //                 }
        //                 /* jshint ignore:end */
        //             }).bind(this), (function(error){
        //                 this.call_error(error);
        //             }).bind(this));
        //         // }
        //         // else{
        //         //     localStorage.get(key, (function(item){
        //         //         /* jshint ignore:start */
        //         //         if (typeof key === "[object Array]") {
        //         //             this.call_then(item);
        //         //         }

        //         //         else {
        //         //             if (item[key] === undefined) {
        //         //                 this.call_error("Data not found");
        //         //             }
        //         //             else {
        //         //                 this.call_then(item[key]);
        //         //             }
        //         //         }
        //         //         /* jshint ignore:end */
        //         //     }).bind(this));
        //         // }
        //     });
        // },

        get: function(key) {
            let gettingItem = browser.storage.local.get(key);
            gettingItem.then(onGot, onError);
            // return gettingItem;
        },

        set: function(key, value) {
            var o = {};
            o[key] = value;
            
            // if (API.promise) {
                return localStorage.set(o);
            // }
            // else {
            //     return new C_Promise(function() {
            //         localStorage.set(o, (function(){
            //             this.call_then();
            //         }).bind(this));
            //     });
            // }
        }
        
    };
};

export function initAPI() {
    let API = {};

    /* jshint ignore:start */
    API.api;
    API.promise = true;     // Chrome does not return promises
    /* jshint ignore:end */

    // Workaround chrome's uniqueness
    if (typeof browser === 'undefined') {
        API.api = chrome;
        API.promise = false;
    }
    else{
        API.api = browser;
    }

    API.Storage = initStorage(API);

    return API;
}

var API = initAPI();


export {API};