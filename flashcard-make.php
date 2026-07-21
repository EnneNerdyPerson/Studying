<!DOCTYPE html>
<header>
    <link href="https://fonts.googleapis.com/css2?family=Tirra:wght@400;500;600;700;800;900&family=Varta:wght@300..700&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="styles/make.css">
</header>
<body>
    <?php
        // Start the session on every page that needs to use it
        session_start();
    ?>
    <div class="header flex-container">
        <div class="flex-container">
            <h1 id="logo" >Logo</h1>
            <!-- data-data="<?php //echo htmlspecialchars($_SESSION['setname']) ?>" -->
            <h2>Flashcard editor</h2>
        </div>
        <div class="flex-container">
            <button id="home-button" class="header-button" onclick="window.location.href='home.php'">Home</button>
            <button class="hidden">New Set</button>
            <h4 class="username-display">Username: <?php echo $_SESSION['username']."<br>" ?></h4>
            <h4 class="hidden" id="userid"><?php echo $_SESSION['userid'] ?></h4>
            <h4 class="hidden" id="numsets"><?php echo $_SESSION['numsets'] ?></h4>
            <h4 class="hidden" id="setname"><?php echo $_SESSION['setname'] ?></h4>
        </div>
    </div>
    <!-- Set Name -->
    <div class="flex-container" id="name-container">
        <label>Set Name: </label>
        <h2 id="set-name">Untitled</h2>
        <button class="button" id="change-set-name">Change Name</button>
    </div>

    <!-- Flash Cards -->
    <form method="post" class="" id="flashcard-maker">
        <div class="flex-container hidden" id="name-change-container">
            <label for="set-name-change">Set Name: </label>
            <input id="set-name-change" 
                type="text" 
                name="set-name-change" 
                placeholder="Untitled-No-Change"
                value="Untitled">
            <button type="button" class="button" id="save-set-name" value="Save" >Save</button>
        </div>
        <!-- onclick="saveNameChange()" -->
        <!-- <div class="flex-container" id="1">
            <div class="flex-item">
                <label for="question[]">Question</label>
                <input name="question[]" type="text" id="q-text-1">
            </div>
            <div class="flex-item">
                <label for="answer[]">Answer</label>
                <input name="answer[]" type="text" id="a-text-1">
            </div>
            <div class="flex-item button-container flex-container" >
                <input 
                    class="button delete" 
                    type="button" 
                    onclick = "deleteCard(this)"
                    name="1" 
                    value="Delete">
            </div>
        </div> -->
        <div id="button-container" class="flex-container">
            <div>
                <button 
                    class="form-button button" 
                    type="button" 
                    id="new-card"
                    >New Card</button>
            </div>
            <div>
                <input class="form-button button" id="finish" type="submit" value="Finish Cards" /> 
            </div>
        </div>
    </form>

    <!-- Scripts -->
    <script src="js-scripts/data-structures.js"></script>
    <script type="module" src="js-scripts/make.js"></script>
</body>