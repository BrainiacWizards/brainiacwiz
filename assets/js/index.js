import { topics } from './utils/questions.js';
import { metaConnection, fundAccount, getState } from './utils/metamask.js';

const exploreBtn = document.getElementById('explore-btn');
const landingOverlay = document.querySelector('.landing-overlay');
const quizContainer = document.querySelector('.container');
const quizOptions = document.querySelector('.quiz-options');
const closeBtn = document.querySelector('#close-btn');
const hostBtn = document.querySelector('.host-btn');
const joinBtn = document.querySelector('.join-btn');
const walletAddress = document.querySelector('#wallet-address-val');
const walletBtn = document.querySelector('.wallet-btn');
const walletNfts = document.querySelector('.wallet-nfts');
const walletContainer = document.querySelector('.wallet-container');

metaConnection(walletAddress, 0);

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

if (walletBtn) {
	walletBtn.addEventListener('click', () => showCollectedTokens());
}

function showCollectedTokens() {
	// display wallet container
	walletContainer.style.display = 'flex';
	const state = getState();
	const tokenURI = state.tokenURI;

	console.log(tokenURI);

	walletNfts.innerHTML = '';

	tokenURI.forEach((uri) => {
		walletNfts.innerHTML += `
		<div class="nft-card">
			<img src="${uri}" alt="NFT" />
		</div>
		`;
	});
}
