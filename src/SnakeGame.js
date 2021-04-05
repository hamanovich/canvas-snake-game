import Board from './Board';
import Snake from './Snake';
import LocalStorage from './utils/storage';
import Firebase from './utils/db';
import Modal from './Modal';

export default class SnakeGame {
  constructor(el, config) {
    this.canvas = document.getElementById(el);
    this.ctx = this.canvas.getContext('2d');
    this.config = {
      bombSize: 1,
      boardSize: 15,
      snakeSpeed: 1,
      ...config,
    };
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
    this.levels = [10, 20, 30, 50];
    this.intervals = { snake: null, bomb: null };
    this.score = 0;
    this.scoreTable = {};
    this.nickname = null;
    this.snakeSpeed = (1000 / (this.config.snakeSpeed * 10)) * 3 || 150;
    this.db = new Firebase();
    this.board = new Board(this.ctx, {
      canvasSize: this.canvasSize,
      boardSize: this.config.boardSize,
      sprites: this.sprites,
      isSnakeOnCell: this.isSnakeOnCell,
    });
    this.snake = new Snake(this.ctx, this.board, { sprites: this.sprites, boardSize: this.config.boardSize });
  }

  setFont() {
    this.ctx.font = '14px Arial';
    this.ctx.fillStyle = '#fff';
  }

  setNickname() {
    this.nickname =
      prompt('Type your nickname, please', JSON.parse(LocalStorage.getJsonItem('snakegame'))?.nickname) || 'anonymous';
    LocalStorage.setItem('snakegame', JSON.stringify({ nickname: this.nickname }));
  }

  start() {
    this.db.initDB();
    this.db.retrieveDataFromDB((table) => {
      this.scoreTable = table;
      new Modal(table);
    });

    this.setNickname();
    this.initDimensions();
    this.setFont();

    this.preload(this.run.bind(this));
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
    this.board.options.isSnakeOnCell = this.isSnakeOnCell.bind(this);
    this.snake.create();
    this.board.createFood();
    this.board.createBomb(this.config.bombSize);

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

      this.ctx.fillText(
        `Score: ${this.score}; Level: ${this.actualLevel() + 1}; Speed: ${this.config.snakeSpeed + this.actualLevel()}`,
        25,
        25,
      );
    });
  }

  update() {
    this.snake.move();
    this.render();

    this.snake.status === 'FAILED' && this.stop();
    this.snake.status === 'EAT' && this.snakeEat();
  }

  updateSnake() {
    this.snakeSpeed -= 25;
    clearInterval(this.intervals.snake);
    this.intervals.snake = setInterval(this.update.bind(this), this.snakeSpeed);
  }

  run() {
    this.create();

    this.intervals.snake = setInterval(this.update.bind(this), this.snakeSpeed);
    this.intervals.bomb = setInterval(() => {
      this.snake.moving && this.board.createBomb(this.config.bombSize);
    }, this.config.bombTimer || 5000);
  }

  async stop() {
    if (!this.mute) {
      this.sounds.bomb.play();
      this.sounds.theme.pause();
    }

    Object.keys(this.intervals).forEach((interval) => clearInterval(this.intervals[interval]));

    await this.db.storeInDB(this.scoreTable, {
      score: this.score,
      nickname: this.nickname,
      level: this.actualLevel(),
      speed: this.actualSpeed(),
    });
    this.db.detach();

    if (window.confirm(`Your result: ${this.score}. Try again?`)) {
      window.location.reload();
    }
  }

  isSnakeOnCell(cell) {
    return this.snake.cells.find((c) => c === cell);
  }

  snakeStart() {
    if (this.mute) return;

    this.sounds.theme.loop = true;
    this.sounds.theme.play();
  }

  snakeEat() {
    ++this.score;

    if (!this.mute) {
      this.sounds.food.play();
    }

    if (this.levels.includes(this.score)) {
      this.updateSnake();
    }

    this.board.createFood();
  }

  actualLevel() {
    if (this.score < this.levels[0]) {
      return 0;
    } else if (this.score >= this.levels[0] && this.score < this.levels[1]) {
      return 1;
    } else if (this.score >= this.levels[1] && this.score < this.levels[2]) {
      return 2;
    } else if (this.score >= this.levels[2] && this.score < this.levels[3]) {
      return 3;
    } else {
      return 4;
    }
  }

  actualSpeed() {
    return this.config.snakeSpeed + this.actualLevel();
  }
}
