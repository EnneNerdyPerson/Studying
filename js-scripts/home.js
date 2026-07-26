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

let cardMap = new Map();        //map of cards' question in a set

let folderLock = new Map();     //lock for folder opening/closing
let setLock = new Map();        //lock for displaying cards
let setStatus = new Map();      //status of cards

//TODO: need to implement queue for this
let closeFunctionQueue = new Array();        //queue for closing folder
let setidInQueue = new Array();   //queue for knowning which sets are in functionQueue

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

/**
 * folderOpen
 * 
 * Animate the folder opening if folder is not already opening or
 * closing. Once the animation is done, check if there are close
 * functions in the queue. If they are in the queue, run the folderClose
 * function
 * 
 * @param {*} img - the image of the folder that needs to change
 * @param {*} setid - the id of the set whoes folder changes
 */
function folderOpen(img, setid) {
    //check if folder is being opened or close right now
    if (!folderLock.get(setid)) {
        //if not currently animated, lock this folder
        folderLock.set(setid, true);
    } else {
        //stop animating
        return;
    }

    //set timeouts so that folder cycles through image
    //animations every 1ms
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

        //once folder is open, unlock this folder
        folderLock.set(setid, false);

        //check for any close function in queue
        if (closeFunctionQueue.length > 0) {
            //remove setid
            setidInQueue.pop();

            //run floderClose function
            let functionItems = closeFunctionQueue.pop();
            folderClose(functionItems[0], functionItems[1]);
        }
    }, 500);
}

/**
 * folderClose
 * 
 * Animate the folder opening if folder is not already opening or
 * closing. Once the animation is done, check if there are close
 * functions in the queue. If they are in the queue, run the folderClose
 * function
 * 
 * @param {*} img - the image of the folder that needs to change
 * @param {*} setid - the id of the set whoes folder changes
 */
function folderClose(img, setid) {
    //check if folder is being opened or close right now
    if (!folderLock.get(setid)) {
        //if not currently animated, lock this folder
        folderLock.set(setid, true);
    } else {
        //check if set is already in close function queue
        if (!setidInQueue.includes(setid)) {
            //if not in queue, add to queue
            let functionItems = [img, setid];
            closeFunctionQueue.push(functionItems);

            //add setid in setid queue
            setidInQueue.push(setid);
        }
        
        //stop animating
        return;
    }

    //set timeouts so that folder cycles through image
    //animations every 1ms
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

        //once folder is open, unlock this folder
        folderLock.set(setid, false);

        //check for any close function in queue
        if (closeFunctionQueue.length > 0) {
            //remove setid
            setidInQueue.pop();

            //run floderClose function
            let functionItems = closeFunctionQueue.pop();
            folderClose(functionItems[0], functionItems[1]);
        }
        
    }, 500);
}

/**
 * displayCards
 * 
 * Animate four (or less) cards flipping onto the top of the folder
 * or going behind the folder. This function also has locks for this
 * animation
 * 
 * @param {*} ccArray - container for the cards (array)
 * @param {*} containerArray - cards in an array
 * @param {*} setid - set whoes ares are being displayed
 */
