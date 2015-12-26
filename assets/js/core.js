/* --------------------------------
ZikrAPP Extension For Web Browsers
version: 2
-------------------------------- */


// First : Variables
var

    player = '#zikr', // Main Element

    // Page N1 : Player Pgae
    player_playlist = '.player-playlist',
    style_scroll = '.style-scroll',
    player_track = '.track',
    track_wrap_element = '.track-wrap',
    track_html = $(track_wrap_element).html(),
    player_track_name = '.track-title',
    player_track_id = '.track-id',
    player_track_state = '.track-state',
    player_con_script = '#playerControllerScript',
    playlist_tracks_script = '#playerPlaylistScript',

    // Icons
    play_icon = '<i class="fa fa-play"></i>',
    error_icon = '<i class="fa fa-exclamation-triangle"></i>',
    pause_icon = '<i class="fa fa-pause"></i>',
    preload_icon = '<i class="fa fa-refresh fa-spin"></i>',

    playing_img = '<img src="./assets/imgs/playing.gif">',
    preload_img = '<img src="./assets/imgs/preload.gif">',

    ready_string = 'ready',
    target_track_attr = 'target-track',

    activeClass = 'active',

    shekhDataScript = '#shekhData',
    defaultAvatar = 'http://zikrapp.s3-website.eu-central-1.amazonaws.com/avatars/default.jpg',

    // Buttons
    option_btn = '.option',
    play_pause = '.play-pause',
    next = '.next',
    prev = '.prev',
    tool_btn = '.tool',
    setting_btn = '.call-settings',
    playlist_btn = '.call-playlist',

    // rating
    rating = {
        star: 'fa-star',
        half: 'fa-star-half-o',
        empty: 'fa-star-o'
    },


    // page tags
    page = {
        mainClass: '.page',
        wrapId: '#wrap',
        headClass: '.page-head',
        contentClass: '.page-content',
        saveBtn: '.save',
        closeBtn: '.close',
        refreshBtn: '.refresh',
        inActiveClasses: {
            reader: 'inActive-shekh',
            lang: 'inActive-lang',
            sort: 'inActive-sort'
        },
        activeClasses: {
            settings: 'active-settings',
            about: 'active-about'
        }
    },
    // search obj
    search = {
        main: '.search',
        input: '.search-input',
        icon: '.search-icon',
        attr: 'target-db',
        id: 'id'
    },

    // Settings Page
    settings = {
        mainClass: '.settings-page',
        rowClass: '.setting-row',
        labelClass: '.option-label',
        selectClass: '.mSelect',
        optionsClass: '.options',
        itemClass: '.item',
        currentClass: '.current',
        valueAttr: 'value',
        readerId: '#reader-row',
        langId: '#lang-row',
        sortId: '#sort-row'
    },

    // Ui Attrs
    call_settings_attr = 'data-section',

    // Bars
    progress_bar = '.progress',
    buffering_bar = '.buffer',
    stream_bar = '.stream',

    // Track Info Elements
    track_meta = '.track-meta',
    track_title = '.track-title',
    track_author = '.track-author',

    next_meta = '.next-meta',
    current_meta = '.current-meta',
    prev_meta = '.prev-meta',

    // Modes
    waiting_mode = 'waiting-mode',

    // Data Attributes
    trackAttr = 'track-id',
    trackAuthorAttr = 'track-author',



    // Global Vars
    currSurah,
    nextSurah,
    prevSurah,
    allSettings,
    allLangData,
    playerInfo;




