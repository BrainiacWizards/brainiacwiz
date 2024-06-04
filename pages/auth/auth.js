import { fbLogin, fbSignUp, githubLogin, googleLogin } from './fb.js';

const emailDOM = document.getElementById('email');
const userNameDOM = document.getElementById('username');
const passwordDOM = document.getElementById('password');
const confirmPasswordDOM = document.getElementById('confirmPassword');
const signUpForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const googleLoginBtn = document.getElementById('google-login-btn');
const githubLoginBtn = document.getElementById('github-login-btn');

signUpForm?.addEventListener('submit', (event) => {
	event.preventDefault();
	register();
});

loginForm?.addEventListener('submit', (event) => {
	event.preventDefault();
	login(emailDOM.value, passwordDOM.value);
});

googleLoginBtn?.addEventListener('click', () => {
	googleLogin();
});

githubLoginBtn?.addEventListener('click', () => {
	githubLogin();
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
	fbSignUp(email, password, userName, confirmPassword);
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
	fbLogin({ email, password });
}

//validate email
function validateEmail(email) {
	var expression = /\S+@\S+\.\S+/;
	if (expression.test(email)) {
		//email is valid
		return true;
	}

	//email is invalid
	alert('Email is invalid');
	return false;
}

//validate password
function validatePassword(password, confirmPassword) {
	if (password.length < 6) {
		//password is too short
		alert('Password is too short');
		return false;
	}

	//password length meets requirements
	if (password != confirmPassword) {
		//confirm passwords match
		alert('Passwords do not match');
		return false;
	}

	// Passwords match
	return true;
}

function validateFields(field) {
	if (!field || field.trim() == '') {
		alert('Field is required');
		return false;
	}
	if (field.length <= 0) {
		alert('Field is required');
		return false;
	}

	return true;
}
