(function (angular) {
    function DisplayFactory() {
        var _stageMessage = {
            content: "",
            red: false,
            blink: false
        };

        var _previousScheduleItem = "";
        var _currentScheduleItem = "";
        var _nextScheduleItem = "";

        return {
            getStageMessage: function() {
                return _stageMessage;
            },
            getPreviousScheduleItem: function() {
                return _previousScheduleItem;
            },
            getCurrentScheduleItem: function() {
                return _currentScheduleItem;
            },
            getNextScheduleItem: function() {
                return _nextScheduleItem;
            }
        }
    }

    angular
        .module('HCBPrograms')
        .factory('DisplayFactory', DisplayFactory);

})(angular);