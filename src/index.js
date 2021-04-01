import './style.css';
import SnakeGame from './SnakeGame';

window.game = new SnakeGame('mycanvas', {
    speed: 150
});
window.game.start();
