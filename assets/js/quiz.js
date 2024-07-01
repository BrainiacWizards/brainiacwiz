import { createScoreBoard } from '../../pages/auth/fb.js';
import { run } from './utils/openai.mjs';
import { topics } from './utils/questions.js';
import { checkLoginStatus } from './main.js';
import { metaConnection } from './utils/metamask.js';
import { navbar } from './utils/setnavbar.js';
checkLoginStatus({ path: '../auth/' });

let questionsAI = [];

const quizOptBtns = document.querySelectorAll('.quiz-opt-btn');
const quizTimer = document.querySelector('.quiz-timer > #timer');
const quizQuestion = document.querySelector('.quiz-question #question');
const quizTitle = document.querySelector('#quiz-title');
const gamePin = new URLSearchParams(window.location.search).get('gamePin');
const topicID = new URLSearchParams(window.location.search).get('topic');
const quizBody = document.querySelector('.quiz-body');

//topic questions and correct answer
let T, Q, A, CA;
let question = 0;
const colors = ['var(--prim-color)', 'var(--sec-color)', 'var(--tert-color)', 'var(--quart-color)'];

const setQuizDetails = async () => {
	if (!topicID) {
		alert('Please select a topic to continue');
		window.location.href = '../../index.html';
	} else {
		const topic = topics.find((topic) => topic.id === parseInt(topicID));
		if (!topic) {
			navbar.errorDetection.consoleError('Invalid topic selected, redirecting to home.');
			await new Promise((resolve) => setTimeout(resolve, 2000));
			window.location.href = '../../index.html';
		}
	}

	const topic = topics.find((topic) => topic.id === parseInt(topicID));
	quizTitle.innerHTML = 'Title: ' + topic.name;

	T = topicID;
	Q = `Q${T}`;
	A = `A${T}`;
	CA = `CA${T}`;

	return topic;
};

const loginObj = JSON.parse(sessionStorage.getItem('login'));
loginObj.wallet = await metaConnection();
const username = loginObj.username;
let score = 0;
let sessionUser = {
	username: username,
	score: score,
};
sessionStorage.setItem('sessionUser', JSON.stringify(sessionUser));
// initial score
await createScoreBoard({
	gamePin: gamePin,
	username: username,
	score: sessionUser.score,
	topicID: topicID,
	wallet: loginObj.wallet,
});

const setTranslateAnimation = ({ element, translation }) => {
	element.style.transform = `translateX(${translation}px)`;
	element.style.transition = 'transform 0.2s ease-out';
};

const setQuestions = (question) => {
	const translation = window.innerWidth;
	setTranslateAnimation({ element: quizBody, translation: -translation });

	if (question >= questionsAI.length - 1) {
		moveToPostQuiz();
		return;
	}

	quizQuestion.innerHTML = questionsAI[question].question;

	quizOptBtns.forEach((btn, index) => {
		btn.innerHTML = questionsAI[question].answers[index];
	});

	setQuizBtns();
	setCheckScore(question);

	setTimeout(() => {
		setTranslateAnimation({ element: quizBody, translation: 0 });
	}, translation / 2);
};

function setQuizBtns() {
	const chosen = [];
	quizOptBtns.forEach((btn) => {
		while (true) {
			const ran = Math.floor(Math.random() * colors.length);
			if (!chosen.includes(ran)) {
				btn.style.backgroundColor = colors[ran];
				btn.style.boxShadow = `4px 4px 4px 0  ${colors[ran - 1]}`;
				chosen.push(ran);
				break;
			}
		}
	});

	quizOptBtns.forEach((btn) => {
		let prevStyle = btn.style.backgroundColor;
		btn.addEventListener('mouseover', () => {
			btn.style.backgroundColor = 'rgb(73, 165, 165)';
		});
		btn.addEventListener('mouseout', () => {
			btn.style.backgroundColor = prevStyle;
		});
	});
}

const setQuizTImer = ({ duration = 30 }) => {
	quizTimer.style.color = 'white';
	let time = duration;

	let intervalId = setInterval(() => {
		if (time <= 0) {
			if (question >= questionsAI.length - 1) {
				return;
			}

			question++;
			setQuestions(question);
			time = duration;

			// enable all buttons
			quizOptBtns.forEach((btn) => {
				btn.disabled = false;
			});
		}

		if (quizTimer.style.width < '50%') {
			quizTimer.style.backgroundColor = 'white';
		} else {
			quizTimer.style.backgroundColor = 'var(--quart-color)';
		}

		// change the with of the timer with respect to the time
		quizTimer.style.width = `${(time / duration) * 100}%`;
		time--;
	}, 200);
};

function moveToPostQuiz(intervalId) {
	clearInterval(intervalId); // stop the interval
	const retry = new URLSearchParams(window.location.search).get('retry') || false;
	navbar.errorDetection.consoleInfo('Quiz completed...');
	window.location.href = `./post-quiz.html?gamePin=${gamePin}&topic=${topicID}&retry=${retry}`;
}

// set quiz details [1st function to be called]
setQuizDetails().then(async (topic) => {
	questionsAI = await run({ topic: topic.name, topicID: topic.id });

	setQuestions(0);
	setQuizTImer({ duration: 40 });
});

// check answers and set score

async function setCheckScore(question) {
	quizOptBtns.forEach((btn) => {
		btn.addEventListener('click', async () => {
			const { correctAnswer } = questionsAI[question];
			if (btn.textContent.includes(correctAnswer)) {
				score++;
				// set button color to green
				btn.style.backgroundColor = 'green';
				// disable all button
				quizOptBtns.forEach((btn) => {
					btn.disabled = true;
				});
			} else {
				// set button color to red
				btn.style.backgroundColor = 'red';
			}

			// set a object with score and username
			sessionUser.score = score;
			sessionStorage.setItem('sessionUser', JSON.stringify(sessionUser));

			sessionUser = JSON.parse(sessionStorage.getItem('sessionUser'));
			console.log(sessionUser);

			await createScoreBoard({
				gamePin: gamePin,
				username: sessionUser.username,
				score: sessionUser.score,
				topicID: topicID,
				wallet: loginObj.wallet,
			});
		});
	});
}
