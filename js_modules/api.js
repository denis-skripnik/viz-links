let express = require('express');
let app = express();
const helpers = require("./helpers");
const methods = require("./methods");
const ldb = require("../databases/linksdb");
const conf = require('../config.json');

// загружаем библиотеку ограничителя
const Limiter = require('./limiter.js');

// создаем экземпляры класса ограничителя для авторизованных и не авторизованных запросов
const authTrueLimiter = new Limiter(30);
const authFalseLimiter = new Limiter(2);

app.get('/viz-links/', async function (req, res) {
    let type = req.query.type;
    let page = parseInt(req.query.page);
    let query = req.query.query;
    let link = req.query.link;

    // получаем ключ из запроса
    let auth = req.query.auth;
    // проверяем ключ на наличие авторизации
    let keyAuth = await keyCheckAuth(auth)
    // объявляем переменную на указатель класса ограничителя
    let limiter = null

    // проверяем результатт проверки ключа на авторизацию
    if (keyAuth) {
        // ключ авторизованный
        // используем ограничитель для авторизованных запросов
        limiter = authTrueLimiter
    } else {
        // ключ не авторизованный
        // используем ограничитель для авторизованных запросов
        limiter = authFalseLimiter
    }

    // увеличиваем счетчик ограничителя
    if (!limiter.increase()) {
        // если увеличение счетчика не произошло, значит сейчас введено ограничение
        // отправляем сообщение об ограничении запросов
        res.send({message: "error", description: "The limit is exhausted"})
        // выходим из обработчика маршрута
        return
    }

    try {

        if (type === 'full_search' && page && query) {
            query = query.toLowerCase().trim();
            let data = await ldb.fullQuerySearchResults(query, page);
            res.send(data);
        } else if (type === 'unfull_search' && page && query) {
            query = query.toLowerCase().trim();
            let data = await ldb.unFullQuerySearchResults(query, page);
            res.send(data);
        } else if (type === 'in_link' && page && link) {
            let data = await ldb.findInLink(link, page);
            res.send(data);
        }

    } catch (error) {
        // на всякий случай ловим ошибку
        console.log(error)
    } finally {
        // в данной секции нам надо уменьшить счетчик
        limiter.decrease();
    }

});
app.listen(7000, function () {
});

const keyCheckAuth = async function(aKey){
    let auth_data = aKey.split(':'); // 0 - логин, 1 - ключ, 2 - unixtime, 3 - подпись.
    let signature = auth_data[3];
    let vizpubkey = auth_data[1];
    let acc = await methods.getAccount(auth_data[0])[0];
    let unixtime = await helpers.unixTime();
    let isAuth = false;
    if (acc && auth_data[2] >= unixtime -10000 && auth_data[2] >= unixtime) {
    let approve_key = false;
    for (key of acc.regular_authority.key_auths) {
    if (key[0] === vizpubkey) {
    approve_key = true;
    }
    }
    
    if (approve_key == true) {
    let verifyData = viz.auth.signature.verifyData(data, signature, VIZPUBKEY)
    if (verifyData == true) {
let status = await methods.getSubscriptionStatus(auth_data[0], conf.provider_account);
        isAuth = true;
    }
    }
    }
    return true;
}