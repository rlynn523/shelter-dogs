var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var id = mongoose.Types.ObjectId();
var jsonParser = bodyParser.json();
var config = require('./config.js');
var bcrypt = require('bcryptjs');
app.use(express.static('public'));
app.use(bodyParser.json());
mongoose.connect(config.DATABASE_URL);

var Breed = require('./models/breeds.js');
var Shelter = require('./models/shelters.js');
var Profile = require('./models/profiles.js');
var User = require('./models/users.js');

var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
app.use(passport.initialize());

var strategy = new BasicStrategy(function(username, password, callback) {
    User.findOne({
        username: username
    }, function (err, user) {
        if (err) {
            callback(err);
            return;
        }
        if (!user) {
            return callback(null, false, {
                message: 'Incorrect username.'
            });
        }
        user.validatePassword(password, function(err, isValid) {
            if (err) {
                return callback(err);
            }
            if (!isValid) {
                return callback(null, false, {
                    message: 'Incorrect password.'
                });
            }
            return callback(null, user);
        });
    });
});

passport.use(strategy);

app.get('/logout', function(req, res){
    req.logout();
    req.session.destroy();
    res.redirect("/login");
});

app.post('/users', jsonParser, function(req, res) {
    if (!req.body) {
        return res.status(400).json({
            message: 'No request body'
        });
    }
    if (!('username' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: username'
        });
    }
    var username = req.body.username;
    if (typeof username !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: username'
        });
    }
    username = username.trim();
    if (username === '') {
        return res.status(422).json({
            message: 'Incorrect field length: username'
        });
    }
    if (!('password' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: password'
        });
    }
    var password = req.body.password;
    if (typeof password !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: password'
        });
    }

    password = password.trim();

    if (password === '') {
        return res.status(422).json({
            message: 'Incorrect field length: password'
        });
    }
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }
        bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
            var user = new User({
                username: username,
                password: hash
            });
            user.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal server error'
                    });
                }
                return res.status(201).json({});
            });
        });
    });
});

app.get('/breeds', passport.authenticate('basic', {session: false}), function(req, res) {
    Breed.find({userId: req.user._id}, function(err, breed) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        return res.json(breed);
    });
});

app.post('/breeds', passport.authenticate('basic', {session: false}), function(req, res) {
    if (req.body.pk) {
        Breed.findOneAndUpdate({
                _id: req.body.pk,
            }, {
                $set: {
                    name: req.body.value,
                    userId: req.user._id
                },
            }, {
                new: true
            },
            function(err, breed) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal Server Error'
                    });
                }
                return res.status(200).json(breed);
            });
    } else {
        Breed.create({
            name: req.body.name,
            userId: req.user._id
        }, function(err, breed) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            }
            return res.status(201).json(breed);
        });
    }
});
app.delete('/breeds/:id', passport.authenticate('basic', {session: false}), function(req, res) {
    Breed.remove({
            _id: req.params.id,
            userId: req.user._id
        },
        function(err, breed) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            }
            return res.status(200).json(breed);
        });
});
app.get('/shelters', passport.authenticate('basic', {session: false}), function(req, res) {
    Shelter.find({userId: req.user._id}, function(err, shelter) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        return res.json(shelter);
    });
});
app.post('/shelters', passport.authenticate('basic', {session: false}), function(req, res) {
    if (req.body.pk) {
        Shelter.findOneAndUpdate({
                _id: req.body.pk,
            }, {
                $set: {
                    name: req.body.value,
                    userId: req.user._id
                },
            }, {
                new: true
            },
            function(err, shelter) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal Server Error'
                    });
                }
                return res.status(200).json(shelter);
            });
    } else {
        Shelter.create({
            name: req.body.name,
            address: req.body.address,
            email: req.body.email,
            userId: req.user._id
        }, function(err, shelter) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            }
            return res.status(201).json(shelter);
        });
    }
});
app.delete('/shelters/:id', passport.authenticate('basic', {session: false}), function(req, res) {
    Shelter.remove({
            _id: req.params.id,
            userId: req.user._id
        },
        function(err, shelter) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            }
            return res.status(200).json(shelter);
        });
});
app.get('/profiles', passport.authenticate('basic', {session: false}), function(req, res) {
    Profile.find({userId: req.user._id}, function(err, profile) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        return res.json(profile);
    });
});
app.post('/profiles', passport.authenticate('basic', {session: false}), function(req, res) {
    if (req.body) {
        Profile.create({
            name: req.body.name,
            breed: req.body.breed,
            age: req.body.age,
            shelter: req.body.shelter,
            email: req.body.email,
            description: req.body.description,
            userId: req.user._id
        }, function(err, profile) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            }
            return res.status(201).json(profile);
        });
    } else {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});
app.delete('/profiles/:id', passport.authenticate('basic', {session: false}), function(req, res) {
    Profile.remove({
            _id: req.params.id,
            userId: req.user._id
        },
        function(err, profile) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            }
            return res.status(200).json(profile);
        });
});

app.listen(process.env.PORT || 8080);

module.exports.app = app;
