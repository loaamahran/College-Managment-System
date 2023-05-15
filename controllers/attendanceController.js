const Attendance = require('../models/attendance');

const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');


//5) Attendance handler factory

exports.getAttendance = factory.getAll(Attendance);
exports.createAttendance = factory.createOne(Attendance);
exports.getAttendee = factory.getOne(Attendance);
exports.updateAttendance = factory.updateOne(Attendance);
exports.deleteAttendance = factory.deleteOne(Attendance);