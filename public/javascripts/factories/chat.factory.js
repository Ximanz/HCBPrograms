(function (angular) {
    function ChatFactory($rootScope, NotificationFactory, SessionFactory) {
        var _chatLog = [];

        return {
            getChatLog: function() {
                return _chatLog;
            },
            clearChatLog: function() {
                _chatLog.length = 0;
            },
            newChatMessage: function(chatMessage) {
                if (!chatMessage.sender || chatMessage.sender.length == 0) {
                    NotificationFactory.displayOne({type: 'error', content: 'Message received with null sender'});
                }
                if (!chatMessage.message || chatMessage.message.length == 0) {
                    NotificationFactory.displayOne({type: 'error', content: 'Message received with no contents'});
                }

                if (chatMessage.sender == SessionFactory.getUser().screenName) {
                    chatMessage.class = 'sender';
                } else {
                    chatMessage.class = 'receiver';
                }

                _chatLog.push({
                    sender: chatMessage.sender,
                    message: chatMessage.message,
                    class: chatMessage.class,
                    timestamp: moment(chatMessage.timestamp)
                });

                $rootScope.$apply();
            }
        }
    }

    ChatFactory.$inject = ['$rootScope', 'NotificationFactory', 'SessionFactory'];

    angular
        .module('HCBPrograms')
        .factory('ChatFactory', ChatFactory);

})(angular);