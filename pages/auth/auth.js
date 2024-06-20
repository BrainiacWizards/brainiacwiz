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

signUpForm?.addEventListener('submit', (event) => {
	event.preventDefault();
	register();
});

loginForm?.addEventListener('submit', (event) => {
	event.preventDefault();
	login(emailDOM.value, passwordDOM.value);
});

googleLoginBtn?.addEventListener('click', () => {
	googleLogin(errorMessage);
});

githubLoginBtn?.addEventListener('click', () => {
	githubLogin(errorMessage);
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

	console.log('All fields are valid');
	fbSignUp({ email, password, userName, errorMessage });
}

//login function
function login(email, password) {
	if (!validateFields(password) || !validateFields(email)) {
		return;
	}

	if (!validateEmail(email)) {
		return;
	}

	console.log('All fields are valid');
	errorMessage.textContent = 'Logging in...';
	fbLogin({ email, password, errorMessage });
}

//validate email
function validateEmail(email) {
	var expression = /\S+@\S+\.\S+/;
	if (expression.test(email)) {
		return true;
	}

	//email is invalid
	errorMessage.textContent = 'Invalid	email';
	return false;
}

//validate password
function validatePassword(password, confirmPassword) {
	if (password.length < 6) {
		errorMessage.textContent = 'Password must be at least 6 characters';
		return false;
	}

	//password length meets requirements
	if (password != confirmPassword) {
		errorMessage.textContent = 'Passwords do not match';
		return false;
	}

	return true;
}

function validateFields(field) {
	if (!field || field.trim() == '' || field.length <= 0) {
		errorMessage.textContent = 'All fields are required';
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
