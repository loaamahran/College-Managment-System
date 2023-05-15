const mongoose = require('mongoose');

const degreeReqs = new mongoose.Schema({
  degree: {
    type: String,
  },

  prerequistes: [String],
});

const Degree = new mongoose.model('Degree', degreeReqs);

module.exports = Degree;
