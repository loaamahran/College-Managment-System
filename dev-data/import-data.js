const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./../models/courses.js');
const Attendance = require('./../models/attendance.js');
const Section = require('./../models/sections.js');
const Staff = require('./../models/staff.js');
const Lecture = require('./../models/lectures.js');
const Student = require('./../models/student-profile.js');
const Coursepreqs = require('../models/coursesPreqs.js');
const Degree = require('./../models/degreePreqs.js');
const Adviser = require('./../models/Adviser.js');
const Grade = require('./../models/grades.js');
const { log } = require('console');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    //This databse returns a promise an we should handle it using then(con)=>{}
  })
  .then(() => {
    console.log('Database Connected successfully');
  });

//Read the file

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/courses.json`, 'utf-8')
);
const attendance = JSON.parse(
  fs.readFileSync(`${__dirname}/attendance.json`, 'utf-8')
);
const sections = JSON.parse(
  fs.readFileSync(`${__dirname}/sections.json`, 'utf-8')
);
const staff = JSON.parse(fs.readFileSync(`${__dirname}/staff.json`, 'utf-8'));
const lectures = JSON.parse(
  fs.readFileSync(`${__dirname}/lectures.json`, 'utf-8')
);
const grades = JSON.parse(fs.readFileSync(`${__dirname}/grades.json`, 'utf-8'));
const advisers = JSON.parse(
  fs.readFileSync(`${__dirname}/advisers.json`, 'utf-8')
);
const students = JSON.parse(
  fs.readFileSync(`${__dirname}/student-profile.json`, 'utf-8')
);

const coursesPreqs = JSON.parse(
  fs.readFileSync(`${__dirname}/coursesPreqs.json`, 'utf-8')
);

const degreePreqs = JSON.parse(
  fs.readFileSync(`${__dirname}/degreeReqs.json`, 'utf-8')
);
// console.log(sections);
// console.log(courses);
//Importing the data

const importData = async () => {
  try {
    await Course.create(courses);
    await Attendance.create(attendance);
    await Section.create(sections);
    await Staff.create(staff);
    await Lecture.create(lectures);
    await Grade.create(grades);
    await Adviser.create(advisers);
    await Student.create(students);
    await Coursepreqs.create(coursesPreqs);
    await Degree.create(degreePreqs);

    console.log('Data Successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//Delete all data in the databse

const deleteData = async () => {
  try {
    await Course.deleteMany();
    await Attendance.deleteMany();
    await Section.deleteMany();
    await Staff.deleteMany();
    await Lecture.deleteMany();
    await Grade.deleteMany();
    await Adviser.deleteMany();
    await Student.deleteMany();
    await Coursepreqs.deleteMany();
    await Degree.deleteMany();

    await console.log('Data deleted successfully');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
