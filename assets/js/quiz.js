const quizOptBtns = document.querySelectorAll('.quiz-opt-btn');
const quizTimer = document.querySelector('.quiz-timer > #timer');

const setQuizBtns = () => {
	quizOptBtns[0].style.backgroundColor = 'rgb(73, 73, 165)';
	quizOptBtns[1].style.backgroundColor = 'rgb(73, 165, 50)';
	quizOptBtns[2].style.backgroundColor = 'rgb(165, 73, 165)';
	quizOptBtns[3].style.backgroundColor = 'rgb(165, 165, 73)';

	quizOptBtns.forEach((btn) => {
		let prevStyle = btn.style.backgroundColor;
		btn.addEventListener('mouseover', () => {
			btn.style.backgroundColor = 'rgb(73, 165, 165)';
		});
		btn.addEventListener('mouseout', () => {
			btn.style.backgroundColor = prevStyle;
		});
	});
};

setQuizBtns();

const setQuizTImer = () => {
	quizTimer.style.color = 'white';
	let time = 120;

	setInterval(() => {
		if (time <= 0) {
			return;
		}
		time--;
		let min = Math.floor(time / 60);
		let sec = time % 60;
		quizTimer.innerHTML = `${min}:${sec}`;

		// change the with of the timer with respect to the time
		quizTimer.style.width = `${(time / 120) * 100}%`;
	}, 200);
};

setQuizTImer();
