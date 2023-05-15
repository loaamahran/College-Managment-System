const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const factory = require('./../controllers/handlerFactory');
const Assignment = require('./../models/assignments');

exports.getAllAssignments = factory.getAll(Assignment);
exports.createAssignments = factory.createOne(Assignment);
exports.getOneAssignment = factory.getOne(Assignment);
exports.updateAssignment = factory.updateOne(Assignment);
exports.deleteAssignment = factory.deleteOne(Assignment);

