const mongoose = require('mongoose');

const coursesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Course must have a name'],
    },

    description: {
      type: String,
      maxlength: 80,
    },

    prerequisites: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
      },
    ],

    creditHours: {
      type: Number,
      required: true,
    },

    time: {
      type: Date,
    },
    content: {
      type: String,
    },

    students: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Student',
      },
    ],

    maxEnrollments: {
      type: Number,
      required: [true, 'missing field'],
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// coursesSchema.virtual('students', {
//   ref:'Student',
//   foreignField: 'courses',
//   localField: '_id',
// });

coursesSchema.pre(/^find/, function (next) {
  this.populate({ path: 'prerequisites' });
  // .populate({ path: 'students' })
  next();
});

const Course = new mongoose.model('Course', coursesSchema);

module.exports = Course;
