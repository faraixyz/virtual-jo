/**
 * This is is the first step in a series of operations. It is responsible for
 * grabbing the search results for each semester, and writting parsed reults
 * into lo.txt. It will then be parsed into json for use in the courses scripts.
 * 
 * THIS TAKES A VERY, VERY LONG TIME TO COMPLETE AND MAY SLOW YOUR COMPUTER DOWN!
 */
const moment = require("moment");
const request = require("request");
const fs = require("fs");
const path = require("path");
const c = require("./courses");
const cheerio = require("cheerio");
const RESULT_URL = "https://winnet.wartburg.edu/coursefinder/";
const x = fs.createWriteStream(path.join(__dirname, 'lo.txt'));

const SEMESTERS = ["2017 Fall Term","2017 Fall First Seven Weeks","2017 Fall Second Seven Weeks","2018 Winter Term","2018 Winter First Seven Weeks","2018 Winter Second Seven Weeks","2018 May Term","2018 Summer Session","2018 Summer First Five Weeks","2018 Summer Second Five Weeks","2018 Summer Six Weeks","2018 Fall Term","2018 Fall First Seven Weeks","2018 Fall Second Seven Weeks","2019 Winter Term","2019 Winter First Seven Weeks","2019 Winter Second Seven Weeks","2019 May Term"];

SEMESTERS.forEach((term) => {
    c.getSearchForm().then((FORM) => {
        c.searchAll(FORM, term).then((j) => {
            request.get({url: `https://winnet.wartburg.edu/coursefinder/Results.aspx`, jar:j}, (err, res, body) => {
                let data = c.parseClasses(body);
                data.forEach((course, i, array) => {
                    let link = `${RESULT_URL}${course["href"]}`;
                    request.get({url: link, jar:j, headers:{"Referer": "https://winnet.wartburg.edu/coursefinder/Results.aspx"}}, (err, res, body) => {
                        if (err) console.log(err);
                        let $ = cheerio.load(body);
                        course["instructor"] = $("#ctl00_ContentPlaceHolder1_FormView1_Label_Crs_Instructor").text();
                        course["description"] = $("#ctl00_ContentPlaceHolder1_FormView1_Course_TextLabel").text();
                        x.write(JSON.stringify(course)+"\n");
                    });
                });
            });
        });
    });
})