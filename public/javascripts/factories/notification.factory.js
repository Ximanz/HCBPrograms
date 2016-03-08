(function (angular) {
    function NotificationFactory(Notification) {
        var displayMessage = function(type, content) {
            if (type == 'error') {
                Notification.error({title: 'Error', message: content});
            } else if (type == 'success') {
                Notification.success({title: 'Success', message: content});
            } else {
                Notification({message: content});
            }
        };

        return {
            displayAll: function(messages) {
                messages.forEach(function(message) {
                    displayMessage(message.type, message.content)
                });
            },
            displayOne: function(message) {
                displayMessage(message.type, message.content);
            }
        }
    }

    NotificationFactory.$inject = ['Notification'];

    angular
        .module('HCBPrograms')
        .factory('NotificationFactory', NotificationFactory);

})(angular);