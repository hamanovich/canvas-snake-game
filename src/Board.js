import { randomValue } from './utils/common';

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
    const { boardSize, sprites } = this.options;

    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        this.cells.push(this.createCell(sprites.cell, row, col));
      }
    }
  }

  createCell(cellSprite, row, col) {
    const { canvasSize, boardSize } = this.options;
    const cellSize = cellSprite.width + 1;
    const offsetX = (canvasSize.width - cellSize * boardSize) / 2;
    const offsetY = (canvasSize.height - cellSize * boardSize) / 2;
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
    const { sprites } = this.options;
    
    this.cells.forEach((cell) => this.ctx.drawImage(cell.type ? sprites[cell.type] : sprites.cell, cell.x, cell.y));
  }
}
