function playerState(state) {
    // console.log(state);
    if (state == 0) { // play completed
        var scope = angular.element($('#main')).scope().next();
    }
}

function onYouTubePlayerReady(playerId) {
    var player = document.getElementById('player');
    player.addEventListener('onStateChange', 'playerState');
    player.playVideo();
}

var mainCtrl = function($scope, $http) {
        var current = 0;
        $scope.isRandom = true;

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

        playRandom = function(){
            var nextIndex = 0;
            nextIndex = Math.floor(Math.random() * $scope.videos.length + 1);
            play($scope.videos[nextIndex]);
            current = nextIndex;
        };

        playNext = function() {
            current++;
            if (current < $scope.videos.length) {
                play($scope.videos[current]);
            } else {
                play($scope.videos[0]);
                current = 0;
            }
        };

        playPrev = function() {
            current--;
            if (0 <= current) {
                play($scope.videos[current]);
            } else {
                play($scope.videos[$scope.videos.length - 1]);
                current = $scope.videos.length - 1;
            }
        };

        function play(video) {
            var player = document.getElementById('player');
            $scope.currentVideo = video;
            player.loadVideoById(video.vid);
        }

        function set(video) {
            var params = {
                allowScriptAccess: "always"
            };
            var atts = {
                id: "player"
            };

            $scope.currentVideo = video;
            swfobject.embedSWF("http://www.youtube.com/v/" + video.vid + "?enablejsapi=1&playerapiid=ytplayer", "player", "400", "300", "8", null, null, params, atts);
        }

        function setup(condition) {
            $http.get('/api/video/list', {
                params: condition
            }).success(function(data, status, headers, config) {
                $scope.videos = data;
                var count = 0;
                angular.forEach($scope.videos, function(value, key) {
                    var date = new Date(value.date);
                    value.date = date.toLocaleDateString();
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
            }).
            error(function(data, status, headers, config) {
                alert(status);
            });
        }

        setup();

        $http.get('/api/video/date', {}).success(function(data, status, headers, config) {
            $scope.dates = [];
            angular.forEach(data, function(value, key) {
                var date = new Date(value);
                $scope.dates.push(date.toLocaleDateString());
            });
            $scope.date = $scope.dates[0];
        }).error(function(data, status, headers, config) {
            alert(status);
        });

        $scope.showall = function($event) {
            setup();
        }

        $scope.dateSelected = function($date) {
            console.log($scope.date);

            var condition = {limit: 10};

            if($scope.date != 'all'){
                condition.date = $scope.date;
            }

            setup(condition);
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