angular.module('HCBPrograms').controller("ControlCtrl", function($scope, $http, $modal, SessionFactory, ScheduleFactory, Notification) {
    SessionFactory.setResumeState({role: 'control'});

    $scope.schedule = ScheduleFactory.getSchedule(new Date().toDateString());
    $scope.scheduleList = [];

    $scope.loadSchedules = function() {
        ScheduleFactory.getScheduleList(function(response){
            $scope.scheduleList = angular.copy(response.data);
        })
    };

    $scope.addScheduleItem = function(index) {
        var modalInstance = $modal.open({
            templateUrl: '/partials/addScheduleItem.jade',
            controller: 'AddScheduleItemPopupCtrl',
            windowClass: 'tiny'
        });

        modalInstance.result.then(function(scheduleItem) {
            $scope.schedule.insertItem(index, scheduleItem.name, scheduleItem.duration);
        })
    }
});