import Board from './Board';
import Snake from './Snake';

export default class SnakeGame {
  constructor(el, config) {
    this.canvas = document.getElementById(el);
    this.ctx = this.canvas.getContext('2d');
    this.config = config;
    this.sprites = { background: null, cell: null, body: null, food: null, head: null, bomb: null };
    this.sounds = { bomb: null, food: null, theme: null };
    this.canvasSize = { width: 0, height: 0 };
    this.mute = config.mute || false;
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
    this.intervals = { snake: null, bomb: null };
    this.score = 0;
    this.board = new Board(this.ctx, {
      canvasSize: this.canvasSize,
      boardSize: this.config.size,
      sprites: this.sprites,
    });
    this.snake = new Snake(this.ctx, this.board, { sprites: this.sprites });
  }

  setFont() {
    this.ctx.font = '20px Arial';
    this.ctx.fillStyle = '#fff';
  }

  start() {
    this.initDimensions();
    this.setFont();

    this.preload(() => {
      this.run();
    });
  }

  preload(callback) {
    let loaded = 0;
    let required = Object.keys(this.sprites).length;

    !this.mute && (required += Object.keys(this.sounds).length);

    let onAssetLoad = () => {
      ++loaded;

      loaded >= required && callback();
    };

    this.preloadImages(onAssetLoad);

    !this.mute && this.preloadSounds(onAssetLoad);
  }

  preloadImages(load) {
    for (let key in this.sprites) {
      this.sprites[key] = new Image();
      this.sprites[key].src = `assets/img/${key}.png`;
      this.sprites[key].addEventListener('load', load);
    }
  }

  preloadSounds(load) {
    for (let key in this.sounds) {
      this.sounds[key] = new Audio();
      this.sounds[key].src = `assets/sound/${key}.mp3`;
      this.sounds[key].addEventListener('canplaythrough', load, { once: true });
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
      this.fitWidth(data);
    } else {
      this.fitHeight(data);
    }

    this.canvas.width = this.canvasSize.width;
    this.canvas.height = this.canvasSize.height;
  }

  fitWidth(data) {
    this.canvasSize.height = Math.round((this.canvasSize.width * data.winHeight) / data.winWidth);
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

  create() {
    this.board.create();
    this.snake.create();

    window.addEventListener('keydown', (evt) => {
      this.snake.start(evt.code);
      this.snake.status === 'START' && this.snakeStart();
    });
  }

  render() {
    window.requestAnimationFrame(() => {
      this.ctx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);
      this.ctx.drawImage(
        this.sprites.background,
        (this.canvasSize.width - this.sprites.background.width) / 2,
        (this.canvasSize.height - this.sprites.background.height) / 2,
      );
      this.board.render();
      this.snake.render();

      this.ctx.fillText(`Score: ${this.score}`, 25, 25);
    });
  }

  update() {
    this.snake.move();
    this.render();

    this.snake.status === 'FAILED' && this.stop();
    this.snake.status === 'EAT' && this.snakeEat();
  }

  run() {
    this.create();

    this.intervals.snake = setInterval(this.update.bind(this), this.config.snakeSpped || 150);
    this.intervals.bomb = setInterval(() => {
      this.snake.moving && this.board.createBomb();
    }, this.config.bombTimer || 3000);
  }

  stop() {
    if (!this.mute) {
      this.sounds.bomb.play();
      this.sounds.theme.pause();
    }

    Object.keys(this.intervals).forEach((interval) => clearInterval(this.intervals[interval]));
    alert('Game Over!');
    window.location.reload();
  }

  snakeStart() {
    if (this.mute) return;

    this.sounds.theme.loop = true;
    this.sounds.theme.play();
  }

  snakeEat() {
    ++this.score;

    if (this.mute) return;

    this.sounds.food.play();
    this.board.createFood();
  }
}
