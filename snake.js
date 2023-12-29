/* ========== DOM ELEMENTS ========== */

const board = document.getElementById("board");

//
/* ========== CONSTANTS ========== */

const COLORS = { SNAKE: "#03A062", BOARD: "transparent", FOOD: "red" };

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

const COLS = board.clientWidth / 10;
const ROWS = board.clientHeight / 10;
const PIXEL_SIZE = 10;

//
/* ========== VARIABLES ========== */
let snakeSpeed = 10;
let lastRenderTime = 0;
let foods = [];

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

      pixel.addEventListener("click", () => addFood([i, j]));

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

const drawSnake = () => {
  const snakePositions = new Set();

  for (let [x, y] of snake) {
    const position = `${x}_${y}`;
    snakePositions.add(position);
  }

  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      const position = `${i}_${j}`;
      const pixel = pixels.get(position);

      // Check if the pixel is a food pixel
      if (foods.some((food) => food[0] === i && food[1] === j)) {
        continue; // Skip this iteration if the pixel is a food pixel
      }

      pixel.style.backgroundColor = snakePositions.has(position)
        ? COLORS.SNAKE
        : COLORS.BOARD;
    }
  }
};

//
/* ========== SNAKE FUNCTIONS ========== */

const resetSnake = () => {
  snake = [...SNAKE_DEFAULT_POSITION];
  currentDirection = moveRight;
  foods = [];
  snakeSpeed = 10;

  drawSnake();
  drawFood();
};

const grow = () => {
  const tail = [...snake[0]];
  snake.unshift(tail);

  snakeSpeed += 0.5;

  removeFood(snake[snake.length - 1]);
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
  for (let i = 0; i < foods.length; i++) {
    if (head[0] === foods[i][0] && head[1] === foods[i][1]) {
      foods.splice(i, 1);
      return true;
    }
  }

  return false;
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
  }

  snake.shift();
  snake.push(nextHead);
  drawSnake();
  drawFood();
};

const drawFood = () => {
  foods?.forEach((food) => {
    const position = `${food[0]}_${food[1]}`;
    const pixel = pixels.get(position);

    pixel.style.backgroundColor = COLORS.FOOD;
  });
};

const addFood = (pixel) => {
  if (foods.some(([fx, fy]) => fx === pixel[0] && fy === pixel[1])) return;

  foods.push(pixel);
  drawFood();
};

const removeFood = (pixel) => {
  const [px, py] = pixel;
  foods = foods.filter(([fx, fy]) => fx !== px || fy !== py);
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
  });
};

//
/* ========== MAIN ========== */

const main = () => {
  if (typeof window === "undefined" && !window.DOMContentLoaded) return;

  eventListeners();
  initialiseBoard(ROWS, COLS);

  requestAnimationFrame(draw);
};

main();
