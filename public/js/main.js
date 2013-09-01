function play(video) {
    var params = {
        allowScriptAccess: "always"
    };
    var atts = {
        id: "player"
    };

    swfobject.embedSWF("http://www.youtube.com/v/" + video.vid + "?enablejsapi=1&playerapiid=ytplayer", "player", "500", "400", "8", null, null, params, atts);
}

var mainCtrl = function($scope, $http) {

        $http.get('/api/video/list', {
            params: {
                limit: 10
            }
        }).success(function(data, status, headers, config) {
            $scope.videos = data;
            angular.forEach($scope.videos, function(value, key) {
                var date = new Date(value.date);
                value.date = date.toLocaleDateString();
            });
            console.log($scope.videos);
            play($scope.videos[0]);
        }).
        error(function(data, status, headers, config) {
            alert(status);
        });
}