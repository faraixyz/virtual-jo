/**
 * This code is responsible for finding out when a meal is next served in the mensa
 * It works by taking in a food and searching the menus in the menu directory and
 * returning the first day to return a match.
 * 
 * THe food items themselves are found in food.csv. THey were assembed as follows
 * 1. extract the li elements in each file and write them to a file, This is done
 *    with the bash script that can be run in a bash shell, like BAsh for Windows
 *    or Git Bash.
 * 2. remove the duplicates and sort the file.
 * 3. manually look through the file, remove douplicates again (e.g. Wheat / White Rolls and White / Wheat Rolls)
 * 4. Run csvify to then make a CSV file.
 * 5. Upload the entities to Dialogflow.
 */
const moment = require("moment");
const fs = require('fs');
const path = require("path");
const MENU_PATH = path.join(__dirname, "menu");

function isServed(food, menu) {
    return menu.includes(food);
}

function findNextServing(food) {
    return new Promise((resolve, reject) => {
        fs.readdir(MENU_PATH, (err, files) => {
            files = files.filter(file => path.extname(file) === ".html");
            if (err) {
                reject(err);
            };
            let nextServing;
            files.forEach((file) => {
                let date = moment(file.split('.')[0]);
                if (date.isSameOrAfter(moment())) {
                    fs.readFile(path.join(MENU_PATH, file), encoding="utf-8", (err, data) => {
                        if (err) reject(err);
                        if (isServed(food, data)) {
                            resolve(date);
                        }
                    })
                }
            });
        });
    });
}

exports.handleNextServedIntent = (app) => {
    const NAME_ACTION = "nextServed";
    const FOOD_ARGUMENT = "food";

    let food = app.getArgument(FOOD_ARGUMENT);
    findNextServing(food).then((nextServingDate) => {
        if (nextServingDate) {
            app.tell(`${food} will next be served on ${nextServingDate.format("dddd, MMMM Do")}`);
        } else {
            app.tell("I can't find that food.");
        }
    }).catch((err) => {
        app.tell("I can't find that food.")
    });

    let noFood = () => {app.tell("I can't find that food")};
    setTimeout(noFood, 2000);
}

exports.findNextServing = findNextServing;