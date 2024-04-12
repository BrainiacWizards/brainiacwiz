import { topics, questions } from './utils/questions.js';

const codeView = document.getElementById('code-view');
const title = document.getElementById('title');
const playerCount = document.getElementById('player-count');
const questionsCount = document.getElementById('questions-count');
const players = document.querySelector('.players');

// check gamePin in url
const urlParams = new URLSearchParams(window.location.search);
const gamePin = urlParams.get('gamePin');
const topicID = urlParams.get('topic');

const playerNames = [
	'Player 1',
	'Player 2',
	'Player 3',
	'Player 4',
	'Player 5',
	'Player 6',
	'Player 7',
	'Player 8',
	'Player 9',
	'Player 10',
];

function setPlayerNames() {
	playerNames.forEach((playerName) => {
		const player = `<li class="player">${playerName}</li>`;

		players.innerHTML += player;
	});
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
	questionsCount.innerHTML += questions.techQuestions.length;
	playerCount.innerHTML = 'Players: ' + playerNames.length;
}

setPlayerNames();
setQuizDetails();
