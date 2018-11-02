var express = require('express');
var router = express.Router();
const Joi = require('joi');
var passport = require('passport');
var MongoClient = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');
var pmval = require('../models/pmval');
var nodemailer = require('nodemailer');
const url = require('url');
MongoClient.connect('mongodb://localhost:27017/udit', (err, client) => {
    if (err) {
        return console.log('Unable to connect');
    }
    console.log("Connected");
    const db = client.db('udit')
    router.get('/register', function(req, res) {
        res.render('register');
    });
    router.get('/home', function(req, res) {
        res.render('home');
    });
    router.get('/login', function(req, res) {
        res.render('login');
    });

    router.post('/contactus', function(req, res) {
        var namcont = req.body.name;
        var emailcont = req.body.email;
        var nodemailer = require('nodemailer');

        var transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
                user: 'lifeworkgroup@hotmail.com',
                pass: 'Lifework@123'
            }
        });
        var mailOptions = {
            from: 'lifeworkgroup@hotmail.com',
            to: 'lifeworkgroup@hotmail.com',
            subject: 'Contact Form',
            text: `Contacted By ${namcont} with email id ${emailcont}`
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                req.flash('success_msg', "Mail has been sent");
                res.redirect("/users/home")
            }
        });
    });
    router.post('/register', function(req, res) {
        var name = req.body.name;
        var email = req.body.email;
        var phone = req.body.phone;
        var password = req.body.password;
        var types = req.body.types;
        var pmnumber = req.body.pmnumber;
        var skills = req.body.skills;
        var newUser = new User({
            name: name,
            username: email,
            phone: phone,
            password: password,
            types: types,
            pmnumber: pmnumber,
            skills: skills
        });
        var someval = new pmval({
            pmnumber: '007'
        });
        someval.save(function(err, doc) {
            if (err)
                console.log("fucked");
        });

        if (!req.body.name || !req.body.email || !req.body.phone || !req.body.password || !req.body.types) {
            req.flash('error_msg', "Some Fields Are Missing");
            res.redirect('/users/register');
        } else {
            if (types === "pm") {
                db.collection('pmval').find({
                    pmnumber: pmnumber
                }).toArray().then((docs) => {
                    console.log(JSON.stringify(docs, undefined, 2));
                    if (docs.length <= 0) {
                        req.flash('error_msg', "Please Enter Valid PM Number");
                        res.redirect('/users/register');
                    } else {
                        User.createUser(newUser, function(err, user) {
                            if (err) {
                                // res.send(err);
                                req.flash('error_msg', "User already exists");
                                res.redirect('/users/register');
                            } else {
                                console.log(user);
                                req.flash('success_msg', "Please Login Now");
                                res.redirect('/users/home');
                            }
                        });
                    }

                }, (err) => {
                    console.log(err);
                    req.flash('error_msg', "Please Enter Valid PM Number");
                    res.redirect('/users/register');

                });

            } else if (types === "client") {
                User.createUser(newUser, function(err, user) {
                    if (err) {
                        // res.send(err);
                        req.flash('error_msg', "User Already Exists");
                        res.redirect('/users/register');
                    } else {
                        console.log(user);
                        req.flash('success_msg', "Please Login Now");
                        res.redirect('/users/home');
                    }
                });
            } else if (types === "freelancer") {
                if (!req.body.skills) {
                    req.flash('error_msg', "Please Enter Skills");
                    res.redirect('/users/register');
                } else {
                    User.createUser(newUser, function(err, user) {
                        if (err) {
                            // res.send(err);
                            req.flash('error_msg', "User already exists");
                            res.redirect('/users/register');
                        } else {
                            console.log(user);
                            req.flash('success_msg', "Please Login Now");
                            res.redirect('/users/home');
                        }
                    });
                }
            }
        }
        // } else if (types === "client") {
        //     var newUser = new User({
        //         name: name,
        //         username: email,
        //         phone: phone,
        //         password: password,
        //         sex: sex,
        //         types: types,
        //         pmnumber: pmnumber,
        //         skills: skills
        //     });
        //     User.createUser(newUser, function(err, user) {
        //         if (err) {
        //             // res.send(err);
        //             req.flash('error_msg', "User already exists");
        //             res.redirect('/users/register');
        //         } else {
        //             console.log(user);
        //             req.flash('success_msg', "Please Login Now");
        //             res.redirect('/users/home');
        //         }
        //     });
        //     // req.flash('success_msg', "Please Login Now");
        //     // res.redirect('/users/login');
        // }
    });


    passport.use(new LocalStrategy(
        function(username, password, done) {
            User.getUserByUsername(username, function(err, user) {
                if (err) throw err;
                if (!user) {
                    return done(null, false, {
                        message: "Unknown User"
                    });
                }
                User.comparePassword(password, user.password, function(err, isMatch) {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, {
                            message: 'Invalid password'
                        });
                    };
                });
            });
        }));

    passport.serializeUser(function(user, done) {
        done(null, user.id)
    });

    passport.deserializeUser(function(id, done) {
        User.getUserById(id, function(err, user) {
            done(err, user);
        })

    })

    var x;
    router.post('/login',

            passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/users/login',
                failureFlash: true
            }),
            function(req, res, next) {
                res.locals = {
                    emailids: req.body.username,
                    types: 'freelancer'
                };
                return next();
                crap = req.body.username;
                res.redirect(url.parse('/?valid=' + crap).path);
            }),



        router.get('/logout', function(req, res) {
            req.logout();
            req.flash('success_msg', 'You have logged out succesfully');
            res.redirect('home');
        });
});
module.exports = router;