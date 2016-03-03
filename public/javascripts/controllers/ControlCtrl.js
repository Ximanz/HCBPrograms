angular.module('HCBPrograms').controller("ControlCtrl", function($scope, SessionFactory, ScheduleFactory, Notification) {
    SessionFactory.setResumeState({role: 'control'});

    $scope.schedule = ScheduleFactory.getSchedule(new Date().toDateString());
});