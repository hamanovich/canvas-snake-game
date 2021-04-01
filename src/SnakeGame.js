import Board from './Board';
import Snake from './Snake';

export default class SnakeGame {
  constructor(el = 'mycanvas') {
    this.canvas = document.getElementById(el);
    this.ctx = this.canvas.getContext('2d');
    this.sprites = {
      background: null,
      cell: null,
      body: null,
    };
    this.canvasSize = {
      width: 0,
      height: 0,
    };
    this.dimensions = {
      max: {
        width: 640,
        height: 360,
      },
      min: {
        width: 300,
        height: 300,
      },
    };
  }

  start() {
    this.initDimensions();

    this.preload(() => {
      this.run();
    });
  }

  preload(callback) {
    let loaded = 0;
    const required = Object.keys(this.sprites).length;

    let onAssetLoad = () => {
      ++loaded;

      if (loaded <= required) callback();
    };

    for (let key in this.sprites) {
      this.sprites[key] = new Image();
      this.sprites[key].src = `assets/${key}.png`;
      this.sprites[key].addEventListener('load', onAssetLoad);
    }
  }

  initDimensions() {
    const data = {
      maxWidth: this.dimensions.max.width,
      maxHeight: this.dimensions.max.height,
      minWidth: this.dimensions.min.width,
      minHeight: this.dimensions.min.height,
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    };

    if (data.winWidth / data.winHeight > data.maxWidth / data.maxHeight) {
      {
        this.fitWidth(data);
      }
    } else {
      this.fitHeight(data);
    }

    this.canvas.width = this.canvasSize.width;
    this.canvas.height = this.canvasSize.height;
  }

  fitWidth(data) {
    this.canvasSize.height = Math.round((this.width * data.winHeight) / data.winWidth);
    this.canvasSize.height = Math.min(this.canvasSize.height, data.maxHeight);
    this.canvasSize.height = Math.max(this.canvasSize.height, data.minHeight);

    this.canvasSize.width = Math.round((data.winWidth * this.canvasSize.height) / data.winHeight);
    this.canvas.style.width = '100%';
  }

  fitHeight(data) {
    this.canvasSize.width = Math.round((data.winWidth * data.maxHeight) / data.winHeight);
    this.canvasSize.width = Math.min(this.canvasSize.width, data.maxWidth);
    this.canvasSize.width = Math.max(this.canvasSize.width, data.minWidth);

    this.canvasSize.height = Math.round((this.canvasSize.width * data.winHeight) / data.winWidth);
    this.canvas.style.height = '100%';
  }

  run() {
    const board = new Board({
      canvasSize: this.canvasSize,
    });
    const snake = new Snake();

    board.create(this.sprites.cell);
    snake.create(board.cells);

    window.requestAnimationFrame(() => {
      this.ctx.drawImage(
        this.sprites.background,
        (this.canvasSize.width - this.sprites.background.width) / 2,
        (this.canvasSize.height - this.sprites.background.height) / 2,
      );
      board.render(this.ctx, this.sprites.cell);
      snake.render(this.ctx, this.sprites.body);
    });
  }
}
