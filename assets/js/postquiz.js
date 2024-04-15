import { createScoreBoard } from '../../pages/auth/fb.js';
import { checkLoginStatus } from './main.js';
import { topics, questions } from './utils/questions.js';
checkLoginStatus({ path: '../auth/' });
const topicID =
	new URLSearchParams(window.location.search).get('topic') || undefined;
const gamePin =
	new URLSearchParams(window.location.search).get('gamePin') || undefined;
const title = document.getElementById('title');
const questionCount = document.getElementById('questions-count');
const playBtn = document.getElementById('play-again');

const setQuizDetails = () => {
	if (topicID >= topics.length || topicID === undefined || topicID < 0) {
		alert('Invalid topic selected');
		window.location.href = '../../index.html';
	}

	const topic = topics.find((topic) => topic.id === parseInt(topicID));
	const question = questions[`Q${topic.id}`];

	title.innerHTML = 'Title: ' + topic.name;
	questionCount.innerHTML = 'Questions: ';
	questionCount.innerHTML += question.length;
};

setQuizDetails();

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
	const score = JSON.parse(sessionStorage.getItem('score'));

	const scoreData = await createScoreBoard({
		gamePin: myPin,
		username: username,
		score: score.score,
	});

	const scoreboardTable = document.querySelector('.score-board-table');
	const tbody = document.getElementById('score-body');

	tbody.innerHTML = '';

	// loop through the scoreData object and append to the table
	for (const [key, value] of Object.entries(scoreData)) {
		tbody.innerHTML += `
		<tr>
			<td>${key}</td>
			<td>${value.username}</td>
			<td>${value.score}</td>
		</tr>
		`;
	}

	console.clear();
	console.log(scoreData);
}

setScoreBoard();
