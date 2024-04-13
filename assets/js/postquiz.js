import { topics, questions } from './utils/questions.js';

const topicID = new URLSearchParams(window.location.search).get('topic') || '?';
const gamePin =
	new URLSearchParams(window.location.search).get('gamePin') || '?';
const title = document.getElementById('title');
const questionCount = document.getElementById('questions-count');

const setQuizDetails = () => {
	const topic = topics.find((topic) => topic.id === parseInt(topicID));
	title.innerHTML = 'Title: ' + topic.name;
	questionCount.innerHTML = 'Questions: ';
	questionCount.innerHTML += questions.techQuestions.length;
};

setQuizDetails();
