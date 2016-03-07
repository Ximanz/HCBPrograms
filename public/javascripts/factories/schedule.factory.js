(function (angular) {
    function ScheduleFactory($http, NotificationFactory) {
        // Schedule
        function Schedule(name, finishTime) {
            this.name = name;
            this.finishTime = finishTime || new Date(new Date().setHours(18,0,0,0));
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
            this.initialise(source.finishTime, true);

            this.name = source.name;
            this.scheduleItems = source.scheduleItems.slice();

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
                            _schedule.merge(response.data);
                        },
                        function(response){
                            NotificationFactory.displayAll(response.data.messages);
                        }
                    );
            },
            getScheduleList: function(successCallback) {
                $http.get('/api/schedule')
                    .then(
                        function(response) {
                            successCallback(response);
                        },
                        function(response){
                            NotificationFactory.displayAll(response.data.messages);
                        }
                    );
            },
            saveSchedule: function(successCallback) {
                $http.post('/api/schedule/', _schedule)
                    .then(
                        function(response) {
                            successCallback(response);
                        },
                        function(response){
                            NotificationFactory.displayAll(response.data.messages);
                        }
                    );
            },
            deleteSchedule: function(name, successCallback) {
                $http.delete('/api/schedule/' + name)
                    .then(
                        function(response) {
                            successCallback(response);
                        },
                        function(response){
                            NotificationFactory.displayAll(response.data.messages);
                        }
                    );
            }
        }
    }

    ScheduleFactory.$inject = ['$http', "NotificationFactory"];

    angular
        .module('HCBPrograms')
        .factory('ScheduleFactory', ScheduleFactory);
})(angular);