var conf = require('../config.json');
var viz = require('viz-js-lib');
viz.config.set('websocket',conf.node);

async function getOpsInBlock(bn) {
    return await viz.api.getOpsInBlockAsync(bn, false);
  }

  async function getProps() {
      return await viz.api.getDynamicGlobalPropertiesAsync();
      }

    async function getAccount(login) {
        return await viz.api.getAccountsAsync([login]);
        }
    
async function getAccounts(accs) {
    return await viz.api.getAccountsAsync(accs);
}

async function wifToPublic(key) {
    return viz.auth.wifToPublic(key);
}

async function verifyData(data, signature, VIZPUBKEY) {
    return viz.auth.signature.verifyData(data, viz.auth.signature.fromHex(signature),VIZPUBKEY)
}

async function getSubscriptionStatus(subscriber, account) {
    let active = false;
    try {
    let approveSubscribe = await viz.api.getPaidSubscriptionStatusAsync(subscriber, account);
active = approveSubscribe.active;
    } catch(e) {
      console.log(JSON.stringify(e));
    }
return active;    
}
    
module.exports.getOpsInBlock = getOpsInBlock;
module.exports.getProps = getProps;      
module.exports.getAccount = getAccount;
module.exports.getAccounts = getAccounts;
module.exports.wifToPublic = wifToPublic;

module.exports.verifyData = verifyData;
module.exports.getSubscriptionStatus = getSubscriptionStatus;