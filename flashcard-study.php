<!DOCTYPE html>
<header>
    <link href="https://fonts.googleapis.com/css2?family=Tirra:wght@400;500;600;700;800;900&family=Varta:wght@300..700&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="styles/learn.css">
</header>
<body>
    <!-- <?php
    session_start();

    // $filepath = "database/".$_SESSION["username"]."/".$_SESSION["set-name"].".txt";
    ?> -->
    <div class="header flex-container">
        <div class="flex-container">
            <h1 id="logo">Logo</h1>

            <h2>Flashcard Learning</h2>
        </div>
        <div class="flex-container">
            <button id="home-button" class="header-button">Home</button>
            <button id="newset-button" 
                class="header-button"
                >
                New Set</button>
            <!-- <button>New Set</button> -->
            <h4 class="username-display">Username: <?php echo $_SESSION['username']."<br>" ?></h4>
            <h4 class="hidden" id="userid"><?php echo $_SESSION['userid'] ?></h4>
            <h4 class="hidden" id="numsets"><?php echo $_SESSION['numsets'] ?></h4>
            <h4 class="hidden" id="setname"><?php echo $_SESSION['setname'] ?></h4>
        </div>
    </div>
    <div class="learning-container">
        <div class="learning-items">
            <input id="random" class="learn-checkbox"
                type="checkbox"  name="random"  value="random">
            <label for="random">Randomize</label>
        </div>

        <div class="learning-items">
            <input id="favorite" class="learn-checkbox"
                type="checkbox"  name="favorite"  value="favorite">
            <label for="favorite">Favorites</label>
        </div>

        <div class="learning-items">
            <p class="dropdown" id="learn-mode">Learn Mode</p>
            <div class="dropdown-content" id="learn-mode-content">
                <form action="">
                    <input id="standard-vs-ranked" class="button"
                        type="button" value="Right/Wrong"><br>

                    <input id="multi" class="learn-checkbox button"
                        type="button"  value="Multiple Choice">

                    <input id="writt-key" class="learn-checkbox button"
                        type="button" name="writt-key" value="Typed">

                </form>
            </div>
        </div>
    </div>
    <!-- <p id="output"></p> -->
    <div class="flip-container spacing" id="center">
        <div class="flipper" id="flashcard">
            <div class="front flashcard-container" id="question">
                <p id="que-text">Question</p>
            </div>
            <div class="back flashcard-container" id="answer">
                <p id="ans-text">Answer</p>
            </div>
        </div>
    </div>
    <div class="flex-container spacing hidden" id="ranked-buttons">
        <button class="learn-button" id="learn-1">1</button>
        <button class="learn-button" id="learn-2">2</button>
        <button class="learn-button" id="learn-3">3</button>
        <button class="learn-button" id="learn-4">4</button>
        <button class="learn-button" id="learn-5">5</button>
    </div>
    <div class="flex-container spacing" id="standard-buttons">
        <button id="correct" class="button">Correct</button>
        <button id="wrong" class="button">Wrong</button>
    </div>
    <div id="multi-buttons" class="hidden">
        <div class="multi-container">
            <button id="multi-1" class="mutli-button button">Choice 1</button>
            <button id="multi-2" class="mutli-button button">Choice 2</button>
        </div>
        <div class="multi-container">
            <button id="multi-3" class="mutli-button button">Choice 3</button>
            <button id="multi-4" class="mutli-button button">Choice 4</button>
        </div>
    </div>
    <div id="right-wrong-container" class="hidden">
        <p id="right-wrong-message"></p>
        <button id="right-wrong-button">Next</button>
    </div>
    <div id="written-buttons" class="flex-container hidden">
        <input id="written-input" type="text">
        <button id="written-button" class="button">Submit</button>
    </div>
    <div id="next-buttons" class="flex-container hidden">
        <button id="next-buttons" class="button">First Look Done</button>
    </div>

    <script src="js-scripts/data-structures.js"></script>
    <script type="module" src="js-scripts/learn.js"></script>
</body>