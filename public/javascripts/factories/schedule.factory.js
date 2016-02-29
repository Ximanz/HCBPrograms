(function (angular) {
    function ScheduleFactory($http) {
        return {

        }
    }

    ScheduleFactory.$inject = ['$http'];

    angular
        .module('HCBPrograms')
        .factory('ScheduleFactory', ScheduleFactory);
})(angular);