const Lecture = require('../models/lectures');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');


//3) Lectures handler factory

exports.getAllLectures = factory.getAll(Lecture);
exports.createLecture = factory.createOne(Lecture);
exports.getOneLecture = factory.getOne(Lecture);
exports.updateLecture = factory.updateOne(Lecture);
exports.deleteLecture = factory.deleteOne(Lecture);


exports.registerLecture = async (req, res) => {
    try {
      // Get the lecture by ID
      const lecture = await Lecture.findById(req.params.lectureId);
  
      // Get the currently logged in student
      const student = await Student.findById(req.user._id);
  
      // Check if the lecture exists
      if (!lecture) {
        return res.status(404).json({
          status: 'fail',
          message: 'Lecture not found',
        });
      }
  
      // Check if the student is already enrolled in the lecture
      if (lecture.students.includes(req.user._id)) {
        return res.status(400).json({
          status: 'fail',
          message: 'Student is already enrolled in this lecture',
        });
      }
  
      // Check if the lecture is full
      if (lecture.students.length >= lecture.maxGroupSize) {
        return res.status(400).json({
          status: 'fail',
          message: 'Lecture is full',
        });
      }
  
      // Enroll the student in the lecture
      lecture.students.push(req.user._id);
      await lecture.save();
  
      // Add the lecture to the student's list of lectures
      student.lectures.push(lecture._id);
      await student.save({ validateBeforeSave: false });
  
      res.status(200).json({
        status: 'success',
        message: 'Enrolled in lecture successfully',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 'error',
        message: 'An error occurred while enrolling in lecture',
      });
      
    }
  };
  
