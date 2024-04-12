function generatePIN() {
	let digits = Math.floor(1000 + Math.random() * 9000);

	let letters = '';
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	for (let i = 0; i < 3; i++) {
		letters += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
	}

	let pin = digits + letters;

	document.getElementById('pinDisplay').value = pin;
	sessionStorage.setItem('gamePin', pin);
}

window.addEventListener('load', function () {
	let storedPin = sessionStorage.getItem('gamePIN');
	if (storedPin) {
		document.getElementById('pinDisplay').value = storedPin;
	}
});
