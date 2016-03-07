angular.module('HCBPrograms').controller("ControlCtrl", function($scope, $http, $modal, SessionFactory, ScheduleFactory, NotificationFactory) {
    $scope.schedule = LoadScheduleFromResumeState();
    $scope.scheduleList = [];

    SaveState();

    $scope.sortableOptions = {
        handle: '.handle',
        axis: 'y'
    };

    $scope.loadSchedules = function() {
        ScheduleFactory.getScheduleList(
            function(response){
                $scope.scheduleList = angular.copy(response.data);
                var modalInstance = $modal.open({
                    templateUrl: '/partials/scheduleList.jade',
                    controller: 'ScheduleListPopupCtrl',
                    windowClass: 'large',
                    resolve: {
                        scheduleList: function() { return $scope.scheduleList; }
                    }
                });

                modalInstance.result.then(function(schedule) {
                    ScheduleFactory.loadSchedule(schedule.name);
                })
            }, function(error){

            });
    };

    $scope.saveSchedule = function() {
        ScheduleFactory.saveSchedule(function(response){
            NotificationFactory.displayAll(response.data.messages);
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