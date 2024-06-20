import { checkLoginStatus } from '../../../assets/js/main.js';
import { createGamePinTable, queryGamePin } from '../fb.js';

const generateBtn = document.getElementById('generateBtn');
const topic = new URLSearchParams(window.location.search).get('topic');
const backB = document.getElementById('backB');
const nextB = document.getElementById('nextB');
const inputGamePin = document.getElementById('input-gamepin-form');
const gamePin = document.getElementById('gamepin');
const error = document.getElementById('error-message');
const logUserInput = document.getElementById('log-user');
const campaign = document.getElementById('campaign');

generateBtn?.addEventListener('click', generatePIN);

if (window.location.pathname.includes('gamepinUI')) {
	checkLoginStatus({ path: '../../' });
} else {
	checkLoginStatus({ path: '../' });
}

let pin = '',
	generated = false;

if (logUserInput) {
	// set	gamePin value to the login	object
	const loginObject = sessionStorage.getItem('login');
	logUserInput.value = loginObject ? JSON.parse(loginObject).username : '';
}

async function generatePIN() {
	if (!generated) {
		let campaignValue = campaign.value;
		if (campaignValue == '') {
			campaignValue = pin;
		}

		let digits = Math.floor(1000 + Math.random() * 9000);

		let letters = '';
		const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		for (let i = 0; i < 3; i++) {
			letters += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
		}

		pin = digits + letters;

		document.getElementById('pinDisplay').value = pin;
		sessionStorage.setItem('gamePin', pin);

		let login = sessionStorage.getItem('login');
		login = JSON.parse(login);
		const host = login.username;

		const gameObject = { gamePin: pin, topicID: topic, campaign: campaignValue, host };
		console.log(gameObject);

		generateBtn.textContent = 'creating...';
		generated = true;
		generateBtn.disabled = true;
		await createGamePinTable(gameObject);
		generateBtn.textContent = 'Next';
		generateBtn.disabled = false;
	} else {
		window.location.href = `../../play/host/host.html?gamePin=${pin}&topic=${topic}`;
	}
}

// LISTEN FOR BACK AND FORWARD CLICKS

backB?.addEventListener('click', () => {
	window.history.back();
});

nextB?.addEventListener('click', () => {
	window.location.href = `../../play/host/host.html?gamePin=${pin}&topic=${topic}`;
});

async function gamePinFormHandling() {
	inputGamePin?.addEventListener('submit', async (e) => {
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

gamePinFormHandling();

async function validateInputs(gamePin) {
	let check = false;
	error.textContent = 'Checking	Game PIN...';
	error.style.color = 'blue';
	// check if game pin exists in the database
	const data = await queryGamePin({ gamePin: gamePin.value, topicID: topic });

	if (data) {
		error.style.display = 'block';
		error.textContent = 'Game PIN exists';
		error.style.color = 'green';
		console.log('Game PIN exists');
		check = true;
	} else {
		error.style.display = 'block';
		error.textContent = 'Game PIN does not exist';
		error.style.color = 'red';
		console.log('Game PIN does not exist');
		check = false;
	}

	gamePin = gamePin.value;
	if (gamePin.length !== 7) {
		error.textContent = 'Invalid Game PIN';
		error.style.display = 'block';
		error.style.color = 'red';
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
		const login = sessionStorage.getItem('login');
		const loginObject = login ? JSON.parse(login) : {};
		loginObject.username = usernameValue.value;
		loginObject.lastLogin = new Date().toLocaleDateString();
		loginObject.gamePin = gamePin.value;
		sessionStorage.setItem('login', JSON.stringify(loginObject));

		// set usernameValue input field to readonly
		usernameValue.setAttribute('readonly', true);
	}
}
