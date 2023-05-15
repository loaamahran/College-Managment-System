const Staff = require('./../models/staff');
const factory = require('./handlerFactory');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');


exports.getAllStaffs = factory.getAll(Staff);
exports.createStaff = factory.createOne(Staff);
exports.getOneStaff = factory.getOne(Staff);
exports.updateStaff = factory.updateOne(Staff);
exports.deleteStaff = factory.deleteOne(Staff);
