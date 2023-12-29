/* ========== DOM ELEMENTS ========== */

const board = document.getElementById("board");

//
/* ========== CONSTANTS ========== */

const COLORS = {
  SNAKE: {
    START: [0, 255, 0, 1],
    END: [255, 255, 255, 0.3],
  },
  BOARD: [0, 0, 0, 0],
  FOOD: `#BF953F`,
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
];

const COLS = board.clientWidth / 10;
const ROWS = board.clientHeight / 10;
const PIXEL_SIZE = 10;

//
/* ========== VARIABLES ========== */
let snakeSpeed = 10;
let lastRenderTime = 0;
let food = null;
let originalSpeed;
let spacePressed = false;

const pixels = new Map();

let snake = [...SNAKE_DEFAULT_POSITION];

//
/* ========== DIRECTION FUNCTIONS ========== */

const moveRight = ([t, l]) => [t, l + 1];
const moveLeft = ([t, l]) => [t, l - 1];
const moveTop = ([t, l]) => [t - 1, l];
const moveBottom = ([t, l]) => [t + 1, l];

let currentDirection = moveRight;

//
/* ========== BOARD FUNCTIONS ========== */

const initialiseBoard = (rows, cols) => {
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
};

const clearBoard = () => {
  for (let pixel of pixels.values()) {
    pixel.style.background = `rgba(${COLORS.BOARD[0]}, ${COLORS.BOARD[1]}, ${COLORS.BOARD[2]}, ${COLORS.BOARD[3]})`;
  }
};

const drawSnake = () => {
  clearBoard();

  const colorStep = [
    (COLORS.SNAKE.START[0] - COLORS.SNAKE.END[0]) / snake.length,
    (COLORS.SNAKE.START[1] - COLORS.SNAKE.END[1]) / snake.length,
    (COLORS.SNAKE.START[2] - COLORS.SNAKE.END[2]) / snake.length,
    (COLORS.SNAKE.START[3] - COLORS.SNAKE.END[3]) / snake.length,
  ];

  for (let i = 0; i < snake.length; i++) {
    const position = `${snake[i][0]}_${snake[i][1]}`;
    const pixel = pixels.get(position);

    const color = [
      Math.round(COLORS.SNAKE.END[0] + colorStep[0] * i),
      Math.round(COLORS.SNAKE.END[1] + colorStep[1] * i),
      Math.round(COLORS.SNAKE.END[2] + colorStep[2] * i),
      (COLORS.SNAKE.END[3] + colorStep[3] * i).toFixed(2),
    ];

    pixel.style.background = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`;
  }

  drawFood();
};

//
/* ========== SNAKE FUNCTIONS ========== */

const resetSnake = () => {
  snake = [...SNAKE_DEFAULT_POSITION];
  currentDirection = moveRight;
  snakeSpeed = 10;

  generateFood();
  drawSnake();
};

const grow = () => {
  const tail = [...snake[0]];
  snake.unshift(tail);

  snakeSpeed += 0.5;
};

const checkOutOfBounds = (head) => {
  return head[0] < 0 || head[0] >= ROWS || head[1] < 0 || head[1] >= COLS;
};

const checkCollision = (head) => {
  return snake.some(
    (position) => position[0] === head[0] && position[1] === head[1]
  );
};

const checkForFood = (head) => {
  if (head[0] === food[0] && head[1] === food[1]) {
    return true;
  } else {
    return false;
  }
};

const step = () => {
  const head = snake[snake.length - 1];
  const nextHead = currentDirection(head);

  // Check for out of bounds
  if (checkOutOfBounds(nextHead)) {
    resetSnake();
    return;
  }

  // Check for collision
  if (checkCollision(nextHead)) {
    resetSnake();
    return;
  }

  // Check for food
  if (checkForFood(nextHead)) {
    grow();
    generateFood();
  }

  snake.shift();
  snake.push(nextHead);
  drawSnake();
  drawFood();
};

const drawFood = () => {
  const position = `${food[0]}_${food[1]}`;
  const pixel = pixels.get(position);

  pixel.style.background = COLORS.FOOD;
};

const generateFood = () => {
  const x = Math.floor(Math.random() * ROWS);
  const y = Math.floor(Math.random() * COLS);

  if (
    snake.some(([sx, sy]) => sx === x && sy === y) ||
    (x === food?.[0] && y === food?.[1])
  ) {
    generateFood();
    return;
  }

  food = [x, y];
};

//
/* ========== ANIMATION FUNCTIONS ========== */

const draw = (currentTime = 0) => {
  const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;

  if (secondsSinceLastRender < 1 / snakeSpeed) {
    requestAnimationFrame(draw);
    return;
  }

  lastRenderTime = currentTime;

  step();
  requestAnimationFrame(draw);
};

//
/* ========== EVENT LISTENERS ========== */

const eventListeners = () => {
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

    if (e.key === " " && !spacePressed) {
      console.log(`space pressed`);
      spacePressed = true;
      originalSpeed = snakeSpeed;
      snakeSpeed *= 2;
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.key === " ") {
      spacePressed = false;
      snakeSpeed = originalSpeed;
    }
  });
};

//
/* ========== MAIN ========== */

const main = () => {
  if (typeof window === "undefined" && !window.DOMContentLoaded) return;

  eventListeners();
  initialiseBoard(ROWS, COLS);
  generateFood();

  requestAnimationFrame(draw);
};

main();
