(function (angular) {
    function TimerFactory($http) {
        // CountDownTimer
        function CountDownTimer(duration, granularity) {
            this.duration = duration;
            this.granularity = granularity || 1000;
            this.tickFtns = [];
            this.running = false;
        }

        CountDownTimer.prototype.start = function() {
            if (this.running) {
                return;
            }
            this.running = true;
            var start = Date.now(),
                self = this,
                diff, obj;

            (function timer() {
                diff = self.duration - Math.floor((Date.now() - start) / 1000);

                if (diff > 0) {
                    self.timeout = setTimeout(timer, self.granularity);
                } else {
                    diff = 0;
                    self.running = false;
                }

                obj = CountDownTimer.parse(diff);
                self.tickFtns.forEach(function(ftn) {
                    ftn.call(this, obj.hours, obj.minutes, obj.seconds);
                }, that);
            }());
        };

        CountDownTimer.prototype.onTick = function(ftn) {
            if (typeof ftn === 'function') {
                this.tickFtns.push(ftn);
            }
            return this;
        };

        CountDownTimer.prototype.expired = function() {
            return !this.running;
        };

        CountDownTimer.prototype.setDuration = function(newDuration) {
            this.duration = newDuration;
        };

        CountDownTimer.prototype.modifyDuration = function(change) {
            this.duration += change;

            if (!this.running && duration > 0) {
                this.start();
            }
        };

        CountDownTimer.prototype.stop = function() {
            this.duration = 0;
            this.running = false;
            clearTimeout(this.timeout);

            this.tickFtns.forEach(function(ftn) {
                ftn.call(this, obj.hours, obj.minutes, obj.seconds);
            }, that);
        };

        CountDownTimer.parse = function(seconds) {
            return {
                'hours'     : Math.floor(seconds / 3600),
                'minutes'   : Math.floor(seconds / 60),
                'seconds'   : Math.floor(seconds % 60)
            };
        };

        var countdownTimers = {};

        return {
            getTimer: function(timerKey, duration, granularity) {
                if (!countdownTimers.hasOwnProperty(timerKey)){
                    countdownTimers[timerKey] = new CountDownTimer(duration || 60, granularity);
                }

                return countdownTimers[timerKey];
            },
            stopAll: function() {
                for (var timer in countdownTimers) {
                    if (countdownTimers.hasOwnProperty(timer)) {
                        countdowntTimers[timer].stop();
                    }
                }
            }
        }
    }

    TimerFactory.$inject = ['$http'];

    angular
        .module('HCBPrograms')
        .factory('TimerFactory', TimerFactory);
})(angular);