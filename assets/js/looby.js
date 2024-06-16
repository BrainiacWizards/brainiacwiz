import { createScoreBoard, getGameStatus } from '../../pages/auth/fb.js';
import { setPlayerNames, setQuizDetails } from './host.js';
import { topics } from './utils/questions.js';

const codeView = document.getElementById('code-view');
const title = document.getElementById('title');
const questionsCount = document.getElementById('questions-count');
const statusText = document.getElementById('status-text');
const players = document.querySelector('.players-list');
const playerCount = document.getElementById('player-count');

// check gamePin in url
const urlParams = new URLSearchParams(window.location.search);
const gamePin = urlParams.get('gamePin');
const topicID = urlParams.get('topic');
const login = JSON.parse(sessionStorage.getItem('login'));
const rewardAmount = document.querySelector('.reward-amount');
const nftImage = document.querySelector('.nft-image');
const playerNames = [];

if (!gamePin || !topicID) {
	alert('Invalid game pin or topic');
	window.location.href = window.location.origin;
	throw new Error('Invalid game pin or topic');
}

async function setDetails() {
	// create player record
	await createScoreBoard({ gamePin, topicID, username: login.username, score: 0 });

	// set quiz details
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

	await setPlayerNames(details);
	await checkGameStatus();
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

setDetails();
