<?php
    //start session
    session_start();

    $servername = "localhost";
    $username = "flashcard_user";
    $password = "FLASH!card12345";
    $dbname = "flashcardData";
    $port = 3306;

    // // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname, $port);

    // Check connection
    $connect = "failed";
    if ($conn->connect_error) {
        // echo json_encode([
        //     'connect' => "Connection failed"
        // ]);
        die("Connection failed: " . $conn->connect_error);
    }
    // echo "<script>alert('Connected successfully');</script>";
    $connect = "sucess";

    //format return response as JSON
    header('Content-Type: application/json; charset=utf-8');

    //check if creating account or log-in
    if ($_POST["password-check"] != null) {     //create account
        //save username
        $user = $_POST["username"];

        //get hash and salt with python script
        $arg1 = escapeshellarg("");                     //first argument for script
        $arg2 = escapeshellarg($_POST["password"]);     //second argument for script

        //execute python script and save
        $output = shell_exec("python3 password.py $arg1 $arg2");

        //separate output into salt and password
        $outputArray = explode(",,,,,", $output);
        $salt = $outputArray[0];
        $pass = $outputArray[1];

        $sql = "INSERT INTO USERS (username, pass, salt, num_sets) VALUES (?,?,?, 0);";

        if($stmt = $conn->prepare($sql)) {
            // Bind parameters
            $stmt->bind_param("sss", $user, $pass, $salt);
            $stmt->execute();
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }

        $sql = "SELECT user_id, num_sets FROM USERS WHERE username = ?;";

        if($stmt = $conn->prepare($sql)) {
            $stmt->bind_param("s", $user);
            $stmt->execute();

            $result = $stmt->get_result();
            $row = $result->fetch_assoc();

            $_SESSION["userid"] = $row["user_id"];
            $_SESSION["numsets"] = $row["num_sets"];
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }

        $_SESSION["username"] = $_POST["username"];

        $stmt->close();
        $conn->close();


        //read number of users and write info to file
        // $filepath = "../database/users.txt";
        // $serverpath = "../database/server.txt";

        // //read from server.txt file (number of users)
        // $reading = fopen($serverpath, 'r');
        // $line = fgets($reading);
        // fclose($reading);

        // $numUsers = (int)$line;

        // //write to users.txt file
        // $append = fopen($filepath, 'a');

        // $file_string = "";

        // //format string to add to users.txt
        // $numUsers++;
        // $num_str = (string)$numUsers;
        // $file_string = $num_str.",".$user.",".$salt.",".$pass;

        // //write to users.txt
        // fwrite($append, $file_string);

        // //close reading file
        // fclose($append);

        // //update number of users to server.txt
        // $writeServer = fopen($serverpath, 'w');
        // fwrite($writeServer, $num_str.PHP_EOL);
        // fclose($writeServer);

        //send sucess message to login-creation.js
        echo json_encode([
            'connect' => "Connection ".$connect,
            'status' => "sucess-creation",
            'message' => "Account creation was a sucess!"
        ]);
        exit;

    } else {    //logging in

        $sql = "SELECT user_id, num_sets, username, pass, salt FROM USERS WHERE username = ?;";

        if($stmt = $conn->prepare($sql)) {
            // Bind parameters
            $stmt->bind_param("s", $_POST["username"]);
            $stmt->execute();

            $result = $stmt->get_result();

            if ($result && ($result->num_rows > 0)) {
                // Loop through each row as an associative array
                while($row = $result->fetch_assoc()) {
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

                            $_SESSION["username"] = $_POST["username"];
                            $_SESSION["userid"] = $row["user_id"];
                            $_SESSION["numsets"] = $row["num_sets"];

                            //send sucess message to login-creation.js
                            echo json_encode([
                                'connect' => "Connection ".$connect,
                                'status' => "sucess-login",
                                'message' => "Log in was a sucess!"
                            ]);
                            exit;
                        } 
                    }
                }
            } else {
                echo "0 results found.";
            }
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }

        $stmt->close();
        $conn->close();

        //read from users.txt to each password matching
        // $filepath = "../database/users.txt";
        // $reading = fopen($filepath, 'r');

        //read through file to check username and password matching
        // if ($reading) {
        //     while (($line = fgets($reading)) !== false) {
        //         //get elements of array --> id,username, salt,password
        //         $line_arr = explode(",", $line);

        //         $user = $line_arr[1];
        //         $salt = $line_arr[2];
        //         $pass = $line_arr[3];
                
        //         //check if file username matches input username
        //         if ($user == $_POST["username"]) {
        //             //save arguments to run python script
        //             $arg1 = escapeshellarg($salt);
        //             $arg2 = escapeshellarg($_POST["password"]);

        //             //run python script and save hash
        //             $output = shell_exec("python3 password.py $arg1 $arg2");

        //             //check if password matches hash
        //             if ($output == $pass) {
        //                 //close file, save username
        //                 fclose($reading);
        //                 $_SESSION['username'] = $_POST["username"];

        //                 //send sucess message to login-creation.js
        //                 echo json_encode([
        //                     'connect' => "Connection ".$connect,
        //                     'status' => "sucess-login",
        //                     'message' => "Log in was a sucess!"
        //                 ]);
        //                 exit;
        //             } 
        //         }
        //     }

        //     //close file
        //     fclose($reading);

        //send failure message to login-creation.js
        echo json_encode([
            'connect' => "Connection ".$connect,
            'status' => 'failure',
            'message' => 'Log in was a failure. Password didn\'t match.'
        ]);
        exit;
    }
?>


<!-- //$command = "node /path/to/your/server.js > /dev/null 2>&1 &"; -->

<!-- // Execute the command
exec($command, $output, $return_var);

if ($return_var === 0) {
    echo "Node.js server command triggered successfully.";
} else {
    echo "Failed to start Node.js server.";
} -->