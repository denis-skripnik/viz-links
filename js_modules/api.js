let express = require('express');
let app = express();
const helpers = require("./helpers");
const methods = require("./methods");
const ldb = require("../databases/linksdb");
const conf = require('../config.json');

app.get('/viz-links/', async function (req, res) {
    let type = req.query.type;
    let page = parseInt(req.query.page);
let query = req.query.query;
let link = req.query.link;
if (type === 'full_search' && page && query) {
    query = query.toLowerCase().trim();
    let data = await ldb.fullQuerySearchResults(query, page);
    res.send(data);
} else if (type === 'unfull_search' && page && query) {
    query = query.toLowerCase().trim();
    let data = await ldb.unFullQuerySearchResults(query, page);
    res.send(data);
} else if (type === 'in_link' && link) {
    let data = await ldb.findInLink(link);
    res.send(data);
}

});
app.listen(7000, function () {
});