// Functions List
// Generate Random Number Between Two Values
function genRandom(min, max, ex) {
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    if (ex) {
        return (num === ex) ? genRandom(min, max) : num;
    } else {
        return num;
    }
}
// style scroll
function fireStyleScroll() {
    $(style_scroll).mCustomScrollbar({
        theme: "rounded-dots", // theme
        axis: "y", // overflow-y
        scrollButtons: { // scrollbars buttons
            enable: true // enable buttons
        },
    });
}
// current, next and prev surrah inf generation
function updateSession(current) {

    if (sorting_type == 'asc') {
        if (current) {
            currSurah = parseInt(current);
        } else {
            currSurah = (localStorage.now) ? parseInt(localStorage.now) : 0;
        }
        nextSurah = currSurah + 1;
        prevSurah = currSurah - 1;

        if (nextSurah >= lastSurrah) {
            nextSurah = firstSurrah;
        }
        if (prevSurah < firstSurrah) {
            prevSurah = lastSurrah - 1;
        }
    } else if (sorting_type == 'desc') {
        if (current) {
            currSurah = parseInt(current);
        } else {
            currSurah = lastSurrah - 1;
        }
        nextSurah = currSurah - 1;
        prevSurah = currSurah + 1;

        if (nextSurah < firstSurrah) {
            nextSurah = lastSurrah - 1;
        }
        if (prevSurah >= lastSurrah) {
            prevSurah = firstSurrah;
        }
    } else if (sorting_type = 'random') {
        if (current) {
            currSurah = current;
        } else {
            currSurah = (localStorage.now) ? parseInt(localStorage.now) : genRandom(firstSurrah, lastSurrah);
        }
        nextSurah = genRandom(firstSurrah, lastSurrah, currSurah);
        prevSurah = genRandom(firstSurrah, lastSurrah, currSurah);
    }
    // adding info to vars
    return playerInfo = [
        [
            prevSurah,
            allQuran[parseInt(allData.tracks[prevSurah]['id'])]['name_' + langName],
            allData.tracks[prevSurah]['src'],
            allQuran[parseInt(allData.tracks[prevSurah]['id'])]["place_" + langName],
            allQuran[parseInt(allData.tracks[prevSurah]['id'])]["verses"]
        ],
        [
            currSurah,
            allQuran[parseInt(allData.tracks[currSurah]['id'])]['name_' + langName],
            allData.tracks[currSurah]['src'],
            allQuran[parseInt(allData.tracks[currSurah]['id'])]["place_" + langName],
            allQuran[parseInt(allData.tracks[currSurah]['id'])]["verses"]
        ],
        [
            nextSurah,
            allQuran[parseInt(allData.tracks[nextSurah]['id'])]['name_' + langName],
            allData.tracks[nextSurah]['src'],
            allQuran[parseInt(allData.tracks[nextSurah]['id'])]["place_" + langName],
            allQuran[parseInt(allData.tracks[nextSurah]['id'])]["verses"]
        ],
    ];
}



// connect to background window to save global vars at it
function updateMeta(callback) {
    chrome.runtime.getBackgroundPage(function(background) {
        // Update meta

        var playerDATA = [{
            prev_title: background.playerInfo[0][1],
            prev_shekh_name: background.playerInfo[0][3],
            prev_verses_num: background.playerInfo[0][4] + ' ' + background.allLangData.player.versesString,

            curr_title: background.playerInfo[1][1],
            curr_shekh_name: background.playerInfo[1][3],
            curr_verses_num: background.playerInfo[1][4] + ' ' + background.allLangData.player.versesString,

            next_title: background.playerInfo[2][1],
            next_shekh_name: background.playerInfo[2][3],
            next_verses_num: background.playerInfo[2][4] + ' ' + background.allLangData.player.versesString
        }];

        $(track_meta).html($(player_con_script).tmpl(playerDATA));

        if (callback) {
            callback();
        }
    });
}

// Update playlist
var playlistObj = [];

