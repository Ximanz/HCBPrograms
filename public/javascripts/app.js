$(document).foundation();

// Declare app level module which depends on filters, and services
var app = angular.module('HCBPrograms', ['ngResource', 'ngRoute', 'ui-notification', 'ui.sortable', 'rzModule', 'mm.foundation', 'ngMaterial']);

angular.module('HCBPrograms').config(['$routeProvider', '$locationProvider', '$httpProvider', '$mdIconProvider', 'NotificationProvider', function($routeProvider, $locationProvider, $httpProvider, $mdIconProvider, NotificationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
        .when("/", { templateUrl: "partials/index.jade", controller: "HomeCtrl" })
        .when("/view", { templateUrl: "partials/view.jade", controller: "ViewCtrl" })
        .when("/control", { templateUrl: "partials/control.jade", controller: "ControlCtrl" })
        .otherwise({ redirectTo: "/" });

    $httpProvider.interceptors.push('TokenInterceptor');

    $mdIconProvider
        .icon('navigation:menu-24', 'bower_components/material-design-icons/navigation/svg/production/ic_menu_24px.svg')
        .icon('navigation:menu-36', 'bower_components/material-design-icons/navigation/svg/production/ic_menu_36px.svg')
        .icon('navigation:chevron-left-24', 'bower_components/material-design-icons/navigation/svg/production/ic_chevron_left_24px.svg')
        .icon('navigation:chevron-left-36', 'bower_components/material-design-icons/navigation/svg/production/ic_chevron_left_36px.svg')
        .icon('navigation:chevron-right-24', 'bower_components/material-design-icons/navigation/svg/production/ic_chevron_right_24px.svg')
        .icon('navigation:chevron-right-36', 'bower_components/material-design-icons/navigation/svg/production/ic_chevron_right_36px.svg')
        .icon('hardware:keyboard-24', 'bower_components/material-design-icons/hardware/svg/production/ic_keyboard_24px.svg')
        .icon('action:build-24', 'bower_components/material-design-icons/action/svg/production/ic_build_24px.svg')
        .icon('action:settings-24', 'bower_components/material-design-icons/action/svg/production/ic_settings_24px.svg')
        .icon('action:power-24', 'bower_components/material-design-icons/action/svg/production/ic_power_settings_new_24px.svg');

    NotificationProvider.setOptions({
        delay: 5000,
        startTop: 20,
        startRight: 10,
        verticalSpacing: 20,
        horizontalSpacing: 20,
        positionX: 'right',
        positionY: 'top'
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