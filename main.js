const path = require("path");
const fs = require("fs")
const App = require('actions-on-google').DialogflowApp;
const MH = require(path.join(__dirname, "get_meals/meals.js"));
const NS = require(path.join(__dirname, "nextServed/nextServed.js"))

exports.virtual_jo_dev = (request, response) => {
    const app = new App({request, response});
    let actionMap = new Map();
    actionMap.set('get_meal', MH.handleGetMenuIntent);
    actionMap.set('nextServed', NS.handleNextServedIntent);
    app.handleRequest(actionMap);
}
