var mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose')
var Schema = mongoose.Schema

var userSchema = new Schema({
  username: { type: String, required: true, unique: true, min: 5, max: 32, lowercase: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }
})
userSchema.plugin(passportLocalMongoose)
var userModel = mongoose.model('User', userSchema)

module.exports = userModel
