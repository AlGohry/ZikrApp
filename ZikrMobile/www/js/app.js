// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('zikrApp', ['ionic', 'controllers', 'services', 'directives', 'ngCordova', 'ngStorage'])

.config(function($stateProvider, $urlRouterProvider, $localStorageProvider) {
        $stateProvider

            .state('player', {
            url: '/app',
            views: {
                'playerView': {
                    controller: 'mainController',
                    templateUrl: "views/app.html"
                },
                'recitersView': {
                    controller: 'settingsController',
                    templateUrl: "views/settings.html"
                }
            }

        })

        $urlRouterProvider.otherwise('/app');

    })
    .run(function($ionicPlatform, $rootScope) {

        // URL base : http://zikrapp.s3.amazonaws.com/db/ (or) json/
        $rootScope.urlBase = 'http://zikrapp.s3.amazonaws.com/db/';
        // Player HTML
        $rootScope.playController = {
            playIcon: '<i class="ion ion-ios-play"></i>',
            pauseIcon: '<i class="ion ion-ios-pause"></i>',
            loadingIcon: '<i class="ion ion-ios-refresh-empty loadingState"></i>'
        };
        $rootScope.timeFormat = function(d) {
            d = Number(d);
            var h = Math.floor(d / 3600);
            var m = Math.floor(d % 3600 / 60);
            var s = Math.floor(d % 3600 % 60);
            return (h > 0) ? ((h * 60 + m) < 10) ? '0' + h * 60 + m : h * 60 + m + " : " + ((s) < 10 ? '0' + s : s) : ((m) < 10 ? '0' + m : m) + " : " + ((s) < 10 ? '0' + s : s);
        };
        $rootScope.convertToSecs = function(t){
            var secs = parseInt(t.substr(t.indexOf(":") + 1));
            var mins = parseInt(t.substr(0, t.indexOf(':')));
            return mins*60+secs;
        };

        $ionicPlatform.ready(function() {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })
