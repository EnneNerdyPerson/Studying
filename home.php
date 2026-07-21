<!DOCTYPE html>
<html>
<header>
    <link href="https://fonts.googleapis.com/css2?family=Tirra:wght@400;500;600;700;800;900&family=Varta:wght@300..700&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="styles/home.css">
</header>
<body>
    <?php
    session_start();
    $_SESSION['setname'] = "home-page-set-name";
    ?>
    <div class="header flex-container">
        <div class="flex-container">
            <h1 id="logo">Logo</h1>
            <h2>Flashcard Learning</h2>
        </div>
        <div class="flex-container">
            <button id="home-button" class="header-button">Home</button>
            <button id="newset-button" 
                class="header-button"
                onclick="window.location.href='flashcard-make.php';">
                New Set</button>
            <!-- <button>New Set</button> -->
            <h4 class="username-display">Username: 
                <?php echo $_SESSION['username']."<br>" ?>
            </h4> 
            <h4 class="hidden" id="userid"><?php echo $_SESSION['userid'] ?></h4>
        </div>
    </div>
    <div id="deletion-warning" class="hidden">
        <p id="delete-warn-text">Deletion of set ___ is irreverible</p>
        <p>Would you still like to delete this set?</p>
        <div class="flex-container">
            <button id="yes-delete">Yes</button>
            <button id="no-delete">Cancel</button> 
        </div>
    </div>
    <div id="body">
        <!-- <div class="flex-container">
            <button>New Folder</button>
        </div> -->
    </div>

    <script src="js-scripts/data-structures.js"></script>
    <script type="module" src="js-scripts/home.js"></script>
</body>
</html>