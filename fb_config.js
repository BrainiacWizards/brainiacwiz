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
import { getPerformance } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-performance.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js';

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
const auth = getAuth(app);
const database = getDatabase(app);
const perf = getPerformance(app);
const analytics = getAnalytics(app);

export {
	auth,
	database,
	app,
	set,
	update,
	get,
	ref,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	perf,
	analytics,
};
