import { createGamePinTable, getPlayerNames } from '../../pages/auth/fb.js';
import { checkLoginStatus } from './main.js';
import { topics, questions } from './utils/questions.js';
// checkLoginStatus({ path: '../../auth/' });
const codeView = document.getElementById('code-view');
const title = document.getElementById('title');
const playerCount = document.getElementById('player-count');
const questionsCount = document.getElementById('questions-count');
const players = document.querySelector('.players');

const colors = [
	'var(--prim-color)',
	'var(--sec-color)',
	'var(--tert-color)',
	'var(--quart-color)',
];

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

async function setPlayerNames() {
	playerNames = [];
	playerNames = await getPlayerNames({
		gamePin: gamePin,
		topicID: topicID,
	});

	playerNames = playerNames.filter((player) => player.username != 'dummy');
	setQuizDetails(playerNames);
	players.innerHTML = '';

	if (playerNames.length === 0) {
		players.innerHTML = 'No players yet!';
	}

	playerNames.forEach((playerName) => {
		const player = `<li class="player">${playerName.username || 'error'}</li>`;
		players.innerHTML += player;
	});

	window.requestAnimationFrame(setPlayerNames);
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
	questionsCount.innerHTML = 'Questions: ';
	questionsCount.innerHTML += questions[`Q${topicID}`].length;
	playerCount.innerHTML = 'Players: ' + playerNames.length;
}

await setPlayerNames();

setQuizDetails();
