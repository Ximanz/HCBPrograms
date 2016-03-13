(function (angular) {
    function DisplayFactory() {
        var _stageMessage;

        return {
            getStageMessage: function() {
                _stageMessage = _stageMessage || {
                        content: '',
                        red: false,
                        blink: false
                    };

                return _stageMessage;
            }
        }
    }

    angular
        .module('HCBPrograms')
        .factory('DisplayFactory', DisplayFactory);

})(angular);