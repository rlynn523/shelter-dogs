var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dogBreeds = new Schema ({
    name: String,
});

var Breed = mongoose.model('Breed', dogBreeds);

module.exports = Breed;
