const validator = require('validator');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
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
  photo: String,
  passwordChangedAt: Date,
  password: {
    type: String,
    required: true,
    minlength: 8,
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

  courses: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Course',
    },
  ],

  lectures: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Lecture',
    },
  ],

  Sections: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Section',
    },
  ],

  grades: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Grade',
    },
  ],
  adviser: {
    type: mongoose.Schema.ObjectId,
    ref: 'Adviser',
  },

  attendance: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Attendance',
    },
  ],
  // gpa: {
  //   type: Number,
  //   default: 0,
  //   min: 0,
  //   max: 4.0,
  // },

  totalRegisteredHours: {
    type: Number,
    default: 0,
    min: 0,
  },

  registeredHours: {
    type: Number,
    default: 0,
    min: 0,
  },

  limitCredit: {
    type: Number,
    default: 15,
    min: 0,
    max: 30,
  },
  finishedCourses: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Course',
    },
  ],
});

studentSchema.pre('save', function (next) {
  if (this.gpa >= 3) {
    this.limitCredit = 20;
  } else if (this.gpa <= 2) {
    this.limitCredit = 12;
  } else {
    this.limitCredit = 17;
  }
  next();
});

studentSchema.pre('save', async function (next) {
  //this function runs only when the password is changed
  if (!this.isModified('password')) return next();

  //hash the password with cost of 12

  this.password = await bcrypt.hash(this.password, 12);

  //delete the password confirm , it's not gonna be saved into the database
  this.passwordConfirm = undefined;

  next();
});

studentSchema.pre(/^find/, function(next) {
  this.populate({ path: 'courses', select: 'name -prerequisites' })
    .populate({ path: 'lectures', select: 'name Doctor' })
    .populate({ path: 'Sections', select: 'name Teacher' })
    .populate({path:'grades'})
    .populate({path:'adviser', select:'name email'})
    .populate({path:'attendance'})
  next();
});

studentSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
//if This below function returnn false that means that the user hasn't changed their password

studentSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedDate = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    console.log(changedDate, JWTTimestamp);
    return JWTTimestamp < changedDate; // 100 < 200
  }
  //False means password is not changed
  return false;
};

const Student = new mongoose.model('Student', studentSchema);

module.exports = Student;
