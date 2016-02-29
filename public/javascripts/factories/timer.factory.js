(function (angular) {
    function TimerFactory($http) {
        const granularity = 1000;
        var tickFunctions = [];

        var duration;
        var running = false;

        return {
            countdown: function() {
                if (running) return;

                running = true;

                var start = Date.now(),
                    diff, obj;

                (function timer() {
                    diff = duration - Math.floor((Date.now() - start) / 1000);

                    if (diff > 0) {
                        setTimeout(timer, granularity);
                    } else {
                        diff = 0;
                        running = false;
                    }

                    tickFunctions.forEach
                }());
            },

            countup: function() {

            },

            parse: function(seconds) {
                return {
                    'hours'     : Math.floor(seconds / 3600),
                    'minutes'   : Math.floor(seconds / 60),
                    'seconds'   : Math.floor(seconds % 60)
                };
            }
        }
    }

    TimerFactory.$inject = ['$http'];

    angular
        .module('HCBPrograms')
        .factory('TimerFactory', TimerFactory);
})(angular);