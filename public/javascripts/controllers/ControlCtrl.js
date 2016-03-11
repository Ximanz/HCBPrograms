angular.module('HCBPrograms').controller("ControlCtrl", function($scope, $http, $modal, $location, SessionFactory, ScheduleFactory, TimerFactory, ChatFactory, SocketFactory, NotificationFactory) {
    $scope.schedule = ScheduleFactory.getSchedule();

    $scope.mainTimer = TimerFactory.getTimer('main-timer');
    $scope.systemTimer = TimerFactory.getTimer('system-timer', 0, 1000);

    $scope.chatLog = ChatFactory.getChatLog();
    $scope.scheduleList = [];
    $scope.currentTime = "";
    $scope.serviceEndTime = "";
    $scope.mainTimerOutput = "00:00";

    $scope.mainTimer.onTick(function(hour, min, sec, negative) {
        if ($scope.mainTimer.timeup) {
            $scope.mainTimerOutput = "Time's Up!";
            $scope.overTime = true;
        } else {
            $scope.mainTimerOutput = (negative ? "-" : "")
                + (hour > 0 ? String("00" + hour + ":").slice(-3) : "")
                + String("00" + min + ":").slice(-3)
                + String("00" + sec).slice(-2);

            $scope.overTime = negative;
        }
    });

    $scope.systemTimer.setOverCount(true).onTick(function() {
        $scope.currentTime = moment().format('h.mm:ss a');
        $scope.serviceEndTime = moment($scope.schedule.finishTime).fromNow();
        $scope.serviceEndTimeLabel = $scope.schedule.finishTime < Date.now() ? "Schedule has ended" : "Schedule will end";
    }).start();

    SaveState();

    $scope.sortableOptions = {
        handle: '.handle',
        axis: 'y'
    };

    $scope.goToLiveView = function() {
        $location.path("/view");
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

    $scope.setCountdownFor = function(duration) {
        TimerFactory.countDownFor('main-timer', duration * 60);
        SocketFactory.updateTimer();
    };

    $scope.setCountdownTo = function(endTime) {
        TimerFactory.countDownTo('main-timer', endTime);
        SocketFactory.updateTimer();
    };

    $scope.stopTimer = function() {
        $scope.mainTimer.timeup = false;
        $scope.mainTimer.stop();
        SocketFactory.updateTimer();
    };

    $scope.showTimeUpAlert = function() {
        $scope.mainTimer.timeup = true;
        $scope.mainTimer.stop();
        SocketFactory.updateTimer();
    };

    function SaveState() {
        var resumeState = SessionFactory.getResumeState() || {};

        resumeState.role = 'control';

        SessionFactory.setResumeState(resumeState);
    }
});