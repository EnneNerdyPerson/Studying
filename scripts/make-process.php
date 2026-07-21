<!-- php -S localhost:8000 -->

<?php
    // Start the session on every page that needs to use it
    session_start();

    $_SESSION["setname"] = $_POST["set-name-change"];
    $_SESSION['numsets'] = $_POST["numsets"];
    // int)$_SESSION['numsets'] + 1;
?>