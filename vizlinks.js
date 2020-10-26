require("./databases/@db.js").initialize({
    url: 'mongodb://localhost:27017',
    poolSize: 15
});
require("./js_modules/api");
const helpers = require("./js_modules/helpers");
const methods = require("./js_modules/methods");
const bdb = require("./databases/blocksdb");
const ldb = require("./databases/linksdb");
const LONG_DELAY = 12000;
const SHORT_DELAY = 3000;
const SUPER_LONG_DELAY = 1000 * 60 * 15;

async function receiveAwardOperation(custom_sequence, shares, data) {
    let protocol = '';
    if (custom_sequence === 0) {
        protocol = 'viz://';
} else if (custom_sequence === 1) {
    protocol = 'https://';
} else if (custom_sequence === 2) {
    protocol = 'ipfs://';
} else if (custom_sequence === 3) {
    protocol = 'magnet://'
}

if (data[1].indexOf('https') > -1) data[1] = data[1].substr(8);
if (data[1].indexOf('http') > -1) data[1] = data[1].substr(7);
if (data[2].indexOf('https') > -1) data[2] = data[2].substr(8);
if (data[2].indexOf('http') > -1) data[2] = data[2].substr(7);

let keyword = data[0].toLowerCase().trim();
let link = await ldb.getLink(keyword, protocol + data[1], protocol + data[2]);
if (link) {
    shares += link.shares;
    }
await ldb.updateLink(keyword, protocol + data[1], protocol + data[2], shares);
}

async function updateShares() {
    let links = await ldb.findAllLinks();
if (links && links.length > 0) {
    for (let link of links) {
        let shares = link.shares * 0.99;
        shares = shares.toFixed(6);
        shares = parseFloat(shares);
        await ldb.updateLink(link.keyword, link.link, link.in_link, shares);
    }
}
}

async function processBlock(bn) {
    if (bn%28800 == 0) {
await updateShares();
    }

    const block = await methods.getOpsInBlock(bn);
let ok_ops_count = 0;
for(let tr of block) {
        const [op, opbody] = tr.op;
        switch(op) {
            case "receive_award":
let data = opbody.memo.split(',');
if (opbody.receiver === 'committee' && data.length === 3) {
   ok_ops_count += await receiveAwardOperation(opbody.custom_sequence, parseFloat(opbody.shares), data);
}
            break;
default:
                    //неизвестная команда
            }
        }
        return ok_ops_count;
    }

let PROPS = null;

let bn = 0;
let last_bn = 0;
let delay = SHORT_DELAY;

async function getNullTransfers() {
    PROPS = await methods.getProps();
            const block_n = await bdb.getBlock(21596980);
bn = block_n.last_block;

delay = SHORT_DELAY;
while (true) {
    try {
        if (bn > PROPS.last_irreversible_block_num) {
            // console.log("wait for next blocks" + delay / 1000);
            await helpers.sleep(delay);
            PROPS = await methods.getProps();
        } else {
            if(0 < await processBlock(bn)) {
                delay = SHORT_DELAY;
            } else {
                delay = LONG_DELAY;
            }
            bn++;
            await bdb.updateBlock(bn);
        }
    } catch (e) {
        console.log("error in work loop" + e);
        await helpers.sleep(1000);
        }
    }
}

setInterval(() => {
    if(last_bn == bn) {

        try {
                process.exit(1);
        } catch(e) {
            process.exit(1);
        }
    }
    last_bn = bn;
}, SUPER_LONG_DELAY);

getNullTransfers()