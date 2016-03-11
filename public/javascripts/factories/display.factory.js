(function (angular) {
    function DisplayFactory() {
        var _stageMessage = {
            content: "",
            red: false,
            blink: false
        };

        return {
            getStageMessage: function() {
                return _stageMessage;
            }
        }
    }

    angular
        .module('HCBPrograms')
        .factory('DisplayFactory', DisplayFactory);

})(angular);