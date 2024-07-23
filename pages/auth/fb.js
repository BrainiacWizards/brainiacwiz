import { delay } from '../../assets/js/utils/helpers.js';
import { navbar } from '../../assets/js/utils/setnavbar.js';
import * as fb from '../../fb_config.js';

// Utility function to shorten usernames
function shortenUsername(username) {
	const usernameArr = username.split(' ');
	if (usernameArr.length > 1) {
		return `${usernameArr[0][0]} ${usernameArr[1]}`;
	} else if (username.length > 13) {
		return username.slice(0, 10);
	}
	return username;
}

const fbSignUp = async ({ email, password, userName, errorMessage }) => {
	try {
		const userCredential = await fb.createUserWithEmailAndPassword(fb.auth, email, password);
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
		errorMessage.textContent = 'Account created!';
		errorMessage.style.color = 'green';

		// redirect to the login page
		navbar.errorDetection.consoleInfo(
			'Account created successfully! Redirecting to login page...',
		);
		await delay(1000);
		window.location.href = './login.html';
	} catch (error) {
		if (error.message.includes('offline')) {
			console.log('offline');
			fbSignUp({ email, password, userName });
		} else {
			const errorMessages = {
				'auth/invalid-email': 'Invalid email address.',
				'auth/user-disabled': 'User account is disabled.',
				'auth/user-not-found': 'User not found.',
				'auth/wrong-password': 'Incorrect password.',
				// Add more error codes and messages as needed
			};

			const userFriendlyMessage =
				errorMessages[error.code] || 'An unexpected error occurred.';
			navbar.errorDetection.consoleError(userFriendlyMessage);
			errorMessage.textContent = userFriendlyMessage;
			throw new Error(`could not create user\n\n ${error}`);
		}
	}
};

// google login
async function googleLogin({ errorMessage, prevURL }) {
	try {
		fb.auth.useDeviceLanguage();
		errorMessage.textContent = 'Logging in...';
		navbar.errorDetection.consoleInfo('Logging in...');
		const result = await fb.signInWithPopup(fb.auth, fb.provider);
		const { user } = result;

		// get user data
		const userRef = fb.ref(fb.database, `users/${user.uid}`);
		const userData = {
			email: user.email,
			username: user.displayName,
			lastLogin: Date.now(),
		};

		await fb.set(userRef, userData);
		errorMessage.textContent = 'Login successful!';
		navbar.errorDetection.consoleInfo('Login successful!');
		// set session storage for login object
		const loginObject = {
			loggedIn: true,
			username: user.displayName,
			lastLogin: Date.now(),
		};

		sessionStorage.setItem('login', JSON.stringify(loginObject));
		await getUsers(loginObject.username);
		window.location.href = `${prevURL}?login=success&username=${user.displayName}`;
	} catch (error) {
		const errorCode = error.code.split('/')[1];
		const errorMsg = error.message;
		const { email } = error;
		const credential = fb.GoogleAuthProvider.credentialFromError(error);
		errorMessage.textContent = errorCode;
		navbar.errorDetection.consoleError(`could not login user!\n${errorCode}`);
		throw new Error(
			`could not login user!\n\n ${errorCode}\n\n ${errorMsg}\n\n ${email}\n\n ${credential}`,
		);
	}
}

const fbLogin = async ({ email, password, errorMessage, prevURL }) => {
	try {
		errorMessage.textContent = 'Logging in...';
		navbar.errorDetection.consoleInfo('Logging in...');
		const userCredential = await fb.signInWithEmailAndPassword(fb.auth, email, password);
		const { user } = userCredential;

		const userData = {
			lastLogin: Date.now(),
		};

		const userRef = fb.ref(fb.database, `users/${user.uid}`);

		await fb.update(userRef, userData);
		errorMessage.textContent = 'Login successful!';
		errorMessage.style.color = 'green';
		navbar.errorDetection.consoleInfo('Login successful!');

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
		await getUsers(loginObject.username);
		// redirect to the home page
		window.location.href = `${prevURL}?login=success&username=${username}`;
	} catch (error) {
		if (error.message.includes('offline')) {
			fbLogin({ email, password });
		} else {
			errorMessage.textContent = error.code.split('/')[1];
			navbar.errorDetection.consoleError(
				`could not login user!\n${error.code.split('/')[1]}`,
			);
			console.error(`could not login user\n\n ${error}`);
		}
	}
};

