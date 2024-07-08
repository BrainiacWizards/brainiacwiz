import { createScoreBoard, getGameStatus } from '../../pages/auth/fb.js';
import { setPlayerNames } from './host.js';
import { getState } from './utils/metamask.js';
import { navbar } from './utils/setnavbar.js';

const codeView = document.getElementById('code-view');
const title = document.getElementById('title');
const questionsCount = document.getElementById('questions-count');
const statusText = document.getElementById('status-text');
const players = document.querySelector('.players-list');
const playerCount = document.getElementById('player-count');
const rewardAmount = document.querySelector('.reward-amount');
const nftImage = document.querySelector('.nft-image');

// check gamePin in url
const urlParams = new URLSearchParams(window.location.search);
const gamePin = urlParams.get('gamePin');
const topicID = urlParams.get('topic');
const login = JSON.parse(sessionStorage.getItem('login'));
const playerNames = [];

if (!gamePin || !topicID) {
	alert('Invalid game pin or topic');
	navbar.errorDetection.consoleError('Invalid game pin or topic, redirecting to home.');
	await new Promise((resolve) => setTimeout(resolve, 2000));
	window.location.href = window.location.origin;
	throw new Error('Invalid game pin or topic');
}

async function checkState() {
	let address = getState().account;
	if (address) {
		navbar.errorDetection.consoleInfo('state 2 loaded...');
		login.wallet = address;
		return;
	}

	window.requestAnimationFrame(checkState);
}
checkState();

async function setDetails() {
	// create player record
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

	if (gameStatus.status && window.location.href.includes('lobby')) {
		navbar.errorDetection.consoleInfo('Game is has	started, redirecting to quiz.');
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const { origin } = window.location;
		window.location.href = `${origin}/pages/play/quiz.html?gamePin=${gamePin}&topic=${topicID}`;
		return;
	}

	setTimeout(async () => {
		await checkGameStatus(statusText);
	}, 2000);
}

setDetails({ statusText, gamePin, topicID });

export { checkGameStatus };
