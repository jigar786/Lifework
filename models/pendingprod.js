var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// mongoose.Promise = global.Promise;
mongoose.createConnection('mongodb://localhost/udit');

var db = mongoose.connection;

var PendingProductSchema = mongoose.Schema({
    name_proj: {
        type: String,
        required: true
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
    deadline:{
        type:String,
        default:"None Given Yet"
    },
    price:{
        type: String,
        default:"None Given Yet"
    }
});

var User = module.exports = mongoose.model('PendingProduct', PendingProductSchema);