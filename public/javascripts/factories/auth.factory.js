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
                        SessionFactory.setScreenName(res.data.user.screenName);
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
    }

    function SessionFactory(StorageFactory) {
        return {
            _user: JSON.parse(StorageFactory.getLocal('session.user')),
            _accessToken: JSON.parse(StorageFactory.getLocal('session.accessToken')),
            _expiry: JSON.parse(StorageFactory.getLocal('session.expiry')),
            _resumeState: JSON.parse(StorageFactory.getLocal('session.resumeState')),
            _screenName: JSON.parse(StorageFactory.getSession('session.screenName')),
            _password: JSON.parse(StorageFactory.getSession('session.password')),

            getUser: function() {
                return this._user;
            },

            setUser: function(user) {
                this._user = user;
                StorageFactory.setLocal('session.user', angular.toJson(user));
                return this;
            },

            getAccessToken: function(){
                return this._accessToken;
            },

            setAccessToken: function(token){
                this._accessToken = token;
                StorageFactory.setLocal('session.accessToken', angular.toJson(token));
                return this;
            },

            getExpiry: function(){
                return this._expiry;
            },

            setExpiry: function(expiry){
                this._expiry = expiry;
                StorageFactory.setLocal('session.expiry', angular.toJson(expiry));
                return this;
            },

            getResumeState: function(){
                return this._resumeState;
            },

            setResumeState: function(resumeState){
                this._resumeState = resumeState;
                StorageFactory.setLocal('session.resumeState', angular.toJson(resumeState));
                return this;
            },

            getScreenName: function(){
                return this._screenName;
            },

            setScreenName: function(screenName){
                this._screenName = screenName;
                StorageFactory.setSession('session.screenName', angular.toJson(screenName));
                return this;
            },

            /**
             * Destroy session
             */
            destroy: function destroy(){
                this.setUser(null);
                this.setAccessToken(null);
                this.setExpiry(null);
                this.setResumeState(null);
            }
        }
    }

    function TokenInterceptor($q, SessionFactory) {
        return {
            request: function(config) {
                config.headers = config.headers || {};
                if (SessionFactory.getUser() !== null) {
                    config.headers['X-Access-Token'] = SessionFactory.getAccessToken();
                    config.headers['Content-Type'] = "application/json";
                }
                return config || $q.when(config);
            },

            response: function(response) {
                return response || $q.when(response);
            }
        };
    }

    AuthFactory.$inject = ['$location', '$http', 'SessionFactory'];
    SessionFactory.$inject = ['StorageFactory'];
    TokenInterceptor.$inject = ['$q', 'SessionFactory'];

    angular
        .module('HCBPrograms')
        .factory('AuthFactory', AuthFactory)
        .factory('SessionFactory', SessionFactory)
        .factory('TokenInterceptor', TokenInterceptor);

})(angular);
