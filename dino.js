// Board
let board;
let boardWidth = 850;
let boardHeight = 250;
let context;

// Dino
let dinoWidth = 70;
let dinoHeight = 80;
let dinox = 50;
let dinoy = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x: dinox,
    y: dinoy,
    width: dinoWidth,
    height: dinoHeight,
}

// Reset Button
let btnHeight = 35;
let btnWidth = 50;
let btnx = 400;
let btny = 100;
let btnImg;
let btn = {
    x: btnx,
    y: btny,
    width: btnWidth,
    height: btnHeight
}

// Cactus
let cactusArray = [];

let cactus1width = 34;
let cactus2width = 69;
let cactus3width = 102;

let cactusHeight = 70;
let cactusX = 800;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

// Cactus Moving
let valX = -8; // cactus moving left speed
let valY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = () => {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");

    // Load reset button image
    btnImg = new Image();
    btnImg.src = "img/reset.png";
    btnImg.onload = () => {
        context.drawImage(btnImg, btn.x, btn.y, btn.width, btn.height);
    }

    // Load dino image
    dinoImg = new Image();
    dinoImg.src = "img/dino.png";
    dinoImg.onload = () => {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    // Load cactus images
    cactus1Img = new Image();
    cactus1Img.src = "img/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "img/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "img/cactus3.png";

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000);
    document.addEventListener("keydown", moveDino);
    document.addEventListener("keydown", restartGame);
    board.addEventListener("click", handleClick); // Add event listener for clicking the reset button
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    // Draw dino
    valY += gravity;
    dino.y = Math.min(dino.y + valY, dinoy);
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    // Draw cactus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += valX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            gameOver = true;
            dinoImg.src = "img/dino-dead.png";
            dinoImg.onload = () => {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }
        }
    }

    // Draw score
    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText(score, 5, 20);

    // Draw reset button
    if (gameOver) {
        context.drawImage(btnImg, btn.x, btn.y, btn.width, btn.height);
    }
}

// Move the Dino
function moveDino(e) {
    if (gameOver) {
        return;
    }
    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoy) {
        valY = -10;
    }
}

// Place Cactus
function placeCactus() {
    if (gameOver) {
        return;
    }
    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    }
    let placeCactusChance = Math.random();

    if (placeCactusChance > 0.90) {
        cactus.img = cactus3Img;
        cactus.width = cactus3width;
        cactusArray.push(cactus);
    } else if (placeCactusChance > 0.70) {
        cactus.img = cactus2Img;
        cactus.width = cactus2width;
        cactusArray.push(cactus);
    } else if (placeCactusChance > 0.50) {
        cactus.img = cactus1Img;
        cactus.width = cactus1width;
        cactusArray.push(cactus);
    }
    if (cactusArray.length > 5) {
        cactusArray.shift();
    }
}

// Detect Collision
function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

// Restart the Game
function restartGame(e) {
    if (!gameOver) {
        return;
    }

    if (e.code === "Enter" || e.code === "Space") {
        gameOver = false;
        score = 0;
        dino.x = dinox;
        dino.y = dinoy;
        valY = 0;
        cactusArray = [];
        dinoImg.src = "img/dino.png";

        dinoImg.onload = () => {
            context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
        }
    }
}

// Handle click on the canvas for the reset button
function handleClick(e) {
    const rect = board.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (gameOver && x >= btn.x && x <= btn.x + btn.width && y >= btn.y && y <= btn.y + btn.height) {
        restartGame({ code: "Enter" }); // Simulate Enter key press to restart the game
    }
}
