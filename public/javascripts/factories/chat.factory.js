(function (angular) {
    function ChatFactory(NotificationFactory, SessionFactory) {
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

                _chatLog.push(chatMessage);
            }
        }
    }

    ChatFactory.$inject = ['NotificationFactory', 'SessionFactory'];

    angular
        .module('HCBPrograms')
        .factory('ChatFactory', ChatFactory);

})(angular);