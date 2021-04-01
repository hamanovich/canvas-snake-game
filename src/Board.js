export default class Board {
  constructor(context, options) {
    this.ctx = context;
    this.options = options;
    this.cells = [];
    this.boardSize = 15;
    this.gameSize = options?.canvasSize;
  }

  create() {
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        this.cells.push(this.createCell(this.options.sprites.cell, row, col));
      }
    }
  }

  getCell(row, col) {
    return this.cells.find((cell) => cell.row === row && cell.col === col);
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

  render() {
    this.cells.forEach((cell) => this.ctx.drawImage(this.options.sprites.cell, cell.x, cell.y));
  }
}
