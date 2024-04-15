import { topics } from './utils/questions.js';

const exploreBtn = document.getElementById('explore-btn');
const landingOverlay = document.querySelector('.landing-overlay');
const quizContainer = document.querySelector('.container');
const quizOptions = document.querySelector('.quiz-options');
const closeBtn = document.querySelector('#close-btn');
const hostBtn = document.querySelector('.host-btn');
const joinBtn = document.querySelector('.join-btn');
const walletAddress = document.querySelector('#wallet-address-val');

let web3;

if (typeof window.ethereum !== 'undefined') {
	console.log('MetaMask is installed!');
	web3 = new Web3(window.ethereum);
	web3.eth.getAccounts().then((accounts) => {
		walletAddress.innerHTML = accounts[0];
		console.log(accounts[0]);
	});
} else {
	alert(
		'MetaMask is not installed. You will need it to interact with Ethereum.',
	);
}

// if window.ethereum.isMiniPay then inject metamask
if (window.ethereum.isMiniPay) {
	window.ethereum.injectMiniPay();

	handleMiniPay();
}

async function fundAccount() {
	const fundingAccount = '0x839701eC0abc50e266079FD1b9E4BcC9F07594E5'; // This should be the account that funds the player's account

	// getBalance(fundAccount);
	const playerAddress = '0x1Cee5feDF3F6D28568263Fe97F66E21f60431DD4'; // This should be your account
	const amountToSend = web3.utils.toWei('0.01', 'ether'); // Change this to the amount you want to send

	const transactionParameters = {
		from: fundingAccount,
		to: playerAddress,
		value: amountToSend,
	};

	// If using MetaMask, it will prompt the user to confirm the transaction
	try {
		// Request account access if needed
		await window.ethereum.enable();

		await window.ethereum.request({
			method: 'eth_sendTransaction',
			params: [transactionParameters],
		});
	} catch (error) {
		console.error(error);
	}
}

fundAccount();

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
