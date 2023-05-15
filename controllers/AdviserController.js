const Adviser = require('../models/Adviser');

const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');


// 7) Adviser handler factory

exports.getAllAdvisers = factory.getAll(Adviser);
exports.createAdviser = factory.createOne(Adviser);
exports.getOneAdviser = factory.getOne(Adviser);
exports.updateAdviser = factory.updateOne(Adviser);
exports.deleteAdviser = factory.deleteOne(Adviser);
