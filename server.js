var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost/shelter-dogs');

var Breed = require('./models.js');

app.get('/breeds', function(req, res) {
    Breed.find(function(err, breed){
        res.send(breed);
    });
});

app.listen(process.env.PORT || 8080);

module.exports.app = app;
