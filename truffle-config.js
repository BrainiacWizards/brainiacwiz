const HDWalletProvider = require('@truffle/hdwallet-provider');

require('babel-register');
require('babel-polyfill');

const PRIVATE_KEY =
	'423181f9801c84bc81db00abe371723face5723deeab16996c8935cc94d36e38';

module.exports = {
	networks: {
		development: {
			host: '127.0.0.1',
			port: 7545,
			network_id: '*', // Match any network id
		},
		celo: {
			provider: () =>
				new HDWalletProvider(
					PRIVATE_KEY,
					'https://alfajores-forno.celo-testnet.org',
				),
			network_id: 44787,
			gas: 8000000,
			gasPrice: 30000000000, // Updated gasPrice value to meet the minimum gas price floor requirement
		},
	},
	contracts_directory: './contracts/',
	contracts_build_directory: './abis/',
	compilers: {
		solc: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
};
