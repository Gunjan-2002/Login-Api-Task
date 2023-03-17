const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const user = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

user.pre('save' , async function(next){
  if(!this.isModified('password')){
    next();
  }
  // Salt
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password , salt);
  next();
});

user.methods.verifyPassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword , this.password);
};

const User = mongoose.model('User', user);

module.exports = User;