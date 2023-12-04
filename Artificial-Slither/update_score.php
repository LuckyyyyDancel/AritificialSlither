<?php
$servername = "localhost";
$username = "snake_game_user";
$password = "your_user_password";
$dbname = "snake_game_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $playerName = $_POST["playerName"];
    $newScore = $_POST["newScore"];

    // Update the score in the 'players' table
    $sql = "UPDATE players SET score = $newScore WHERE player_name = '$playerName'";

    if ($conn->query($sql) === TRUE) {
        echo "Score updated successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>
