export default class Snake {
  constructor() {
    this.cells = [];
  }

  create(boardCells) {
    const startCells = [
      {
        row: 7,
        col: 7,
      },
      {
        row: 8,
        col: 7,
      },
    ];

    for (let startCell of startCells) {
      this.cells.push(boardCells.find((cell) => cell.row === startCell.row && cell.col === startCell.col));
    }
  }

  render(ctx, cellSprite) {
    this.cells.forEach((cell) => ctx.drawImage(cellSprite, cell.x, cell.y));
  }
}
