angular.module('HCBPrograms').controller("ViewCtrl", function($scope, $location, $timeout, SessionFactory, ScheduleFactory, TimerFactory, SocketFactory, DisplayFactory) {
    $scope.pageClass = 'view-screen';

    $timeout(function() {
        $scope.controlUser = SocketFactory.getControlUser();
        $scope.controlStatus = SocketFactory.getControlStatus();
        $scope.schedule = ScheduleFactory.getSchedule();
        $scope.mainTimer = TimerFactory.getTimer('main-timer');
        $scope.systemTimer = TimerFactory.getTimer('system-timer', 0, 1000);
        $scope.stageMessage = DisplayFactory.getStageMessage();
        $scope.previousScheduleItem = DisplayFactory.getPreviousScheduleItem();
        $scope.currentScheduleItem = DisplayFactory.getCurrentScheduleItem();
        $scope.nextScheduleItem = DisplayFactory.getNextScheduleItem();

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

    }, 2000, true);

    $scope.currentTime = "";
    $scope.serviceEndTime = "";
    $scope.mainTimerOutput = "00:00";


    SaveState();

    $scope.goToControlView = function() {
        $location.path("/control");
    };

    $scope.logout = function() {
        SessionFactory.destroy();
        SocketFactory.getSocket().disconnect();
        $location.path("/");
    };

    function SaveState() {
        var resumeState = SessionFactory.getResumeState() || {};

        resumeState.role = 'view';

        SessionFactory.setResumeState(resumeState);
    }
});