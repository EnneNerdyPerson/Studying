//------------------------------------------------------------------------------
//Get Set information for studying ---------------------------------------------
//------------------------------------------------------------------------------
//DOM information for getting set infromation
let userid = document.getElementById("username").dataset.userid;
let setname = document.getElementById("username").dataset.setname;

let dataArray;  //variable for storing card data
let setid;      //set_id for set being studied

try {
    //find set_id for set with given set_name and user_id
    let response = await fetch('http://localhost:3000/api/checkSet?set='+setname
        + '&userid=' + userid);
    let data = await response.json();   //format response

    setid = data.data[0]["set_id"];

    //get card info for studying card_id, question, answer, percent, favorite
    response = await fetch('http://localhost:3000/api/getCardsStudy?userid='+userid
        + '&setid=' + setid);
    data = await response.json();   //format response
    dataArray = data.data;

} catch (error) {
    console.error('Error fetching data:', error);
}

//------------------------------------------------------------------------------
//Get varibales from DOM and Create global vairbales ---------------------------
//------------------------------------------------------------------------------
//learn mode enums
const LearnMode = Object.freeze({
    STANDARD: 'standard',
    RANKED: 'ranked',
    MULTIPLE: 'multiple choice',
    WRITTEN: 'written - typed'
});

// Banner Buttons
const homeButton = document.getElementById("home-button");
const newsetButton = document.getElementById("newset-button");

// Mode Buttons
const randomCheck = document.getElementById("random");
const favoriteCheck = document.getElementById("favorite");

//Learn Mode Buttons
const flashcardTypeCheck = document.getElementById("standard-vs-ranked");
const multipleCheck = document.getElementById("multi");
const keyboardCheck = document.getElementById("writt-key");

//Flashcard DOM Elements
const flashcardContainer = document.getElementById("center");

const flashcards = document.getElementById("flashcard");
const question = document.getElementById("question");
const answer = document.getElementById("answer");

const questionText = document.getElementById("que-text");
const answerText = document.getElementById("ans-text");

//Conatiners for buttons
const standardButtons = document.getElementById("standard-buttons");
const rankButtons = document.getElementById("ranked-buttons");
const firstLookButtons = document.getElementById("next-buttons");
const multiButtons = document.getElementById("multi-buttons");
const keyboardButtons = document.getElementById("written-buttons");

//First Look Next Button
const firstLookNext = document.getElementById("next-buttons");

//Rank Buttons
const rankOne = document.getElementById("rank-1");
const rankTwo= document.getElementById("rank-2");
const rankThree = document.getElementById("rank-3");
const rankFour = document.getElementById("rank-4");
const rankFive = document.getElementById("rank-5");

//Standard Learning Correct/Wrong Buttons
const standCorrect = document.getElementById("correct");
const standWrong = document.getElementById("wrong");

//Multiple Choice Buttons
const multiOne = document.getElementById("multi-1");
const multiTwo = document.getElementById("multi-2");
const multiThree = document.getElementById("multi-3");
const multiFour = document.getElementById("multi-4");

//Written Input and Submition Button
const writtenInput = document.getElementById("written-input");
const writenButton = document.getElementById("written-button");

//Right/Wrong Message DOM Elements
const rightWrongContainer = document.getElementById("right-wrong-container");
const rightWrongButton = document.getElementById("right-wrong-button");
const rightWrongMessage = document.getElementById("right-wrong-message");

//Set Up Card Information
const numCards = dataArray.length;

let cardId = [];        //card_id of cards to study (for updating progress)\

let questions = [];     //array of question for each card
let answers = [];       //array of answers for each card
let progressBar = [];   //array of progess of each card
let favArray = [];      //array of favorited cards

//iterate through given SQL statement result saving info
for (let i = 0; i < dataArray.length; i++) {
    let curQuestion = dataArray[i]["question"];
    let curAnswer = dataArray[i]["answer"];
    let curPercent = dataArray[i]["percent"];
    let curFavorite = dataArray[i]["favorite"];

    questions.push(curQuestion);
    answers.push(curAnswer);
    progressBar.push(curPercent);

    if (curFavorite) {
        favArray.push(i);
    } 
}

