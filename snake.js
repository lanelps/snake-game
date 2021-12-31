/* ========== VARIABLES ========== */
//

const board = document.getElementById('board');

const COLS = board.clientWidth / 10;
const ROWS = board.clientHeight / 10;
const PIXEL_SIZE = 10;

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
    }
  }
}

/* ========== MAIN ========== */
//

function main() {
  if (typeof window === 'undefined' && !window.DOMContentLoaded) return;

  initialiseBoard(ROWS, COLS);
}

main();
