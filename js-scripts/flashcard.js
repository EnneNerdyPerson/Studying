// let filepath = document.getElementById("logo").dataset.data;
// filepath = "database/user/test.txt";
// console.log(filepath);

let useridElement = document.getElementById("userid");
let setnameElement = document.getElementById("setname");

let userid = useridElement.innerHTML;
let setname = setnameElement.innerHTML;

let dataArray;
let splitData;

let setid;
await fetch('http://localhost:3000/api/checkSet?set='+setname+'&userid='+userid)
    .then(response => response.json())
    .then(data => {
        setid = data.data[0]["set_id"];
    })
    .catch(error => console.error('Error fetching data:', error)
);

await fetch('http://localhost:3000/api/getCardsStudy?userid='+userid+'&setid='+setid)
    .then(response => response.json())
    .then(data => {
        dataArray = data.data;
        console.log(data);
    })
    .catch(error => console.error('Error fetching data:', error)
);

            
const LearnMode = Object.freeze({
    STANDARD: 'standard',
    RANKED: 'ranked',
    MULTIPLE: 'multiple choice',
    WRITTEN: 'written - typed'
});

function randomizeCards(numCards) {
  // Create an array containing the range of numbers
  const randomOrder = [];
  for (let i = 0; i <= numCards; i++) randomOrder.push(i);

  // Fisher-Yates Shuffle
  let i = randomOrder.length;
  while (i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [randomOrder[i], randomOrder[j]] = [randomOrder[j], randomOrder[i]]; 
  }
  return randomOrder;
}

let randomBool = false;
let favoriteBool = false;

let standardBool = true;
let rankBool = false;
let multipleBool = false;
let keyboardBool = false;
let drawingBool = false;

let flashcardIndex = -1;
let flashcardId = -1;

const randomCheck = document.getElementById("random");
const favoriteCheck = document.getElementById("favorite");

// const standardCheck = document.getElementById("flash-stand");
// const rankCheck = document.getElementById("flash-rank");
const flashcardTypeCheck = document.getElementById("standard-vs-ranked");
const multipleCheck = document.getElementById("multi");
const keyboardCheck = document.getElementById("writt-key");
const drawingCheck = document.getElementById("writt-hand");

const standardButtons = document.getElementById("standard-buttons");
const rankButtons = document.getElementById("ranked-buttons");
const nextButtons = document.getElementById("next-buttons");
const multiButtons = document.getElementById("multi-buttons");
const keyboardButtons = document.getElementById("written-buttons");

const container = document.getElementById("center");

const flashcards = document.getElementById("flashcard");
const question = document.getElementById("question");
const answer = document.getElementById("answer");

const questionText = document.getElementById("que-text");
const answerText = document.getElementById("ans-text");

const learnOne = document.getElementById("learn-1");
const learnTwo= document.getElementById("learn-2");
const learnThree = document.getElementById("learn-3");
const learnFour = document.getElementById("learn-4");
const learnFive = document.getElementById("learn-5");

const next = document.getElementById("next-buttons");

const standCorrect = document.getElementById("correct");
const standWrong = document.getElementById("wrong");

const multiOne = document.getElementById("multi-1");
const multiTwo = document.getElementById("multi-2");
const multiThree = document.getElementById("multi-3");
const multiFour = document.getElementById("multi-4");

const writtenInput = document.getElementById("written-input");
const writenButton = document.getElementById("written-button");

const numCards = dataArray.length;

let cardId = [];
let favArray = [];
let progressBar = [];
let questions = [];
let answers = [];

for (let i = 0; i < dataArray.length; i++) {
    let curId = dataArray[i]["card_id"];
    let curQuestion = dataArray[i]["question"];
    let curAnswer = dataArray[i]["answer"];
    let curPercent = dataArray[i]["percent"];
    let curFavorite = dataArray[i]["favorite"];

    cardId.push(curId);
    questions.push(curQuestion);
    answers.push(curAnswer);
    progressBar.push(curPercent);

    if (curFavorite) {
        favArray.push(i);
    } 
}

let randomizedOrder = randomizeCards(numCards - 1);
let favRandomOrder = randomizeCards(favArray.length - 1);
let visitedIds = new Array(numCards).fill(false);
let numVisited = 0;

// console.log(randomizedOrder);

let selectQueue = new ProbabilityQueue();

//------------------------------------------------------------------------------

if (randomBool) {
    flashcardId = randomizedOrder[flashcardIndex];
}
// standardCheck.checked = true;
let currentLearn = LearnMode.STANDARD;

function setLearnMode() {
    // console.log(flashcardId);
    // console.log(progressBar[flashcardId]);

    standardButtons.classList.add("hidden");
    rankButtons.classList.add("hidden");
    nextButtons.classList.add("hidden");
    multiButtons.classList.add("hidden");
    keyboardButtons.classList.add("hidden");

    if (progressBar[flashcardId] == 0) {
        nextButtons.classList.remove("hidden");

    } else if (currentLearn == LearnMode.STANDARD) {
        standardButtons.classList.remove("hidden");

    } else if (currentLearn == LearnMode.RANKED) {
        rankButtons.classList.remove("hidden");

    } else if (currentLearn == LearnMode.MULTIPLE) {
        multiButtons.classList.remove("hidden");

    } else if (currentLearn == LearnMode.WRITTEN) {
        keyboardButtons.classList.remove("hidden")

    }
}