//create randomizedOrder for cards and favorites
let randomizedOrder = randomizeCards(numCards - 1);
let favRandomOrder = randomizeCards(favArray.length - 1);

//visited card info
let visitedIds = new Array(numCards).fill(false);   //array of if card has been visited
let numVisited = 0;

//create queue for selecting visited cards
let selectQueue = new ProbabilityQueue();

//percents for selecting card
let maxPercent = 31;
let minPercent = 0;

//learn mode values/booleans
let currentLearn = LearnMode.STANDARD;

let randomBool = false;
let favoriteBool = false;

let standardBool = true;
let rankBool = false;
let multipleBool = false;
let keyboardBool = false;

//index/id of cards
let flashcardIndex = -1;
let flashcardId = -1;

//------------------------------------------------------------------------------
//Functions ---------------------------
//------------------------------------------------------------------------------
/**
 * Function for creating array of random values to get new cards to 
 * study. Allows for random order of cards
 * 
 * @param {*} numCards - number of cards to be studied
 * @returns array of ints with indexs of cards in random order
 */
function randomizeCards(numCards) {
  // Create an array containing the range of numbers
  const randomOrder = [];
  for (let i = 0; i <= numCards; i++) {
    randomOrder.push(i);
  }

  // Fisher-Yates Shuffle
  let i = randomOrder.length;

  while (i != 0) {
    //get random index (not i) in array
    const j = Math.floor(Math.random() * (i + 1));

    //flip item at index i to index j and vice versa
    [randomOrder[i], randomOrder[j]] = [randomOrder[j], randomOrder[i]]; 

    i--;
  }

  return randomOrder;
}

/**
 * Show buttons based on the learn mode currently set and 
 * hide all other learn mode buttons
 */
function setLearnMode() {
    //hide all buttons
    standardButtons.classList.add("hidden");
    rankButtons.classList.add("hidden");
    firstLookButtons.classList.add("hidden");
    multiButtons.classList.add("hidden");
    keyboardButtons.classList.add("hidden");

    //if progress is 0, show first look infromation
    if (progressBar[flashcardId] == 0) {
        firstLookButtons.classList.remove("hidden");

    //show standing flashcard learn mode buttons
    } else if (currentLearn == LearnMode.STANDARD) {
        standardButtons.classList.remove("hidden");

    //show ranked flashcard learn mode buttons
    } else if (currentLearn == LearnMode.RANKED) {
        rankButtons.classList.remove("hidden");

    //show multiple choice learn mode buttons
    } else if (currentLearn == LearnMode.MULTIPLE) {
        multiButtons.classList.remove("hidden");

    //show written input learn mode buttons
    } else if (currentLearn == LearnMode.WRITTEN) {
        keyboardButtons.classList.remove("hidden");
    }
}

/**
 * Check and update currentLearn variable, then call
 * setLearnMode() function to show learn mode buttons based
 * on learn mode
 */
function checkLearning() {
    //TODO: fix this since I don't believe it works as intented
    if (standardBool) {
        currentLearn = LearnMode.STANDARD;
    } else if (rankBool) {
        currentLearn = LearnMode.RANKED;
    } else if (multipleBool) {
        currentLearn = LearnMode.MULTIPLE;
    } else if (keyboardBool) {
        currentLearn = LearnMode.WRITTEN;
    } else {
        //if no learn mode is selection, Right/Wrong is default
        currentLearn = LearnMode.STANDARD;
        standardBool = true;
        flashcardTypeCheck.value = "Right/Wrong";
    }

    setLearnMode();
}

/**
 * update the max and min levels for drawing random number to ensure
 * the probability of certain queue selections is updated accordingly
 */