// github login
async function githubLogin({ prevURL }) {
	try {
		const result = await fb.signInWithPopup(fb.auth, fb.githubProvider);
		const credential = fb.GithubAuthProvider.credentialFromResult(result);
		const { user } = result;

		// get user data
		const userRef = fb.ref(fb.database, `users/${user.uid}`);
		const userData = {
			email: user.email,
			username: user.displayName,
			lastLogin: Date.now(),
		};

		await fb.set(userRef, userData);
		navbar.errorDetection.consoleInfo('Login successful!');
		await delay(2000);
		// set session storage for login object
		const loginObject = {
			loggedIn: true,
			username: user.displayName,
			lastLogin: Date.now(),
		};

		sessionStorage.setItem('login', JSON.stringify(loginObject));
		await getUsers(loginObject.user);
		// redirect to the previous page
		window.location.href = `${prevURL}?login=success&username=${user.displayName}`;
	} catch (error) {
		const errorCode = error.code.split('/')[1];
		const errorMessage = error.message;
		const { email } = error;
		const credential = fb.GithubAuthProvider.credentialFromError(error);
		alert(errorCode);

		navbar.errorDetection.consoleError(`could not login user!\n${errorCode}`);
		throw new Error(
			`could not login user!\n\n ${errorCode}\n\n ${errorMessage}\n\n ${email}\n\n ${credential}`,
		);
	}
}

async function createGamePinTable({ gamePin, topicID, campaign, host }) {
	try {
		console.log('Creating gamepin table', gamePin, topicID);
		const gamePinRef = fb.ref(fb.database, `gamepin/${gamePin}-${topicID}`);
		await fb.set(gamePinRef, {});
		const nfts = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg'];
		const randomIndex = Math.floor(Math.random() * nfts.length);
		const nft = nfts[randomIndex];
		const { origin } = window.location;
		const nftURL = `${origin}/assets/nft/${nft}`;
		const dummyObject = [
			{
				username: 'dummy',
				score: 0,
				reward: 0,
				gameStarted: false,
				gameEnded: false,
				campaign: campaign,
				host: host,
				nft: nftURL,
			},
		];

		await fb.set(gamePinRef, dummyObject);
		navbar.errorDetection.consoleInfo('Game created successfully, share pin	with players!');
	} catch (error) {
		if (error.message.includes('offline')) {
			createGamePinTable({ gamePin, topicID });
		} else {
			navbar.errorDetection.consoleError(`could not create gamepin table, try again!`);
			throw new Error(`could not create gamepin table\n\n ${error}`);
		}
	}
}

// set scoreboard in fb.database in table named gamepin
async function createScoreBoard({ gamePin, username, score, topicID, wallet }) {
	console.log('Creating gamepin table', gamePin, topicID);
	let scoreRef = null,
		scoreData = [];

	try {
		scoreRef = fb.ref(fb.database, `gamepin/${gamePin}-${topicID}`);
		const scoreSnapshot = await fb.get(scoreRef);
		scoreData = Object.values(scoreSnapshot.val() || {});

		username = shortenUsername(username);

		// Initialize scoreData if it's null
		if (!scoreData) {
			scoreData = [{ username: username, score: score, wallet: wallet }];
		}
		// add the new score to the existing data if the username doesn't already exist
		if (!scoreData.some((obj) => obj.username === username)) {
			scoreData.push({ username: username, score: score, wallet: wallet });
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
	} catch (error) {
		if (error.message.includes('offline')) {
			createScoreBoard({ gamePin, username, score, topicID });
		} else {
			navbar.errorDetection.consoleError(`could not update the scoreboard, try again!`);
			throw new Error(`could not update the scoreboard\n\n ${error}`);
		}
	}

	return scoreData || [{ username: 'No players yet', score: 0, wallet: 'N/A' }];
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
			navbar.errorDetection.consoleError(`could not get player names, try again!`);
			throw new Error(`could not get player names\n\n ${error}`);
		}
	}
}

