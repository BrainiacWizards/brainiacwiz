const exploreBtn = document.getElementById('explore-btn');
const landingOverlay = document.querySelector('.landing-overlay');
const quizContainer = document.querySelector('.container');

exploreBtn.addEventListener('click', () => {
	landingOverlay.style.display = 'none';
});

const card = ({ id, name }) => {
	return `
	<div class="quiz-card" id="${id}">
		<h1 class="heading">${name}</h1>
		<button>Tap To Play!</button>
	</div>
`;
};

const quizTopics = [
	{
		id: 1,
		name: 'Machine Learning',
	},
	{
		id: 2,
		name: 'Web Development',
	},
	{
		id: 3,
		name: 'Data Science',
	},
	{
		id: 4,
		name: 'Mobile App Development',
	},
];

const renderCards = (data) => {
	data.forEach((topic) => {
		quizContainer.innerHTML += card(topic);
	});
};

renderCards(quizTopics);
