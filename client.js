const serverUrl = 'ws://localhost:3000';
const websocket = new WebSocket(serverUrl);

websocket.onopen = () => {
    console.log('Connected to WebSocket server');
};

websocket.onmessage = (event) => {
    const gameData = JSON.parse(event.data);
    updateGame(gameData);
};

websocket.onclose = () => {
    console.log('Disconnected from WebSocket server');
};

websocket.onerror = (error) => {
    console.error('WebSocket error:', error);
};

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 10;
const paddleHeight = 100;
const paddleSpeed = 4;

let player1 = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    score: 0,
    up: false,
    down: false
};

let player2 = {
    x: canvas.width - 10 - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    score: 0,
    up: false,
    down: false
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    speedX: 2,
    speedY: 2,
    radius: 5
};

function updateGame(gameData) {
    player1.y = gameData.player1.y;
    player2.y = gameData.player2.y;
    ball.x = gameData.ball.x;
    ball.y = gameData.ball.y;
    player1.score = gameData.player1.score;
    player2.score = gameData.player2.score;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(player1.x, player1.y, paddleWidth, paddleHeight);
    ctx.fillRect(player2.x, player2.y, paddleWidth, paddleHeight);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();

    // Draw scores
    ctx.font = '24px Arial';
    ctx.fillText(player1.score, canvas.width / 2 - 50, 50);
    ctx.fillText(player2.score, canvas.width / 2 + 50, 50);

    requestAnimationFrame(draw);
}

draw();

document.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowUp') {
        player2.up = true;
    } else if (event.code === 'ArrowDown') {
        player2.down = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowUp') {
        player2.up = false;
    } else if (event.code === 'ArrowDown') {
        player2.down = false;
    }
});

function sendPlayerInput() {
    if (player2.up) {
        websocket.send(JSON.stringify({ type: 'playerInput', direction: 'up' }));
    } else if (player2.down) {
        websocket.send(JSON.stringify({ type: 'playerInput', direction: 'down' }));
    }
}

setInterval(sendPlayerInput, 1000 / 60);

