//------------------------------------------------------------------------------
//Get Set information for editing ----------------------------------------------
//------------------------------------------------------------------------------
//DOM information for getting set infromation
let userid = document.getElementById("username").dataset.userid;
let setname = document.getElementById("username").dataset.setname;
let numsets = document.getElementById("username").dataset.numsets;

let setid = -1;;
let makeNew = true;     //if makeing new set, is true, else false

//arrays for set infromation
let cardId = [];
let questions = [];
let answers = [];
let favArray = [];      //for later (TODO: add favorite functionality)

//if setname is home-page-set-name then is editing set
if (setname != "home-page-set-name") {
    try {
        //get set_id for set with set_name = setname and user_id = userid
        let response = await fetch('http://localhost:3000/api/checkSet?set='+setname
            + '&userid=' + userid);
        let data = await response.json();  //format response

        //set given setid
        setid = data.data[0]["set_id"];;

        //get card infromation for editing
        response = await fetch('http://localhost:3000/api/getCardsEdit?userid='+userid
            + '&setid=' + setid);
        data = await response.json();  //format response
        
        //save card info for easy coding
        let cardSets = data.data;

        //iterate through all cards in set to save in arrays
        for (let i = 0; i < cardSets.length; i++) {
            let curId = cardSets[i]["card_id"];         //save card_id
            let curQuestion = cardSets[i]["question"];  //save question
            let curAnswer = cardSets[i]["answer"];      //save answer
            let curFavorite = cardSets[i]["favorite"];  //save favorite

            //add information to arrays
            cardId.push(curId);
            questions.push(curQuestion);
            answers.push(curAnswer);

            if (curFavorite) {
                // console.log("is favorite");
                favArray.push(i);
            } 
        }

        //since no errors occured, set makeNew to false
        makeNew = false;

    } catch (error) {
        console.error('Error fetching data:', error)
    }
}

//------------------------------------------------------------------------------
//Get varibales from DOM and Create global vairbales ---------------------------
//------------------------------------------------------------------------------
//Set Name Script
///Set Name Information
const nameContainer = document.getElementById("name-container");
const setNameElement = document.getElementById("set-name");

///Change Set Name Information
const changeName = document.getElementById("change-set-name");
const nameChangeContainer = document.getElementById("name-change-container");
const changeNameInput = document.getElementById("set-name-change");
const finChangeName = document.getElementById("save-set-name");

//Form 
const form = document.getElementById("flashcard-maker");

//Buttons
const buttonContainer = document.getElementById("button-container");
const newCardButton = document.getElementById("new-card");
const finishButton = document.getElementById("finish");

//global variables
let oldName = changeNameInput.value;

let deleteStack = [];   //stack of deleted nums (to be reused when new card is made)

let numCards = 1;   //number of cards
if (!makeNew) {
    //if editing, the update number of cards
    numCards = questions.length;
}

//------------------------------------------------------------------------------
//Functions ---------------------------
//------------------------------------------------------------------------------
/**
 * Delete HTML elements for associated card
 * 
 * @param {*} numOfCard - HTML id of card to be deleted 
 */
function deleteCard(numOfCard) {
    //save HTML id to be used for new card
    deleteStack.push(numOfCard);

    //decrease number of cards
    numCards--;
    
    //remove HTML elements associated with card to be removed
    const div = document.getElementById(numOfCard);
    div.remove();
}

/**
 * Create HTML elements for new card with HTML id = num and id = card_id
 * (only for editing existing cards)
 * 
 * @param {*} num - number of cards
 * @param {*} id - id for card (relevent only when editing)
 * @param {*} questionValue - value of questionInput for card
 * @param {*} answerValue - value of answerInput for card
 */
