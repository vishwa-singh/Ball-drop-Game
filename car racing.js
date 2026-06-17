/*This line selects the HTML element with the class/id . */
const gameArea = document.querySelector('.gameArea');
const car = document.querySelector('.car');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const restartButton = document.getElementById('restartButton');
const gameOverMessage = document.getElementById('gameOver');
const scoreDisplay = document.getElementById('scoreDisplay');
const levelDisplay = document.getElementById('levelDisplay');

let gameActive = false;
let carSpeed = 5;
let ballSpeed = 3;
let increaseSpeedInterval;
let carPosition = { x: window.innerWidth / 2 - car.offsetWidth / 2, y: gameArea.offsetHeight - car.offsetHeight - 20 };
let balls = [];
let numberOfBalls = 5;
const keys = {};

// Score and level variables
let score = 0;
let level = 1;
let scoreIncreaseInterval;
let scorePerSecond = 10; // Points added per second

// Create multiple balls
function initializeBalls() {
    balls.forEach(ballObj => ballObj.element.remove()); // Remove existing balls
    //remove()-- This is a standard DOM method that removes the specified element from the web page.
    balls = [];

   /* Creating New Balls:*/
    for (let i = 0; i < numberOfBalls; i++) {
        let ball = document.createElement('div');
        ball.classList.add('ball');

    /*Determine Ball Position:*/
        let validPosition = false;
        let ballPosition = {};

      /*  Randomly Position Balls:*/
        while (!validPosition) {
            ballPosition.x = Math.random() * (gameArea.offsetWidth - 30); // Ensure balls fit within game area
            ballPosition.y = Math.random() * -600;
            validPosition = !balls.some(otherBall =>
                Math.abs(otherBall.position.x - ballPosition.x) < 50 &&
                Math.abs(otherBall.position.y - ballPosition.y) < 50
            );
        }

        balls.push({ element: ball, position: ballPosition });
        gameArea.appendChild(ball);
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function keyDown(e) {
    keys[e.key] = true;
}

function keyUp(e) {
    keys[e.key] = false;
}

// Function to start the game
function startGame() {
    if (!gameActive) {
        gameActive = true;
        score = 0;
        level = 1;
        updateScore(0); // Initialize score
        updateLevel(1); // Initialize level
        initializeBalls();
        increaseSpeedOverTime();
        startScoreCounter();
        window.requestAnimationFrame(playGame);
        gameOverMessage.classList.remove('show'); // Hide game over message with transition
    }
}

// Function to stop the game
function stopGame() {
    gameActive = false;
    clearInterval(increaseSpeedInterval);
    clearInterval(scoreIncreaseInterval);
    gameOverMessage.classList.add('show'); // Show the game over message
}

// Function to restart the game
function restartGame() {
    stopGame();
    resetGame();
    startGame();
}

function playGame() {
    if (gameActive) {
        moveCar();
        moveBalls();
        detectCollision();
        window.requestAnimationFrame(playGame);
    }
}

function moveCar() {
    if (keys.ArrowLeft && carPosition.x > 0) {
        carPosition.x -= carSpeed;
    }
    if (keys.ArrowRight && carPosition.x < (gameArea.offsetWidth - car.offsetWidth)) {
        carPosition.x += carSpeed;
    }

    car.style.left = carPosition.x + 'px';
}

function moveBalls() {
    balls.forEach(ballObj => {
        ballObj.position.y += ballSpeed;

        if (ballObj.position.y > gameArea.offsetHeight) {
            ballObj.position.y = Math.random() * -600;
            ballObj.position.x = Math.random() * (gameArea.offsetWidth - 30);
        }

        ballObj.element.style.top = ballObj.position.y + 'px';
        ballObj.element.style.left = ballObj.position.x + 'px';
    });
}

// Simple collision detection between car and balls
function detectCollision() {
    balls.forEach(ballObj => {
        const carRect = car.getBoundingClientRect();
        const ballRect = ballObj.element.getBoundingClientRect();

        // Check if the car and ball are overlapping
        if (
            carRect.left < ballRect.left + ballRect.width &&
            carRect.left + carRect.width > ballRect.left &&
            carRect.top < ballRect.top + ballRect.height &&
            carRect.top + carRect.height > ballRect.top
        ) {
            console.log('Collision detected!');
            car.classList.add('crash'); // Add crash animation
            setTimeout(() => car.classList.remove('crash'), 500); // Remove crash animation after 500ms
            stopGame(); // Show game over message
        }
    });
}

// Function to gradually increase speed and difficulty
function increaseSpeedOverTime() {
    increaseSpeedInterval = setInterval(() => {
        carSpeed += 0.5;
        ballSpeed += 0.5;
        console.log('Increasing speed: carSpeed=', carSpeed, 'ballSpeed=', ballSpeed);
    }, 5000); // Increase speed every 5 seconds
}

// Function to start the score counter
function startScoreCounter() {
    scoreIncreaseInterval = setInterval(() => {
        score += scorePerSecond;
        updateScore(score);
        if (score % 100 === 0) {
            increaseLevel();
        }
    }, 1000); // Increase score every second
}

// Function to update the score display
function updateScore(newScore) {
    scoreDisplay.textContent = newScore;
}

// Function to increase the level
function increaseLevel() {
    level++;
    updateLevel(level);
    carSpeed += 1; // Increase speed with level
    ballSpeed += 1;
}

// Function to update the level display
function updateLevel(newLevel) {
    levelDisplay.textContent = newLevel;
}

// Function to reset the game state
function resetGame() {
    gameOverMessage.classList.remove('show'); // Hide game over message with transition
    carPosition = { x: window.innerWidth / 2 - car.offsetWidth / 2, y: gameArea.offsetHeight - car.offsetHeight - 20 };
    car.style.left = carPosition.x + 'px';
    carSpeed = 5; // Reset speeds
    ballSpeed = 3;
    score = 0; // Reset score
    level = 1; // Reset level
    updateScore(score);
    updateLevel(level);
    balls.forEach(ballObj => {
        ballObj.position = { x: Math.random() * (gameArea.offsetWidth - 30), y: Math.random() * -600 };
        ballObj.element.style.left = ballObj.position.x + 'px';
        ballObj.element.style.top = ballObj.position.y + 'px';
    });
}

// Attach buttons to their functions
startButton.addEventListener('click', startGame);
stopButton.addEventListener('click', stopGame);
restartButton.addEventListener('click', restartGame);
