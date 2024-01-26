/** AI SNAKE CODE */

// Call the function to generate obstacles when the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    generateObstacles();
});

const playBoard = document.getElementById("play-board-ai");
const aiScoreElement = document.querySelector(".ai-score");
const aiHighScoreElement = document.querySelector(".ai-high-score");
const controls = document.querySelectorAll(".controls i");

const obstacleX = 15;
const obstacleY = 20;


let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let aiScore = 0

// Getting high score from the local storage
let aiHighScore = parseInt(localStorage.getItem("ai-high-score")) || 0;
aiHighScoreElement.innerText = `High Score: ${aiHighScore}`;

const updateFoodPosition = () => {
    // Passing a random 1 - 30 value as food position
    foodX = Math.floor(Math.random() * 35) + 1;
    foodY = Math.floor(Math.random() * 35) + 1;
}

const handleGameOver = () => {
    // Clearing the timer and reloading the page on game over
    clearInterval(setIntervalId);
    alert("Game Over! You Won! Press OK to replay...");
    location.reload();
}

let aiMovementStarted = false;

const changeDirection = e => {
    // Check if AI movement has started
    if (aiMovementStarted) {
        return; // Exit the function, do not change direction
    }

    // Changing velocity value based on key press
    if (!aiMovementStarted) {
        aiMovementStarted = true;
        setIntervalId = setInterval(initGame, 100);
    }

    if (e.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Calling changeDirection on each key click and passing key dataset value as an object
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));


const initGame = () => {
    if (gameOver) return handleGameOver();

    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Generate 20 fixed obstacles
    const obstaclePositions = [
        [5, 5], [7, 12], [9, 28], [13, 17], [16, 8],
        [24, 15], [27, 25], [32, 20], [14, 5], [21, 30]
    ];

    // Add obstacles to the game board
    obstaclePositions.forEach(pos => {
        html += `<div class="obstacle" style="grid-area: ${pos[1]} / ${pos[0]}"></div>`;
    });

    // Checking if the snake hit the food
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]);
        aiScore++;
        aiHighScore = aiScore >= aiHighScore ? aiScore : aiHighScore;
        localStorage.setItem("ai-high-score", aiHighScore); // Use "ai-high-score" as the key
        aiScoreElement.innerText = `Score: ${aiScore}`;
        aiHighScoreElement.innerText = `High Score: ${aiHighScore}`;
    }

    // Updating the snake's head position based on the current velocity
    snakeX += velocityX;
    snakeY += velocityY;

    // Check if the snake hits an obstacle
    const isObstacleHit = obstaclePositions.some(pos => pos[0] === snakeX && pos[1] === snakeY);
    if (isObstacleHit) {
        gameOver = true;
        return handleGameOver();
    }

    // Shifting forward the values of the elements in the snake body by one
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];

    // Checking if the snake's head is out of wall, if so setting gameOver to true
    if (snakeX <= 0 || snakeX > 35 || snakeY <= 0 || snakeY > 35) {
        gameOver = true;
        return handleGameOver();
    }

    // AI-controlled snake movement
    aiMove();

    for (let i = 0; i < snakeBody.length; i++) {
        // Adding a div for each part of the snake's body
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Checking if the snake head hit the body, if so set gameOver to true
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
            return handleGameOver();
        }
    }
    playBoard.innerHTML = html;
}
class Node {
    constructor(x, y, parent) {
        this.x = x;
        this.y = y;
        this.parent = parent;
        this.g = 0; // Cost from start node to current node
        this.h = 0; // Heuristic cost from current node to target node
        this.f = 0; // Total cost (g + h)
    }
}

// A* algorithm implementation
const aStar = () => {
    // Create start and target nodes
    const startNode = new Node(snakeX, snakeY, null);
    const targetNode = new Node(foodX, foodY, null);

    // Initialize open and closed lists
    let openList = [startNode];
    let closedList = [];

    // Helper function to calculate the Manhattan distance heuristic
    const calculateHeuristic = (node, target) => {
        return Math.abs(node.x - target.x) + Math.abs(node.y - target.y);
    };

    while (openList.length > 0) {
        // Find the node with the lowest f cost in the open list
        let currentNode = openList[0];
        for (let i = 1; i < openList.length; i++) {
            if (openList[i].f < currentNode.f || (openList[i].f === currentNode.f && openList[i].h < currentNode.h)) {
                currentNode = openList[i];
            }
        }

        // Move the current node from open list to closed list
        openList = openList.filter(node => node !== currentNode);
        closedList.push(currentNode);

        // Check if we've reached the target node
        if (currentNode.x === targetNode.x && currentNode.y === targetNode.y) {
            let path = [];
            let current = currentNode;
            while (current !== null) {
                path.push(current);
                current = current.parent;
            }
            return path.reverse();
        }

        // Generate neighboring nodes
        const neighbors = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (!(i === 0 && j === 0)) {
                    const neighborX = currentNode.x + i;
                    const neighborY = currentNode.y + j;
                    // Ensure the neighbor is within the grid bounds
                    if (neighborX >= 0 && neighborX < 35 && neighborY >= 0 && neighborY < 35) {
                        // Create a new node for the neighbor
                        const neighborNode = new Node(neighborX, neighborY, currentNode);
                        neighbors.push(neighborNode);
                    }
                }
            }
        }

        // Process each neighbor
        for (const neighbor of neighbors) {
            // Skip if the neighbor is in the closed list or is a wall
            if (closedList.some(node => node.x === neighbor.x && node.y === neighbor.y)) {
                continue;
            }

            // Calculate tentative g cost
            const tentativeG = currentNode.g + 1;

            // Check if the neighbor is already in the open list
            const existingNeighbor = openList.find(node => node.x === neighbor.x && node.y === neighbor.y);
            if (!existingNeighbor || tentativeG < existingNeighbor.g) {
                neighbor.g = tentativeG;
                neighbor.h = calculateHeuristic(neighbor, targetNode);
                neighbor.f = neighbor.g + neighbor.h;

                // Add the neighbor to the open list if it's not already there
                if (!existingNeighbor) {
                    openList.push(neighbor);
                }
            }
        }
    }

    // No path found
    return [];
}

// AI-controlled snake movement function
const aiMove = () => {
    // Calculate the shortest path using A* algorithm
    const path = aStar();

    // If a valid path is found, move the snake towards the next node in the path
    if (path.length > 1) {
        const nextNode = path[1];
        if (nextNode.x > snakeX) {
            velocityX = 1;
            velocityY = 0;
        } else if (nextNode.x < snakeX) {
            velocityX = -1;
            velocityY = 0;
        } else if (nextNode.y > snakeY) {
            velocityX = 0;
            velocityY = 1;
        } else if (nextNode.y < snakeY) {
            velocityX = 0;
            velocityY = -1;
        }
    }
}

updateFoodPosition();
aiScoreElement.innerText = `Score: ${aiScore}`;
aiHighScoreElement.innerText = `High Score: ${aiHighScore}`;
document.addEventListener("keyup", changeDirection);

// Function to change the player's name
const changeName = () => {
    const newName = prompt("Enter your name:");
    if (newName) {
        playerName = newName;
        localStorage.setItem("playerName", playerName);
        userNameText.textContent = playerName;
    }
}



