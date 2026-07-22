<!DOCTYPE html>
<!--Page for making or editing flashcard sets-->
<header>
    <link href="https://fonts.googleapis.com/css2?family=Tirra:wght@400;500;600;700;800;900&family=Varta:wght@300..700&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="styles/make.css">
</header>
<body>
    <?php
        // Start the session on every page 
        session_start();
    ?>

    <!--Banner header-->
    <div class="header flex-container">
        <!--Logo and Website Name-->
        <div class="flex-container">
            <h1 id="logo" >Logo</h1>
            <h2>Flashcard editor</h2>
        </div>

        <!--Buttons for banner header-->
        <div class="flex-container">
            <!--Button for going back to homepage-->
            <button id="home-button" 
                class="header-button" 
                onclick="window.location.href='home.php'">
                Home
            </button>

            <!--Button for creating a new set-->
            <button class="hidden">New Set</button>

            <!--User name display-->
            <h4 id="username"
                class="username-display"
                data-userid="<?php echo htmlspecialchars($_SESSION['userid']) ?>"
                data-numsets="<?php echo htmlspecialchars($_SESSION['numsets']) ?>"
                data-setname="<?php echo htmlspecialchars($_SESSION['setname']) ?>"
                >Username: <?php echo $_SESSION['username']."<br>" ?>
            </h4>
            
            <!--Debugging information:-->
            <!-- <h4 class="hidden" id="userid"><?php //echo $_SESSION['userid'] ?></h4>
            <h4 class="hidden" id="numsets"><?php //echo $_SESSION['numsets'] ?></h4>
            <h4 class="hidden" id="setname"><?php //echo $_SESSION['setname'] ?></h4> -->
        </div>
    </div>

    <!-- Set Name Elements -->
    <div id="name-container" class="flex-container">
        <!--Displaying the set name-->
        <label>Set Name: </label>
        <h2 id="set-name">Untitled</h2>

        <!--Button for changing the set name-->
        <button id="change-set-name"
            class="button">
            Change Name
        </button>
    </div>

    <!-- Flash Cards Elements (form) -->
    <form method="post" class="" id="flashcard-maker">
        <!--Set Name Change Elements-->
        <div class="flex-container hidden" id="name-change-container">
            <!--New Set Name Input-->
            <label for="set-name-change">Set Name: </label>
            <input id="set-name-change" 
                type="text" 
                name="set-name-change" 
                placeholder="Untitled-No-Change"
                value="Untitled">

            <!--Button for saving name change-->
            <button id="save-set-name" 
                class="button" 
                type="button"   
                >Save</button>
            <!--TODO: add a button to cancel a name change-->
        </div>
        <!--Template for Card Information-->
            <!-- <div class="flex-container" id="1">
                <div class="card-item">
                    <label for="question[]">Question</label>
                    <input name="question[]" type="text">
                </div>
                <div class="card-item">
                    <label for="answer[]">Answer</label>
                    <input name="answer[]" type="text">
                </div>
                <div class="card-item button-container flex-container" >
                    <input 
                        class="button delete-button" 
                        type="button" 
                        name="1" 
                        value="Delete">
                        onclick = "deleteCard(this)"
                </div>
            </div> -->
        <!--Button Container (Finish and New Card)-->
        <div id="button-container" class="flex-container">
            <!--New Card Button: creates a new card-->
            <button id="new-card"
                class="form-button button" 
                type="button" 
                >New Card</button>

            <!--Finish Card Button: finish set (add 
                cards to SQL database)-->
            <input id="finish"
                class="form-button button" 
                type="submit" 
                value="Finish Cards" /> 
        </div>
    </form>

    <!-- Scripts -->
    <script src="js-scripts/data-structures.js"></script>
    <script type="module" src="js-scripts/make.js"></script>
</body>