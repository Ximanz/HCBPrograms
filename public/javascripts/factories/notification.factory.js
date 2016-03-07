(function (angular) {
    function NotificationFactory(Notification) {
        return {
            displayAll: function(messages) {
                messages.forEach(function (message) {
                    if (message.type == 'error') {
                        Notification.error({title: 'Error', message: message.content});
                    } else if (message.type == 'success') {
                        Notification.success({title: 'Success', message: message.content});
                    } else {
                        Notification.info({title: 'Info', message: message.content});
                    }
                })
            },
            displayOne: function(message) {
                displayAll([message]);
            }
        }
    }

    NotificationFactory.$inject = ['Notification'];

    angular
        .module('HCBPrograms')
        .factory('NotificationFactory', NotificationFactory);

})(angular);