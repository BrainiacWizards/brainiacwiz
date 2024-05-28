import { checkLoginStatus } from '../../../assets/js/main.js';
import { createGamePinTable, queryGamePin } from '../fb.js';

const generateBtn = document.getElementById('generateBtn');
const topic = new URLSearchParams(window.location.search).get('topic');
const backB = document.getElementById('backB');
const nextB = document.getElementById('nextB');
const inputGamePin = document.getElementById('input-gamepin-form');
const gamePin = document.getElementById('gamepin');
const error = document.getElementById('error-message');

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

// LISTEN FOR BACK AND FORWARD CLICKS
if (backB) {
	backB.addEventListener('click', () => {
		window.history.back();
	});
}

if (nextB) {
	nextB.addEventListener('click', () => {
		window.location.href = `../../play/host/host.html?gamePin=${pin}&topic=${topic}`;
	});
}

async function gamePinFormHandling() {
	if (inputGamePin) {
		inputGamePin.addEventListener('submit', async (e) => {
			e.preventDefault();

			const check = await validateInputs(gamePin);

			if (!check) {
				console.log('check failed');
				return;
			}

			setLogin();

			// redirect to lobby page
			window.location.href = `../../../play/lobby.html?gamePin=${gamePin.value}&topic=${topic}`;
		});
	}
}

gamePinFormHandling();

async function validateInputs(gamePin) {
	let check = false;
	// check if game pin exists in the database
	const data = await queryGamePin({ gamePin: gamePin.value, topicID: topic });

	if (data) {
		error.style.display = 'block';
		error.innerHTML = 'Game PIN exists';
		console.log('Game PIN exists');
		check = true;
	} else {
		error.style.display = 'block';
		error.innerHTML = 'Game PIN does not exist';
		console.log('Game PIN does not exist');
		check = false;
	}

	gamePin = gamePin.value;
	if (gamePin.length !== 7) {
		error.innerHTML = 'Invalid Game PIN';
		error.style.display = 'block';
		check = false;
		console.log('setting check to false length:', gamePin.length);
	}

	console.log('check:', check);
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
