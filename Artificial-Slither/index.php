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
    $aiDifficulty = $_POST["aiDifficulty"];

    // Insert data into the 'players' table with an initial score of 0
    $sql = "INSERT INTO players (player_name, score, ai_difficulty) VALUES ('$playerName', 0, '$aiDifficulty')";

    if ($conn->query($sql) === TRUE) {
        echo "Record added successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>