function updateMaxMinLevel() {
    //TODO: double check to ensure this works as needed
    let maxLevel = selectQueue.getMaxLevel();
    let minLevel = selectQueue.getMinLevel();

    if (maxLevel == 2) {
        maxPercent = 57;
    } else if (maxLevel == 3) {
        maxPercent = 78;
    } else if (maxLevel == 4) {
        maxPercent = 96;
    } else if (maxLevel == 5) {
        maxPercent = 100;
    }

    if ((favoriteBool && (favArray.length == numVisited)) || 
      (numCards == numVisited)) {
        if (minLevel == 1) {
            minPercent = 1;
        } else if (minLevel == 2) {
            minPercent = 32;
        } else if (minLevel == 3) {
            minPercent = 58;
        } else if (minLevel == 4) {
            minPercent = 79;
        } else if (minLevel == 5) {
            minPercent = 97;
        }
    }
}

/**
 * Get new id/index for flashcard to study new flashcard with
 */
function updateIds() {
    //save old flashcard id to ensure no duplicate studies
    let oldId = flashcardId;

    //update percent levels
    updateMaxMinLevel();

    //get random number between maxPercent and minPercent
    let randomNumber = Math.max(Math.ceil(Math.random() * maxPercent), minPercent);
    // console.log("randomNumber: " + randomNumber);

    //set num (number of cards that can be studied)
    let num = numCards;
    if (favoriteBool) {
        num = favArray.length;
    }

    //find percent of cards not in a priority queue
    let percentNotQueue = 1 - (numVisited / num);

    //upperbound percent for getting visited or not-visited cards
    let upperBound = Math.floor(percentNotQueue * 31);  

    if ((numVisited == 1) || (randomNumber <= upperBound && numVisited != num))  {
        //pull from visited
        let choosen = false;
        while (!choosen) {
            if (favoriteBool) {
                flashcardIndex = (flashcardIndex + 1) % favArray.length;

                if (randomBool) {
                    flashcardId = favRandomOrder[flashcardIndex];
                } else {
                    flashcardId = favArray[flashcardIndex];
                }
            } else {
                flashcardIndex = (flashcardIndex + 1) % numCards;

                if (randomBool) {
                    flashcardId = randomizedOrder[flashcardIndex];
                } else {
                    flashcardId = flashcardIndex;
                }
            }

            if (!visitedIds[flashcardId]) {
                visitedIds[flashcardId] = true;
                choosen = true;
                numVisited++;
            } 
        }

    } else if (randomNumber <= 31)  {
        //pull from seen queue
        flashcardId = selectQueue.getSeen();
        
    } else if (randomNumber <= 57)  {
        //pull from recognize queue
        flashcardId = selectQueue.getRecognize();
        
        if (flashcardId == -1) {
            flashcardId = selectQueue.getSeen();
        }
        
    } else if (randomNumber <= 78)  {
        //pull from retained queue
        flashcardId = selectQueue.getRetained();

        if (flashcardId == -1) {
            if (minPercent == 1) {
                flashcardId = selectQueue.getSeen();
            } else if (minPercent == 32) {
                flashcardId = selectQueue.getRecognize();
            }
        }
        
    } else if (randomNumber <= 96)  {
        //pull from proficent queue
        flashcardId = selectQueue.getProficent();

        if (flashcardId == -1) {
            if (minPercent == 1) {
                flashcardId = selectQueue.getSeen();
            } else if (minPercent == 32) {
                flashcardId = selectQueue.getRecognize();
            } else if (maxPercent == 100) {
                flashcardId = selectQueue.getMastered();
            } else {
                flashcardId = selectQueue.getRetained();
            }
        }
        
    } else if (randomNumber > 96)  {
        //pull from mastered queue
        flashcardId = selectQueue.getMastered();
        
    }

    // console.log("flashid: " + flashcardId);
    // console.log("oldId: " + oldId);
    // console.log("oldId == flashcardId:" + oldId == flashcardId);
    if (oldId == flashcardId) {
        // console.log("Change!");
        flashcardId = (flashcardId + 1) % num;
    }
    // console.log("flashid: " + flashcardId);
}

