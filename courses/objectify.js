/**
 * This file writes
 */
let fs = require("fs");
let path = require("path")
let file = path.join(__dirname, "lo.txt");

fs.readFile(file, encoding="utf-8", (err, data) => {
    let items = data.split("\n");
    items.pop();
    items = items.map((item) => JSON.parse(item));
    let destfile = path.join(__dirname, "items.json");
    fs.writeFileSync(destfile, JSON.stringify(items));
})