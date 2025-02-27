const startBtn = document.getElementById("startBtn");
const gameScreen = document.getElementById("gameScreen");
const scoreDisplay = document.getElementById("score");
const gameOverScreen = document.getElementById("gameOver");
const finalScoreDisplay = document.getElementById("finalScore");
const playAgainBtn = document.getElementById("playAgain");

// Sound effects
const foodSound = new Audio('sounds/food-eaten.mp3');
const gameOverSound = new Audio('sounds/game-over.mp3');
foodSound.load();
gameOverSound.load();

// Variables
const scale = 20;  // Size of each grid cell
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let direction = "RIGHT";
let gameInterval;
let score = 0;
let gameOver = false;

// Swipe variables for mobile support
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Start game
startBtn.addEventListener("click", () => {
    console.log("Start Button Clicked!");
    startGame();
});
playAgainBtn.addEventListener("click", () => {
    console.log("Play Again Button Clicked!");
    startGame();
});

function startGame() {
    console.log("Game Started");
    gameScreen.classList.remove("hidden");
    gameOverScreen.classList.add("hidden");
    score = 0;
    scoreDisplay.innerText = score;
    snake = [{ x: 10, y: 10 }];
    food = { x: Math.floor(Math.random() * (canvas.width / scale)), y: Math.floor(Math.random() * (canvas.height / scale)) };
    direction = "RIGHT";
    gameOver = false;

    // Start game loop
    gameInterval = setInterval(gameLoop, 100);
}

function gameLoop() {
    if (gameOver) return;

    // Update game state
    let head = { ...snake[0] };
    if (direction === "LEFT") head.x--;
    if (direction === "RIGHT") head.x++;
    if (direction === "UP") head.y--;
    if (direction === "DOWN") head.y++;

    snake.unshift(head);

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.innerText = score;
        food = { x: Math.floor(Math.random() * (canvas.width / scale)), y: Math.floor(Math.random() * (canvas.height / scale)) };
        if (foodSound) foodSound.play();
    } else {
        snake.pop();
    }

    // Check for game over (walls or self-collision)
    if (head.x < 0 || head.x >= canvas.width / scale || head.y < 0 || head.y >= canvas.height / scale || snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y)) {
        gameOver = true;
        gameOverSound.play();
        finalScoreDisplay.innerText = score;
        gameOverScreen.classList.remove("hidden");
        clearInterval(gameInterval);
    }

    // Clear canvas and redraw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
}

function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "lime" : "green"; // Head of the snake is a different color
        ctx.fillRect(segment.x * scale, segment.y * scale, scale, scale);
    });
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * scale, food.y * scale, scale, scale);
}

// Handle ZQSD controls (Z = UP, Q = LEFT, S = DOWN, D = RIGHT)
window.addEventListener("keydown", (event) => {
    if (event.key === "q" && direction !== "RIGHT") direction = "LEFT";  // Q for left
    if (event.key === "z" && direction !== "DOWN") direction = "UP";    // Z for up
    if (event.key === "d" && direction !== "LEFT") direction = "RIGHT";  // D for right
    if (event.key === "s" && direction !== "UP") direction = "DOWN";    // S for down
});

// Handle swipe events on mobile
canvas.addEventListener("touchstart", (e) => {
    // Prevent pull-to-refresh behavior in mobile browsers
    e.preventDefault();
    
    touchStartX = e.changedTouches[0].pageX;
    touchStartY = e.changedTouches[0].pageY;
});

canvas.addEventListener("touchmove", (e) => {
    e.preventDefault(); // Prevent default touch behavior (like scroll or zoom)

    touchEndX = e.changedTouches[0].pageX;
    touchEndY = e.changedTouches[0].pageY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Only detect swipes if the touch movement is more than a certain threshold
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 30 && direction !== "LEFT") {
            direction = "RIGHT";
        } else if (deltaX < -30 && direction !== "RIGHT") {
            direction = "LEFT";
        }
    } else {
        if (deltaY > 30 && direction !== "UP") {
            direction = "DOWN";
        } else if (deltaY < -30 && direction !== "DOWN") {
            direction = "UP";
        }
    }

    // Update touch start for the next move
    touchStartX = touchEndX;
    touchStartY = touchEndY;
});
