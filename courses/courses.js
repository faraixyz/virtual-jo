const request = require("request");
const cheerio = require("cheerio");
const FORM_URL = "https://winnet.wartburg.edu/coursefinder/Search.aspx";

/**
 * Adds the cross site antiforgery tokens to the FORM data
 * @return {Promise} The promise run when the form is sucessfully retuened
 */
function getSearchForm() {
    return new Promise((resolve, reject) => {
        request.get({url: FORM_URL}, (err, res, body) => {
            if (err) reject(err);
            let $ = cheerio.load(body);
            let FORM = {
                __VIEWSTATE: $('#__VIEWSTATE').attr('value'),
                __VIEWSTATEGENERATOR: $('#__VIEWSTATEGENERATOR').attr('value'),
                __EVENTVALIDATION: $('#__EVENTVALIDATION').attr('value'),
                ctl00$ContentPlaceHolder1$FormView1$Button_FindNow: 'Find Now',
            };
            resolve(FORM);
        });
    });
}

function parseClasses(body) {
    let $ = cheerio.load(body);
    courses = [];
    $("tr").each((i, elem) => {
        if(i !== 0) {
            let course = {
                "requirements": {},
                "cid": {},
                "availibility": {}
            };
            $("td", elem).each((i, elem) => {
                switch (i) {
                    case 0:
                        course["requirements"]["ee"] = $(elem).text();
                        break;
                    case 1:
                        course["requirements"]["wi"] = $(elem).text();
                        break;
                    case 2:
                        course["requirements"]["cd"] = $(elem).text();
                        break;
                    case 3:
                        course["requirements"]["pf"] = $(elem).text();
                        break;
                    case 4:
                        let aElem = $("a", elem)[0];
                        course["href"] = $(aElem).attr('href');
                        break;
                    case 5:
                        let cid = $(elem).text().replace(/ +/g, " ").trim();
                        [dpt, id, section] = cid.split(" ");
                        course["cid"]["dpt"] = dpt;
                        course["cid"]["id"] = id;
                        course["cid"]["section"] = section;
                        course["id"] = cid;
                        break;
                    case 6:
                        course["title"] = $(elem).text().trim();
                        break;
                    case 7:
                        course["instructor"] = $(elem).text().trim();
                        break;
                    case 8:
                        course["schedule"] = $(elem).text().trim();
                        break;
                    case 9:
                        let availibility = $(elem).text().trim();
                        [limit, enrolled, waitlist] = availibility.split("/");
                        course["availibility"]["limit"] = limit;
                        course["availibility"]["enrolled"] = enrolled;
                        course["availibility"]["waitlist"] = waitlist;
                        break
                        console.log()
                    case 10:
                        course["location"] = $(elem).text().replace(/ +/g, " ").trim();
                        break;
                    case 11:
                        course["year"] = $(elem).text().replace(/ +/g, " ").trim();
                        break;
                    case 12:
                        course["semester"] = $(elem).text().replace(/ +/g, " ").trim();
                        break;
                    case 13:
                        course["semester_half"] = $(elem).text().replace(/ +/g, " ").trim();
                        break;
                }
            });
            courses.push(course);
        }
    });
    return courses;
}

function searchAll(FORM, semester) {
    return new Promise((resolve, reject) => {
        FORM["ctl00$ContentPlaceHolder1$FormView1$TextBox_keyword"] = "Keyword";
        FORM["ctl00$ContentPlaceHolder1$FormView1$DropDownList_Department"] = "All";
        FORM["ctl00$ContentPlaceHolder1$FormView1$DropDownList_Term"] = semester;
        FORM["ctl00$ContentPlaceHolder1$FormView1$DropDownList_MeetingTime"] = "all";
        FORM["ctl00$ContentPlaceHolder1$FormView1$DropDownList_EssentialEd"] = "none";
        FORM["ctl00$ContentPlaceHolder1$FormView1$DropDownList_CulturalDiversity"] = "none";
        FORM["ctl00$ContentPlaceHolder1$FormView1$DropDownList_WritingIntensive"] = "none";
        FORM["ctl00$ContentPlaceHolder1$FormView1$DropDownList_PassFail"] = "none";
        FORM["ctl00$ContentPlaceHolder1$FormView1$DropDownList_Instructor"] = "0";
        
        let j = request.jar();
        request.post({form: FORM, url:FORM_URL, jar: j}, (err, res, body) => {
            if(err) reject(err);
            resolve(j); 
        });
    });
}

exports.parseClasses = parseClasses;
exports.searchAll = searchAll;
exports.getSearchForm = getSearchForm;
