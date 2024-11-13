import Circle from './Circle.js';

class Bullet extends Circle {
    constructor(x, y, angle, r = 3, speed = 0.5, color = 'red') {
        super({ x, y, r, speed, dir: angle, color });
    }

    move(deltaTime) {
        const distX = this.speed * deltaTime * Math.cos(this.dir);
        const distY = this.speed * deltaTime * Math.sin(this.dir);
        this.x += distX;
        this.y += distY;
    }
}

export default Bullet;