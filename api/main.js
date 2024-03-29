/**
 * This file handles Dialogflow requests and passes them to the relevant
 * script for fulfillment.
 * Given the nature of Google Cloud Functions, the files have to be imported
 * in the form of path.join(__dirname, script_location) because of how the
 * file system works. More info on that here
 * 
 * https://cloud.google.com/functions/docs/concepts/exec#file_system
 */
const path = require("path");
const util = require('util')
const App = require('actions-on-google').DialogflowApp;
const MH = require(path.join(__dirname, "get_meals/meals.js"));
const NS = require(path.join(__dirname, "nextServed/nextServed.js"));
const FC = require(path.join(__dirname, "courses/find_courses.js"));
const CI = require(path.join(__dirname, "courses/course_info"));

module.exports = (request, response) => {
    const req = request.body
    const app = new App({req, response});
    let actionMap = new Map();
    actionMap.set('get_meal', MH.handleGetMenuIntent);
    actionMap.set('nextServed', NS.handleNextServedIntent);
    actionMap.set('find_courses', FC.handleFindCoursesIntent);
    actionMap.set('course_info', CI.handleCourseInfoIntent);
    actionMap.set('result', request.body.result)
    app.handleRequest(actionMap);
}
