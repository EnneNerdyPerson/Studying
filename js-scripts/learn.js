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

    //based on random number, get different id to study
    if ((numVisited == 1) || (randomNumber <= upperBound && numVisited != num)) {
        //if first card being studied or randomly chosen from random number
        //if all cards have been visited at least once, skip

        //pull from visited
        let choosen = false;

        //loop until a flashcardId has been chosen
        while (!choosen) {
            //if studying favorited cards
            if (favoriteBool) {
                //move to next flashcard
                flashcardIndex = (flashcardIndex + 1) % favArray.length;

                //if randomized
                if (randomBool) {
                    //pull from random order array
                    flashcardId = favArray[favRandomOrder[flashcardIndex]];
                } else {
                    //pull from favArray
                    flashcardId = favArray[flashcardIndex];
                }
            } else {
                //move to next flashcard in index
                flashcardIndex = (flashcardIndex + 1) % numCards;

                //if random
                if (randomBool) {
                    //pull from randomized order
                    flashcardId = randomizedOrder[flashcardIndex];
                } else {
                    //else move to next flashcard
                    flashcardId = flashcardIndex;
                }
            }

            //if card has not been viisted
            if (!visitedIds[flashcardId]) {
                //set visited and choosen to true
                visitedIds[flashcardId] = true;
                choosen = true;

                //increase number of visited cards
                numVisited++;
            } 
        }

    //pull from seen queue (little understanding)
    } else if (randomNumber <= 31)  {
        //pull from seen queue
        flashcardId = selectQueue.getSeen();
        
    //pull from seen recognize (some understanding)
    } else if (randomNumber <= 57)  {
        //pull from recognize queue
        flashcardId = selectQueue.getRecognize();
        
        //if no items in queue, get from seen queue
        if (flashcardId == -1) {
            flashcardId = selectQueue.getSeen();
        }
      
    //pull from seen retained (solid understanding)
    } else if (randomNumber <= 78)  {
        //pull from retained queue
        flashcardId = selectQueue.getRetained();

        //if no items in queue, pull from other queue
        if (flashcardId == -1) {
            if (minPercent == 1) {
                flashcardId = selectQueue.getSeen();
            } else if (minPercent == 32) {
                flashcardId = selectQueue.getRecognize();
            }
        }
        
    //pull from seen proficent (good understanding)
    } else if (randomNumber <= 96)  {
        //pull from proficent queue
        flashcardId = selectQueue.getProficent();

        //if no items in queue, pull from other queue
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
        
    //pull from seen proficent (close to perfect understanding)
    } else if (randomNumber > 96)  {
        //pull from mastered queue
        flashcardId = selectQueue.getMastered();
        
    }

    // console.log("flashid: " + flashcardId);
    // console.log("oldId: " + oldId);
    // console.log("oldId == flashcardId:" + oldId == flashcardId);

    //if id didn't change, move to next card
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

    //level 3 is last learn mode (only possible for written)
    if (level == 3) {
        currentLearn = LearnMode.WRITTEN;
    } else if (level == 2) {
        //level 2 is second learn mode (either multiple or written)
        if (multipleBool) {
            currentLearn = LearnMode.MULTIPLE;
        } else if (keyboardBool) {
            currentLearn = LearnMode.WRITTEN;
        } 

    } else if (level == 1) {
        //set 'easiest' learn mode, easiest to hardest (unless single mode only)
        // multiple --> card (standard or ranked) --> written
        if (standardBool) {
            currentLearn = LearnMode.STANDARD;
        } else if (rankBool) {
            currentLearn = LearnMode.RANKED;
        } else if (multipleBool) {
            currentLearn = LearnMode.MULTIPLE;
        } else if (keyboardBool) {
            currentLearn = LearnMode.WRITTEN;
        }
    }

    //update learn mode (hide/unhide learn mode buttons)
    setLearnMode();
}

/**
 * Add card back into queue based on it's progress
 */
