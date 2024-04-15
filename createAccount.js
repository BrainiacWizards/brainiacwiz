const Web3 = require('web3');
const ContractKit = require('@celo/contractkit');

const providerUrl = 'https://alfajores-forno.celo-testnet.org'; // Celo Alfajores Testnet
const web3 = new Web3(providerUrl);
const kit = ContractKit.newKitFromWeb3(web3);

const account = web3.eth.accounts.create();

console.log('Account address:', account.address);
console.log('Private key:', account.privateKey);
// get mnemonic
console.log('Mnemonic:', account.mnemonic);