function updatePlaylist(callback) {
    chrome.runtime.getBackgroundPage(function(background) {
        for (loopID = background.firstSurrah; loopID <= background.lastSurrah - 1; loopID++) {
            var idString = background.allData.tracks[loopID]['id'];
            if (background.allData.tracks[loopID]['id'] < 10) {
                idString = '00' + background.allData.tracks[loopID]['id'];
            } else if (idString < 100) {
                idString = '0' + background.allData.tracks[loopID]['id'];
            }

            playlistObj.push({
                name: background.allQuran[parseInt(idString)]['name_' + background.langName],
                state: (loopID == background.playerInfo[1][0]) ? play_icon : '',
                id: idString,
                attr_id: loopID,
                selected: (loopID == background.playerInfo[1][0]) ? 'active' : ''
            });
        }

        var trackData = [{
            trackItem: playlistObj,
            searchString: background.allLangData.player.searchString
        }];
        $(player_playlist).html($(playlist_tracks_script).tmpl(trackData));




        var ratingObj = [];
        for (x = 0; x < 5; x++) {
            ratingObj.push({
                star: (parseInt(background.allSettings.readers[background.shekh_name]['rating']) > x) ? rating.star : rating.empty
            });
        }
        var shekhInfo = [{
            shekhAvatar: background.allSettings.readers[background.shekh_name]['avatar'],
            defaultAvatar: defaultAvatar,
            shekhName: background.allSettings.readers[background.shekh_name]['name_' + background.langName],
            shekhCountry: background.allSettings.readers[background.shekh_name]['country_' + background.langName],

            // rating
            ratingStar: ratingObj
        }];
        $(shekhDataScript).tmpl(shekhInfo).appendTo('.sheck-section');

        // this will fire the mCustomScrollbars plusgin AFTER playlist data loaded
        fireStyleScroll();
        // after loading and firing the styled scrollbars .. plugin will scroll down to current active track
        $(style_scroll).mCustomScrollbar("scrollTo", player_track + '.' + activeClass);

        if (callback) {
            callback();
        }
    });
}
// switching from track to another
function makeAnm(direction, callback) {
    chrome.runtime.getBackgroundPage(function(background) {
        background.x.pause();
    });
    $(player_track + '.' + activeClass).find(player_track_state).html('');
    $(player_track).removeClass(activeClass);
    if (direction == 'next') {
        $(current_meta).animate({
            'left': '-300px'
        }, {
            duration: 500,
            complete: function() {
                $(this).removeClass(current_meta.split('.').join("")).addClass(prev_meta.split('.').join(""));
            }
        });
        $(next_meta).animate({
            'left': '0'
        }, {
            duration: 500,
            complete: function() {
                $(this).removeClass(next_meta.split('.').join("")).addClass(current_meta.split('.').join(""));
            }
        });
        $(prev_meta).animate({
            'left': '300px'
        }, {
            duration: 0,
            complete: function() {
                $(this).removeClass(prev_meta.split('.').join("")).addClass(next_meta.split('.').join(""));
            }
        });
    } else if (direction == 'prev') {
        $(current_meta).animate({
            'left': '300px'
        }, {
            duration: 500,
            complete: function() {
                $(this).removeClass(current_meta.split('.').join("")).addClass(next_meta.split('.').join(""));
            }
        });
        $(prev_meta).animate({
            'left': '0'
        }, {
            duration: 500,
            complete: function() {
                $(this).removeClass(prev_meta.split('.').join("")).addClass(current_meta.split('.').join(""));
            }
        });
        $(next_meta).animate({
            'left': '-300px'
        }, {
            duration: 0,
            complete: function() {
                $(this).removeClass(next_meta.split('.').join("")).addClass(prev_meta.split('.').join(""));
            }
        });
    }

    setTimeout(function() {
        if (callback) {
            callback();
        }
    }, 1000);
}
// mSelect core
function mSelect() {
    // mScelect
    $(document).on('click', settings.currentClass, function(event) {
        event.preventDefault();

        $(this).parent(settings.selectClass).parent().siblings().find(settings.selectClass).removeClass(activeClass);
        $(this).parent(settings.selectClass).toggleClass(activeClass);
        $(search.input).val('');
        $(settings.readerId + ' ' + settings.itemClass).show();
    });
    $(document).on('click', settings.selectClass + ' ' + settings.itemClass, function(event) {
        event.preventDefault();

        $(search.input).val('');
        $(settings.readerId + ' ' + settings.itemClass).show();

        // get vars 
        var itemContent = $(this).html();
        var itemValue = $(this).attr('value');

        // add Data
        $(this).closest(settings.optionsClass).siblings(settings.currentClass).html(itemContent);
        $(this).closest(settings.optionsClass).siblings(settings.currentClass).attr('value', itemValue);

        // close dropdown
        $(this).closest(settings.selectClass).parent().siblings().find(settings.selectClass).removeClass(activeClass);
        $(this).closest(settings.selectClass).toggleClass(activeClass);

        // change active classes
        $(this).siblings().removeClass(activeClass);
        $(this).addClass(activeClass);
    });
    // fire style scroll plugin after playlist loaded
    fireStyleScroll();
}
//search
function runSearch(input, target) {
    $(input).keyup(function() {
        var key = $.trim($(this).val()
            .replace(/إ/g, 'ا')
            .replace(/أ/g, 'ا')
            .replace(/ي/g, 'ى')
            .replace(/ه/g, 'ة')
            .replace(/آ/g, 'ا')).toLowerCase();
        $(target).filter(function() {
            var ele = $(this).text()
                .replace(/إ/g, 'ا')
                .replace(/أ/g, 'ا')
                .replace(/ي/g, 'ى')
                .replace(/ه/g, 'ة')
                .replace(/آ/g, 'ا').toLowerCase();
            var result = ele.indexOf(key);
            if (result >= 0) {
                $(this).show();
                $(style_scroll).mCustomScrollbar("scrollTo", player_track + '.' + activeClass);
            } else {
                $(this).hide();
            }
        });
    });
}



