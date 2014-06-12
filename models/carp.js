var mongoose = require('mongoose');

NAME_RECORD = 'carp_schedule';

var schema = new mongoose.Schema({
    month: {
        type: Number,
        required: true
    },
    day: {
        type: Number,
        required: true
    },
    start: {
        type: String,
        required: true
    },
    team: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    }
});

// create object
module.exports = mongoose.model(NAME_RECORD, schema);