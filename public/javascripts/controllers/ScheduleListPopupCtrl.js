angular.module('HCBPrograms').controller("ScheduleListPopupCtrl", function($scope, $modalInstance, ScheduleFactory, scheduleList) {
    $scope.scheduleList = scheduleList;

    $scope.open = function(schedule) {
        $modalInstance.close(schedule);
    };

    $scope.delete = function(schedule, index) {
        ScheduleFactory.deleteSchedule(schedule.name, function(response){
            $scope.scheduleList.splice(index, 1);
        });
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});