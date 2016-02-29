angular.module('HCBPrograms').controller("HomeCtrl", function($scope, $location, AuthFactory) {
    $scope.screenName = "Program Manager";
    $scope.password = "";

    $scope.connect = function(role) {
        console.log("connect");

        function success(response) {
            console.log("success", response);

            $scope.$emit('connection-approved');

            if (role == 'controller') {
                $location.path("/control");
            } else {
                $location.path("/view");
            }
        }

        function failure(response) {
            console.log("failure", response);
        }

        AuthFactory
            .connect($scope.screenName, $scope.password)
            .then(function(response){
                if (AuthFactory.isConnected()) {
                    success(response);
                } else {
                    failure(response);
                }
            })
    }
});