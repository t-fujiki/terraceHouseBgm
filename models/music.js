var mongoose = require('mongoose');

NAME_RECORD = 'music';

var schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: false
    },
    category: {
        type: String,
        required: false
    }
});

// create object
module.exports = mongoose.model(NAME_RECORD, schema);