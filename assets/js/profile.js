import { navbar } from './utils/setnavbar.js';
import { metaConnection } from '../../../../assets/js/utils/metamask.js';
import { getUsers } from '../../pages/auth/fb.js';
import { checkLoginStatus } from './main.js';

checkLoginStatus();

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

let cachedAddress = null;
let cachedBalance = null;

async function fetchAndDisplayMetaMaskBalance() {
	fetchAndDisplayUser();
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
	balanceElement.textContent = `${balanceInDecimal} CELO`;
}

async function fetchAndDisplayUser() {
	try {
		const login = JSON.parse(sessionStorage.getItem('login'));
		console.log('Login: ', login);

		const userElement = document.getElementById('profile-name');
		userElement.textContent = login.username || 'Username not set';

		const emailElement = document.getElementById('profile-email').querySelector('span');
		emailElement.textContent = login.email || 'Email not set';

		const usernameElement = document.getElementById('profile-username').querySelector('span');
		usernameElement.textContent = login.username || 'Username not set';

		const joinedElement = document.getElementById('profile-joined').querySelector('span');
		joinedElement.textContent = login.lastLogin || 'Joined date not set';
	} catch (error) {
		console.error('Error displaying user data:', error);
	}
}

fetchAndDisplayMetaMaskBalance();
