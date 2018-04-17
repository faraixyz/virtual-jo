const path = require("path");
const fs = require("fs")
const App = require('actions-on-google').DialogflowApp;
const MH = require(path.join(__dirname, "get_meals/meals.js"));

exports.virtual_jo_dev = (request, response) => {
    const app = new App({request, response});
    let actionMap = new Map();
    actionMap.set('get_meal', MH.handleGetMenuIntent);
    console.log(MH);
    console.log(actionMap);
    app.handleRequest(actionMap);
}