function checkLearning() {
    if (multipleBool) {
        currentLearn = LearnMode.MULTIPLE;
        setLearnMode();
    } else if (standardBool) {
        //want to keep standard info up
        currentLearn = LearnMode.STANDARD;
        setLearnMode();
    } else if (rankBool) {
        currentLearn = LearnMode.RANKED;
        setLearnMode();
    } else if (keyboardBool) {
        currentLearn = LearnMode.WRITTEN;
        setLearnMode();
    } else {
        currentLearn = LearnMode.STANDARD;
        setLearnMode();
        standardBool = true;
        flashcardTypeCheck.value = "Right/Wrong";
    }
}

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
// standardCheck.addEventListener("change", function () {
//     if (this.checked) {
//         standardBool = true;
//     } else {
//         standardBool = false;
//     }
//     checkLearning();
// });
// rankCheck.addEventListener("change", function () {
//     if (this.checked) {
//         rankBool = true;
//     } else {
//         rankBool = false;
//     }
//     checkLearning();
// });
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
// drawingCheck.addEventListener("change", function () {
//     if (this.checked) {
//         drawingBool = true;
//     } else {
//         drawingBool = false;
//     }
//     console.log("changed");
// });
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


//------------------------------------------------------------------------------

//1-20: 31%
//21-40: 26%
//41-60: 21%
//61-80: 16%
//81-100: 6%

let maxLevel = selectQueue.getMaxLevel();
let minLevel = selectQueue.getMinLevel();
let maxPercent = 31;
let minPercent = 0;

function updateMaxMinLevel() {
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

function updateIds() {
    // console.log("update id");

    let oldId = flashcardId;

    updateMaxMinLevel();
    let randomNumber = Math.max(Math.ceil(Math.random() * maxPercent), minPercent);

    let num = numCards;

    if (favoriteBool) {
        num = favArray.length;
    }

    let percentNotQueue = 1 - (numVisited / num);
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
        // console.log("getSeen");
        flashcardId = selectQueue.getSeen();
        // console.log(flashcardId);
        
    } else if (randomNumber <= 57)  {
        //pull from recognize queue
        // console.log("getRecognize");
        flashcardId = selectQueue.getRecognize();
        
        if (flashcardId == -1) {
            flashcardId = selectQueue.getSeen();
        }
        
    } else if (randomNumber <= 78)  {
        //pull from retained queue
        // console.log("getRetained");
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
        // console.log("getProficent");
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
        // console.log("getMastered");
        flashcardId = selectQueue.getMastered();
        
    }

    if (oldId == flashcardId) {
        flashcardId = (flashcardId + 1) % num;
    }
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

    // console.log("progress: " + progress);

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

/***
 * Next button - after seeing the flashcard for the first time
 * move to the next possible card. Should add current care to 
 * the proability queue
 */
next.addEventListener("click", function() {
    //update progress to 1
    progressBar[flashcardId]++;

    //add id to seen queue
    updateInQueue(0, 1);
    
    //get new card
    getNewCard();
});

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
    // getNewCard();
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
    // getNewCard();
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

learnOne.addEventListener("click", function() {
    decreaseProgress();
    getNewCard();
});
learnTwo.addEventListener("click", function() {
    // decreaseProgress();
    // getNewCard();

    let oldProgress = progressBar[flashcardId];
    let newProgress = rankedProgress(2);

    progressBar[flashcardId] = newProgress;
    // let checkNum = standardBool + rankBool + multipleBool + keyboardBool;


    updateInQueue(oldProgress, progressBar[flashcardId]);
    getNewCard();
});
learnThree.addEventListener("click", function() {
    let oldProgress = progressBar[flashcardId];
    let newProgress = rankedProgress(3);

    progressBar[flashcardId] = newProgress;
    // let checkNum = standardBool + rankBool + multipleBool + keyboardBool;


    updateInQueue(oldProgress, progressBar[flashcardId]);
    getNewCard();
    
});
learnFour.addEventListener("click", function() {
    let oldProgress = progressBar[flashcardId];
    let newProgress = rankedProgress(4);

    progressBar[flashcardId] = newProgress;
    // let checkNum = standardBool + rankBool + multipleBool + keyboardBool;


    updateInQueue(oldProgress, progressBar[flashcardId]);
    getNewCard();
    // increaseProgress();
    // getNewCard();
});
learnFive.addEventListener("click", function() {
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

let rightWrongContainer = document.getElementById("right-wrong-container");
let rightWrongButton = document.getElementById("right-wrong-button");
let rightWrongMessage = document.getElementById("right-wrong-message");

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
        container.classList.toggle('flipped');
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

//------------------------------------------------------------------------------
let homeButton = document.getElementById("home-button");
let newsetButton = document.getElementById("newset-button");

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

        let string = i + "," + progressBar[i];
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