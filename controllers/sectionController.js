const Section = require('../models/sections');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

//4) Sections Handler factory

exports.getAllSections = factory.getAll(Section);
exports.CreateSection = factory.createOne(Section);
exports.getOneSection = factory.getOne(Section);
exports.updateSection = factory.updateOne(Section);
exports.deleteSection = factory.deleteOne(Section);

exports.registerSection = async (req, res) => {
    try {
      // Get the section by ID
      const section = await Section.findById(req.params.sectionId);
  
      // Get the currently logged in student
      const student = await Student.findById(req.user._id);
  
      // Check if the section exists
      if (!section) {
        return res.status(404).json({
          status: 'fail',
          message: 'Section not found',
        });
      }
  
      // Check if the student is already enrolled in the section
      if (section.students.includes(req.user.id)) {
        return res.status(400).json({
          status: 'fail',
          message: 'Student is already enrolled in this section',
        });
      }
  
      // Check if the section is full
      if (section.students.length >= section.maxGroupSize) {
        return res.status(400).json({
          status: 'fail',
          message: 'Section is full',
        });
      }
  
      // Enroll the student in the section
      section.students.push(req.user.id);
      await section.save();
  
      // Add the section to the student's enrolled sections
      student.Sections.push(section._id);
      await student.save({ validateBeforeSave: false });
  
      return res.status(201).json({
        status: 'success',
        message: 'Enrolled in section successfully',
        data: {
          section,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  };
  
  
