document.addEventListener("DOMContentLoaded", () => {
    // Game elements
    const gameArea = document.querySelector(".game-area");
    const bird = document.querySelector(".bird");
    const gameMessage = document.querySelector(".game-message");
    const scoreDisplay = document.querySelector(".score");
    const highScoreDisplay = document.querySelector(".high-score");
    const scoreMessageDisplay = document.querySelector(".score-message");
  
    // Game variables
    let gameStarted = false;
    let gameOver = false;
    let score = 0;
    let highScore = localStorage.getItem("flappyBirdHighScore") || 0;
    let birdPosition = 250;
    let gravity = 0.1;
    let velocity = 0;
    let jumpPower = -3;
    let pipeGap = 200;
    let pipeInterval;
    let animationFrame;
    let pipes = [];
  
    // Sound effects
    const jumpSound = new Audio();
    jumpSound.src =
      "data:audio/mpeg;base64,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";
    jumpSound.preload = "auto";
  
    const scoreSound = new Audio();
    scoreSound.src =
      "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAEAAABVgANTU1NTU1Q0NDQ0NDUFBQUFBQXl5eXl5ea2tra2trd3d3d3d3goKCgoKCkJCQkJCQnZ2dnZ2dqqqqqqqqt7e3t7e3xMTExMTE0dHR0dHR3d3d3d3d6urq6urq+Pj4+Pj4//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAVhrOb79AAAAAAAAAAAAAAAAAAAA/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxHYAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxLEAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
    scoreSound.preload = "auto";
  
    const hitSound = new Audio();
    hitSound.src =
      "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAEAAABVgANTU1NTU1Q0NDQ0NDUFBQUFBQXl5eXl5ea2tra2trd3d3d3d3goKCgoKCkJCQkJCQnZ2dnZ2dqqqqqqqqt7e3t7e3xMTExMTE0dHR0dHR3d3d3d3d6urq6urq+Pj4+Pj4//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAVg4Lz20AAAAAAAAAAAAAAAAAAAA/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxHYAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxLEAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
    hitSound.preload = "auto";
  
    // Update high score display
    highScoreDisplay.textContent = `High Score: ${highScore}`;
  
    // Add ground element
    const ground = document.createElement("div");
    ground.classList.add("ground");
    gameArea.appendChild(ground);
  
    // Set bird starting position
    function setBirdPosition() {
      bird.style.top = `${birdPosition}px`;
    }
  
    // Bird jump function
    function jump() {
      if (gameOver) return;
      velocity = jumpPower;
  
      // Add flapping animation
      bird.classList.add("flap");
      bird.classList.remove("fall");
  
      // Play jump sound
      jumpSound.currentTime = 0;
      jumpSound.play();
  
      // Remove flap class after animation
      setTimeout(() => {
        bird.classList.remove("flap");
      }, 100);
    }
  
    // Generate pipes function
    function generatePipe() {
      if (gameOver) return;
  
      // Random height for top pipe
      const topPipeHeight = Math.floor(Math.random() * 300) + 50;
  
      // Create top pipe
      const topPipe = document.createElement("div");
      topPipe.classList.add("pipe", "pipe-top");
      topPipe.style.height = `${topPipeHeight}px`;
      topPipe.style.left = "360px";
  
      // Create bottom pipe
      const bottomPipe = document.createElement("div");
      bottomPipe.classList.add("pipe", "pipe-bottom");
      bottomPipe.style.height = `${640 - topPipeHeight - pipeGap}px`;
      bottomPipe.style.left = "360px";
  
      // Add pipes to game area
      gameArea.appendChild(topPipe);
      gameArea.appendChild(bottomPipe);
  
      // Add pipes to array for tracking
      pipes.push({
        top: topPipe,
        bottom: bottomPipe,
        passed: false,
        x: 360,
      });
    }
  
    // Move pipes function
    function movePipes() {
      pipes.forEach((pipe, index) => {
        // Move pipe left
        pipe.x -= 2;
        pipe.top.style.left = `${pipe.x}px`;
        pipe.bottom.style.left = `${pipe.x}px`;
  
        // Check if pipe has passed bird position
        if (pipe.x < 30 && !pipe.passed) {
          pipe.passed = true;
          score++;
          scoreDisplay.textContent = score;
  
          // Play score sound
          scoreSound.currentTime = 0;
          scoreSound.play();
        }
  
        // Remove pipes that have gone off screen
        if (pipe.x < -60) {
          pipes.splice(index, 1);
          gameArea.removeChild(pipe.top);
          gameArea.removeChild(pipe.bottom);
        }
      });
    }
  
    // Check for collisions
    function checkCollision() {
      const birdRect = bird.getBoundingClientRect();
      const groundRect = ground.getBoundingClientRect();
  
      // Check ground collision
      if (birdRect.bottom >= groundRect.top || birdRect.top <= 0) {
        return true;
      }
  
      // Check pipe collisions
      for (let pipe of pipes) {
        const topPipeRect = pipe.top.getBoundingClientRect();
        const bottomPipeRect = pipe.bottom.getBoundingClientRect();
  
        if (
          birdRect.right > topPipeRect.left &&
          birdRect.left < topPipeRect.right &&
          (birdRect.top < topPipeRect.bottom ||
            birdRect.bottom > bottomPipeRect.top)
        ) {
          return true;
        }
      }
  
      return false;
    }
  
    // Game loop
    function gameLoop() {
      // Apply gravity to bird
      velocity += gravity;
      birdPosition += velocity;
  
      // Update bird position
      setBirdPosition();
  
      // Add falling animation if velocity is positive
      if (velocity > 5) {
        bird.classList.add("fall");
        bird.classList.remove("flap");
      } else if (velocity < 0) {
        bird.classList.add("flap");
        bird.classList.remove("fall");
      }
  
      // Move pipes
      movePipes();
  
      // Check for collisions
      if (checkCollision()) {
        endGame();
        return;
      }
  
      // Continue game loop
      animationFrame = requestAnimationFrame(gameLoop);
    }
  
    // Start game function
    function startGame() {
      if (gameStarted || gameOver) return;
  
      gameStarted = true;
      gameMessage.classList.add("hidden");
  
      // Reset bird position
      birdPosition = 250;
      velocity = 0;
      setBirdPosition();
  
      // Reset score
      score = 0;
      scoreDisplay.textContent = score;
  
      // Generate pipes at intervals
      pipeInterval = setInterval(generatePipe, 1500);
  
      // Start game loop
      animationFrame = requestAnimationFrame(gameLoop);
    }
  
    // End game function
    function endGame() {
      gameOver = true;
      clearInterval(pipeInterval);
      cancelAnimationFrame(animationFrame);
  
      // Play hit sound
      hitSound.currentTime = 0;
      hitSound.play();
  
      // Update high score if needed
      if (score > highScore) {
        highScore = score;
        localStorage.setItem("flappyBirdHighScore", highScore);
        highScoreDisplay.textContent = `High Score: ${highScore}`;
      }
  
      // Show game over message
      gameMessage.classList.remove("hidden");
      scoreMessageDisplay.textContent = `Score: ${score}`;
  
      // Add timeout to prevent immediate restart
      setTimeout(() => {
        gameMessage.querySelector("p").textContent =
          "Game Over! Press Space to Restart";
      }, 500);
    }
  
    // Reset game function
    function resetGame() {
      // Clear pipes
      pipes.forEach((pipe) => {
        gameArea.removeChild(pipe.top);
        gameArea.removeChild(pipe.bottom);
      });
      pipes = [];
  
      // Reset game state
      gameOver = false;
      gameStarted = false;
  
      // Reset message
      gameMessage.querySelector("p").textContent = "Press Space to Start";
      scoreMessageDisplay.textContent = "";
    }
  
    // Event listeners
    document.addEventListener("keydown", (event) => {
      if (event.code === "Space") {
        if (!gameStarted) {
          startGame();
        } else if (gameOver) {
          resetGame();
        } else {
          jump();
        }
        // Prevent space from scrolling the page
        event.preventDefault();
      }
    });
  
    // Touch event for mobile
    gameArea.addEventListener("touchstart", (event) => {
      if (!gameStarted) {
        startGame();
      } else if (gameOver) {
        resetGame();
      } else {
        jump();
      }
      // Prevent default touch behavior
      event.preventDefault();
    });
  
    // Initialize bird position
    setBirdPosition();
  });
  