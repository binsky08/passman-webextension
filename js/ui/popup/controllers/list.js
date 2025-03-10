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
        .controller('ListCtrl', ['$scope', function ($scope) {
            $scope.app = 'passman';


            /**
             * Connect to the background service
             */
            var initApp = function () {
                API.runtime.sendMessage(API.runtime.id, {method: "getMasterPasswordSet"}).then(function (isPasswordSet) {
                    //First check attributes
                    if (!isPasswordSet) {
                        window.location = '#!/locked';
                        return;
                    }

                    getActiveTab();
                });
            };



            var getActiveTab = function () {
                API.tabs.query({currentWindow: true, active: true}).then(function (tab) {
                    API.runtime.sendMessage(API.runtime.id, {
                        method: "getCredentialsByUrl",
                        args: [tab[0].url]
                    }).then(function (_logins) {
                        //var url = backgroundPage.processURL(tab.url, $rootScope.app_settings.ignoreProtocol, $rootScope.app_settings.ignoreSubdomain, $rootScope.app_settings.ignorePath);
                        $scope.found_credentials = _logins;
                        $scope.$apply();
                    });
                });
            };

            initApp();

            $scope.editCredential = function (credential) {
                window.location = '#!/edit/' + credential.guid;
            };
        }]);
}());

