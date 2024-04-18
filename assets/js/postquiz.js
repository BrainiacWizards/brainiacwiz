import { createScoreBoard } from '../../pages/auth/fb.js';
import { checkLoginStatus } from './main.js';
import { fundAccount, metaConnection } from './utils/metamask.js';
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

playBtn.addEventListener('click', () => {
	window.location.href = `../auth/gamepin/gamepinUI/index.html?topic=${topicID}`;
});

// set scoreboard
async function setScoreBoard() {
	// get username from login
	const login = JSON.parse(sessionStorage.getItem('login'));
	const username = login.username;
	const myPin = gamePin;

	// get score object from session storage
	const sessionUser = JSON.parse(sessionStorage.getItem('sessionUser'));
	// console.log(sessionUser);

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
		console.log(value.username, value.score);
		tbody.innerHTML += `
		<tr>
			<td>${key}</td>
			<td>${value.username}</td>
			<td>${value.score}</td>
		</tr>
		`;
	}

	// fund the account of the top 2 players
	console.log(scoreData);
	if (scoreData[0].username === username) {
		// metaConnection(null, 2);
		// alert(
		// 	'Congratulations! You are the winner, check your wallet for your reward',
		// );
	}

	console.clear();
	window.requestAnimationFrame(setScoreBoard);
}

setScoreBoard();
