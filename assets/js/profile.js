//import { metaConnection } from '../../assets/js/utils/metamask.js';

const depositBtn = document.querySelector('#profile-deposit');
const transferBtn = document.querySelector('#profile-transfer');
const transactBtn = document.querySelector('#profile-Transactions');
const NftsBtn = document.querySelector('#profile-NFTs');
console.log(transactBtn);
depositBtn.addEventListener('click', function() {
    console.log('Deposit button clicked!');
});

transferBtn.addEventListener('click', function() {
    console.log('Transfer button clicked!');
});

transactBtn.addEventListener('click', function() {
    console.log('Transact button clicked!');
});

NftsBtn.addEventListener('click', function() {
    console.log('NFTs button clicked!');
});
