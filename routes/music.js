var Post = require('../models/music.js');

var util = require('util');

function dump(v) {
    return console.log(util.inspect(v));
}

function findMusic(condition, req, res) {
    console.log('[IN]findMusic');
    var offset = req.query.offset || 0;
    var limit = req.query.limit || 6;
    var order = req.query.order || -1;
    console.log('offset = ' + offset + ', limit = ' + limit);

    Post.find(condition).skip(offset).limit(limit).sort({
        date: order
    }).exec(function(err, result) {
        if (!err) {
            console.log('success to get musics. = ' + result);
            res.send(result);
        } else {
            console.log('fail try to get musics.');
        }
    });
    console.log('[OUT]findMusic');
}


exports.list = function(req, res) {
    var condition = {};
    var date = req.query.date;
    if (date) {
        condition.date = {
            $in: [date]
        };
    }
    findMusic(condition, req, res);
};