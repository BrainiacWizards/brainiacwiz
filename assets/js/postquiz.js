import { topics, questions } from './utils/questions.js';

const topicID =
	new URLSearchParams(window.location.search).get('topic') || undefined;
const gamePin =
	new URLSearchParams(window.location.search).get('gamePin') || undefined;
const title = document.getElementById('title');
const questionCount = document.getElementById('questions-count');

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
