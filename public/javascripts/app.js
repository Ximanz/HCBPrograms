$(document).foundation();

// Declare app level module which depends on filters, and services
var app = angular.module('HCBPrograms', ['ngResource', 'ngRoute', 'ui-notification']);

angular.module('HCBPrograms').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when("/", { templateUrl: "partials/index.jade", controller: "HomeCtrl" })
        .when("/view", { templateUrl: "partials/view.jade", controller: "ViewCtrl" })
        .when("/control", { templateUrl: "partials/control.jade", controller: "ControlCtrl" })
        .otherwise({ redirectTo: "/" });
}]);