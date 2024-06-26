import { navbar } from './utils/setnavbar.js';
import { metaConnection } from '../../../../assets/js/utils/metamask.js';

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
	walletContainer.style.display = 'flex';
	walletContent.style.display = 'none';
	txContent.style.display = 'flex';
	navbar.showTransfers();
});

// Function to get and display the user's MetaMask address and balance
let cachedAddress = null;
let cachedBalance = null;

async function fetchAndDisplayMetaMaskBalance() {
	if (cachedAddress && cachedBalance) {
		updateBalanceElement(cachedBalance);
		return;
	}
	try {
		const address = await metaConnection();
		const balance = await ethereum.request({
			method: 'eth_getBalance',
			params: [address, 'latest'],
		});
		cachedAddress = address;
		cachedBalance = balance;
		updateBalanceElement(balance);
	} catch (error) {
		console.error('Error fetching MetaMask address or balance:', error);
	}
}

function updateBalanceElement(balance) {
	const balanceElement = document.getElementById('profile-balance');
	const balanceInDecimal = (balance / 10 ** 18).toFixed(2);
	balanceElement.textContent = balanceInDecimal;
}

// Call getAddress to display balance
fetchAndDisplayMetaMaskBalance();
