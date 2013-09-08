function playerState(state) {
    console.log(state);
    if (state == 0) {
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
                var nextIndex = 0;
                nextIndex = Math.floor(Math.random() * $scope.videos.length + 1);
                play($scope.videos[nextIndex].vid);
                current = nextIndex;
            } else {
                current++;
                if (current < $scope.videos.length) {
                    play($scope.videos[current].vid);
                } else {
                    play($scope.videos[0].vid);
                    current = 0;
                }
            }
        };

        function play(vid) {
            var player = document.getElementById('player');
            player.loadVideoById(vid);
        }

        function set(video) {
            var params = {
                allowScriptAccess: "always"
            };
            var atts = {
                id: "player"
            };

            swfobject.embedSWF("http://www.youtube.com/v/" + video.vid + "?enablejsapi=1&playerapiid=ytplayer", "player", "400", "300", "8", null, null, params, atts);
        }

        $http.get('/api/video/list', {
            params: {
                limit: 100
            }
        }).success(function(data, status, headers, config) {
            $scope.videos = data;
            var count = 0;
            angular.forEach($scope.videos, function(value, key) {
                var date = new Date(value.date);
                value.date = date.toLocaleDateString();
                value.index = count;
                count++;
            });
            console.log($scope.videos);

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

        $http.get('/api/video/date', {}).success(function(data, status, headers, config) {
            $scope.dates = [];
            angular.forEach(data, function(value, key) {
                var date = new Date(value);
                $scope.dates.push(date.toLocaleDateString());
            });
        }).error(function(data, status, headers, config) {
            alert(status);
        });

        $scope.select = function($event) {
            console.log($event);
            play($event.target.attributes['vid'].value);
            current = $event.target.attributes['index'].value;
        }
    };