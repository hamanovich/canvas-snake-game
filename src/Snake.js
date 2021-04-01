export default class Snake {
  constructor(context, board, options) {
    this.ctx = context;
    this.options = options;
    this.board = board;
    this.cells = [];
  }

  create() {
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
      this.cells.push(this.board.getCell(startCell.row, startCell.col));
    }
  }

  render() {
    this.cells.forEach((cell) => this.ctx.drawImage(this.options.sprites.body, cell.x, cell.y));
  }

  move() {
    const cell = this.getNextCell();

    if (cell) {
      this.cells.unshift(cell);
      this.cells.pop();
    }
  }

  getNextCell() {
    const head = this.cells[0];
    const row = head.row - 1;
    const col = head.col;

    return this.board.getCell(row, col);
  }
}
