(function (angular) {
    function SocketFactory(SessionFactory, TimerFactory, ScheduleFactory, ChatFactory, $q) {
        var _socket, _isAuthenticated;

        return {
            getSocket: function() {
                return _socket
            },

            getAuthenticated: function() {
                return _isAuthenticated;
            },

            initialise: function() {
                console.log('initialising socket');
                _isAuthenticated = false;

                var socketDeferred = $q.defer();

                _socket = io();

                _socket.on('authenticated', function () {
                    _isAuthenticated = true;
                    socketDeferred.resolve(true);
                    console.log('socket is jwt authenticated');
                });

                _socket.on('disconnect', function (data) {
                    socketDeferred.reject(false);
                    console.log('socket is rejected');
                });

                _socket.on('connect', function () {
                    _socket.emit('authenticate', {token: SessionFactory.getAccessToken()});
                });

                return socketDeferred.promise;
            },
            configure: function() {
                if (!_isAuthenticated) return false;

                _socket.on('chat message', function(chatMessage) {
                    ChatFactory.newChatMessage(JSON.parse(chatMessage));
                });

                _scoket.on('update schedule', function(data) {
                    var schedule = JSON.parse(data);

                    ScheduleFactory.getSchedule().merge(schedule);
                });
            },
            sendChatMessage: function(message) {
                if (!message || message.length == 0) return;

                var chatMessage = {
                    sender: SessionFactory.getUser().screenName,
                    message: message
                };

                _socket.emit('chat message', angular.toJson(chatMessage));
            },
            getSchedule: function() {
                _socket.emit('get schedule');
            },
            updateSchedule: function() {
                _socket.emit('update schedule', angular.toJson(ScheduleFactory.getSchedule()));
            },
            getTimer: function() {
                _socket.emit('get timer');
            },
            updateTimer: function() {
                _socket.emit('update timer', angular.toJson(TimerFactory.getTimer('main-timer')));
            }
        }
    }

    SocketFactory.$inject = ['SessionFactory', 'TimerFactory', 'ScheduleFactory', 'ChatFactory', '$q'];

    angular
        .module('HCBPrograms')
        .factory('SocketFactory', SocketFactory);

})(angular);