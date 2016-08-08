var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var id = mongoose.Types.ObjectId();
var jsonParser = bodyParser.json();
var config = require('./config');

app.use(express.static('public'));
app.use(bodyParser.json());
mongoose.connect(config.DATABASE_URL);

var Breed = require('./models/breeds.js');
var Shelter = require('./models/shelters.js');
var Profile = require('./models/profiles.js');
var User = require('./models/users.js');

app.get('/breeds', function(req, res) {
    Breed.find(function(err, breed){
        res.send(breed);
    });
});
app.post('/breeds', function(req, res) {
    if(req.body.pk){
      Breed.update({name: req.body.value} ,function(breed){res.json(breed);});
    }else{
      Breed.create({name: req.body.name},function(breed){res.json(breed);});
    }
});
app.get('/shelters', function(req, res) {
    Shelter.find(function(err, shelter){
        res.send(shelter);
    });
});
app.get('/profiles', function(req, res) {
    Profile.find(function(err, profile){
        res.send(profile);
    });
});

app.listen(process.env.PORT || 8080);

module.exports.app = app;