/**
 * Based on the progress of a certain card, this function caculates
 * which learn mode to load up (using setLearnMode function)
 * 
 * @param {number} progress 
 */
function calculateLearnMode(progress) {
    //set see card for first time
    if (progress == 0) {
        setLearnMode();
        return;
    }

    //check number of modes active
    let checkNum = standardBool + rankBool + multipleBool + keyboardBool;

    //calculate boundries for change in learn mode
    let boundry = Math.floor(101 / checkNum);

    //claculate whhich level progress is in based on boundry
    let level = Math.ceil(progress / boundry);

    if (level == 3) {
        currentLearn = LearnMode.WRITTEN;
    } else if (level == 2) {
        if (standardBool) {
            currentLearn = LearnMode.MULTIPLE;
        } else if (keyboardBool) {
            currentLearn = LearnMode.WRITTEN;
        } else if (rankBool) {
            currentLearn = LearnMode.WRITTEN;
        }
    } else if (level == 1) {
        //set 'easiest' learn mode, easiest to hardest (unless single mode only)
        // multiple --> card (standard or ranked) --> written
        if (multipleBool) {
            currentLearn = LearnMode.MULTIPLE;
        } else if (standardBool) {
            currentLearn = LearnMode.STANDARD;
        } else if (rankBool) {
            currentLearn = LearnMode.RANKED;
        } else if (keyboardBool) {
            currentLearn = LearnMode.WRITTEN;
        }
    }

    setLearnMode();
}

function updateInQueue(curProgress, newProgress) {
    let progress = progressBar[flashcardId];

    if (progress <= 20) {
        // console.log("addSeen");
        selectQueue.addSeen(flashcardId);
    } else if (progress <= 40) {
        // console.log("addRecognize");
        selectQueue.addRecognize(flashcardId);
    } else if (progress <= 60) {
        // console.log("addRetained");
        selectQueue.addRetained(flashcardId);
    } else if (progress <= 80) {
        // console.log("addProficent");
        selectQueue.addProficent(flashcardId);
    } else if (progress <= 110) {
        // console.log("addMastered");
        selectQueue.addMastered(flashcardId);
    }
}

function multipleChoiceButtonUpdate() {
    let num = numCards;

    if (favoriteBool) {
        num = favArray.length;
    }

    let ranIDOne = Math.ceil((Math.random() * num) + 1) % num;
    let ranIDTwo = (ranIDOne + (Math.ceil(Math.random() * (num - 2)) + 1)) % num;
    let ranIDThree = 0;
    let ranIDFour = 0;

    ranIDThree = Math.ceil((Math.random() * num) + 1) % num;

    if (ranIDOne == ranIDThree) {
        ranIDThree++;
        ranIDThree = ranIDThree % num;
    }

    if (ranIDTwo == ranIDThree) {
        ranIDThree++;
        ranIDThree = ranIDThree % num;
    }

    ranIDFour = Math.ceil((Math.random() * num) + 1) % num;

    if (ranIDOne == ranIDFour) {
        ranIDFour++;
        ranIDFour = ranIDFour % num;
    }

    if (ranIDTwo == ranIDFour) {
        ranIDFour++;
        ranIDFour = ranIDFour % num;
    }

    if (ranIDThree == ranIDFour) {
        ranIDFour++;
        ranIDFour = ranIDFour % num;
    }

    
    multiOne.innerHTML = answers[ranIDOne];
    multiTwo.innerHTML = answers[ranIDTwo];
    multiThree.innerHTML = answers[ranIDThree];
    multiFour.innerHTML = answers[ranIDFour];

    if (ranIDOne != flashcardId &&
        ranIDTwo != flashcardId &&
        ranIDThree != flashcardId &&
        ranIDFour != flashcardId) {
        let randomNum = Math.floor(Math.random() * 4) + 1;
        console.log(randomNum);

        if (randomNum == 1) {
            multiOne.innerHTML = answers[flashcardId];
        } else if (randomNum == 2) {
            multiTwo.innerHTML = answers[flashcardId];
        } else if (randomNum == 3) {
            multiThree.innerHTML = answers[flashcardId];
        } else if (randomNum == 4) {
            multiFour.innerHTML = answers[flashcardId];
        }
    } 
}

