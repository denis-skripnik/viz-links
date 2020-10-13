var conf = require('../config.json');
var viz = require('viz-js-lib');
viz.config.set('websocket',conf.node);

async function getOpsInBlock(bn) {
    return await viz.api.getOpsInBlockAsync(bn, false);
  }

  async function getBlockHeader(block_num) {
  return await viz.api.getBlockHeaderAsync(block_num);
  }

  async function getTransaction(trxId) {
    return await viz.api.getTransactionAsync(trxId);
    }
  
  async function getProps() {
      return await viz.api.getDynamicGlobalPropertiesAsync();
      }

      async function updateAccount(service) {
let test_user = '';
let pk = '';
        let 					metadata={};
        metadata.profile={};
                if (service === 'votes') {
        metadata.profile.name = 'Опросы и референдумы';
            metadata.profile.about= `Опросы и референдумы на Голосе. Создание путём отправки к null от ${conf.vote_price} с определённым кодом (рекомендуем пользоваться интерфейсом на dpos.space)`;
            metadata.profile.website = 'https://dpos.space/viz-polls';
        test_user = conf[service].login;
        pk = conf[service].posting_key;
        }
            let json_metadata=JSON.stringify(metadata);
        return await viz.broadcast.accountMetadataAsync(pk,test_user,json_metadata);
    }
    
    async function getAccount(login) {
        return await viz.api.getAccountsAsync([login]);
        }
    
function getDelegations() {
    return new Promise((resolve, reject) => {
        viz.api.getVestingDelegations(conf.login, -1, 1000, 'received', function(err, data) {
            if(err) {
                reject(err);
         } else {
                resolve(data);
         }
        });
    });
}

async function lookupAccounts(curr_acc) {
    return await viz.api.lookupAccountsAsync(curr_acc, 100);
}

async function getAccounts(accs) {
    return await viz.api.getAccountsAsync(accs);
}

async function send(operations, posting) {
    return await viz.broadcast.sendAsync({extensions: [], operations}, [posting]);
}

async function wifToPublic(key) {
    return viz.auth.wifToPublic(key);
}

async function workerVote(num, percent, login, key) {
    try {
      let result = await viz.broadcast.committeeVoteRequestAsync(key, login, num, percent);
return {status: "ok", data: result};
    } catch(e) {
    console.log(e);
    return {status: "error", data: e};
    }
    }
    
module.exports.getOpsInBlock = getOpsInBlock;
module.exports.getBlockHeader = getBlockHeader;
module.exports.getTransaction = getTransaction;
module.exports.getProps = getProps;      
module.exports.updateAccount = updateAccount;
module.exports.getAccount = getAccount;
module.exports.getDelegations = getDelegations;
module.exports.lookupAccounts = lookupAccounts;
module.exports.getAccounts = getAccounts;
module.exports.send = send;
module.exports.wifToPublic = wifToPublic;
module.exports.workerVote = workerVote;