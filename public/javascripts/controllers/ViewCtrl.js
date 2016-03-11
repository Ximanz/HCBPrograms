angular.module('HCBPrograms').controller("ViewCtrl", function($scope, SessionFactory, ScheduleFactory, TimerFactory, SocketFactory, NotificationFactory) {
    $scope.schedule = ScheduleFactory.getSchedule();

    $scope.mainTimer = TimerFactory.getTimer('main-timer');
    $scope.systemTimer = TimerFactory.getTimer('system-timer', 0, 1000);

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

    $scope.goToControlView = function() {
        $location.path("/control");
    };

    $scope.showTimeUpAlert = function() {
        $scope.mainTimer.stop();
        $scope.mainTimerOutput = "Time's Up!"
        $scope.overTime = true;
    };

    function SaveState() {
        var resumeState = SessionFactory.getResumeState() || {};

        resumeState.role = 'control';

        SessionFactory.setResumeState(resumeState);
    }
});