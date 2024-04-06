const quizOptBtns = document.querySelectorAll('.quiz-opt-btn');
const quizTimer = document.querySelector('.quiz-timer > #timer');
const quizQuestion = document.querySelector('.quiz-question #question');

const questions = {
	techQuestions: [
		'What does GTP Stand for?',
		'How much is a Byte?',
		'What is the full form of HTTP?',
		`What is the full form of "OS"?`,
		'What is the internet?',
		'Who is known as the father of Computer?',
		'What was the first high-level programming language?',
		'Who invented the World Wide Web?',
		'What does AI stand for?',
		'What was the first computer virus?',
	],
	techAnswers: {
		0: [
			'Generative Pre-training Transformer',
			'General Purpose Transistor',
			'Global Positioning Technology',
			'Gigabit Transfer Protocol',
		],
		1: ['8 bits', '16 bits', '4 bits', '32 bits'],
		2: [
			'Hyper Text Transfer Protocol',
			'Higher Text Translation Protocol',
			'Hyper Text Transmission Protocol',
			'Hyper Text Tracking Protection',
		],
		3: ['Operating System', 'Open Source', 'Optical Sensor', 'Output System'],
		4: [
			'A network of networks',
			'A global system of interconnected computers',
			'A worldwide system of interconnected networks and computers',
			'A Network of computers',
		],
		5: ['Charles Babbage', 'Alan Turing', 'John von Neumann', 'Bill Gates'],
		6: ['FORTRAN', 'C', 'COBOL', 'BASIC'],
		7: ['Tim Berners-Lee', 'Robert E. Kahn', 'Vint Cerf', 'Marc Andreessen'],
		8: [
			'Artificial Intelligence',
			'Automated Interface',
			'Advanced Index',
			'Automated Intelligence',
		],
		9: ['Creeper', 'ILOVEYOU', 'Mydoom', 'Stuxnet'],
	},
};

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
