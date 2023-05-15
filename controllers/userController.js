const User =  require('./../models/UserModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res,next) => {
  const users  = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
  next();
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this resource not yet implemented',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this resource not yet implemented',
  });
};

exports.getOneUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this resource not yet implemented',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this resource not yet implemented',
  });
};
