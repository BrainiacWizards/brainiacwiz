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

const colors = ['var(--prim-color)', 'var(--sec-color)', 'var(--tert-color)', 'var(--quart-color)'];

// check gamePin in url
const urlParams = new URLSearchParams(window.location.search);
const gamePin = urlParams.get('gamePin');
const topicID = urlParams.get('topic');
let playerNames = [];

if (!gamePin || !topicID) {
	alert('Invalid game pin or topic');
	window.location.href = window.location.origin;
	throw new Error('Invalid game pin or topic');
}

async function setPlayerNames({ playerNames = [], players, gamePin, topicID }) {
	playerNames =
		(await getPlayerNames({
			gamePin: gamePin,
			topicID: topicID,
		})) || [];

	playerNames = playerNames.filter((player) => player.username != 'dummy');
	setQuizDetails(playerNames);
	players.innerHTML = '';

	if (playerNames.length === 0) {
		players.innerHTML = 'No players yet!';
	}

	playerNames.forEach((playerName) => {
		const player = document.createElement('div');
		player.classList.add('player');
		player.innerHTML = `
				<span class="player-name">${playerName.username}</span>
				<span class="player-score">${playerName.score}</span>`;

		const color = colors[playerNames.indexOf(playerName) % 4];
		player.style.backgroundColor = color;
		players.appendChild(player);
	});
	const requestObject = { playerNames, players, gamePin, topicID };
	window.requestAnimationFrame(setPlayerNames.bind(null, requestObject));
}

// set topic
function setQuizDetails(playerNames = []) {
	if (gamePin) {
		codeView.innerHTML = gamePin;
	} else {
		codeView.innerHTML = '?';
	}
	const topic = topics.find((topic) => topic.id === parseInt(topicID));
	title.innerHTML = 'Title: ' + topic.name;
	questionsCount.innerHTML = 'Questions: 6';
	playerCount.innerHTML = 'Players: ' + playerNames.length;
}

await setPlayerNames({ playerNames, players, gamePin, topicID });

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

setQuizDetails();

export { setPlayerNames, setQuizDetails };