function getNewCard() {
    console.log("progress: " + progressBar[flashcardId]);
    //get new flashcard id
    updateIds();

    //update flashcard on website
    questionText.innerHTML = questions[flashcardId];
    answerText.innerHTML = answers[flashcardId];

    //update learn mode
    calculateLearnMode(progressBar[flashcardId]);

    //if multi need to update buttons
    if (currentLearn == LearnMode.MULTIPLE) {
        multipleChoiceButtonUpdate();
    }

    //if rank, update border color, not set neutral
    if (currentLearn == LearnMode.RANKED) {
        // multipleChoiceButtonUpdate();
        let checkNum = standardBool + rankBool + multipleBool + keyboardBool;
        let rank = 0;

        if (checkNum == 1) {
            rank = Math.floor(progressBar[flashcardId] / 20);
        } else if (checkNum == 2) {
            rank = Math.floor(progressBar[flashcardId] / 10) % 5;
        } else if (checkNum == 3) {
            rank = Math.floor(progressBar[flashcardId] / 6) % 5;
        }

        if (progressBar[flashcardId] == 0) {
            flashcards.style.backgroundColor = "#edfaee";
            flashcards.style.background = "radial-gradient(#fff9f5dc, #fff9f5dc, #edfaee)";
        } else if (rank == 5) {
            flashcards.style.backgroundColor = "#5bb0ed";
            flashcards.style.background = "radial-gradient(#fff9f5dc, #fff9f5dc, #5bb0ed)";
        } else if (rank == 4) {
            flashcards.style.backgroundColor = "#7aea92";
            flashcards.style.background = "radial-gradient(#fff9f5dc, #fff9f5dc, #7aea92)";
        } else if (rank == 3) {
            flashcards.style.backgroundColor = "#f0b46e";
            flashcards.style.background = "radial-gradient(#fff9f5dc, #fff9f5dc, #f0b46e)";
        } else if (rank == 2) {
            flashcards.style.backgroundColor = "#f0c76e";
            flashcards.style.background = "radial-gradient(#fff9f5dc, #fff9f5dc, #f0c76e)";
        } else if (rank <= 1) {
            flashcards.style.backgroundColor = "#e96f6b";
            flashcards.style.background = "radial-gradient(#fff9f5dc, #fff9f5dc, #e96f6b)";
        } 
    } else {
        flashcards.style.backgroundColor = "#edfaee";
        flashcards.style.background = "radial-gradient(#fff9f5dc, #fff9f5dc, #edfaee)";
    }
}

function decreaseProgress() {
    let checkNum = standardBool + rankBool + multipleBool + keyboardBool;
    let curProgress = progressBar[flashcardId];

    if (checkNum == 1) {
        progressBar[flashcardId] = Math.max(progressBar[flashcardId] - 20, 1);

    } else if (checkNum == 2) {
        progressBar[flashcardId] = Math.max(progressBar[flashcardId] - 10, 1);

    } else if (checkNum == 3) {
        progressBar[flashcardId] = Math.max(progressBar[flashcardId] - 6, 1);

    }

    //add id to seen queue
    updateInQueue(curProgress, progressBar[flashcardId]);
}

function increaseProgress() {
    let checkNum = standardBool + rankBool + multipleBool + keyboardBool;
    let curProgress = progressBar[flashcardId];

    if (checkNum == 1) {
        progressBar[flashcardId] = Math.min(progressBar[flashcardId] + 20, 101);

    } else if (checkNum == 2) {
        progressBar[flashcardId] = Math.min(progressBar[flashcardId] + 10, 101);

    } else if (checkNum == 3) {
        progressBar[flashcardId] = Math.min(progressBar[flashcardId] + 6, 97);

    }

    //add id to seen queue
    updateInQueue(curProgress, progressBar[flashcardId]);
}