function displayCards(ccArray, containerArray, setid) {
    //intialize variables for the function
    let id = null;
    let pos = 0;

    let done = false;
    let reverse = false
    let opening = false;

    //check if set is open (on display) and locked
    if (setStatus.get(setid) == "open" && !setLock.get(setid)) {
        //lock set
        setLock.set(setid, true);

        //initalize more vairables
        let length = cardMap.get(setid).length;
        let index = length - 1;
        let rotate = false;

        let container = containerArray[index];
        let cc = ccArray[index];
        index--;

        //set up animation
        clearInterval(id);
        id = setInterval(cardAnimation, 5);

        //create function for animation
        function cardAnimation() {
            //check if position is -1 and finish condition is met
            if (pos == -1 && done) {
                //unlock cards in set
                setLock.set(setid, false);         

                //set cards in set to close
                setStatus.set(setid, "close");

                //finish animation
                clearInterval(id);
            } else {
                //check if card should no longer rotate
                if (!rotate) {
                    //updating styling
                    container.style.transform = "";

                    //set back to true so it won't change again
                    rotate = true;
                }

                //move cards (left or right)
                container.style.left = pos + 'px';
                
                //check if cards has finished one movement
                if (pos == 100) {
                    //reverse movement
                    reverse = true;

                    //flip card
                    cc.classList.toggle("flipped");

                    //move card to back
                    setTimeout(() => {
                        cc.style.zIndex = 0;
                    }, 300);

                }

                //if reverse, decreases position
                if (reverse) {
                    pos--;
                } else {
                    //else increase position
                    pos++;
                }

                //if position is -1 (current card finished movement)
                if (pos == -1) {
                    //move onto next card
                    if (index < containerArray.length && index < length) {
                        container = containerArray[index];
                        cc = ccArray[index];
                    }
                    
                    //reset reverse and rotate values
                    reverse = false;
                    rotate = false;

                    //check if finished iterating through cards
                    if (index == -1) {
                        done = true;
                    } 

                    //move to index of next card
                    index--;
                } 
            }
        }
    } else if (setStatus.get(setid) == "close" && !setLock.get(setid)) {
        //lock set
        setLock.set(setid, true);
        opening = true;             //opening card right now

        //initalize more vairables
        let legnth = cardMap.get(setid).length;
        let container = containerArray[0];
        let cc = ccArray[0];
        let index = 1;

        //set up animation
        clearInterval(id);
        id = setInterval(cardAnimation, 5);

        //create function for animation
        function cardAnimation() {
            //check if position is -1 and finish condition is met
            if (pos == -1 && done) {
                //unlock cards in set
                setLock.set(setid, false);

                //set cards in set to open
                setStatus.set(setid, "open");

                //finish animation
                clearInterval(id);
            } else {
                //move cards (left or right)
                container.style.left = pos + 'px';
                
                //check if cards has finished one movement
                if (pos == 100) {
                    //reverse movement
                    reverse = true;

                    //move card to front
                    cc.style.zIndex = 3;

                    //flip card
                    cc.classList.toggle("flipped");
                }

                //if reverse, decreases position
                if (reverse) {
                    pos--;
                } else {
                    //else increase position
                    pos++;
                }

                //if position is -1 (current card finished movement)
                if (pos == -1) {
                    //rotate cards to set all cards in deck later
                    //cards are rotated in different directions for better look
                    if (index % 2 == 0) {
                        container.style.transform = "rotateY(-180deg) rotate("+ (((4 - index) * 2) + 3) + "deg)";
                    } else {
                        container.style.transform = "rotateY(-180deg) rotate(-"+ (((4 - index) * 2) + 3) + "deg)";
                    }
                    
                    //move onto next card
                    if (index < containerArray.length && index < legnth) {
                        container = containerArray[index];
                        cc = ccArray[index];
                    }
                    

                    //reset reverse
                    reverse = false;

                    //check if finished iterating through cards
                    if (index == legnth) {
                        done = true;
                    } 

                    //move to index of next card
                    index++;
                } 
            }
        }
    } 
}

/**
 * getCards
 * 
 * Update the card in the cardTextArray with the queuestions from
 * the cards in the set, given by setid
 * 
 * @param {*} cardTextArray - the paragraph (cards) that need updating
 * @param {*} setid - id of the set the cards are from
 */
