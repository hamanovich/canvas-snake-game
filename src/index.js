import './style.css';
import SnakeGame from './SnakeGame';

window.game = new SnakeGame('mycanvas', {
  speed: 150,
  size: 15,
});
window.game.start();
