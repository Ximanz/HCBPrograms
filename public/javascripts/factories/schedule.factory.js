(function (angular) {
    function ScheduleFactory($http, Notification) {
        // Schedule
        function Schedule(name, finishTime) {
            this.name = name;
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

        Schedule.prototype.initialise = function(finishTime, clear) {
            if (clear) this.scheduleItems.length = 0;

            this.finishTime = new Date(finishTime);
        };

        Schedule.prototype.merge = function(source) {
            _schedule.initialise(source.finishTime, clear);

            _schedule.name = source.name;
            _schedule.scheduleItems = source.scheduleItems.slice();

            return this;
        };

        var _schedule;

        return {
            getSchedule: function(name) {
                _schedule = _schedule || new Schedule(name);

                return _schedule;
            },
            loadSchedule: function(name) {
                $http.get('/api/schedule/' + name)
                    .then(
                        function(response){
                            _schedule.merge(response);
                        },
                        function(response){
                            Notification.error({title: "Unable to load schedule", message: response})
                        }
                    );
            },
            getScheduleList: function(successCallback) {
                $http.get('/api/schedule')
                    .then(
                        successCallback(response),
                        function(response){
                            Notification.error({title: "Unable to load schedule list", message: response})
                        }
                    );
            },
            saveSchedule: function(successCallback) {
                $http.post('/api/schedule/', _schedule)
                    .then(
                        successCallback(response),
                        function(response){
                            Notification.error({title: "Unable to save schedule", message: response})
                        }
                    );
            },
            deleteSchedule: function(name, successCallback) {
                $http.get('/api/schedule/' + templateId)
                    .then(
                        successCallback(response),
                        function(response){
                            Notification.error({title: "Unable to save schedule", message: response})
                        }
                    );
            }
        }
    }

    ScheduleFactory.$inject = ['$http', "Notification"];

    angular
        .module('HCBPrograms')
        .factory('ScheduleFactory', ScheduleFactory);
})(angular);