function runApp() {
    // connect to background window to save global vars at it
    chrome.runtime.getBackgroundPage(function(background) {
        // Check If this is new or already registered user
        if (background.localStorage.userSettings) {
            // If This Is Registerd User : load app page
            $(player).load('./assets/pages/app.html', function() {
                // IF successfully loaded run next list of functions 

                // 1 - setting app css direction based to current lang 
                if (background.langName == 'ar') {
                    $('body').addClass('rtl');
                }

                // 2 - adding track html data to his place in app (names .. etc)
                updateMeta();


                // 3 - update playlist html data .. tracks names and states .. etc
                updatePlaylist(function() {
                    // run search 
                    $(search.main).each(function() {
                        runSearch('#' + ($(this).attr(search.id)) + ' ' + search.input, $(this).attr(search.attr));
                    });
                });

                // 4 - updating audio object (at background page window) and load it 
                if (background.x.paused) { // update it jsut for first time load
                    background.x.play();
                }

                // 5 - open connection channel with background page and name it popupState
                var port = chrome.runtime.connect({
                    name: 'popupState'
                });
                // receve mesages from background page
                port.onMessage.addListener(function(msg) {
                    // if onprogress
                    if (msg.onprogress) {
                        var ranges = [];
                        for (var i = 0; i < background.x.buffered.length; i++) {
                            ranges.push([
                                background.x.buffered.start(i),
                                background.x.buffered.end(i)
                            ]);
                        }
                        for (var i = 0; i < background.x.buffered.length; i++) {
                            $(buffering_bar).width(((100 / background.x.duration) * ranges[i][0]) + '%');
                            $(buffering_bar).width(((100 / background.x.duration) * (ranges[i][1] - ranges[i][0])) + '%');
                        }
                    }
                    if (msg.ontimeupdate) {
                        $(stream_bar).width(((background.x.currentTime / background.x.duration) * 100) + '%');
                    }
                    // if track playing
                    if (msg.onplaying) {
                        $(play_pause).removeClass(waiting_mode).html(pause_icon);
                        $(next + ', ' + prev).removeClass(waiting_mode);
                        $(player_track + '.' + activeClass).find(player_track_state).html(playing_img);
                    }
                    // if track paused
                    if (msg.onpause) {
                        $(play_pause).removeClass(waiting_mode).html(play_icon);
                        $(player_track + '.' + activeClass).find(player_track_state).html(pause_icon);
                    }
                    // if ended
                    if (msg.onended) {
                        makeAnm('next', function() {
                            background.updateSession('' + background.nextSurah + '');
                            $(next_meta).find(track_title).html(background.playerInfo[2][1]); // update next track
                            $(next_meta).find(track_author).html(background.playerInfo[2][3] + ' / ' + background.playerInfo[2][4] + ' ' + background.allLangData.player.versesString); // update next track info
                            background.x.src = background.playerInfo[1][2];
                            background.x.load();
                            background.x.play();
                        });
                    }
                    // if loadstart
                    if (msg.onloadstart) {
                        $(stream_bar + ', ' + buffering_bar).width(0); // reset bars
                        $('[' + target_track_attr + '=' + background.playerInfo[1][0] + ']').addClass(activeClass);
                        $(player_track + '.' + activeClass).find(player_track_state).html(preload_img);
                        $(search.input).val('');
                        $($(search.main).attr(search.attr)).show();
                        $(player_playlist + ' ' + style_scroll).mCustomScrollbar("scrollTo", player_track + '.' + activeClass, {
                            scrollInertia: 1000
                        });
                        background.localStorage.setItem('now', background.playerInfo[1][0]);
                    }
                    // if waiting
                    if (msg.onwaiting) {
                        $(play_pause).addClass(waiting_mode).html(preload_icon);
                        $(next + ', ' + prev).addClass(waiting_mode);
                        $(player_track + '.' + activeClass).find(player_track_state).html(preload_img);
                    }
                    // if ready to play
                    if (msg.oncanplay) {
                        $(player_track + '.' + activeClass).find(player_track_state).html(play_icon);
                    }
                });

                // 6 - Generating Setting And About Pages Based To Selected Language
                // First : Generat Readers List Based To Selected Language
                var readersLoop = [];
                for (i = 0; i < background.allSettings.readers.length; i++) {
                    readersLoop.push({
                        key: i,
                        img: background.allSettings.readers[i]['avatar'],
                        name: background.allSettings.readers[i]['name_' + background.langName],
                        country: background.allSettings.readers[i]['country_' + background.langName],
                        selected: (i == background.shekh_name) ? activeClass : ''
                    });
                };
                // Second : Generating languages List Based To Selected Language
                var langLoop = [];
                for (i = 0; i < background.allSettings.languages.length; i++) {
                    langLoop.push({
                        id: i,
                        name: background.allSettings.languages[i]['name'],
                        selected: (i == background.lang) ? activeClass : ''
                    });
                };
                // Third : Generating Sorting List Based To Selected Language
                var sortLoop = [];
                for (i = 0; i < background.allSettings.sort.length; i++) {
                    sortLoop.push({
                        value: i,
                        name: background.allLangData.settings[background.allSettings.sort[i]['name']],
                        icon: background.allSettings.sort[i]['icon'],
                        selected: (i == background.sorting_type_id) ? activeClass : ''
                    });
                };
                // Pushing All Strings In App Based To Selected Language
                var pushTranslations = [{
                    // Settings Page
                    settings_title: background.allLangData.settings.title,
                    // Readers Section
                    settings_reader_title: background.allLangData.settings.readerTitle,
                    settings_reader_ex: background.allLangData.settings.readerTitleEx,
                    curr_reader_src: background.shekh_name,
                    curr_reader_img: background.allSettings.readers[background.shekh_name]['avatar'],
                    curr_reader_name: background.allSettings.readers[background.shekh_name]['name_' + background.langName],
                    curr_reader_country: background.allSettings.readers[background.shekh_name]['country_' + background.langName],
                    readerItem: readersLoop,
                    searchString: background.allLangData.settings.searchString,
                    // Languages Sections
                    settings_lang_title: background.allLangData.settings.langTitle,
                    settings_lang_ex: background.allLangData.settings.langTitleEx,
                    curr_lang_id: background.lang,
                    curr_lang_name: background.allSettings.languages[background.lang]['name'],
                    langItem: langLoop,
                    // Sorting Section
                    settings_playlist_title: background.allLangData.settings.playlistTitle,
                    settings_playlist_ex: background.allLangData.settings.playlistTitleEx,
                    // Sorting
                    settings_sort_curr_name: background.allLangData.settings[background.sorting_type],
                    settings_sort_curr_value: background.sorting_type_id,
                    settings_sort_curr_icon: background.allSettings.sort[background.sorting_type_id]['icon'],
                    sortItem: sortLoop,

                    //About Page
                    about_title: background.allLangData.about.title,
                    appName: background.allLangData.about.appName,
                    appDesc: background.allLangData.about.appDesc,
                    appPartnersText: background.allLangData.about.appPartnersText,
                    appContactText: background.allLangData.about.appContactText,
                    updateText: background.allLangData.about.updateText,
                    partnerText: background.allLangData.about.partnerText,
                    facebookText: background.allLangData.about.facebookText
                }];
                $('#translatedPages').html($('#settingsPage').tmpl(pushTranslations));

                // 7 - Run mSelect
                mSelect();

                // 8 - remove loading state
                $(player).removeClass('loading');

                // 09 - resote app icon
                chrome.browserAction.setIcon({
                    path: {
                        "19": "assets/imgs/icon19.png",
                        "38": "assets/imgs/icon38.png"
                    }
                });

                // 10 - getting current settings HTML from settings page (after setting it up from last session)
                settings.readerHtml = $(settings.readerId + ' ' + settings.currentClass).html(),
                    settings.readerVal = $(settings.readerId + ' ' + settings.currentClass).attr('value'),
                    settings.langHtml = $(settings.langId + ' ' + settings.currentClass).html(),
                    settings.langVal = $(settings.langId + ' ' + settings.currentClass).attr('value'),
                    settings.sortHtml = $(settings.sortId + ' ' + settings.currentClass).html(),
                    settings.sortVal = $(settings.sortId + ' ' + settings.currentClass).attr('value');

                // 11 - Click Events
                // on click play/pause button
                $(document).on('click', play_pause, function(event) {
                    event.preventDefault();
                    if (!background.x.paused) {
                        background.x.pause();
                    } else {
                        background.x.play();
                    }
                });
                // if prev/next buttons clicked
                $(document).on('click', next + ', ' + prev, function(event) {
                    event.preventDefault();
                    /* Act on the event */
                    $(next + ', ' + prev).addClass(waiting_mode);
                    $(play_pause).addClass(waiting_mode);
                });
                // Button Next Click Event
                $(document).on('click', next, function(event) {
                    event.preventDefault();
                    makeAnm('next', function() {
                        background.updateSession('' + background.nextSurah + '');
                        $(next_meta).find(track_title).html(background.playerInfo[2][1]); // update next track
                        $(next_meta).find(track_author).html(background.playerInfo[2][3] + ' / ' + background.playerInfo[2][4] + ' ' + background.allLangData.player.versesString); // update next track info
                        background.x.src = background.playerInfo[1][2];
                        background.x.load();
                        background.x.play();
                    });
                });
                // Button Prev Click Event
                $(document).on('click', prev, function(event) {
                    event.preventDefault();
                    makeAnm('prev', function() {
                        background.updateSession('' + background.prevSurah + '');
                        $(prev_meta).find(track_title).html(background.playerInfo[0][1]); // update prev track
                        $(prev_meta).find(track_author).html(background.playerInfo[0][3] + ' / ' + background.playerInfo[0][4] + ' ' + background.allLangData.player.versesString); // update prev track info
                        background.x.src = background.playerInfo[1][2];
                        background.x.load();
                        background.x.play();
                    });
                });
                // if track has clicked
                $(document).on('click', player_track, function(event) {
                    event.preventDefault();
                    $('.active .track-state').html('');
                    $(player_track).removeClass(activeClass);
                    $(this).addClass(activeClass);
                    var target = parseInt($(this).attr(target_track_attr)),
                        getTargetSrc = background.allData.tracks[target]['src'];
                    background.updateSession('' + target + '');
                    $(current_meta).find(track_title).html(background.playerInfo[1][1]); // update prev track
                    $(current_meta).find(track_title).html(background.playerInfo[1][3]); // update track info
                    background.x.src = getTargetSrc;
                    background.x.load();
                    background.x.play();
                    updateMeta();

                });
                // if tools buttons clicked
                $(document).on('click', tool_btn, function(event) {
                    event.preventDefault();

                    var calledSection = $(this).attr(call_settings_attr);
                    $(player).addClass(calledSection);
                });

                // if close
                $(document).on('click', page.closeBtn, function(event) {
                    event.preventDefault();

                    // back effect
                    $(player).removeClass(page.activeClasses.settings + ' ' + page.activeClasses.about);

                    // close all opened select
                    $(settings.currentClass).parent(settings.selectClass).removeClass(activeClass);

                    // reset form
                    if (!$(page.saveBtn).hasClass(page.inActiveClasses.reader)) {
                        // reader row
                        $(settings.readerId + ' ' + settings.currentClass).html(settings.readerHtml);
                        $(settings.readerId + ' ' + settings.currentClass).attr('value', settings.readerVal);
                        // inactive save button
                        $(page.saveBtn).addClass(page.inActiveClasses.reader);

                    }
                    if (!$(page.saveBtn).hasClass(page.inActiveClasses.lang)) {
                        // lang row
                        $(settings.langId + ' ' + settings.currentClass).html(settings.langHtml);
                        $(settings.langId + ' ' + settings.currentClass).attr('value', settings.langVal);
                        // inactive save button
                        $(page.saveBtn).addClass(page.inActiveClasses.lang);
                    }
                    if (!$(page.saveBtn).hasClass(page.inActiveClasses.sort)) {
                        // sort row
                        $(settings.sortId + ' ' + settings.currentClass).html(settings.sortHtml);
                        $(settings.sortId + ' ' + settings.currentClass).attr('value', settings.sortVal);
                        // inactive save button
                        $(page.saveBtn).addClass(page.inActiveClasses.sort);
                    }
                });
                // update save button status
                $(document).on('click', settings.readerId + ' ' + settings.itemClass, function(event) {
                    event.preventDefault();

                    var readerItemValue = $(this).attr('value');
                    if (readerItemValue != background.shekh_name) {
                        $(page.saveBtn).removeClass(page.inActiveClasses.reader);
                    } else {
                        $(page.saveBtn).addClass(page.inActiveClasses.reader);
                    }
                });
                $(document).on('click', settings.langId + ' ' + settings.itemClass, function(event) {
                    event.preventDefault();

                    var langItemValue = parseInt($(this).attr('value'));
                    if (langItemValue != background.lang) {

                        $(page.saveBtn).removeClass(page.inActiveClasses.lang);
                    } else {
                        $(page.saveBtn).addClass(page.inActiveClasses.lang);
                    }
                });
                $(document).on('click', settings.sortId + ' ' + settings.itemClass, function(event) {
                    event.preventDefault();

                    var sortItemValue = $(this).attr('value');
                    if (sortItemValue != background.sorting_type) {
                        $(page.saveBtn).removeClass(page.inActiveClasses.sort);
                    } else {
                        $(page.saveBtn).addClass(page.inActiveClasses.sort);
                    }
                });
                // save button
                $(document).on('click', page.saveBtn, function(event) {
                    event.preventDefault();

                    // reset now session
                    localStorage.removeItem('now');

                    $(player).addClass('loading');
                    // stop quran
                    if (typeof background.x !== 'undefined') {
                        background.x.pause();
                    }
                    // back effect
                    $(player).removeClass(page.activeClasses.settings + ' ' + page.activeClasses.about);
                    // save
                    // get values
                    var finalVals = {
                        reader: $(settings.readerId + ' ' + settings.currentClass).attr('value'),
                        lang: $(settings.langId + ' ' + settings.currentClass).attr('value'),
                        sort: $(settings.sortId + ' ' + settings.currentClass).attr('value')
                    };
                    background.localStorage.setItem('userSettings', JSON.stringify(finalVals));
                    setTimeout(function() {
                        background.location.reload();
                    }, 1000);
                });
                // Refresh Button
                $(document).on('click', page.refreshBtn, function() {
                    $(player).addClass('loading');
                    setTimeout(function() {
                        background.location.reload();
                    }, 1000);
                });
            }).error(function() {
                // if loading fail(app.html) : alert with error message
                alert('Error Loading App File !!');
            });
        } else {
            // If This Is New User : load NewUser Page
            $(player).load('./assets/pages/newuser.html?v=' + new Date().getTime(), function() {

                // when finish loading : run the next functions

                // 1 - if language is arabic rtl the body 
                if (background.langName == 'ar') {
                    $('body').addClass('rtl');
                }

                // 2 - Generate all strings based to default language
                // first : generate readers list
                var readersLoop = [];
                for (i = 0; i < background.allSettings.readers.length; i++) {
                    readersLoop.push({
                        key: i,
                        img: background.allSettings.readers[i]['avatar'],
                        name: background.allSettings.readers[i]['name_' + background.langName],
                        country: background.allSettings.readers[i]['country_' + background.langName],
                        selected: (i == background.shekh_name) ? activeClass : ''
                    });
                };
                // second : generate languages list
                var langLoop = [];
                for (i = 0; i < background.allSettings.languages.length; i++) {
                    langLoop.push({
                        id: i,
                        name: background.allSettings.languages[i]['name'],
                        selected: (i == background.lang) ? activeClass : ''
                    });
                };
                // Third : Generating Sorting List Based To Selected Language
                var sortLoop = [];
                for (i = 0; i < background.allSettings.sort.length; i++) {
                    sortLoop.push({
                        value: i,
                        name: background.allSettings.sort[i]['string_' + background.langName],
                        icon: background.allSettings.sort[i]['icon'],
                        selected: (i == background.sorting_type_id) ? activeClass : ''
                    });
                };
                // then push generated strings to DOM
                var translatedStrings = [{
                    // Settings Page
                    settings_title: background.allLangData.settings.title,
                    // Readers Section
                    settings_reader_title: background.allLangData.settings.readerTitle,
                    settings_reader_ex: background.allLangData.settings.readerTitleEx,
                    curr_reader_src: background.shekh_name,
                    curr_reader_img: defaultAvatar,
                    curr_reader_name: background.allLangData.settings.readerTitle,
                    curr_reader_country: '-',
                    readerItem: readersLoop,
                    searchString: background.allLangData.settings.searchString,
                    // Languages Sections
                    settings_lang_title: background.allLangData.settings.langTitle,
                    settings_lang_ex: background.allLangData.settings.langTitleEx,
                    curr_lang_id: background.lang,
                    curr_lang_name: background.allSettings.languages[background.lang]['name'],
                    langItem: langLoop,
                    // Sorting Section
                    settings_playlist_title: background.allLangData.settings.playlistTitle,
                    settings_playlist_ex: background.allLangData.settings.playlistTitleEx,
                    // Sorting
                    settings_sort_curr_name: background.allSettings.sort[background.sorting_type_id]['string_' + background.langName],
                    settings_sort_curr_value: background.sorting_type_id,
                    settings_sort_curr_icon: background.allSettings.sort[background.sorting_type_id]['icon'],
                    sortItem: sortLoop
                }];
                $('#translatedPages').html($('#settingsPage').tmpl(translatedStrings));

                // 3 - Run Search
                $(search.main).each(function() {
                    runSearch('#' + ($(this).attr(search.id)) + ' ' + search.input, $(this).attr(search.attr));
                });

                // 4 - run mSelect
                mSelect();

                // 5 - remove loading state
                $(player).removeClass('loading');

                // 6 - Update Save Button Status
                $(document).on('click', settings.itemClass, function(event) {
                    event.preventDefault();

                    var readerItemValue = $(settings.readerId + ' ' + settings.currentClass).attr('value'),
                        langItemValue = $(settings.langId + ' ' + settings.currentClass).attr('value'),
                        sortItemValue = $(settings.sortId + ' ' + settings.currentClass).attr('value');

                    if (readerItemValue != background.shekh_name) {
                        $(page.saveBtn).removeClass(page.inActiveClasses.reader + ' ' + page.inActiveClasses.sort + ' ' + page.inActiveClasses.lang);
                    } else {
                        $(page.saveBtn).addClass(page.inActiveClasses.reader + ' ' + page.inActiveClasses.sort + ' ' + page.inActiveClasses.lang);
                    }
                });

                // 7 - Click Events
                // Save Button
                $(document).on('click', page.saveBtn, function(event) {
                    event.preventDefault();

                    // reset now session
                    localStorage.removeItem('now');

                    $(player).addClass('loading');
                    // stop quran
                    if (typeof background.x !== 'undefined') {
                        background.x.pause();
                    }
                    // back effect
                    $(player).removeClass(page.activeClasses.settings + ' ' + page.activeClasses.about);
                    // save
                    // get values
                    var finalVals = {
                        reader: $(settings.readerId + ' ' + settings.currentClass).attr('value'),
                        lang: $(settings.langId + ' ' + settings.currentClass).attr('value'),
                        sort: $(settings.sortId + ' ' + settings.currentClass).attr('value')
                    };
                    background.localStorage.setItem('userSettings', JSON.stringify(finalVals));
                    setTimeout(function() {
                        background.location.reload();
                    }, 1000);
                });
            }).error(function() {
                // If Load Failed alert with the error
                alert('error loading newuser page !!');
            });
        }
    });
}

function runErrorPU() {
    // 1 - remove loading state
    $(player).removeClass('loading');

    // 2 - Load 404 Error Page And Render It
    $(player).load('./assets/pages/404.html', function() {
        // 3 - Refresh Click Event 
        $(document).on('click', '.error .refresh', function() {

            // 1 - add loading state
            $(player).addClass('loading');

            // 2 - refresh background page 
            chrome.runtime.getBackgroundPage(function(background) {
                background.location.reload();
            });
        });
    });
}

function runErrorBG() {
    // 1 - fire rhe error icon
    chrome.browserAction.setIcon({
        path: {
            "19": "./assets/imgs/icon_error19.png",
            "38": "./assets/imgs/icon_error38.png"
        }
    });
    // 2 - send message to popup when user open it (when conected)
    chrome.runtime.onConnect.addListener(function(port) {
        port.postMessage({
            error: true
        });
    });
    // 3 - send if already opened
    chrome.runtime.sendMessage({
        error: true
    });
}
