import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';

import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
import {
	ref,
	set,
	update,
	get,
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

const firebaseConfig = {
	apiKey: 'AIzaSyCdlRc8cgZLCBT7lUkWePlMRVV_2a4viyQ',
	authDomain: 'authcenterza.firebaseapp.com',
	projectId: 'authcenterza',
	storageBucket: 'authcenterza.appspot.com',
	messagingSenderId: '940181212466',
	appId: '1:940181212466:web:cfa738a16d1ded52fa9b2b',
	measurementId: 'G-GC77HFB3XD',
	databaseURL:
		'https://authcenterza-default-rtdb.europe-west1.firebasedatabase.app/',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const fbSignUp = async (email, password, userName) => {
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password,
		);
		const { user } = userCredential;
		const userRef = ref(database, `users/${user.uid}`);
		const userData = {
			email: email,
			username: userName,
			password: password,
			lastLogin: Date.now(),
		};

		await set(userRef, userData);
		console.log('Data written successfully');
		alert('Registration successful!, Please login to continue');

		// redirect to the login page
		window.location.href = './login.html';
	} catch (error) {
		const errorMessage = error.message;
		throw new Error(errorMessage);
	}
};

const fbLogin = async (email, password) => {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password,
		);
		const { user } = userCredential;

		const userData = {
			lastLogin: Date.now(),
		};

		const userRef = ref(database, `users/${user.uid}`);
		console.log(userRef, userData);

		await update(userRef, userData);
		alert('Login successful!, Enjoy');

		// query for username
		const usernameRef = ref(database, `users/${user.uid}/username`);
		const usernameSnapshot = await get(usernameRef);
		const username = usernameSnapshot.val();

		// set session storage for login object
		const loginObject = {
			loggedIn: true,
			username: username,
			lastLogin: Date.now(),
		};

		sessionStorage.setItem('login', JSON.stringify(loginObject));
		// redirect to the home page
		window.location.href = '../../index.html?login=success&username=' + username;
	} catch (error) {
		const errorMessage = error.message;
		throw new Error(errorMessage);
	}
};

async function createGamePinTable({ gamePin, topicID }) {
	console.log('CreateGamePinTable', gamePin, topicID);
	try {
		console.log('Creating gamepin table', gamePin, topicID);
		const gamePinRef = ref(database, `gamepin/${gamePin}-${topicID}`);
		await set(gamePinRef, {});
		const dummyObject = [{ username: 'dummy', score: 0 }];

		await set(gamePinRef, dummyObject);

		alert('Game created! share your pin with others');
	} catch (error) {
		throw new Error(`could not create gamepin table\n\n ${error}`);
	}
}

// set scoreboard in database in table named gamepin
async function createScoreBoard({ gamePin, username, score, topicID }) {
	console.log('Creating gamepin table', gamePin, topicID);
	const scoreRef = ref(database, `gamepin/${gamePin}-${topicID}`);

	// get the values from the table and assign it to an object
	// get the values from the table and assign it to an object
	try {
		const scoreSnapshot = await get(scoreRef);
		let scoreData = Object.values(scoreSnapshot.val() || {});

		// Initialize scoreData if it's null
		if (!scoreData) {
			scoreData = [{ username: username, score: score }];
		}
		// add the new score to the existing data if the username doesn't already exist
		if (!scoreData.some((obj) => obj.username === username)) {
			scoreData.push({ username: username, score: score });
		} else {
			// update the score if the username already exists
			scoreData = scoreData.map((obj) => {
				if (obj.username === username) {
					obj.score = score;
				}
				return obj;
			});
		}

		await set(scoreRef, scoreData);

		console.log('Scoreboard updated successfully');

		return scoreData;
	} catch (error) {
		throw new Error(`could not update the scoreboard\n\n ${error}`);
	}
}

async function queryGamePin({ gamePin, topicID }) {
	const playerNamesRef = ref(database, `gamepin/${gamePin}-${topicID}`);
	const playerNamesSnapshot = await get(playerNamesRef);
	const playerNames = playerNamesSnapshot.val();
	return playerNames;
}

//get player names using game pin
async function getPlayerNames({ gamePin, topicID }) {
	const playerNamesRef = ref(database, `gamepin/${gamePin}-${topicID}`);
	const playerNamesSnapshot = await get(playerNamesRef);
	const playerNames = playerNamesSnapshot.val();

	return playerNames || [{ username: 'No players yet' }];
}

export {
	fbSignUp,
	fbLogin,
	createGamePinTable,
	createScoreBoard,
	queryGamePin,
	getPlayerNames,
};
