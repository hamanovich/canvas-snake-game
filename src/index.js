import './style.css';
import SnakeGame from './SnakeGame';

window.game = new SnakeGame('mycanvas', {
  snakeSpeed: 2,
  size: 15,
  mute: true,
});
window.game.start();
