(function (angular) {
    function StorageFactory($window) {
        return {
            setLocal: function(key, value) {
                try {
                    if ($window.Storage) {
                        $window.localStorage.setItem(key, value);
                        return true;
                    } else {
                        return false;
                    }
                } catch(error) {
                    console.error(error, error.message);
                }
            },
            getLocal: function(key) {
                try {
                    if ($window.Storage) {
                        return $window.localStorage.getItem(key);
                    } else {
                        return false;
                    }
                } catch(error) {
                    console.error(error, error.message);
                }
            },
            setSession: function(key, value) {
                try {
                    if ($window.Storage) {
                        $window.sessionStorage.setItem(key, value);
                        return true;
                    } else {
                        return false;
                    }
                } catch(error) {
                    console.error(error, error.message);
                }
            },
            getSession: function(key) {
                try {
                    if ($window.Storage) {
                        return $window.sessionStorage.getItem(key);
                    } else {
                        return false;
                    }
                } catch(error) {
                    console.error(error, error.message);
                }
            },
        }
    }

    StorageFactory.$inject = ['$window'];

    angular
        .module('HCBPrograms')
        .factory('StorageFactory', StorageFactory);

})(angular);