(function (angular) {
    function ScheduleFactory($http, NotificationFactory) {
        // Schedule
        function Schedule(name, finishTime) {
            this.name = name;
            this.finishTime = finishTime || new Date(new Date().setHours(18,0,0,0));
            this.scheduleItems = [];
            this.live = false;
            this.currentScheduleItemNumber = -1;
        }

        Schedule.prototype.currentItem = function() {
            if (!this.live) return null;

            return this.scheduleItems[this.currentScheduleItemNumber];
        };

        Schedule.prototype.addItem = function(name, duration) {
            this.scheduleItems.push({
                name: name,
                duration: duration
            });

            return this;
        };

        Schedule.prototype.insertItem = function(index, name, duration) {
            this.scheduleItems.splice(index, 0, {
                name: name,
                duration: duration
            });

            if (index <= this.currentScheduleItemNumber) this.currentScheduleItemNumber++;

            return this;
        };

        Schedule.prototype.removeItem = function(index) {
            if (index == this.currentScheduleItemNumber && this.live) {
                NotificationFactory.displayOne({type: 'error', content: this.scheduleItems[index].name + " is currently live and cannot be removed"});
                return;
            }

            this.scheduleItems.splice(index, 1);

            if (index < this.currentScheduleItemNumber) this.currentScheduleItemNumber--;

            return this;
        };

        Schedule.prototype.initialise = function(finishTime, clear) {
            if (clear) this.scheduleItems.length = 0;

            this.finishTime = new Date(finishTime);
        };

        Schedule.prototype.merge = function(source) {
            var finishTime = new Date();
            var sourceTime = new Date(source.finishTime);
            finishTime.setHours(sourceTime.getHours(), sourceTime.getMinutes(), 0, 0);

            this.initialise(finishTime, true);

            this.name = source.name;
            this.scheduleItems = source.scheduleItems.slice();

            return this;
        };

        Schedule.prototype.getScheduledStartFromFinish = function(index) {
            if (index >= this.scheduleItems.length) return 0;

            var scheduleItemStartTime = this.scheduleItems.reduce(function(startTime, scheduleItem, idx){
                if (idx >= index) startTime.setMinutes(startTime.getMinutes()-scheduleItem.duration);
                return startTime;
            }, new Date(this.finishTime));

            return moment(scheduleItemStartTime);
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
            },
            startSchedule: function() {
                _schedule.live = true;
                _schedule.currentScheduleItemNumber = 0;
            }
        }
    }

    ScheduleFactory.$inject = ['$http', "NotificationFactory"];

    angular
        .module('HCBPrograms')
        .factory('ScheduleFactory', ScheduleFactory);
})(angular);