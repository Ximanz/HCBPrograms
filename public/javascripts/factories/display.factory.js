(function (angular) {
    function DisplayFactory($rootScope) {
        var _currentScheduleItemOutput = "";
        var _mainDisplayOutput = "";
        var _nextScheduleItemOutput = "";
        var _stageMessageOutput = "";

        return {
            getChatLog: function() {
                return _chatLog;
            },
            clearChatLog: function() {
                _chatLog.length = 0;
            }
        }
    }

    DisplayFactory.$inject = ['$rootScope'];

    angular
        .module('HCBPrograms')
        .factory('DisplayFactory', DisplayFactory);

})(angular);