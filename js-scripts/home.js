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

let cardMap = new Map();
let folderLock = new Map(); 
let setLock = new Map(); 
let setStatus = new Map();

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
        folderLock.set(info["set_id"], false);
        setLock.set(info["set_id"], false);
        setStatus.set(info["set_id"], "close");

        //create div container
        let setContainer = document.createElement("div");
        setContainer.classList.add("home-set-container");

        //create 'image' of set
        // let setImage = document.createElement("div");
        // setImage.classList.add("home-set");
        let setImage = document.createElement("img");
        setImage.classList.add("home-set");
        setImage.src = "images/Folder.png";

        //create cards
        let callCardContainer =  document.createElement("div");
        callCardContainer.classList.add("card-ccc");

        let cardContainerContainer1 = document.createElement("div");
        cardContainerContainer1.classList.add("card-container-container");

        let cardContainerContainer2 = document.createElement("div");
        cardContainerContainer2.classList.add("card-container-container");

        let cardContainerContainer3 = document.createElement("div");
        cardContainerContainer3.classList.add("card-container-container");

        let cardContainerContainer4 = document.createElement("div");
        cardContainerContainer4.classList.add("card-container-container");
        

        let cardContainer1 = document.createElement("div");
        cardContainer1.classList.add("card-container");

        let cardContainer2 = document.createElement("div");
        cardContainer2.classList.add("card-container");

        let cardContainer3 = document.createElement("div");
        cardContainer3.classList.add("card-container");

        let cardContainer4 = document.createElement("div");
        cardContainer4.classList.add("card-container");


        let cardOne = document.createElement("p");
        cardOne.classList.add("card");

        let cardTwo = document.createElement("p");
        cardTwo.classList.add("card");

        let cardThree= document.createElement("p");
        cardThree.classList.add("card");

        let cardFour= document.createElement("p");
        cardFour.classList.add("card");

        cardContainer1.append(cardOne);
        cardContainer2.append(cardTwo);
        cardContainer3.append(cardThree);
        cardContainer4.append(cardFour);

        cardContainerContainer1.append(cardContainer1);
        cardContainerContainer2.append(cardContainer2);
        cardContainerContainer3.append(cardContainer3);
        cardContainerContainer4.append(cardContainer4);

        callCardContainer.append(cardContainerContainer1);
        callCardContainer.append(cardContainerContainer2);
        callCardContainer.append(cardContainerContainer3);
        callCardContainer.append(cardContainerContainer4);

        let cardArray = new Array();
        let cardContainerArray = new Array();
        let cardCCArray = new Array();

        cardArray.push(cardOne);
        cardArray.push(cardTwo);
        cardArray.push(cardThree);
        cardArray.push(cardFour);

        cardContainerArray.push(cardContainer1);
        cardContainerArray.push(cardContainer2);
        cardContainerArray.push(cardContainer3);
        cardContainerArray.push(cardContainer4);

        cardCCArray.push(cardContainerContainer1);
        cardCCArray.push(cardContainerContainer2);
        cardCCArray.push(cardContainerContainer3);
        cardCCArray.push(cardContainerContainer4);

        //HTML for displaying set name
        let setName = document.createElement("p");
        setName.innerHTML = info["set_name"];
        setName.classList.add("name-p");
        setName.addEventListener("click", 
            () => displayCards(cardCCArray, cardContainerArray, cardArray, info["set_id"]));

        callCardContainer.addEventListener("click", 
            () => displayCards(cardCCArray, cardContainerArray, cardArray, info["set_id"]));

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
        
        setContainer.addEventListener("mouseenter", 
            () => folderOpen(setImage, info["set_id"]));
        setContainer.addEventListener("mouseleave", 
            () => folderClose(setImage, info["set_id"]));

        //Add everything to setContainer
        setContainer.append(setImage);
        setContainer.append(callCardContainer);
        // setContainer.append(cardContainer);
        setContainer.append(setName);
        setContainer.append(progressBarContainer);
        setContainer.append(buttonContainer);
        
        // add setContainer to body of page
        body.append(setContainer);
    }
}

//start homepage
start();

// Drafting
let folderPosition = 0;

//TODO: need to implement queue for this
let functionQueue = new Array();        //not a queue but a stack (need to change)
let functionQueueSetId = new Array();

function folderOpen(img, setid) {
    if (!folderLock.get(setid)) {
        folderLock.set(setid, true);
    } else {
        return;
    }

    let beginPosition = folderPosition;
    let time = 0;

    setTimeout(() => {
        img.src = "images/folder-open-2.png";
    }, 100);
    setTimeout(() => {
        img.src = "images/folder-open-3.png";
    }, 200);
    setTimeout(() => {
        img.src = "images/folder-open-4.png";
    }, 300);
    setTimeout(() => {
        img.src = "images/folder-open-5.png";
    }, 400);
    setTimeout(() => {
        img.src = "images/folder-open-6.png";
        folderLock.set(setid, false);

        if (functionQueue.length > 0) {
            functionQueueSetId.pop();
            let functionItems = functionQueue.pop();
            folderClose(functionItems[0], functionItems[1]);
        }
    }, 500);
}

