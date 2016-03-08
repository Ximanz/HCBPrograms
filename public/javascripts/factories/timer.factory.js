(function (angular) {
    function TimerFactory($http) {
        // CountDownTimer
        function CountDownTimer(duration, granularity) {
            this.duration = duration;
            this.granularity = granularity || 1000;
            this.tickFtns = [];
            this.overCount = false;
            this.running = false;
        }

        CountDownTimer.prototype.start = function() {
            if (this.running) {
                return;
            }
            this.running = true;
            var finish = Date.now() + this.duration * 1000,
                self = this,
                diff, obj;

            (function timer() {
                diff = Math.floor((finish - Date.now()) / 1000);

                if (diff > 0 || self.overCount) {
                    self.timeout = setTimeout(timer, self.granularity);
                } else {
                    diff = 0;
                    self.running = false;
                }

                obj = CountDownTimer.parse(diff);
                self.tickFtns.forEach(function(ftn) {
                    ftn.call(this, obj.hours, obj.minutes, obj.seconds, obj.negative);
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
            return this;
        };

        CountDownTimer.prototype.stop = function() {
            if (!this.running) return;

            this.duration = 0;
            this.running = false;
            clearTimeout(this.timeout);

            this.tickFtns.forEach(function(ftn) {
                ftn.call(this, obj.hours, obj.minutes, obj.seconds);
            }, that);
        };

        CountDownTimer.parse = function(seconds) {
            return {
                'negative'  : seconds < 0,
                'hours'     : Math.floor(Math.abs(seconds) / 3600),
                'minutes'   : Math.floor(Math.abs(seconds) / 60),
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
                if (endTime.prototype.toString.call(date) !== '[object Date]') return;

                var duration = (endTime.getTime() - Date.now()) / 1000;
                var timer = countdownTimers[timerKey];
                timer.stop();

                if (granularity) timer.granularity = granularity;
                if (overCount) timer.overCount = overCount;
                timer.setDuration(duration).start();
            },
            countDownFor: function(timerKey, duration, granularity, overCount) {
                if (!duration || duration <= 0) return;

                var timer = countdownTimers[timerKey];
                timer.stop();

                if (granularity) timer.granularity = granularity;
                if (overCount) timer.overCount = overCount;
                timer.setDuration(duration).start();
            }
        }
    }

    TimerFactory.$inject = ['$http'];

    angular
        .module('HCBPrograms')
        .factory('TimerFactory', TimerFactory);
})(angular);