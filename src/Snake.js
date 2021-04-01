export default class Snake {
  constructor(context, board, options) {
    this.ctx = context;
    this.options = options;
    this.board = board;
    this.cells = [];
    this.moving = false;
    this.directions = {
      up: { row: -1, col: 0 },
      down: { row: 1, col: 0 },
      left: { row: 0, col: -1 },
      right: { row: 0, col: 1 },
    };
    this.direction = false;
  }

  start(keyCode) {
    switch (keyCode) {
      case 'ArrowUp':
        this.direction = this.directions.up;
        this.moving = true;
        break;
      case 'ArrowDown':
        this.direction = this.directions.down;
        this.moving = true;
        break;

      case 'ArrowLeft':
        this.direction = this.directions.left;
        this.moving = true;
        break;

      case 'ArrowRight':
        this.direction = this.directions.right;
        this.moving = true;
        break;
    }
  }

  create() {
    const startCells = [
      { row: 7, col: 7 },
      { row: 8, col: 7 },
    ];

    this.direction = this.directions.up;

    for (let startCell of startCells) {
      this.cells.push(this.board.getCell(startCell.row, startCell.col));
    }
  }

  render() {
    this.cells.forEach((cell) => this.ctx.drawImage(this.options.sprites.body, cell.x, cell.y));
  }

  move() {
    if (!this.moving) return;

    const cell = this.getNextCell();

    if (cell) {
      this.cells.unshift(cell);
      this.cells.pop();
    }
  }

  getNextCell() {
    const head = this.cells[0];

    const row = head.row + this.direction.row;
    const col = head.col + this.direction.col;

    return this.board.getCell(row, col);
  }
}
