import { GoogleGenerativeAI } from 'https://cdn.skypack.dev/@google/generative-ai';
const questionsblock = document.querySelector('.questions-block');

// Access your API key as an environment variable (see "Set up your API key" above)
const api_key = 'AIzaSyDgx9kucPZV4kAab55IzII0qFnxt2n26eY';
const genAI = new GoogleGenerativeAI(api_key);

async function run({ topic }) {
	// For text-only input, use the gemini-pro model
	const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

	const prompt = `
  1. Generate 6 multiple choice questions with 4 possible answers for the following topic:"${topic}",
  2. seperate the questions with a  only '--'.
  3. each question should be preceded by a number 1., 2., 3., or 4..
  4. each answer should be preceded by a only >>.
  5. the correct answer should be preceded by an equal sign (=) on a new line referencing to the correct answer.
  `;

	const result = await model.generateContent(prompt);
	const response = result.response;
	const text = response.text();
	console.log(text);

	// proccess response and add each question in a object with all the answers in an array
	const questionsAI = [];
	const regex = {
		question: /^\d/,
		correctAnswer: /^=/,
		answer: /^>>/,
	};
	const qs = text.split('--');

	for (let q of qs) {
		//loop through each question
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

	console.log(questionsAI);

	// display the questionsAI in the DOM
	// questionsAI.forEach((question, index) => {
	// 	const questionDiv = document.createElement('div');
	// 	questionDiv.classList.add('question');
	// 	questionDiv.innerHTML = `
	// 					<h3>${question.question}</h3>
	// 					<ul>
	// 							${question.answers.map((answer) => `<li>${answer}</li>`).join('')}
	// 					</ul>
	// 					<p>Correct Answer: ${question.correctAnswer}</p>
	// 			`;
	// 	questionsblock.appendChild(questionDiv);
	// });

	return questionsAI;
}

export { run };
