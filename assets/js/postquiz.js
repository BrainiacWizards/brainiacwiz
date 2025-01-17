import {
	checkRewardClaimed,
	createScoreBoard,
	overallRanking,
	setRewardAsClaimed,
} from './utils/fb.js';
import { fundAccount, getState } from './utils/metamask.js';
import { topics } from './utils/questions.js';
import { checkLoginStatus } from './main.js';
import { navbar } from './utils/setnavbar.js';
import { delay } from './utils/helpers.js';
checkLoginStatus({ path: '../auth/' });

let login = null;
const searchParams = new URLSearchParams(window.location.search);
const topicID = searchParams.get('topic') || undefined;
const gamePin = searchParams.get('gamePin') || undefined;
const title = document.getElementById('title');
const questionCount = document.getElementById('questions-count');
const playBtn = document.getElementById('play-again');
const tbody = document.getElementById('score-body');
const playerCount = document.getElementById('player-count');
const countdown = document.querySelector('.countdown');
const countdownContainer = document.querySelector('.countdown-container');

const setQuizDetails = (playerNames) => {
	if (topicID == undefined || topicID < 0) {
		alert('Invalid topic selected');
		navbar.errorDetection.consoleError('Invalid topic selected, redirecting to home.');
		window.location.href = window.location.origin;
		return;
	} else {
		const topic = topics.find((topic) => topic.id === parseInt(topicID));
		if (!topic) {
			alert('Invalid topic selected');
			navbar.errorDetection.consoleError('Invalid topic selected, redirecting to home.');
			window.location.href = window.location.origin;
			return;
		}
	}

	const topic = topics.find((topic) => topic.id === parseInt(topicID));
	title.innerHTML = 'Title: ' + topic.name;
	questionCount.innerHTML = 'Questions: 6';
	playerCount.innerHTML = `Players: ${playerNames.length}`;
};

playBtn?.addEventListener('click', () => {
	const sessionUser = JSON.parse(sessionStorage.getItem('sessionUser'));
	window.location.href = `../auth/gamepin/gamepinUI/index.html?topic=${topicID}&retry=${sessionUser.score}`;
});

// set scoreboard
let tokenTransferred = false;
let reload = true;
let time = 5;
let campaign = 'defaultCampaign';

async function setScoreBoard() {
	// get username from login
	login = JSON.parse(sessionStorage.getItem('login'));
	const username = login.username;
	const myPin = gamePin;
	campaign = login.campaign;

	// get score object from session storage
	const sessionUser = JSON.parse(sessionStorage.getItem('sessionUser'));

	let scoreData = await createScoreBoard({
		gamePin: myPin,
		username: username,
		score: sessionUser.score,
		topicID: topicID,
	});

	scoreData = scoreData.filter((player) => player.username !== 'dummy');
	setQuizDetails(scoreData);
	tbody.innerHTML = '';

	// sort the scoreData object by score
	scoreData.sort((a, b) => b.score - a.score);

	// loop through the scoreData object and append to the table
	for (const [key, value] of Object.entries(scoreData)) {
		const position = Number(key) + 1;
		tbody.innerHTML += `
		<tr>
			<td>${position}</td>
			<td>${value.username}</td>
			<td>${value.score}</td>
		</tr>
		`;
	}

	// fund the account of the top 1 players
	countdownContainer.style.display = 'flex';
	countdown.innerHTML = time;

	// delay for 1 second
	await delay(500);
	// decrement time
	time--;

	if (time <= 0) {
		countdown.innerHTML = 0;
		await checkWin(scoreData, username, myPin, sessionUser.score);
		countdownContainer.style.display = 'none';
		reload = false;
		return;
	}

	if (reload) {
		console.clear();
		window.requestAnimationFrame(setScoreBoard);
	}
}

setScoreBoard();

// check win and transfer token
async function checkWin(scoreData, username, gamePin, score) {
	// // check if score equals the number of questions
	// if (score < questions[`Q${topicID}`].length / 2) {
	// alert('You should get 50% of the questions correctly to win, try again!');
	//  // restart the game move the play.html
	// 	window.location.href = `../play/quiz.html?topic=${topicID}&gamePin=${gamePin}&retry=${score}`;
	// 	return;
	// }

	// get	the campaign from login object
	const login = JSON.parse(sessionStorage.getItem('login'));
	campaign = login.campaign;

	const retry = new URLSearchParams(window.location.search).get('retry');

	// set overall ranking
	if (retry) {
		await setOverallRanking({ username, score, retry: '2', gamePin, campaign });
	} else {
		await setOverallRanking({ username, score, gamePin, campaign });
	}

	// format username
	function shortenUsername(username) {
		const usernameArr = username.split(' ');
		if (usernameArr.length > 1) {
			return `${usernameArr[0][0]} ${usernameArr[1]}`;
		} else if (username.length > 13) {
			return username.slice(0, 10);
		}
		return username;
	}

	username = shortenUsername(username);

	if (scoreData[0].username === username && !tokenTransferred) {
		navbar.errorDetection.consoleInfo(
			'Congratulations! You are the winner! Token transfer in progress...',
		);
		await checkState();
	} else {
		navbar.errorDetection.consoleInfo('You did not win, better luck next time!');
		reload = false;
		return;
	}
}

async function checkState() {
	let address = getState().account;
	if (address) {
		login.wallet = address;
		navbar.errorDetection.consoleInfo('Account connected... minting');
		const { gamePin, username, wallet } = login;
		const response = await checkRewardClaimed({ gamePin, topicID });
		if (!response.status) {
			navbar.errorDetection.consoleError(response.message);
		} else {
			await transactNFT({ gamePin, topicID, username, wallet });
		}

		return;
	}

	window.requestAnimationFrame(checkState);
}

// transact
async function transactNFT({ gamePin, topicID, username, wallet }) {
	try {
		await fundAccount();
		const response = await setRewardAsClaimed({ gamePin, topicID, username, wallet });
		navbar.errorDetection.consoleInfo(response.message);
		reload = false;
		tokenTransferred = true;
		navbar.errorDetection.consoleInfo('Token transfer successful');
		return 'status: success';
	} catch (error) {
		reload = false;
		if (error.code === 4001) {
			error.reason = prompt('Please state	the reason for cancelling the transaction?');
			navbar.errorDetection.consoleWarn('Transaction cancelled', error.reason);
		} else {
			navbar.errorDetection.consoleError('Error funding account', error);
		}
	}
}

// set overall ranking
async function setOverallRanking({ username, score, retry, gamePin, campaign }) {
	console.log('setting overall ranking for', username, score, retry, gamePin);
	const currentTime = new Date().getTime();

	// set overall ranking
	return await overallRanking({
		username,
		points: score,
		time: currentTime,
		retry: retry,
		gamePin: gamePin,
		campaign: campaign,
	});
}
