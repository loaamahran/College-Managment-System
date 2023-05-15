const Student = require('../models/student');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

//6) Students handler factory
exports.aliasTopStudents = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-gpa'
    req.query.fields = 'name,email,gpa'
    next();
  };
  
exports.getAllStudents = factory.getAll(Student);
exports.createStudent = factory.createOne(Student);
exports.getOneStudent = factory.getOne(Student);
exports.updateStudent = factory.updateOne(Student);
exports.deleteStudent = factory.deleteOne(Student);


