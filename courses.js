const axios = require('axios').default;
const cheerio = require('cheerio');
const courseSearchURL = 'https://winnet.wartburg.edu/coursefinder/';

/**
 * getSearchPage
 * @returns {{
 *  __VIEWSTATE: string,
 *  __VIEWSTATEGENERATOR: string,
 *  __EVENTVALIDATION: string,
 *  ctl00$ContentPlaceHolder1$FormView1$Button_FindNow: string
 * }} searchForm which contains information needed to search courses
 */
async function getSearchPage () {
    const searchPage = await axios.get(courseSearchURL);
    const $ = cheerio.load(searchPage.data);
    const searchForm = {
        __VIEWSTATE: $('#__VIEWSTATE').attr('value'),
        __VIEWSTATEGENERATOR: $('#__VIEWSTATEGENERATOR').attr('value'),
        __EVENTVALIDATION: $('#__EVENTVALIDATION').attr('value'),
        __VIEWSTATEENCRYPTED: $('#__VIEWSTATEENCRYPTED').attr('value'),
        Button_FindNow: 'Find Now',
    };
    return searchForm;
}
