(function (angular) {
    function AuthFactory($location, $http, SessionFactory) {
        return {
            isConnected: function(){
                return SessionFactory.getUser() !== null;
            },

            connect: function(screenName, password) {
                return $http
                    .post('/connect', {
                        username: screenName,
                        password: password
                    })
                    .then(function(res){
                        SessionFactory.setUser(res.user);
                        SessionFactory.setAccessToken(res.token)
                    });
            },

            disconnect: function() {
                return $http
                    .get('/disconnect')
                    .then(function(res){
                        SessionFactory.destroy();
                        $location.path( "/" );
                    });
            }
        }
    };

    function SessionFactory(StorageFactory) {
        return {
            _user: JSON.parse(StorageFactory.getLocal('session.user')),
            _accessToken: JSON.parse(StorageFactory.getLocal('session.accessToken')),

            getUser: function() {
                return this._user;
            },

            setUser: function(user) {
                this._user = user;
                StorageFactory.setLocal('session.user', JSON.stringify(user));
                return this;
            },

            getAccessToken: function(){
                return this._accessToken;
            },

            setAccessToken: function(token){
                this._accessToken = token;
                StorageFactory.setLocal('session.accessToken', token);
                return this;
            },

            /**
             * Destroy session
             */
            destroy: function destroy(){
                this.setUser(null);
                this.setAccessToken(null);
            }
        }
    }

    AuthFactory.$inject = ['$location', '$http', 'SessionFactory'];
    SessionFactory.$inject = ['StorageFactory'];

    angular
        .module('HCBPrograms')
        .factory('AuthFactory', AuthFactory)
        .factory('SessionFactory', SessionFactory);

})(angular);
