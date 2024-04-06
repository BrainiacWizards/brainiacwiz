import { questions } from './utils/questions.js';

if (!questions || !questions.techAnswers || !questions.techQuestions) {
	throw new Error('Questions data is not properly imported or is missing.');
}

const quizOptBtns = document.querySelectorAll('.quiz-opt-btn');
const quizTimer = document.querySelector('.quiz-timer > #timer');
const quizQuestion = document.querySelector('.quiz-question #question');

const setQuestions = (question) => {
	questions.techAnswers[question] = questions.techAnswers[question].sort(
		() => Math.random() - 0.5,
	);

	quizQuestion.innerHTML = questions.techQuestions[question];

	quizOptBtns.forEach((btn, index) => {
		btn.innerHTML = questions.techAnswers[question][index];
	});
};

const setQuizBtns = () => {
	quizOptBtns[0].style.backgroundColor = 'rgb(73, 73, 165)';
	quizOptBtns[1].style.backgroundColor = 'rgb(73, 165, 50)';
	quizOptBtns[2].style.backgroundColor = 'rgb(165, 73, 165)';
	quizOptBtns[3].style.backgroundColor = 'rgb(165, 165, 73)';

	quizOptBtns.forEach((btn, index) => {
		let prevStyle = btn.style.backgroundColor;
		btn.addEventListener('mouseover', () => {
			btn.style.backgroundColor = 'rgb(73, 165, 165)';
		});
		btn.addEventListener('mouseout', () => {
			btn.style.backgroundColor = prevStyle;
		});
	});

	setQuestions(0);
};

setQuizBtns();

const setQuizTImer = ({ duration = 60, speed = 100 }) => {
	quizTimer.style.color = 'white';
	let time = duration;
	let question = 0;

	setInterval(() => {
		if (time <= 0) {
			if (question >= questions.techQuestions.length - 1) {
				clearInterval();
				console.log('done');
				return;
			}
			question++;
			setQuestions(question);
			time = duration;
		}
		time--;
		let min = Math.floor(time / 60);
		let sec = time % 60;
		quizTimer.innerHTML = `${min}:${sec}`;

		// change the with of the timer with respect to the time
		quizTimer.style.width = `${(time / duration) * 100}%`;
	}, speed);
};

setQuizTImer({ duration: 60, speed: 100 });
