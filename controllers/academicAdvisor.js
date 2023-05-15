function suggestCourses(completedCourses, degree) {
  const degreeReqs = require('./../models/degreePreqs')[Degree];
  
  // Filter courses that have prereqs the student hasn't satisfied
  let suggestedCourses = degreeReqs.filteanr((Coursepreqs) => {
    const prereqs = require('./../models/coursesPreqs')[Coursepreqs]
      .prerequisites;
    return prereqs.every((prerequisites) =>
      completedCourses.includes(prerequisites)
    );
  });
}


exports.suggestions = (req, res, next) => {
  const completedCourses = req.query.completedCourses.split(',');
  const degree = req.query.degree;

  const suggestedCourses = suggestCourses(completedCourses, degree);
  res.json(suggestedCourses);
};

