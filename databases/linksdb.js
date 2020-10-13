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

module.exports.getLink = getLink;
module.exports.updateLink = updateLink;
module.exports.findAllLinks = findAllLinks;
module.exports.fullQuerySearchResults = fullQuerySearchResults;
module.exports.unFullQuerySearchResults = unFullQuerySearchResults;