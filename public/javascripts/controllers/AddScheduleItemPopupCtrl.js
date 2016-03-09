angular.module('HCBPrograms').controller("AddScheduleItemPopupCtrl", function($scope, $modalInstance) {
    $scope.scheduleItem = {
        name: '',
        duration: 5
    };

    $scope.opened = true;

    $scope.add = function() {
        $modalInstance.close($scope.scheduleItem);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});