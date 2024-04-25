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
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-analytics.js';

const firebaseConfig = {
	apiKey: 'AIzaSyCeL875YW20dLfoeNxfR-EU4TeIPqkWc1Q',
	authDomain: 'brainiacwiz.firebaseapp.com',
	projectId: 'brainiacwiz',
	storageBucket: 'brainiacwiz.appspot.com',
	messagingSenderId: '267854852662',
	appId: '1:267854852662:web:029b05fe4aa7abd0eb5e97',
	measurementId: 'G-SZ59WLGCXV',
	databaseURL: 'https://brainiacwiz-default-rtdb.firebaseio.com/',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

export {
	auth,
	database,
	app,
	analytics,
	set,
	update,
	get,
	ref,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
};
