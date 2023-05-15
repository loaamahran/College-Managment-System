const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please provide your name'],
  },
  email: {
    type: String,
    required: [true, 'please provide your emial'],
    unique: true,
    validate: [validator.isEmail, 'please provide a valid email'],
    lowercase: true,
  },

  photo: {
    type: String,
  },

  role: {
    type: String,
    enum: ['student', 'staff', 'admin'],
    default: 'student',
  },

  password: {
    type: String,
    required: [true, 'please provide a password'],
    minlength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    require: [true, 'please confirm your password'],
    validate: {
      //Onlu works on create and save
      validator: function (el) {
        return el === this.password;
      },
      message: 'passwords are not the same !',
    },
  },

  passwordChangedAt: Date,
});

//Moongose pres ave middleware that hashes the data between the time we recieve the data and the time it's saved in the databse
userSchema.pre('save', async function (next) {
  //only run this function if the password was actually modified
  if (!this.isModified('password')) return next();
  //hash the password
  this.password = await bcrypt.hash(this.password, 12);
  //not to save passwordConfirm to the databse

  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
//if This below function returnn false that means that the user hasn't changed their password

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedDate = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    console.log(changedDate, JWTTimestamp);
    return JWTTimestamp < changedDate; // 100 < 200
  }
  //False means password is not changed
  return false;
};

const User = new mongoose.model('User', userSchema);

module.exports = User;
