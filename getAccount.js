// get cell account and pprivatekey
// return account and privatekey
// account: string
// privatekey: string
// return: {account: string, privatekey: string}
const Web3 = require('web3');
const web3 = new Web3(
	new Web3.providers.HttpProvider('http://alfajores-forno.celo-testnet.org'),
);

function getAccount() {
	let account = '0x' + web3.eth.accounts.create().address;
	let privatekey = web3.eth.accounts.create().privateKey;
	let mnemonic = web3.eth.accounts.create().mnemonic;
	return { account: account, privatekey: privatekey, mnemonic: mnemonic };
}

console.log(getAccount());
