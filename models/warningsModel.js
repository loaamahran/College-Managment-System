const mongoose = require('mongoose');

const warningsSchema = new mongoose.Schema({
  warning: {
    type: String,
    required: [true, 'please write a brief description of the warning'],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },

  warningNumber: {
    type: Number,
    min: 1,
    max: 3,
  },

  student: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'warning must relate to a student'],
    },
  ],

  course: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Course',
    },
  ],
});

warningsSchema.pre(/^find/, function (next) {
  this.populate({ path: 'student' })
  .populate({ path: 'course' })
  next();
});

const Warning = new mongoose.model('Warning', warningsSchema);

module.exports = Warning;
