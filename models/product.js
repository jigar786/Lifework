var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// mongoose.Promise = global.Promise;
mongoose.createConnection('mongodb://localhost/udit');

var db = mongoose.connection;

var ProductSchema = mongoose.Schema({
    name_proj: {
        type: String,
        required: true
    },
    contact_pm: {
        type: String,
        required: true,
        default: "No Queries Yet"
    },
    client_email: {
        type: String
    },
    overview: {
        type: String
    },
    freel_allotedemail: {
        type: String,
        default: null
    },
    freel_completed: {
        type: String,
        default: null
    },
    pm_completed: {
        type: String,
        default: null
    },
    client_completed: {
        type: String,
        default: null
    },
    deadline:{
        type:String,
        default:"None Given Yet"
    },
    price:{
        type:String,
        default:"None Given Yet"
    }
});



var User = module.exports = mongoose.model('Product', ProductSchema);