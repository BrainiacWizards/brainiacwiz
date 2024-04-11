const emailDOM = document.getElementById('email')
const userNameDOM = document.getElementById('username')
const passwordDOM = document.getElementById('password')
const confirmPasswordDOM = document.getElementById('confirmPassword')
const signUpForm = document.getElementById('signup-form')
const loginForm = document.getElementById('login-form')

signUpForm.addEventListener('submit', (event) => {
    event.preventDefault()
    register()
})

loginForm.addEventListener('submit', (event) => {
    event.preventDefault()
    login(userNameDOM.value, passwordDOM.value)
})

function register() {
    //get all input fields
    let userName = userNameDOM.value;
    let email = emailDOM.value;
    let password = passwordDOM.value;
    let confirmPassword = confirmPasswordDOM.value;

    //validate input fields
    if (!validateFields(email) || !validateFields(userName) || !validateFields(password) || !validateFields(confirmPassword)) {
        alert('Field is required');
        return;
        //do not continue with authentication
    }
}

function firebaseRegister() {
    auth.SignInWithEmailAndPassword(email, password)
        .then(function (user) {
            //user signed in
            var user = auth.currentUser;
            //update user data
            var databaseRef = database.ref();
            var userData = {

                //set the date of last login
                lastLogin: Date.now()
            }
            //save user data to database
            databaseRef.child('users/' + user.uid).update(userData);
        })
        .catch(function (error) {
            //firebase will use this to alert of its errors
            var errorCode = error.code;
            var errorMessage = error.message;

            alert(errorMessage);
        })


    //Move on with authentication
    auth.createUserWithEmailAndPassword(email, password)
        .then(function (user) {
            //user created variable
            var user = auth.currentUser;
            //Add user to database
            var databaseRef = database.ref();

            //create user data  
            var userData = {
                email: email,
                username: userName,
                password: password,
                confirmPassword: confirmPassword,
                //set the date of last login
                lastLogin: Date.now()
            }
            //save user data to database
            databaseRef.child('users/' + user.uid).set(userData);
        })
        .catch(function (error) {
            //firebase will use this to alert of its errors
            var errorCode = error.code;
            var errorMessage = error.message;

            alert(errorMessage, errorCode);
        })
}


//login function
function login() {
    //get all input fields
    let password = passwordDOM.value;
    let userName = userNameDOM.value;

    if (!validateFields(password) || !validateFields(userName)) {
        alert('Field is required');
        return;
    }
}


//validate email
function validateEmail(email) {
    var expression = /\S+@\S+\.\S+/;
    if (expression.test(email) == true) {
        //email is valid
        return true;
    }

    //email is invalid
    return false;
}

//validate password
function validatePassword(password, confirmPassword) {
    if (password.length < 6) {
        //password is too short
        alert('Password is too short');
        confirmPassword.setCustomValidity('');
        return false;
    }

    //password length meets requirements
    if (password.value != confirmPassword.value) {
        //confirm passwords match
        alert('Passwords do not match');
        return false;
    }

    // Passwords match
    return true;

}

function validateFields(field) {
    if (!field || field.trim() == "") {
        alert('Field is required');
        return false;
    }
    if (field.length <= 0) {
        alert('Field is required');
        return false;
    }

    return true;

}