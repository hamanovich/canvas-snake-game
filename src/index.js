import './style.css';
import SnakeGame from './SnakeGame';

window.game = new SnakeGame('mycanvas', {
  snakeSpeed: 2,
  boardSize: 15,
  bombSize: 2,
  // bombTimer: 5000,
  // mute: true,
});
window.game.start();
