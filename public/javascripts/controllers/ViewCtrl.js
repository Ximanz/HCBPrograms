angular.module('HCBPrograms').controller("ViewCtrl", function($scope, $location, $timeout, SessionFactory, ScheduleFactory, TimerFactory, SocketFactory, NotificationFactory, DisplayFactory) {
    $scope.pageClass = 'view-screen';

    $scope.currentTime = "";
    $scope.serviceEndTime = "";
    $scope.mainTimerOutput = "00:00";

    SaveState();

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

        $scope.updateScheduleItems();

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
            $scope.currentTime = moment().format('h:mm:ss a');
            if ($scope.schedule.live) {
                $scope.serviceEndTimeLabel = $scope.schedule.finishTime < Date.now() ? "Schedule has ended" : "Schedule will end";
                $scope.serviceEndTime = moment($scope.schedule.finishTime).fromNow();


            } else {
                $scope.serviceEndTimeLabel = "";
                $scope.serviceEndTime = "Schedule Not Started";
            }

        }).start();

        $scope.$watch('schedule.currentScheduleItemNumber', $scope.updateScheduleItems);
    };

    $scope.updateScheduleItems = function() {
        if ($scope.schedule.live) {
            var index = $scope.schedule.currentScheduleItemNumber;
            $scope.previousScheduleItem = (index > 0) ? $scope.schedule.scheduleItems[index-1].name : "";
            $scope.currentScheduleItem = $scope.schedule.scheduleItems[index].name;
            $scope.nextScheduleItem = (index < $scope.schedule.scheduleItems.length - 1) ? 'NEXT: ' + $scope.schedule.scheduleItems[index+1].name : "";
        }
    };

    $scope.goToControlView = function() {
        $location.path("/control");
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
        $scope.initialise()
    });

    function SaveState() {
        var resumeState = SessionFactory.getResumeState() || {};

        resumeState.role = 'view';

        SessionFactory.setResumeState(resumeState);
    }
});