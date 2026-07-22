//------------------------------------------------------------------------------
//Get Set information that is associated with user -----------------------------
//------------------------------------------------------------------------------

//get user_id to get set information
let userid = document.getElementById("username").dataset.userid;
let dataArray;

try { //request from server set information
    //call homepage function
    let response = await fetch('http://localhost:3000/api/homepage?userid='+userid);

    //format data with json format
    let data = await response.json();

    //save data in dataArray variable
    dataArray = data.data;

} catch (error) {
    console.error('Error fetching data:', error);
}

//------------------------------------------------------------------------------
// Get varibales from DOM and Create global vairbales --------------------------
//------------------------------------------------------------------------------
let body = document.getElementById("body");

//deletion DOM variables
let deletionContainer = document.getElementById("deletion-warning");
let deletionTextWarning = document.getElementById("delete-warn-text");
let yesDeleteButton = document.getElementById("yes-delete");
let noDeleteButton = document.getElementById("no-delete");

let deleteContainer = null;
let deleteSetid = 0;

//------------------------------------------------------------------------------
// Event functions -------------------------------------------------------------
//------------------------------------------------------------------------------

/**
 * Open editSet page to edit set associated with button, given
 * by the setid
 * 
 * @param {*} setid - id of set to be edited
 */
async function editSet(setid) {
    //create form data to be sent to php function
    let formData = new FormData();
    formData.append("setname", setid);

    //run set-setname.php file to update session setname
    try {
        await fetch('scripts/set-setname.php', {
            method: 'POST',
            body: formData
        });

        //open flashcard-make page
        window.location.href = "flashcard-make.php";

    } catch (error) {
        //print to console any errors that occur
        console.error('Error sending data:', error);
    }
}

/**
 * Open study page to study set associated with button, given
 * by the setid
 * 
 * @param {*} setid - id of set to be edited
 */
async function studySet(setid) {
    //create form data to be sent to php function
    let formData = new FormData();
    formData.append("setname", setid);

    //run set-setname.php file to update session setname
    try {
        await fetch('scripts/set-setname.php', {
            method: 'POST',
            body: formData
        });

        //open flashcard-study page
        window.location.href = "flashcard-study.php";

    } catch (error) {
        //print to console any errors that occur
        console.error('Error sending data:', error);
    }
}

/**
 * Begin the process of possibly deleting a given set. This is done
 * by updating certain global variables, updating the deletion warning
 * text and unhiding the deletion warning information
 * 
 * @param {*} container - the DOM element of conainter to be deleted
 * @param {*} setid - id of the the set to be deleted
 * @param {*} setname - name of set to be deleted
 */
function checkDeleteSet(container, setid, setname) {
    deleteContainer = container;
    deleteSetid = setid;

    deletionTextWarning.innerText = "Deletion of set '" + setname  + "' is irreverible";

    deletionContainer.classList.toggle("hidden");
}

//------------------------------------------------------------------------------
// Event listeners added to buttons --------------------------------------------
//------------------------------------------------------------------------------
/**
 * When noDeleteButton (Canceling a deletion) is clicked, the deletion
 * warning container is hidden again
 */
noDeleteButton.addEventListener("click", function () {
    deletionContainer.classList.toggle("hidden");
});

/**
 * When yesDeleteButton (Confirming a deletion) is clicked, the deletion
 * process begins. First, deletes the DOM associated with the deleted
 * set, next, deleting the set from the SQL database by calling deleteSet
 * function for server
 */
yesDeleteButton.addEventListener("click", async function () {
    //remove deleted sets HTML elements
    deleteContainer.remove();

    //hide deletion information
    deletionContainer.classList.toggle("hidden");

    //delete set from SQL database by calling deleteSet function for server.js
    try {
        await fetch('http://localhost:3000/api/deleteSet?userid='+userid
            +'&setid='+deleteSetid
        );

    } catch (error) {
        //print to console any errors that occur
        console.error('Error sending data:', error);
    }
});

//------------------------------------------------------------------------------
// Start function --------------------------------------------------------------
//------------------------------------------------------------------------------
/**
 * Start the homepage. This is done by adding set information from SQL database
 * to hompage with HTML elements
 */
function start() {
    //iterate through all rows from SQL query (each row is a set)
    for (let i = 0; i < dataArray.length; i++) {
        //save row to info variable (for ease of coding)
        let info = dataArray[i];

        //create div container
        let setContainer = document.createElement("div");
        setContainer.classList.add("home-set-container");

        //create 'image' of set
        let setImage = document.createElement("div");
        setImage.classList.add("home-set");


        //create progress bar elements
        let progressBarContainer = document.createElement("div");
        progressBarContainer.classList.add("progress-bar-container");

        //create progress bar
        let progressBar = document.createElement("div");
        progressBar.classList.add("progress-bar");
        //width is base on set's progress
        progressBar.style.width = info["progress"] + "%";

        //add progressbar to progressBarContainer
        progressBarContainer.append(progressBar);


        //HTML for displaying set name
        let setName = document.createElement("p");
        setName.innerHTML = info["set_name"];


        //create button elements
        let buttonContainer = document.createElement("div");
        buttonContainer.classList.add("flex-container");

        //create edit button
        let editButton = document.createElement("button");
        editButton.innerHTML = "Edit";
        editButton.addEventListener('click', 
            () => editSet(info["set_name"]));;

        //create study button
        let studyButton = document.createElement("button");
        studyButton.innerHTML = "Study";
        studyButton.addEventListener('click', 
            () => studySet(info["set_name"]));;

        //create delete button
        let delteButton = document.createElement("button");
        delteButton.innerHTML = "Delete";
        delteButton.addEventListener('click', 
            () => checkDeleteSet(setContainer, 
                                info["set_id"], 
                                info["set_name"]));;

        //add buttons to button container
        buttonContainer.append(editButton);
        buttonContainer.append(studyButton);
        buttonContainer.append(delteButton);    
        

        //Add everything to setContainer
        setContainer.append(setImage);
        setContainer.append(progressBarContainer);
        setContainer.append(setName);
        setContainer.append(buttonContainer);
        
        // add setContainer to body of page
        body.append(setContainer);
    }
}

//start homepage
start();