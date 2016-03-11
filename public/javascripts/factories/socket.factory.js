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

                _socket.on('update chat log', function(chatLog) {
                    if (!chatLog || chatLog.length == 0) return;

                    chatLog.forEach(function(chatMessage) {
                        ChatFactory.newChatMessage(JSON.parse(chatMessage));
                    });
                });

                _socket.on('update schedule', function(data) {
                    if (!data || data.length == 0) return;

                    var schedule = JSON.parse(data);

                    ScheduleFactory.getSchedule().merge(schedule);
                });

                _socket.on('update timer', function(data) {
                    if (!data || data.length == 0) return;

                    var timerSettings = JSON.parse(data);
                    if (!timerSettings.running) return;

                    TimerFactory.countDownTo('main-timer', new Date(timerSettings.finish), timerSettings.granularity, timerSettings.overCount);
                });
            },
            sendChatMessage: function(message) {
                if (!message || message.length == 0) return;

                var chatMessage = {
                    sender: SessionFactory.getUser().screenName,
                    message: message,
                    timestamp: new Date().toISOString()
                };

                _socket.emit('chat message', angular.toJson(chatMessage));
            },
            getChatLog: function() {
                _socket.emit('get chat log');
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
                var timer = TimerFactory.getTimer('main-timer');
                var data = {
                    finish: timer.finish,
                    running: timer.running,
                    overCount: timer.overCount,
                    granularity: timer.granularity
                };
                _socket.emit('update timer', angular.toJson(data));
            }
        }
    }

    SocketFactory.$inject = ['SessionFactory', 'TimerFactory', 'ScheduleFactory', 'ChatFactory', '$q'];

    angular
        .module('HCBPrograms')
        .factory('SocketFactory', SocketFactory);

})(angular);