const validator = require('validator');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required!!'],
  },
  email: {
    type: String,
    required: [true, 'please provide your email address'],
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, 'please provide a valid email'],
  },
  office_hours: {
    type: String,
  },
  // recenctely added
  contact_num: Number,
  gender: String,
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  role: {
    type: String,
    required: true,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please provide your password'],
    validate: {
      //this inly works on create and save , if we update the password this function will no longer work.
      validator: function (el) {
        return el === this.password;
      },
      message: 'passwords are not the same',
    },
  },
  course: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Course',
    },
  ],

  lectures: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'lectures',
    },
  ],
  section: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Section',
    },
  ],
});

staffSchema.pre(/^find/, function (next) {
  this.populate({ path: 'course' })
    .populate({ path: 'lectures' })
    .populate({ path: 'section' })
  next();
});

staffSchema.pre('save', async function (next) {
  //this function runs only when the password is changed
  if (!this.isModified('password')) return next();

  //hash the password with cost of 12

  this.password = await bcrypt.hash(this.password, 12);

  //delete the password confirm , it's not gonna be saved into the database
  this.passwordConfirm = undefined;

  next();
});

staffSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
//if This below function returnn false that means that the user hasn't changed their password

staffSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedDate = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    console.log(changedDate, JWTTimestamp);
    return JWTTimestamp < changedDate; // 100 < 200
  }
  //False means password is not changed
  return false;
};

const Staff = new mongoose.model('Staff', staffSchema);

module.exports = Staff;
