(function (angular) {
    function AuthFactory($location, $http, SessionFactory) {
        return {
            isConnected: function(){
                return SessionFactory.getUser() !== null;
            },

            connect: function(screenName, password) {
                return $http
                    .post('/connect', {
                        screenName: screenName,
                        password: password
                    })
                    .then(function(res){
                        SessionFactory.setUser(res.data.user);
                        SessionFactory.setAccessToken(res.data.token);
                        SessionFactory.setExpiry(res.data.expires);
                        return res;
                    },
                    function(res){
                        return res;
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
            _expiry: JSON.parse(StorageFactory.getLocal('session.expiry')),

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
                StorageFactory.setLocal('session.accessToken', JSON.stringify(token));
                return this;
            },

            getExpiry: function(){
                return this._expiry;
            },

            setExpiry: function(expiry){
                this._expiry = expiry;
                StorageFactory.setLocal('session.expiry', JSON.stringify(expiry));
                return this;
            },

            /**
             * Destroy session
             */
            destroy: function destroy(){
                this.setUser(null);
                this.setAccessToken(null);
                this.setExpiry(null);
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
