import { endGame, getPlayerNames, startGame } from '../../pages/auth/fb.js';
import { checkLoginStatus } from './main.js';
import { topics } from './utils/questions.js';
checkLoginStatus({ path: '../../auth/' });
const codeView = document.getElementById('code-view');
const title = document.getElementById('title');
const playerCount = document.getElementById('player-count');
const questionsCount = document.getElementById('questions-count');
const players = document.querySelector('.players-list');
const startBtn = document.getElementById('host-start-btn');
const cancelBtn = document.getElementById('host-cancel-btn');
const rewardAmount = document.querySelector('.reward-amount');
const nftImage = document.querySelector('.nft-image');

const colors = ['var(--prim-color)', 'var(--sec-color)', 'var(--tert-color)', 'var(--quart-color)'];

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

if (!gamePin || !topicID) {
	alert('Invalid game pin or topic');
	window.location.href = window.location.origin;
	throw new Error('Invalid game pin or topic');
}

async function setPlayerNames(details) {
	details.playerNames = await getPlayerNames({
		gamePin: details.gamePin,
		topicID: details.topicID,
	});

	details.playerNames = details.playerNames.filter((player) => player.username != 'dummy');
	dummyObject = details.playerNames.find((player) => player.username == 'dummy');
	details.players.innerHTML = '';

	if (details.playerNames.length === 0) {
		details.players.innerHTML = 'No players yet!';
	}

	details.playerNames.forEach((playerName) => {
		const player = document.createElement('div');
		player.classList.add('player');
		player.innerHTML = `
				<span class="player-name">${playerName.username}</span>
				<span class="player-score">${playerName.score}</span>`;

		const color = colors[details.playerNames.indexOf(playerName) % 4];
		player.style.backgroundColor = color;
		details.players.appendChild(player);
	});

	await setQuizDetails(details);
	window.requestAnimationFrame(setPlayerNames.bind(null, details));
}

// set topic
async function setQuizDetails(details) {
	const { origin } = window.location;
	details.codeView.innerHTML = details.gamePin || 'xxxxxx';
	details.rewardAmount.textContent = `$${dummyObject?.reward || '0'}`;
	details.nftImage.src = `${origin}/assets/nft/${dummyObject?.nft || '1.jpg'}`;

	const topic = topics.find((topic) => topic.id === parseInt(details.topicID));
	details.title.innerHTML = 'Title: ' + topic.name;
	details.questionsCount.innerHTML = 'Questions: 6';
	details.playerCount.innerHTML = 'Players: ' + details.playerNames.length;
}

await setPlayerNames(details);

// start and cancel game
startBtn?.addEventListener('click', async () => {
	startBtn.disabled = true;
	await startGame({ gamePin, topicID });
	alert('Game has started, lets play!');
});

cancelBtn?.addEventListener('click', async () => {
	const confirmEnd = confirm('Are you sure you want to end the game?');
	if (!confirmEnd) {
		await endGame({ gamePin, topicID });
		alert('Game has ended');
	}
});

export { setPlayerNames, setQuizDetails };
