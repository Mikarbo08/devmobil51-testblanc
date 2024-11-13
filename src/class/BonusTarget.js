import Circle from './Circle.js';

class BonusTarget extends Circle {
    constructor(x, y, r = 40, speed = 0.1, color = 'yellow') {
        super({ x, y, r, speed, color });
    }

    move(deltaTime) {
        this.y += this.speed * deltaTime;
    }
}

export default BonusTarget;