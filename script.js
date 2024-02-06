const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const CELL_SIZE = 20;
const CANVAS_WIDTH = Math.floor(window.innerWidth / CELL_SIZE) * CELL_SIZE;
const CANVAS_HEIGHT = Math.floor(window.innerHeight / CELL_SIZE) * CELL_SIZE;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const snake = {
    x: 0,
    y: 0,
    dx: CELL_SIZE,
    dy: 0,
    cells: [{x: 0, y: 0}],
    maxCells: 4
};

let food = {
    x: Math.floor(Math.random() * (CANVAS_WIDTH / CELL_SIZE)) * CELL_SIZE,
    y: Math.floor(Math.random() * (CANVAS_HEIGHT / CELL_SIZE)) * CELL_SIZE
};

let gameEnded = false;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    if (snake.x >= canvas.width) {
        snake.x = 0;
    } else if (snake.x < 0) {
        snake.x = canvas.width - CELL_SIZE;
    }

    if (snake.y >= canvas.height) {
        snake.y = 0;
    } else if (snake.y < 0) {
        snake.y = canvas.height - CELL_SIZE;
    }

    snake.cells.unshift({x: snake.x, y: snake.y});

    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    ctx.fillStyle = 'green';
    snake.cells.forEach(cell => {
        ctx.fillRect(cell.x, cell.y, CELL_SIZE, CELL_SIZE);
    });

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, CELL_SIZE, CELL_SIZE);

    if (snake.x === food.x && snake.y === food.y) {
        snake.maxCells++;
        food.x = Math.floor(Math.random() * (CANVAS_WIDTH / CELL_SIZE)) * CELL_SIZE;
        food.y = Math.floor(Math.random() * (CANVAS_HEIGHT / CELL_SIZE)) * CELL_SIZE;
    }

    if (checkCollision()) {
        endGame();
    }

    if (!gameEnded) {
        requestAnimationFrame(draw);
    }
}

function checkCollision() {
    for (let i = 1; i < snake.cells.length; i++) {
        if (snake.cells[i].x === snake.x && snake.cells[i].y === snake.y) {
            return true;
        }
    }
    return false;
}

function endGame() {
    gameEnded = true;
    document.getElementById('message').innerText = "Game Over!";
    document.getElementById('overlay').style.display = 'flex';
}

function resetGame() {
    snake.x = 0;
    snake.y = 0;
    snake.dx = CELL_SIZE;
    snake.dy = 0;
    snake.cells = [{x: 0, y: 0}];
    snake.maxCells = 4;
    food.x = Math.floor(Math.random() * (CANVAS_WIDTH / CELL_SIZE)) * CELL_SIZE;
    food.y = Math.floor(Math.random() * (CANVAS_HEIGHT / CELL_SIZE)) * CELL_SIZE;
    gameEnded = false;
    document.getElementById('overlay').style.display = 'none';
    draw();
}

document.addEventListener('keydown', event => {
    if (event.key === 'ArrowUp' && snake.dy === 0) {
        snake.dy = -CELL_SIZE;
        snake.dx = 0;
    }
    if (event.key === 'ArrowDown' && snake.dy === 0) {
        snake.dy = CELL_SIZE;
        snake.dx = 0;
    }
    if (event.key === 'ArrowLeft' && snake.dx === 0) {
        snake.dx = -CELL_SIZE;
        snake.dy = 0;
    }
    if (event.key === 'ArrowRight' && snake.dx === 0) {
        snake.dx = CELL_SIZE;
        snake.dy = 0;
    }
});

document.getElementById('newGameBtn').addEventListener('click', resetGame);

draw();
