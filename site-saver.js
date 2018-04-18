const fs = require("fs");
const request = require("request");
const meal = require("./get_meals/meals.js");
const moment = require("moment");
const path = require("path");
const DESTPATH = path.join(__dirname, "nextServed", "menu");

function makeDateRange(date, period) {
    let startDate = date.clone();
    let endDate = startDate.clone().add(period);
    let dates = [];

    while (startDate <= endDate) {
        dates.push(startDate);
        startDate = startDate.clone().add(1, 'd');
    }

    return dates;
}
function saveMenuPages(dates) {
    if (!fs.existsSync(DESTPATH)) {
        fs.mkdirSync(DESTPATH);
    }
    dates.forEach((date) => {
        let fname = `${date.format('YYYY-MM-DD')}.html`;
        let fpath = path.join(DESTPATH, fname);
        request.get(meal.getRequestURL(date.toDate()), (err, res, body) => {
            if (err) console.log(err);
            fs.writeFile(fpath, body, encoding="utf-8", (err) => {
                if (err) console.log(err);
                console.log("Wrote ", fname);
            });
        })
    });
}

let dates = makeDateRange(moment(), {w:5});
saveMenuPages(dates);
