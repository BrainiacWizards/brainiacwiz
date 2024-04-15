const fs = require('fs');
const path = require('path');
const Web3 = require('web3');
const ContractKit = require('@celo/contractkit');

const mnemonicPath = path.resolve(__dirname, '.secret');
const mnemonic =
	'pizza hire figure embrace other tourist domain axis romance kiss bonus brisk';

const web3 = new Web3('https://alfajores-forno.celo-testnet.org');
const kit = ContractKit.newKitFromWeb3(web3);

const account = web3.eth.accounts.privateKeyToAccount(
	'0x933c1f16c5f2d25dfbbb46422eae9afde6594b66431c5c718b5f8c2de205bef5',
);
kit.connection.addAccount(account.privateKey);

module.exports = {
	getAccount: () => {
		return account;
	},
};
