const Course = require('./../models/courses');
const Student = require('./../models/student');
const factory = require('./handlerFactory');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');



//1)Course handler factory
exports.getAllCourses = factory.getAll(Course);
exports.createCourse = factory.createOne(Course);
exports.getOneCourse = factory.getOne(Course, { path: 'students' });
exports.updateCourse = factory.updateOne(Course);
exports.deleteCourse = factory.deleteOne(Course);

exports.registerCourse = catchAsync(async (req, res, next) => {
  // Get the ID of the course to register for from the request parameters
  const courseId = req.params.id;

  // Find the course by its ID
  const course = await Course.findById(courseId);

  // Check if the course exists
  if (!course) {
    return next(new AppError('Course Not found!'));
  }

  // Find the student by its ID
  const student = await Student.findById(req.user._id);

  // Check if the student exists
  if (!student) {
    return next(new AppError('student not found'));
  }

  // Check if the student is already registered for the course
  if (student.courses.includes(courseId)) {
    return next(new AppError('You already registered for this course'));
  }
  
  // Check if the course has reached its maximum enrollment
  if (course.maxEnrollments <= course.students.length) {
    return next(new AppError('Course has reached maximum enrollments'));
  }
  ////////////////////
  const prerequisites = course.prerequisites;
  const finishedCourses = student.finishedCourses;
  
  const hasPrerequisites = prerequisites.every((prerequisite) =>
  finishedCourses.includes(prerequisite)
  );
  
  if (!hasPrerequisites) {
    // Get the prerequisites that the student has not completed
    const missingPrerequisites = prerequisites.filter(
      (prerequisite) => !finishedCourses.includes(prerequisite)
      );
    // If the student is missing other prerequisites, return an error message
    return next(
      new AppError(
        `You have not completed the following prerequisites: ${missingPrerequisites.join(
          ', '
        )}`
      )
    );
  }
  // If the student has failed a course, suggest a new course to enroll in
  const failedCourse = course.prerequisites.find(
    (prerequisite) => !finishedCourses.includes(prerequisite)
  );
  if (failedCourse) {
    const suggestedCourse = await Course.findOne({
      prerequisites: failedCourse,
    });
    if (suggestedCourse) {
      return res.status(400).json({
        status: 'fail',
        message: `You have failed the ${failedCourse} prerequisite. We suggest you enroll in ${suggestedCourse.title}.`,
      });
    }
  }
  const creditHours = course.creditHours;

  // Check if registering for the course will exceed the student's limitCredit
  if (student.registeredHours + creditHours > student.limitCredit) {
    return next(new AppError('You have exceeded your credit limit'));
  }

  // Update the student's registeredHours and totalRegisteredHours fields
  student.registeredHours += creditHours;

  // ystna lma yng7

  // student.totalRegisteredHours += creditHours;

  ////////////

  // Add the course to the student's list of courses
  student.courses.push(courseId);
  await student.save({ validateBeforeSave: false });

  // Add the student to the course's list of students
  course.students.push(student);
  await course.save({ validateBeforeSave: false });

  // Return a success response
  res.status(200).json({
    status: 'success',
    message: 'Registered Successfully',
  });
  next();
});



/////////////////////////////////////////////////////////////////////////////////////////////


















// }))
/*
async (req, res, next) => {
    try {
      // Get the ID of the course to register for from the request parameters
      const courseId = req.params.id;
  
      // Find the course by its ID
      const course = await Course.findById(courseId);
  
      // Check if the course exists
      if (!course) {
        return res.status(404).json({
          status: 'fail',
          message: 'Course not found',
        });
      }
  
      // Find the student by its ID
      const student = await Student.findById(req.user.id);
  
      // Check if the student exists
      if (!student) {
        return res.status(404).json({
          status: 'fail',
          message: 'Student not found',
        });
      }
  
      // Check if the student is already registered for the course
      if (student.courses.includes(courseId)) {
        return res.status(400).json({
          status: 'fail',
          message: 'Student is already registered for this course',
        });
      }
  
      // Check if the course has reached its maximum enrollment
      if (course.maxEnrollments <= course.students.length) {
        return res.status(400).json({
          status: 'fail',
          message: 'Course has reached maximum enrollment',
        });
      }
  
      // Add the course to the student's list of courses
      student.courses.push(courseId);
      await student.save();
  
      // Add the student to the course's list of students
      course.students.push(student);
      await course.save();
  
      // Return a success response
      res.status(200).json({
        status: 'success',
        message: 'Student registered for course',
      });
    } catch (err) {
      next(err);
    }
  });
  */
