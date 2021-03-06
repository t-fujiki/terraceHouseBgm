// var tag = document.createElement('script');

// tag.src = "https://www.youtube.com/iframe_api";
// var firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var isReady = false;
var ALL = "all";

function onYouTubeIframeAPIReady() {
    isReady = true;
}

function onPlayerReady(event) {
    event.target.playVideo();
}

var done = false;

function onPlayerStateChange(event) {
    //   if (event.data == YT.PlayerState.PLAYING && !done) {
    //     setTimeout(stopVideo, 6000);
    //     done = true;
    // }
    if (event.data == YT.PlayerState.ENDED) { // play completed
        var scope = angular.element($('#main')).scope().next();
    }
}

function stopVideo() {
    player.stopVideo();
}

function playerState(state) {
    // console.log(state);
    if (state == 0) { // play completed
        var scope = angular.element($('#main')).scope().next();
    }
}

function toLocaleString(date) {
    var month = "0" + (date.getMonth() + 1);
    var day = "0" + date.getDate();
    return [
        date.getFullYear(), month.substr(month.length - 2), day.substr(day.length - 2)].join('-');
}

var mainCtrl = function($scope, $http) {
    var current = 0;
    var previousSortState = {
        target: "date",
        order: 0
    };

    $scope.isRandom = false;

    $scope.next = function() {
        if ($scope.isRandom == true) {
            playRandom();
        } else {
            playNext();
        }
    };

    $scope.prev = function() {
        if ($scope.isRandom == true) {
            playRandom();
        } else {
            playPrev();
        }
    };

    function playRandom() {
        var nextIndex = 0;
        nextIndex = Math.floor(Math.random() * $scope.videos.length + 1);
        play($scope.videos[nextIndex]);
        current = nextIndex;
    };

    function playNext() {
        while (true) {
            current++;
            if (current == $scope.videos.length) {
                current = 0;
            }

            if ($scope.query == undefined || $scope.query.date == ALL || $scope.videos[current].date == $scope.query.date) {
                play($scope.videos[current]);
                break;
            }
        }
    };

    function playPrev() {
        while (true) {
            current--;
            if (current < 0) {
                current = $scope.videos.length - 1;
            }

            if ($scope.query == undefined || $scope.query.date == ALL || $scope.videos[current].date == $scope.query.date) {
                play($scope.videos[current]);
                break;
            }
        }
    };

    function inc(video) {
        $http.post('/api/video/' + video._id, {
            params: {}
        }).success(function(data, status, headers, config) {
            console.log(data);
            video.count = data[0].count;
        }).
        error(function(data, status, headers, config) {
            console.log('error at get date:' + status);
        });
    }

    function play(video) {
        console.log("playing vid = " + video.vid);
        player.loadVideoById(video.vid, 5, "large")
        // var player = document.getElementById('player');
        $scope.currentVideo.status = "none";
        $scope.currentVideo = video;
        $scope.currentVideo.status = "playing";
        // player.loadVideoById(video.vid);
        inc(video);
    }

    function set(video) {
        $scope.currentVideo = video;
        $scope.currentVideo.status = "playing";

        player = new YT.Player('player', {
            height: '300',
            width: '400',
            videoId: video.vid,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
        inc(video);
    }

    // function filter(date) {
    //     var $container = $('#container');
    //     var options = {},

    //         key = "filter";
    //     value = date;
    //     if (value != ALL) {
    //         options[key] = '.' + value;
    //     } else {
    //         options[key] = "*";
    //     }
    //     // // parse 'false' as false boolean
    //     // setTimeout(function() {
    //     //     $container.isotope(options);
    //     // }, 50)
    // }

    $scope.setLayout = function() {
        console.log("[IN]setLayout");
        var $container = $('#container');

        $container.isotope({
            itemSelector: '.element',
            getSortData: {
                date: function($elem) {
                    var date = $elem.attr('date');
                    return date;
                },
                count: function($elem) {
                    var count = parseInt($elem.attr('count'), 10);
                    return count;
                }
            }
        });
        console.log("[OUT]setLayout");
    };

    function showVideos(date) {
        $http.get('/api/video/list', {
            params: null
        }).success(function(data, status, headers, config) {
            $scope.videos = data;
            var count = 0;
            angular.forEach($scope.videos, function(value, key) {
                var date = new Date(value.date);
                value.date = toLocaleString(date);
                value.index = count;
                count++;
            });
            // console.log($scope.videos);
            var nextIndex = 0;
            if ($scope.isRandom == true) {
                nextIndex = Math.floor(Math.random() * $scope.videos.length);
            }
            set($scope.videos[nextIndex]);
            current = nextIndex;

            // if ($scope.date != undefined) {
            //     filter($scope.date);
            // }
        }).
        error(function(data, status, headers, config) {
            console.log('error at get list:' + status);
        });

    }

    function setup() {
        console.log("[IN]setup");

        $http.get('/api/video/date', {}).success(function(data, status, headers, config) {
            $scope.dates = [];
            angular.forEach(data, function(value, key) {
                // var date = new Date(value);
                // $scope.dates.push(toLocaleString(date));
                $scope.dates.push(value);
            });

            $scope.date = ALL;
            showVideos($scope.date);

        }).error(function(data, status, headers, config) {
            console.log('error at get date:' + status);
        });

        console.log("[OUT]setup");
    }

    setup();

    $scope.showall = function($event) {
        setup();
    }

    $scope.dateSelected = function($date) {
        // if ($scope.date != undefined) {
        //     // showVideos($scope.date);
        //     filter($scope.date)
        // }
    }

    $scope.sort = function($event) {
        console.log($event.srcElement.value);
        var $container = $('#container');

        // don't proceed if already selected
        // if ($this.hasClass('selected')) {
        //     return false;
        // }
        // make option object dynamically, i.e. { filter: '.my-filter-class' }
        var options = {};

        key = "sortBy";
        value = $event.srcElement.value;
        options[key] = value;

        if (previousSortState.target == value) {
            if (previousSortState.order == 0) {
                options["sortAscending"] = true;
                previousSortState.order = 1;
                console.log(options);
            } else {
                options["sortAscending"] = false;
                previousSortState.order = 0;
                console.log(options);
            }
        } else {
            options["sortAscending"] = false;
            previousSortState.order = 0;
        }
        previousSortState.target = value
        // parse 'false' as false boolean
        $container.isotope(options);

    }

    $scope.select = function($event) {
        // console.log($event);
        play($scope.videos[$event.target.attributes['index'].value]);
        current = $event.target.attributes['index'].value;
    }

    $scope.forward = function($event) {
        $scope.next();
    }

    $scope.backward = function($event) {
        $scope.prev();
    }
};
