angular.module('HCBPrograms').controller("MainCtrl", function($scope, $location, SocketFactory) {
    $scope.socketConnected = false;

    $scope.$on('connection-approved', function() {
        SocketFactory
            .initialise()
            .then(
                function() {
                    console.log("Main controller socket connected");
                    $scope.socketConnected = true;
                },
                function(){
                    console.log("Main controller socket failed");
                    $location.path("/");
                    $scope.socketConnected = false;
                }
            );
    })

});