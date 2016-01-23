// Registering New Module For All Controllers
angular.module('controllers', [])
    // Adding Main Controller
    .controller('mainController', ['$scope', '$state', 'settingsData', 'quranData', '$ionicPosition', '$ionicSideMenuDelegate', '$ionicLoading', '$ionicSlideBoxDelegate', '$http', '$localStorage', '$rootScope',
        function($scope, $state, settingsData, quranData, $ionicPosition, $ionicSideMenuDelegate, $ionicLoading, $ionicSlideBoxDelegate, $http, $localStorage, $rootScope) {

            // First of all show loading screen
            $ionicLoading.show({
                templateUrl: 'views/loading.html'
            });

            // Start getting app data : first load settings data
            settingsData.success(function(data) {
                // if load success add all settings data to var
                $scope.settingsData = data; // this var has all settings data
                // setup app options (general vars)
                lang = ($localStorage.ZikrLang) ? parseInt($localStorage.ZikrLang) : 1; // app language id
                langDir = $scope.settingsData['languages'][lang]['dir']; // app language direction (rtl or ltr) for example
                reciterID = ($localStorage.ZikrReciter) ? parseInt($localStorage.ZikrReciter) : 45; // app reader id
                sortingID = ($localStorage.ZikrSort) ? parseInt($localStorage.ZikrSort) : 0; // playlist playing type (asc or desc or random)
                sortingName = $scope.settingsData['sort'][sortingID]['name']; // playlist playing type (asc or desc or random)
                // setting global language vars
                rtl = (langDir == 'rtl') ? true : false; // global direction var
                langCode = (rtl) ? 'ar' : 'en'; // global language code


                // Then load second json file 'quran.json'
                quranData.success(function(data) {
                    // if load success add all data to var
                    $scope.quranData = data; // this var has all quran.json data

                    // Then load third json file : language file
                    $http.get($scope.settingsData['languages'][lang]['src']).success(function(data) {

                        // if load success add all data to var
                        $scope.langData = data; // this var has all language object


                        // Then load reciter json file
                        $http.get($scope.settingsData['readers'][reciterID]['playlist']).success(function(data) {

                            // if success add all data to var
                            $scope.reciterData = data; // this var has all reciter playlist object


                            /*
                             * Now we successfully loadded all app data 
                             * settings, languages, quran and reciters
                             * then we will push our data to DOM
                             */
                            // First we will create empty array we will push data to it later
                            $scope.tracks = [];
                            $rootScope.tracksBox = [];
                            // now we will check reciter playlist to know first and last track IDs
                            firstTrack = 0; // this is first track ID
                            lastTrack = $scope.reciterData['tracks'].length; // this Is last track ID
                            // Now we will loop through reciter playlist based to first and last tracks IDs
                            for (i = firstTrack; i < lastTrack; i++) {
                                // while looping we will push data to empty array we have created before
                                $scope.tracks.push({
                                    // First : track meta
                                    name: $scope.quranData[$scope.reciterData['tracks'][i]['id']]['name_' + langCode], // track name
                                    verses: $scope.quranData[$scope.reciterData['tracks'][i]['id']]['verses'], // track verses number
                                    place: $scope.quranData[$scope.reciterData['tracks'][i]['id']]['place_' + langCode], // track place

                                });
                                $rootScope['tracksBox'].push($scope.reciterData['tracks'][i]['src']);
                            }

                            // now will add icons
                            $scope.playIcon = $rootScope.playController['playIcon'];

                            // Next we will push reciter data
                            $scope.reciter = {
                                name: $scope.settingsData['readers'][reciterID]['name_' + langCode], // name
                                avatar: $scope.settingsData['readers'][reciterID]['avatar'], // image
                                country: $scope.settingsData['readers'][reciterID]['country_' + langCode], // country
                                rating: $scope.settingsData['readers'][reciterID]['rating']
                            }



                            // Player Engine
                            // First : Definding Global Vars
                            audio = new Audio($rootScope.tracksBox[0]); // audio object
                            audio.load();
                            // Next track
                            $scope.nextTrack = function() {
                                $ionicSlideBoxDelegate.next();
                                $scope.repeatOnce = false;
                            };
                            // Prev Track
                            $scope.prevTrack = function() {
                                $ionicSlideBoxDelegate.previous();
                                $scope.repeatOnce = false;
                            };
                            // Play Pause Button
                            $scope.play = function(ID) {
                                if (ID) {
                                    audio.src = $rootScope.tracksBox[ID];
                                    audio.play();
                                } else {
                                    if (audio.paused) {
                                        audio.play();
                                    } else {
                                        audio.pause();
                                    }
                                }
                            };

                            // Audio Events
                            audio.addEventListener("playing", function() {
                                $scope.playIcon = $rootScope.playController['pauseIcon'];
                                $scope.$apply();
                            });
                            audio.addEventListener("pause", function() {
                                $scope.playIcon = $rootScope.playController['playIcon'];
                                $scope.$apply();
                            });
                            audio.addEventListener("ended", function() {
                                if($scope.repeatOnce){
                                    audio.currentTime = 0;
                                    audio.play();
                                    $scope.repeatOnce = false;
                                }else{
                                    $ionicSlideBoxDelegate.next();
                                }
                            });
                            audio.addEventListener("waiting", function() {
                                $scope.playIcon = $rootScope.playController['loadingIcon'];
                                $scope.$apply();
                            });
                            audio.addEventListener("loadstart", function() {
                                $scope.playIcon = $rootScope.playController['loadingIcon'];
                                $scope.$apply();
                            });
                            audio.addEventListener("canplay", function() {
                                $scope.playIcon = $rootScope.playController['playIcon'];
                                $scope.$apply();
                            });
                            audio.addEventListener("timeupdate", function() {
                                $scope.progress = audio.currentTime / audio.duration * 100;
                                $scope.$apply();
                            });






                            $scope.toggleLeft = function() {
                                $ionicSideMenuDelegate.toggleLeft();
                            };


                            $scope.onProgressBallTouch = function() {
                                audio.pause();
                                $scope.showBigTimer = true;
                                $scope.TrackDuration = $rootScope.timeFormat(audio.duration);
                                $scope.TrackCurrent = $rootScope.timeFormat(audio.currentTime);
                            };
                            $scope.onProgressBallRelease = function() {
                                $scope.showBigTimer = false;
                                $ionicSideMenuDelegate.canDragContent(true);
                                if ($scope.currentT) {
                                    audio.currentTime = $rootScope.convertToSecs($scope.currentT);
                                    audio.play();
                                };
                            };
                            $scope.onProgressBallDrag = function(e) {
                                $ionicSideMenuDelegate.canDragContent(false);
                                range = e.gesture.center.pageX - e.target.parentElement.parentElement.offsetLeft;
                                range = (range <= 0) ? 0 : range;
                                range = (range >= 348) ? 348 : range;
                                $scope.progress = (range - 10) / 348 * 100;
                                $scope.TrackCurrent = $rootScope.timeFormat(parseInt(audio.duration * (range / 348 * 100) / 100));
                                $scope.currentT = $rootScope.timeFormat(parseInt(audio.duration * (range / 348 * 100) / 100));
                            };
                            $scope.repeat = function() {
                                $scope.repeatOnce = true;
                            };



                            // Finally Hid loading
                            $ionicLoading.hide();
                        }).error(function() {
                            alert('error loading reciter.json');
                        });
                    }).error(function() {
                        alert('error loading language.json');
                    });

                }).error(function() {
                    alert('error loading quran.json');
                });
            }).error(function() {
                alert('error loading settings.json');
            });
        }
    ])