function newCard(num, id, questionValue, answerValue) {
    //create new card container
    let newCardCreation = document.createElement("div");
    newCardCreation.classList.add("flex-container");
    newCardCreation.id = num;       //used for card deletion


    // Question Creation
    let qContainerDiv = document.createElement("div");
    qContainerDiv.classList.add("card-item");

    //question label
    let questionLabel = document.createElement("label");
    questionLabel.innerText = "Question";
    questionLabel.htmlFor = "question[]";
    qContainerDiv.append(questionLabel);

    //question input
    let questionInput = document.createElement("input");
    questionInput.type = "text";
    questionInput.name = "question[]";      //question form data array
    questionInput.id = id;                  //card_id for question
    questionInput.value = questionValue;
    qContainerDiv.append(questionInput);


    // Answer Creation
    let aContainerDiv = document.createElement("div");
    aContainerDiv.classList.add("card-item");

    //answer label
    let answerText = document.createElement("label");
    answerText.innerText = "Answer";
    answerText.htmlFor = "answer[]";
    aContainerDiv.append(answerText);

    //answer input
    let answerInput = document.createElement("input");
    answerInput.type = "text";
    answerInput.name = "answer[]";      //answer form data array
    answerInput.id = id;                //card_id for question
    answerInput.value = answerValue;
    aContainerDiv.append(answerInput);


    //Delete Button Creation
    let buttonDiv = document.createElement("div");
    buttonDiv.classList.add("card-item");
    buttonDiv.classList.add("button-container");
    buttonDiv.classList.add("flex-container");

    //create delete button
    let deleteButton = document.createElement("input");
    //add classes to delete button
    deleteButton.classList.add("button");
    deleteButton.classList.add("delete-button");
    //add type, value, name to delete button
    deleteButton.type = "button";
    deleteButton.value = "Delete"
    // deleteButton.name = num;
    //add onclick function
    deleteButton.addEventListener('click', 
        () => deleteCard(num));
    
    buttonDiv.append(deleteButton);


    //Add everything to newCardCreation
    newCardCreation.append(qContainerDiv);
    newCardCreation.append(aContainerDiv);
    newCardCreation.append(buttonDiv);

    //add all values to body
    buttonContainer.before(newCardCreation);
}

/**
 * makeSet
 * When creating a new set, check for empty inputs. If nothign is empty then
 * create new set in SQL database and add all cards to SQL database
 * 
 * @param {*} formData - form data with card infromation
 */
async function makeSet(formData) {
    //get array of question and answer inputs from formData
    let questionInput = formData.getAll("question[]");
    let answerInput = formData.getAll("answer[]");

    //TODO: add error message if any question or answer input is blank
    if (answerInput.length != questionInput.length) {
        return;
    }

    //if input is empty string, do not save set
    for (let i of questionInput) {
        if (i == "") {
            return;
        }
    }
    for (let i of answerInput) {
        if (i == "") {
            return;
        }
    }

    //get set_id for a new set
    let newSetid = (parseInt(numsets, 10) + 1).toString();
    let setname = setNameElement.innerText;
    formData.append("numsets", newSetid);

    try {
        //add new set for user with userid, setid, and setname
        await fetch('http://localhost:3000/api/addSet?userid='+userid
            +'&setid='+newSetid
            +'&set='+setname
        );

        //for every question/answer input, create/add card
        for (let i = 0; i < questionInput.length; i++) {
            //add card for each question/answer input information
            await fetch('http://localhost:3000/api/addCard?userid='+userid
                    +'&setid='+newSetid
                    +'&cardid='+i
                    +'&question='+questionInput[i]
                    +'&answer='+answerInput[i]
            );
        }

        //run make-process php file for updating session info
        await fetch('scripts/make-process.php', {
            method: 'POST',
            body: formData
        });
    } catch (error) {
        //print to console any errors that occur
        console.error('Error sending data:', error);
    }
}

/**
 * editSet
 * 
 * Validate some infromation to edit set infromation. If validation is met, update
 * information in SQL database - delete deleted card, update question or answer 
 * infromation, and add newly created cards
 *
 * @param {*} formData - form data with card infromation
 * @returns 
 */
