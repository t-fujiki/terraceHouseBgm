var Video = require('../models/video.js');

var util = require('util');
var http = require('http');

function dump(v) {
    return console.log(util.inspect(v));
}

function findVideos(condition, req, res) {
    console.log('[IN]findVideos');
    var offset = req.query.offset || 0;
    var limit = req.query.limit || 6;
    var order = req.query.order || -1;
    console.log('offset = ' + offset + ', limit = ' + limit);

    // load key
    Video.find(condition).skip(offset).limit(limit).sort({
        date: order
    }).exec(function(err, result) {
        if (!err) {
            console.log('success to get videos. = ' + result);
            // load additonal data
            result.forEach((function(video) {
                if (video.last_updated_date == null) {
                    console.log('get original data, id = ' + video.vid);
                    http.get({ // (1)
                        host: 'gdata.youtube.com',
                        path: '/feeds/api/videos/' + video.vid + '?alt=json'
                    }, function(res) {
                        var body = '';
                        res.on('data', function(data) {
                            body += data.toString();
                        });
                        res.on('end', function() {
                            recent = JSON.parse(body);
                            video.original_title = recent.entry.title.$t;
                            video.url = recent.entry.media$group.media$player[0].url;
                            video.thumbnail = recent.entry.media$group.media$thumbnail[0].url;
                            dump(video);
                            var newVideo = new Video(video);
                            dump(newVideo);
                            //    newVideo.save(function(err) {
                            Video.update({
                                _id: newVideo._id
                            }, {
                                $set: {
                                    original_title: newVideo.original_title,
                                    url: newVideo.url,
                                    thumbnail: newVideo.thumbnail
                                }
                            }, 
                            {
                                upsert: true
                            }, function(err) {
                                if (!err) {
                                    console.log(video);
                                } else {
                                    console.log("NG, " + err);
                                }
                            });
                        });
                    });
                } else {
                    console.log('data is up-to-date, id = ' + video.vid);
                }
            }))



            res.send(result);
        } else {
            console.log('fail try to get videos.');
        }
    });
    console.log('[OUT]findVideos');
}

function findDate(req, res) {
    console.log('[IN]findDate');

    Video.distinct("date").sort({
        date: 1
    }).exec(function(err, result) {
            if (!err) {
                console.log('success to get date. = ' + result);
                res.send(result);
            } else {
                console.log('fail to get date.');
            }
        });
    console.log('[OUT]findDate');
}

exports.list = function(req, res) {
    var condition = {};
    var date = req.query.date;
    if (date) {
        condition.date = {
            $in: [date]
        };
    }
    findVideos(condition, req, res);
};

exports.date = function(req, res){
    findDate(req, res);
};