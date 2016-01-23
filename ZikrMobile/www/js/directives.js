angular.module('directives', [])

// .directive('checkImage', ['$http', function($http) {
//     return {
//         restrict: 'A',
//         link: function(scope, element, attrs) {
//             $http.get(attrs.ngSrc).success(function() {
//                 scope.done = 'id'+attrs.id;
//             }).error(function() {
//             	scope.done = 'id'+attrs.id;
//                 attrs.$set('src', 'img/default.jpg');                 
//             });
//         }
//     };
// }])
