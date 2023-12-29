/* ========== CONSTANTS ========== */
const COLORS = {
  SNAKE: "#03A062",
  BOARD: "transparent",
};

const KEYS = {
  RIGHT: ["ArrowRight", "d"],
  LEFT: ["ArrowLeft", "a"],
  UP: ["ArrowUp", "w"],
  DOWN: ["ArrowDown", "s"],
};

const SNAKE_DEFAULT_POSITION = [
  [0, 0],
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [0, 7],
  [0, 8],
  [0, 9],
];
const SNAKE_SPEED = 10;

/* ========== VARIABLES ========== */
//

const board = document.getElementById("board");

const COLS = board.clientWidth / 10;
const ROWS = board.clientHeight / 10;
const PIXEL_SIZE = 10;

let lastRenderTime = 0;
let isOutOfBounds = false;

const pixels = new Map();

let snake = [...SNAKE_DEFAULT_POSITION];

/* ========== METHODS ========== */
//

function initialiseBoard(rows, cols) {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const pixel = document.createElement(`div`);

      pixel.classList.add(`pixel`);
      pixel.style.cssText = `
      left: ${j * PIXEL_SIZE}px;
      top: ${i * PIXEL_SIZE}px;
      width: ${PIXEL_SIZE}px;
      height: ${PIXEL_SIZE}px;
      `;
      board.appendChild(pixel);

      const position = `${i}_${j}`;
      pixels.set(position, pixel);
    }
  }
}

function drawSnake() {
  const snakePositions = new Set();

  for (let [x, y] of snake) {
    const position = `${x}_${y}`;
    snakePositions.add(position);
  }

  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      const position = `${i}_${j}`;
      const pixel = pixels.get(position);

      pixel.style.backgroundColor = snakePositions.has(position)
        ? `#03A062`
        : `transparent`;
    }
  }
}

const moveRight = ([t, l]) => [t, l + 1];
const moveLeft = ([t, l]) => [t, l - 1];
const moveTop = ([t, l]) => [t - 1, l];
const moveBottom = ([t, l]) => [t + 1, l];

let currentDirection = moveRight;

const resetSnake = () => {
  snake = [...SNAKE_DEFAULT_POSITION];
  currentDirection = moveRight;
  isOutOfBounds = false;
  drawSnake();
};

const checkOutOfBounds = (head) => {
  return head[0] < 0 || head[0] >= ROWS || head[1] < 0 || head[1] >= COLS;
};

const checkCollision = (head) => {
  return snake.some(
    (position) => position[0] === head[0] && position[1] === head[1]
  );
};

function step() {
  const head = snake[snake.length - 1];
  const nextHead = currentDirection(head);

  // Check for out of bounds
  if (checkOutOfBounds(nextHead)) {
    isOutOfBounds = true;
    resetSnake();
    return;
  }

  // Check for collision
  if (checkCollision(nextHead)) {
    isOutOfBounds = true;
    resetSnake();
    return;
  }

  snake.shift();
  snake.push(nextHead);
  drawSnake();
}

function draw(currentTime = 0) {
  const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;

  if (secondsSinceLastRender < 1 / SNAKE_SPEED) {
    requestAnimationFrame(draw);
    return;
  }

  lastRenderTime = currentTime;

  step();
  requestAnimationFrame(draw);
}

function eventListeners() {
  window.addEventListener("keydown", (e) => {
    const lastDirection = currentDirection;

    if (KEYS.RIGHT.includes(e.key) && lastDirection !== moveLeft) {
      currentDirection = moveRight;
    } else if (KEYS.LEFT.includes(e.key) && lastDirection !== moveRight) {
      currentDirection = moveLeft;
    } else if (KEYS.UP.includes(e.key) && lastDirection !== moveBottom) {
      currentDirection = moveTop;
    } else if (KEYS.DOWN.includes(e.key) && lastDirection !== moveTop) {
      currentDirection = moveBottom;
    }
  });
}

/* ========== MAIN ========== */
//

function main() {
  if (typeof window === "undefined" && !window.DOMContentLoaded) return;

  eventListeners();
  initialiseBoard(ROWS, COLS);

  requestAnimationFrame(draw);
}

main();
