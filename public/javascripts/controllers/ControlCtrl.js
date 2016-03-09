angular.module('HCBPrograms').controller("ControlCtrl", function($scope, $http, $modal, SessionFactory, ScheduleFactory, TimerFactory, ChatFactory, SocketFactory, NotificationFactory) {
    $scope.schedule = ScheduleFactory.getSchedule();
    $scope.mainTimer = TimerFactory.getTimer('main-timer');
    $scope.chatLog = ChatFactory.getChatLog();
    $scope.scheduleList = [];

    $scope.mainTimer.onTick(function(hour, min, sec, negative) {
    });

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
                    windowClass: 'full',
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
            windowClass: 'medium'
        });

        modalInstance.result.then(function(scheduleItem) {
            $scope.schedule.insertItem(index, scheduleItem.name, scheduleItem.duration);
            SaveState();
        })
    };

    $scope.sendChatMessage = function() {
        SocketFactory.sendChatMessage($scope.chatLine);
        $scope.chatLine = "";
        $scope.chatFocus = true;
    };

    function SaveState() {
        var resumeState = SessionFactory.getResumeState() || {};

        resumeState.role = 'control';
        resumeState.schedule = $scope.schedule;

        SessionFactory.setResumeState(resumeState);
    }
});