function rankedProgress(rank) {
    let checkNum = standardBool + rankBool + multipleBool + keyboardBool;

    let multiplier = 1;
    let divisor = 1;

    if (checkNum == 1) {
        multiplier = 20;
        divisor = 102;
    } else if (checkNum == 2) {
        multiplier = 10;
        divisor = 52;
    } else if (checkNum == 3) {
        multiplier = 6;
        divisor = 33;
    }

    let progressReset = Math.floor(progressBar[flashcardId] / divisor) + 1;
    let newProgress = (rank * multiplier) + progressReset;

    return newProgress;
}

async function prePageChange() {
    /**
     * File SETUP:
     * numCards,PROGRESS
     * fav:favArray
     * grw:progressBar
     * id,question,answer
     * id,question,answer
     * ...
     */

    let totalProgress = 0;

    const formData = new FormData();
    formData.append("setid", setid);
    formData.append("userid", userid);

    for (let i = 0; i < numCards; i++) {
        if (i < favArray.length) {
            formData.append("favorite[]", favArray[i]);
        }

        if (progressBar[i] > 96) {
            progressBar[i] = 100;
        }

        let string = cardId[i] + "," + progressBar[i];
        formData.append("carddata[]", string);

        totalProgress += Math.min(progressBar[i], 100);
    }

    totalProgress = Math.floor(totalProgress / numCards);
    formData.append("totalprogess", totalProgress);

    try {
        // Send the data via POST request to login-process.php
        const response = await fetch('scripts/save-progress.php', {
            method: 'POST',
            body: formData
        });

        console.log(response);
    } catch (error) {
        //print to console any errors that occur
        console.error('Error sending data:', error);
    }
}

//------------------------------------------------------------------------------
//Event Listeners --------------------------------------------------------------
//------------------------------------------------------------------------------
randomCheck.addEventListener("change", function () {
    if (this.checked) {
        randomBool = true;
    } else {
        randomBool = false;
    }
});
favoriteCheck.addEventListener("change", function () {
    if (this.checked) {
        favoriteBool = true;
    } else {
        favoriteBool = false;
    }
    console.log("changed");
});
multipleCheck.addEventListener("click", function () {
    // console.log("Button CLICK")
    multipleCheck.classList.toggle("on-button");

    if (!multipleBool) {
        multipleBool = true;
    } else {
        multipleBool = false;
    }
    checkLearning();
});
keyboardCheck.addEventListener("click", function () {
    keyboardCheck.classList.toggle("on-button");

    if (!keyboardBool) {
        keyboardBool = true;
    } else {
        keyboardBool = false;
    }
    checkLearning();
});
flashcardTypeCheck.addEventListener("click", function () {
    if (standardBool || rankBool) {
        if (standardBool) {
            standardBool = false;
            rankBool = true;

            flashcardTypeCheck.value = "Ranked";

        } else if (rankBool) {
            rankBool = false;
            standardBool = false;

            flashcardTypeCheck.value = "None";
        }
    } else {
        rankBool = false;
        standardBool = true;

        flashcardTypeCheck.value = "Right/Wrong";
    }

    checkLearning();
});

/***
 * Next button - after seeing the flashcard for the first time
 * move to the next possible card. Should add current care to 
 * the proability queue
 */
firstLookNext.addEventListener("click", function() {
    //update progress to 1
    progressBar[flashcardId]++;

    //add id to seen queue
    updateInQueue(0, 1);
    
    //get new card
    getNewCard();
});

rankOne.addEventListener("click", function() {
    decreaseProgress();
    getNewCard();
});
rankTwo.addEventListener("click", function() {
    let oldProgress = progressBar[flashcardId];
    let newProgress = rankedProgress(2);

    progressBar[flashcardId] = newProgress;

    updateInQueue(oldProgress, progressBar[flashcardId]);
    getNewCard();
});
rankThree.addEventListener("click", function() {
    let oldProgress = progressBar[flashcardId];
    let newProgress = rankedProgress(3);

    progressBar[flashcardId] = newProgress;

    updateInQueue(oldProgress, progressBar[flashcardId]);
    getNewCard();
    
});
rankFour.addEventListener("click", function() {
    let oldProgress = progressBar[flashcardId];
    let newProgress = rankedProgress(4);

    progressBar[flashcardId] = newProgress;

    updateInQueue(oldProgress, progressBar[flashcardId]);
    getNewCard();
});
rankFive.addEventListener("click", function() {
    increaseProgress();
    getNewCard();
});

