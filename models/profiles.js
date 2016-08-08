var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dogProfile = new Schema ({
    name: String,
    breed: String,
    age: String,
    sex: String,
    shelter: String
});

var Profile = mongoose.model('Profile', dogProfile);

module.exports = Profile;
