var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var User = require('../models/users');
var PendingProduct = require('../models/pendingprod');
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');
var nodemailer = require('nodemailer');
var url = 'mongodb://localhost:27017/udit';

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/udit');
//mongoose.Promise = global.Promise;
// MongoClient.connect('mongodb://localhost:27017/TodoApp' , (err,client) => {
//   if(err){
//     return console.log('Unable to connect');
//   }

//   console.log("Connected");

//   const db = client.db('udit')
//var app = express();
// app.engine('ejs', require('ejs').renderFile)
// app.set('view engine', 'ejs')
// app.set('views', __dirname + './../views')


router.get('/', ensureAuthenticated, function(req, res) {
    var json = {};
    json.metadata = res.locals;
    //res.send(json);
    //x = JSON.stringify(json, undefined, 2);
    console.log(json.metadata);
    //var emailid = req.query.valid;
    //console.log(emailid);r transpo

    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            user: 'lifeworkgroup@hotmail.com',
            pass: 'Lifework@123'
        }
    });

    router.get('/projectdetails', function(req, res) {
        // var id = 
        keyid = req.query.id;
        PendingProduct.findById(keyid, function(err, adventure1) {
            res.render('projectdetails', {
                pendingusers: adventure1
            })
        })

    });

    router.get('/projectdetailsc', function(req, res) {
        // var id = 
        keyid = req.query.id;
        Product.findById(keyid, function(err, adventure2) {
            res.render('projectdetails', {
                pendingusers: adventure2
            })
        })

    });

    if (json.metadata.user.types === 'client') {

        router.get('/productadd', function(res, res) {
            res.render('productadd')
        });

        router.post('/productadd', (req, res) => {
            if (!req.body.name_proj || !req.body.overview) {
                req.flash('error_msg', "Some Fields Are Missing");
                res.redirect('/');
            } else {
                var pendingprod = new PendingProduct({
                    name_proj: req.body.name_proj,
                    client_email: json.metadata.user.username,
                    overview: req.body.overview
                });

                pendingprod.save(function(err, doc) {
                    if (err)
                        console.log("Error Occurred");
                    else {
                        //res.send(doc)
                        res.redirect('/');
                    }
                });
            }
        });

        router.post('/completedclient', function(req, res) {
            console.log(req.query.id);
            Product.findByIdAndUpdate(req.query.id, {
                $set: {
                    client_completed: 1
                }
            }, (err, produ) => {
                if (err)
                    console.log("Error Occured")
                res.redirect('/');
            })
        })

        // PendingProduct.find({
        //     'client_email': json.metadata.user.username
        // }, function(err, pendingproducts) {
        //     var resultArray = [];
        //     if (err)
        //         res.send(err);
        //     // console.log("saved hhkhkjk   ", products)
        //     res.render('index', {
        //         pendingusers: pendingproducts,
        //         cli: true,
        //         pm: false,
        //         freelancer: false
        //     });
        //     // resultArray.push(products);
        //     // res.render('index', {
        //     //     items: resultArray
        //     // });
        // });

        Product.find({
            'client_email': json.metadata.user.username,
            $or: [{
                'client_completed': null
            }, {
                'pm_completed': null
            }, {
                'freel_completed': null
            }]
        }, function(err, products) {
            var resultArray = [];
            if (err)
                res.send(err);
            PendingProduct.find({
                    'client_email': json.metadata.user.username
                },
                function(err, pendingproducts) {
                    var resultArray = [];
                    if (err)
                        res.send(err);
                    // console.log("saved hhkhkjk   ", products)
                    res.render('index', {
                        pendingusers: pendingproducts,
                        users: products,
                        cli: true,
                        pm: false,
                        freelancer: false,
                        p: products.client_completed
                    });
                });
            // resultArray.push(products);
            // res.render('index', {
            //     items: resultArray
            // });
        });
    } else if (json.metadata.user.types === 'freelancer') {

        router.post('/completedfreel', function(req, res) {
            console.log(req.query.id);
            Product.findByIdAndUpdate(req.query.id, {
                $set: {
                    freel_completed: 1
                }
            }, (err, produ) => {
                if (err)
                    console.log("Error Occurred")
                    //console.log(produ.client_email);
                res.redirect('/');
            })
        })

        var keyid2;
        router.post('/contact', function(req, res) {
            // var id = 
            keyid2 = req.query.id;
            Product.findById(keyid2, function(err, adv) {
            res.render('contact', {
                pendingusers: adv
            });
        });
    });

        router.post('/contactedpm', function(req, res) {
            var fulltext = req.body.contact;
            var emailidoffree = req.query.id;
            var nameofproject = req.query.name;
            Product.findByIdAndUpdate(keyid2, {
                $set: {
                    contact_pm: req.body.contact
                }
            }, (err, contact) => {
                if (err)
                    console.log("Error Occurred")
                res.redirect('/');
            });
            var mailOptions = {
                from: 'lifeworkgroup@hotmail.com',
                to: 'lifeworkgroup@hotmail.com',
                subject: 'Queries By Freelancer for project name '+nameofproject,
                text: fulltext+' Please reply to '+emailidoffree+' directly to contact.'
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        });

        router.post('/rejectfreel', function(req, res) {
            PendingProduct.findByIdAndUpdate(req.query.id, {
                $set: {
                    freel_allotedemail: undefined
                }
            }, (err, produ) => {
                if (err)
                    console.log("Error Occurred")
                res.redirect('/');
            })
        })

        router.post('/acceptfreel', function(req, res) {
            console.log(req.query.id);
            PendingProduct.find({
                    '_id': req.query.id
                },
                function(err, acceptedprod) {
                    var resultArray = [];
                    if (err)
                        res.send(err);
                    var naming = acceptedprod[0].name_proj;
                    var emailing = acceptedprod[0].client_email;
                    var overviewing = acceptedprod[0].overview;
                    var allotedemailid = acceptedprod[0].freel_allotedemail;
                    var price = acceptedprod[0].price;
                    var deadline = acceptedprod[0].deadline;
                    var produc = new Product({
                        name_proj: naming,
                        client_email: emailing,
                        overview: overviewing,
                        freel_allotedemail: allotedemailid,
                        deadline: deadline,
                        price:price
                    });

                    produc.save(function(err, doc) {
                        if (err)
                            console.log("Error Occurred");
                        else {
                            PendingProduct.findByIdAndRemove(req.query.id, (err, produ) => {
                                if (err)
                                    console.log("Error Occurred")
                                res.redirect('/');
                            });
                        }
                    });
                    var mailOptions = {
                        from: 'lifeworkgroup@hotmail.com',
                        to: emailing,
                        subject: 'From Your Project Needs',
                        text: 'Your Project has been initiated'
                    };

                    transporter.sendMail(mailOptions, function(error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                });
        });


        Product.find({
                'freel_allotedemail': json.metadata.user.username,
                $or: [{
                    'client_completed': null
                }, {
                    'pm_completed': null
                }, {
                    'freel_completed': null
                }]
            },
            function(err, products) {
                var resultArray = [];
                if (err)
                    res.send(err);
                PendingProduct.find({
                        'freel_allotedemail': json.metadata.user.username
                    },
                    function(err, pendingproducts) {
                        var resultArray = [];
                        if (err)
                            res.send(err);
                        // console.log("saved hhkhkjk   ", products)
                        res.render('index', {
                            pendingusers: pendingproducts,
                            users: products,
                            freelancer: true,
                            pm: false,
                            cli: false
                        });
                    });
                // resultArray.push(products);
                // res.render('index', {
                //     items: resultArray
                // });
            });
    } else if (json.metadata.user.types === 'pm') {
        var keyid;

        router.post('/edittext', function(req, res) {
            // var id = 
            keyid = req.query.id;
            PendingProduct.findById(keyid, function(err, adventure) {
                res.render('edittext', {
                    pendingusers: adventure
                })
            })

        });

        router.post('/textedited', (req, res) => {
            PendingProduct.findByIdAndUpdate(keyid, {
                $set: {
                    overview: req.body.name,
                    deadline: req.body.deadline,
                    price: req.body.price
                }
            }, (err, txt) => {
                if (err)
                    console.log("Error Occurred")
                res.redirect('/');
            })
        })

        router.post('/listfree', function(req, res) {
            pid = req.query.id;
            User.find({
                'types': 'freelancer',
            }, function(err, freelancer) {
                var resultArray = [];
                if (err)
                    res.send(err);
                res.render('listfree', {
                    freelancers: freelancer
                });
            })
        });

        router.post('/listfree/allotfree', function(req, res) {
            console.log(pid);
            console.log(req.query.id);
            PendingProduct.findByIdAndUpdate(pid, {
                $set: {
                    freel_allotedemail: req.query.id
                }
            }, (err, free) => {
                if (err)
                    console.log("Error Occurred")
                res.redirect('/');
            })
        });

        router.post('/completedpm', function(req, res) {
            console.log(req.query.id);
            var emailidcli;
            Product.findByIdAndUpdate(req.query.id, {
                $set: {
                    pm_completed: 1
                }
            }, (err, produ) => {
                if (err)
                    console.log("Error Occured")
                emailidcli = produ.client_email;
                console.log("gy7y7ygtgy", emailidcli);
                var mailOptions = {
                    from: 'lifeworkgroup@hotmail.com',
                    to: emailidcli,
                    subject: 'From Your Project Needs',
                    text: 'Your Project has been marked completed. For further details please LogIN. Thank You.'
                };
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                res.redirect('/');
            })
        });

        Product.find({
            $or: [{
                'client_completed': null
            }, {
                'pm_completed': null
            }, {
                'freel_completed': null
            }]
        }, function(err, products) {
            var resultArray = [];
            if (err)
                res.send(err);
            PendingProduct.find({},
                function(err, pendingproducts) {
                    var resultArray = [];
                    if (err)
                        res.send(err);
                    // console.log("saved hhkhkjk   ", products)
                    res.render('index', {
                        pendingusers: pendingproducts,
                        users: products,
                        cli: false,
                        pm: true,
                        freelancer: false,
                        p: products.client_completed
                    });
                });
            // resultArray.push(products);
            // res.render('index', {
            //     items: resultArray
            // });
        });
    }
    // Product.find({
    //     'name': json.metadata.user.username,
    // }, function(err, products) {
    //     var resultArray = [];
    //     if (err)
    //         res.send(err);
    //     res.render('index', {
    //         users: products
    //     });
    // resultArray.push(products);
    // res.render('index', {
    //     items: resultArray
    // });
    //});
    // res.render('index');
    // var resultArray = [];
    // mongo.connect(url, function(err, db) {
    //     assert.equal(null, err);
    //     var cursor = db.collection('users').find();
    //     cursor.forEach(function(doc, err) {
    //         assert.equal(null, err);
    //         resultArray.push(doc);
    //         console.log(resultArray);
    //     }, function() {
    //         db.close();
    //         res.render('index', {
    //             items: resultArray
    //         });
    //     });
});
// });

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg', 'You are not Logged In');
        res.redirect('/users/home');
    }
}

// router.get('/get-data', function(req, res, next) {
//     var resultArray = [];
//     mongo.connect(url, function(err, db) {
//         assert.equal(null, err);
//         var cursor = db.collection('users').find();
//         cursor.forEach(function(doc, err) {
//             assert.equal(null, err);
//             resultArray.push(doc);
//         }, function() {
//             db.close();
//             res.render('index', {
//                 items: resultArray
//             });
//         });
//     });
// });



module.exports = router;