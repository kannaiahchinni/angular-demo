(function () {

    'use strict';


    var module = angular.module('ng-app', ['ngRoute', 'ab-base64']);



    /* Defining service to consume rest api for login details */

    function restService($http, $log, $q, $timeout, base64) {

        var loginUrl = "https://wsapi-dev.mot-solutions.com/order/v1.0/order_list?ord_num=3200016363";


        return {

            login: function (user) {

                console.debug(user);
                sessionStorage.setItem('user', JSON.stringify(user));
                return true;
            },
            checkUserSession: function () {

                var user = sessionStorage.getItem("user");
                console.log(" inside of user session method ");

                if (user != undefined) {
                    return true;
                } else {
                    return false;
                }

            },
            getProducts: function () {
                var auth = base64.encode("svc-partdash:Part01dash02"),
                    headers = {
                        "Authorization": "Basic " + auth
                    };
                console.debug(headers);

                return $http.get(loginUrl, {
                    headers: headers
                });

            }

        }



    }

    restService.inject = ['$http', '$log'];

    /*   defining controller to handle login controller */

    function loginContoller($scope, $log, restService, $location) {

        $scope.user = {};
        $scope.errorMessage = '';

        $scope.login = function () {
            console.log($scope.user);

            if ($scope.user.username != undefined && $scope.user.username != '' && $scope.user.password != undefined && $scope.password != '') {

                if (restService.login($scope.user)) {
                    $scope.errorMessage = "";
                    window.location.href = "#/home";
                    //$location.replace();
                }
            } else {
                $scope.errorMessage = "Please enter valid login details ";
            }

        }



    }

    loginContoller.inject = ['$scope', '$log', 'restService'];


    function homeContoller($scope, $log, restService, $location) {

        $scope.data = '';
        $scope.errorMessage = false;


        $scope.init = function () {

            restService.getProducts().success(function (data) {
                $scope.data = data;
                $scope.errorMessage = false;

            }).error(function (error) {
                $scope.errorMessage = true;
            });


        }

        $scope.init();


    }

    homeContoller.inject = ['$scope', '$log', 'restService'];

    module.service('restService', restService);

    // routing configuration 
    module.config(function ($routeProvider, $httpProvider, base64) {

        console.debug(base64);

        $routeProvider
            .when("/", {
                resolve: {
                    message: function (restService) {
                        if (!restService.checkUserSession()) {
                            window.location = "#/login";
                        } else {
                            window.location = "#/home";
                        }
                    }
                }
            })
            .when("/home", {
                templateUrl: "home.html",
                controller: 'homeController',
                resolve: {
                    message: function (restService) {
                        if (!restService.checkUserSession()) {
                            window.location = "#/login";
                        } else {
                            window.location = "#/home";
                        }
                    }
                }
            })
            .when("/login", {
                templateUrl: "login.html",
                controller: 'loginController'

            });


        var auth = base64.encode("foo:bar");
        $httpProvider.defaults.headers.common['Authorization'] = 'Basic ' + auth;

    });




    module.controller('loginController', loginContoller);
    module.controller('homeController', homeContoller);





})();