angular.module('morgan')
    .factory('morganFactory', ['$http', function($http) {

    var urlSource = "sources.json";
    var urlConfig = "config.json";
    var dataFactory = {};

    dataFactory.getSource = function () {
        return $http.get(urlSource);
    };
    
    dataFactory.getConfig = function () {
        return $http.get(urlConfig);
    };
    
    dataFactory.getAnyUrl = function(url) {
        return $http.get(url);
    };

    return dataFactory;
}]);
