angular.module('HCBPrograms').controller("HomeCtrl", function($scope, $location, AuthFactory, SessionFactory) {
    var resumeState = SessionFactory.getResumeState();
    if (resumeState != undefined) {
        switch (resumeState.role) {
            case 'control':
                $scope.$emit('connection-approved');
                $location.path("/control");
                return;
            case 'view':
                $scope.$emit('connection-approved');
                $location.path("/view");
                return;
        }
    }

    SessionFactory.setResumeState({role: 'none'});

    $scope.screenName = SessionFactory.getScreenName();

    if ($scope.screenName == undefined || $scope.screenName == "")
        $scope.screenName = "Program Manager";

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