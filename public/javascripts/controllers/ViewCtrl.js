angular.module('HCBPrograms').controller("ViewCtrl", function($scope, SessionFactory) {
    SessionFactory.setResumeState({role: 'view'});

});