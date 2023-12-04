
document.addEventListener("DOMContentLoaded", function () {
    const startGameButton = document.getElementById("start-game-button");

    startGameButton.addEventListener("click", () => {
        const playerName = document.getElementById("player-name").value;
        localStorage.setItem("playerName", playerName);
        const aiDifficulty = document.getElementById("ai-difficulty").value;
        localStorage.setItem("ai-difficulty", aiDifficulty);

        if (playerName.trim() === "" || aiDifficulty === "") {
            alert("Please enter a player name and select a difficulty.");
            return;
        }

        // Make an asynchronous request to save_player.php
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "save_player.php", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log(xhr.responseText); // Log the server response
                // Redirect to the game page with the selected AI difficulty
                window.location.href = `game.html?difficulty=${aiDifficulty}`;
            }
        };

        // Send data to the server
        xhr.send(`playerName=${playerName}&aiDifficulty=${aiDifficulty}`);

        window.location.href = `game-page.html?difficulty=${aiDifficulty}`;
    });
});
