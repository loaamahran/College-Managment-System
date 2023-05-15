const mongoose = require('mongoose');
const sectionsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'lab must have a name'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, ' A section must have a limit'],
    min: 20,
    max: 35,
  },
  students: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Student',
    },
  ],

  Teacher: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Staff',
    },
  ],

  lab: {
    type: String,
    required: [true, 'lab musyt have a name'],
  },

  time: Date,
});

sectionsSchema.pre(/^find/, function (next) {
  this.populate({ path: 'students' })
  .populate({ path: 'staff' })
  next();
});

const Section = new mongoose.model('Section', sectionsSchema);

module.exports = Section;
