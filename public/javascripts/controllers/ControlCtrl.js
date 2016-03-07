angular.module('HCBPrograms').controller("ControlCtrl", function($scope, $http, $modal, SessionFactory, ScheduleFactory, Notification) {
    $scope.schedule = LoadScheduleFromResumeState();
    $scope.scheduleList = [];

    SaveState();

    $scope.sortableOptions = {
        handle: '.handle',
        axis: 'y'
    };

    $scope.toggle = function(selector) {
        $(selector).foundation('toggle');
    };

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
            SaveState();
        })
    };

    function SaveState() {
        var resumeState = SessionFactory.getResumeState() || {};

        resumeState.role = 'control';
        resumeState.schedule = $scope.schedule;

        SessionFactory.setResumeState(resumeState);
    }

    function LoadScheduleFromResumeState() {
        var resumeState = SessionFactory.getResumeState();
        var schedule = ScheduleFactory.getSchedule(new Date().toDateString());

        if (resumeState != undefined && resumeState.schedule) {
            schedule.merge(resumeState.schedule)
        }

        return schedule;
    }
});