const request = require('supertest');
const app = require('./../server');
const Course = require('./../models/courses');
const Student = require('./../models/student');

const base_url = 'http://127.0.0.1:5002/api/v1';
describe(
  'registerCourse',
  () => {
    let course;
    let student;

    beforeAll(async () => {
      // Create a course and a student for testing
      course = await Course.create({
        name: 'Test Course',
        credits: 3,
        prerequisites: [],
        maxEnrollments: 2,
        students: [],
      });

      student = await Student.create({
        name: 'Test Student',
        email: 'TestStudent@gmail.com',
        password: '12345678',
        passwordConfirm: '12345678',
        limitCredit: 12,
        registeredHours: 0,
        totalRegisteredHours: 0,
        courses: [],
        finishedCourses: [],
      });
    }, 10000 * 6 * 30);

    afterAll(async () => {
      // Remove the test course and student from the database
      await Course.findByIdAndDelete(course._id);
      await Student.findByIdAndDelete(student._id);
    });

    it('should register a course for a student with no prerequisites', async () => {
      const response = await request(app)
        .post(`${base_url}/courses/${course._id}/register`)
        .set('Authorization',`Bearer ${student.generateAuthToken()}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Registered Successfully');

      // Check that the student and course were updated correctly
      const updatedCourse = await Course.findById(course._id);
      const updatedStudent = await Student.findById(student._id);
      expect(updatedCourse.students).toContainEqual(updatedStudent._id);
      expect(updatedStudent.courses).toContainEqual(updatedCourse._id);
      expect(updatedStudent.registeredHours).toBe(course.creditHours);
    });

    it('should register a course for a student with completed prerequisites', async () => {
      // Add prerequisites to the course
      course.prerequisites = ["6450f5439287a48e40d1d583"];
      await course.save();

      // Add the completed prerequisite to the student's finishedCourses array
      student.finishedCourses = ['6450f5439287a48e40d1d583'];
      await student.save({ validateBeforeSave: false });

      const response = await request(app)
        .post(`${base_url}/courses/${course._id}/register`)
        .set('Authorization',`Bearer ${student.generateAuthToken()}`)
        
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Registered Successfully');

      // Check that the student and course were updated correctly
      const updatedCourse = await Course.findById(course._id);
      const updatedStudent = await Student.findById(student._id);
      expect(updatedCourse.students).toContainEqual(updatedStudent._id);
      expect(updatedStudent.courses).toContainEqual(updatedCourse._id);
      expect(updatedStudent.registeredHours).toBe(course.creditHours * 2);
    });

    it('should return an error if the course is full', async () => {
      // Add another student to the course
      const anotherStudent = await Student.create({
        name: 'Another Test Student',
        limitCredit: 12,
        email: 'ahmed@gmail.com',
        password: 'passowrd1234',
        passwordConfirm: 'passowrd1234',
        registeredHours: 0,
        totalRegisteredHours: 0,
        courses: [],
        finishedCourses: [],
      });
      course.students.push(anotherStudent._id);
      await course.save();

      const response = await request(app)
        .post(`${base_url}/courses/${course._id}/register`)
        .set('Authorization',`Bearer ${student.generateAuthToken()}`)
        
        .expect(400);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe(
        'Course has reached maximum enrollments'
      );

      // Check that the student and course were not updated
      const updatedCourse = await Course.findById(course._id);
      const updatedStudent = await Student.findById(student._id);
      expect(updatedCourse.students).not.toContainEqual(updatedStudent._id);
      expect(updatedStudent.courses).not.toContainEqual(updatedCourse._id);
      expect(updatedStudent.registeredHours).toBe(0);

      // Remove the additional student from the course
      course.students.pop();
      await course.save();
      await Student.findByIdAndDelete(anotherStudent._id);
    });

    // it('should return an error if the student has not completed all the prerequisites', async () => {
    //   // Add a new prerequisite to the course
    //   course.prerequisites.push('6450f5439287a48e40d1d583');
    //   await course.save();

    //   const response = await request(app)
    //     .post(`${base_url}/courses/${course._id}/register`)
    //     .set(
    //       'Authorization',
    //       `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NGVkOWQ3ZDJmYWYwMThkNDI4NzJkNiIsImlhdCI6MTY4Mjk3NDgxNSwiZXhwIjoxNjkwNzUwODE1fQ.0z1Efif-GukeAl4JtVRLv9UjZHTmzArEmVCvBNNqpYs`
    //     )
    //     .expect(400);

    //   expect(response.body.status).toBe('error');
    //   expect(response.body.message).toBe(
    //     'You have not completed all the prerequisites for this course'
    //   );

    //   // Check that the student and course were not updated
    //   const updatedCourse = await Course.findById(course._id);
    //   const updatedStudent = await Student.findById(student._id);
    //   expect(updatedCourse.students).not.toContainEqual(updatedStudent._id);
    //   expect(updatedStudent.courses).not.toContainEqual(updatedCourse._id);
    //   expect(updatedStudent.registeredHours).toBe(0);

    //   // Remove the additional prerequisite from the course
    //   course.prerequisites.pop();
    //   await course.save();
    // });

    it('should return an error if the student exceeds their credit limit', async () => {
      // Set the student's limitCredit to the current credit hours of the course
      student.limitCredit = course.creditHours;
      await student.save({ validateBeforeSave: false });

      const response = await request(app)
        .post(`${base_url}/courses/${course._id}/register`)
        .set('Authorization',`Bearer ${student.generateAuthToken()}`)
        
        .expect(400);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('You have exceeded your credit limit');

      // Check that the student and course were not updated
      const updatedCourse = await Course.findById(course._id);
      const updatedStudent = await Student.findById(student._id);
      expect(updatedCourse.students).not.toContainEqual(updatedStudent._id);
      expect(updatedStudent.courses).not.toContainEqual(updatedCourse._id);
      expect(updatedStudent.registeredHours).toBe(0);
    });
  },
  10000 * 3
);
