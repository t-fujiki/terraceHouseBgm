var Video = require('../models/video.js');

var util = require('util');
var http = require('http');

function dump(v) {
    return console.log(util.inspect(v));
}

function toLocaleString(date) {
    var month = "0" + (date.getMonth() + 1);
    var day = "0" + date.getDate();
    return [
    date.getFullYear(), month.substr(month.length - 2), day.substr(day.length - 2)].join('-');
}

function findVideos(condition, req, res) {
    console.log('[IN]findVideos');
    var offset = req.query.offset || 0;
    var limit = req.query.limit || 500;
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
                if (video.thumbnail == undefined) {
                    console.log('get original data, id = ' + video.vid);
                    dump(video);
                    var req = http.get({ // (1)
                        host: 'gdata.youtube.com',
                        path: '/feeds/api/videos/' + video.vid + '?alt=json'
                    }, function(res) {
                        var body = '';
                        res.on('data', function(data) {
                            body += data.toString();
                        });
                        res.on('end', function() {
                            console.log('get original data, id = ' + video.vid + ', body =' + body);

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
                            }, {
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

                    // error handler
                    req.on('error', function(err) {
                        console.log("Error: " + err.message);
                        dump(video);
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
            // console.log('success to get date. = ' + result);
            var dateArray = new Array();
            result.forEach(function(date) {
                var date = new Date(date);
                dateArray.push(toLocaleString(date));
            });
            // console.log('Before:' + dateArray);
            dateArray.sort();
            dateArray.reverse();
            // console.log('After:' + dateArray);
            res.send(dateArray);
        } else {
            console.log('fail to get date.');
        }
    });
    console.log('[OUT]findDate');
}

function update(req, res) {
    console.log('[IN]update, id = ' + req.params.id);

    Video.update({
        _id: req.params.id
    }, {
        $inc: {
            count: 1
        }
    }, {
        upsert: false
    }, function(err, numberAffected, raw) {
        if (!err) {
            console.log(req.params.id + ":");
            dump(raw);
            Video.find({_id: req.params.id})
            .exec(function(err, result) {
                if(!err){
                    res.send(result);
                }else{
                    console.log("NG, " + err);
                    res.send({});                    
                }
            });
        } else {
            console.log("NG, " + err);
            res.send({
                count: 0
            });
        }
    });

    console.log('[OUT]update');
}

exports.list = function(req, res) {
    var condition = {};
    var date = req.query.date;
    if (date) {
        var gt_date = new Date(date);
        var lt_date = new Date(date);
        gt_date.setDate(gt_date.getDate() - 1);
        lt_date.setDate(lt_date.getDate() + 1);
        console.log('date:' + date + ',gt_date:' + gt_date + ',lt_date:' + lt_date);
        condition.date = {
            $gte: gt_date,
            $lt: lt_date
        };
    }
    findVideos(condition, req, res);
};

exports.date = function(req, res) {
    findDate(req, res);
};

exports.update = function(req, res) {
    update(req, res);
};