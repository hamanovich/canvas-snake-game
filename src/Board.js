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
    const pool = this.cells.filter((cell) => !cell.type && !this.options.isSnakeOnCell(cell));
    return pool[randomValue(0, pool.length - 1)];
  }

  createCellItem(type) {
    let cell = this.cells.find((c) => c.type === type);

    cell && (cell.type = false);
    cell = this.getRandomCell();
    cell.type = type;
  }

  createFood() {
    this.createCellItem('food');
  }

  createBomb() {
    this.createCellItem('bomb');
  }

  isFoodCell(cell) {
    return cell.type === 'food';
  }

  isBombCell(cell) {
    return cell.type === 'bomb';
  }

  render() {
    this.cells.forEach((cell) =>
      this.ctx.drawImage(cell.type ? this.options.sprites[cell.type] : this.options.sprites.cell, cell.x, cell.y),
    );
  }
}