//get player names using game pin
async function getPlayerNames({ gamePin, topicID }) {
	let playerNamesRef = null;
	let playerNamesSnapshot = null;
	let players = null;
	const dummySnapshot = {
		val: () => {
			return [
				{
					username: 'dummy',
					score: 0,
					nft: '1.jpg',
					reward: 0,
					gameStarted: false,
					gameEnded: false,
				},
			];
		},
	};

	try {
		playerNamesRef = fb.ref(fb.database, `gamepin/${gamePin}-${topicID}`);
		playerNamesSnapshot = (await fb.get(playerNamesRef)) || dummySnapshot;
		players = (await playerNamesSnapshot.val()) || [
			{
				username: 'dummy',
				score: 0,
				nft: '1.jpg',
				reward: 0,
				gameStarted: false,
				gameEnded: false,
			},
		];

		// console.log(players);
		players = players.sort((a, b) => b.score - a.score);

		// for each player if username is 2 words take initial and surname
		players = players.map((player) => {
			player.username = shortenUsername(player.username);
			return player;
		});
	} catch (error) {
		if (error.message.includes('offline')) {
			getPlayerNames({ gamePin, topicID });
		} else {
			navbar.errorDetection.consoleError(`could not get player names, try again!`);
			console.error(`could not get player names\n\n ${error}`);
		}
	}

	return players;
}

async function setPlayers({ gamePin, topicID, playerNames }) {
	let playerNamesRef = null;

	try {
		playerNamesRef = fb.ref(fb.database, `gamepin/${gamePin}-${topicID}`);

		// for each player if username is 2 words take initial and surname
		playerNames = playerNames.map((player) => {
			player.username = shortenUsername(player.username);
			return player;
		});

		await fb.set(playerNamesRef, playerNames);
	} catch (error) {
		if (error.message.includes('offline')) {
			setPlayers({ gamePin, topicID, playerNames });
		} else {
			navbar.errorDetection.consoleError(`could not set player names, try again!`);
			console.error(`could not set player names\n\n ${error}`);
		}
	}
}

// set overall ranking
async function overallRanking({ username, points, time, retry, gamePin, campaign }) {
	let overallRankingSnapshot = null;
	let overallRankingRef = null,
		overallRanking;
	try {
		overallRankingRef = fb.ref(fb.database, 'overallRanking');
		overallRankingSnapshot = await fb.get(overallRankingRef);
		overallRanking = Object.values(overallRankingSnapshot.val() || []);
	} catch (error) {
		if (error.message.includes('offline')) {
			overallRanking({ username, points, time, retry });
		} else {
			navbar.errorDetection.consoleError(`could not get overall ranking, try again!`);
			throw new Error(`could not get overall ranking\n\n ${error}`);
		}
	}

	// Initialize overallRanking if it's null
	if (!overallRanking) {
		navbar.errorDetection.consoleWarn('Initializing empty overall ranking');
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
			gamePin: gamePin,
			campaign: campaign,
		});
	} else {
		// update the score if the username already exists
		overallRanking = overallRanking.map((obj) => {
			if (obj.username === username) {
				// if game pin is the same, update the points
				if (obj.gamePin === gamePin) {
					retry ? (obj.points += points - retry) : (obj.points += points);
				} else {
					// if game pin is different, create a new entry
					obj.points = points;
				}

				obj.time = time;
				obj.duration = time - obj.startTime;
				obj.gamePin = gamePin;
				obj.campaign = campaign;
			}
			return obj;
		});
	}

	try {
		await fb.set(overallRankingRef, overallRanking);
		navbar.errorDetection.consoleInfo('Overall ranking updated successfully');
	} catch (error) {
		if (error.message.includes('offline')) {
			overallRanking({ username, points, time, retry, gamePin });
		} else {
			navbar.errorDetection.consoleError(`could not update the overall ranking, try again!`);
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
				{ username: 'No players yet', points: 0, time: 0, startTime: 0, gamePin: 'N/A' },
			]
		);
	} catch (error) {
		if (error.message.includes('offline')) {
			getOverallRanking();
			console.error(error);
		} else {
			navbar.errorDetection.consoleError(`could not get overall ranking, try again!`);
			throw new Error(`could not get overall ranking\n\n ${error}`);
		}
		return (
			overallRanking || [
				{ username: 'No players yet', points: 0, time: 0, startTime: 0, gamePin: 'N/A' },
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
			navbar.errorDetection.consoleError(`could not start the game, try again!`);
			throw new Error(`could not start the game\n\n ${error}`);
		}
	}
}

