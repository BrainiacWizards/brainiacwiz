import { createScoreBoard } from './utils/fb.js';
import { run } from './utils/openai.mjs';
import { topics } from './utils/questions.js';
import { checkLoginStatus } from './main.js';
import { getState } from './utils/metamask.js';
import { navbar } from './utils/setnavbar.js';
import { delay } from './utils/helpers.js';
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
let question = 0,
	intervalId;
const colors = ['var(--prim-color)', 'var(--sec-color)', 'var(--tert-color)', 'var(--quart-color)'];

const setQuizDetails = async () => {
	if (!topicID) {
		alert('Please select a topic to continue');
		window.location.href = window.location.origin;
	} else {
		const topic = topics.find((topic) => topic.id === parseInt(topicID));
		if (!topic) {
			navbar.errorDetection.consoleError('Invalid topic selected, redirecting to home.');
			await delay(2000);
			window.location.href = window.location.origin;
		}
	}

	const topic = topics.find((topic) => topic.id === parseInt(topicID));
	quizTitle.innerHTML = 'Title: ' + topic.name;

	return topic;
};

const loginObj = JSON.parse(sessionStorage.getItem('login'));
loginObj.wallet = getState().account || '0x00';
const username = loginObj.username;
let score = 0;
let sessionUser = { username: username, score: score };
sessionStorage.setItem('sessionUser', JSON.stringify(sessionUser));

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

	intervalId = setInterval(() => {
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

function moveToPostQuiz() {
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
				btn.style.backgroundColor = 'green';
			} else {
				btn.style.backgroundColor = 'red';
			}

			quizOptBtns.forEach((btn) => {
				btn.disabled = true;
			});

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