function updateInQueue() {
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

/**
 * Update text for multiple choice buttons, getting random values for each 
 * button.
 */
function multipleChoiceButtonUpdate() {
    let num = numCards;
    if (favoriteBool) {
        num = favArray.length;
    }

    //generate random two random numbers that are not the same
    let randomOne = Math.ceil((Math.random() * num) + 1) % num;
    let randomTwo = (randomOne + (Math.ceil(Math.random() * (num - 2)) + 1)) % num;

    //variables for last two random numbers
    let randomThree = 0;
    let randomFour = 0;

    //generate third random number
    randomThree = Math.ceil((Math.random() * num) + 1) % num;

    //if 1st and 3rd numbers are the same, change 3
    if (randomOne == randomThree) {
        randomThree++;
        randomThree = randomThree % num;
    }

    //if 2nd and 3rd numbers are the same, change 3
    if (randomTwo == randomThree) {
        randomThree++;
        randomThree = randomThree % num;
    }

    //generate 4th random number 
    randomFour = Math.ceil((Math.random() * num) + 1) % num;

    //if 1st and 4th numbers are the same, change 4
    if (randomOne == randomFour) {
        randomFour++;
        randomFour = randomFour % num;
    }

    //if 2nd and 4th numbers are the same, change 4
    if (randomTwo == randomFour) {
        randomFour++;
        randomFour = randomFour % num;
    }

    //if 3rd and 4th numbers are the same, change 4
    if (randomThree == randomFour) {
        randomFour++;
        randomFour = randomFour % num;
    }

    //set multi-buttons to answers associated with random numbers
    multiOne.innerHTML = answers[randomOne];
    multiTwo.innerHTML = answers[randomTwo];
    multiThree.innerHTML = answers[randomThree];
    multiFour.innerHTML = answers[randomFour];

    //check if answer is one of the values
    if (randomOne != flashcardId && randomTwo != flashcardId 
        && randomThree != flashcardId && randomFour != flashcardId) {
        
        //get random num (1 through 4)
        let randomNum = Math.floor(Math.random() * 4) + 1;

        //set random number to answer
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

/**
 * Update stying of flash card based on rank prorgess of flashcard
 */
function rankUpdate() {
    //get number of modes
    let checkNum = standardBool + rankBool + multipleBool + keyboardBool;

    //save rank number
    let rank = 0;

    if (checkNum == 1) {
        rank = Math.floor(progressBar[flashcardId] / 20);
    } else if (checkNum == 2) {
        rank = Math.floor(progressBar[flashcardId] / 10) % 5;
    } else if (checkNum == 3) {
        rank = Math.floor(progressBar[flashcardId] / 6) % 5;
    }

    //update style based on ranked color
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
}

/**
 * Function to get new card infromation, updating the HTML elements
 * as well.
 */
function getNewCard() {
    //debugging, showing progress change
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
        rankUpdate();
    } else {
        //set default color for flashcard
        flashcards.style.backgroundColor = "#edfaee";
        flashcards.style.background = "radial-gradient(#fff9f5dc, #fff9f5dc, #edfaee)";
    }
}

/**
 * decrease progress based on number of learn modes
 */
function decreaseProgress() {
    //get number of learn modes
    let checkNum = standardBool + rankBool + multipleBool + keyboardBool;

    //decrease prorgess based on number of learn modes
    if (checkNum == 1) {
        //decrease by 20 (100 / (5 * 1))
        progressBar[flashcardId] = Math.max(progressBar[flashcardId] - 20, 1);

    } else if (checkNum == 2) {
        //decrease by 10 (100 / (5 * 2))
        progressBar[flashcardId] = Math.max(progressBar[flashcardId] - 10, 1);

    } else if (checkNum == 3) {
        //decrease by 6 (100 / (5 * 3))
        progressBar[flashcardId] = Math.max(progressBar[flashcardId] - 6, 1);

    }

    //add card back into priority queue
    updateInQueue();
}

/**
 * increase progress based on number of learn modes
 */
function increaseProgress() {
    //get number of learn modes
    let checkNum = standardBool + rankBool + multipleBool + keyboardBool;

    //increase prorgess based on number of learn modes
    if (checkNum == 1) {
        //increase by 20 (100 / (5 * 1))
        progressBar[flashcardId] = Math.min(progressBar[flashcardId] + 20, 101);

    } else if (checkNum == 2) {
        //increase by 20 (100 / (5 * 1))
        progressBar[flashcardId] = Math.min(progressBar[flashcardId] + 10, 101);

    } else if (checkNum == 3) {
        //increase by 20 (100 / (5 * 1))
        progressBar[flashcardId] = Math.min(progressBar[flashcardId] + 6, 97);

    }

    //add card back into priority queue
    updateInQueue();
}

/**
 * Change progress based on rank and number of learn modes
 * @param {*} rank 
 * @returns new progess
 */
function rankedProgress(rank) {
    //save number of learn modes
    let checkNum = standardBool + rankBool + multipleBool + keyboardBool;

    let multiplier = 1;
    let divisor = 1;

    //get multiplier and divisor based on learn modes
    if (checkNum == 1) {
        multiplier = 20;    
        divisor = 102;      //rank mode is whole progress bar
    } else if (checkNum == 2) {
        multiplier = 10;
        divisor = 52;       //rank mode exists in half of progress bar
    } else if (checkNum == 3) {
        multiplier = 6;
        divisor = 33;       //rank mode exisits in third of prorgess bar
    }

    //reset progress to lowest value to stay in rank mode
    let progressReset = Math.floor(progressBar[flashcardId] / divisor) + 1;

    //update progress to new value based on rank
    let newProgress = (rank * multiplier) + progressReset;

    return newProgress;
}

/**
 * Before moving to new page, do following setup
 */
async function prePageChange() {
    //save total progress of flashcard set
    let totalProgress = 0;

    //create form data to save progress (php)
    let formData = new FormData();

    //add setid and userid to formdata
    formData.append("setid", setid);
    formData.append("userid", userid);

    //for every card, create form data infromation
    for (let i = 0; i < numCards; i++) {
        //add favorited cards to favorite[] array
        if (i < favArray.length) {
            formData.append("favorite[]", favArray[i]);
        }

        //update progress bar for total progress ease
        if (progressBar[i] > 96) {
            progressBar[i] = 100;
        }

        //create string of card_id,percent for updating percent
        let string = cardId[i] + "," + progressBar[i];

        //save carddata[] to form
        formData.append("carddata[]", string);

        //add progress to total progress
        totalProgress += Math.min(progressBar[i], 100);
    }

    //calculate total progress
    totalProgress = Math.floor(totalProgress / numCards);

    //add total progress to formData
    formData.append("totalprogess", totalProgress);

    //send data to save progress using save-progress.php file
    try {
        // Send the data via POST request to save-process.php
        const response = await fetch('scripts/save-progress.php', {
            method: 'POST',
            body: formData
        });

        // console.log(response);
    } catch (error) {
        //print to console any errors that occur
        console.error('Error sending data:', error);
    }
}

/**
 * Check for multiple choice and written learn mode if choosen/written
 * value is correct or not. After checking, update the rightWrongMessage
 * and make it visible. New card is gotten later, after rightWrongMessage 
 * has been delt with
 * 
 * @param {*} input value to be checked again correct answer
 */
function checkCorrectAnswer(input) {
    //message to inform of correct choice
    let correctMessage = ["Correct! Keep going", "Correct! You got this", "Correct! Awesome job", 
        "Correct! You go and get it", "Correct answer! Nice job"];

    //message to infrom of wrong choice
    let wrongMessage = ["Nice try, but the answer is ", "This isn't it. The answer is ", 
        "Try try again, until you sucess with the correct answer: ", 
        "Try try again, until you succeed with the correct answer: ", 
        "Looks like the answer is actually "];


    //check if input value is correct or not
    if (input == answers[flashcardId]) {
        //increase progress if correct
        increaseProgress();

        //get random correct message to display
        let randomMessageIndex = Math.floor(Math.random() * correctMessage.length);
        rightWrongMessage.innerHTML = correctMessage[randomMessageIndex];
    } else {
        //decrease progress if wrong
        decreaseProgress();

        //get random wrong message to display
        let randomMessageIndex = Math.floor(Math.random() * wrongMessage.length);
        rightWrongMessage.innerHTML = wrongMessage[randomMessageIndex] + answers[flashcardId];
    }

    //unhide right wrong message infromation
    rightWrongContainer.classList.toggle("hidden");
}

//------------------------------------------------------------------------------
//Event Listeners --------------------------------------------------------------
//------------------------------------------------------------------------------

//if randomCheck button is clicked, filp randomBool value
randomCheck.addEventListener("change", function () {
    //filp randomBool
    if (this.checked) {
        randomBool = true;
    } else {
        randomBool = false;
    }
});

//if favoriteCheck button is clicked, filp favoriteBool value
favoriteCheck.addEventListener("change", function () {
    if (this.checked) {
        favoriteBool = true;
    } else {
        favoriteBool = false;
    }
});

//if flashcardTypeCheck button is clicked, flip through flashcard learn values
flashcardTypeCheck.addEventListener("click", function () {
    if (standardBool) {
        //flip to ranked learning
        standardBool = false;
        rankBool = true;

        flashcardTypeCheck.value = "Ranked";

    } else if (rankBool) {
        // flip to no learning 
        // (only if multiple and/or written also choosen)
        rankBool = false;
        standardBool = false;

        flashcardTypeCheck.value = "None";
    } else {
        //flip to standard learning
        rankBool = false;
        standardBool = true;

        flashcardTypeCheck.value = "Right/Wrong";
    }

    //update learn mode buttons
    checkLearning();
});

// if multiple choice learning is selected
multipleCheck.addEventListener("click", function () {
    //style button to show is pressed
    multipleCheck.classList.toggle("on-button");

    //flip multipleBool
    if (!multipleBool) {
        multipleBool = true;
    } else {
        multipleBool = false;
    }

    //update learn mode buttons
    checkLearning();
});

// if written choice learning is selected
keyboardCheck.addEventListener("click", function () {
    //style button to show is pressed
    keyboardCheck.classList.toggle("on-button");

    //flip keyboardBool
    if (!keyboardBool) {
        keyboardBool = true;
    } else {
        keyboardBool = false;
    }

    //update learn mode buttons
    checkLearning();
});

//Flashcard Event Listener -----------------------------------------------------
//When flashcard is clicked, it flips
flashcards.addEventListener("click", function () {
    //check learn mode is correct for flip
    if (currentLearn == LearnMode.STANDARD 
        || currentLearn == LearnMode.RANKED
        || progressBar[flashcardId] < 1) {
        
        //get visibility of flashcard
        const flashcardStyle = window.getComputedStyle(question);
        const visibility = flashcardStyle.visibility;

        //add flipped class to flashcard
        flashcardContainer.classList.toggle("flipped");

        //flip visibility of question and answer with 200ms delay
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

/***
 * Next button - after seeing the flashcard for the first time
 * move to the next possible card. Should add current care to 
 * the proability queue
 */
firstLookNext.addEventListener("click", function() {
    //update progress to 1
    progressBar[flashcardId]++;

    //add id to seen queue
    updateInQueue();
    
    //get new card
    getNewCard();
});

//Rank Buttons Event Listeners ------------------------------------------------
//when rank 1 is pressed, decrease progress, and get new card
rankOne.addEventListener("click", function() {
    //decrease progress (already added to queue)
    decreaseProgress();

    //get new card
    getNewCard();
});

//when rank 2 is pressed, update progress based on ranked progress, 
// and get new card
rankTwo.addEventListener("click", function() {
    //update progress
    progressBar[flashcardId] = rankedProgress(2);

    //add card in queue
    updateInQueue();

    //get new card
    getNewCard();
});

//when rank 3 is pressed, update progress based on ranked progress, 
// and get new card
rankThree.addEventListener("click", function() {
    //update progress
    progressBar[flashcardId] = rankedProgress(3);

    //add card in queue
    updateInQueue();

    //get new card
    getNewCard();
    
});

//when rank 4 is pressed, update progress based on ranked progress, 
// and get new card
rankFour.addEventListener("click", function() {
    //update progress
    progressBar[flashcardId] = rankedProgress(4);

    //add card in queue
    updateInQueue();

    //get new card
    getNewCard();
});

//when rank 5 is pressed, increase progress and get new card
rankFive.addEventListener("click", function() {
    //increase progress (already added to queue)
    increaseProgress();

    //get new card
    getNewCard();
});


//Standard Learning Buttons Event Listeners ------------------------------------
// if standard learning Wrong is pressed, decrease progress
// and get new card
standWrong.addEventListener("click", function () {
    //decrease progress (already added to queue)
    decreaseProgress();

    //get new card
    getNewCard();
});

// if standard learning Correct is pressed, increase progress
// and get new card
standCorrect.addEventListener("click", function() {
    increaseProgress();
    getNewCard();
});

//Multiple Choice Buttons Event Listeners -------------------------------------
//add checkCorrectAnswer function to every multiple choice button event listener
multiOne.addEventListener("click", function() {
    checkCorrectAnswer(this.innerHTML);
});
multiTwo.addEventListener("click", function() {
    checkCorrectAnswer(this.innerHTML);
});
multiThree.addEventListener("click", function() {
    checkCorrectAnswer(this.innerHTML);
});
multiFour.addEventListener("click", function() {
    checkCorrectAnswer(this.innerHTML);
});

//Written Choice Buttons Event Listeners -------------------------------------
//add checkCorrectAnswer function written button, inputing writtenInput vlaue
writenButton.addEventListener("click", function() {
    checkCorrectAnswer(writtenInput.value);

    writtenInput.value = "";
});

// if standard learning Correct is pressed, increase progress
// and get new card
rightWrongButton.addEventListener("click", function() {
    rightWrongContainer.classList.toggle("hidden");
    getNewCard();
});

//when clicking home button, do prePageChange values
homeButton.addEventListener("click", async function() {
    await prePageChange();
    window.location.href = "home.php";
});

//when clicking new set button, do prePageChange values
newsetButton.addEventListener("click",  async function() {
    await prePageChange();
    window.location.href = "flashcard-make.php";
});

//------------------------------------------------------------------------------
getNewCard();

//TODO: flip question side first when getting new card