import './style.css';
import SnakeGame from './SnakeGame';

window.game = new SnakeGame('mycanvas', {
  // snakeSpeed: 150,
  // bombTimer: 2500,
  // size: 15,
  // mute: true
});
window.game.start();
