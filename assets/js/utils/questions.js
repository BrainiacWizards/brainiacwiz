const questions = [
	// tech	trends
	[
		{
			question: 'What is the most popular technology trend?',
			answers: ['Artificial Intelligence', 'Blockchain', 'Internet of Things', 'Virtual Reality'],
			correctAnswer: 'Artificial Intelligence',
		},
		{
			question: 'What is the fastest-growing technology trend?',
			answers: ['Machine Learning', 'Cybersecurity', 'Cloud Computing', 'Data Science'],
			correctAnswer: 'Machine Learning',
		},
		{
			question: 'What is the most disruptive technology trend?',
			answers: ['Augmented Reality', 'Quantum Computing', 'Robotics', 'Big Data'],
			correctAnswer: 'Quantum Computing',
		},
		{
			question: 'What is the most promising technology trend?',
			answers: ['Edge Computing', '5G', 'Biotechnology', 'Autonomous Vehicles'],
			correctAnswer: '5G',
		},
		{
			question: 'What is the most innovative technology trend?',
			answers: ['Internet of Things', 'Artificial Intelligence', 'Virtual Reality', 'Blockchain'],
			correctAnswer: 'Internet of Things',
		},
		{
			question: 'What is the most impactful technology trend?',
			answers: ['Renewable Energy', 'Smart Cities', 'Health Tech', 'Space Exploration'],
			correctAnswer: 'Renewable Energy',
		},
	],

	// general	knowledge
	[
		{
			question: 'What is the capital of France?',
			answers: ['Paris', 'London', 'Berlin', 'Madrid'],
			correctAnswer: 'Paris',
		},
		{
			question: 'What is the largest continent?',
			answers: ['Asia', 'Africa', 'Europe', 'North America'],
			correctAnswer: 'Asia',
		},
		{
			question: 'What is the longest river in the world?',
			answers: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'],
			correctAnswer: 'Nile',
		},
		{
			question: 'What is the smallest country in the world?',
			answers: ['Monaco', 'Vatican City', 'San Marino', 'Nauru'],
			correctAnswer: 'Vatican City',
		},
		{
			question: 'What is the largest ocean in the world?',
			answers: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
			correctAnswer: 'Pacific',
		},
		{
			question: 'What is the tallest mountain in the world?',
			answers: ['K2', 'Kangchenjunga', 'Mount Everest', 'Lhotse'],
			correctAnswer: 'Mount Everest',
		},
	],

	// programming	and	coding
	[
		{
			question: 'What is the most popular programming language?',
			answers: ['Python', 'JavaScript', 'Java', 'C++'],
			correctAnswer: 'Python',
		},
		{
			question: 'What is the most in-demand programming language?',
			answers: ['JavaScript', 'Python', 'Java', 'C#'],
			correctAnswer: 'JavaScript',
		},
		{
			question: 'What is the most widely-used programming language?',
			answers: ['Java', 'Python', 'C', 'C++'],
			correctAnswer: 'Java',
		},
		{
			question: 'What is the most versatile programming language?',
			answers: ['JavaScript', 'Python', 'Java', 'Ruby'],
			correctAnswer: 'JavaScript',
		},
		{
			question: 'What is the most beginner-friendly programming language?',
			answers: ['Python', 'JavaScript', 'Java', 'Ruby'],
			correctAnswer: 'Python',
		},
		{
			question: 'What is the most powerful programming language?',
			answers: ['C++', 'Java', 'Python', 'JavaScript'],
			correctAnswer: 'C++',
		},
	],

	// mathematics
	[
		{
			question: 'What is the most important branch of mathematics?',
			answers: ['Algebra', 'Calculus', 'Geometry', 'Statistics'],
			correctAnswer: 'Calculus',
		},
		{
			question: 'What is the most challenging branch of mathematics?',
			answers: ['Algebra', 'Calculus', 'Geometry', 'Statistics'],
			correctAnswer: 'Statistics',
		},
		{
			question: 'What is the most useful branch of mathematics?',
			answers: ['Algebra', 'Calculus', 'Geometry', 'Statistics'],
			correctAnswer: 'Statistics',
		},
		{
			question: 'What is the most beautiful branch of mathematics?',
			answers: ['Algebra', 'Calculus', 'Geometry', 'Statistics'],
			correctAnswer: 'Geometry',
		},
		{
			question: 'What is the most practical branch of mathematics?',
			answers: ['Algebra', 'Calculus', 'Geometry', 'Statistics'],
			correctAnswer: 'Statistics',
		},
		{
			question: 'What is the most interesting branch of mathematics?',
			answers: ['Algebra', 'Calculus', 'Geometry', 'Statistics'],
			correctAnswer: 'Calculus',
		},
	],

	// physics
	[
		{
			question: 'What is the most fundamental law of physics?',
			answers: [
				"Newton's Laws of Motion",
				'Law of Gravitation',
				'Law of Conservation of Energy',
				'Theory of Relativity',
			],
			correctAnswer: "Newton's Laws of Motion",
		},
		{
			question: 'What is the most important concept in physics?',
			answers: ['Force', 'Energy', 'Matter', 'Motion'],
			correctAnswer: 'Energy',
		},
		{
			question: 'What is the most fascinating phenomenon in physics?',
			answers: ['Black Holes', 'Quantum Entanglement', 'Dark Matter', 'String Theory'],
			correctAnswer: 'Black Holes',
		},
		{
			question: 'What is the most intriguing theory in physics?',
			answers: ['Quantum Mechanics', 'General Relativity', 'String Theory', 'Big Bang Theory'],
			correctAnswer: 'Quantum Mechanics',
		},
		{
			question: 'What is the most complex concept in physics?',
			answers: ['Quantum Mechanics', 'General Relativity', 'String Theory', 'Big Bang Theory'],
			correctAnswer: 'String Theory',
		},
		{
			question: 'What is the most mysterious force in physics?',
			answers: ['Gravity', 'Electromagnetism', 'Weak Nuclear Force', 'Strong Nuclear Force'],
			correctAnswer: 'Gravity',
		},
	],

	// entertainment
	[
		{
			question: 'What is the most popular form of entertainment?',
			answers: ['Movies', 'Music', 'Television', 'Video Games'],
			correctAnswer: 'Movies',
		},
		{
			question: 'What is the most influential form of entertainment?',
			answers: ['Movies', 'Music', 'Television', 'Video Games'],
			correctAnswer: 'Television',
		},
		{
			question: 'What is the most powerful form of entertainment?',
			answers: ['Movies', 'Music', 'Television', 'Video Games'],
			correctAnswer: 'Music',
		},
		{
			question: 'What is the most enduring form of entertainment?',
			answers: ['Movies', 'Music', 'Television', 'Video Games'],
			correctAnswer: 'Movies',
		},
		{
			question: 'What is the most exciting form of entertainment?',
			answers: ['Movies', 'Music', 'Television', 'Video Games'],
			correctAnswer: 'Video Games',
		},
		{
			question: 'What is the most engaging form of entertainment?',
			answers: ['Movies', 'Music', 'Television', 'Video Games'],
			correctAnswer: 'Television',
		},
	],

	// english
	[
		{
			question: 'What is the most widely-spoken language in the world?',
			answers: ['English', 'Mandarin', 'Spanish', 'Hindi'],
			correctAnswer: 'English',
		},
		{
			question: 'What is the most popular form of literature?',
			answers: ['Poetry', 'Drama', 'Fiction', 'Non-Fiction'],
			correctAnswer: 'Fiction',
		},
		{
			question: 'What is the most famous work of literature?',
			answers: ['Romeo and Juliet', 'Hamlet', 'Pride and Prejudice', 'To Kill a Mockingbird'],
			correctAnswer: 'Romeo and Juliet',
		},
		{
			question: 'What is the most influential writer in history?',
			answers: ['Shakespeare', 'Dickens', 'Austen', 'Twain'],
			correctAnswer: 'Shakespeare',
		},
		{
			question: 'What is the most enduring genre of literature?',
			answers: ['Poetry', 'Drama', 'Fiction', 'Non-Fiction'],
			correctAnswer: 'Poetry',
		},
		{
			question: 'What is the most powerful form of expression?',
			answers: ['Poetry', 'Drama', 'Fiction', 'Non-Fiction'],
			correctAnswer: 'Poetry',
		},
	],

	// engineering
	[
		{
			question: 'What is the most challenging field of engineering?',
			answers: ['Aerospace', 'Biomedical', 'Civil', 'Electrical'],
			correctAnswer: 'Aerospace',
		},
		{
			question: 'What is the most innovative field of engineering?',
			answers: ['Aerospace', 'Biomedical', 'Civil', 'Electrical'],
			correctAnswer: 'Biomedical',
		},
		{
			question: 'What is the most important field of engineering?',
			answers: ['Aerospace', 'Biomedical', 'Civil', 'Electrical'],
			correctAnswer: 'Civil',
		},
		{
			question: 'What is the most promising field of engineering?',
			answers: ['Aerospace', 'Biomedical', 'Civil', 'Electrical'],
			correctAnswer: 'Electrical',
		},
		{
			question: 'What is the most impactful field of engineering?',
			answers: ['Aerospace', 'Biomedical', 'Civil', 'Electrical'],
			correctAnswer: 'Civil',
		},
		{
			question: 'What is the most exciting field of engineering?',
			answers: ['Aerospace', 'Biomedical', 'Civil', 'Electrical'],
			correctAnswer: 'Aerospace',
		},
	],

	// science
	[
		{
			question: 'What is the most important branch of science?',
			answers: ['Biology', 'Chemistry', 'Physics', 'Earth Science'],
			correctAnswer: 'Physics',
		},
		{
			question: 'What is the most fascinating branch of science?',
			answers: ['Astronomy', 'Genetics', 'Geology', 'Meteorology'],
			correctAnswer: 'Astronomy',
		},
		{
			question: 'What is the most complex branch of science?',
			answers: ['Quantum Physics', 'Astrophysics', 'Nuclear Physics', 'Particle Physics'],
			correctAnswer: 'Quantum Physics',
		},
		{
			question: 'What is the most mysterious branch of science?',
			answers: ['Cosmology', 'String Theory', 'Dark Matter', 'Black Holes'],
			correctAnswer: 'String Theory',
		},
		{
			question: 'What is the most exciting branch of science?',
			answers: ['Space Exploration', 'Biotechnology', 'Nanotechnology', 'Robotics'],
			correctAnswer: 'Space Exploration',
		},
		{
			question: 'What is the most promising branch of science?',
			answers: ['Genomics', 'Neuroscience', 'Artificial Intelligence', 'Quantum Computing'],
			correctAnswer: 'Artificial Intelligence',
		},
	],

	// movies
	[
		{
			question: 'What is the most popular movie genre?',
			answers: ['Action', 'Comedy', 'Drama', 'Science Fiction'],
			correctAnswer: 'Action',
		},
		{
			question: 'What is the most successful movie franchise?',
			answers: ['Marvel Cinematic Universe', 'Star Wars', 'Harry Potter', 'James Bond'],
			correctAnswer: 'Marvel Cinematic Universe',
		},
		{
			question: 'What is the most iconic movie character?',
			answers: ['James Bond', 'Indiana Jones', 'Rocky Balboa', 'Terminator'],
			correctAnswer: 'James Bond',
		},
		{
			question: 'What is the most memorable movie quote?',
			answers: [
				'"Here\'s looking at you, kid."',
				'"May the Force be with you."',
				'"You can\'t handle the truth!"',
				'"I\'ll be back."',
			],
			correctAnswer: '"May the Force be with you."',
		},
		{
			question: 'What is the most famous movie director?',
			answers: ['Steven Spielberg', 'Martin Scorsese', 'Alfred Hitchcock', 'Quentin Tarantino'],
			correctAnswer: 'Steven Spielberg',
		},
		{
			question: 'What is the most prestigious movie award?',
			answers: ['Oscar', 'Golden Globe', 'BAFTA', "Palme d'Or"],
			correctAnswer: 'Oscar',
		},
	],
];

const topics = [
	{
		id: 0,
		name: 'Tech Trends',
		image: 'tech-trends.jpeg',
	},
	{
		id: 1,
		name: 'General Knowledge',
		image: 'general-knowledge.jpg',
	},
	{
		id: 2,
		name: 'Programming and coding',
		image: 'programming.jpg',
	},
	{
		id: 3,
		name: 'Mathematics',
		image: 'mathematics.jpg',
	},
	{
		id: 4,
		name: 'Physics',
		image: 'physics.jpeg',
	},
	{
		id: 5,
		name: 'Entertainment',
		image: 'entertainment.jpg',
	},
];

export { questions, topics };
