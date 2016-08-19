var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var id = mongoose.Types.ObjectId();
var jsonParser = bodyParser.json();

app.use(express.static('public'));
app.use(bodyParser.json());
mongoose.connect('mongodb://ryanlynn:rango123@ds145325.mlab.com:45325/heroku_t722w71v');
// mongoose.connect('mongodb://localhost/shelter-dogs');

var Breed = require('./models/breeds.js');
var Shelter = require('./models/shelters.js');
var Profile = require('./models/profiles.js');

app.get('/breeds', function(req, res) {
    Breed.find(function(err, breed) {
        if (err) {
            return res.status(500);
        }
        res.send(breed);
    });
});
app.post('/breeds', function(req, res) {
    if (req.body.pk) {
        Breed.findOneAndUpdate({
                _id: req.body.pk,
            }, {
                $set: {
                    name: req.body.value
                },
            }, {
                new: true
            },
            function(err, breed) {
                if (err) {
                    return res.status(500);
                }
                res.status(200).json(breed);
            });
    } else {
        Breed.create({
            name: req.body.name
        }, function(err, breed) {
            if (err) {
                return res.status(500);
            }
            res.status(201).json(breed);
        });
    }
});
app.delete('/breeds/:id', function(req, res) {
    Breed.remove({
            _id: req.params.id,
        },
        function(err, breed) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            }
            res.status(200).json(breed);
        });
});
app.get('/shelters', function(req, res) {
    Shelter.find(function(err, shelter) {
        if (err) {
            return res.status(500);
        }
        res.send(shelter);
    });
});
app.post('/shelters', function(req, res) {
    if (req.body.pk) {
        Shelter.findOneAndUpdate({
                _id: req.body.pk,
            }, {
                $set: {
                    name: req.body.value
                },
            }, {
                new: true
            },
            function(err, shelter) {
                if (err) {
                    return res.status(500);
                }
                res.status(200).json(shelter);
            });
    } else {
        Shelter.create({
            name: req.body.name,
            address: req.body.address,
            email: req.body.email
        }, function(err, shelter) {
            if (err) {
                return res.status(500);
            }
            res.status(201).json(shelter);
        });
    }
});
app.delete('/shelters/:id', function(req, res) {
    Shelter.remove({
            _id: req.params.id,
        },
        function(err, shelter) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            }
            res.status(200).json(shelter);
        });
});
app.get('/profiles', function(req, res) {
    Profile.find(function(err, profile) {
        if (err) {
            return res.status(500);
        }
        res.send(profile);
    });
});
app.post('/profiles', function(req, res) {
    if (req.body) {
        Profile.create({
            name: req.body.name,
            breed: req.body.breed,
            age: req.body.age,
            shelter: req.body.shelter,
            email: req.body.email,
            description: req.body.description
        }, function(err, profile) {
            if (err) {
                return res.status(500);
            }
            res.status(201).json(profile);
        });
    }
});
app.delete('/profiles/:id', function(req, res) {
    Profile.remove({
            _id: req.params.id,
        },
        function(err, profile) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            }
            res.status(200).json(profile);
        });
});

app.listen(process.env.PORT || 8080);

module.exports.app = app;
