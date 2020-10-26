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

async function findInLink(in_link, page) {
    const client = await db.getClient();

if (!client) {
    return;
}

try {

    const db = client.db("viz-links");

    let collection = db.collection('links');

    const sorting = {};
    sorting['shares'] = -1;
    let skip = page * 100 - 100;

    const res = [];
    let cursor = await collection.find({in_link}).sort(sorting).skip(skip).limit(100);
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
        const collection = db.collection('links');

        let search = { keyword: query };
        let sort = { shares:-1 };
        let cursor = collection.find(search, { sort });

        let res = [];

        let rowsCountOnPage = 10;
        let pageNumber = page > 0 ? page : 1;
        let limitRows = Math.ceil(rowsCountOnPage*pageNumber);
        let skipRows = Math.ceil(rowsCountOnPage*(pageNumber-1));

        for await (let record of cursor) {
            let unique = res.every(function(item){
                if (item.keyword === record.keyword) {
                    if (item.link !== record.link) {
                        item.inlinks.push(record.in_link);
                    }
                    return false;
                }
                return true;
            })
            if (unique) {
                record.inlinks = [record.in_link];
                delete record._id;
                delete record.keyword;
                delete record.in_link;
                delete record.score;
                res.push(record);
            }
            if (res.length >= limitRows) {
                break;
            }
        }
        return res.slice(skipRows, limitRows+skipRows);

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

        const db = client.db("viz-links");
        const collection = db.collection('links');

        let search = { keyword: new RegExp((`${query}`), 'i') };
        let sort = { shares:-1 };
        let cursor = collection.find(search, { sort });

        let res = [];

        let rowsCountOnPage = 10;
        let pageNumber = page > 0 ? page : 1;
        let limitRows = Math.ceil(rowsCountOnPage*pageNumber);
        let skipRows = Math.ceil(rowsCountOnPage*(pageNumber-1));

        for await (let record of cursor) {
            let unique = res.every(function(item){
                if (item.keyword === record.keyword) {
                    if (item.link !== record.link) {
                        item.inlinks.push(record.in_link);
                    }
                    return false;
                }
                return true;
            })
            if (unique) {
                record.inlinks = [record.in_link];
                delete record._id;
                delete record.in_link;
                delete record.score ;
                res.push(record);
            }
            if (res.length >= limitRows) {
                break;
            }
        }
        return res.slice(skipRows, limitRows+skipRows);

    } catch (err) {
        console.log(err);
        return err;
    } finally {

    }

}

module.exports.getLink = getLink;
module.exports.updateLink = updateLink;
module.exports.findAllLinks = findAllLinks;
module.exports.findInLink = findInLink;
module.exports.fullQuerySearchResults = fullQuerySearchResults;
module.exports.unFullQuerySearchResults = unFullQuerySearchResults;