function folderClose(img, setid) {
    if (!folderLock.get(setid)) {
        folderLock.set(setid, true);
    } else {
        if (!functionQueueSetId.includes(setid)) {
            let functionItems = [img, setid];
            functionQueue.push(functionItems);
            functionQueueSetId.push(setid);
        }
        
        return;
    }

    setTimeout(() => {
        img.src = "images/folder-open-5.png";
    }, 100);
    setTimeout(() => {
        img.src = "images/folder-open-4.png";
    }, 200);
    setTimeout(() => {
        img.src = "images/folder-open-3.png";
    }, 300);
    setTimeout(() => {
        img.src = "images/folder-open-2.png";
    }, 400);
    setTimeout(() => {
        img.src = "images/Folder.png";

        folderLock.set(setid, false);
        if (functionQueue.length > 0) {
            functionQueueSetId.pop();
            let functionItems = functionQueue.pop();
            folderClose(functionItems[0], functionItems[1]);
        }
        
    }, 500);
}

function displayCards(ccArray, containerArray, cardArray, setid) {
    let id = null;
    let pos = 0;
    let done = false;
    let reverse = false

    if (setStatus.get(setid) == "open" && !setLock.get(setid)) {
        setLock.set(setid, true);

        let length = cardMap.get(setid).length;
        let index = length - 1;
        let rotate = false;

        let card = cardArray[index];
        let container = containerArray[index];
        let cc = ccArray[index];
        index--;

        clearInterval(id);
        id = setInterval(frame, 5);

        function frame() {
            if (pos == -1 && done) {
                setLock.set(setid, false);         
                setStatus.set(setid, "close");
                clearInterval(id);
            } else {
                if (!rotate) {
                    container.style.transform = "";
                    rotate = true;
                }

                container.style.left = pos + 'px';
                
                if (pos == 100) {
                    reverse = true;

                    cc.classList.toggle("flipped");

                    setTimeout(() => {
                        container.style.zIndex = 0;
                        card.style.zIndex = 0;
                        cc.style.zIndex = 0;
                    }, 300);

                }

                if (reverse) {
                    pos--;
                } else {
                    pos++;
                }

                if (pos == -1) {
                    if (index < cardArray.length && index < length) {
                        card = cardArray[index];
                        container = containerArray[index];
                        cc = ccArray[index];
                    }
                    
                    reverse = false;
                    rotate = false;

                    if (index == -1) {
                        done = true;
                    } 

                    index--;
                } 
            }
        }
    } else if (setStatus.get(setid) == "close" && !setLock.get(setid)) {
        setLock.set(setid, true);

        let card = cardArray[0];
        let container = containerArray[0];
        let cc = ccArray[0];
        card.innerHTML = cardMap.get(setid)[0]["question"];

        let index = 1;

        clearInterval(id);
        id = setInterval(frame, 5);

        let questionArray = cardMap.get(setid);

        function frame() {
            if (pos == -1 && done) {
                setLock.set(setid, false);
                setStatus.set(setid, "open");
                clearInterval(id);
            } else {
                container.style.left = pos + 'px';
                
                if (pos == 100) {
                    reverse = true;

                    container.style.zIndex = 3;
                    card.style.zIndex = 3;
                    cc.style.zIndex = 3;

                    cc.classList.toggle("flipped");
                }

                if (reverse) {
                    pos--;
                } else {
                    pos++;
                }

                if (pos == -1) {

                    if (index % 2 == 0) {
                        container.style.transform = "rotateY(-180deg) rotate("+ (((4 - index) * 2) + 3) + "deg)";
                    } else {
                        container.style.transform = "rotateY(-180deg) rotate(-"+ (((4 - index) * 2) + 3) + "deg)";
                    }
                    
                    if (index < cardArray.length && index < questionArray.length) {
                        card = cardArray[index];
                        container = containerArray[index];
                        cc = ccArray[index];
                        card.innerHTML = questionArray[index]["question"];
                    }
                    

                    reverse = false;

                    if (index == questionArray.length) {
                        done = true;
                    } 

                    index++;
                } 
            }
        }
    } 
}

async function getCards() {
    for (let i = 0; i < dataArray.length; i++) {
        //save row to info variable (for ease of coding)
        let info = dataArray[i];

        try { //request from server set information
            //call homepage function
            let response = await fetch('http://localhost:3000/api/getCardsHome?userid='+userid
                +"&setid=" + info["set_id"]
            );

            //format data with json format
            let data = await response.json();
            // console.log(data);
            cardMap.set(info["set_id"], data.data);
            console.log(data.data);

            //save data in dataArray variable
            // dataArray = data.data;

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
}

await getCards();