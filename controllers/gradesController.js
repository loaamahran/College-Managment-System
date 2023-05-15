const Grade = require('../models/grades');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');


// 8) Grades 

exports.getAllGrades = factory.getAll(Grade);
exports.createGrades = factory.createOne(Grade);
exports.getOneGrade = factory.getOne(Grade);
exports.updateGrades = factory.updateOne(Grade);
exports.deleteGrades = factory.deleteOne(Grade);

