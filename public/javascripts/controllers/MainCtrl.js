angular.module('HCBPrograms').controller("MainCtrl", function($rootScope, $scope, $location, $timeout, SocketFactory, SessionFactory, NotificationFactory) {
    $scope.socketConnected = false;

    $scope.$on('connection-approved', function() {
        SocketFactory
            .initialise()
            .then(
                function() {
                    console.log("Main controller socket connected");
                    $rootScope.$broadcast('hcb-socket-connected');
                    $scope.socketConnected = true;
                    SocketFactory.configure();
                    SocketFactory.getSchedule();
                    SocketFactory.getTimer();
                    SocketFactory.getStageMessage();
                    SocketFactory.getChatLog();
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