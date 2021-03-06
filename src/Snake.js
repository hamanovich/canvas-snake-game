export default class Snake {
  constructor(context, board, options) {
    this.ctx = context;
    this.options = options;
    this.board = board;
    this.cells = [];
    this.moving = false;
    this.directions = {
      up: { row: -1, col: 0, angle: 0 },
      down: { row: 1, col: 0, angle: 180 },
      left: { row: 0, col: -1, angle: 270 },
      right: { row: 0, col: 1, angle: 90 },
    };
    this.direction = false;
    this.status = null;
  }

  start(keyCode) {
    if (
      !this.moving &&
      ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyS', 'KeyA', 'KeyD'].includes(keyCode)
    ) {
      this.setStatus('START');
    }

    switch (keyCode) {
      case 'ArrowUp':
      case 'KeyW':
        this.direction = this.directions.up;
        this.moving = true;
        break;
      case 'ArrowDown':
      case 'KeyS':
        this.direction = this.directions.down;
        this.moving = true;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        this.direction = this.directions.left;
        this.moving = true;
        break;

      case 'ArrowRight':
      case 'KeyD':
        this.direction = this.directions.right;
        this.moving = true;
        break;
    }
  }

  create() {
    const { boardSize } = this.options;

    const startCells = [
      { row: boardSize - 2, col: Math.round(boardSize / 2) - 1 },
      { row: boardSize - 1, col: Math.round(boardSize / 2) - 1 },
    ];

    this.direction = this.directions.up;

    for (let startCell of startCells) {
      this.cells.push(this.board.getCell(startCell.row, startCell.col));
    }
  }

  renderHead() {
    const { sprites } = this.options;
    const head = this.cells[0];
    const headSize = sprites.head.width;

    this.ctx.save();
    this.ctx.translate(head.x, head.y);
    this.ctx.translate(headSize / 2, headSize / 2);
    this.ctx.rotate((this.direction.angle * Math.PI) / 180);
    this.ctx.drawImage(sprites.head, -headSize / 2, -headSize / 2);
    this.ctx.restore();
  }

  renderBody() {
    for (let i = 1; i < this.cells.length; i++) {
      this.ctx.drawImage(this.options.sprites.body, this.cells[i].x, this.cells[i].y);
    }
  }

  render() {
    this.renderHead();
    this.renderBody();
  }

  move() {
    if (!this.moving) return;

    const cell = this.getNextCell();

    if (!cell || this.hasCell(cell) || this.board.isBombCell(cell)) {
      this.setStatus('FAILED', false);
    } else {
      this.cells.unshift(cell);

      if (!this.board.isFoodCell(cell)) {
        this.cells.pop();
      } else {
        this.setStatus('EAT');
      }
    }
  }

  getNextCell() {
    const head = this.cells[0];

    const row = head.row + this.direction.row;
    const col = head.col + this.direction.col;

    return this.board.getCell(row, col);
  }

  hasCell(cell) {
    return this.cells.find((c) => c === cell);
  }

  setStatus(type, callback = true) {
    this.status = type;
    callback && setTimeout(() => (this.status = undefined), 0);
  }
}
