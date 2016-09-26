var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dogBreeds = new Schema ({
    name: String,
    userId: String
});

var Breed = mongoose.model('Breed', dogBreeds);

module.exports = Breed;
