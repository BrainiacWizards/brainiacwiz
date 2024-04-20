import { topics } from './utils/questions.js';

const exploreBtn = document.getElementById('explore-btn');
const landingOverlay = document.querySelector('.landing-overlay');
const quizContainer = document.querySelector('.container');
const quizOptions = document.querySelector('.quiz-options');
const closeBtn = document.querySelector('#close-btn');
const hostBtn = document.querySelector('.host-btn');
const joinBtn = document.querySelector('.join-btn');

if (exploreBtn) {
	exploreBtn.addEventListener('click', () => {
		landingOverlay.style.display = 'none';
	});
}

const card = ({ id, name, image }) => {
	return `
	<div class="quiz-card" id="${id}">
		<h1 class="heading">${name}</h1>
		<img src="assets/img/${image}" alt="${name}" class="quiz-img" />
		<button class="quiz-btn" id="${id}">Tap To Play!</button>
	</div>
`;
};

const renderCards = (data) => {
	data.forEach((topic) => {
		quizContainer.innerHTML += card(topic);
	});
};

renderCards(topics);

const quizBtns = document.querySelectorAll('.quiz-btn');

if (closeBtn) {
	closeBtn.addEventListener('click', () => {
		quizOptions.style.display = 'none';
	});
}

// add event listener to quiz buttons
const manageTopicClicks = () => {
	quizBtns.forEach((btn) => {
		btn.addEventListener('click', () => {
			// get href attribute for host and join buttons
			const hostHref = `pages/auth/gamepin/index.html?topic=${btn.id}&type=host`;
			const joinHref = `pages/auth/gamepin/gamepinUI/index.html?topic=${btn.id}&type=join`;

			hostBtn.href = hostHref;
			joinBtn.href = joinHref;

			quizOptions.style.display = 'flex';
		});
	});
};

manageTopicClicks();
