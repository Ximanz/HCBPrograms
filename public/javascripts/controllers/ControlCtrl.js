angular.module('HCBPrograms').controller("ControlCtrl", function($scope, SessionFactory, ScheduleFactory, Notification) {
    SessionFactory.setResumeState({role: 'control'});

    var schedule = ScheduleFactory.getSchedule(new Date().toDateString());
});