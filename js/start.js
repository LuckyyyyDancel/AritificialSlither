document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("start-button");

    startButton.addEventListener("click", () => {
        // Load the options page dynamically
        window.location.href = "options-page.html";
    });
});
