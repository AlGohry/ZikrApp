angular.module('services', [])

.factory('settingsData', ['$http','$rootScope', function($http, $rootScope) {

    return $http.get($rootScope.urlBase + 'settings.json').success(function(data) {
    	return data;
    }).error(function(data){
    	return data;
    });
}])

.factory('quranData', ['$http','$rootScope', function($http, $rootScope) {

    return $http.get($rootScope.urlBase + 'quran.json').success(function(data) {
    	return data;
    }).error(function(data){
    	return data;
    });
}])
