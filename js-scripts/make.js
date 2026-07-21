let useridElement = document.getElementById("userid");
let setnameElement = document.getElementById("setname");

let userid = useridElement.innerHTML;
let setname = setnameElement.innerHTML;

let setid = -1;;

let makeNew = true;
// let cardSets;
let cardId = [];
let favArray = [];
let questions = [];
let answers = [];

// console.log(setname);
// console.log(setname != "home-page-set-name");

if (setname != "home-page-set-name") {
    try {
        let response = await fetch('http://localhost:3000/api/checkSet?set='+setname+'&userid='+userid);

        let data = await response.json();
        setid = data.data[0]["set_id"];;

        response = await fetch('http://localhost:3000/api/getCardsEdit?userid='+userid+'&setid='+setid);
        data = await response.json();
        
        let cardSets = data.data;

        for (let i = 0; i < cardSets.length; i++) {
            let curId = cardSets[i]["card_id"];
            let curQuestion = cardSets[i]["question"];
            let curAnswer = cardSets[i]["answer"];
            let curFavorite = cardSets[i]["favorite"];

            cardId.push(curId);
            questions.push(curQuestion);
            answers.push(curAnswer);

            if (curFavorite) {
                // console.log("is favorite");
                favArray.push(i);
            } 
        }

        makeNew = false;

    } catch (error) {
        console.error('Error fetching data:', error)
    }

    // await fetch('http://localhost:3000/api/getCardsEdit?userid='+userid+'&setid='+setid)
    //     .then(response => response.json())
    //     .then(data => {
    //         cardSets = data.data;

    //         for (let i = 0; i < cardSets.length; i++) {
    //             let curId = cardSets[i]["card_id"];
    //             let curQuestion = cardSets[i]["question"];
    //             let curAnswer = cardSets[i]["answer"];
    //             let curFavorite = cardSets[i]["favorite"];

    //             cardId.push(curId);
    //             questions.push(curQuestion);
    //             answers.push(curAnswer);

    //             if (curFavorite) {
    //                 // console.log("is favorite");
    //                 favArray.push(i);
    //             } 
    //         }

    //         makeNew = false;
    //     })
    //     .catch(error => console.error('Error fetching data:', error)
    // );
}

//Set Name Script
///Set Name Information
const nameContainer = document.getElementById("name-container");
const setName = document.getElementById("set-name");

let firstName = setName.innerHTML;

const changeName = document.getElementById("change-set-name");
// const setNameElement = document.getElementById("set-name-label");

///Change Set Name Information
const nameChangeContainer = document.getElementById("name-change-container");
const changeNameInput = document.getElementById("set-name-change");
const finChangeName = document.getElementById("save-set-name");

let oldName = changeNameInput.value;

//Form Stuff
const form = document.getElementById("flashcard-maker");

///Show Change Name HTML
changeName.addEventListener("click", function() {
    changeNameInput.value = setName.innerHTML;

    nameContainer.classList.toggle("hidden");
    nameChangeContainer.classList.toggle("hidden");
});

