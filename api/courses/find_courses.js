/**
 * This code searches for classes fulfilling a certain criteria.
 * It doesn't work properly yet.
 */
const fs = require("fs");
const path = require("path");

let courses = fs.readFileSync(path.join(__dirname, "items.json"), encoding="utf-8");
courses = JSON.parse(courses);
console.log(courses);

exports.handleFindCoursesIntent = (app) => {
  const NAME_ACTION = "find_courses";
  const DPT_ARGUMENT = "departments";
  
  let dpt = app.getArgument(DPT_ARGUMENT);
  
  if(dpt) {
    results = [];
    for (course of courses) {
        if (course.cid.id == id) {
            if (course.cid.dpt === dpt) {
                results.push(course);
            }
        }
    }
    app.tell(`There are ${ results.length } ${dpt} courses this semester.`)
  } else {
    app.tell(`THere are ${ courses.length } courses this semester.`);
  }
}
