let express = require('express');
let app = express();
const helpers = require("./helpers");
const methods = require("./methods");
const ldb = require("../databases/linksdb");
const conf = require('../config.json');

// загружаем библиотеку ограничителя
const Limiter = require('./limiter.js')

// создаем экземпляры класа ограничителя для авторизованных и не авторизованных запросов
const authTrueLimiter = new Limiter(30)
const authFalseLimiter = new Limiter(2)

app.get('/viz-links/', async function (req, res) {
    let type = req.query.type;
    let page = parseInt(req.query.page);
    let query = req.query.query;
    let link = req.query.link;

    // получаем ключ из запроса
    let key = req.query.key
    // проверяем ключ на наличие авторизации
    let keyAuth = await keyCheckAuth(key)
    // объявляем переменную на указатель класа ограничителя
    let limiter = null

    // проверяем резульатт проверки ключа на авторизацию
    if (keyAuth) {
        // ключ авторизованный
        // используем ограничитель для аворизованных запросов
        limiter = authTrueLimiter
    } else {
        // ключ не авторизованный
        // используем ограничитель для аворизованных запросов
        limiter = authFalseLimiter
    }

    // увеличиваем счетчик ограничителя
    if (!limiter.increase()) {
        // если увеличиение счетчика не произошло, значит сейчас введено ограничени
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
        limiter.decrease()
    }

});
app.listen(7000, function () {
});

const keyCheckAuth = async function(aKey){
    // тут проверяем ключ на наличие авторизации
    // данная функция должна вернуть
    // true - если ключ валидный и является авторизованным
    // false - если ключ не валидный и не является авторизованным
    return true
}