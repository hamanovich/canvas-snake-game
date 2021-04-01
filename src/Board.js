import { randomValue } from './utils';
export default class Board {
  constructor(context, options) {
    this.ctx = context;
    this.options = options;
    this.cells = [];
    this.boardSize = options.boardSize || 15;
    this.gameSize = options?.canvasSize;
  }

  create() {
    this.createCells();
    this.createFood();
  }

  getCell(row, col) {
    return this.cells.find((cell) => cell.row === row && cell.col === col);
  }

  createCells() {
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        this.cells.push(this.createCell(this.options.sprites.cell, row, col));
      }
    }
  }

  createCell(cellSprite, row, col) {
    const cellSize = cellSprite.width + 1;
    const offsetX = (this.gameSize.width - cellSize * this.boardSize) / 2;
    const offsetY = (this.gameSize.height - cellSize * this.boardSize) / 2;
    const cell = {
      row,
      col,
      x: offsetX + cellSize * col,
      y: offsetY + cellSize * row,
    };

    return cell;
  }

  getRandomCell() {
    // TODO: Implement check whether food is on snake
    // const pool = this.cells.filter((cell) => !this.options.isSnakeOnSell(cell));
    return this.cells[randomValue(0, this.cells.length - 1)];
  }

  createFood() {
    const cell = this.getRandomCell();
    cell.hasFood = true;
  }

  render() {
    this.cells.forEach((cell) =>
      this.ctx.drawImage(cell.hasFood ? this.options.sprites.food : this.options.sprites.cell, cell.x, cell.y),
    );
  }
}
