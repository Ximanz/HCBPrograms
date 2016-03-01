(function (angular) {
    function ScheduleFactory($http) {
        // Schedule
        function Schedule(finishTime) {
            this.finishTime = finishTime || new Date().setHours(18);
            this.scheduleItems = [];
        }

        Schedule.prototype.currentItem = function() {
            return this.scheduleItems.find(function(scheduleItem) {
                return scheduleItem.live;
            });
        };

        Schedule.prototype.addItem = function(name, duration) {
            this.scheduleItems.push({
                name: name,
                duration: duration,
                live: false
            });

            return this;
        };

        Schedule.prototype.insertItem = function(index, name, duration) {
            this.scheduleItems.splice(index, 0, {
                name: name,
                duration: duration,
                live: false
            });

            return this;

        };

        Schedule.prototype.removeItem = function(index) {
            this.scheduleItems.splice(index, 1);

            return this;
        };

        var _schedule;

        return {
            getSchedule: function(finishTime) {
                _schedule = _schedule || new Schedule(finishTime);

                return _schedule;
            }
        }
    }

    ScheduleFactory.$inject = ['$http'];

    angular
        .module('HCBPrograms')
        .factory('ScheduleFactory', ScheduleFactory);
})(angular);