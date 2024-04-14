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
		const {user} = userCredential;
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
		const user = userCredential.user;

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

export { fbSignUp, fbLogin };
