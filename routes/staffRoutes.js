const express = require('express');
const staffController = require('./../controllers/staffController');
const authController = require('./../controllers/authController');
const router = express.Router();

router.route('/login').post(authController.login);

router.route('/signup').post(authController.signup);

router
  .route('/:entity')
  .get(
    authController.protect,
    authController.restrictTo('student', 'staff', 'admin'),
    staffController.getAllStaffs
  )
  .post(
    authController.protect,
    authController.restrictTo('staff', 'admin'),
    staffController.createStaff
  );
router
  .route('/:entity/:id')
  .get(
    authController.protect,
    authController.restrictTo('staff', 'admin'),
    staffController.getOneStaff
  )
  .patch(
    authController.protect,
    authController.restrictTo('staff', 'admin'),
    staffController.updateStaff
  )
  .delete(
    authController.protect,
    authController.restrictTo('staff', 'admin'),
    staffController.deleteStaff
  );

module.exports = router;