async function editSet(formData) {
    //card_id for each HTML card element
    let cardElementIds = Array.from(document.getElementsByName('question[]')).map(question => question.id);

    //question and answer input information
    let questionInput = formData.getAll("question[]");
    let answerInput = formData.getAll("answer[]");

    //if input is empty string, do not save set
    for (let i of questionInput) {
        if (i == "") {
            return;
        }
    }
    for (let i of answerInput) {
        if (i == "") {
            return;
        }
    }

    let alteredIds = [];        //card_ids of cards that were changed
    let missingIdStack = [];    //card_ids of cards that were deleted (for reuse)

    let index = 0;      //index of cardElementIds and index of first new card (no card_id)

    //iterate through cardIds to check if there is change
    for (let i = 0; i < cardId.length; i++) {
        //if cardElementId is "-1", then this is new card
        if (cardElementIds[index] == "-1") {
            break;

        //check if card with card_id has been edited
        } else if (cardId[i] == cardElementIds[index]) {
            //check for question or answer change
            if (questionInput[index] != questions[cardId[i]] || answerInput[index] != answers[cardId[i]] ) {
                //if changed, add to aleterdIds
                alteredIds.push(index);
            }
            
            //increase index
            index++;

        //if card_id is not found
        } else {
            //add card_id to missingIdStack
            missingIdStack.push(cardId[i]);

            //delete card from SQL database
            try {
                await fetch('http://localhost:3000/api/deleteCard?userid='+userid
                        +'&setid='+setid
                        +'&cardid='+cardId[i]
                );
            } catch (error) {
                //print to console any errors that occur
                console.error('Error sending data:', error);
            }
        }
    }

    //for cards with card_id that were altered, update in SQL database
    for (let i = 0; i < alteredIds.length; i++) {
        //save current id
        let curIndex = alteredIds[i];

        //update question and answer for card in SQL database
        try {
            await fetch('http://localhost:3000/api/updateCardQA?userid='+userid
                    +'&setid='+setid
                    +'&cardid='+cardElementIds[curIndex]
                    +'&question='+questionInput[i]
                    +'&answer='+answerInput[i]
            );
        } catch (error) {
            //print to console any errors that occur
            console.error('Error sending data:', error);
        }
    }

    let curCardId = index;     //for reusing card_ids (so numbers aren't too high)

    //for all cards without card_id (new cards)
    for (let i = index; i < questionInput.length; i++) {
        let cardId = curCardId;

        if (missingIdStack.length != 0) {
            //reuse deleted card's card_id
            cardId = missingIdStack.pop();
        } else {
            //else get new card_id
            curCardId++;
        }

        //create new card with given information
        try {
            await fetch('http://localhost:3000/api/addCard?userid='+userid
                    +'&setid='+setid
                    +'&cardid='+cardId
                    +'&question='+questionInput[i]
                    +'&answer='+answerInput[i]
            );
        } catch (error) {
            //print to console any errors that occur
            console.error('Error sending data:', error);
        }
    }
}

//------------------------------------------------------------------------------
//Event Listeners --------------------------------------------------------------
//------------------------------------------------------------------------------

//Show Change Name HTML when changeName butt is clicked
changeName.addEventListener("click", function() {
    //update changeNameInput to current setname
    changeNameInput.value = setNameElement.innerHTML;

    //hide name and show nameChange information
    nameContainer.classList.toggle("hidden");
    nameChangeContainer.classList.toggle("hidden");
});

//Save name changes when finChangeName button is clicked
finChangeName.addEventListener("click", function () {
    //update setName element to new name
    setNameElement.innerHTML = changeNameInput.value;

    //if there was a name change and not making new set
    if ((!makeNew) && (oldName != changeNameInput.value)) {
        //update setname in database
        try {
            fetch('http://localhost:3000/api/updateSetName?setname='+setNameElement.innerHTML
                + '&userid=' + userid
                + '&setid=' + setid);

        } catch (error) {
            //print to console any errors that occur
            console.error('Error sending data:', error);
        }
    }

    //set setname and hide name change elements
    nameContainer.classList.toggle("hidden");
    nameChangeContainer.classList.toggle("hidden");
});

//when newCard button is pressed, add new card HTML elements
newCardButton.addEventListener("click", function () {
    numCards++;     //increase number of cards count
    let num = 0;    //num for HTML id value

    if (deleteStack.length != 0) {
        //reuse previously deleted HTML ids
        num = deleteStack.pop();    
    } else {
        //use numCards has HTML id
        num = numCards;
    }

    //create new card HTML elements with newCard function
    newCard(num, "-1", "", "");
});

//when form is submited, either make or edit set, then go to study page
form.addEventListener("submit", async function() {
    // Stop the form from submitting normally and reloading
    event.preventDefault(); 

    //for debugging
    console.log("finish button click!");

    //save form data to be used for checks and php files
    const formData = new FormData(this);    //formatting from data

    //check if making new set or editing current set
    if (makeNew) {
        //wait for makeSet function to finish
        await makeSet(formData);
    } else {
        //wait for editSet function to finish
        await editSet(formData);
    }
    
    //move to study page
    window.location.href = "flashcard-study.php";
});

//------------------------------------------------------------------------------
//Start function ---------------------------------------------------------------
//------------------------------------------------------------------------------
//Start function to start the page
function start(makeNew) {
    //check if creating new set or editing current set
    if (makeNew) {
        //create sigle card with no card_id
        newCard("1", "-1", "", "");
    } else {
        //update setname based on set being edited
        changeNameInput.value = setname;
        setNameElement.innerHTML = changeNameInput.value;

        //for ever card in set, create new card HTML elements
        for (let i = 0; i < questions.length; i++) {
            //HTML id = i + 1, card_id = cardId[i]
            //populates question and answer input with card's question and answer info
            newCard(i + 1, cardId[i], questions[i], answers[i]);
        }
    }
}

//start page
start(makeNew);