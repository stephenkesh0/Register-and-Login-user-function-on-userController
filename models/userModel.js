// User Schema would be defined here
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema({
  firstName : {
    type : String,
    required : true
  },

  lastName : {
    type : String,
    required : true
  },

  email : {
    type : String,
    required : true,
    unique : true
  },

  phone : {
    type : Number,
    required : true,
    unique : true
  },

  password : {
    type : String,
    required : true
  },

  // for reseting password shenanigans 
  resetPasswordToken : String,
  resetPasswordExpire : Date
},{
  // this is in another curly brace because we aren't doing the input
  timestamps : true
})


// middleware to encrypt password before saving
userSchema.pre("save", async function(next){
  if (!this.isModified("password")) {
    return next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// middleware to compare entered password with encrypted password

userSchema.methods.matchPassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password)
}










module.exports = mongoose.model("User", userSchema)