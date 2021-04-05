import { randomValue } from './utils';

export default class Board {
  constructor(context, options) {
    this.ctx = context;
    this.options = options;
    this.cells = [];
  }

  create() {
    this.createCells();
  }

  getCell(row, col) {
    return this.cells.find((cell) => cell.row === row && cell.col === col);
  }

  createCells() {
    for (let row = 0; row < this.options.boardSize; row++) {
      for (let col = 0; col < this.options.boardSize; col++) {
        this.cells.push(this.createCell(this.options.sprites.cell, row, col));
      }
    }
  }

  createCell(cellSprite, row, col) {
    const cellSize = cellSprite.width + 1;
    const offsetX = (this.options.canvasSize.width - cellSize * this.options.boardSize) / 2;
    const offsetY = (this.options.canvasSize.height - cellSize * this.options.boardSize) / 2;
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

    cell?.type === 'food' && (cell.type = false);
    cell = this.getRandomCell();
    cell.type = type;
  }

  createFood() {
    this.createCellItem('food');
  }

  createBomb(amount = 1) {
    this.removeBombs();

    for (let i = 1; i <= amount; i++) {
      this.createCellItem('bomb');
    }
  }

  removeBombs() {
    this.cells.map((c) => {
      if (c.type === 'bomb') {
        delete c.type;
      }

      return c;
    });
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
