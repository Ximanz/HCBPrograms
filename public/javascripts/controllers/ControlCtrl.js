angular.module('HCBPrograms').controller("ControlCtrl", function($scope, SessionFactory, ScheduleFactory, Notification) {
    SessionFactory.setResumeState({role: 'control'});

    $scope.schedule = ScheduleFactory.getSchedule(new Date().toDateString());
    $scope.scheduleList = [];

    $scope.loadSchedules = function() {
        ScheduleFactory.getScheduleList(function(response){
            $scope.scheduleList = angular.copy(response.data);
        })
    };
});