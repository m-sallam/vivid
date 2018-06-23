const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const passport = require('koa-passport')
const LocalStrategy = require('passport-local')
const Schema = mongoose.Schema

var userSchema = new Schema({
  username: { type: String, required: true, unique: true, min: 5, max: 32, lowercase: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  country: { type: String, required: true },
  languages: [{ type: String, required: true }],
  type: { type: String, required: true }
})

userSchema.plugin(passportLocalMongoose)
var userModel = mongoose.model('User', userSchema)

passport.use(new LocalStrategy(userModel.authenticate()))
passport.serializeUser(userModel.serializeUser())
passport.deserializeUser(userModel.deserializeUser())

module.exports = userModel
