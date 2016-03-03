$(document).foundation();

// Declare app level module which depends on filters, and services
var app = angular.module('HCBPrograms', ['ngResource', 'ngRoute', 'ui-notification']);

angular.module('HCBPrograms').config(['$routeProvider', '$locationProvider', 'NotificationProvider', function($routeProvider, $locationProvider, NotificationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when("/", { templateUrl: "partials/index.jade", controller: "HomeCtrl" })
        .when("/view", { templateUrl: "partials/view.jade", controller: "ViewCtrl" })
        .when("/control", { templateUrl: "partials/control.jade", controller: "ControlCtrl" })
        .otherwise({ redirectTo: "/" });
    NotificationProvider.setOptions({
        delay: 5000,
        startTop: 20,
        startRight: 10,
        verticalSpacing: 20,
        horizontalSpacing: 20,
        positionX: 'left',
        positionY: 'bottom',
        templateUrl: "partials/notification.jade"
    })
}]);

angular.module('HCBPrograms').run(function($rootScope, $timeout, $location) {
    $rootScope.$on('$routeChangeSuccess', function () {
        if ($location.path() == '/control') {
            $timeout(function(){
                $('#offCanvasLeft').foundation();
                $('#offCanvasRight').foundation();
            }, 100);
        }
    });
});