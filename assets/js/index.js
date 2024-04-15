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
	window.ethereum.enable();

	// get the accounts
	web3.eth.getAccounts().then((accounts) => {
		walletAddress.innerHTML = accounts[0];
		console.log(accounts[0]);
	});
} else {
	console.log(
		'MetaMask is not installed. You will need it to interact with Ethereum.',
	);
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
