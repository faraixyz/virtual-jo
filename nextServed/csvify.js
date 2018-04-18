/**
 * This code prepares a csv file which can then be uploaded to the foods entity in
 * Dialogflow.
 */
const fs = require("fs");
const dest = fs.createWriteStream('food.csv');

fs.readFile('food.txt', encoding="utf-8", (err, data) => {
    if (err) console.log(err);
    let items = data.split("\n");
    items.forEach((item) => {
        let aliases = item.split(',');
        dest.write(`${aliases[0]},${aliases.join(',')}\n`);
    });
});