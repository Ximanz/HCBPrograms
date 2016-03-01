angular.module('HCBPrograms').controller("ControlCtrl", function($scope, SessionFactory) {
    SessionFactory.setResumeState({role: 'control'});


});