// end hosted game
async function endGame({ gamePin, topicID }) {
	let playerNames = await getPlayerNames({ gamePin, topicID });
	navbar.errorDetection.consoleWarn('Ending game...');

	try {
		// change only dummy
		if (playerNames) {
			playerNames = playerNames.map((player) => {
				if (player.username == 'dummy') {
					player.gameStarted = true;
					player.gameEnded = true;
					player.endTime = new Date();
				}
				return player;
			});
		}

		await setPlayers({ gamePin, topicID, playerNames });
		navbar.errorDetection.consoleInfo('Game ended!');
		return { status: true, msg: 'Game ended!' };
	} catch (error) {
		if (error.message.includes('offline')) {
			await endGame({ gamePin, topicID });
		} else {
			navbar.errorDetection.consoleError(`could not end the game, try again!`);
			throw new Error(`could not end the game\n\n ${error}`);
		}
	}
}

// get game status
async function getGameStatus({ gamePin, topicID }) {
	const response = {
		status: false,
		msg: 'pending...',
	};

	try {
		const playerName = (await getPlayerNames({ gamePin, topicID })) || [];

		// check on dummy
		playerName.map((player) => {
			if (player.username === 'dummy') {
				if (player.gameStarted && !player.gameEnded) {
					response.status = true;
					response.msg = 'On	going game!';
				} else if (player.gameEnded) {
					response.status = false;
					response.msg = 'Game has ended!';
				} else {
					response.status = false;
					response.msg = `Pending...`;
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
			navbar.errorDetection.consoleError(`could not get game status, try again!`);
			throw new Error(`could not get game status\n ${error}`);
		}
	}

	return response;
}

// use firebase storage to store images
async function uploadImage({ file, fileName, imageURL, folder }) {
	const storageRef = fb.ref(fb.storage, `${folder}/${fileName}`);
	let uploadTask, downloadURL;

	if (imageURL) {
		uploadTask = fb.uploadBytes(
			storageRef,
			await fetch(imageURL).then((response) => response.blob()),
		);
	} else {
		uploadTask = fb.uploadBytes(storageRef, file);
	}

	uploadTask.on(
		'state_changed',
		(snapshot) => {
			const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			console.log(`Upload is ${progress}% done`);
		},
		(error) => {
			console.error(error);
		},
		async () => {
			downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
			console.log('File available at', downloadURL);
		},
	);

	return downloadURL;
}

async function fundGame({ gamePin, topicID, amount }) {
	let playerNames = await getPlayerNames({ gamePin, topicID });

	try {
		// change only dummy
		if (playerNames) {
			playerNames = playerNames.map((player) => {
				if (player.username == 'dummy') {
					player.reward = amount;
				}
				return player;
			});
		}

		await setPlayers({ gamePin, topicID, playerNames });
		return { status: true, message: 'Game has been funded!' };
	} catch (error) {
		if (error.message.includes('offline')) {
			fundGame({ gamePin, topicID, amount });
		} else {
			navbar.errorDetection.consoleError(`could not fund the game, try again!`);
			throw new Error(`could not fund the game\n\n ${error}`);
		}
	}
}

// get all users from database
async function getUsers(username) {
	let users = null,
		user = null;
	try {
		const userRef = fb.ref(fb.database, `users`);
		const userSnapshot = await fb.get(userRef);
		users = userSnapshot.val();

		user = Object.values(users).filter((user) => user.username === username);
		user = user.map((user) => {
			delete user.password;
			return user;
		});

		// format date into readable format
		user = user.map((user) => {
			user.lastLogin = new Date(user.lastLogin).toLocaleString();
			return user;
		});

		updateLogin(user);
		return user || { username: 'No users found', email: 'N/A', lastLogin: 'N/A' };
	} catch (error) {
		if (error.message.includes('offline')) {
			getUsers();
		} else {
			navbar.errorDetection.consoleError(`could not get all users, try again!`);
			throw new Error(`could not get all users\n\n ${error}`);
		}
	}
}

function updateLogin(user) {
	const login = JSON.parse(sessionStorage.getItem('login'));
	login.username = user[0].username || login.username;
	login.email = user[0].email;
	login.lastLogin = user[0].lastLogin;
	sessionStorage.setItem('login', JSON.stringify(login));
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
	googleLogin,
	githubLogin,
	uploadImage,
	fundGame,
	getUsers,
};
