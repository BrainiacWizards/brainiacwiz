import { topics } from './utils/questions.js';

const exploreBtn = document.getElementById('explore-btn');
const landingOverlay = document.querySelector('.landing-overlay');
const quizContainer = document.querySelector('.container');
const quizOptions = document.querySelector('.quiz-options');
const closeBtn = document.querySelector('#close-btn');
const hostBtn = document.querySelector('.host-btn');
const joinBtn = document.querySelector('.join-btn');
const walletAddress = document.querySelector('#wallet-address-val');

let web3, userAccount;

if (typeof window.ethereum !== 'undefined') {
	console.log('MetaMask is installed!');
	web3 = new Web3(window.ethereum);
	web3.eth.getAccounts().then((accounts) => {
		walletAddress.innerHTML = accounts[0];
		userAccount = accounts[0];

		fundAccount(userAccount);
	});
} else {
	alert(
		'MetaMask is not installed. You will need it to interact with Ethereum.',
	);
}

async function fundAccount(userAccount) {
	const fundingAccountPrivateKey =
		'47bca25c5b3295958b43af2cc0d4d3ec0021037bda5a0f23467c7ef8ef29ee2e'; // Replace with your private key
	const fundingAccount = web3.eth.accounts.privateKeyToAccount(
		'0x' + fundingAccountPrivateKey,
	);
	web3.eth.accounts.wallet.add(fundingAccount);

	const playerAddress = userAccount;
	const amountToSend = web3.utils.toWei('0.01', 'ether'); // Change this to the amount you want to send

	const transactionParameters = {
		from: fundingAccount.address,
		to: userAccount,
		value: amountToSend,
		gas: '0xD05B', // 53000 in hexadecimal
	};

	console.log(transactionParameters);

	// Send the transaction
	web3.eth
		.sendTransaction(transactionParameters)
		.then((receipt) => console.log(receipt))
		.catch((error) => console.error(error));
}

async function getBalance(address) {
	const balance = await web3.eth.getBalance(address);
	console.log(web3.utils.fromWei(balance, 'ether'));

	if (balance < 1) {
		alert(
			'Your account balance is less than 1 ether. Please fund your account to play the quiz.',
		);
		return;
	}
}

exploreBtn.addEventListener('click', () => {
	landingOverlay.style.display = 'none';
});

const card = ({ id, name, image }) => {
	return `
	<div class="quiz-card" id="${id}">
		<h1 class="heading">${name}</h1>
		<img src="assets/img/${image}" alt="${name}" class="quiz-img" />
		<button class="quiz-btn" id="${id}">Tap To Play!</button>
	</div>
`;
};

const renderCards = (data) => {
	data.forEach((topic) => {
		quizContainer.innerHTML += card(topic);
	});
};

renderCards(topics);

closeBtn.addEventListener('click', () => {
	quizOptions.style.display = 'none';
});

const quizBtns = document.querySelectorAll('.quiz-btn');

quizBtns.forEach((btn) => {
	btn.addEventListener('click', () => {
		// get href attribute for host and join buttons
		const hostHref = `pages/auth/gamepin/index.html?topic=${btn.id}&type=host`;
		const joinHref = `pages/auth/gamepin/gamepinUI/index.html?topic=${btn.id}&type=join`;

		hostBtn.href = hostHref;
		joinBtn.href = joinHref;

		quizOptions.style.display = 'flex';
	});
});