standWrong.addEventListener("click", function () {
    decreaseProgress();
    getNewCard();
});
standCorrect.addEventListener("click", function() {
    increaseProgress();
    getNewCard();
});


rightWrongButton.addEventListener("click", function() {
    rightWrongContainer.classList.toggle("hidden");
    getNewCard();
});

multiOne.addEventListener("click", function() {
    if (multiOne.innerHTML == answers[flashcardId]) {
        increaseProgress();
        rightWrongMessage.innerHTML = "Correct! Keep going";
    } else {
        decreaseProgress();
        rightWrongMessage.innerHTML = "Nice try, but the answer is " + answers[flashcardId];
    }

    rightWrongContainer.classList.toggle("hidden");

    // getNewCard();
});
multiTwo.addEventListener("click", function() {
    if (multiTwo.innerHTML == answers[flashcardId]) {
        increaseProgress();
        rightWrongMessage.innerHTML = "Correct! You got this";
    } else {
        decreaseProgress();
        rightWrongMessage.innerHTML = "This isn't it. The answer is " + answers[flashcardId];
    }

    rightWrongContainer.classList.toggle("hidden");

    // getNewCard();
});
multiThree.addEventListener("click", function() {
    if (multiThree.innerHTML == answers[flashcardId]) {
        increaseProgress();
        rightWrongMessage.innerHTML = "Correct! Awesome job";
    } else {
        decreaseProgress();
        rightWrongMessage.innerHTML = "Try try again, until you sucess with the correct answer: " + answers[flashcardId];
    }

    rightWrongContainer.classList.toggle("hidden");

    // getNewCard();
});
multiFour.addEventListener("click", function() {
    if (multiFour.innerHTML == answers[flashcardId]) {
        increaseProgress();
        rightWrongMessage.innerHTML = "Correct! You go and get it";
    } else {
        decreaseProgress();
        rightWrongMessage.innerHTML = "Looks like the answer is actually " + answers[flashcardId];
    }

    rightWrongContainer.classList.toggle("hidden");

    // getNewCard();
});
writenButton.addEventListener("click", function() {
    if (writtenInput.value == answers[flashcardId]) {
        increaseProgress();
        rightWrongMessage.innerHTML = "Correct answer! Nice job";
    } else {
        decreaseProgress();
        rightWrongMessage.innerHTML = "Looks like the answer is actually " + answers[flashcardId];
    }

    rightWrongContainer.classList.toggle("hidden");

    // getNewCard();

    writtenInput.value = "";
});


flashcards.addEventListener("click", function () {
    // console.log("click");
    if (currentLearn == LearnMode.STANDARD || progressBar[flashcardId] < 1) {
        const questionStyle = window.getComputedStyle(question);

        const visibility = questionStyle.visibility;
        flashcardContainer.classList.toggle('flipped');
        // answer.classList.toggle('flipped');

        if (visibility == "hidden") {
            setTimeout(() => {
                question.style.visibility = "visible";
                answer.style.visibility = "hidden";
            }, 200);
        } else {
            setTimeout(() => {
                question.style.visibility = "hidden";
                answer.style.visibility = "visible";
            }, 200);
        }
    }
});

homeButton.addEventListener("click", async function() {
    await prePageChange();
    window.location.href = "home.php";
});

newsetButton.addEventListener("click",  async function() {
    await prePageChange();
    window.location.href = "flashcard-make.php";
});

//------------------------------------------------------------------------------

getNewCard();

//TODO: when ranking, need to ensure can flip card