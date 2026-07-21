let userid = document.getElementById("username").dataset.data;
let dataArray;

await fetch('http://localhost:3000/api/homepage?userid='+userid)
    .then(response => response.json())
    .then(data => {
        dataArray = data.data;
    })
    .catch(error => console.error('Error fetching data:', error)
);
      
console.log(dataArray);

let body = document.getElementById("body");


async function editSet(setid) {
    // console.log(button.id);
    let formData = new FormData();
    formData.append("setname", setid);

    try {
        await fetch('scripts/set-setname.php', {
            method: 'POST',
            body: formData
        });

        window.location.href = "flashcard-make.php";
        // console.log("fin");
    } catch (error) {
        //print to console any errors that occur
        console.error('Error sending data:', error);
    }

}

async function studySet(setid) {
    // console.log(button.id);
    let formData = new FormData();
    formData.append("setname", setid);

    try {
        await fetch('scripts/set-setname.php', {
            method: 'POST',
            body: formData
        });

        window.location.href = "flashcard-study.php";
        // console.log("fin");
    } catch (error) {
        //print to console any errors that occur
        console.error('Error sending data:', error);
    }
}

let deletionContainer = document.getElementById("deletion-warning");
let deletionTextWarning = document.getElementById("delete-warn-text");
let yesDeleteButton = document.getElementById("yes-delete");
let noDeleteButton = document.getElementById("no-delete");

noDeleteButton.addEventListener("click", function () {
// function cancelDelete() {
    console.log("DELTE CHANCELD")
    deletionContainer.classList.toggle("hidden");
}
);

let deleteContainer = null;
let deleteSetid = 0;

yesDeleteButton.addEventListener("click", async function () {

// async function deleteSet() {
    console.log(deleteSetid);

    deleteContainer.remove();

    deletionContainer.classList.toggle("hidden");

    try {
        await fetch('http://localhost:3000/api/deleteSet?userid='+userid
            +'&setid='+deleteSetid
        );

    } catch (error) {
        //print to console any errors that occur
        console.error('Error sending data:', error);
    }
}
);

function checkDeleteSet(container, setid, setname) {
    // let setid = button.id;
    console.log(setid);
    console.log(setname);

    deleteContainer = container;
    deleteSetid = setid;

    deletionTextWarning.innerText = "Deletion of set '" + setname  + "' is irreverible";

    deletionContainer.classList.toggle("hidden");

    // yesDeleteButton.addEventListener('click', () => deleteSet(container, setid));;
    // noDeleteButton.addEventListener('click', () => cancelDelete());;

}

// let numQuestions = 
for (let i = 0; i < dataArray.length; i++) {
    console.log(dataArray[i]);
    let info = dataArray[i];
    // let info = dataArray[i].split(",");

    let setContainer = document.createElement("div");
    setContainer.classList.add("home-set-container");

    let setImage = document.createElement("div");
    setImage.classList.add("home-set");

    let progressBarContainer = document.createElement("div");
    progressBarContainer.classList.add("progress-bar-container");

    let progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    progressBar.id = info["set_id"];
    progressBar.style.width = info["progress"] + "%";
    progressBarContainer.append(progressBar);

    let setName = document.createElement("p");
    setName.innerHTML = info["set_name"];

    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("flex-container");

    let editButton = document.createElement("button");
    editButton.innerHTML = "Edit";
    editButton.id = info["set_name"];
    editButton.addEventListener('click', () => editSet(info["set_name"]));;

    let studyButton = document.createElement("button");
    studyButton.innerHTML = "Study";
    studyButton.id = info["set_name"];
    // let studyButton = document.createElement("input");
    // studyButton.type = "button"
    // studyButton.value = "Study"
    studyButton.addEventListener('click', () => studySet(info["set_name"]));;

    let delteButton = document.createElement("button");
    delteButton.innerHTML = "Delete";
    // delteButton.id = info["set_id"];
    delteButton.addEventListener('click', () => checkDeleteSet(setContainer, info["set_id"], info["set_name"]));;

    buttonContainer.append(editButton);
    buttonContainer.append(studyButton);
    buttonContainer.append(delteButton);    
    
    //Add everything to newCardCreation
    setContainer.append(setImage);
    setContainer.append(progressBarContainer);
    setContainer.append(setName);
    setContainer.append(buttonContainer);
    
    // form.appendChild(newCardCreation);
    body.append(setContainer);
}