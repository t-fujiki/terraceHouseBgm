var mongoose = require('mongoose');

NAME_RECORD = 'music';

var schema = new mongoose.Schema({
    artist: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    vid: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: false
    },
    original_title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    last_updated_date: {
        type: Date,
        required: false
    },
});

// create object
module.exports = mongoose.model(NAME_RECORD, schema);