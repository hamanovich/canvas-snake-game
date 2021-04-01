export default class Board {
  constructor(options) {
    this.cells = [];
    this.boardSize = 15;
    this.gameSize = options?.canvasSize;
  }

  create(cellSprite) {
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        this.cells.push(this.createCell(cellSprite, row, col));
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

  render(ctx, cellSprite) {
    this.cells.forEach((cell) => ctx.drawImage(cellSprite, cell.x, cell.y));
  }
}
