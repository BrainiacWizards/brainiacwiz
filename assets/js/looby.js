import { createScoreBoard, getGameStatus } from '../../pages/auth/fb.js';
import { setPlayerNames } from './host.js';
import { topics } from './utils/questions.js';

const codeView = document.getElementById('code-view');
const title = document.getElementById('title');
const questionsCount = document.getElementById('questions-count');
const statusText = document.getElementById('status-text');
const players = document.querySelector('.players-list');

// check gamePin in url
const urlParams = new URLSearchParams(window.location.search);
const gamePin = urlParams.get('gamePin');
const topicID = urlParams.get('topic');
const login = JSON.parse(sessionStorage.getItem('login'));

if (!gamePin || !topicID) {
	alert('Invalid game pin or topic');
	window.location.href = window.location.origin;
	throw new Error('Invalid game pin or topic');
}

async function setQuizDetails() {
	if (gamePin) {
		codeView.innerHTML = gamePin;
	} else {
		codeView.innerHTML = '?';
	}

	const topic = topics.find((topic) => topic.id === parseInt(topicID)) || {
		name: 'Unknown',
	};
	title.innerHTML = 'Title: ' + topic.name;
	questionsCount.innerHTML = 'Questions: 6';

	await createScoreBoard({
		gamePin: gamePin,
		username: login.username,
		score: 0,
		topicID: topicID,
	});

	await setPlayerNames({ players, gamePin, topicID });
}

async function checkGameStatus() {
	const gameStatus = await getGameStatus({ gamePin, topicID });
	statusText.innerHTML = gameStatus.msg;

	if (gameStatus.status) {
		setTimeout(() => {
			const { origin } = window.location;
			window.location.href = `${origin}/pages/play/quiz.html?gamePin=${gamePin}&topic=${topicID}`;
			return;
		}, 1000);
	}

	setTimeout(() => {
		checkGameStatus();
	}, 2000);
}

setQuizDetails();
checkGameStatus();
