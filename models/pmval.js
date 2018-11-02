var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/udit');

var db = mongoose.connection;

var pmval = mongoose.Schema({
    pmnumber: {
        type: String
    }
});

var pmval = module.exports = mongoose.model('pmval', pmval, 'pmval');