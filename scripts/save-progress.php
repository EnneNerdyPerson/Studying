<?php
    // Start the session
    session_start();

    //set up response type as JSON
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
    $sqlStatus = "completed";

    //save card data as variable for ease of coding
    $card_data = $_POST["carddata"];

    //iterate through each card and its data
    foreach($card_data as $card) {
        //get individual card_id and percent for card
        $array = explode(",", $card);
        $cardid = (int)$array[0];
        $percent = (int)$array[1];

        //create SQL query: update percent for card based on card_id and percent
        $sql = "UPDATE CARD SET percent = ? WHERE set_id = ? AND user_id = ? AND  card_id = ?;";

        //prepare SQL statement on connection
        if($stmt = $conn->prepare($sql)) {
            // bind parameters to prepared statement
            $stmt->bind_param("iiii", $percent, $_POST["setid"], $_POST["userid"], $cardid);
            
            //run SQL statement on connection
            $stmt->execute();
        } else {
            //output error if it appears
            $sqlStatus = "error (".  $sql ."): ". $conn->error;
        }
    }

    //check if favorite information has been sent
    if ($_POST["favorite"] != null) {

        //save favorite array for ease of coding
        $favorites = $_POST["favorite"];

        //iterate through each favorited card
        foreach($favorites as $cardid) {        

            //create SQL query to set card (from card_id) to favorite = TRUE
            $sql = "UPDATE CARD SET favorite=TRUE WHERE set_id = ? AND user_id = ? AND  card_id = ?;";

            //prepare SQL statement on connection
            if($stmt = $conn->prepare($sql)) {
                // bind parameters to prepared statement
                $stmt->bind_param("iii", $_POST["setid"], $_POST["userid"], $cardid);

                //run SQL statement on connection
                $stmt->execute();
            } else {
                //output error if it appears
                $sqlStatus = "error (".  $sql ."): ". $conn->error;
            }
        }
    }
    
    //create SQL query to update the progress of a set
    $sql = "UPDATE FSETS SET progress=? WHERE set_id = ? AND user_id = ?;";

    //prepare SQL statement on connection
    if($stmt = $conn->prepare($sql)) {
        // bind parameters to prepared statement
        $stmt->bind_param("iii", $_POST["totalprogess"], $_POST["setid"], $_POST["userid"]);
        
        //run SQL statement on connection
        $stmt->execute();
    } else {
        //output error if it appears
        $sqlStatus = "error (".  $sql ."): ". $conn->error;
    }

    //close connection
    $stmt->close();
    $conn->close();

    //send connection and status info
    echo json_encode([
        'connect' => "Connection ".$connect,
        'status' => $sqlStatus
    ]);
?>