const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
const studentRoutes = require('./../routes/studentRoutes');
const staffRoutes = require('./../routes/staffRoutes');



// recenetly added 

 // to be deleted 
// router.route('/login').post(authController.login);

// router.route('/signup/:entityType').post(authController.signup);

//

// router.route('/logout').get(authController.logout);

// router.put('/forgot-password', authController.forgotPassword);
// router.put('/resetpassword' , authController.resetPassword);


// router.route('/').get(userController.getAllUsers).post(userController.createUser)

// router.route('/:id').get(userController.getOneUser).patch(userController.updateUser).delete(userController.deleteUser);

//


router.use('/staffs', staffRoutes);
router.use('/students', studentRoutes);

module.exports = router;