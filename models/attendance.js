const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  students: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Student',
    },
  ],
  course: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Course',
    },
  ],

  section: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Section',
    },
  ],
  lecture: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Lecture',
    },
  ],
  isPresent: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

attendanceSchema.pre(/^find/,function(next) {
  this.populate({ path: 'students' })
    .populate({ path: 'course' })
    .populate({ path: 'section' })
    .populate({ path: 'lecture' })
    next();
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
