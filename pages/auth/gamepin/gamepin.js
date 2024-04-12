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
}

window.addEventListener('load', function () {
	let storedPin = sessionStorage.getItem('gamePIN');
	if (storedPin) {
		document.getElementById('pinDisplay').value = storedPin;
	}
});

const backB = document.getElementById('backB');
const nextB = document.getElementById('nextB');

backB.addEventListener('click', () => {
	window.history.back();
});

const topic = new URLSearchParams(window.location.search).get('topic');

nextB.addEventListener('click', () => {
	window.location.href = `../../play/host/host.html?gamePin=${pin}&topic=${topic}`;
});
