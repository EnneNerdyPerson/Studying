<?php
    // Start the session 
    session_start();

    //update session varaibles
    $_SESSION["setname"] = $_POST["set-name-change"];
    $_SESSION["numsets"] = $_POST["numsets"];
?>