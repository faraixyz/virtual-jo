/**
 * This file handles the logic for parsing meals
 */
const moment = require('moment');
const request = require('request');
const cheerio = require('cheerio');

/**
 * This class contains each meal
 */
class Meal {
    constructor(meal, date){
        this.meal = meal;
        this.date = date;
        this.items = [];
    }
}

/**
 * Checks if there is a menu on a specific day
 * @param {str} html The html body
 */
function isMenuPresent(html) {
    const NO_MENU_TEXT = "On-line menu not currently available";
    return ! html.includes(NO_MENU_TEXT);
}

/**
 * Checks if there's a note on the page
 * @param {str} html 
 */
function hasNote(html) {
    const NOTE_TEXT = "Note:";
    return html.includes(NOTE_TEXT);
}

/**
 * Adds menu items to the menu object under a meal
 * @param {obj} menu Menu Object
 * @param {obj} elem Element object
 */
function addMenuItems(menu, elem){
    let menuItems = elem.children.filter( elem => elem.name === "li");
    for(let menuItem of menuItems){
        menu.push(menuItem.firstChild.data);
    };   
};

/**
 * Gets the name of a meal
 * @param {obj} elem cherio elemen object
 */
function getMealName(elem) {
    let bNode = elem.children.filter(elem => elem.name === "b"); //the meal name's tag
    let mealName = bNode[0].children[0].data;
    return mealName;    
}

/**
 * 
 * @param {str} html 
 * @param {date} date 
 */
function parseMeals(html, date) {
    let meals = [];
    let $ = cheerio.load(html);
    // font is where all the menu information is heald
    $("font").children().each((i, elem) => {
        switch (elem.name) {
            case "p":
                // This gets the name of the meal and creates a meal object
                let mealObj = new Meal(getMealName(elem), date);
                meals.push(mealObj);
                break;
            case "ul":
                /* 
                 * this ensures the right meal items are added.
                 * assuming that the meal title is followed by the
                 * menu's items, the meal index calculates the title.
                */        
                let mealIndex = (i-1)/2;
                addMenuItems(meals[mealIndex].items, elem);
                break;
            default:
                console.log("That's not good");
        }
    });

    return meals;
}

/**
 * Makes the URL for the meal
 * @param {date} time Time of the request
 */
function getRequestURL(time) {
    // note that the time should be of the request
    const baseUrl = `http://public.wartburg.edu/diningmenu/DiningHall/daily.asp?1=`;
    let ending = encodeURIComponent(`${time.getMonth()+1}/${time.getDate()}/${time.getFullYear()}`);
    let requestUrl = `${baseUrl}${ending}`;

    return requestUrl;
};

/**
 * Returns the promise of html body
 * @param {date} date Date Object
 */
function getMenuHTML(date) {
    return new Promise((resolve, reject) => {
        let requestUrl = getRequestURL(date);
        request.get(requestUrl, (err, res, body) => {
            if (err) reject(err);
            resolve(body);
        })
    });
}
/**
 * If there's no menu, say there's no menu and repromt.
 * If there's a note, let the user know that and reccomend they look at the app
 * Else parse meals
 */
exports.handleGetMenuIntent = (app) => {
    const NAME_ACTION = "get_meal";
    const MEAL_ARGUMENT = "meal";
    const DATE_ARGUMENT = "date";
    
    let meal = app.getArgument(MEAL_ARGUMENT);
    let date = app.getArgument(DATE_ARGUMENT) ? new Date(app.getArgument(DATE_ARGUMENT)): new Date();
    let message = '';
    
    getMenuHTML(date).then((body) =>{
        if (!isMenuPresent(body)) {
            message = "I'm sorry, there doesn't seem to be a menu availible that day";
        } else if (hasNote(body)) {
            message = "There seems to be a note that day. I have provided a link to it in the Google Home App";
        } else {
            let menu = parseMeals(body, date);
            for(item of menu) {
                console.log(item.meal, meal);
                if (item.meal === meal ) {
                    message = `On ${ moment(date).format("dddd, MMMM Do")} there's ${item.items.join(",")}`;
                    break;
                }
            }
            console.log(message);
        }
        app.tell(message);
    })
}

exports.isMenuPresent = isMenuPresent;
exports.hasNote = hasNote;
exports.parseMeals = parseMeals;
exports.getRequestURL = getRequestURL;