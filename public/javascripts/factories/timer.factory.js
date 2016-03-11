(function (angular) {
    function TimerFactory($timeout) {
        function CountDownTimer(duration, granularity) {
            this.duration = duration;
            this.granularity = granularity || 1000;
            this.tickFtns = [];
            this.overCount = false;
            this.running = false;
            this.timeup = false;
        }

        CountDownTimer.prototype.start = function() {
            if (this.running) {
                return;
            }
            this.running = true;
            this.finish = Date.now() + this.duration * 1000;
            var self = this,
                diff, obj;

            (function timer() {
                diff = Math.floor((self.finish - Date.now()) / 1000);

                if (diff > 0 || self.overCount) {
                    self.timeout = $timeout(timer, self.granularity, true);
                } else {
                    diff = 0;
                    self.running = false;
                }

                obj = CountDownTimer.parse(diff);
                self.tickFtns.forEach(function(ftn) {
                    ftn.call(this, obj.hours, obj.minutes, obj.seconds, obj.negative);
                }, self);
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
            return this;
        };

        CountDownTimer.prototype.setOverCount = function(overCount) {
            this.overCount = overCount;
            return this;
        };

        CountDownTimer.prototype.stop = function() {
            this.duration = 0;
            this.running = false;
            $timeout.cancel(this.timeout);

            this.tickFtns.forEach(function(ftn) {
                ftn.call(this, 0, 0, 0);
            }, this);
        };

        CountDownTimer.parse = function(seconds) {
            return {
                'negative'  : seconds < 0,
                'hours'     : Math.floor(Math.abs(seconds) / 3600),
                'minutes'   : Math.floor(Math.abs(seconds % 3600) / 60),
                'seconds'   : Math.floor(Math.abs(seconds) % 60)
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
            removeTimer: function(timerKey) {
                if (!countdownTimers.hasOwnProperty(timerKey)){
                    countdownTimers[timerKey].stop();
                    delete countdownTimers[timerKey];
                }
            },
            stopAll: function() {
                for (var timer in countdownTimers) {
                    if (countdownTimers.hasOwnProperty(timer)) {
                        countdownTimers[timer].stop();
                    }
                }
            },
            countDownTo: function(timerKey, endTime, granularity, overCount) {
                if (endTime == undefined || !(endTime instanceof Date)) return;

                var convertedEndTime = new Date();
                convertedEndTime.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);

                var duration = (convertedEndTime.getTime() - Date.now()) / 1000;
                var timer = countdownTimers[timerKey] || (countdownTimers[timerKey] = new CountDownTimer(duration));
                timer.stop();

                if (granularity) timer.granularity = granularity;
                if (overCount) timer.overCount = overCount;
                timer.timeout = false;
                timer.setDuration(duration).start();
            },
            countDownFor: function(timerKey, duration, granularity, overCount) {
                if (!duration || duration <= 0) return;

                var timer = countdownTimers[timerKey] || (countdownTimers[timerKey] = new CountDownTimer(duration));
                timer.stop();

                if (granularity) timer.granularity = granularity;
                if (overCount) timer.overCount = overCount;
                timer.timeout = false;
                timer.setDuration(duration).start();
            }
        }
    }

    TimerFactory.$inject = ['$timeout'];

    angular
        .module('HCBPrograms')
        .factory('TimerFactory', TimerFactory);
})(angular);