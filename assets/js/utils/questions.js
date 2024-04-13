const questions = {
	Q0: [
		'What does GTP Stand for?',
		'What is the full form of HTTP?',
		'What is the full form of "OS"?',
		'Who is known as the father of Computer?',
		'What was the first high-level programming language?',
		'What does AI stand for?',
	],
	A0: {
		0: [
			'Generative Pre-training Transformer',
			'General Purpose Transistor',
			'Global Positioning Technology',
			'Gigabit Transfer Protocol',
		],
		1: [
			'Hyper Text Transfer Protocol',
			'Higher Text Translation Protocol',
			'Hyper Text Transmission Protocol',
			'Hyper Text Tracking Protection',
		],
		2: ['Operating System', 'Open Source', 'Optical Sensor', 'Output System'],
		3: ['Charles Babbage', 'Alan Turing', 'John von Neumann', 'Bill Gates'],
		4: ['FORTRAN', 'C', 'COBOL', 'BASIC'],
		5: [
			'Artificial Intelligence',
			'Automated Interface',
			'Advanced Index',
			'Automated Intelligence',
		],
	},

	CA0: {
		0: 'Generative Pre-training Transformer',
		1: 'Hyper Text Transfer Protocol',
		2: 'Operating System',
		3: 'Charles Babbage',
		4: 'FORTRAN',
		5: 'Artificial Intelligence',
	},

	Q1: [
		'What is the capital of Australia?',
		'Which country has the best military in the world?',
		'What is the largest country in the world?',
		'Who is the current president of the United States?',
		'What is the currency of Japan?',
		'Where is the Great Barrier Reef located?',
	],
	A1: {
		0: ['Canberra', 'Sydney', 'Melbourne', 'Brisbane'],
		1: ['United States', 'Russia', 'China', 'India'],
		2: ['Russia', 'Canada', 'China', 'United States'],
		3: ['Joe Biden', 'Donald Trump', 'Barack Obama', 'George Bush'],
		4: ['Yen', 'Dollar', 'Euro', 'Pound'],
		5: ['Australia', 'Philippines', 'Indonesia', 'Thailand'],
	},
	CA1: {
		0: 'Canberra',
		1: 'United States',
		2: 'Russia',
		3: 'Joe Biden',
		4: 'Yen',
		5: 'Australia',
	},
	// Programming and coding
	Q2: [
		'What is the full form of HTML?',
		'Who is the father of C language?',
		'When was Python released?',
		'What is the full form of CSS?',
		"How do you write 'Hello World' in Python?",
		'What is the full form of SQL?',
		'How do you write "Hello World" in C?',
	],
	A2: {
		0: [
			'Hyper Text Markup Language',
			'High Text Markup Language',
			'Hyper Tabular Markup Language',
			'Higher Text Markup Language',
		],
		1: [
			'Dennis Ritchie',
			'Bjarne Stroustrup',
			'James A. Gosling',
			'Guido van Rossum',
		],
		2: ['1991', '1989', '1995', '2000'],
		3: [
			'Cascading Style Sheet',
			'Creative Style Sheet',
			'Computer Style Sheet',
			'Colorful Style Sheet',
		],
		4: [
			'print("Hello World")',
			'echo "Hello World"',
			'cout << "Hello World"',
			'printf("Hello World")',
		],
		5: [
			'Structured Query Language',
			'Standard Query Language',
			'Simple Query Language',
			'Sequential Query Language',
		],
		6: [
			'printf("Hello World")',
			'echo "Hello World"',
			'cout << "Hello World"',
			'print("Hello World")',
		],
	},
	CA2: {
		0: 'Hyper Text Markup Language',
		1: 'Dennis Ritchie',
		2: '1991',
		3: 'Cascading Style Sheet',
		4: 'print("Hello World")',
		5: 'Structured Query Language',
		6: 'printf("Hello World")',
	},
	// Mathematics
	Q3: [
		'What is the value of π (pi)?',
		'How many sides does a hexagon have?',
		'What is the value of 2^8?',
		"who is known as the 'Prince of Mathematicians'?",
		'which is the only even prime number?',
		'How many degrees are in a circle?',
		'Why is 7 the most feared number?',
	],
	A3: {
		0: ['3.14159', '3.1415', '3.1416', '3.1417'],
		1: ['6', '5', '7', '8'],
		2: ['256', '512', '1024', '128'],
		3: [
			'Carl Friedrich Gauss',
			'Leonhard Euler',
			'Isaac Newton',
			'Pierre-Simon Laplace',
		],
		4: ['2', '4', '6', '8'],
		5: ['360', '180', '270', '90'],
		6: [
			'Because 7 8 9',
			'Because 7 is a prime number',
			'Because 7 is a lucky number',
			'Because 7 is a magic number',
		],
	},
	CA3: {
		0: '3.14159',
		1: '6',
		2: '256',
		3: 'Carl Friedrich Gauss',
		4: '2',
		5: '360',
		6: 'Because 7 8 9',
	},
};

const topics = [
	{
		id: 0,
		name: 'Tech Trends',
	},
	{
		id: 1,
		name: 'General Knowledge',
	},
	{
		id: 2,
		name: 'Programming and coding',
	},
	{
		id: 3,
		name: 'Mathematics',
	},
];

export { questions, topics };
