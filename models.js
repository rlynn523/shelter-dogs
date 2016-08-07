var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dogBreeds = new Schema ({
    breed: String,
});

var Breed = mongoose.model('Breed', dogBreeds);

module.exports = Breed;
