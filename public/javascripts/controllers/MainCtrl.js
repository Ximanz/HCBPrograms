angular.module('HCBPrograms').controller("MainCtrl", function($scope, $location, SocketFactory) {
    $scope.$on('connection-approved', function() {
        SocketFactory
            .initialise()
            .then(
                function() {
                    console.log("Main controller socket connected");
                },
                function(){
                    console.log("Main controller socket failed");
                    $location.path("/");
                }
            );
    })

});