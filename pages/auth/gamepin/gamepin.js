import { checkLoginStatus } from '../../../assets/js/main.js';
import { createGamePinTable, queryGamePin } from '../fb.js';

const generateBtn = document.getElementById('generateBtn');

if (generateBtn) {
	generateBtn.addEventListener('click', generatePIN);
}

if (window.location.pathname.includes('gamepinUI')) {
	// checkLoginStatus({ path: '../../' });
} else {
	// checkLoginStatus({ path: '../' });
}

let pin = '',
	generated = false;

function generatePIN() {
	if (!generated) {
		let digits = Math.floor(1000 + Math.random() * 9000);

		let letters = '';
		const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		for (let i = 0; i < 3; i++) {
			letters += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
		}

		pin = digits + letters;

		document.getElementById('pinDisplay').value = pin;
		sessionStorage.setItem('gamePin', pin);

		createGamePinTable({ gamePin: pin, topicID: topic });
		generated = true;
	} else {
		alert('You have already generated a PIN, use that one');
	}
}

window.addEventListener('load', function () {
	let storedPin = sessionStorage.getItem('gamePIN');
	if (storedPin) {
		document.getElementById('pinDisplay').value = storedPin;
	}
});

const backB = document.getElementById('backB');
const nextB = document.getElementById('nextB');

if (backB) {
	backB.addEventListener('click', () => {
		window.history.back();
	});
}

const topic = new URLSearchParams(window.location.search).get('topic');

if (nextB) {
	nextB.addEventListener('click', () => {
		window.location.href = `../../play/host/host.html?gamePin=${pin}&topic=${topic}`;
	});
}

// input game pin form handling
const inputGamePin = document.getElementById('input-gamepin-form');
const gamePin = document.getElementById('gamepin');
const error = document.getElementById('error-message');

if (inputGamePin) {
	inputGamePin.addEventListener('submit', (e) => {
		e.preventDefault();
		if (!validateInputs(gamePin)) {
			console.log('fail');
			return;
		}

		setLogin();

		// redirect to quiz play page
		window.location.href = `../../../play/quiz.html?gamePin=${gamePin.value}&topic=${topic}`;
	});
}

function validateInputs(gamePin) {
	let check = false;
	// check if game pin exists in the database
	queryGamePin({ gamePin: gamePin.value, topicID: topic }).then((data) => {
		if (data) {
			error.innerHTML = 'Game PIN exists';
			console.log('Game PIN exists');
			error.style.display = 'block';
			check = true;
			return true;
		}

		error.innerHTML = 'Game PIN does not exist';
		console.log('Game PIN does not exist');
		error.style.display = 'block';
		check = false;
	});

	gamePin = gamePin.value;
	if (gamePin.length !== 7) {
		error.innerHTML = 'Invalid Game PIN';
		error.style.display = 'block';
		check = true;
	}

	error.style.display = 'none';
	return check;
}

// get and set username

function setLogin() {
	const usernameValue = document.getElementById('log-user');
	if (usernameValue) {
		const loginObject = {
			username: usernameValue.value,
			lastLogin: new Date().toLocaleString(),
			gamePin: gamePin.value,
		};

		sessionStorage.setItem('login', JSON.stringify(loginObject));

		// set usernameValue input field to readonly
		usernameValue.setAttribute('readonly', true);
	}
}
