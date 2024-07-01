import { GoogleGenerativeAI } from 'https://cdn.skypack.dev/@google/generative-ai';
import { questions } from './questions.js';

// Access your API key as an environment variable (see "Set up your API key" above)
const api_key = 'AIzaSyDgx9kucPZV4kAab55IzII0qFnxt2n26eY';
const genAI = new GoogleGenerativeAI(api_key);

async function run({ topic, topicID }) {
	// For text-only input, use the gemini-pro model
	const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

	const prompt = `
  1. Generate 6 multiple choice questions with 4 possible answers for the following topic:"${topic}",
  2. separate the questions with a  only '--'.
  3. each question should be preceded by a number 1., 2., 3., or 4..
	 4. the length of each question should be less than 20 words.
  5. each answer should be preceded by a only >>.
  6. the correct answer should be preceded by an equal sign (=) on a new line referencing to the correct answer.
  `;

	const result = await model.generateContent(prompt);
	const { response } = result;
	const text = response.text();

	// process response and add each question in a object with all the answers in an array
	let questionsAI = [];
	const regex = {
		question: /^\d/,
		correctAnswer: /^=/,
		answer: /^\s?>>\s?/,
	};

	let qs = text.split('--');
	// remove all	empty strings
	qs = qs.filter((q) => q.trim() !== '');

	for (let q of qs) {
		let question = {
			question: '',
			answers: [],
			correctAnswer: '',
		};

		for (let line of q.split('\n')) {
			if (line.match(regex.question)) {
				question.question = line;
			}

			if (line.match(regex.answer)) {
				question.answers.push(line.replace('>>', '').trim());
			}

			if (line.match(regex.correctAnswer)) {
				question.correctAnswer = line.replace('=', '').trim();
			}
		}

		questionsAI.push(question);
	}

	// validate response
	questionsAI = validateResponse({ questionsAI, topicID });
	return questionsAI;
}

// validate	the response from the model to make sure it is in the correct format
function validateResponse({ questionsAI, topicID }) {
	let errors = [];
	questionsAI.map((question) => {
		// should have 6	questions
		// should have 4 answers per question
		// answers	should not be empty
		// should have a correct answer for each question
		if (questionsAI.length !== 6 || !questionsAI) {
			errors.push('There should be 6 questions');
		}

		if (question.answers.length !== 4 || !question.answers) {
			errors.push('There should be 4 answers per question');
		}

		if (question.answers.includes('') || question.answers.includes(undefined) || !question.answers) {
			errors.push('Answers should not be empty');
		}

		if (question.correctAnswer === '' || !question.correctAnswer) {
			errors.push('There should be a correct answer for each question');
		}

		// make sure the correct answer is one of the answers
		if (!question.answers.includes(question.correctAnswer)) {
			errors.push('Correct answer should be one of the answers');
		}
	});

	if (errors.length > 0) {
		console.error(errors);
		questionsAI = questions[Number(topicID)];
	}

	return questionsAI;
}

export { run };
