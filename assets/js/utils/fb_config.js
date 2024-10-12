import { initializeApp } from 'firebase/app';
import { getStorage, uploadBytes } from 'firebase/storage';
import { getDatabase, ref, set, update, get } from 'firebase/database';
import { getPerformance } from 'firebase/performance';
import { getAnalytics } from 'firebase/analytics';
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithPopup,
	signInWithRedirect,
	getRedirectResult,
	GithubAuthProvider,
} from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyCeL875YW20dLfoeNxfR-EU4TeIPqkWc1Q',
	authDomain: 'brainiacwiz.com',
	databaseURL: 'https://brainiacwiz-default-rtdb.firebaseio.com',
	projectId: 'brainiacwiz',
	storageBucket: 'brainiacwiz.appspot.com',
	messagingSenderId: '267854852662',
	appId: '1:267854852662:web:029b05fe4aa7abd0eb5e97',
	measurementId: 'G-SZ59WLGCXV',
	storageBucket: 'brainiacwiz.appspot.com',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const database = getDatabase(app);
const perf = getPerformance(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);

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
	provider,
	signInWithPopup,
	signInWithRedirect,
	getRedirectResult,
	GoogleAuthProvider,
	GithubAuthProvider,
	githubProvider,
	perf,
	analytics,
	storage,
	uploadBytes,
};
