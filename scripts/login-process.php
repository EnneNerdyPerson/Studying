<?php
    //start session
    session_start();

    //format return response as JSON
    header('Content-Type: application/json; charset=utf-8');

    //save SQL database connection info
    $servername = "localhost";
    $username = "flashcard_user";       //special user with limited access
    $password = "FLASH!card12345";
    $dbname = "flashcardData";
    $port = 3306;

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname, $port);

    // Check connection
    $connect = "failed";
    if ($conn->connect_error) {
        //stop if connection fails
        die("Connection failed: " . $conn->connect_error);
    } else {
        $connect = "sucess";
    }

    //status of SQL queries
    $sqlStatus = "";

    //check if creating account or log-in
    if ($_POST["password-check"] != null) {     //create account
        //status of SQL queries
        $sqlStatus = "sucess-creation";

        //save username
        $user = $_POST["username"];

        //get hash and salt with python script
        //set up arguments for python script
        $arg1 = escapeshellarg("");                     //first argument for script
        $arg2 = escapeshellarg($_POST["password"]);     //second argument for script

        //execute python script and save
        $output = shell_exec("python3 password.py $arg1 $arg2");

        //separate output into salt and password
        $outputArray = explode(",,,,,", $output);
        $salt = $outputArray[0];
        $pass = $outputArray[1];

        //create SQL query to insert new user into USERS table
        $sql = "INSERT INTO USERS (username, pass, salt, num_sets) VALUES (?,?,?, 0);";

        //prepare SQL statement on connection
        if($stmt = $conn->prepare($sql)) {
            // bind parameters to prepared statement
            //use input username and python output for password and salt
            $stmt->bind_param("sss", $user, $pass, $salt);

            //run SQL statement on connection
            $stmt->execute();
        } else {
            //output error if it appears
            $sqlStatus = "error (".  $sql ."): ". $conn->error;
            // echo "Error: " . $sql . "<br>" . $conn->error;
        }

        //SQL statement to get the user_id and number of sets from user with given username
        $sql = "SELECT user_id, num_sets FROM USERS WHERE username = ?;";

        //prepare SQL statement on connection
        if($stmt = $conn->prepare($sql)) {
            // bind username to prepared statement
            $stmt->bind_param("s", $user);

            //run SQL statement on connection
            $stmt->execute();

            //get and format result of SQL query (user_id, num_sets)
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();

            //save user_id and numsets as SESSION variables
            $_SESSION["userid"] = $row["user_id"];
            $_SESSION["numsets"] = $row["num_sets"];
        } else {
            //output error if it appears
            $sqlStatus = "error (".  $sql ."): ". $conn->error;
        }

        //update session username
        $_SESSION["username"] = $_POST["username"];

        //close connection
        $stmt->close();
        $conn->close();

        //send sucess message to login-creation.js
        echo json_encode([
            'connect' => "Connection ".$connect,
            'status' => $sqlStatus,
            'message' => "Account creation was a sucess!"
        ]);
        exit;

    } else {    //logging in
        //status of SQL queries
        $sqlStatus = "sucess-login";

        //SQL query to get all attributes about user with username input from login.html
        $sql = "SELECT user_id, num_sets, username, pass, salt FROM USERS WHERE username = ?;";

        //prepare SQL statement on connection
        if($stmt = $conn->prepare($sql)) {
            // bind username to prepared statement
            $stmt->bind_param("s", $_POST["username"]);

            //run SQL statement on connection
            $stmt->execute();

            //get and format result of SQL query (user_id, num_sets)
            $result = $stmt->get_result();

            if ($result && ($result->num_rows > 0)) {
                // Loop through each row as an associative array
                while($row = $result->fetch_assoc()) {
                    //check that usernames are the same (sanity check)
                    if ($_POST["username"] == $row["username"]) {
                        //save arguments to run python script
                        $arg1 = escapeshellarg($row["salt"]);
                        $arg2 = escapeshellarg($_POST["password"]);

                        //run python script and save hash
                        $output = shell_exec("python3 password.py $arg1 $arg2");

                        //check if password matches hash
                        if ($output == $row["pass"]) {
                            //close file, save username
                            $stmt->close();
                            $conn->close();

                            //update session variables to given information
                            $_SESSION["username"] = $_POST["username"];
                            $_SESSION["userid"] = $row["user_id"];
                            $_SESSION["numsets"] = $row["num_sets"];

                            //send sucess message to login-creation.js
                            echo json_encode([
                                'connect' => "Connection ".$connect,
                                'status' => $sqlStatus,
                                'message' => "Log in was a sucess!"
                            ]);
                            exit;
                        } 
                    }
                }
            } else {
                //output error if it appears
                $sqlStatus = "0 results found.";
                // echo "0 results found.";
            }
        } else {
            //output error if it appears
            $sqlStatus = "error (".  $sql ."): ". $conn->error;
        }

        //close connection
        $stmt->close();
        $conn->close();

        //send failure message to login-creation.js
        echo json_encode([
            'connect' => "Connection ".$connect,
            'status' => "failure",
            'message' => $sqlStatus
        ]);
        exit;
    }
?>