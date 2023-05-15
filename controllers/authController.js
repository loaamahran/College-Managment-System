const { promisify } = require('util');
const User = require('./../models/UserModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const Student = require('./../models/student');
const Staff = require('./../models/staff');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

// recentely added 
exports.signup = catchAsync(async (req, res, next) => {
  const entityType = req.headers.entity; // assuming you pass the entity type as a parameter in the URL
  let newUser;

  if (entityType === 'student') {
    
    newUser = await Student.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });

  } else if (entityType === 'staff') {
    newUser = await Staff.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });
  } else if (entityType === 'admin') {
    newUser = await Admin.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });
  } else {
    return res.status(400).json({ message: 'Invalid entity type' });
  }
  
 
 const filteredUser = Object.assign( {} , {
  name: newUser.name,
  email: newUser.email,
  
  // add more fields here as needed
});



  createAndSendToken(filteredUser, 201, res)
  next();
});


exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const entityType = req.headers.entity; // assuming you pass the entity type as a parameter in the URL

  //1) check if the user missed his email or password,400 for a bad request
  if (!email || !password) {
    return next(new AppError('please provide your email or password', 400));
  }

  //2) check if the user exists and password is correct

  let user;

  if (entityType === 'student') {
    user = await Student.findOne({ email }).select('+password');
    
  } 
  else if (entityType === 'staff') {
    user = await Staff.findOne({ email }).select('+password');
  } 
  // else if (entityType === 'admin') {
  //   user = await Admin.findOne({ email }).select('+password');
  // }
   else 
    return next(new AppError('Invalid entity type', 400));

  if (entityType === 'student') {
    // add correctPassowrd for student
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password !', 401));
    }
    
  } else if (entityType === 'staff') {
    // add correctPassowrd for staff
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password !', 401));
    }
  }
  else{
    return next(new AppError('Invalid entity type', 400));
  }

  
  //3)if everything is okay, send the token to the client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
  next();
});

//

exports.protect = catchAsync(async (req, res, next) => {
  //1) getting the token and check if it's there
  let token;
  const entityType = req.headers.entity;
  
  
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('Your are not logged in please login to get access', 401)
    );
  }

  //2) verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  //3)check if the user still exists
  // To check that the user that we have issued the token is the same exact user whose id in the decoded

  let currentUser;

  if (entityType === 'student') {

    currentUser = await Student.findById(decoded.id);

  } else if (entityType === 'staff') {
    currentUser = await Staff.findById(decoded.id);
  }
  //  else if (entityType === 'admin') {
  //   currentUser = await Admin.findById(decoded.id);
  // } 
  else {
    return next(new AppError('Invalid entity type', 400));
  }

  if (!currentUser) {
    next(
      new AppError(
        'You dont have permission to perform this action',
        401
      )
    );
  }

  //4) check if the user changed password after the token was issued
  
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('password has recently changed! please log in again.', 401)
    );
  }
  //Grant access to the protected route
  req.user = currentUser;
  req.user['role'] = entityType ;
  
  next();
});

exports.restrictTo = (...roles) => {
  // roles ['admin' ,'lead-guide]
  return (req, res, next) => {
    
    // If the user is not included in the array
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('you do not have permission to perform this action', 403)
      );
    }
    next();
  };
};





// old version 


// exports.signup = catchAsync(async (req, res, next) => {
//   const newUser = await User.create(req.body);

  // name: req.body.name,
  // email: req.body.email,
  // password: req.body.password,
  // passwordConfirm: req.body.passwordConfirm,

//   const token = signToken(newUser._id);

//   res.status(201).json({
//     status: 'success',
//     token,
//     data: {
//       user: newUser,
//     },
//   });

// exports.login = catchAsync(async (req, res, next) => {
//   const { email, password } = req.body;

  //1) check if the user missed his email or password,400 for a bad request
//   if (!email || !password) {
//     return next(new AppError('please provide your email or password', 400));
//   }

  //2) check if the user exists and password is correct

//   const user = await User.findOne({ email }).select('+password');

  //401 unauthorized
//   if (!user || !(await user.correctPassword(password, user.password))) {
//     return next(new AppError('Incorrect email or password !', 401));
//   }

//   console.log(user);

  //3)if everything is okay, send the token to the client
//   const token = signToken(user._id);

//   res.status(200).json({
//     status: 'success',
//     token,
//   });
// });

// exports.protect = catchAsync(async (req, res, next) => {
//   //1) getting the token and check if it's there
//   let token;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     token = req.headers.authorization.split(' ')[1];
//   }

//   if (!token) {
//     return next(
//       new AppError('Your are not logged in please login to get access', 401)
//     );
//   }

//   //2) verify the token
//   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
//   // console.log(decoded);

//   //3)check if the user still exists
//   // To check that the user that we have issued the token is the same exact user whose id in the decoded

//   const currentUser = await User.findById(decoded.id);

//   if (!currentUser) {
//     next(
//       new AppError(
//         'the user belonging to this token do not exist anymore!',
//         401
//       )
//     );
//   }

//   //4)check if the user changed password after the token was issued

//   if (currentUser.changedPasswordAfter(decoded.iat)) {
//     return next(
//       new AppError('password has recently changed! please log in again.', 401)
//     );
//   }
//   //Grant access to the protected route
//   req.user = currentUser;

//   next();
// });