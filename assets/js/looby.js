import { createScoreBoard, getGameStatus } from '../../pages/auth/fb.js';
import { setPlayerNames } from './host.js';

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
	console.log('login:', login);
	await createScoreBoard({
		gamePin,
		topicID,
		username: login.username,
		score: 0,
		wallet: login.wallet,
	});

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
		statusText,
	};

	await setPlayerNames(details);
}

async function checkGameStatus({ statusText, gamePin, topicID, redirect = true }) {
	const gameStatus = await getGameStatus({ gamePin, topicID });
	if (!statusText) statusText = document.getElementById('status-text');
	statusText.innerHTML = gameStatus.msg;

	if (gameStatus.status && redirect) {
		setTimeout(() => {
			const { origin } = window.location;
			window.location.href = `${origin}/pages/play/quiz.html?gamePin=${gamePin}&topic=${topicID}`;
			return;
		}, 1000);
	}

	setTimeout(() => {
		checkGameStatus(statusText);
	}, 2000);
}

setDetails({ statusText, gamePin, topicID });

export { checkGameStatus };
