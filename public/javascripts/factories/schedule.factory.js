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

        Schedule.prototype.firstItem = function() {
            var sequence = this.scheduleItems.reduce(function(sequence, scheduleItem) {
                return Math.min(sequence, scheduleItem.sequence);
            });

            return this.scheduleItems.find(function(scheduleItem){
                return scheduleItem.sequence == sequence;
            })
        };

        Schedule.prototype.lastItem = function() {
            var sequence = this.scheduleItems.reduce(function(sequence, scheduleItem) {
                return Math.max(sequence, scheduleItem.sequence);
            });

            return this.scheduleItems.find(function(scheduleItem){
                return scheduleItem.sequence == sequence;
            })
        };

        Schedule.prototype.add = function(index, name, duration) {

        };

        return {

        }
    }

    ScheduleFactory.$inject = ['$http'];

    angular
        .module('HCBPrograms')
        .factory('ScheduleFactory', ScheduleFactory);
})(angular);