var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/udit');

var db = mongoose.connection;

var UserSchema = mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    username: {
        type: String,
        index: true,
        unique: true,
        required:true
    },
    phone: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    // sex: {
    //     type: String,
    //     required:true
    // },
    types: {
        type: String,
        required:true
    },
    pmnumber:{
        type:String,
        default:null
    },
    skills:{
        type:String,
        default:null
    }

});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}
module.exports.getUserByUsername = function(username, callback) {
    var query = {
        username: username
    }
    User.findOne(query, callback);
}

module.exports.comparepm = function(username, callback) {
    var query = {
        pmnumber: pmnumber
    }
    User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}