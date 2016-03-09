(function (angular) {
    var focus = function($timeout) {
        return {
            link : function(scope, element, attrs) {
                scope.$watch(attrs.focus, function(value) {
                    if (value === true) {
                        $timeout(function() {
                            element[0].focus();
                        });
                    }
                });
            }
        };
    };

    var scroll = function() {
        return {
            link: function(scope, element, attrs) {
                if (scope.$last) {
                    var container = element.parent();
                    container.scrollTop(element.position().top);
                }
            }
        }
    };

    focus.$inject = ['$timeout'];

    angular
        .module('HCBPrograms')
        .directive('scroll', scroll)
        .directive('focus', focus);
})(angular);