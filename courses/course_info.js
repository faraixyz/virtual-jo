const fs = require("fs");
const path = require("path");

exports.handleCourseInfoIntent = (app) => {
  let f = path.join(__dirname, "items.json");
  let courses = fs.readFileSync(f, encoding="utf-8");
  courses = JSON.parse(courses);
  
  const NAME_ACTION = "course_info";
  const DPT_ARGUMENT = "dpt";
  const ID_ARGUMENT = "id";
  
  let dpt = app.getArgument(DPT_ARGUMENT);
  let id = app.getArgument(ID_ARGUMENT);
  let message = '';
  
  results = [];
  for (course of courses) {
      if (course.cid.id == id) {
          if (course.cid.dpt === dpt) {
              results.push(course);
          }
      }
  }
  if (results) {
    message = `${results[0].description}.`;
  } else {
    message = "I couldn't find that class";
  }
  app.tell(message);
}