import Circle from './Circle.js';

class Target extends Circle {
    constructor(x, y, r = 20, speed = 0.1, color = 'green') {
        super({ x, y, r, speed, color });
    }

    move(deltaTime) {
        this.y += this.speed * deltaTime;
    }
}

export default Target;