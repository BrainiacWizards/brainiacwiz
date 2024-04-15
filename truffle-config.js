const ContractKit = require('@celo/contractkit');
const Web3 = require('web3');

const web3 = new Web3('https://alfajores-forno.celo-testnet.org');
const kit = ContractKit.newKitFromWeb3(web3);

const getAccount = require('./getAccount').getAccount;
const Provider = require('web3').providers.Provider;

async function awaitWrapper() {
	let account = await getAccount();
	kit.connection.addAccount(account.privateKey);
}

awaitWrapper();

networks: {
    development: {
        host: '127.0.0.1',
        port: 7545,
        network_id: '*',
    },
    celo: {
        provider: new Provider(kit.connection.web3.currentProvider),
        network_id: 44787,
    },
},
	},
	solc: {
		optimizer: {
			enabled: true,
			runs: 200,
		},
	},
};
