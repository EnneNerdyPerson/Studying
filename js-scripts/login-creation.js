//DOM variables ----------------------------------------------------------------
//------------------------------------------------------------------------------
//DOM for login page forms
const logInForm = document.getElementById("log-in-form");
const createForm = document.getElementById("create-form");

//DOM for buttons -- hiding/unhiding acount creation form
const openCreateButton = document.getElementById("open-create");
const closeCreateButton = document.getElementById("close-create");

//DOM for error text
const errorText = document.getElementById("error-text");

//DOM for username and password input (login form)
const usernameInput = document.getElementById("user");
const passwordInput = document.getElementById("pass");

//DOM for username, password, and password check (create account form)
const userMakeInput = document.getElementById("user-make");
const passwordMakeInput = document.getElementById("pass-make");
const passwordCheckMakeInput = document.getElementById("pass-make-check");

//------------------------------------------------------------------------------
//Functions --------------------------------------------------------------------
//------------------------------------------------------------------------------
//switch visibility of login or create account form
function switchForm() {
    createForm.classList.toggle("hidden");
    logInForm.classList.toggle("hidden");

    console.log("switch!");

    let loginZIndex = window.getComputedStyle(document.getElementById("login-form-div")).zIndex;
    let createZIndex =  window.getComputedStyle(document.getElementById("create-form-div")).zIndex;

    document.getElementById("login-form-div").style.zIndex = createZIndex;
    document.getElementById("create-form-div").style.zIndex = loginZIndex;

    loginZIndex = document.getElementById("login-form-div").style.zIndex;
    createZIndex = document.getElementById("create-form-div").style.zIndex;
}

//check for valid username and password
function validateUserPass(user, pass) {
    if (user.value == "" || 
    pass.value == "" ) {
        return false;
    } else {
        return true;
    }
}

//------------------------------------------------------------------------------
//Button Events ----------------------------------------------------------------
//------------------------------------------------------------------------------
//when buttons clicked, switch forms
openCreateButton.addEventListener("click", switchForm);
closeCreateButton.addEventListener("click", switchForm);

//process login-form information
logInForm.addEventListener("submit", async function(event) {
    // Stop the form from submitting normally and reloading
    event.preventDefault(); 

    //check if username and password are valid
    if (!validateUserPass(usernameInput, passwordInput) ) {
        //if not valid, show error message
        errorText.style.color = "red";
        errorText.innerHTML = "Username or password is empty. Please input username/password!";

    } else {
        //if valid, submit form and run login-process.php
        const formData = new FormData(this);    //formatting from data

        try {
            // Send the data via POST request to login-process.php
            const response = await fetch('scripts/login-process.php', {
                method: 'POST',
                body: formData
            });

            console.log(response);

            //read JSON formatted response
            const data = await response.json();
            console.log(data);

            //check status (if failure or sucess)
            if (data.status === "failure") {
                errorText.style.color = "red";
                errorText.innerHTML = data.message;

            } else if (data.status == "sucess-login") {
                errorText.style.color = "green";
                errorText.innerHTML = data.message;

                //redirect to next page
                window.location.href = "home.php";
            }
        } catch (error) {
            //print to console any errors that occur
            console.error('Error sending data:', error);
        }
    }
});

//process create account form information
createForm.addEventListener("submit", async function(event) {
    // Stop the form from submitting normally and reloading the page
    event.preventDefault(); 

    //check for valid username and password
    if (!validateUserPass(userMakeInput, passwordMakeInput)) {
        errorText.style.color = "red";
        errorText.innerHTML = "Username or password is empty. Please input username/password!";

    //check if password and password check are the same
    } else if (passwordMakeInput.value != passwordCheckMakeInput.value) {
        errorText.style.color = "red";
        errorText.innerHTML = "Passwords are not the same, please try again!";

    } else {
        //if valid, submit form and run login-process.php
        const formData = new FormData(this);    //formatting from data

        try {
            // Send the data via POST request to login-process.php
            const response = await fetch('scripts/login-process.php', {
                method: 'POST',
                body: formData
            });
            
            //read JSON formatted response
            const data = await response.json();

            //check for sucessful creation
            if (data.status == "sucess-creation") {
                errorText.style.color = "green";
                errorText.innerHTML = "Creation sucess";

                //redirect to next page
                window.location.href = "home.php";

            } else {
                errorText.style.color = "red";
                errorText.innerHTML = "An error occured";
            }

        } catch (error) {
            console.error('Error sending data:', error);
        }
        
    }
});