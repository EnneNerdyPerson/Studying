<!DOCTYPE html>
<!--Page for studying flashcard sets-->
<header>
    <link href="https://fonts.googleapis.com/css2?family=Tirra:wght@400;500;600;700;800;900&family=Varta:wght@300..700&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="styles/learn.css">
</header>
<html>
<body>
    <?php
        //start session  
        session_start();
    ?>

    <!-- Banner header -->
    <div class="header flex-container">
        <!--Logo and Website Name-->
        <div class="flex-container">
            <h1 id="logo">Logo</h1>
            <h2>Flashcard Learning</h2>
        </div>

        <!--Buttons for banner header-->
        <div class="flex-container">
            <!--Button for going back to homepage-->
            <button id="home-button" 
                class="header-button">
                Home
            </button>

            <!--Button for creating new set-->
            <button id="newset-button" 
                class="header-button">
                New Set
            </button>
            
            <!--User name display-->
            <h4 id="username"
                class="username-display"
                data-userid="<?php echo htmlspecialchars($_SESSION['userid']) ?>"
                data-setname="<?php echo htmlspecialchars($_SESSION['setname']) ?>"
                >Username: <?php echo $_SESSION['username']."<br>" ?>
            </h4>
            <h4 class="hidden" id="userid"><?php echo $_SESSION['userid'] ?></h4>
            <h4 class="hidden" id="setname"><?php echo $_SESSION['setname'] ?></h4>
        </div>
    </div>

    <!-- Learning Settings -->
    <div class="learning-container">
        <!--Randomize Check: randomize order of flashcards-->
        <div class="learning-items">
            <input id="random" class="learn-checkbox"
                type="checkbox"  name="random"  value="random">
            <label for="random">Randomize</label>
        </div>

        <!--Favorite Check: only study favorited cards-->
        <div class="learning-items">
            <input id="favorite" class="learn-checkbox"
                type="checkbox"  name="favorite"  value="favorite">
            <label for="favorite">Favorites</label>
        </div>

        <!--Learn Modes Contianer-->
        <div class="learning-items">
            <!--Dropdown for learn modes: hover to change learn modes-->
            <p class="dropdown" id="learn-mode">Learn Mode</p>

            <!--Dropdown content of different learn modes-->
            <div class="dropdown-content" id="learn-mode-content">
                <!--Flashcard Learn Style: 
                    Right/Wrong: labeling flashcard as correct or not
                    Rank: ranking understanding of flashcard 1-5 
                    None: don't use flashcards when studying-->
                <input id="standard-vs-ranked" class="button"
                    type="button" value="Right/Wrong">

                <!--Use multiple choice options when studying-->
                <input id="multi" class="button"
                    type="button"  value="Multiple Choice">

                <!--Use written input when studying-->
                <input id="writt-key" class="button"
                    type="button" name="writt-key" value="Typed">
            </div>
        </div>
    </div>

    <!--Flashcard Elemments-->
    <div id="center" class="flip-container spacing">
        <div id="flashcard" class="flipper">
            <!--Question of Flashcard (front)-->
            <div id="question" class="front flashcard-container">
                <p id="que-text">Question</p>
            </div>

            <!--Answer of Flashcard (back)-->
            <div id="answer" class="back flashcard-container">
                <p id="ans-text">Answer</p>
            </div>
        </div>
    </div>

    <!--Ranking Buttons-->
    <div id="ranked-buttons" class="flex-container spacing hidden">
        <button id="rank-1" class="learn-button">1</button>
        <button id="rank-2" class="learn-button">2</button>
        <button id="rank-3" class="learn-button">3</button>
        <button id="rank-4" class="learn-button">4</button>
        <button id="rank-5" class="learn-button">5</button>
    </div>

    <!--Right/Wrong Buttons-->
    <div id="standard-buttons" class="flex-container spacing">
        <button id="correct" class="button">Correct</button>
        <button id="wrong" class="button">Wrong</button>
    </div>

    <!--Multiple Choice Buttons-->
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

    <!--Message for Correct/Inccorect Learning:
        Tells user if multiple choice button or written response is correct.
        If not correct, lets user know correct response-->
    <div id="right-wrong-container" class="hidden">
        <p id="right-wrong-message"></p>
        <button id="right-wrong-button">
            Next
        </button>
    </div>

    <!--Written Buttons: for written response learning-->
    <div id="written-buttons" class="flex-container hidden">
        <input id="written-input" type="text">
        <button id="written-button" class="button">
            Submit
        </button>
    </div>

    <!--First Look Buttons: get new card after first look at flashcard -->
    <div id="next-buttons" class="flex-container hidden">
        <button id="next-buttons" class="button">
            First Look Done
        </button>
    </div>

    <!-- Scripts -->
    <script src="js-scripts/data-structures.js"></script>
    <script type="module" src="js-scripts/learn.js"></script>
</body>
</html>