import { navbar } from './utils/setnavbar.js';
import { metaConnection } from '../../../../assets/js/utils/metamask.js';

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
});

// Function to get and display the user's MetaMask address and balance
async function getAddress() {
	const address = await metaConnection();
	// Get the balance of the user's MetaMask account
	const balance = await ethereum.request({
		method: 'eth_getBalance',
		params: [address, 'latest'],
	});

	const balanceElement = document.getElementById('profile-balance');
	const balanceInDecimal = (balance / 10 ** 18).toFixed(8);
	balanceElement.value = balanceInDecimal;
	console.log('User balance:', balanceElement.value);
}

// Call getAddress to display balance
getAddress();

