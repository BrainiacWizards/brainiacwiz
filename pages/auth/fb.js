import * as fb from '../../fb_config.js';

const fbSignUp = async ({ email, password, userName }) => {
	try {
		const userCredential = await fb.createUserWithEmailAndPassword(
			fb.auth,
			email,
			password,
		);
		const { user } = userCredential;
		const userRef = fb.ref(fb.database, `users/${user.uid}`);
		const userData = {
			email: email,
			username: userName,
			password: password,
			lastLogin: Date.now(),
		};

		await fb.set(userRef, userData);
		console.log('Data written successfully');
		alert('Registration successful!, Please login to continue');

		// redirect to the login page
		window.location.href = './login.html';
	} catch (error) {
		if (error.message.includes('offline')) {
			fbSignUp(email, password, userName);
		} else {
			throw new Error(`could not create user\n\n ${error}`);
		}
	}
};

const fbLogin = async ({ email, password }) => {
	try {
		const userCredential = await fb.signInWithEmailAndPassword(
			fb.auth,
			email,
			password,
		);
		const { user } = userCredential;

		const userData = {
			lastLogin: Date.now(),
		};

		const userRef = fb.ref(fb.database, `users/${user.uid}`);

		await fb.update(userRef, userData);
		alert('Login successful!, Enjoy');

		// query for username
		const usernameRef = fb.ref(fb.database, `users/${user.uid}/username`);
		const usernameSnapshot = await fb.get(usernameRef);
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
		if (error.message.includes('offline')) {
			fbLogin(email, password);
		} else {
			alert(error.message);
			throw new Error(`could not login user\n\n ${error}`);
		}
	}
};

async function createGamePinTable({ gamePin, topicID }) {
	try {
		console.log('Creating gamepin table', gamePin, topicID);
		const gamePinRef = fb.ref(fb.database, `gamepin/${gamePin}-${topicID}`);
		await fb.set(gamePinRef, {});
		const dummyObject = [{ username: 'dummy', score: 0 }];

		await fb.set(gamePinRef, dummyObject);

		alert('Game created! share your pin with others');
	} catch (error) {
		if (error.message.includes('offline')) {
			createGamePinTable({ gamePin, topicID });
		} else {
			throw new Error(`could not create gamepin table\n\n ${error}`);
		}
	}
}

// set scoreboard in fb.database in table named gamepin
async function createScoreBoard({ gamePin, username, score, topicID }) {
	console.log('Creating gamepin table', gamePin, topicID);
	let scoreRef = null;

	try {
		scoreRef = fb.ref(fb.database, `gamepin/${gamePin}-${topicID}`);
		const scoreSnapshot = await fb.get(scoreRef);
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

		await fb.set(scoreRef, scoreData);
		console.log('Scoreboard updated successfully');

		return scoreData;
	} catch (error) {
		if (error.message.includes('offline')) {
			createScoreBoard({ gamePin, username, score, topicID });
		} else {
			throw new Error(`could not update the scoreboard\n\n ${error}`);
		}
	}
}

async function queryGamePin({ gamePin, topicID }) {
	try {
		const playerNamesRef = fb.ref(fb.database, `gamepin/${gamePin}-${topicID}`);
		const playerNamesSnapshot = await fb.get(playerNamesRef);
		return playerNamesSnapshot.val();
	} catch (error) {
		if (error.message.includes('offline')) {
			queryGamePin({ gamePin, topicID });
		} else {
			throw new Error(`could not get player names\n\n ${error}`);
		}
	}
}

//get player names using game pin
async function getPlayerNames({ gamePin, topicID }) {
	let playerNamesRef = null;
	let playerNamesSnapshot = null;

	try {
		playerNamesRef = fb.ref(fb.database, `gamepin/${gamePin}-${topicID}`);
		playerNamesSnapshot = await fb.get(playerNamesRef);
	} catch (error) {
		if (error.message.includes('offline')) {
			getPlayerNames({ gamePin, topicID });
		} else {
			console.error(`could not get player names\n\n ${error}`);
		}
	}

	if (!playerNamesSnapshot) return [{ username: 'No players yet' }];

	return playerNamesSnapshot.val();

}

async function setPlayers({ gamePin, topicID, playerNames }) {
	let playerNamesRef = null;

	try {
		playerNamesRef = fb.ref(fb.database, `gamepin/${gamePin}-${topicID}`);
		await fb.set(playerNamesRef, playerNames);
	} catch (error) {
		if (error.message.includes('offline')) {
			setPlayers({ gamePin, topicID, playerNames });
		} else {
			console.error(`could not set player names\n\n ${error}`);
		}
	}
}

