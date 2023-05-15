const mongoose = require('mongoose');

const gradesSchema = mongoose.Schema({
  course_name: String,

  final: {
    type: Number,
    required: [true, 'final grade is missed'],
  },
  midterm: {
    type: Number,
    required: [true, 'midterm grade is missed'],
  },
  lab: {
    type: Number,
    required: [true, 'lab grade is missed'],
  },

  gpa: {
    type: Number,
    required: [true, 'gpa is missed !'],
  },

  cgpa: {
    type: Number,
    required: [true, 'cgpa is missed'],
  },

  course: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Course',
    },
  ],

  students: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Student',
    },
  ],
});

gradesSchema.pre(/^find/, function (next) {
  this.populate({ path: 'students' })
  .populate({ path: 'course' })
  next();
});

const Grade = mongoose.model('Grade', gradesSchema);

module.exports = Grade;
