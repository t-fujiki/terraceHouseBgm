var Carp = require('../models/carp.js');

var util = require('util');
var http = require('http');

function dump(v) {
    return console.log(util.inspect(v));
}

function findSchedules(condition, req, res) {
    console.log('[IN]findSchedules');

    // load
    Carp.find({}).skip(0).limit(200).exec(function(err, result) {
	    console.log('result = ' + result);
        res.send(result);
    });
    console.log('[OUT]findSchedules');
};

exports.list = function(req, res) {
    console.log('[IN]carp list');
    var condition = {};
    var month = req.query.month;
    if(month){
        console.log('month:' + artist);
        condition.month = month;
    }
    findSchedules(condition, req, res);
    console.log('[OUT]carp list');
};
