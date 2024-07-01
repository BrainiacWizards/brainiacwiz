import { navbar } from '../../assets/js/utils/setnavbar.js';
import { fbLogin, fbSignUp, githubLogin, googleLogin } from './fb.js';

const emailDOM = document.getElementById('email');
const userNameDOM = document.getElementById('username');
const passwordDOM = document.getElementById('password');
const confirmPasswordDOM = document.getElementById('confirmPassword');
const signUpForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const googleLoginBtn = document.getElementById('google-login-btn');
const githubLoginBtn = document.getElementById('github-login-btn');
const errorMessage = document.querySelector('.error-message');

// get the prev url before the current one
const prevURL = document.referrer;

signUpForm?.addEventListener('submit', (event) => {
	event.preventDefault();
	register();
});

loginForm?.addEventListener('submit', (event) => {
	event.preventDefault();
	login(emailDOM.value, passwordDOM.value);
});

googleLoginBtn?.addEventListener('click', () => {
	googleLogin({ errorMessage, prevURL });
});

githubLoginBtn?.addEventListener('click', () => {
	githubLogin({ errorMessage, prevURL });
});

function register() {
	//get all input fields
	let userName = userNameDOM.value;
	let email = emailDOM.value;
	let password = passwordDOM.value;
	let confirmPassword = confirmPasswordDOM.value;

	//validate input fields
	function validateAllFields() {
		return (
			validateFields(email) &&
			validateFields(userName) &&
			validateFields(password) &&
			validateFields(confirmPassword) &&
			validateEmail(email)
		);
	}

	if (!validateAllFields()) {
		return;
	}

	if (!validatePassword(password, confirmPassword)) {
		return;
	}

	fbSignUp({ email, password, userName, errorMessage, prevURL });
}

//login function
function login(email, password) {
	if (!validateFields(password) || !validateFields(email)) {
		return;
	}

	if (!validateEmail(email)) {
		return;
	}

	errorMessage.textContent = 'Logging in...';
	fbLogin({ email, password, errorMessage, prevURL });
}

//validate email
function validateEmail(email) {
	var expression = /\S+@\S+\.\S+/;
	if (expression.test(email)) {
		return true;
	}

	//email is invalid
	errorMessage.textContent = 'Invalid	email';
	navbar.errorDetection.consoleError('Invalid email');
	return false;
}

//validate password
function validatePassword(password, confirmPassword) {
	if (password.length < 6) {
		errorMessage.textContent = 'Password must be at least 6 characters';
		navbar.errorDetection.consoleError('Password must be at least 6 characters');
		return false;
	}

	//password length meets requirements
	if (password != confirmPassword) {
		errorMessage.textContent = 'Passwords do not match';
		navbar.errorDetection.consoleError('Passwords do not match');
		return false;
	}

	return true;
}

function validateFields(field) {
	if (!field || field.trim() == '' || field.length <= 0) {
		errorMessage.textContent = 'All fields are required';
		navbar.errorDetection.consoleError('All fields are required');
		return false;
	}

	return true;
}

const formGroups = document.querySelectorAll('.form-group');
formGroups.forEach((formGroup) => {
	formGroup?.addEventListener('click', () => {
		errorMessage.textContent = '';
		errorMessage.style.color = 'red';
	});
});
