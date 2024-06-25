import { navbar } from './utils/setnavbar.js';

const walletContent = document.querySelector('.wallet-content');
const walletContainer = document.querySelector('.wallet-container');
const txContent = document.querySelector('.tx-content');
const profileTxs = document.getElementById('profile-tx-btn');
const profileNfts = document.getElementById('profile-nft-btn');

profileNfts.addEventListener('click', () => {
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
});
