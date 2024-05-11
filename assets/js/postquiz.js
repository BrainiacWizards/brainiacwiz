import { createScoreBoard, overallRanking } from '../../pages/auth/fb.js';
import { fundAccount } from './utils/metamask.js';
import { topics, questions } from './utils/questions.js';
// checkLoginStatus({ path: '../auth/' });

const topicID =
	new URLSearchParams(window.location.search).get('topic') || undefined;
const gamePin =
	new URLSearchParams(window.location.search).get('gamePin') || undefined;
const title = document.getElementById('title');
const questionCount = document.getElementById('questions-count');
const playBtn = document.getElementById('play-again');
const tbody = document.getElementById('score-body');
const playerCount = document.getElementById('player-count');
const countdown = document.querySelector('.countdown');
const countdownContainer = document.querySelector('.countdown-container');

const setQuizDetails = (playerNames) => {
	if (topicID >= topics.length || topicID === undefined || topicID < 0) {
		alert('Invalid topic selected');
		window.location.href = '../../index.html';
	}

	const topic = topics.find((topic) => topic.id === parseInt(topicID));
	const question = questions[`Q${topic.id}`];

	title.innerHTML = 'Title: ' + topic.name;
	questionCount.innerHTML = 'Questions: ';
	questionCount.innerHTML += question.length;
	playerCount.innerHTML = `Players: ${playerNames.length}`;
};

playBtn?.addEventListener('click', () => {
	window.location.href = `../auth/gamepin/gamepinUI/index.html?topic=${topicID}`;
});

// set scoreboard
let tokenTransferred = false;
let reload = true;
let time = 5;

async function setScoreBoard() {
	// get username from login
	const login = JSON.parse(sessionStorage.getItem('login'));
	const username = login.username;
	const myPin = gamePin;

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

	// fund the account of the top 2 players
	countdownContainer.style.display = 'flex';
	countdown.innerHTML = time;

	// delay for 1 second
	await new Promise((resolve) => setTimeout(resolve, 500));
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
	// check if score equals the number of questions
	if (score < questions[`Q${topicID}`].length / 2) {
		alert('You should get 50% of the questions correctly to win, try again!');
		// restart the game move the play.html
		window.location.href = `../play/quiz.html?topic=${topicID}&gamePin=${gamePin}`;
		return;
	}

	if (scoreData[0].username === username && !tokenTransferred) {
		alert(
			'Congratulations! You are the won, wait for NFT token transfer to your wallet',
		);

		// set overall ranking
		await setOverallRanking({ username, score });

		try {
			await fundAccount();
			reload = false;
			tokenTransferred = true;
			alert('Token transferred successfully');
			return 'status: success';
		} catch (error) {
			reload = false;
			if (error.code === 4001) {
				alert('Transaction cancelled');
				throw error;
			} else {
				alert('Error funding account');
				throw error;
			}
		}
	}
}

// set overall ranking
async function setOverallRanking({ username, score }) {
	console.log('setting overall ranking for', username, score);
	const currentTime = new Date().getTime();

	// set overall ranking
	const ranking = await overallRanking({
		username,
		points: score,
		time: currentTime,
	});

	console.log('overall ranking', ranking);
	return ranking;
}
