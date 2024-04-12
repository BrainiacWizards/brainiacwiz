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

	correctAnswers: {
		0: 'Generative Pre-training Transformer',
		1: '8 bits',
		2: 'Hyper Text Transfer Protocol',
		3: 'Operating System',
		4: 'A worldwide system of interconnected networks and computers',
		5: 'Charles Babbage',
		6: 'FORTRAN',
		7: 'Tim Berners-Lee',
		8: 'Artificial Intelligence',
		9: 'Creeper',
	},
};

export { questions };
