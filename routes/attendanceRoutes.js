const express = require('express');
const attendanceController = require('../controllers/attendanceController');
const authController = require('../controllers/authController');
const router = express.Router();

router
  .route('/:entity')
  .get(authController.protect,authController.restrictTo('student','staff','admin'),attendanceController.getAttendance)
  .post(authController.protect,authController.restrictTo('staff','admin'),attendanceController.createAttendance);
router
  .route('/:entity/:id')
  .get(authController.protect,authController.restrictTo('staff','admin'),attendanceController.getAttendee)
  .patch(authController.protect,authController.restrictTo('staff','admin'),attendanceController.updateAttendance)
  .delete(authController.protect,authController.restrictTo('staff','admin'),attendanceController.deleteAttendance);


  module.exports = router;