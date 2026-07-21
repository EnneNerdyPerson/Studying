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
const setName = document.getElementById("set-name");

let firstName = setName.innerHTML;

const changeName = document.getElementById("change-set-name");

///Change Set Name Information
const nameChangeContainer = document.getElementById("name-change-container");
const changeNameInput = document.getElementById("set-name-change");
const finChangeName = document.getElementById("save-set-name");

let oldName = changeNameInput.value;

//Form Stuff
const form = document.getElementById("flashcard-maker");

//Flashcard editing script
const newCardButton = document.getElementById("new-card");
const finishButton = document.getElementById("finish");

const buttonContainer = document.getElementById("button-container");

const firstQ = document.getElementById("q-text-1");
const firstA = document.getElementById("a-text-1");

let numQuestions = 0;
if (makeNew) {
    numQuestions = 1;
} else {
    numQuestions = questions.length;
}

let deleteStack = [];

//------------------------------------------------------------------------------
//Functions ---------------------------
//------------------------------------------------------------------------------
function newCard(num, id, questionValue, answerValue) {
    let newCardCreation = document.createElement("div");
    newCardCreation.classList.add("flex-container");
    newCardCreation.id = num;

    // Question Stuff Creation
    let qContainerDiv = document.createElement("div");
    qContainerDiv.classList.add("card-item");

    let questionText = document.createElement("label");
    questionText.innerText = "Question";
    questionText.htmlFor = "question[]";
    qContainerDiv.append(questionText);

    let questionInput = document.createElement("input");
    questionInput.type = "text";
    questionInput.id = id;
    questionInput.name = "question[]";
    questionInput.value = questionValue;
    qContainerDiv.append(questionInput);

    // Answer Stuff Creation
    let aContainerDiv = document.createElement("div");
    aContainerDiv.classList.add("card-item");

    let answerText = document.createElement("label");
    answerText.innerText = "Answer";
    answerText.htmlFor = "answer[]";
    aContainerDiv.append(answerText);

    let answerInput = document.createElement("input");
    answerInput.type = "text";
    answerInput.name = "answer[]";
    answerInput.value = answerValue;
    aContainerDiv.append(answerInput);

    //Delete Button Creation
    let buttonDiv = document.createElement("div");
    buttonDiv.classList.add("card-item");
    buttonDiv.classList.add("button-container");
    buttonDiv.classList.add("flex-container");

    let deleteButton = document.createElement("input");
    deleteButton.type = "button";
    deleteButton.classList.add("button");
    deleteButton.classList.add("delete-button");
    deleteButton.name = num;
    deleteButton.value = "Delete"
    deleteButton.addEventListener('click', () => deleteCard(deleteButton));;
    buttonDiv.append(deleteButton);

    //Add everything to newCardCreation
    newCardCreation.append(qContainerDiv);
    newCardCreation.append(aContainerDiv);
    newCardCreation.append(buttonDiv);

    buttonContainer.before(newCardCreation);
}

function deleteCard(buttonElement) {
    let numOfCard = buttonElement.name;
    deleteStack.push(numOfCard);

    numQuestions--;
    
    const div = document.getElementById(numOfCard);

    div.replaceChildren();
    div.remove();
}

async function makeSet(formData) {
    let questionInput = formData.getAll("question[]");
    let answerInput = formData.getAll("answer[]");

    //TODO: add error message if any question or answer input is blank
    if (answerInput.length != questionInput.length) {
        return;
    }

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

    let newSetid = (parseInt(numsets, 10) + 1).toString();
    formData.append("numsets", newSetid);
    
    let checkSetResult;

    try {
        let response = await fetch('http://localhost:3000/api/checkSet?set='+setName.innerText+'&userid='+userid);

        let data = await response.json();
        let checkSetResult = data.data;

        if (checkSetResult.length == 0) {
            // console.log("No SET FOUND");
            await fetch('http://localhost:3000/api/addSet?userid='+userid
                    +'&setid='+newSetid
                    // +'&setid='+'3'
                    +'&set='+setName.innerText
                );
        } else {
            //TODO: either remove or update so it has useful functionality
            // console.log("SET EXISTS");
            newSetid=checkSetResult[0]["set_id"];
        }

        for (let i = 0; i < questionInput.length; i++) {
            await fetch('http://localhost:3000/api/addCard?userid='+userid
                    +'&setid='+newSetid
                    +'&cardid='+i
                    +'&question='+questionInput[i]
                    +'&answer='+answerInput[i]
            );
        }

        await fetch('scripts/make-process.php', {
            method: 'POST',
            body: formData
        });
    } catch (error) {
        //print to console any errors that occur
        console.error('Error sending data:', error);
    }
}

