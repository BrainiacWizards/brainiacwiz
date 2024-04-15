const ContractKit = require('@celo/contractkit');
const Web3 = require('web3');

// Connect to the desired network
const web3 = new Web3('https://alfajores-forno.celo-testnet.org');
const kit = ContractKit.newKitFromWeb3(web3);

const getAccount = require('./getAccount').getAccount;

async function awaitWrapper() {
	let account = await getAccount();
	kit.connection.addAccount(account.privateKey);
}

awaitWrapper();

module.exports = {
	networks: {
		development: {
			host: '127.0.0.1',
			port: 7545,
			network_id: '*',
		},
		celo: {
			provider: kit.connection.web3.currentProvider,
			network_id: 44787,
		},
	},
	compilers: {
		solc: {
			version: '^0.8.20', // Update this line
		},
	},
};
