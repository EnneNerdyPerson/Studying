<!DOCTYPE html>
<!--Homepage html-->
<html>
<header>
    <link href="https://fonts.googleapis.com/css2?family=Tirra:wght@400;500;600;700;800;900&family=Varta:wght@300..700&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="styles/home.css">
</header>
<body>
    <?php
        //start session
        session_start();

        //set sessions setname to 'null'
        $_SESSION['setname'] = "home-page-set-name";
    ?>

    <!--Banner header-->
    <div class="header flex-container">
        <!--Logo and Website Name-->
        <div class="flex-container">
            <h1 id="logo">Logo</h1>
            <h2>Flashcard Learning</h2>
        </div>

        <!--Buttons for banner header-->
        <div class="flex-container">
            <!--Button to create new set-->
            <button class="header-button"
                onclick="window.location.href='flashcard-make.php';"
                >New Set</button>

            <!--User name display-->
            <h4 id="username"
                class="username-display"
                data-data="<?php echo htmlspecialchars($_SESSION['userid']) ?>"
                >Username: 
                <?php echo $_SESSION['username']."<br>" ?>
            </h4> 

            <!--For debugging-->
            <!-- <h4 class="hidden" id="userid">
                <?php //echo $_SESSION['userid'] ?>
            </h4> -->
        </div>
    </div>

    <!--Deletion warning screen-->
    <div id="deletion-warning" class="hidden">
        <p id="delete-warn-text">
            Deletion of set ___ is irreverible
        </p>
        <p>
            Would you still like to delete this set?
        </p>

        <!--Deletion confromation buttons-->
        <div class="flex-container">
            <button id="yes-delete">Yes</button>
            <button id="no-delete">Cancel</button> 
        </div>
    </div>

    <!--Body of webpage-->
    <div id="body">
    </div>

    <!--Script for webpage-->
    <script src="js-scripts/data-structures.js"></script>
    <script type="module" src="js-scripts/home.js"></script>
</body>
</html>