angular.module('HCBPrograms').controller("MainCtrl", function($scope, $location, SocketFactory, SessionFactory, NotificationFactory) {
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
                    NotificationFactory.displayOne({type: 'error', content: "There was a problem connecting to the server, please try logging in again."});
                    $location.path("/");
                    $scope.socketConnected = false;
                    SessionFactory.destroy();

                }
            );
    })

});