.controller('settingsController', ['$scope', '$state', 'settingsData', '$ionicSideMenuDelegate', '$timeout', '$http', '$ionicLoading', '$localStorage',
    function($scope, $state, settingsData, $ionicSideMenuDelegate, $timeout, $http, $ionicLoading, $localStorage) {



        // First of all show loading screen
        $ionicLoading.show({
            templateUrl: 'views/loading.html'
        });

        settingsData.success(function(data) {
            // if load success add all settings data to var
            $scope.settingsData = data; // this var has all settings data

            // rendering reciters data
            // First we will create empty array we will push data to it later
            $scope.reciters = [];
            for (var i = 0; i <= $scope.settingsData.readers.length - 1; i++) {
                $scope.reciters.push({
                    name: $scope.settingsData.readers[i]['name_en'],
                    avatar: $scope.settingsData.readers[i]['avatar'],
                    country: $scope.settingsData.readers[i]['country_en']
                });
            };

            // Selected reciter data
            // Current reciter by default
            $scope.isActive = ($localStorage.ZikrReciter) ? parseInt($localStorage.ZikrReciter) : false;
            $scope.choosed = ($localStorage.ZikrReciter) ? true : false;
            $scope.currentReciter = function(id) {
                // $ionicSideMenuDelegate.toggleLeft();
                $scope.isActive = id;
                $scope.choosed = true;
            }
            $scope.save = function() {
                $localStorage.ZikrReciter = $scope.isActive;
                $state.go('player');
            }

            // Finally Hide loading
            $ionicLoading.hide();
        }).error(function() {
            console.log('error loading settings.json');
        });
    }
])
