//authintication
//signUp

function register() {
 //get all input fields
    var email = document.getElementById('email').value;
    var userName = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;

    //validate input fields
    if(validateFields(email) == false || validateFields(userName) == false || validateFields(password) == false || validateFields(confirmPassword) == false){
        alert('Field is required');
        return;
        //do not continue with authentication
    }
    auth.SignInWithEmailAndPassword(email, password)
    .then(function(user){
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
    .catch(function(error){
        //firebase will use this to alert of its errors
       var errorCode = error.code;
       var errorMessage = error.message;

       alert(errorMessage); 
    }) 

    
    //Move on with authentication
    auth.crateUserWithEmailAndPassword(email, password)
    .then(function(user){
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
    .catch(function(error){
        //firebase will use this to alert of its errors
       var errorCode = error.code;
       var errorMessage = error.message;

       alert(errorMessage); 
    })
}

//login function
function login(){
    //get all input fields
    var email = document.getElementById('email').value;
    var userName = document.getElementById('username').value;
  
    if(validateFields(email) == false || validateFields(userName) == false){
        alert('Field is required');
        return;
    }
}


    //validate email
    function validateEmail(email) {
        var expression = /\S+@\S+\.\S+/;
        if (expression.test(email) == true){
            //email is valid
            return true; 
        }else{
            //email is invalid
            return false;
        }
    }
    //validate password
    function validatePassword(password) {
        if(password.length < 6){
            //password is too short
            return false;}
            else{
                return true;
            }
        } 
       
    function validateFields(field){
        if(field == null || field == ""){
            return false;
        }
        if(field.length <= 0){
            return false;
        }
        else{
            return true;
        }
    }





    /*
    //check if password and confirm password match  
    if(password === confirmPassword) {
        //create user
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function() {
            // Sign-out successful.
            console.log('User Created');
        })
        .catch(function(error) {
            // An error happened.
            console.log(error);
        });
    } else {
        console.log('Passwords do not match');
    }*/