async function editSet(formData) {
    let questionIds = Array.from(document.getElementsByName('question[]')).map(question => question.id);


    let questionInput = formData.getAll("question[]");
    let answerInput = formData.getAll("answer[]");

    if (answerInput.length != questionInput.length) {
        return;
    }

    let alteredIds = [];
    let questionClean = [];
    let index = 0;
    let minCheck = 0;
    let maxId = 0;

    let missingIdStack = [];

    for (let i = 0; i < cardId.length; i++) {
        if (questionIds[index] == "-1") {
            break;
        } else if (cardId[i] == questionIds[index]) {
            console.log(questionIds[index]);
            console.log(questionInput[index]);
            console.log(questions[cardId[i]]);

            if (questionInput[index] != questions[cardId[i]] ||
                answerInput[index] != answers[cardId[i]]
            ) {
                alteredIds.push(index);
            }
            
            index++;
        } else {
            missingIdStack.push(cardId[i]);

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

    for (let i = 0; i < alteredIds.length; i++) {
        let curIndex = alteredIds[i];

        if (questionInput[curIndex] == "") {
            return;
        } else if (answerInput[curIndex] == "") {
            return;
        }

        try {
            await fetch('http://localhost:3000/api/updateCardQA?userid='+userid
                    +'&setid='+setid
                    +'&cardid='+questionIds[curIndex]
                    +'&question='+questionInput[i]
                    +'&answer='+answerInput[i]
            );
        } catch (error) {
            //print to console any errors that occur
            console.error('Error sending data:', error);
        }
    }


    for (let i = index; i < questionInput.length; i++) {

        if (questionInput[i] == "") {
            return;
        } else if (answerInput[i] == "") {
            return;
        }

        let cardId = 0;

        if (missingIdStack.length != 0) {
            cardId = missingIdStack.pop();
        } else {
            cardId = i;
        }

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
//Event Listeners ---------------------------
//------------------------------------------------------------------------------
///Show Change Name HTML
changeName.addEventListener("click", function() {
    changeNameInput.value = setName.innerHTML;

    nameContainer.classList.toggle("hidden");
    nameChangeContainer.classList.toggle("hidden");
});

///Save name changes
finChangeName.addEventListener("click", function () {
    console.log("change button made");

    setName.innerHTML = changeNameInput.value;

    if ((!makeNew) && (oldName != changeNameInput.value)) {
        try {
            fetch('http://localhost:3000/api/updateSetName?setname='+setName.innerHTML+'&userid='+userid+'&setid='+setid);

        } catch (error) {
            //print to console any errors that occur
            console.error('Error sending data:', error);
        }
    }

    nameContainer.classList.toggle("hidden");
    nameChangeContainer.classList.toggle("hidden");
});

newCardButton.addEventListener("click", function () {
    numQuestions++;
    let num = 0;

    if (deleteStack.length != 0) {
        num = deleteStack.pop();    
    } else {
        num = numQuestions;
    }

    newCard(num, "-1", "", "");
});

form.addEventListener("submit", async function() {
    // Stop the form from submitting normally and reloading
    event.preventDefault(); 
    console.log("finish button click!");

    const formData = new FormData(this);    //formatting from data
    if (makeNew) {
        await makeSet(formData);
    } else {
        await editSet(formData);
    }
    
    console.log("finish button click 2!");
    window.location.href = "flashcard-study.php";
});

//------------------------------------------------------------------------------
//Start function ---------------------------
//------------------------------------------------------------------------------
function start(makeNew) {
    if (makeNew) {
        newCard("1", "-1", "", "");
    } else {
        changeNameInput.value = setname;
        setName.innerHTML = changeNameInput.value;

        for (let i = 0; i < questions.length; i++) {
            let num = i + 1;

            newCard(num, cardId[i], questions[i], answers[i]);
        }
    }
}

start(makeNew);