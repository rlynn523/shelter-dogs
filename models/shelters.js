var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dogShelters = new Schema ({
    name: String,
});

var Shelter = mongoose.model('Shelter', dogShelters);

module.exports = Shelter;
