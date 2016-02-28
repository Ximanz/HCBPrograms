(function (angular) {
    function SocketFactory(SessionFactory) {
        return {
            _socket : {},

            initialiseSocket: function() {

            },

            closeSocket: function() {

            },

            getSocket: function() {
                return _socket;
            },
        }
    }

    SocketFactory.$inject = ['SessionFactory'];

    angular
        .module('HCBPrograms')
        .factory('SocketFactory', SocketFactory);

})(angular);