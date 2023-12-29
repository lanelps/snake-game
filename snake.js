/* ========== VARIABLES ========== */
//

const board = document.getElementById("board");

const COLS = board.clientWidth / 10;
const ROWS = board.clientHeight / 10;
const PIXEL_SIZE = 10;

const pixels = new Map();

const startingSnake = [
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

function drawSnake(snake) {
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

function step() {
  startingSnake.shift();
  const head = startingSnake[startingSnake.length - 1];
  const nextHead = currentDirection(head);
  startingSnake.push(nextHead);
  drawSnake(startingSnake);
}

function draw() {
  drawSnake(startingSnake);
  setInterval(() => {
    step();
  }, 100);
}

function eventListeners() {
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowRight":
      case "d":
        if (currentDirection === moveLeft) break;
        currentDirection = moveRight;
        break;

      case "ArrowLeft":
      case "a":
        if (currentDirection === moveRight) break;
        currentDirection = moveLeft;
        break;

      case "ArrowUp":
      case "w":
        if (currentDirection === moveBottom) break;
        currentDirection = moveTop;
        break;

      case "ArrowDown":
      case "s":
        if (currentDirection === moveTop) break;
        currentDirection = moveBottom;
        break;

      default:
        break;
    }
  });
}

/* ========== MAIN ========== */
//

function main() {
  if (typeof window === "undefined" && !window.DOMContentLoaded) return;

  eventListeners();
  initialiseBoard(ROWS, COLS);
  draw();
}

main();
