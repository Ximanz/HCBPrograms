angular.module('HCBPrograms').controller("HomeCtrl", function($scope, $location) {
    $scope.screenName = "Program Manager";
    $scope.password = "";

    $scope.connect = function(role) {
        console.log("connect");

        function success(response) {
            console.log("success", response);
            if (role == 'controller') {
                $location.path("/control");
            } else {
                $location.path("/view");
            }
        }

        function failure(response) {
            console.log("failure", response);
        }


    }
});