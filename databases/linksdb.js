const db = require('./@db.js');

async function getLink(keyword, link, in_link) {

    const client = await db.getClient();

    if (!client) {
        return;
    }

    try {

        const db = client.db("viz_links");

        let collection = db.collection('links');

        let res = await collection.findOne({keyword, link, in_link});

return res;
    } catch (err) {

return err;
    } finally {

    
    }
}

async function updateLink(keyword, link, in_link, shares) {

    const client = await db.getClient();

  if (!client) {
      return;
  }

  try {

      const db = client.db("viz-links");

      let collection = db.collection('links');

      let res = await collection.updateOne({keyword, link, in_link}, {$set: {keyword, link, in_link, shares}}, { upsert: true });

return res;

  } catch (err) {

      console.log(err);
  return err;
    } finally {

    
  }
}

async function findAllLinks() {
    const client = await db.getClient();

if (!client) {
    return;
}

try {

    const db = client.db("viz-links");

    let collection = db.collection('links');

    const res = [];
    let cursor = await collection.find({}).limit(500);
    let doc = null;
    while(null != (doc = await cursor.next())) {
        res.push(doc);
    }
return res;
  } catch (err) {

    console.log(err);
return err;
  } finally {


}
}

async function fullQuerySearchResults(query, page) {
    const client = await db.getClient();

if (!client) {
    return;
}

try {

    const db = client.db("viz-links");

    let collection = db.collection('links');
    const sorting = {};
    sorting['shares'] = -1;
    let skip = page * 10 - 10;

    collection.createIndex(sorting, function (err) {
        if (err) {
            console.error(JSON.stringify(err));
        }
          });

    const res = [];
    let cursor = await collection.find({keyword: query}).sort(sorting).skip(skip).limit(10);
    let doc = null;
    while(null != (doc = await cursor.next())) {
        res.push({link: doc.link, in_links: [doc.in_link]});
    }
return res;
  } catch (err) {

    console.log(err);
return err;
  } finally {


}
}

async function unFullQuerySearchResults(query, page) {
    const client = await db.getClient();
    if (!client) {
        return;
    }
    try {

        let res = []
        const db = client.db("viz-links");
        let collection = db.collection('links');

        try {

        } catch (error) {

        }
        // делаем индекс на поле по которому будем искать
        collection.dropIndex('keyword_text')
        collection.createIndex({ 'keyword': 'text' }, { default_language: "russian" });

        // разбиваем поисковый запрос на слова
        let words = query.split(' ');
        // проверяем количество слов
        if (words.length <= 0) {
            // если нет слов в запросе, значит возвращаем пустой результат
            return res;
        }

        // объявляем количество строк для страницы
        let limitRows = 10;
        // запускаем цикл поиска в массиве по каждуому слову в поисковом запросе
        for (let word of words) {
            // ищем в в колекции по индексу текущее слово
            let cursor = collection.find({ $text: { $search: word } })//.limit(limitRows);
            let rows = null;
            while (null !== (rows = await cursor.next())) {
                res.concat(rows);
            };
        };
        console.log(query, words, res)
        // сортируем результирующий массив по score (коэфициент совпадения)
        // res.sort(function(item1, item2){
        //     return item2.score - item1.score;
        // });
        // проверяем конечный результат на количество строк
        // использовать page!!!
        // if (res.length > limitRows) {
        //     res.splice(limitRows, res.length-limitRows)
        // } else {
        //     return res;
        // }
        return res;

    } catch (err) {
        console.log(err);
        return err;
    } finally {

    }
}

module.exports.getLink = getLink;
module.exports.updateLink = updateLink;
module.exports.findAllLinks = findAllLinks;
module.exports.fullQuerySearchResults = fullQuerySearchResults;
module.exports.unFullQuerySearchResults = unFullQuerySearchResults;