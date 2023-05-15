const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'lab must have a name'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, ' A lecture must have a limit'],
    select: false,
    min: 30,
    max: 60,
  },
  hall: {
    type: String,
    required: [true, 'lecture must include the hall'],
  },
  students: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Student',
    },
  ],

  Doctor: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Staff',
    },
  ],

  time: String,
});

lectureSchema.pre(/^find/, function (next) {
  this.populate({ path: 'students' })
  .populate({ path: 'Doctor' })
  next();
});

const Lecture = mongoose.model('Lecture', lectureSchema);

module.exports = Lecture;
