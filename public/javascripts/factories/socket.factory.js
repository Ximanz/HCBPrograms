(function (angular) {
    function SocketFactory(SessionFactory, TimerFactory, ScheduleFactory, $q) {
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

                _socket.on('')
            }
        }
    }

    SocketFactory.$inject = ['SessionFactory', 'TimerFactory', 'ScheduleFactory', '$q'];

    angular
        .module('HCBPrograms')
        .factory('SocketFactory', SocketFactory);

})(angular);