///Save name changes
finChangeName.addEventListener("click", function () {
   // function saveNameChange() {
    console.log("change button made");

    setName.innerHTML = changeNameInput.value;
    // setNameElement.value = changeNameInput.value;

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

function deleteCard(buttonElement) {
    let numOfCard = buttonElement.name;
    deleteStack.push(numOfCard);

    numQuestions--;
    
    const div = document.getElementById(numOfCard);

    div.replaceChildren();
    div.remove();
}

newCardButton.addEventListener("click", function () {
// function newCard() {
    numQuestions++;
    let num = 0;

    if (deleteStack.length != 0) {
        num = deleteStack.pop();    
    } else {
        num = numQuestions;
    }

    // let containerString = "-container-" + numQuestions;
    let textString = "-text-" + num;
    let inputString = "-input-" + num;

    // console.log("new card is made!");
    let newCardCreation = document.createElement("div");
    newCardCreation.classList.add("flex-container");
    newCardCreation.id = num;

    // Question Stuff Creation
    let qContainerDiv = document.createElement("div");
    qContainerDiv.classList.add("flex-item");
    // qContainerDiv.id = "q" + containerString;

    let questionText = document.createElement("label");
    questionText.innerText = "Question";
    questionText.htmlFor = "question[]";
    // "q" + inputString;
    qContainerDiv.append(questionText);

    let questionInput = document.createElement("input");
    questionInput.type = "text";
    questionInput.id = "-1";
    questionInput.name = "question[]";
    // "q" + inputString;
    qContainerDiv.append(questionInput);

    // Answer Stuff Creation
    let aContainerDiv = document.createElement("div");
    aContainerDiv.classList.add("flex-item");
    // aContainerDiv.id = "a" + containerString;

    let answerText = document.createElement("label");
    answerText.innerText = "Answer";
    answerText.htmlFor = "answer[]";
    // "a" + inputString;
    aContainerDiv.append(answerText);

    let answerInput = document.createElement("input");
    answerInput.type = "text";
    // answerInput.id = "a" + textString;
    answerInput.name = "answer[]";
    // "a" + inputString;
    aContainerDiv.append(answerInput);

    //Delete Button Creation
    let buttonDiv = document.createElement("div");
    buttonDiv.classList.add("flex-item");
    buttonDiv.classList.add("button-container");
    buttonDiv.classList.add("flex-container");

    let deleteButton = document.createElement("input");
    deleteButton.type = "button";
    deleteButton.classList.add("button");
    deleteButton.classList.add("delete");
    deleteButton.name = num;
    deleteButton.value = "Delete"
    // deleteButton.onclick = deleteCard();
    deleteButton.addEventListener('click', () => deleteCard(deleteButton));;
    buttonDiv.append(deleteButton);

    //Add everything to newCardCreation
    newCardCreation.append(qContainerDiv);
    newCardCreation.append(aContainerDiv);
    newCardCreation.append(buttonDiv);

    // form.appendChild(newCardCreation);
    buttonContainer.before(newCardCreation);
    // document.body.insertBefore(newCardCreation, finishButton);

    // elementQueue.enqueue(num, questionInput, answerInput);
    // elementQueue.print();
});

// const useridElement = document.getElementById("userid");
const numsetsElement = document.getElementById("numsets");

async function makeSet(formData) {
    let questionInput = formData.getAll("question[]");
    let answerInput = formData.getAll("answer[]");

    // //DOMPurify.sanitize();

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


    // let userid = useridElement.innerHTML;
    let newSetid = (parseInt(numsetsElement.innerHTML, 10) + 1).toString();
    formData.append("numsets", newSetid);
    
    let checkSetResult;

    try {
        let response = await fetch('http://localhost:3000/api/checkSet?set='+setName.innerText+'&userid='+userid);

        let data = await response.json();
        let checkSetResult = data.data;

        if (checkSetResult.length == 0) {
            console.log("No SET FOUND");
            await fetch('http://localhost:3000/api/addSet?userid='+userid
                    +'&setid='+newSetid
                    // +'&setid='+'3'
                    +'&set='+setName.innerText
                );
        } else {
            //TODO: either remove or update so it has useful functionality
            console.log("SET EXISTS");
            newSetid=checkSetResult[0]["set_id"];
        }

        for (let i = 0; i < questionInput.length; i++) {
            console.log("CHECKING");
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
    // console.log(questionIds);
    // console.log(cardId);

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
            // console.log(cardId[i]);
            console.log(questionIds[index]);
            console.log(questionInput[index]);
            console.log(questions[cardId[i]]);

            if (questionInput[index] != questions[cardId[i]] ||
                answerInput[index] != answers[cardId[i]]
            ) {
                // console.log("DIFFERENCE!");
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

    // console.log(index);

    // console.log("Things to be added:");
    for (let i = 0; i < alteredIds.length; i++) {
        let curIndex = alteredIds[i];
        // console.log(questionInput[alteredIds[i]]);
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
        // console.log(questionInput[i]);
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


function start(makeNew) {
    console.log("start!");

    if (!makeNew) {
        console.log("not make new");
        changeNameInput.value = setname;
        setName.innerHTML = changeNameInput.value;


        for (let i = 0; i < questions.length; i++) {
            let num = i + 1;

            let newCardCreation = document.createElement("div");
            newCardCreation.classList.add("flex-container");
            newCardCreation.id = num;

            // Question Stuff Creation
            let qContainerDiv = document.createElement("div");
            qContainerDiv.classList.add("flex-item");

            let questionText = document.createElement("label");
            questionText.innerText = "Question";
            questionText.htmlFor = "question[]";
            qContainerDiv.append(questionText);

            let questionInput = document.createElement("input");
            questionInput.type = "text";
            questionInput.id =  cardId[i];
            questionInput.name = "question[]";
            questionInput.value = questions[i];
            qContainerDiv.append(questionInput);

            // Answer Stuff Creation
            let aContainerDiv = document.createElement("div");
            aContainerDiv.classList.add("flex-item");

            let answerText = document.createElement("label");
            answerText.innerText = "Answer";
            answerText.htmlFor = "answer[]";
            aContainerDiv.append(answerText);

            let answerInput = document.createElement("input");
            answerInput.type = "text";
            // answerInput.id = "a" + textString;
            answerInput.name = "answer[]";
            answerInput.value = answers[i];
            aContainerDiv.append(answerInput);

            //Delete Button Creation
            let buttonDiv = document.createElement("div");
            buttonDiv.classList.add("flex-item");
            buttonDiv.classList.add("button-container");
            buttonDiv.classList.add("flex-container");

            let deleteButton = document.createElement("input");
            deleteButton.type = "button";
            deleteButton.classList.add("button");
            deleteButton.classList.add("delete");
            deleteButton.name = num;
            deleteButton.value = "Delete"
            deleteButton.addEventListener('click', () => deleteCard(deleteButton));;
            buttonDiv.append(deleteButton);

            //Add everything to newCardCreation
            newCardCreation.append(qContainerDiv);
            newCardCreation.append(aContainerDiv);
            newCardCreation.append(buttonDiv);

            // form.appendChild(newCardCreation);
            buttonContainer.before(newCardCreation);
        }

        // for (let i = 0; i < favArray.length; i++ ) {

        // }
    } else {
        console.log("makeone new card");
        let newCardCreation = document.createElement("div");
        newCardCreation.classList.add("flex-container");
        newCardCreation.id = "1";

        // Question Stuff Creation
        let qContainerDiv = document.createElement("div");
        qContainerDiv.classList.add("flex-item");

        let questionText = document.createElement("label");
        questionText.innerText = "Question";
        questionText.htmlFor = "question[]";
        qContainerDiv.append(questionText);

        let questionInput = document.createElement("input");
        questionInput.type = "text";
        questionInput.id = "-1";
        questionInput.name = "question[]";
        qContainerDiv.append(questionInput);

        // Answer Stuff Creation
        let aContainerDiv = document.createElement("div");
        aContainerDiv.classList.add("flex-item");

        let answerText = document.createElement("label");
        answerText.innerText = "Answer";
        answerText.htmlFor = "answer[]";
        aContainerDiv.append(answerText);

        let answerInput = document.createElement("input");
        answerInput.type = "text";
        // answerInput.id = "a" + textString;
        answerInput.name = "answer[]";
        aContainerDiv.append(answerInput);

        //Delete Button Creation
        let buttonDiv = document.createElement("div");
        buttonDiv.classList.add("flex-item");
        buttonDiv.classList.add("button-container");
        buttonDiv.classList.add("flex-container");

        let deleteButton = document.createElement("input");
        deleteButton.type = "button";
        deleteButton.classList.add("button");
        deleteButton.classList.add("delete");
        deleteButton.name = "1";
        deleteButton.value = "Delete"
        deleteButton.addEventListener('click', () => deleteCard(deleteButton));;
        buttonDiv.append(deleteButton);

        //Add everything to newCardCreation
        newCardCreation.append(qContainerDiv);
        newCardCreation.append(aContainerDiv);
        newCardCreation.append(buttonDiv);

        // form.appendChild(newCardCreation);
        buttonContainer.before(newCardCreation);
    }
}

start(makeNew);

//TODO: add functionality to delete set (homepage)
//