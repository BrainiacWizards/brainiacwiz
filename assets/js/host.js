import { createGamePinTable, getPlayerNames } from '../../pages/auth/fb.js';
import { checkLoginStatus } from './main.js';
import { topics, questions } from './utils/questions.js';
// checkLoginStatus({ path: '../../auth/' });
const codeView = document.getElementById('code-view');
const title = document.getElementById('title');
const playerCount = document.getElementById('player-count');
const questionsCount = document.getElementById('questions-count');
const players = document.querySelector('.players');

// check gamePin in url
const urlParams = new URLSearchParams(window.location.search);
const gamePin = urlParams.get('gamePin');
const topicID = urlParams.get('topic');
let playerNames = [];

await createGamePinTable({ gamePin: gamePin, topicID: topicID });

async function setPlayerNames() {
	players.innerHTML = '';

	playerNames = await getPlayerNames({
		gamePin: gamePin,
		topicID: topicID,
	});

	playerNames.forEach((playerName) => {
		const player = `<li class="player">${playerName.username}</li>`;
		players.innerHTML += player;
	});

	console.log(players);

	// window.requestAnimationFrame(setPlayerNames);
}

// set topic
function setQuizDetails() {
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