async function getCards(cardTextArray, setid) {
    try { //request from server set information
        //call getCardsHome function
        let response = await fetch('http://localhost:3000/api/getCardsHome?userid='+userid
            +"&setid=" + setid
        );

        //format data with json format
        let data = await response.json();

        cardMap.set(setid, data.data);

        //save datat variable for codeing ease
        let cardArray = data.data;

        //update the text of the cardText
        for (let i = 0; i < cardArray.length; i++) {
            cardTextArray[i].innerHTML = cardArray[i]["question"];
        }


    } catch (error) {
        console.error('Error fetching data:', error);
    }
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
async function start() {
    //iterate through all rows from SQL query (each row is a set)
    for (let i = 0; i < dataArray.length; i++) {
        //save row to info variable (for ease of coding)
        let info = dataArray[i];

        //set up locks and card display status
        folderLock.set(info["set_id"], false);
        setLock.set(info["set_id"], false);
        setStatus.set(info["set_id"], "close");

        //create div container
        let setContainer = document.createElement("div");
        setContainer.classList.add("home-set-container");

        //create 'image' of set
        let setImage = document.createElement("img");
        setImage.classList.add("home-set");
        setImage.src = "images/Folder.png";

        //create cards and containers (for flipping)
        //create a container for all cards
        let allCardContainer =  document.createElement("div");
        allCardContainer.classList.add("card-ccc");

        //create containers for cards (needed to flipping animation)
        let cardContainerOne = document.createElement("div");
        cardContainerOne.classList.add("card-container-container");

        let cardContainerTwo = document.createElement("div");
        cardContainerTwo.classList.add("card-container-container");

        let cardContainerThree = document.createElement("div");
        cardContainerThree.classList.add("card-container-container");

        let cardContainerFour = document.createElement("div");
        cardContainerFour.classList.add("card-container-container");
        
        //create cards
        let cardOne = document.createElement("div");
        cardOne.classList.add("card-container");

        let cardTwo = document.createElement("div");
        cardTwo.classList.add("card-container");

        let cardThree = document.createElement("div");
        cardThree.classList.add("card-container");

        let cardFour = document.createElement("div");
        cardFour.classList.add("card-container");

        //create text for each card
        let cardTextOne = document.createElement("p");
        cardTextOne.classList.add("card");

        let cardTextTwo = document.createElement("p");
        cardTextTwo.classList.add("card");

        let cardTextThree= document.createElement("p");
        cardTextThree.classList.add("card");

        let cardTextFour= document.createElement("p");
        cardTextFour.classList.add("card");

        //add cards' text to card
        cardOne.append(cardTextOne);
        cardTwo.append(cardTextTwo);
        cardThree.append(cardTextThree);
        cardFour.append(cardTextFour);

        //add cards to their containers
        cardContainerOne.append(cardOne);
        cardContainerTwo.append(cardTwo);
        cardContainerThree.append(cardThree);
        cardContainerFour.append(cardFour);

        //add cards containers to all card container
        allCardContainer.append(cardContainerOne);
        allCardContainer.append(cardContainerTwo);
        allCardContainer.append(cardContainerThree);
        allCardContainer.append(cardContainerFour);

        //create arrays for cards and their containers
        let cardTextArray = new Array();
        let cardArray = new Array();
        let cardContainerArray = new Array();

        cardTextArray.push(cardTextOne);
        cardTextArray.push(cardTextTwo);
        cardTextArray.push(cardTextThree);
        cardTextArray.push(cardTextFour);

        //update the card's text
        getCards(cardTextArray, info["set_id"]);

        cardArray.push(cardOne);
        cardArray.push(cardTwo);
        cardArray.push(cardThree);
        cardArray.push(cardFour);

        cardContainerArray.push(cardContainerOne);
        cardContainerArray.push(cardContainerTwo);
        cardContainerArray.push(cardContainerThree);
        cardContainerArray.push(cardContainerFour);

        //HTML for displaying set name
        let setName = document.createElement("p");
        setName.innerHTML = info["set_name"];
        setName.classList.add("name-p");

        //when setname or cards are clicks, display  cards
        setName.addEventListener("click", 
            () => displayCards(cardContainerArray, cardArray, info["set_id"]));
        allCardContainer.addEventListener("click", 
            () => displayCards(cardContainerArray, cardArray, info["set_id"]));


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
        setContainer.append(allCardContainer);
        setContainer.append(setName);
        setContainer.append(progressBarContainer);
        setContainer.append(buttonContainer);
        
        // add setContainer to body of page
        body.append(setContainer);
    }
}

//start homepage
start();