// Registering new Audio object
var x = new Audio();
// clear history
localStorage.removeItem('now');
// Check if this is new or already registered user
if (localStorage.userSettings) {
    // If This Is Registerd User : load app page
    // then load settings config file
    $.getJSON('http://zikrapp.s3.amazonaws.com/db/settings.json?v=' + new Date().getTime(), function(json) {
        // if successfully loaded : get settings object and add it to var
        allSettings = json; // this var has all settings object
    }).done(function() {
        // then get current settings from localStorage
        getSettings = localStorage.getItem('userSettings'); // getting object as string
        finalSettings = JSON.parse(getSettings); // then parse it to json object

        // setup app options (general vars)
        lang = parseInt(finalSettings.lang); // app language id
        langName = allSettings.languages[finalSettings.lang]['code']; // app language name (ar or en) for example
        shekh_name = finalSettings.reader; // app reader id
        sorting_type_id = parseInt(finalSettings.sort); // playlist playing type (asc or desc or random)
        sorting_type = allSettings.sort[finalSettings.sort]['name']; // playlist playing type (asc or desc or random)

        // after loading setting page and getting current reader : load quran metadata file
        $.getJSON('http://zikrapp.s3.amazonaws.com/db/quran.json?v=' + new Date().getTime(), function(metadata) {
            // after loading metadata object : add it to global var
            allQuran = metadata; // this var has all Quran metadata object (114 surrah)
        }).done(function() {
            // after loading setting page and getting current reader : load language object
            $.getJSON(allSettings.languages[lang]['src'] + '?v=' + new Date().getTime(), function(langData) {
                // after loading language object : add it to global var
                allLangData = langData; // this var has all language object
            }).done(function() {
                // then load all playlist object
                $.getJSON(allSettings.readers[shekh_name]['playlist'] + '?v=' + new Date().getTime(), function(playlist) {
                    // if successfully loaded : add all playlist object to global var
                    allData = playlist; // this var has all playlist data object
                    // then get playlist first and last track IDs
                    firstSurrah = 0;
                    lastSurrah = allData.tracks.length;
                }).done(function() {
                    // when loading done : do the next list of functions

                    // 1 - update current session of global vars like current, next and previous tracks
                    updateSession();

                    // 2 - updating audio object (at background page window) and load it 
                    if (!x.src) { // update it jsut for first time load
                        x.src = playerInfo[1][2];
                        x.load();
                    }

                    // 3 - when COMPLETELY background finish his process send message to popup
                    chrome.runtime.sendMessage({
                        ready: true
                    });

                    // 4 - if background receved call from popup do next list of events
                    chrome.runtime.onConnect.addListener(function(port) {

                        function isPlaying(audio) {
                            return !audio.paused;
                        }

                        // send message to popup if track playing
                        if (isPlaying(x)) {
                            port.postMessage({
                                onplaying: true
                            });
                        }

                        port.postMessage({
                            ready: true
                        });

                        // Audio Events
                        // send message to popup if track has played
                        x.onplaying = function() {
                            port.postMessage({
                                onplaying: true
                            });
                        };
                        // send message to popup if track has paused
                        x.onpause = function() {
                            port.postMessage({
                                onpause: true
                            });
                        };
                        // send message to popup if track has ended
                        x.onended = function() {
                            port.postMessage({
                                onended: true
                            });
                        };
                        // send message to popup if track started loading
                        x.onloadstart = function() {
                                port.postMessage({
                                    onloadstart: true
                                });
                            }
                            // send message to popup if track ready to play
                        x.oncanplay = function() {
                                port.postMessage({
                                    oncanplay: true
                                });
                            }
                            // send message to popup if progress
                        x.onprogress = function() {
                                port.postMessage({
                                    onprogress: true
                                });
                            }
                            // send message to popup if track time update
                        x.ontimeupdate = function() {
                            port.postMessage({
                                ontimeupdate: true
                            });
                        }



                        // ----------------------------------- This Code I Must Re-Read It -----------------------------------
                        // next code will check progress every 50 millisecons to know if it's buffering or not
                        // tnis code i have copied it from stackoverflow and i still not understand it completely
                        // link to question at stackoverflow https://goo.gl/8bsZB1
                        var checkInterval = 50.0,
                            lastPlayPos = 0,
                            currentPlayPos = 0,
                            bufferingDetected = false,
                            player = x;

                        var checkingBufferingState = setInterval(checkBuffering, checkInterval);

                        function checkBuffering() {
                            currentPlayPos = player.currentTime;
                            // checking offset, e.g. 1 / 50ms = 0.02
                            var offset = 1 / checkInterval;
                            // if no buffering is currently detected,
                            // and the position does not seem to increase
                            // and the player isn't manually paused...
                            if (!bufferingDetected && currentPlayPos < (lastPlayPos + offset) && !player.paused) {
                                port.postMessage({
                                    onwaiting: true
                                });
                                bufferingDetected = true;
                            }
                            // if we were buffering but the player has advanced,
                            // then there is no buffering
                            if (bufferingDetected && currentPlayPos > (lastPlayPos + offset) && !player.paused) {
                                port.postMessage({
                                    onplaying: true
                                });
                                bufferingDetected = false;
                            }
                            lastPlayPos = currentPlayPos;
                        }
                        // ----------------------------------- / This Code I Must Re-Read It -----------------------------------

                        // if connection port closed (popup closed)
                        port.onDisconnect.addListener(function() {
                            // reset all interval functions
                            clearInterval(checkingBufferingState);
                            // reset all audio events (they can't play when popup closed)
                            x.oncanplay = function() {};
                            x.onplaying = function() {};
                            x.onpause = function() {};
                            x.onwaiting = function() {};
                            x.onprogress = function() {};
                            x.ontimeupdate = function() {};
                            // update session every time new track playing 
                            x.onloadstart = function() {
                                localStorage.setItem('now', playerInfo[1][0]);
                            };
                            // update session when track ends
                            x.onended = function() {
                                updateSession(nextSurah);
                                x.src = playerInfo[1][2];
                                x.load();
                                x.play();
                            };
                        });
                    });
                }).error(function() {
                    // if loading fail([playlist-file].json) : Run Error Script
                    runErrorBG();
                });
            }).error(function() {
                // if loading fail([languages-file].json) : Run Error Script
                runErrorBG();
            });
        }).error(function() {
            // if loading fail(quran.json) : Run Error Script
            runErrorBG();
        });
    }).error(function() {
        // if loading fail(settings.json) : Run Error Script
        runErrorBG();
    });
} else {
    // If This Is New User : load settings object
    $.getJSON('http://zikrapp.s3.amazonaws.com/db/settings.json?v=' + new Date().getTime(), function(json) {
        // if successfully loaded : add all settings object to global var and setup the app
        allSettings = json; // this var has all language object
        lang = 0; // default language for first load (0 for arabic and 1 for english)
        langName = allSettings.languages[lang]['code']; // language name ar or en
        shekh_name = 'none'; // default reader name (none by default)
        sorting_type_id = 0; // playlist playing type (asc or desc or random)
        sorting_type = allSettings.sort[sorting_type_id]['name']; // playlist playing type (asc or desc or random)
    }).done(function() {
        // when finish loading : load language config file
        $.getJSON(allSettings.languages[lang]['src'] + '?v=' + new Date().getTime(), function(json) {
            // if successfully loaded : add all language object to global var
            allLangData = json;
        }).done(function() {
            // when COMPLETELY background finish his process send message to popup
            chrome.runtime.sendMessage({
                ready: true
            });
            // also send if popup action clicked
            chrome.runtime.onConnect.addListener(function(port) {
                port.postMessage({
                    ready: true
                });
            });
        }).error(function() {
            // if loading failed then alert the error: Run Error Script
            runErrorBG();
        });
    }).error(function() {
        // if loading failed then alert the error : Run Error Script
        runErrorBG();
    });
}