// set overall ranking
async function overallRanking({ username, points, time, retry }) {
	let overallRankingSnapshot = null;
	let overallRankingRef = null;
	try {
		overallRankingRef = fb.ref(fb.database, 'overallRanking');
		overallRankingSnapshot = await fb.get(overallRankingRef);
	} catch (error) {
		if (error.message.includes('offline')) {
			overallRanking({ username, points, time, retry });
		} else {
			throw new Error(`could not get overall ranking\n\n ${error}`);
		}
	}

	let overallRanking = Object.values(overallRankingSnapshot.val() || []);

	// Initialize overallRanking if it's null
	if (!overallRanking) {
		overallRanking = [{ username: username, points: points, time: time }];
	}

	// add the new points to the existing data if the username doesn't already exist
	if (!overallRanking.some((obj) => obj.username === username)) {
		overallRanking.push({
			username: username,
			points: points,
			time: time,
			startTime: Date.now(),
			duration: time,
		});
	} else {
		// update the score if the username already exists
		overallRanking = overallRanking.map((obj) => {
			if (obj.username === username) {
				retry ? (obj.points += points - retry) : (obj.points += points);
				obj.time = time;
				obj.duration = time - obj.startTime;
			}
			return obj;
		});
	}

	try {
		await fb.set(overallRankingRef, overallRanking);
		console.log('Overall ranking updated successfully');
	} catch (error) {
		if (error.message.includes('offline')) {
			overallRanking({ username, points, time, retry });
		} else {
			console.error(`could not update the overall ranking\n\n ${error}`);
		}
	}

	return overallRanking;
}

async function getOverallRanking() {
	let overallRankingSnapshot = null;
	let overallRankingRef = null;
	let overallRanking = null;

	try {
		overallRankingRef = fb.ref(fb.database, 'overallRanking');
		overallRankingSnapshot = await fb.get(overallRankingRef);
		overallRanking = overallRankingSnapshot.val();
		return (
			overallRanking || [
				{ username: 'No players yet', points: 0, time: 0, startTime: 0 },
			]
		);
	} catch (error) {
		if (error.message.includes('offline')) {
			getOverallRanking();
			console.error(error);
		} else {
			throw new Error(`could not get overall ranking\n\n ${error}`);
		}
		return (
			overallRanking || [
				{ username: 'No players yet', points: 0, time: 0, startTime: 0 },
			]
		);
	}
}

// start hosted game
async function startGame({ gamePin, topicID }) {
	let playerNames = await getPlayerNames({ gamePin, topicID });

	try {
		// change only dummy
		if (playerNames) {
			playerNames = playerNames.map((player) => {
				if (player.username == 'dummy') {
					player.gameStarted = true;
					player.gameEnded = false;
					player.startTime = new Date();
				}
				return player;
			});
		}

		await setPlayers({ gamePin, topicID, playerNames });
		return { status: true, message: 'Game has started, lets play!' };
	} catch (error) {
		if (error.message.includes('offline')) {
			startGame({ gamePin, topicID });
		} else {
			throw new Error(`could not start the game\n\n ${error}`);
		}
	}
}

// end hosted game
async function endGame({ gamePin, topicID }) {
	let playerNames = await getPlayerNames({ gamePin, topicID });

	try {
		// change only dummy
		if (playerNames) {
			playerNames = playerNames.map((player) => {
				if (player.username == 'dummy') {
					player.gameStarted = true;
					player.gameEnded = true;
					player.startTime = new Date();
				}
				return player;
			});
		}

		await setPlayers({ gamePin, topicID, playerNames });
		return { status: true, msg: 'Game ended!' };
	} catch (error) {
		if (error.message.includes('offline')) {
			endGame({ gamePin, topicID });
		} else {
			throw new Error(`could not end the game\n\n ${error}`);
		}
	}
}

// get game status
async function getGameStatus({ gamePin, topicID }) {
	const response = {
		status: false,
		msg: 'Waiting for game status',
	};

	try {
		const playerName = await getPlayerNames({ gamePin, topicID });

		// check on dummy
		playerName.map((player) => {
			if (player.username === 'dummy') {
				if (player.gameStarted && !player.gameEnded) {
					response.status = true;
					response.msg = 'Game has started';
				} else if (player.gameEnded) {
					response.status = false;
					response.msg = 'Game has ended, try another one';
				} else {
					response.status = false;
					response.msg = `Game hasn't started yet`;
				}

				return player;
			}
		});
	} catch (error) {
		response.status = false;
		response.msg = error.message;
		if (error.message.includes('offline')) {
			getGameStatus({ gamePin, topicID });
		} else {
			throw new Error(`could not get game status\n\n ${error}`);
		}
	}

	return response;
}

export {
	fbSignUp,
	fbLogin,
	createGamePinTable,
	createScoreBoard,
	queryGamePin,
	getPlayerNames,
	overallRanking,
	getOverallRanking,
	startGame,
	endGame,
	getGameStatus,
};
