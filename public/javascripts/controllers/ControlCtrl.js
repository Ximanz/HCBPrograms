angular.module('HCBPrograms').controller("ControlCtrl", function($scope, $http, $modal, $location, $timeout, SessionFactory, ScheduleFactory, TimerFactory, DisplayFactory, ChatFactory, SocketFactory, NotificationFactory) {
    $scope.pageClass = 'control-screen';

    $scope.scheduleList = [];
    $scope.currentTime = "";
    $scope.serviceEndTime = "";
    $scope.mainTimerOutput = "00:00";

    SaveState();

    $scope.sortableOptions = {
        handle: '.handle',
        axis: 'y'
    };

    $scope.initialise = function() {
        if (!SocketFactory.getAuthenticated()) {
            NotificationFactory.displayOne({type: 'error', content: 'Please log in'});
            SessionFactory.destroy();
            $location.path("/");
            return;
        }

        $scope.controlUser = SocketFactory.getControlUser();
        $scope.controlStatus = SocketFactory.getControlStatus();
        $scope.schedule = ScheduleFactory.getSchedule();
        $scope.mainTimer = TimerFactory.getTimer('main-timer');
        $scope.systemTimer = TimerFactory.getTimer('system-timer', 0, 1000);
        $scope.stageMessage = DisplayFactory.getStageMessage();
        $scope.chatLog = ChatFactory.getChatLog();

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

        $scope.systemTimer
            .setOverCount(true)
            .onTick(function() {
                $scope.currentTime = moment().format('h:mm:ss a');
                if ($scope.schedule.live) {
                    $scope.serviceEndTimeLabel = $scope.schedule.finishTime < Date.now() ? "Schedule has ended" : "Schedule will end";
                    $scope.serviceEndTime = moment($scope.schedule.finishTime).fromNow();
                } else {
                    $scope.serviceEndTimeLabel = "";
                    $scope.serviceEndTime = "Schedule Not Started";
                }
            })
            .onTick(function(){
                SocketFactory.sendHeartbeat();
            })
            .start();

        $scope.$watch('schedule.name', function() {
            if ($scope.controlStatus.status == 'in-control') SocketFactory.updateSchedule();
        });

        $scope.$watch('schedule.finishTime', function() {
            if ($scope.controlStatus.status == 'in-control') SocketFactory.updateSchedule();
        });

        $scope.$watch('stageMessage', function() {
            if ($scope.controlStatus.status == 'in-control') SocketFactory.updateStageMessage();
        }, true);

        $scope.$watch('mainTimer.overCount', function() {
            if ($scope.controlStatus.status == 'in-control') SocketFactory.updateTimer();
        });

        if ($scope.schedule.live) {
            $scope.startScheduleItem($scope.schedule.currentScheduleItemNumber, true);
        }
    };

    $scope.goToLiveView = function() {
        $location.path("/view");
    };

    $scope.requestControl = function() {
        SocketFactory.requestControl();
    };

    $scope.releaseControl = function() {
        SocketFactory.releaseControl();
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
                    SocketFactory.updateSchedule();
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
            SocketFactory.updateSchedule();
        })
    };

    $scope.removeScheduleItem = function(index) {
        $scope.schedule.removeItem(index);
        SocketFactory.updateSchedule();
    };

    $scope.startSchedule = function() {
        if ($scope.schedule.scheduleItems.length == 0) {
            NotificationFactory.displayOne({type: 'error', content: 'There are no items to run in this schedule'});
            return;
        }
        ScheduleFactory.startSchedule();
        $scope.startScheduleItem($scope.schedule.currentScheduleItemNumber);
        SocketFactory.updateSchedule();
    };

    $scope.cancelSchedule = function() {
        ScheduleFactory.cancelSchedule();
        $scope.previousScheduleItem = "";
        $scope.currentScheduleItem = "";
        $scope.nextScheduleItem = "";
        $scope.stopTimer();
        SocketFactory.updateSchedule();
    };

    $scope.goToNextScheduleItem = function() {
        if ($scope.schedule.currentScheduleItemNumber < $scope.schedule.scheduleItems.length - 1) {
            $scope.schedule.currentScheduleItemNumber++;
            $scope.startScheduleItem($scope.schedule.currentScheduleItemNumber);
            SocketFactory.updateSchedule();
        }
    };

    $scope.goToPreviousScheduleItem = function() {
        if ($scope.schedule.currentScheduleItemNumber > 0) {
            $scope.schedule.currentScheduleItemNumber--;
            $scope.startScheduleItem($scope.schedule.currentScheduleItemNumber);
            SocketFactory.updateSchedule();
        }
    };

    $scope.startScheduleItem = function(index, ignoreTimer) {
        $scope.previousScheduleItem = (index > 0) ? $scope.schedule.scheduleItems[index-1].name : "";
        $scope.currentScheduleItem = $scope.schedule.scheduleItems[index].name;
        $scope.nextScheduleItem = (index < $scope.schedule.scheduleItems.length - 1) ? $scope.schedule.scheduleItems[index+1].name : "";

        if (ignoreTimer) return;

        var scheduledStartTime = $scope.schedule.getScheduledStartFromFinish(index);
        if (scheduledStartTime.isBefore()) {
            $scope.setCountdownTo(scheduledStartTime.add($scope.schedule.scheduleItems[index].duration, 'minutes').toDate());
        } else {
            $scope.setCountdownFor($scope.schedule.scheduleItems[index].duration);
        }
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

    $scope.logout = function() {
        SessionFactory.destroy();
        SocketFactory.disconnect();
        $location.path("/");
    };

    if (SocketFactory.getAuthenticated()) {
        $scope.initialise();
    }

    $scope.$on('hcb-socket-connected', function() {
        $scope.initialise();
    });

    function SaveState() {
        var resumeState = SessionFactory.getResumeState() || {};

        resumeState.role = 'control';

        SessionFactory.setResumeState(resumeState);
    }
});