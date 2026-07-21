<?php
    // Start the session on every page that needs to use it
    session_start();
    header('Content-Type: application/json; charset=utf-8');


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
        die("Connection failed: " . $conn->connect_error);
    }
    // echo "<script>alert('Connected successfully');</script>";
    $connect = "sucess";

    // $stringing = "";

    $card_data = $_POST["carddata"];
    foreach($card_data as $card) {
        $array = explode(",", $card);
        $cardid = (int)$array[0];
        $percent = (int)$array[1];

        // $stringing = $stringing."user_id=".$_POST["userid"].", ";
        // $stringing = $stringing."set_id=".$_POST["setid"].", ";
        // $stringing = $stringing."cardid=".$cardid.", ";
        // $stringing = $stringing."percent=".$percent."|";

        $sql = "UPDATE CARD SET percent = ? WHERE set_id = ? AND user_id = ? AND  card_id = ?;";

        if($stmt = $conn->prepare($sql)) {
            // Bind parameters
            $stmt->bind_param("iiii", $percent, $_POST["setid"], $_POST["userid"], $cardid);
            $stmt->execute();
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }

        // echo "<script>alert('Connected successfully');</script>";
    }

    if ($_POST["favorite"] != null) {
        $favorites = $_POST["favorite"];
        foreach($favorites as $cardid) {        
            $sql = "UPDATE CARD SET favorite=TRUE WHERE set_id = ? AND user_id = ? AND  card_id = ?;";

            if($stmt = $conn->prepare($sql)) {
                // Bind parameters
                $stmt->bind_param("iii", $_POST["setid"], $_POST["userid"], $cardid);
                $stmt->execute();
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
        }
    }
    

    $sql = "UPDATE FSETS SET progress=? WHERE set_id = ? AND user_id = ?;";

    if($stmt = $conn->prepare($sql)) {
       $stmt->bind_param("iii", $_POST["totalprogess"], $_POST["setid"], $_POST["userid"]);
        $stmt->execute();
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $stmt->close();
    $conn->close();

    echo json_encode([
        'connect' => "Connection ".$connect
        // ,
        // 'status' => "".$stringing
    ]);

    // $fileName = "../".$_POST["filepath"];
    // echo $fileName."<br>";
    // echo "<script>console.log(" . $fileName . ");</script>";

    // if (!file_exists($fileName)) {
    //     touch($fileName);
    // }

    // $myfile = fopen($fileName, 'w') or die('Cannot open file: ' . $fileName);

    // fwrite($myfile, $_POST["num-card"].",".$_POST["progress"].PHP_EOL);
    // fwrite($myfile, $_POST["fav"].PHP_EOL);
    // fwrite($myfile, $_POST["card-progress"].PHP_EOL);

    // $card_data = $_POST["card-data"];
    // foreach($card_data as $card) {
    //     fwrite($myfile, $card.PHP_EOL);
    // }

    // fclose($myfile);
    // echo "<script>console.log(" . "'end'" . ");</script>";
?>