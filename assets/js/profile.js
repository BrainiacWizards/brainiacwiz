<<<<<<< HEAD
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
=======
import { navbar } from './utils/setnavbar.js';

const walletContent = document.querySelector('.wallet-content');
const walletContainer = document.querySelector('.wallet-container');
const txContent = document.querySelector('.tx-content');
const profileTxs = document.getElementById('profile-tx-btn');
const profileNfts = document.getElementById('profile-nft-btn');

console.log(walletContainer);
console.log(walletContent);
console.log(txContent);

profileNfts.addEventListener('click', () => {
	console.log('profile nfts');
	walletContainer.style.display = 'flex';
	walletContent.style.display = 'flex';
	txContent.style.display = 'none';
	navbar.showCollectedTokens();
});

profileTxs.addEventListener('click', () => {
	console.log('profile tx');
	walletContainer.style.display = 'flex';
	walletContent.style.display = 'none';
	txContent.style.display = 'flex';
	navbar.showTransfers();
	console.log(walletContent.style.display);
	console.log(txContent.style.display);
>>>>>>> 17d38aa94c484bf87833e3ef93b51d1b45120b7d
});
