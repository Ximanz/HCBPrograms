(function (angular) {
    function ChatFactory(Notification) {
        var _chatLog = [];

        return {
            getChatLog: function() {
                return _chatLog;
            },
            clearChatLog: function() {
                _chatLog.length = 0;
            },
            newChatMessage: function(chatMessage) {
                _chatLog.push(chatMessage);
            }
        }
    }

    NotificationFactory.$inject = ['Notification'];

    angular
        .module('HCBPrograms')
        .factory('ChatFactory', ChatFactory);

})(angular);