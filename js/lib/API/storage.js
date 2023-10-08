// /* 
//  * To change this license header, choose License Headers in Project Properties.
//  * To change this template file, choose Tools | Templates
//  * and open the template in the editor.
//  */

// 'use strict';

// import { initAPI } from "./base";

// let API = initAPI();

// API.Storage = function() {
    
//     // var localStorage = bowser.storage.local;
//     var localStorage = API.api.storage.local;

//     return {
//         /**
//          * Retrieves an item from the local storage
//          * @param string|array key The key or an array of keys to retrieve
//          * @returns angular_promise
//          */
//         get: function(key) {
//             return new C_Promise(function(){
//                 // if (API.promise) {
//                     localStorage.get(key).then((function(item){
//                         /* jshint ignore:start */
//                         if (typeof key === "[object Array]") {
//                             this.call_then(item);
//                         }

//                         else {
//                             if (item[key] === undefined) {
//                                 this.call_error("Data not found");
//                             }
//                             else {
//                                 this.call_then(item[key]);
//                             }
//                         }
//                         /* jshint ignore:end */
//                     }).bind(this), (function(error){
//                         this.call_error(error);
//                     }).bind(this));
//                 // }
//                 // else{
//                 //     localStorage.get(key, (function(item){
//                 //         /* jshint ignore:start */
//                 //         if (typeof key === "[object Array]") {
//                 //             this.call_then(item);
//                 //         }

//                 //         else {
//                 //             if (item[key] === undefined) {
//                 //                 this.call_error("Data not found");
//                 //             }
//                 //             else {
//                 //                 this.call_then(item[key]);
//                 //             }
//                 //         }
//                 //         /* jshint ignore:end */
//                 //     }).bind(this));
//                 // }
//             });
//         },
        
//         set: function(key, value) {
//             var o = {};
//             o[key] = value;
            
//             // if (API.promise) {
//                 return localStorage.set(o);
//             // }
//             // else {
//             //     return new C_Promise(function() {
//             //         localStorage.set(o, (function(){
//             //             this.call_then();
//             //         }).bind(this));
//             //     });
//             // }
//         }
        
//     };
// };