/* global API */

/**
 * Nextcloud - passman
 *
 * @copyright Copyright (c) 2016, Sander Brand (brantje@gmail.com)
 * @copyright Copyright (c) 2016, Marcos Zuriaga Miguel (wolfi@wolfi.es)
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name passmanApp.controller:MainCtrl
     * @description
     * # MainCtrl
     * Controller of the passmanApp
     */
    angular.module('passmanExtension')
        .controller('SetupCtrl', ['$scope', '$timeout', '$location', '$rootScope', 'StepsService', 'notify', 'HttpsTest',
            function ($scope, $timeout, $location, $rootScope, StepsService, notify, HttpsTest) {
            let API = $scope.getBrowserAPI();

            $scope.settings = {
                nextcloud_host: '',
                nextcloud_username: '',
                nextcloud_password: '',
                ignoreProtocol: true,
                ignoreSubdomain: true,
                ignorePath: true,
                generatedPasswordLength: 12,
                remember_password: true,
                vault_password: '',
                refreshTime: 60,
                default_vault: {},
                master_password: '',
                master_password_repeat: '',
                enableAutoFill: true,
                enablePasswordPickerr: true,
                enableAutoSubmit: false,
                debug: false,
                accounts: []
            };
            $scope.vaults = [];

            $rootScope.$broadcast('hideHeader');
            $rootScope.setup = true;
            $scope.gogo = function (to) {
                StepsService.steps().goTo(to);
            };
            notify.config({
                'position': 'left',
                'duration': 2500
            });

            $scope.check = {
                server: function (callback) {
                    if(!$scope.settings.nextcloud_host || !$scope.settings.nextcloud_username || !$scope.settings.nextcloud_password){
                        let errors = API.i18n.getMessage('invalid_server_settings');
                        $scope.errors.push(errors);
                        notify(errors);
                        callback(false);
                        return;
                    }
                    $scope.settings.nextcloud_host = $scope.settings.nextcloud_host.replace(/\/$/, "");

                    API.runtime.sendMessage(API.runtime.id, {
                        method: "initNextcloudConnection",
                        args: {
                            host: $scope.settings.nextcloud_host,
                            username: $scope.settings.nextcloud_username,
                            password: $scope.settings.nextcloud_password,
                        }
                    }).then((_) => {
                        API.runtime.sendMessage(API.runtime.id, {
                            method: "getVaults",
                        }).then(function (vaults) {
                            if (vaults.hasOwnProperty('error')) {
                                let errors = API.i18n.getMessage('invalid_response_from_server', [vaults.result.status, vaults.result.statusText]);
                                $scope.errors.push(errors);
                                notify(errors);
                                callback(false);
                            } else {
                                $scope.vaults = vaults;
                                callback(true);
                            }
                            $scope.$apply();
                        });
                    });
                },
                vault: function (callback) {
                    API.runtime.sendMessage(API.runtime.id, {
                        method: "decryptString",
                        args: {
                            challenge_password: $scope.settings.default_vault.challenge_password,
                            vault_password: $scope.settings.vault_password
                        }
                    }).then(function (result) {
                        if (result === '') {
                            let errors = API.i18n.getMessage('invalid_vault_password');
                            $scope.errors.push(errors);
                            notify(errors);
                            callback(false);
                        } else {
                            callback(true);
                            $scope.$apply();
                        }
                    });
                },
                master: function (callback) {
                    if ($scope.settings.master_password !== $scope.settings.master_password_repeat) {
                        notify(API.i18n.getMessage('no_password_match'));
                        callback(false);
                        return;
                    }

                    if ($scope.settings.master_password.trim() !== '') {
                        callback(true);
                    } else {
                        notify(API.i18n.getMessage('empty_master_key'));
                        callback(false);
                    }
                }
            };
            $scope.saving = false;
            $scope.next = function () {
                $scope.saving = true;
                $scope.errors = [];
                $timeout(function () {
                    var step = StepsService.getCurrent().name;
                    var check = $scope.check[step];
                    if (typeof check === "function") {
                        check(function (result) {
                            $scope.saving = false;
                            if (result) {
                                $scope.errors = [];
                                $scope.$apply();
                                StepsService.steps().next();
                            }
                            $timeout(function () {
                                $scope.errors = [];
                                $scope.$apply();
                            }, 5000);
                        });
                    }
                    else {
                        $scope.saving = false;
                        StepsService.steps().next();
                    }
                }, 10);
            };

            var handleCheck = function (resultUrl) {
                $scope.settings.nextcloud_host = resultUrl;
            };

            $scope.isHTTP = function (url) {
                return HttpsTest.isHTTP(url);
            };

            $scope.checkHost = function () {
                HttpsTest.test($scope.settings.nextcloud_host).then(handleCheck, handleCheck);
            };

            $scope.finished = function () {
                var settings = angular.copy($scope.settings);
                var master_password = settings.master_password;
                var master_password_remember = settings.master_password_remember;
                var account = {
                    nextcloud_host: settings.nextcloud_host,
                    nextcloud_username: settings.nextcloud_username,
                    nextcloud_password: settings.nextcloud_password,
                    vault: settings.default_vault,
                    vault_password: settings.vault_password
                };
                settings.accounts.push(account);
                delete settings.master_password;
                delete settings.master_password_remember;
                delete settings.nextcloud_host;
                delete settings.nextcloud_username;
                delete settings.nextcloud_password;
                delete settings.vault_password;
                delete settings.master_password_repeat;
                delete settings.default_vault;

                $scope.saving = true;

                API.runtime.sendMessage(API.runtime.id, {
                    method: "setMasterPassword",
                    args: {password: master_password, savePassword: master_password_remember}
                }).then(function () {
                    API.runtime.sendMessage(API.runtime.id, {
                        method: "saveSettings",
                        args: settings
                    }).then(function () {
                        setTimeout(function () {
                            $rootScope.setup = false;
                                API.runtime.sendMessage(API.runtime.id, {
                                method: "closeSetupTab"
                            });
                            $scope.saving = false;
                        }, 750);
                    });
                });


            };
            $scope.closeWindow = function () {
                setTimeout(function () {
                    window.close();
                }, 500);
            };
        }]);
}());

