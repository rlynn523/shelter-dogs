var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dogProfile = new Schema ({
    name: String,
    breed: String,
    age: String,
    shelter: String,
    email: String,
    description: String,
    userId: String
});

var Profile = mongoose.model('Profile', dogProfile);

module.exports = Profile;
