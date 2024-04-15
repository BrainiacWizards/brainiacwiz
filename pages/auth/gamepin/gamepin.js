import { checkLoginStatus } from '../../../assets/js/main.js';
import { createGamePinTable } from '../fb.js';

const generateBtn = document.getElementById('generateBtn');

if (generateBtn) {
	generateBtn.addEventListener('click', generatePIN);
}

if (window.location.pathname.includes('gamepinUI')) {
	checkLoginStatus({ path: '../../' });
} else {
	checkLoginStatus({ path: '../' });
}

let pin = '';

function generatePIN() {
	let digits = Math.floor(1000 + Math.random() * 9000);

	let letters = '';
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	for (let i = 0; i < 3; i++) {
		letters += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
	}

	pin = digits + letters;

	document.getElementById('pinDisplay').value = pin;
	sessionStorage.setItem('gamePin', pin);

	createGamePinTable(pin);
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

inputGamePin.addEventListener('submit', (e) => {
	e.preventDefault();
	if (!validateInputs(gamePin)) {
		return;
	}

	// redirect to quiz play page
	window.location.href = `../../../play/quiz.html?gamePin=${gamePin.value}&topic=${topic}`;
});

function validateInputs(gamePin) {
	gamePin = gamePin.value;
	if (gamePin.length !== 7) {
		error.innerHTML = 'Invalid Game PIN';
		error.style.display = 'block';
		return false;
	}

	error.style.display = 'none';
	return true;
}
