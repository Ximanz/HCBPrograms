$(document).foundation();

// Declare app level module which depends on filters, and services
var app = angular.module('HCBPrograms', ['ngResource', 'ngRoute', 'ui-notification', 'ui.sortable', 'rzModule', 'mm.foundation']);

angular.module('HCBPrograms').config(['$routeProvider', '$locationProvider', '$httpProvider', 'NotificationProvider', function($routeProvider, $locationProvider, $httpProvider, NotificationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when("/", { templateUrl: "partials/index.jade", controller: "HomeCtrl" })
        .when("/view", { templateUrl: "partials/view.jade", controller: "ViewCtrl" })
        .when("/control", { templateUrl: "partials/control.jade", controller: "ControlCtrl" })
        .otherwise({ redirectTo: "/" });
    $httpProvider.interceptors.push('TokenInterceptor');
    NotificationProvider.setOptions({
        delay: 5000,
        startTop: 20,
        startRight: 10,
        verticalSpacing: 20,
        horizontalSpacing: 20,
        positionX: 'top',
        positionY: 'right',
        //templateUrl: "partials/notification.jade"
    });
}]);

angular.module('HCBPrograms').run(function($rootScope, $timeout, $location) {
    $rootScope.$on('$routeChangeSuccess', function () {
        if ($location.path() == '/control') {
            $timeout(function(){
                $(document).foundation();
            }, 100);
        }
    });
});