document.getElementById("start-game-button").addEventListener("click", function () {
    var playerName = document.getElementById("player-name").value;
    var selectedDifficulty = document.getElementById("ai-difficulty").value;

    if (playerName.trim() === "") {
        alert("Please enter your name!");
        return;
    }

    if (selectedDifficulty === "") {
        alert("Please select AI difficulty!");
        return;
    }

    // Set player name and difficulty to local storage
    localStorage.setItem("playerName", playerName);
    localStorage.setItem("aiDifficulty", selectedDifficulty);

    // Redirect to the selected difficulty level page
    var selectedPage = "levels/" + selectedDifficulty + ".html";
    window.location.href = selectedPage;
});

document.getElementById("start-game").addEventListener("click", function () {
    var playerName = document.getElementById("player-name").value.trim();
    localStorage.setItem("playerName", playerName);
    localStorage.setItem("highScore", 0); // Reset high score to zero
    window.location.href = "levels/easy.html";
});
