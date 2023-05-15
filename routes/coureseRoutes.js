const express = require('express');
const router = express.Router();
const courseController = require('./../controllers/coursesController');
const authController = require('./../controllers/authController');


router
  .route('/:entity')
  .get(authController.protect,authController.restrictTo('student','staff','admin'),courseController.getAllCourses)
  .post(authController.protect,authController.restrictTo('staff','admin'),courseController.createCourse);
router
  .route('/:entity/:id')
  .get(authController.protect,authController.restrictTo('student','staff','admin'),courseController.getOneCourse)
  .patch(authController.protect,authController.restrictTo('staff','admin'),courseController.updateCourse)
  .delete(authController.protect,authController.restrictTo('staff','admin'),courseController.deleteCourse);
  router
  .route('/:entity/:id/register')
  .post(authController.protect,authController.restrictTo('student','admin'),courseController.registerCourse);

  module.exports = router;