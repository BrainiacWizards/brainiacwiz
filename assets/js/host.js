import { endGame, fundGame, getPlayerNames, startGame } from './utils/fb.js';
import { checkGameStatus } from './looby.js';
import { checkLoginStatus } from './main.js';
import { delay } from './utils/helpers.js';
import { topics } from './utils/questions.js';
import { navbar } from './utils/setnavbar.js';
checkLoginStatus();

const codeView = document.getElementById('code-view');
const title = document.getElementById('title');
const playerCount = document.getElementById('player-count');
const questionsCount = document.getElementById('questions-count');
const players = document.querySelector('.players-list');
const startBtn = document.getElementById('host-start-btn');
const cancelBtn = document.getElementById('host-cancel-btn');
const rewardAmount = document.querySelector('.reward-amount');
const nftImage = document.querySelector('.nft-image');
const fundForm = document.getElementById('fund-form');
const closeBtn = document.querySelector('.close-btn');
const hostDeposit = document.getElementById('host-deposit');
const errorMessage = document.querySelector('.error-message');
const transferPopup = document.getElementById('transfer-popup');
const transferClose = document.getElementById('transfer-close');
const colors = ['var(--prim-color)', 'var(--sec-color)', 'var(--tert-color)', 'var(--quart-color)'];

transferClose?.addEventListener('click', () => {
	transferPopup.style.display = 'none';
});

// check gamePin in url
const urlParams = new URLSearchParams(window.location.search);
const gamePin = urlParams.get('gamePin');
const topicID = urlParams.get('topic');
let playerNames = [],
	dummyObject = {};

const details = {
	gamePin,
	topicID,
	nftImage,
	rewardAmount,
	questionsCount,
	title,
	codeView,
	playerCount,
	players,
	playerNames,
};

if (!gamePin || !topicID || topicID > topics.length) {
	alert('Invalid game pin or topic');
	navbar.errorDetection.consoleError('Invalid game pin or topic, redirecting to home.');
	await delay(2000);
	window.location.href = window.location.origin;
}

async function setPlayerNames(details) {
	details.playerNames =
		(await getPlayerNames({
			gamePin: details.gamePin,
			topicID: details.topicID,
		})) || [];

	dummyObject = details.playerNames.find((player) => player.username == 'dummy');
	details.playerNames = details.playerNames.filter((player) => player.username != 'dummy');
	details.players.innerHTML = '';

	if (details.playerNames.length === 0) {
		details.players.innerHTML = 'No players yet!';
		navbar.errorDetection.consoleWarn('No Players yet.');
	}

	details.playerNames.forEach((playerName, index) => {
		const player = document.createElement('div');
		player.classList.add('player');
		player.id = playerName.wallet || '0x00';
		player.innerHTML = `
			<span class="player-name">${index + 1}. ${playerName.username}</span>
			<span class="player-score">(${playerName.score})</span>
			<button class="player-address" id="${
				playerName.wallet || '0x00'
			}"><i class="fas fa-copy"></i></button>
		`;

		const color = colors[details.playerNames.indexOf(playerName) % 4];
		player.style.backgroundColor = color;
		details.players.appendChild(player);
	});

	copyAddress();
	openForm();
	clickEventOnPlayer();
	setTimeout(async () => {
		await setPlayerNames(details);
		await setQuizDetails(details);
	}, 2000);
}

async function clickEventOnPlayer() {
	const receiverAddress = document.querySelector('#receiverAddress');
	//
	const allPlayer = document.querySelectorAll('.player');
	allPlayer.forEach((player) => {
		player?.addEventListener('click', () => {
			if (transferPopup) transferPopup.style.display = 'flex';
			if (receiverAddress) receiverAddress.value = player.id;
		});
	});
}

// copy player address from players
async function copyAddress() {
	const playerAddress = document.querySelectorAll('.player-address');

	playerAddress.forEach((address) => {
		address?.addEventListener('click', async () => {
			const addressValue = address.id;

			try {
				navigator.clipboard.writeText(addressValue);
				address.innerHTML = '<i class="fas fa-check"></i>';
				await new Promise((resolve) => {
					setTimeout(() => {
						resolve();
					}, 100);
				});
			} catch (err) {
				console.error('Failed to copy: ', err);
				navbar.errorDetection.consoleError('Failed to copy address');
				address.innerHTML = '<i class="fas fa-times"></i>';
			}
		});
	});
}

// open	fund form
async function openForm() {
	const fundDiv = document.querySelector('#fund-game');

	hostDeposit?.addEventListener('click', () => {
		fundDiv.style.display = 'flex';
	});

	closeBtn?.addEventListener('click', () => {
		fundDiv.style.display = 'none';
	});
}

fundForm?.addEventListener('submit', async (e) => {
	e.preventDefault();
	await fundFromForm();
});

// fund	game
async function fundFromForm() {
	const fundAmount = document.querySelector('#amount').value;
	let response;

	errorMessage.textContent = 'processing...';

	// validate fund	amount
	if (isNaN(fundAmount)) {
		errorMessage.tetContent = 'Invalid amount';
		navbar.errorDetection.consoleError('Invalid amount');
		return;
	}

	if (fundAmount) {
		try {
			response = await fundGame({ gamePin, topicID, amount: fundAmount });
			errorMessage.textContent = response.message;
			navbar.errorDetection.consoleInfo(response.message);
			response.status
				? (errorMessage.style.color = 'green')
				: (errorMessage.style.color = 'red');
		} catch (error) {
			navbar.errorDetection.consoleError(response.message);
		}
	} else {
		errorMessage.textContent = 'Please enter amount';
		errorMessage.style.color = 'red';
	}

	return response;
}

// set topic
async function setQuizDetails(details) {
	const { origin } = window.location;
	details.codeView.innerHTML = details.gamePin || 'xxxxxx';
	details.rewardAmount.textContent = `$${dummyObject?.reward || '0'}`;
	details.nftImage.src = dummyObject?.nft || `${origin}/assets/nft/4.jpg`;

	const topic = topics.find((topic) => topic.id === parseInt(details.topicID));
	details.title.innerHTML = topic.name;
	details.questionsCount.innerHTML = 'Questions: 6';
	details.playerCount.innerHTML = 'Players: ' + details.playerNames.length;
	details.redirect = false;

	// set campaign
	const login = JSON.parse(sessionStorage.getItem('login')) || {};
	login.campaign = dummyObject.campaign || '';
	details.campaign = dummyObject.campaign || '';
	sessionStorage.setItem('login', JSON.stringify(login));

	await checkGameStatus(details);
}

await setPlayerNames(details);

// start and cancel game
startBtn?.addEventListener('click', async () => {
	startBtn.disabled = true;
	await startGame({ gamePin, topicID });
	navbar.errorDetection.consoleInfo('Game started, lets play!');
});

cancelBtn?.addEventListener('click', async () => {
	const confirmEnd = confirm('Are you sure you want to end the game?');
	if (confirmEnd) {
		await endGame({ gamePin, topicID });
	}
});

export { setPlayerNames, setQuizDetails };
